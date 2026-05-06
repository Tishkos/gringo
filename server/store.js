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
  };

  store.sessions[sessionId] = fulfillment;
  store.tokens[token] = {
    sessionId,
    email,
    lineItems,
    downloads: 0,
    maxDownloads: 1,
    createdAt,
    expiresAt,
    usedAt: null,
  };

  await writeStore(store);
  return fulfillment;
}

export async function getFulfillmentBySession(sessionId) {
  const store = await readStore();
  return store.sessions[sessionId] || null;
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
