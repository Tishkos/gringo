import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import fs from "node:fs";
import path from "node:path";
import Stripe from "stripe";
import { isDownloadEmailConfigured, sendDownloadEmail } from "./email.js";
import {
  claimFulfillmentEmail,
  consumeToken,
  createMarketingQrCodes,
  createOrGetFulfillment,
  getFulfillmentBySession,
  listMarketingQrCodes,
  markFulfillmentEmailFailed,
  markFulfillmentEmailSent,
} from "./store.js";
import {
  clearAdminSessionCookie,
  createAdminSession,
  getAdminAuthStatus,
  readAdminSession,
  requireAdmin,
  setAdminSessionCookie,
  verifyAdminCredentials,
} from "./security.js";

dotenv.config({ path: "server/.env" });
dotenv.config();

const app = express();
const port = Number.parseInt(process.env.PORT || "4242", 10);
const clientOrigins = (process.env.CLIENT_ORIGIN || "http://localhost:5173")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);
const publicBaseUrl = process.env.PUBLIC_BASE_URL || `http://localhost:${port}`;
const stripe = process.env.STRIPE_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SECRET_KEY)
  : null;
const loginAttempts = new Map();
const maxLoginAttempts = 5;
const loginWindowMs = 15 * 60 * 1000;

app.disable("x-powered-by");

function getAllowedPriceIds() {
  return (process.env.ALLOWED_PRICE_IDS || "")
    .split(",")
    .map((priceId) => priceId.trim())
    .filter(Boolean);
}

function getDownloadUrl(token) {
  return `${publicBaseUrl.replace(/\/$/, "")}/api/download/${token}`;
}

function getLoginKey(request) {
  return request.ip || request.socket.remoteAddress || "unknown";
}

function getLoginAttempt(key) {
  const attempt = loginAttempts.get(key);

  if (!attempt || attempt.resetAt < Date.now()) {
    return { failures: 0, resetAt: Date.now() + loginWindowMs };
  }

  return attempt;
}

function recordFailedLogin(key) {
  const attempt = getLoginAttempt(key);
  const updatedAttempt = {
    failures: attempt.failures + 1,
    resetAt: attempt.resetAt,
  };

  loginAttempts.set(key, updatedAttempt);
  return updatedAttempt;
}

function clearLoginAttempt(key) {
  loginAttempts.delete(key);
}

function isLoginBlocked(key) {
  const attempt = getLoginAttempt(key);
  return attempt.failures >= maxLoginAttempts && attempt.resetAt > Date.now();
}

function marketingCodeResponse(record) {
  return {
    token: record.token,
    campaignName: record.campaignName,
    batchId: record.batchId,
    createdAt: record.createdAt,
    expiresAt: record.expiresAt,
    usedAt: record.usedAt,
    downloads: record.downloads,
    maxDownloads: record.maxDownloads,
    downloadUrl: getDownloadUrl(record.token),
  };
}

function marketingCodesResponse(records) {
  const codes = records.map(marketingCodeResponse);

  return {
    codes,
    totals: {
      total: codes.length,
      used: codes.filter((code) => code.downloads >= code.maxDownloads).length,
      available: codes.filter((code) => code.downloads < code.maxDownloads).length,
    },
  };
}

function isLocalCheckoutTestEnabled() {
  return process.env.ENABLE_LOCAL_CHECKOUT_TESTS === "true";
}

function fulfillmentResponse(fulfillment) {
  return {
    status: "complete",
    paymentStatus: "paid",
    ready: true,
    email: fulfillment.email,
    lineItems: fulfillment.lineItems,
    expiresAt: fulfillment.expiresAt,
    maxDownloads: fulfillment.maxDownloads,
    emailDelivery: fulfillment.emailDelivery || null,
    downloadUrl: getDownloadUrl(fulfillment.token),
  };
}

function mapLineItems(session) {
  return (session.line_items?.data || []).map((item) => {
    const product = item.price?.product;

    return {
      description: item.description,
      quantity: item.quantity,
      priceId: item.price?.id,
      productId: typeof product === "string" ? product : product?.id,
      productName: typeof product === "string" ? null : product?.name,
    };
  });
}

function hasAllowedDownload(lineItems) {
  const allowedPriceIds = getAllowedPriceIds();

  if (allowedPriceIds.length === 0) {
    return true;
  }

  return lineItems.some((item) => allowedPriceIds.includes(item.priceId));
}

