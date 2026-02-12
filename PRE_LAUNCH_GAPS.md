# Pre-Launch Gap Analysis

Comprehensive review of outstanding features, gaps, and priorities before launching Inspo Snaps.

---

## Critical Blockers (Must fix before launch)

### 1. ~~No Password Reset / Forgot Password Flow~~ ✅ DONE

Password reset flow is now implemented:

- `sendResetPassword` callback configured in Better Auth
- `/forgot-password` page for requesting reset links
- `/reset-password` page for setting new password using token
- Login page "Forgot Password?" link connected
- Handles invalid/expired tokens with appropriate error UI
- Success states with navigation back to login

**Files involved:**

- `src/lib/auth/auth.ts` — `sendResetPassword` callback configured with Resend
- `src/routes/(auth-pages)/forgot-password.tsx` — new forgot password page
- `src/routes/(auth-pages)/reset-password.tsx` — new reset password page
- `src/routes/(auth-pages)/login.tsx` — updated "Forgot Password?" link

### 2. ~~Email Infrastructure Missing~~ ✅ DONE

Email infrastructure is now fully implemented with Resend:

- Password reset emails
- Email verification emails
- Team invitation emails

**Files involved:**

- `src/lib/email/resend.ts` — Resend client initialization
- `src/lib/email/templates.ts` — HTML/text email templates
- `src/lib/email/send.ts` — Send functions with error handling
- `src/lib/auth/auth.ts` — Better Auth callbacks wired to Resend
- `src/config/env/server.ts` — `RESEND_API_KEY` and `EMAIL_FROM` env vars

### 3. ~~No Password Change Functionality~~ ✅ DONE

Password change is now implemented:

- `ChangePasswordDialog` component with full form validation
- Requires email verification before allowing password changes
- Detects OAuth-only users and shows "Signed in with Google" instead
- Uses shared `passwordSchema` for consistent validation

**Files involved:**

- `src/components/settings/ChangePasswordDialog.tsx` — new dialog component
- `src/components/settings/SettingsModal.tsx` — integrated with verification check
- `src/lib/auth/functions.ts` — `changePassword`, `hasPassword`, `sendVerificationEmail` server functions

### 4. ~~Zero Test Coverage~~ ✅ DONE

Comprehensive test coverage has been added for all server functions:

- 97 tests across 4 test files
- Auth functions (21 tests): username validation, password change, email verification
- Folder functions (29 tests): CRUD operations, hierarchies, favourites, stats
- Image functions (19 tests): save, delete, folder associations
- Sharing functions (28 tests): share links, user sharing, access control

**Files involved:**

- `src/lib/auth/functions.test.ts` — auth server function tests
- `src/lib/folders/functions.test.ts` — folder CRUD tests
- `src/lib/images/functions.test.ts` — image management tests
- `src/lib/sharing/functions.test.ts` — sharing and collaboration tests
- `src/test/fixtures/` — test fixtures for users, folders
- `src/test/mocks/` — mocks for db, auth, S3, notifications

### 5. ~~No Rate Limiting~~ ✅ DONE

Rate limiting is now implemented:

- Better Auth built-in rate limiting enabled with database storage
- Custom rules for sensitive auth endpoints (login: 5/min, signup: 3/min, password reset: 3/min)
- Rate limit middleware for custom server functions (uploads, account operations, sharing)
- Proper IP address handling (X-Forwarded-For, CF-Connecting-IP, IPv6 /64 subnet masking)
- Rate limit headers returned to clients (X-RateLimit-Limit, X-RateLimit-Remaining, X-RateLimit-Reset, X-Retry-After)
- Automatic cleanup of expired rate limit entries

**Files involved:**

- `src/lib/auth/auth.ts` — Better Auth rate limit configuration
- `src/lib/db/schema/rate-limit.schema.ts` — database schema for rate limit persistence
- `src/lib/rate-limit/middleware.ts` — reusable rate limit middleware for server functions
- `src/lib/storage/functions.ts` — upload rate limiting applied
- `src/lib/auth/functions.ts` — account operations rate limiting applied
- `src/lib/images/functions.ts` — image save rate limiting applied
- `src/lib/sharing/functions.ts` — sharing operations rate limiting applied

### 6. No Production Deployment Config

Docker Compose exists for local dev (Postgres + MinIO) but there is no Dockerfile for the application, no CI/CD pipeline, and no deployment automation.

