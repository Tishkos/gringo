import crypto from "node:crypto";
import { promisify } from "node:util";

const scryptAsync = promisify(crypto.scrypt);
const SESSION_COOKIE = "gringo_admin_session";
const SESSION_MAX_AGE_SECONDS = 8 * 60 * 60;
const PASSWORD_HASH_VERSION = "scrypt";
const SCRYPT_PARAMS = {
  N: 16384,
  r: 8,
  p: 1,
  maxmem: 64 * 1024 * 1024,
};
const SCRYPT_KEY_LENGTH = 64;

let fallbackSessionSecret = null;

function base64UrlEncode(value) {
  return Buffer.from(value).toString("base64url");
}

function base64UrlDecode(value) {
  return Buffer.from(value, "base64url").toString("utf8");
}

function sign(value, secret) {
  return crypto.createHmac("sha256", secret).update(value).digest("base64url");
}

function safeEqual(left, right) {
  const leftBuffer = Buffer.from(String(left));
  const rightBuffer = Buffer.from(String(right));

  if (leftBuffer.length !== rightBuffer.length) {
    return false;
  }

  return crypto.timingSafeEqual(leftBuffer, rightBuffer);
}

function getSessionSecret() {
  if (process.env.ADMIN_SESSION_SECRET) {
    return process.env.ADMIN_SESSION_SECRET;
  }

  if (!fallbackSessionSecret) {
    fallbackSessionSecret = crypto.randomBytes(32).toString("hex");

    if (process.env.NODE_ENV === "production") {
      console.warn("ADMIN_SESSION_SECRET is not set. Admin sessions will reset on restart.");
    }
  }

  return fallbackSessionSecret;
}

function isSecureCookie() {
  if (process.env.ADMIN_COOKIE_SECURE) {
    return process.env.ADMIN_COOKIE_SECURE === "true";
  }

  const publicBaseUrl = process.env.PUBLIC_BASE_URL || "";
  return publicBaseUrl.startsWith("https://");
}

function getCookieValue(request, name) {
  const cookies = request.headers.cookie?.split(";") || [];

  for (const cookie of cookies) {
    const [rawKey, ...rawValue] = cookie.trim().split("=");

    if (rawKey === name) {
      return decodeURIComponent(rawValue.join("="));
    }
  }

  return null;
}

function getAdminEmail() {
  return (process.env.ADMIN_EMAIL || "director@gringo.media").trim().toLowerCase();
}

function isPasswordConfigured() {
  return Boolean(process.env.ADMIN_PASSWORD_HASH || process.env.ADMIN_PASSWORD);
}

function sanitizeSessionEmail(email) {
  return String(email || "").trim().toLowerCase();
}

function parsePasswordHash(encodedHash) {
  const rawHash = String(encodedHash || "");
  const parts = rawHash.includes(":") ? rawHash.split(":") : rawHash.split("$");

  if (parts.length !== 6 || parts[0] !== PASSWORD_HASH_VERSION) {
    throw new Error("Unsupported admin password hash format.");
  }

  const [, n, r, p, salt, hash] = parts;
  const params = {
    N: Number.parseInt(n, 10),
    r: Number.parseInt(r, 10),
    p: Number.parseInt(p, 10),
    maxmem: SCRYPT_PARAMS.maxmem,
  };

  if (!Number.isFinite(params.N) || !Number.isFinite(params.r) || !Number.isFinite(params.p)) {
    throw new Error("Invalid admin password hash parameters.");
  }

  return {
    params,
    salt: Buffer.from(salt, "base64url"),
    hash: Buffer.from(hash, "base64url"),
  };
}

export async function hashPassword(password) {
  if (!password || typeof password !== "string") {
    throw new Error("Password is required.");
  }

  const salt = crypto.randomBytes(16);
  const hash = await scryptAsync(password, salt, SCRYPT_KEY_LENGTH, SCRYPT_PARAMS);

  return [
    PASSWORD_HASH_VERSION,
    SCRYPT_PARAMS.N,
    SCRYPT_PARAMS.r,
    SCRYPT_PARAMS.p,
    salt.toString("base64url"),
    Buffer.from(hash).toString("base64url"),
  ].join(":");
}

async function verifyPasswordHash(password, encodedHash) {
  const { params, salt, hash } = parsePasswordHash(encodedHash);
  const attemptedHash = await scryptAsync(password, salt, hash.length, params);

  if (hash.length !== attemptedHash.length) {
    return false;
  }

  return crypto.timingSafeEqual(hash, attemptedHash);
}

function verifyPlainEnvPassword(password, expectedPassword) {
  return safeEqual(password, expectedPassword);
}

export function getAdminAuthStatus() {
  return {
    email: getAdminEmail(),
    configured: isPasswordConfigured(),
  };
}

export async function verifyAdminCredentials(email, password) {
  if (!isPasswordConfigured()) {
    return false;
  }

  const emailMatches = safeEqual(sanitizeSessionEmail(email), getAdminEmail());

  if (!emailMatches || !password || typeof password !== "string") {
    return false;
  }

  if (process.env.ADMIN_PASSWORD_HASH) {
    return verifyPasswordHash(password, process.env.ADMIN_PASSWORD_HASH);
  }

  return verifyPlainEnvPassword(password, process.env.ADMIN_PASSWORD);
}

export function createAdminSession(email) {
  const payload = JSON.stringify({
    email: sanitizeSessionEmail(email),
    exp: Date.now() + SESSION_MAX_AGE_SECONDS * 1000,
  });
  const encodedPayload = base64UrlEncode(payload);
  const signature = sign(encodedPayload, getSessionSecret());

  return `${encodedPayload}.${signature}`;
}

export function readAdminSession(request) {
  const cookieValue = getCookieValue(request, SESSION_COOKIE);

  if (!cookieValue) {
    return null;
  }

  const [encodedPayload, signature] = cookieValue.split(".");

  if (!encodedPayload || !signature || !safeEqual(signature, sign(encodedPayload, getSessionSecret()))) {
    return null;
  }

  try {
    const payload = JSON.parse(base64UrlDecode(encodedPayload));

    if (!payload.email || payload.exp < Date.now()) {
      return null;
    }

    if (!safeEqual(sanitizeSessionEmail(payload.email), getAdminEmail())) {
      return null;
    }

    return {
      email: sanitizeSessionEmail(payload.email),
    };
  } catch {
    return null;
  }
}

export function setAdminSessionCookie(response, session) {
  response.cookie(SESSION_COOKIE, session, {
    httpOnly: true,
    secure: isSecureCookie(),
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE_SECONDS * 1000,
  });
}

export function clearAdminSessionCookie(response) {
  response.clearCookie(SESSION_COOKIE, {
    httpOnly: true,
    secure: isSecureCookie(),
    sameSite: "lax",
    path: "/",
  });
}

export function requireAdmin(request, response, next) {
  const session = readAdminSession(request);

  if (!session) {
    response.status(401).json({ error: "Admin login required." });
    return;
  }

  request.admin = session;
  next();
}
