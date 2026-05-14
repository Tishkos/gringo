import crypto from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";

const storePath = path.resolve(
  process.cwd(),
  process.env.DOWNLOAD_STORE_PATH || "server/data/download-tokens.json",
);

async function readStore() {
  try {
    const raw = await fs.readFile(storePath, "utf8");
    return JSON.parse(raw);
  } catch (error) {
    if (error.code === "ENOENT") {
      return { sessions: {}, tokens: {} };
    }

    throw error;
  }
}

async function writeStore(store) {
  await fs.mkdir(path.dirname(storePath), { recursive: true });
  await fs.writeFile(storePath, JSON.stringify(store, null, 2));
}

function createToken() {
  return crypto.randomBytes(32).toString("hex");
}

function createExpiry() {
  const ttlHours = Number.parseInt(process.env.DOWNLOAD_TOKEN_TTL_HOURS || "168", 10);
  return new Date(Date.now() + ttlHours * 60 * 60 * 1000).toISOString();
}

function getMaxDownloads() {
  const maxDownloads = Number.parseInt(process.env.DOWNLOAD_MAX_DOWNLOADS || "3", 10);
  return Number.isFinite(maxDownloads) && maxDownloads > 0 ? maxDownloads : 3;
}

function emptyEmailDelivery() {
  return {
    pendingAt: null,
    sentAt: null,
    failedAt: null,
    error: null,
  };
}

function getTokenRecord(store, fulfillment) {
  return fulfillment?.token ? store.tokens[fulfillment.token] : null;
}

function updateEmailDelivery(store, sessionId, updater) {
  const fulfillment = store.sessions[sessionId];

  if (!fulfillment) {
    return null;
  }

  fulfillment.emailDelivery = {
    ...emptyEmailDelivery(),
    ...(fulfillment.emailDelivery || {}),
  };

  updater(fulfillment.emailDelivery);

  const tokenRecord = getTokenRecord(store, fulfillment);

  if (tokenRecord) {
    tokenRecord.emailDelivery = {
      ...emptyEmailDelivery(),
      ...(tokenRecord.emailDelivery || {}),
      ...fulfillment.emailDelivery,
    };
  }

  return fulfillment;
}

export async function createOrGetFulfillment({ sessionId, email, lineItems }) {
  const store = await readStore();

  if (store.sessions[sessionId]) {
    return store.sessions[sessionId];
  }

  const token = createToken();
  const createdAt = new Date().toISOString();
  const expiresAt = createExpiry();

  const fulfillment = {
    sessionId,
    token,
    email,
    lineItems,
    createdAt,
    expiresAt,
    maxDownloads: getMaxDownloads(),
    emailDelivery: emptyEmailDelivery(),
  };

  store.sessions[sessionId] = fulfillment;
  store.tokens[token] = {
    sessionId,
    email,
    lineItems,
    downloads: 0,
    maxDownloads: fulfillment.maxDownloads,
    createdAt,
    expiresAt,
    usedAt: null,
    emailDelivery: emptyEmailDelivery(),
  };

  await writeStore(store);
  return fulfillment;
}

export async function getFulfillmentBySession(sessionId) {
  const store = await readStore();
  return store.sessions[sessionId] || null;
}

export async function claimFulfillmentEmail(sessionId) {
  const store = await readStore();
  let claimed = false;
  const fulfillment = updateEmailDelivery(store, sessionId, (emailDelivery) => {
    if (emailDelivery.sentAt || emailDelivery.pendingAt) {
      return;
    }

    emailDelivery.pendingAt = new Date().toISOString();
    emailDelivery.failedAt = null;
    emailDelivery.error = null;
    claimed = true;
  });

  if (!fulfillment || !claimed) {
    return null;
  }

  await writeStore(store);
  return fulfillment;
}

export async function markFulfillmentEmailSent(sessionId) {
  const store = await readStore();
  const sentAt = new Date().toISOString();
  const fulfillment = updateEmailDelivery(store, sessionId, (emailDelivery) => {
    emailDelivery.pendingAt = null;
    emailDelivery.sentAt = sentAt;
    emailDelivery.failedAt = null;
    emailDelivery.error = null;
  });

  if (!fulfillment) {
    return null;
  }

  await writeStore(store);
  return fulfillment;
}

export async function markFulfillmentEmailFailed(sessionId, errorMessage) {
  const store = await readStore();
  const failedAt = new Date().toISOString();
  const fulfillment = updateEmailDelivery(store, sessionId, (emailDelivery) => {
    emailDelivery.pendingAt = null;
    emailDelivery.failedAt = failedAt;
    emailDelivery.error = errorMessage;
  });

  if (!fulfillment) {
    return null;
  }

  await writeStore(store);
  return fulfillment;
}

export async function consumeToken(token) {
  const store = await readStore();
  const record = store.tokens[token];

  if (!record) {
    const error = new Error("Download link not found.");
    error.statusCode = 404;
    throw error;
  }

  if (new Date(record.expiresAt).getTime() < Date.now()) {
    const error = new Error("Download link expired.");
    error.statusCode = 410;
    throw error;
  }

  if (record.downloads >= record.maxDownloads) {
    const error = new Error("Download link already used.");
    error.statusCode = 410;
    throw error;
  }

  record.downloads += 1;
  record.usedAt = new Date().toISOString();

  await writeStore(store);
  return record;
}
