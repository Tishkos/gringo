import nodemailer from "nodemailer";
import QRCode from "qrcode";

const DEFAULT_SMTP_PORT = 465;

let transporter = null;

function getSmtpPort() {
  const port = Number.parseInt(process.env.SMTP_PORT || `${DEFAULT_SMTP_PORT}`, 10);
  return Number.isFinite(port) && port > 0 ? port : DEFAULT_SMTP_PORT;
}

function getSmtpSecure(port) {
  if (process.env.SMTP_SECURE) {
    return process.env.SMTP_SECURE === "true";
  }

  return port === 465;
}

function getFromAddress() {
  return process.env.SMTP_FROM || `"Hola Gringo" <${process.env.SMTP_USER}>`;
}

function getMaxDownloadsLabel() {
  const maxDownloads = Number.parseInt(process.env.DOWNLOAD_MAX_DOWNLOADS || "3", 10);
  return Number.isFinite(maxDownloads) && maxDownloads > 0 ? maxDownloads : 3;
}

function formatExpiry(expiresAt) {
  if (!expiresAt) {
    return "before it expires";
  }

  return `before ${new Date(expiresAt).toUTCString()}`;
}

function escapeHtml(value) {
  return String(value || "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function getLineItemLabel(lineItems) {
  const names = (lineItems || [])
    .map((item) => item.productName || item.description)
    .filter(Boolean);

  return names.length > 0 ? names.join(", ") : "Hola Gringo digital album";
}

function getTransporter() {
  if (transporter) {
    return transporter;
  }

  const port = getSmtpPort();

  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port,
    secure: getSmtpSecure(port),
    connectionTimeout: 10000,
    greetingTimeout: 10000,
    socketTimeout: 15000,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  return transporter;
}

export function isDownloadEmailConfigured() {
  return Boolean(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS);
}

export async function sendDownloadEmail({ to, downloadUrl, expiresAt, lineItems }) {
  if (!isDownloadEmailConfigured()) {
    const error = new Error("SMTP email is not configured.");
    error.statusCode = 500;
    throw error;
  }

  if (!to) {
    const error = new Error("No customer email is available for this checkout session.");
    error.statusCode = 400;
    throw error;
  }

  const subject = process.env.DOWNLOAD_EMAIL_SUBJECT || "Your Hola Gringo download is ready";
  const itemLabel = getLineItemLabel(lineItems);
  const maxDownloads = getMaxDownloadsLabel();
  const expiryLabel = formatExpiry(expiresAt);
  const qrCodeBuffer = await QRCode.toBuffer(downloadUrl, {
    errorCorrectionLevel: "M",
    margin: 2,
    scale: 6,
    type: "png",
  });

  const text = [
    "Hola,",
    "",
    "Thank you for your order. Your secure Hola Gringo download backup is ready.",
    "",
    `Download link: ${downloadUrl}`,
    "",
    `This link is only for this purchase and can be used up to ${maxDownloads} times ${expiryLabel}.`,
    "If the checkout page download did not work, open this email and use the link again.",
    "",
    `Order: ${itemLabel}`,
    "",
    "Hola Gringo",
  ].join("\n");

  const html = `
    <div style="margin:0;background:#f6f7f2;padding:28px 0;font-family:Arial,sans-serif;color:#18211a;">
      <div style="max-width:620px;margin:0 auto;background:#ffffff;border:1px solid #d9e4d2;border-radius:14px;overflow:hidden;">
        <div style="background:#187343;padding:24px 28px;color:#ffffff;">
          <div style="font-size:13px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;">Payment complete</div>
          <h1 style="margin:10px 0 0;font-size:28px;line-height:1.15;">Your Hola Gringo download is ready</h1>
        </div>
        <div style="padding:28px;">
          <p style="margin:0 0 18px;font-size:16px;line-height:1.6;">Thank you for your order. This email is your backup in case the checkout page download did not work.</p>
          <p style="margin:0 0 24px;font-size:15px;line-height:1.6;color:#425046;">Order: <strong>${escapeHtml(itemLabel)}</strong></p>
          <p style="margin:0 0 18px;text-align:center;">
            <a href="${escapeHtml(downloadUrl)}" style="display:inline-block;background:#187343;color:#ffffff;text-decoration:none;font-weight:700;border-radius:999px;padding:15px 24px;">Download the album</a>
          </p>
          <p style="margin:0 0 22px;font-size:13px;line-height:1.6;color:#516155;text-align:center;">Or scan this QR code with your phone.</p>
          <p style="margin:0 0 22px;text-align:center;">
            <img src="cid:download-qr" width="192" height="192" alt="Download QR code" style="display:inline-block;border:1px solid #d9e4d2;border-radius:12px;padding:10px;background:#ffffff;" />
          </p>
          <p style="margin:0 0 14px;font-size:14px;line-height:1.6;color:#425046;">This private link is only for this purchase and can be used up to ${maxDownloads} times ${escapeHtml(expiryLabel)}.</p>
          <p style="margin:0;font-size:13px;line-height:1.6;color:#66736a;word-break:break-all;">${escapeHtml(downloadUrl)}</p>
        </div>
      </div>
    </div>
  `;

  await getTransporter().sendMail({
    from: getFromAddress(),
    to,
    replyTo: process.env.DOWNLOAD_EMAIL_REPLY_TO || process.env.SMTP_USER,
    subject,
    text,
    html,
    attachments: [
      {
        filename: "hola-gringo-download-qr.png",
        content: qrCodeBuffer,
        cid: "download-qr",
      },
    ],
  });
}
