# InspoSnaps

> **This project is retired.** insposnaps.com has been shut down and this code is no longer maintained. It's open sourced as-is in case it's useful to anyone.
>
> InspoSnaps never got any users, and [Stashr](https://stashr.me) ended up being the same idea done much better. If you're looking for a place to save and organise inspiration, use that instead.

InspoSnaps was a private workspace for saving, organising and sharing visual inspiration. This repo is the web app. The companion browser extension lives at [Inspo-Snaps-Web-Extension](https://github.com/DeckardGer/Inspo-Snaps-Web-Extension).

## Features

- Nested folders with colours and emojis
- Image uploads with drag and drop, plus saving from any page via the browser extension
- Sharing folders by link, or inviting specific users with permissions
- Teams with shared folders
- Email/password and Google sign-in
- Free, Pro and Team plans with subscriptions through Polar
- Light and dark themes

## Tech stack

- [TanStack Start](https://tanstack.com/start) (React 19, TanStack Router, Query and Form) on Vite + Nitro
- PostgreSQL with [Drizzle ORM](https://orm.drizzle.team)
- [Better Auth](https://better-auth.com) for authentication
- S3-compatible storage for images (ran on Cloudflare R2)
- [Polar](https://polar.sh) for billing, Unosend for email, PostHog for analytics
- Tailwind CSS v4 and shadcn/ui
- Biome and Vitest

## Running it locally

You'll need Node, pnpm, a PostgreSQL database and an S3-compatible bucket.

```bash
pnpm install
pnpm db:migrate
pnpm dev        # http://localhost:3000
```

Environment variables (validated in `src/config/env/server.ts`):

| Variable | Notes |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string |
| `BETTER_AUTH_SECRET` | Any random string |
| `VITE_BASE_URL` | Defaults to `http://localhost:3000` |
| `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` | Google OAuth credentials |
| `S3_ACCESS_KEY_ID`, `S3_SECRET_ACCESS_KEY`, `S3_BUCKET_NAME` | Storage credentials |
| `S3_ENDPOINT`, `S3_REGION`, `S3_FORCE_PATH_STYLE` | Optional, for non-AWS providers like R2 or MinIO |
| `UNOSEND_API_KEY`, `EMAIL_FROM` | Transactional email |
| `POLAR_ACCESS_TOKEN`, `POLAR_WEBHOOK_SECRET` | Subscriptions |

Other scripts: `pnpm test`, `pnpm check` (lint + format), `pnpm db:generate`, `pnpm db:studio`.

Production ran as a Docker container on Coolify. See [`docs/DEPLOYMENT.md`](docs/DEPLOYMENT.md).

## License

[MIT](LICENSE)
