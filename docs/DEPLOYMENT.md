# Deployment

Production deployment on a VPS using Docker + Coolify.

---

## 1. Environment Variables

Set these in Coolify under **Environment Variables**:

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | PostgreSQL connection string (use Coolify's internal hostname) |
| `BETTER_AUTH_SECRET` | Random secret for session signing |
| `BETTER_AUTH_URL` | Production URL (e.g. `https://insposnaps.com`) |
| `VITE_BASE_URL` | Same as `BETTER_AUTH_URL` |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID |
| `GOOGLE_CLIENT_SECRET` | Google OAuth client secret |
| `S3_ACCESS_KEY_ID` | AWS S3 access key |
| `S3_SECRET_ACCESS_KEY` | AWS S3 secret key |
| `S3_REGION` | AWS region (e.g. `us-east-1`) |
| `S3_BUCKET_NAME` | S3 bucket name |
| `S3_ENDPOINT` | Optional — only needed for S3-compatible providers |
| `S3_FORCE_PATH_STYLE` | Optional — `true` for MinIO/S3-compatible, `false` for AWS |
| `RESEND_API_KEY` | Resend API key for transactional emails |
| `EMAIL_FROM` | Sender address (e.g. `InspoSnaps <noreply@insposnaps.com>`) |
| `POLAR_ACCESS_TOKEN` | Polar access token for subscriptions |
| `POLAR_WEBHOOK_SECRET` | Polar webhook signing secret |

## 2. Pre-deployment Command

In Coolify's deployment settings, set the **pre-deployment command** to run database migrations before each deploy:

```
pnpm db:migrate
```

This runs `drizzle-kit migrate` which applies any pending SQL migrations from the `drizzle/` directory.

## 3. Domain + SSL

1. Add your domain in Coolify under the service's **Domains** setting
2. Point your DNS A record to the VPS IP address
3. Coolify automatically provisions SSL certificates via Traefik and Let's Encrypt

## 4. PostgreSQL

Add a PostgreSQL service in Coolify:

1. Go to **Projects** → your project → **New Resource** → **PostgreSQL**
2. Coolify generates the connection credentials automatically
3. Use the internal hostname in `DATABASE_URL` (e.g. `postgresql://user:pass@postgres-host:5432/insposnaps`)
4. The database is accessible to your app container via Coolify's internal network
