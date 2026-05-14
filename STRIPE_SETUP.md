# Stripe Buying And One-Time Download Setup

## 1. Add the public Payment Link URLs

Create `.env.local` from `.env.example` and paste the three Stripe Payment Link URLs:

```text
VITE_STRIPE_DIGITAL_PAYMENT_LINK=https://buy.stripe.com/test_aFacN4fKKeUGc0m5rb4F200
VITE_STRIPE_CD_PAYMENT_LINK=https://buy.stripe.com/test_8x2cN4fKKfYK1lI3j34F201
VITE_STRIPE_VINYL_PAYMENT_LINK=https://buy.stripe.com/test_8x2aEWbuu8wi8Oa1aV4F202
VITE_API_BASE_URL=http://localhost:4242
```

Restart Vite after editing `.env.local`.

## 2. Configure each Stripe Payment Link

In Stripe Dashboard, open each Payment Link:

1. Go to the **After Payment** tab.
2. Select **Don't show confirmation page**.
3. Redirect customers to:

```text
https://holagringo.media/checkout/success?session_id={CHECKOUT_SESSION_ID}
```

For local testing with a tunnel, use your tunnel URL:

```text
https://your-tunnel-url.ngrok-free.app/checkout/success?session_id={CHECKOUT_SESSION_ID}
```

## 3. Add the private album ZIP

Put the digital album ZIP on the server at:

```text
private-downloads/la-inoficial-digital.zip
```

Do not put paid music in `public/`, because public files are accessible without payment.

## 4. Configure the server

Create `server/.env` from `server/.env.example`:

```text
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
CLIENT_ORIGIN=http://localhost:5173
PUBLIC_BASE_URL=http://localhost:4242
PORT=4242
ALLOWED_PRICE_IDS=price_digital,price_cd,price_vinyl
DIGITAL_DOWNLOAD_FILE=private-downloads/la-inoficial-digital.zip
DOWNLOAD_FILE_NAME=Hola Gringo - Digital Album.zip
DOWNLOAD_TOKEN_TTL_HOURS=168
DOWNLOAD_MAX_DOWNLOADS=3
ENABLE_LOCAL_CHECKOUT_TESTS=false
SMTP_HOST=mail.spacemail.com
SMTP_PORT=465
SMTP_SECURE=true
SMTP_USER=info@holagringo.media
SMTP_PASS=your_email_password
SMTP_FROM="Hola Gringo <info@holagringo.media>"
DOWNLOAD_EMAIL_REPLY_TO=info@holagringo.media
DOWNLOAD_EMAIL_SUBJECT=Your Hola Gringo download is ready
```

Add all Stripe Price IDs that should receive the digital download. Include CD and Vinyl if those products include instant digital download.

`DOWNLOAD_MAX_DOWNLOADS=3` gives each paid customer a small backup allowance if the first download fails. The link still expires after `DOWNLOAD_TOKEN_TTL_HOURS`.

The SMTP settings send the same private backup link and QR code to the Stripe customer email. Keep `SMTP_PASS` only in `server/.env` or `.env.production`; do not commit it.

## 5. Run locally

Terminal 1:

```powershell
npm.cmd run dev
```

Terminal 2:

```powershell
npm.cmd run server
```

For local Stripe webhook testing, use the Stripe CLI:

```powershell
stripe listen --forward-to localhost:4242/api/stripe/webhook
```

Copy the `whsec_...` value into `server/.env`.

## 6. Create the production webhook

In Stripe Dashboard, create a webhook endpoint:

```text
https://holagringo.media/api/stripe/webhook
```

Listen for:

```text
checkout.session.completed
checkout.session.async_payment_succeeded
```

## Flow

1. Customer clicks **Buy Now**.
2. Stripe opens the Payment Link.
3. After payment, Stripe redirects back to `/checkout/success?session_id=...`.
4. The server verifies the Checkout Session with Stripe.
5. The server creates a private expiring download token.
6. The server emails the same backup link and QR code to the Stripe customer email.
7. The success page shows a QR code and download button.
8. The token is limited by `DOWNLOAD_MAX_DOWNLOADS` and expires after `DOWNLOAD_TOKEN_TTL_HOURS`.
