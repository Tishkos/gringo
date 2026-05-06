# Run Everything With Docker

Use these commands after `.env.production` is filled and `private-downloads/la-inoficial-digital.zip` exists.

## Start

```powershell
docker compose --env-file .env.production up -d --build
```

## Check

```powershell
docker compose --env-file .env.production ps
curl http://localhost:4242/api/health
```

Healthy output should show:

```json
{
  "ok": true,
  "downloadFileConfigured": true,
  "stripeConfigured": true,
  "webhookConfigured": true
}
```

## Logs

```powershell
docker compose --env-file .env.production logs -f gringo
```

## Stop

```powershell
docker compose --env-file .env.production down
```

## VPS

On the VPS, upload or clone the repo, place the album ZIP at:

```text
private-downloads/la-inoficial-digital.zip
```

Then run:

```bash
docker compose --env-file .env.production up -d --build
```

Point HTTPS `holagringo.media` to the container on port `4242`.
