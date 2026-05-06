# What Is Left To Launch Hola Gringo

This file is the launch checklist for the Stripe + Docker version.

## Very Important Security Note

Do not commit Stripe secret keys to GitHub.

If a secret key was pasted into chat, GitHub, screenshots, Discord, email, or anywhere public/shared, rotate it in Stripe:

1. Stripe Dashboard
2. Developers
3. API keys
4. Roll / rotate the exposed secret key
5. Use the new secret only in `.env`, `.env.production`, Docker secrets, or your hosting provider secret settings

The frontend does not need the Stripe secret key.

## Already Done

- Stripe Payment Link redirect was configured to:

```text
https://holagringo.media/checkout/success?session_id={CHECKOUT_SESSION_ID}
```

- Payment Link buttons are wired in the app.
- Success page exists at `/checkout/success`.
- QR code download page exists.
- One-time download backend exists.
- Docker files exist:

```text
Dockerfile
compose.yaml
.dockerignore
.env.production.example
```

- Local ZIP exists:

```text
private-downloads/la-inoficial-digital.zip
```

## 1. Fill Production Environment

Create this file on the server:

```text
.env.production
```

Use `.env.production.example` as the template.

Fill these values:

```text
VITE_STRIPE_DIGITAL_PAYMENT_LINK=your_digital_payment_link
VITE_STRIPE_CD_PAYMENT_LINK=your_cd_payment_link
VITE_STRIPE_VINYL_PAYMENT_LINK=your_vinyl_payment_link
VITE_API_BASE_URL=

CLIENT_ORIGIN=https://holagringo.media
PUBLIC_BASE_URL=https://holagringo.media

STRIPE_SECRET_KEY=sk_test_or_sk_live_new_rotated_key
STRIPE_WEBHOOK_SECRET=whsec_from_stripe_webhook
ALLOWED_PRICE_IDS=price_digital,price_cd,price_vinyl

DOWNLOAD_FILE_NAME=Hola Gringo - Digital Album.zip
DOWNLOAD_TOKEN_TTL_HOURS=168
```

For production, keep this blank:

```text
VITE_API_BASE_URL=
```

That means the website calls the API on the same domain:

```text
https://holagringo.media/api/...
```

## 2. Find The Stripe Price IDs

`ALLOWED_PRICE_IDS` must use Stripe Price IDs, not Payment Link URLs.

Find them here:

1. Stripe Dashboard
2. Product catalog
3. Open Digital Download
4. Copy the Price ID, usually starts with `price_`
5. Repeat for CD and Vinyl if they include the instant digital download

Example:

```text
ALLOWED_PRICE_IDS=price_123Digital,price_456CD,price_789Vinyl
```

Minimum:

```text
ALLOWED_PRICE_IDS=price_digital_only
```

Use CD and Vinyl too only if buyers of those formats should also get the digital ZIP.

## 3. Create The Stripe Webhook

In Stripe Dashboard:

1. Developers
2. Webhooks
3. Add endpoint
4. Endpoint URL:

```text
https://holagringo.media/api/stripe/webhook
```

5. Select events:

```text
checkout.session.completed
checkout.session.async_payment_succeeded
```

6. Save
7. Copy the signing secret, starts with `whsec_`
8. Put it into `.env.production`:

```text
STRIPE_WEBHOOK_SECRET=whsec_...
```

## 4. Put The Album ZIP On The Server

The album ZIP must be on the server at:

```text
private-downloads/la-inoficial-digital.zip
```

Do not put it in:

```text
public/
dist/
GitHub
```

Paid files must stay private.

## 5. Start Docker

Start Docker Desktop first.

Then run:

```powershell
docker compose --env-file .env.production up -d --build
```

Check the container:

```powershell
docker compose --env-file .env.production ps
```

Check logs:

```powershell
docker compose --env-file .env.production logs -f gringo
```

Check health:

```powershell
curl http://localhost:4242/api/health
```

Expected when secrets are filled:

```json
{
  "ok": true,
  "downloadFileConfigured": true,
  "stripeConfigured": true,
  "webhookConfigured": true
}
```

## 6. Point The Domain To Docker

Your domain must serve the Docker app over HTTPS.

Point:

```text
https://holagringo.media
```

to:

```text
http://127.0.0.1:4242
```

Use one of these:

- Nginx reverse proxy
- Caddy reverse proxy
- Cloudflare Tunnel
- Hosting provider proxy

Required routes:

```text
/                      React app
/checkout/success      React success page
/api/health            Backend health check
/api/checkout/session  Stripe session verification
/api/download          One-time download
/api/stripe/webhook    Stripe webhook
```

## 7. Test In Stripe Test Mode

Use test mode first.

Test card:

```text
4242 4242 4242 4242
```

Any future expiry date, any CVC, any ZIP.

Test flow:

1. Open:

```text
https://holagringo.media
```

2. Click Digital Download.
3. Confirm Stripe shows Digital Download, not Vinyl.
4. Pay with the test card.
5. Confirm Stripe redirects to:

```text
https://holagringo.media/checkout/success?session_id=cs_test_...
```

6. Confirm the page shows a QR code.
7. Click Download Album.
8. Confirm the ZIP downloads.
9. Open the ZIP and confirm the 12 MP3s are inside.
10. Try the same download link again.
11. Expected result: second attempt is blocked.

## 8. Test Webhook Delivery

In Stripe Dashboard:

1. Developers
2. Webhooks
3. Open the endpoint
4. Check recent deliveries

Expected event:

```text
checkout.session.completed
```

Expected response:

```text
2xx
```

If webhook fails:

- Check `STRIPE_WEBHOOK_SECRET`
- Check domain HTTPS
- Check Docker logs
- Check `/api/health`

## 9. Switch To Live Mode

Only after test mode works:

1. Verify your Stripe business if Stripe requires it.
2. Create live mode products/prices/payment links.
3. Update `.env.production` with live Payment Links.
4. Update `STRIPE_SECRET_KEY` to a live `sk_live_...` key.
5. Create a live webhook endpoint.
6. Update `STRIPE_WEBHOOK_SECRET` to the live `whsec_...`.
7. Update `ALLOWED_PRICE_IDS` to live `price_...` IDs.
8. Rebuild and restart Docker:

```powershell
docker compose --env-file .env.production up -d --build
```

## 10. Final Launch Checklist

- [ ] Stripe secret key rotated if it was exposed anywhere
- [ ] `.env.production` created on server
- [ ] `STRIPE_SECRET_KEY` filled
- [ ] `STRIPE_WEBHOOK_SECRET` filled
- [ ] `ALLOWED_PRICE_IDS` filled with real `price_...` IDs
- [ ] Payment Links point to the correct products
- [ ] Payment Links redirect to `https://holagringo.media/checkout/success?session_id={CHECKOUT_SESSION_ID}`
- [ ] Album ZIP exists at `private-downloads/la-inoficial-digital.zip`
- [ ] Docker Desktop or Docker engine is running
- [ ] `docker compose --env-file .env.production up -d --build` works
- [ ] `https://holagringo.media/api/health` returns healthy
- [ ] Test payment completes
- [ ] Success page shows QR code
- [ ] First download works
- [ ] Second download is blocked
- [ ] Webhook delivery returns 2xx
- [ ] Live mode keys and links are used only when ready
