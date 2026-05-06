# Docker Deployment Checklist

You already configured the Stripe Payment Link redirect to:

```text
https://holagringo.media/checkout/success?session_id={CHECKOUT_SESSION_ID}
```

## What Is Still Missing

1. Add real Stripe secrets on the server.
2. Add the Stripe Price IDs to `ALLOWED_PRICE_IDS`.
3. Put the album ZIP on the server at `private-downloads/la-inoficial-digital.zip`.
4. Run the Docker app behind HTTPS for `holagringo.media`.
5. Create the Stripe production webhook endpoint.
6. Test a Stripe payment end to end.

## Server Env

On the server, create `.env.production` from `.env.production.example`.

Use these production values:

```text
CLIENT_ORIGIN=https://holagringo.media
PUBLIC_BASE_URL=https://holagringo.media
VITE_API_BASE_URL=
ENABLE_LOCAL_CHECKOUT_TESTS=false
```

`VITE_API_BASE_URL` is intentionally blank in production because the frontend and API are served from the same domain.

## Build And Run

From the project folder:

```powershell
docker compose --env-file .env.production up -d --build
```

Check health:

```powershell
docker compose --env-file .env.production ps
curl http://localhost:4242/api/health
```

If your server uses Nginx, Caddy, Cloudflare Tunnel, or another reverse proxy, point:

```text
https://holagringo.media
```

to:

```text
http://127.0.0.1:4242
```

## Album ZIP

The Docker image does not include the paid album. The compose file mounts:

```text
./private-downloads:/app/private-downloads
```

So place the ZIP on the server here:

```text
private-downloads/la-inoficial-digital.zip
```

## Stripe Webhook

In Stripe Dashboard, create:

```text
https://holagringo.media/api/stripe/webhook
```

Events:

```text
checkout.session.completed
checkout.session.async_payment_succeeded
```

Copy the webhook signing secret into:

```text
STRIPE_WEBHOOK_SECRET=whsec_...
```

## Stripe Price IDs

`ALLOWED_PRICE_IDS` must contain the Price IDs for products that should unlock the download.

Use the Digital price ID at minimum. Add CD and Vinyl too if those purchases include the digital album.

Example:

```text
ALLOWED_PRICE_IDS=price_123_digital,price_456_cd,price_789_vinyl
```

## Final Test

1. Open `https://holagringo.media`.
2. Click **Buy Digital**.
3. Pay with Stripe test card `4242 4242 4242 4242`.
4. Confirm Stripe redirects to `/checkout/success?session_id=...`.
5. Confirm the QR/download button appears.
6. Download once.
7. Refresh or reuse the same download link and confirm it is blocked.