**Files involved:**

- `docker-compose.yml` — local dev only
- No `.github/workflows/`, `Dockerfile`, `vercel.json`, or `netlify.toml`

### 7. Landing Page is Placeholder

`src/routes/index.tsx` still shows "React TanStarter" heading with raw JSON user data. This needs to be replaced with a proper marketing/home page before launch.

**Files involved:**

- `src/routes/index.tsx`

---

## High Priority (Should fix before launch)

### 8. ~~SEO Metadata~~ ✅ DONE

SEO metadata is now fully implemented:

- Meta descriptions on all public pages
- Open Graph tags (og:title, og:description, og:image, og:url, og:type, og:site_name, og:locale)
- Twitter card tags (summary_large_image)
- Canonical URLs on public pages
- robots.txt with proper allow/disallow directives
- Static sitemap.xml for public pages
- Dynamic OG tags on share link pages (folder name + owner for social previews)
- Page-specific titles across all routes
- `noindex, nofollow` on all protected and utility routes
- Web app manifest updated with Inspo Snaps branding
- OG image placeholder (`public/og-image.png`)

**Files involved:**

- `src/routes/__root.tsx` — default meta tags, OG, Twitter cards, theme-color
- `src/routes/index.tsx` — landing page SEO + canonical
- `src/routes/(auth-pages)/login.tsx` — page title + canonical
- `src/routes/(auth-pages)/signup.tsx` — page title + canonical
- `src/routes/(auth-pages)/forgot-password.tsx` — noindex
- `src/routes/(auth-pages)/reset-password.tsx` — noindex
- `src/routes/(authenticated)/route.tsx` — noindex for all authenticated routes
- `src/routes/(authenticated)/share/$linkId.tsx` — dynamic OG tags + noindex
- `public/robots.txt` — crawl directives + sitemap reference
- `public/sitemap.xml` — static sitemap for public pages
- `public/manifest.json` — updated branding
- `public/og-image.png` — OG image

### 9. No Error Tracking / Monitoring

No Sentry or similar service. Only a single `console.log` exists in the entire backend. Production errors will go unnoticed.

### ~~10. Security Headers Missing~~ Removed

Not needed pre-launch. React 19 auto-escapes output (primary XSS defense), browsers default to `strict-origin-when-cross-origin` referrer policy, and deployment platforms (Vercel, Cloudflare, etc.) handle HSTS/X-Frame-Options automatically. CSP can be added as a post-launch hardening step once the app is stable in production.

### 11. ~~Share Links Require Authentication~~ ✅ Working as Intended

Share links intentionally require authentication — users need an account to view shared content. This is by design for security and tracking purposes. Backend functions now consistently require auth:

- `accessSharedLink()` — requires auth
- `getSharedFolderContents()` — requires auth
- `getLinkSharedFolderImages()` — requires auth

**Files involved:**

- `src/routes/(authenticated)/share/$linkId.tsx` — protected route (correct)
- `src/lib/sharing/functions.ts` — all share link functions require auth

### ~~12. Overview Dashboard Shows Mock Data~~ Removed

Overview page removed — My Folders is now the default authenticated landing page. Users go directly to their content instead of a dashboard with mock stats. Overview route, stats components, and stats server functions deleted.

### 13. Account Deletion / Data Export

No way for users to delete their account or export their data. Depending on target market, this may be a legal requirement (GDPR, CCPA).

---

## Medium Priority (Polish before or shortly after launch)

### 14. Search / Command Palette (Cmd+K)

Planned in ROADMAP but not implemented. No global search component, no keyboard shortcut listeners, no search UI in navbar or sidebar.

### 15. Move Folder UI

Backend `moveFolder()` function exists with circular reference detection, but no UI has been built to trigger it.

**Files involved:**

- `src/lib/folders/functions.ts` — `moveFolder()` implemented
- No corresponding UI component

### 16. Bulk Operations

No multi-select capability anywhere. No bulk delete, move, or organize functionality. No select-all in gallery view.

### 17. Move/Copy Images Between Folders

`addImageToFolder()` and `removeImageFromFolder()` exist in the backend but there is no UI for moving or copying images between folders. Would require a folder picker modal.

**Files involved:**

- `src/lib/images/functions.ts` — backend functions exist