async function sendFulfillmentEmailIfNeeded(fulfillment) {
  if (!fulfillment.email || !isDownloadEmailConfigured()) {
    return;
  }

  const claimedFulfillment = await claimFulfillmentEmail(fulfillment.sessionId);

  if (!claimedFulfillment) {
    return;
  }

  try {
    await sendDownloadEmail({
      to: claimedFulfillment.email,
      downloadUrl: getDownloadUrl(claimedFulfillment.token),
      expiresAt: claimedFulfillment.expiresAt,
      lineItems: claimedFulfillment.lineItems,
    });
    await markFulfillmentEmailSent(claimedFulfillment.sessionId);
  } catch (error) {
    console.error("Download email failed:", error);
    await markFulfillmentEmailFailed(claimedFulfillment.sessionId, error.message);
  }
}

async function fulfillCheckoutSession(sessionId) {
  if (isLocalCheckoutTestEnabled() && sessionId.startsWith("local_test_")) {
    const fulfillment = await getFulfillmentBySession(sessionId);

    if (!fulfillment) {
      const error = new Error("Local test checkout session not found.");
      error.statusCode = 404;
      throw error;
    }

    await sendFulfillmentEmailIfNeeded(fulfillment);
    return fulfillmentResponse(fulfillment);
  }

  if (!stripe) {
    const error = new Error("STRIPE_SECRET_KEY is not configured.");
    error.statusCode = 500;
    throw error;
  }

  const session = await stripe.checkout.sessions.retrieve(sessionId, {
    expand: ["line_items.data.price.product"],
  });

  if (session.payment_status !== "paid" && session.payment_status !== "no_payment_required") {
    return {
      status: session.status,
      paymentStatus: session.payment_status,
      ready: false,
    };
  }

  const lineItems = mapLineItems(session);

  if (!hasAllowedDownload(lineItems)) {
    const error = new Error("This checkout session does not include a downloadable product.");
    error.statusCode = 403;
    throw error;
  }

  const fulfillment = await createOrGetFulfillment({
    sessionId,
    email: session.customer_details?.email || session.customer_email || null,
    lineItems,
  });

  await sendFulfillmentEmailIfNeeded(fulfillment);

  return {
    status: session.status,
    paymentStatus: session.payment_status,
    ready: true,
    email: fulfillment.email,
    lineItems: fulfillment.lineItems,
    expiresAt: fulfillment.expiresAt,
    maxDownloads: fulfillment.maxDownloads,
    emailDelivery: fulfillment.emailDelivery || null,
    downloadUrl: getDownloadUrl(fulfillment.token),
  };
}

app.use(
  cors({
    credentials: true,
    origin(origin, callback) {
      if (
        !origin ||
        clientOrigins.includes(origin) ||
        origin.startsWith("http://localhost:") ||
        origin.startsWith("http://127.0.0.1:")
      ) {
        callback(null, true);
        return;
      }

      callback(new Error("Not allowed by CORS"));
    },
  }),
);

app.use((request, response, next) => {
  response.setHeader("X-Content-Type-Options", "nosniff");
  response.setHeader("Referrer-Policy", "same-origin");

  if (request.path.startsWith("/api/admin")) {
    response.setHeader("Cache-Control", "no-store");
  }

  next();
});

app.post(
  "/api/stripe/webhook",
  express.raw({ type: "application/json" }),
  async (request, response) => {
    if (!stripe || !process.env.STRIPE_WEBHOOK_SECRET) {
      response.status(500).send("Stripe webhook is not configured.");
      return;
    }

    let event;

    try {
      event = stripe.webhooks.constructEvent(
        request.body,
        request.headers["stripe-signature"],
        process.env.STRIPE_WEBHOOK_SECRET,
      );
    } catch (error) {
      response.status(400).send(`Webhook Error: ${error.message}`);
      return;
    }

    try {
      if (
        event.type === "checkout.session.completed" ||
        event.type === "checkout.session.async_payment_succeeded"
      ) {
        await fulfillCheckoutSession(event.data.object.id);
      }

      response.json({ received: true });
    } catch (error) {
      console.error("Webhook fulfillment failed:", error);
      response.status(error.statusCode || 500).send(error.message);
    }
  },
);

app.use(express.json());

