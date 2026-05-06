import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import fs from "node:fs";
import path from "node:path";
import Stripe from "stripe";
import {
  consumeToken,
  createOrGetFulfillment,
  getFulfillmentBySession,
} from "./store.js";

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

function getAllowedPriceIds() {
  return (process.env.ALLOWED_PRICE_IDS || "")
    .split(",")
    .map((priceId) => priceId.trim())
    .filter(Boolean);
}

function getDownloadUrl(token) {
  return `${publicBaseUrl.replace(/\/$/, "")}/api/download/${token}`;
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

async function fulfillCheckoutSession(sessionId) {
  if (!stripe) {
    if (isLocalCheckoutTestEnabled() && sessionId.startsWith("local_test_")) {
      const fulfillment = await getFulfillmentBySession(sessionId);

      if (!fulfillment) {
        const error = new Error("Local test checkout session not found.");
        error.statusCode = 404;
        throw error;
      }

      return fulfillmentResponse(fulfillment);
    }

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

  return {
    status: session.status,
    paymentStatus: session.payment_status,
    ready: true,
    email: fulfillment.email,
    lineItems: fulfillment.lineItems,
    expiresAt: fulfillment.expiresAt,
    downloadUrl: getDownloadUrl(fulfillment.token),
  };
}

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || clientOrigins.includes(origin)) {
        callback(null, true);
        return;
      }

      callback(new Error("Not allowed by CORS"));
    },
  }),
);

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
  });
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