### 18. User Onboarding Flow

No guided tour or onboarding wizard for new users. Only empty state illustrations with CTAs serve as light onboarding ("Create your first folder").

### 20. Two-Factor Authentication (2FA / MFA) — Post-Launch

Not needed pre-launch. The app stores image collections (low risk profile), strong password validation is enforced, auth endpoints are rate-limited, and Google OAuth users already have Google's own 2FA. Better Auth's built-in `twoFactor` plugin (TOTP, backup codes, trusted devices) makes this straightforward to add as an opt-in setting post-launch.

### 21. Email Change — Post-Launch

Email field is displayed but disabled in settings UI. Not a launch blocker — most users won't need to change email in the first weeks. Better Auth supports `authClient.changeEmail` with built-in new-email verification, making this straightforward to add later. When implemented, will also need to handle OAuth account linking edge cases and email-based sharing references.

### ~~22. Image Metadata Viewer~~ ✅ DONE

Upload date is shown via a calendar icon tooltip in the image lightbox. Full metadata (dimensions, file size, EXIF) not needed for an inspiration board app.

### ~~23. Legacy Gallery Components Cleanup~~ ✅ DONE

Deleted `src/components/gallery/` (ImageGallery.tsx, ImageCard.tsx) — demo components with mock data. Their only consumer (the overview page) was removed, making them dead code.

### 24. Email Templates Styling (React Email)

Current email templates use inline HTML/CSS strings. Should be refactored to use React Email for better maintainability, consistent styling, and easier preview/testing.

**Files involved:**

- `src/lib/email/templates.ts` — current inline HTML templates
- Would need to install `@react-email/components` and create proper React components

---

## What's in Good Shape

These features are well-implemented and ready for launch:

- **Folder CRUD** — Create, edit, delete with nested hierarchies, 9 colors, emoji support
- **Image Upload** — Single and batch upload with drag-and-drop, S3 presigned URLs, progress tracking, file validation (JPEG, PNG, WebP, GIF, AVIF up to 20MB)
- **Image Gallery** — Responsive grid, lightbox viewer with keyboard navigation, lazy loading, download
- **Share Links** — Generation with configurable expiration (7/30/90 days/never), copy-to-clipboard, management UI
- **User-to-User Sharing** — Invite by email/username, pending/accepted/cancelled statuses, invitation acceptance flow
- **Clone Shared Folders** — Deep clone of folder hierarchies with all images
- **Team/Organization Folders** — Full CRUD with role-based permissions (owner/admin/member/viewer)
- **In-App Notifications** — Dropdown notification center with unread badge, mark-all-as-read
- **Favourite Folders** — Add/remove across personal, shared, and team contexts
- **Theme System** — Light/dark/system with localStorage persistence, no flash of unstyled content
- **Mobile Responsive** — Mobile detection hook, collapsible sidebar, responsive grids, breadcrumb collapse
- **Error Handling** — Global error boundary, route-specific error components, animated error state templates
- **Loading States** — Suspense with skeleton loaders, prefetching strategy, image loading states
- **Environment Validation** — Runtime validation with `@t3-oss/env-core` and Zod schemas
- **Image Caching** — Smart 24-hour URL rounding for browser cache hits, 1-year immutable upload cache
- **React Query** — Comprehensive staleTime configuration (2-5 min) across all query types
- **Session Caching** — Cookie-based with 5-minute TTL, 90-day expiration, weekly refresh
- **Auth System** — Email/password + Google OAuth, username system with availability checking
- **Breadcrumb Navigation** — Smart collapse for deep folder paths
- **Form Validation** — TanStack Form with Zod schemas, real-time validation
- **Auth Page Design** — Branded gradient panel with grain texture, logo, tagline (Gabarito font), clickable logo links
- **Avatar Storage** — Public S3 URLs for avatars (never expire), presigned URLs for private folder images

---

## Authentication & Security Detail

### Implemented

- Email/password signup with strong password validation (8+ chars, uppercase, lowercase, number, special char)
- Google OAuth login/signup
- Username system (3-30 chars, alphanumeric + dots/underscores) with availability checking
- Session management (90-day expiry, weekly refresh, cookie cache)
- User profile (avatar upload to S3 with public URLs, username editing)
- Auth middleware on all protected server functions
- Chrome extension auth state synchronization
- Role-based access control for team folders

### Missing