app.get("/api/health", (_request, response) => {
  response.json({
    ok: true,
    downloadFileConfigured: Boolean(process.env.DIGITAL_DOWNLOAD_FILE),
    stripeConfigured: Boolean(stripe),
    webhookConfigured: Boolean(process.env.STRIPE_WEBHOOK_SECRET),
    emailConfigured: isDownloadEmailConfigured(),
  });
});

app.get("/api/admin/session", (request, response) => {
  const session = readAdminSession(request);
  const adminStatus = getAdminAuthStatus();

  response.json({
    authenticated: Boolean(session),
    configured: adminStatus.configured,
    email: session?.email || adminStatus.email,
  });
});

app.post("/api/admin/login", async (request, response) => {
  const key = getLoginKey(request);
  const adminStatus = getAdminAuthStatus();

  if (!adminStatus.configured) {
    response.status(503).json({ error: "Admin password is not configured." });
    return;
  }

  if (isLoginBlocked(key)) {
    response.status(429).json({ error: "Too many login attempts. Try again later." });
    return;
  }

  const isValid = await verifyAdminCredentials(request.body?.email, request.body?.password);

  if (!isValid) {
    recordFailedLogin(key);
    response.status(401).json({ error: "Invalid email or password." });
    return;
  }

  clearLoginAttempt(key);
  setAdminSessionCookie(response, createAdminSession(request.body.email));
  response.json({ authenticated: true, email: adminStatus.email });
});

app.post("/api/admin/logout", (_request, response) => {
  clearAdminSessionCookie(response);
  response.json({ authenticated: false });
});

app.get("/api/admin/marketing-qr-codes", requireAdmin, async (_request, response) => {
  const records = await listMarketingQrCodes();
  response.json(marketingCodesResponse(records));
});

app.post("/api/admin/marketing-qr-codes", requireAdmin, async (request, response) => {
  const quantity = Number.parseInt(request.body?.quantity, 10);
  const campaignName = String(request.body?.campaignName || "").trim();

  if (!Number.isFinite(quantity) || quantity < 1 || quantity > 100) {
    response.status(400).json({ error: "Quantity must be between 1 and 100." });
    return;
  }

  if (!campaignName) {
    response.status(400).json({ error: "Campaign name is required." });
    return;
  }

  const records = await createMarketingQrCodes({
  campaignName,
  quantity,
  createdBy: request.admin.email,
  });

  response.status(201).json(marketingCodesResponse(records));
});

app.post("/api/dev/create-checkout-test", async (_request, response) => {
  if (!isLocalCheckoutTestEnabled()) {
    response.status(404).json({ error: "Local checkout testing is disabled." });
    return;
  }

  const sessionId = `local_test_${Date.now()}`;
  const fulfillment = await createOrGetFulfillment({
    sessionId,
    email: "local-test@holagringo.media",
    lineItems: [{ description: "Digital Download", quantity: 1, priceId: "local_test_price" }],
  });

  response.json({
    sessionId,
    successUrl: `${clientOrigins[0] || "http://localhost:5173"}/checkout/success?session_id=${sessionId}`,
    ...fulfillmentResponse(fulfillment),
  });
});

app.get("/api/checkout/session/:sessionId", async (request, response) => {
  try {
    const result = await fulfillCheckoutSession(request.params.sessionId);

    if (!result.ready) {
      response.status(402).json(result);
      return;
    }

    response.json(result);
  } catch (error) {
    console.error("Checkout lookup failed:", error);
    response.status(error.statusCode || 500).json({ error: error.message });
  }
});

app.get("/api/download/:token", async (request, response) => {
  const filePath = path.resolve(
    process.cwd(),
    process.env.DIGITAL_DOWNLOAD_FILE || "private-downloads/la-inoficial-digital.zip",
  );

  if (!fs.existsSync(filePath)) {
    response.status(503).send("Download file is not available yet.");
    return;
  }

  try {
    await consumeToken(request.params.token);
    response.setHeader("Cache-Control", "private, no-store");
    response.download(
      filePath,
      process.env.DOWNLOAD_FILE_NAME || "La Inoficial - Digital Album.zip",
    );
  } catch (error) {
    response.status(error.statusCode || 500).send(error.message);
  }
});

const distPath = path.resolve(process.cwd(), "dist");
const indexPath = path.join(distPath, "index.html");

if (fs.existsSync(indexPath)) {
  app.use(express.static(distPath));
  app.get(/.*/, (_request, response) => {
    response.sendFile(indexPath);
  });
}

app.listen(port, () => {
  console.log(`Stripe download server running on ${publicBaseUrl}`);
});
