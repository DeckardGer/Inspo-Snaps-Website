# Pre-Launch Gap Analysis

Comprehensive review of outstanding features, gaps, and priorities before launching Inspo Snaps.

---

## Critical Blockers (Must fix before launch)

### 1. No Password Reset / Forgot Password Flow

Users have no way to recover their accounts if they forget their password. The `verification` table exists in the database but is unused. No email-based reset flow, no token generation, no reset UI.

**Files involved:**

- `src/lib/auth/auth.ts` — Better Auth config (no password reset plugin)
- `src/lib/db/schema/auth.schema.ts` — verification table exists but unused

### 2. Email Infrastructure Missing (Partially Addressed)

`sendInvitationEmail` and `sendVerificationEmail` in `auth.ts` log to console instead of sending actual emails. Resend (or similar) needs to be wired up. This blocks:

- Password reset emails
- ~~Email verification~~ ✅ Flow implemented (console.log placeholder for actual sending)
- Sharing invitation emails
- Account change notifications

**Files involved:**

- `src/lib/auth/auth.ts` — `emailVerification.sendVerificationEmail` configured (console.log placeholder)
- `src/lib/auth/functions.ts` — `sendVerificationEmail` server function implemented

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

### 4. Zero Test Coverage

Vitest 3.0.5 and React Testing Library 16.2.0 are installed but there are no test files in the project. At minimum, integration tests are needed for auth flows, folder CRUD, and sharing operations before launch.

**Files involved:**

- `package.json` — test script exists (`vitest run`)
- No `*.test.ts` or `*.test.tsx` files found

### 5. No Rate Limiting

No rate limiting on login attempts, API endpoints, or upload endpoints. Vulnerable to brute force attacks and API abuse.

**Files involved:**

- `src/lib/auth/middleware.ts` — auth middleware with no rate limiting

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

### 8. SEO Metadata

Only a basic `<title>Inspo Snaps</title>` tag exists in the root layout. Missing:

- Meta description
- Open Graph tags (critical for social sharing of shared folders)
- Twitter card tags
- Canonical URLs
- robots.txt
- Sitemap

**Files involved:**

- `src/routes/__root.tsx` — minimal meta tags

### 9. No Error Tracking / Monitoring

No Sentry or similar service. Only a single `console.log` exists in the entire backend. Production errors will go unnoticed.

### 10. Security Headers Missing

No explicit security headers configured:

- Content Security Policy (CSP)
- X-Frame-Options
- X-Content-Type-Options
- HTTP Strict Transport Security (HSTS)
- Referrer-Policy

### 11. Share Links Require Authentication

Share link routes are under `/(authenticated)/`, so unauthenticated users cannot view shared content. The backend (`accessSharedLink()`) supports unauthenticated access but the routing blocks it.

**Files involved:**

- `src/routes/(authenticated)/share/$linkId.tsx` — protected route
- `src/lib/sharing/functions.ts` — `accessSharedLink()` works without auth

### 12. Overview Dashboard Shows Mock Data

`getOverviewStats()` returns hardcoded/mock data instead of real database queries. Stats cards display placeholder numbers.

**Files involved:**

- `src/lib/stats/functions.ts`
- `src/components/overview/StatsCards.tsx`

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

### 19. Session Management UI

Sessions are stored with device info (IP address, user agent) but there is no UI for users to view active sessions, revoke sessions, or "logout from all devices."

### 20. Two-Factor Authentication (2FA / MFA)

Not implemented. No authenticator app integration, no SMS verification, no backup codes.

### 21. Email Change

Email field is displayed but disabled in the settings UI. Users cannot change their email address.

### 22. Image Metadata Viewer

No modal or panel to view full image metadata (dimensions, file size, upload date, EXIF data).

### 23. Legacy Gallery Components Cleanup

`src/components/gallery/` contains demo components with mock data alongside the production components in `src/components/images/`. The legacy gallery components should be reviewed and removed.

**Files involved:**

- `src/components/gallery/ImageGallery.tsx` — mock data
- `src/components/gallery/ImageCard.tsx` — mock data
- `src/components/images/` — production components

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

---

## Authentication & Security Detail

### Implemented

- Email/password signup with strong password validation (8+ chars, uppercase, lowercase, number, special char)
- Google OAuth login/signup
- Username system (3-30 chars, alphanumeric + dots/underscores) with availability checking
- Session management (90-day expiry, weekly refresh, cookie cache)
- User profile (avatar upload to S3, username editing)
- Auth middleware on all protected server functions
- Chrome extension auth state synchronization
- Role-based access control for team folders

### Missing

- Forgot password / password reset flow
- ~~Email verification (table exists, never used)~~ ✅ Flow implemented (needs Resend for actual emails)
- ~~Password change functionality~~ ✅ Implemented
- Account deletion / deactivation
- Multiple device session management UI
- 2FA / MFA support
- Rate limiting / brute force protection
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
| User-to-user sharing | 95% (missing email delivery) |
| Shared folders viewing | 95% (needs unauthenticated access) |
| Team folders | 90% |
| Clone shared folders | 100% |
| Invitation system | 95% (missing email delivery) |
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
- Rate limiting
- Security headers (CSP, HSTS, X-Frame-Options)
- Error tracking (Sentry or similar)
- Application logging beyond console.log
- Performance monitoring
- Analytics

---

## Suggested Pre-Launch Priority Order

1. Wire up email infrastructure (Resend) — unblocks password reset, verification emails, invitations
2. Implement password reset (forgot password flow)
3. Build the landing/home page
4. Add payments/subscriptions
5. Add rate limiting on auth + upload endpoints
6. Set up error tracking (Sentry)
7. Fix share link auth requirement (allow unauthenticated access)
8. Wire up real overview stats
9. Add SEO meta tags + Open Graph
10. Set up CI/CD + production deployment
11. Write core tests (auth flows, folder CRUD, sharing)
12. Add security headers

---

## Recently Completed

- ✅ **Password change functionality** — Full implementation with dialog, validation, email verification requirement
- ✅ **Email verification flow** — UI and server functions implemented (console.log placeholder for actual email sending)
- ✅ **OAuth user detection** — Shows "Signed in with Google" for users without password credentials
- ✅ **Shared password schema** — Consolidated validation rules across signup and password change