- ~~Forgot password / password reset flow~~ ✅ Implemented
- ~~Email verification~~ ✅ Implemented
- ~~Password change functionality~~ ✅ Implemented
- ~~Rate limiting / brute force protection~~ ✅ Implemented
- Account deletion / deactivation
- 2FA / MFA support (post-launch — see #20)
- Account lockout after failed attempts
- Audit logging for auth events
- Login attempt notifications
- OAuth account linking/unlinking

---

## Sharing & Collaboration Detail

### Implemented

| Feature | Completeness |
|---------|-------------|
| Share link generation | 100% |
| User-to-user sharing | 100% |
| Shared folders viewing | 100% |
| Team folders | 100% |
| Clone shared folders | 100% |
| Invitation system | 100% |
| Permission levels (teams) | 100% |

### Not Implemented

- Anonymous/unauthenticated share link viewing
- Share link password protection
- Activity/audit logs for sharing
- Folder download as ZIP
- Collaborative editing (shared folders are read-only)
- Share analytics (link access counts)
- Auto-expiring user-to-user shares
- Custom per-folder permissions

---

## Infrastructure Detail

### Implemented

- Docker Compose for local development (PostgreSQL 15 + MinIO)
- Environment variable validation (server + client)
- Biome for linting/formatting
- TypeScript strict mode
- Drizzle ORM with migration support
- Path alias (`@/*` -> `./src/*`)

### Not Implemented

- CI/CD pipeline (GitHub Actions or similar)
- Production Dockerfile
- ~~Rate limiting~~ ✅ Implemented
- ~~Security headers (CSP, HSTS, X-Frame-Options)~~ Removed — not needed pre-launch, handled by deployment platform + framework defaults
- Error tracking (Sentry or similar)
- Application logging beyond console.log
- Performance monitoring
- Analytics

---

## Suggested Pre-Launch Priority Order

1. ~~Wire up email infrastructure (Resend)~~ ✅ DONE
2. ~~Implement password reset (forgot password flow)~~ ✅ DONE
3. Build the landing/home page
4. Add payments/subscriptions
5. ~~Add rate limiting on auth + upload endpoints~~ ✅ DONE
6. Set up error tracking (Sentry)
7. Fix share link auth requirement (allow unauthenticated access)
~~8. Wire up real overview stats~~ Removed — overview page deleted, My Folders is the default page
9. ~~Add SEO meta tags + Open Graph~~ ✅ DONE
10. Set up CI/CD + production deployment
11. ~~Write core tests (auth flows, folder CRUD, sharing)~~ ✅ DONE
12. ~~Add security headers~~ Removed — not needed pre-launch

---

## Recently Completed

- ✅ **Email infrastructure (Resend)** — Full email sending via Resend with HTML/text templates for password reset, email verification, and team invitations. Environment validation for `RESEND_API_KEY` and `EMAIL_FROM`.
- ✅ **Rate limiting** — Better Auth built-in rate limiting with database storage, custom rules for sensitive endpoints (login: 5/min, signup: 3/min), reusable middleware for server functions (uploads, account ops, sharing), proper IP handling with IPv6 subnet masking, rate limit headers for clients
- ✅ **Forgot password / password reset flow** — Full implementation with forgot password page, reset password page, token validation, and Better Auth integration
- ✅ **Password change functionality** — Full implementation with dialog, validation, email verification requirement
- ✅ **Email verification flow** — UI and server functions implemented
- ✅ **Test coverage** — 97 tests across auth, folders, images, and sharing server functions with fixtures and mocks
- ✅ **OAuth user detection** — Shows "Signed in with Google" for users without password credentials
- ✅ **Shared password schema** — Consolidated validation rules across signup and password change
- ✅ **SEO metadata** — Full meta tags, OG/Twitter cards, canonical URLs, robots.txt, sitemap.xml, dynamic OG on share links, noindex on protected routes, web app manifest, OG image
- ✅ **Auth page branded panel** — Login/signup right panel with blue-to-purple gradient matching OG image, grain texture, BrandLogo, tagline, Gabarito font. Logo links to home on auth pages and sidebar.
- ✅ **Avatar public URLs** — Switched avatars from expiring presigned S3 URLs to permanent public URLs. Requires S3 bucket policy allowing public reads on `avatars/*`. Folder images remain private with presigned URLs.
