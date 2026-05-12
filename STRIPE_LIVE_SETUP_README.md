# Stripe Live Setup README

This app uses Stripe Payment Links for the buy buttons, then verifies the paid
Checkout Session on the server before showing the private download link.

## What to create in Stripe

Create everything below in **Live mode**, not Test mode.

You need:

- 3 live Products/Prices: Digital, CD, Vinyl
- 3 live Payment Links: one for each buy button
- 1 live webhook endpoint
- 1 live secret key
- 1 live webhook signing secret

## 1. Create live products and prices

In Stripe Dashboard:

1. Open **Product catalog**.
2. Click **Add product**.
3. Create a product for each edition:
   - `Hola Gringo - Digital`
   - `Hola Gringo - CD`
   - `Hola Gringo - Vinyl`
4. For each product, create a **one-time** price.
5. Copy each live `price_...` ID.

The `price_...` IDs go into:

```env
ALLOWED_PRICE_IDS=price_digital_live,price_cd_live,price_vinyl_live
```

Use the Digital price at minimum. Add CD and Vinyl too if those purchases should
also unlock the digital download.

## 2. Create live Payment Links

For each product:

1. Open **Payment Links**.
2. Create a Payment Link for the matching product/price.
3. Open the Payment Link settings.
4. Go to **After Payment**.
5. Select **Don't show confirmation page**.
6. Redirect customers to:

```text
https://holagringo.media/checkout/success?session_id={CHECKOUT_SESSION_ID}
```

Copy the three live Payment Link URLs. They go into:

```env
VITE_STRIPE_DIGITAL_PAYMENT_LINK=https://buy.stripe.com/...
VITE_STRIPE_CD_PAYMENT_LINK=https://buy.stripe.com/...
VITE_STRIPE_VINYL_PAYMENT_LINK=https://buy.stripe.com/...
```

Payment Link URLs are public. Secret keys are private.

## 3. Create the live webhook endpoint

On the screen **Create an event destination**:

1. For **Event destination scope**, choose **Your account**.
2. Do not choose **Connected accounts** unless you are building a Stripe Connect
   platform. This site is not.
3. Leave the API version as the Dashboard default unless you have a specific
   reason to pin a different one.
4. For **Events**, choose **Selected events**.
5. Open the **Checkout** section.
6. Select only these two events:

```text
checkout.session.completed
checkout.session.async_payment_succeeded
```

7. Continue.
8. For destination type, choose a normal **Webhook endpoint** / **HTTPS endpoint**.
9. Endpoint URL:

```text
https://holagringo.media/api/stripe/webhook
```

10. Create the destination.
11. Reveal/copy the signing secret. It starts with `whsec_...`.

The webhook signing secret goes into:

```env
STRIPE_WEBHOOK_SECRET=whsec_...
```

Do not paste `whsec_...` into chat.

## 4. Get the live secret key

In Stripe Dashboard:

1. Open **Developers**.
2. Open **API keys**.
3. Make sure you are in **Live mode**.
4. Copy a live secret key that starts with `sk_live_...`.

It goes into:

```env
STRIPE_SECRET_KEY=sk_live_...
```

Do not paste `sk_live_...` into chat.

## 5. Update `.env.production`

The production env should look like this:

```env
VITE_STRIPE_DIGITAL_PAYMENT_LINK=https://buy.stripe.com/...
VITE_STRIPE_CD_PAYMENT_LINK=https://buy.stripe.com/...
VITE_STRIPE_VINYL_PAYMENT_LINK=https://buy.stripe.com/...
VITE_API_BASE_URL=

CLIENT_ORIGIN=https://holagringo.media
PUBLIC_BASE_URL=https://holagringo.media

STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
ALLOWED_PRICE_IDS=price_digital_live,price_cd_live,price_vinyl_live

DIGITAL_DOWNLOAD_FILE=private-downloads/la-inoficial-digital.zip
DOWNLOAD_FILE_NAME=Hola Gringo - Digital Album.zip
DOWNLOAD_TOKEN_TTL_HOURS=168
ENABLE_LOCAL_CHECKOUT_TESTS=false
```

Important:

- `VITE_STRIPE_*_PAYMENT_LINK` uses `https://buy.stripe.com/...` URLs.
- `ALLOWED_PRICE_IDS` uses `price_...` IDs, not Payment Link URLs.
- `VITE_API_BASE_URL` stays blank in production because the frontend and API are
  served from the same domain.

## 6. Add the private download ZIP

Place the paid ZIP here on the production server:

```text
private-downloads/la-inoficial-digital.zip
```

Do not put the paid ZIP inside `public/`.

## 7. Rebuild and restart production

From the project folder:

```powershell
docker compose --env-file .env.production up -d --build
```

Check health:

```powershell
curl http://localhost:4242/api/health
```

Expected:

```json
{
  "ok": true,
  "downloadFileConfigured": true,
  "stripeConfigured": true,
  "webhookConfigured": true
}
```

## 8. Test the full flow

1. Open `https://holagringo.media`.
2. Click the Digital buy button.
3. Complete a real live payment.
4. Confirm Stripe redirects to:

```text
https://holagringo.media/checkout/success?session_id=...
```

5. Confirm the page shows the QR/download button.
6. Download once.
7. Try the same download link again and confirm it is blocked.

Live mode does not accept Stripe test card `4242 4242 4242 4242`. Use a real
payment method, or do the full rehearsal in Stripe Test mode before switching
the production env to live values.

## Current repo check

At the time this README was added, `.env.production` still had test Payment
Link URLs and old Price IDs. Replace those with live values before deploying.
