# Server Pull And Run Guide

Use this when changes are already pushed to GitHub and you want to update the
production server.

## Important

`.env.production` is ignored by git, so `git pull` should not overwrite your
live Stripe or email secrets.

Do not paste `sk_live_...`, `whsec_...`, or mailbox passwords into GitHub or docs.

## 1. SSH into the server

```bash
ssh your-user@your-server-ip
```

Go to the project folder:

```bash
cd /path/to/gringo
```

If the repository folder on the server is the inner app folder, it should contain
files like:

```text
compose.yaml
package.json
src/
server/
.env.production
```

## 2. Check the server working tree

Run:

```bash
git status --short
```

Expected output should be empty.

If you see changes, stop and inspect them first:

```bash
git diff
```

If the only changed files are local server files you intentionally edited, back
them up before pulling.

## 3. Back up production env

Run this before every deploy:

```bash
cp .env.production ".env.production.backup.$(date +%Y%m%d-%H%M%S)"
```

Also confirm the private album ZIP is still present:

```bash
ls -lh private-downloads/la-inoficial-digital.zip
```

## 4. Pull latest code correctly

Use `--ff-only` so git does not create a surprise merge commit on the server:

```bash
git fetch origin
git pull --ff-only origin main
```

Confirm the latest commit:

```bash
git log --oneline -5
```

## 5. Rebuild and restart Docker

Run:

```bash
docker compose --env-file .env.production up -d --build
```

Check container status:

```bash
docker compose --env-file .env.production ps
```

## 6. Health check

Run:

```bash
curl http://localhost:4242/api/health
```

Expected:

```json
{"ok":true,"downloadFileConfigured":true,"stripeConfigured":true,"webhookConfigured":true,"emailConfigured":true}
```

## 7. Check logs

Run:

```bash
docker compose --env-file .env.production logs --tail=100 gringo
```

For live watching:

```bash
docker compose --env-file .env.production logs -f gringo
```

## 8. Test the website

Open:

```text
https://holagringo.media
```

Check:

- Home page loads.
- Buy buttons open live Stripe Payment Links.
- After payment, Stripe redirects to:

```text
https://holagringo.media/checkout/success?session_id=...
```

- The success page shows the big green confirmation, QR code, and Download Now
  button.
- The buyer receives the backup email with the same private link and QR code.

## Quick command list

```bash
cd /path/to/gringo
git status --short
cp .env.production ".env.production.backup.$(date +%Y%m%d-%H%M%S)"
ls -lh private-downloads/la-inoficial-digital.zip
git fetch origin
git pull --ff-only origin main
docker compose --env-file .env.production up -d --build
docker compose --env-file .env.production ps
curl http://localhost:4242/api/health
docker compose --env-file .env.production logs --tail=100 gringo
```

## If pull fails

If this command fails:

```bash
git pull --ff-only origin main
```

Check what is blocking it:

```bash
git status --short
git diff
```

Do not run `git reset --hard` unless you are sure the server has no important
local edits.

## If Docker fails

Check logs:

```bash
docker compose --env-file .env.production logs --tail=200 gringo
```

Rebuild without cache if the image seems stale:

```bash
docker compose --env-file .env.production build --no-cache
docker compose --env-file .env.production up -d
```

## Temporary rollback

Find an older commit:

```bash
git log --oneline -10
```

Temporarily run an older commit:

```bash
git switch --detach OLD_COMMIT_SHA
docker compose --env-file .env.production up -d --build
```

Return to the normal main branch later:

```bash
git switch main
git pull --ff-only origin main
docker compose --env-file .env.production up -d --build
```
