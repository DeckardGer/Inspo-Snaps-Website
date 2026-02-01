# Roadmap

Future features and ideas to implement.

---

## Command Menu

A universal command palette (Cmd+K / Ctrl+K) that serves as the central hub for all app functionality. Everything the system can do should be accessible from this menu.

**Core Capabilities:**

- **Search:** Search through every folder in the system by name
- **Navigation:** Quickly jump to any folder, page, or section
- **Context-aware actions:** Perform actions based on current location
  - In a folder: create subfolder, share folder, rename, delete, move
  - In gallery view: upload images, select all, filter/sort
  - Global: create new folder, go to settings, toggle theme
- **Recent items:** Quick access to recently visited folders/images

**Why:**
- Single access point for all app functionality
- Keyboard-first navigation for power users
- Reduces UI clutter by moving actions into searchable menu
- Common UX pattern users already understand (Notion, Linear, VS Code, Raycast)

**Implementation Notes:**
- Consider `cmdk` library for the core component
- Actions should be dynamically registered based on current context
- Support for keyboard shortcuts displayed inline (e.g., "New Folder ⌘N")

---

## Settings Page Review

Review and refine the new settings page implementation before making it functional.

**Components to Review:**

- **Progress component** (`src/components/ui/progress.tsx`)
  - Verify styling matches design system
  - Test with different value ranges
  - Consider adding size variants if needed
- **Switch component** (`src/components/ui/switch.tsx`)
  - Ensure accessibility (keyboard navigation, ARIA)
  - Test focus states
- **RadioGroup component** (`src/components/ui/radio-group.tsx`)
  - Verify checked/unchecked states render correctly
  - Test keyboard navigation between options

**Settings Page Items:**

- Wire up theme toggle to actual theme state
- Connect account fields to user data from auth
- Implement storage usage calculation from actual data
- Add confirmation dialogs for danger zone actions
- Consider mobile layout improvements (sidebar becomes dropdown?)
- Add save/cancel buttons or auto-save with toast feedback

---

## Improved Image Caching

Optimize presigned URL generation to maximize browser cache hits and reduce redundant S3 requests.

**Current State:**

- Presigned URLs expire after 7 days
- URLs are rounded to daily intervals for cache consistency
- Same image requested multiple times within a day gets identical URL

**Quick Win (TODO):**

- Increase expiration from 7 days to 30 days for better cache utilization

**Improvements Needed:**

- **CDN Integration:** Add CloudFront or similar CDN in front of S3
  - CDN caches responses at edge locations
  - Reduces latency for repeat requests
  - Handles URL signing at CDN level instead of per-request
- **Signed Cookies:** Replace per-URL signing with signed cookies
  - Single cookie authenticates all image requests
  - URLs become static and infinitely cacheable
  - Better browser cache utilization
- **Public bucket with CDN auth:** Consider making images public behind authenticated CDN
  - Simplest caching model
  - CDN handles access control via signed cookies or tokens

**Why:**

- Reduce S3 bandwidth costs
- Improve load times for returning visitors
- Enable proper HTTP caching headers without URL churn

---

## Investigate "Action is not a function" Error

Monitor and investigate whether the TanStack Start server function error occurs in production.

**Background:**

During development, we encountered `TypeError: action is not a function` errors when calling server functions (e.g., `getUploadUrl`, `saveImage`). This error originates from TanStack Start's server function handler when it cannot resolve a server function by ID.

**Known Causes (Development):**

- HMR (Hot Module Replacement) causes module invalidation
- Brief race condition window where handler references become `undefined`
- Static import chains from client code to server function modules
- Triggered by editing files in the import chain (e.g., `server.ts`, `auth.ts`, `db/index.ts`)

**Current Mitigations:**

- Moved download URL generation into `getFolderImages` server function (no separate client call)
- Used dynamic imports for upload functions to break static import chain
- Added 24-hour URL rounding with 7-day expiration for caching

**Production Investigation TODO:**

- [ ] Deploy and monitor for this error in production logs
- [ ] Verify error does NOT occur in production (as expected, since no HMR)
- [ ] If it does occur, investigate server cold start or module loading issues
- [ ] Consider reporting to TanStack if production issues found
- [ ] Document findings and close this item

**Related:**

- GitHub Issue: https://github.com/TanStack/router/issues/4486 (HMR race condition)
- Affected files: `src/lib/storage/functions.ts`, `src/lib/images/functions.ts`

---

## Email Support (Resend)

Integrate email functionality using Resend for transactional emails including folder sharing invitations and account verification.

### Folder Sharing Invitations

Enable users to share folders with others via email invitation.

**User Flow:**

- User enters recipient's email address when sharing a folder
- System sends email invitation with a unique link
- Recipient clicks link and is directed to the app:
  - **Existing user:** Prompted to accept or decline the invitation immediately
  - **New user:** Redirected to create an account, then returned to the invitation page to accept/decline

**Implementation Notes:**

- Generate unique, time-limited invitation tokens
- Store pending invitations in database with folder reference and recipient email
- Handle invitation expiration gracefully
- Consider notification preferences for invitation reminders

### Account Email Verification

Add email verification to the authentication flow to ensure valid email ownership.

**Current State:**

- Users can create accounts with just email and password
- No verification step required

**Proposed Flow:**

- User signs up with email and password
- System sends verification email with unique link
- User can access basic features without verification
- **Verification required for:** purchasing products, premium features
- Unverified accounts show reminder banner/prompt

**Implementation Notes:**

- Verification tokens with expiration (e.g., 24 hours)
- Resend verification email option
- Track verification status in user table
- Consider verification grace period before restricting features

**Technical Considerations:**

- Resend API integration and API key management
- Email templates for consistent branding
- Rate limiting to prevent email abuse
- Bounce and complaint handling
- Development/staging environment email handling (test mode)
- `sendInvitationEmail` in `src/lib/auth/auth.ts` currently logs to console instead of sending

---

## Move Folders

Add functionality to move folders into other folders, enabling better organization and hierarchy management.

**Core Capabilities:**

- **Move folders:** Relocate any folder to a different parent folder or to root
  - Drag-and-drop support in folder grid
  - Context menu "Move to..." action
  - Command palette integration for keyboard-driven moves
- **Clone shared folder to specific location:** When cloning a shared folder, allow selecting a destination folder instead of only cloning to root
  - Folder picker dialog for destination selection
  - Show folder hierarchy for easy navigation

**UI Considerations:**

- Folder picker component (tree view or breadcrumb-based navigation)
- Prevent circular moves (folder into itself or its descendants)
- Visual feedback during drag operations
- Confirmation for moves that would change sharing permissions

**Implementation Notes:**

- [ ] Update `updateFolder` server function to handle `parentId` changes
- [ ] Add move validation to prevent circular references
- [ ] Create folder picker component for destination selection
- [ ] Update clone shared folder mutation to accept destination `parentId`
- [ ] **TODO:** Update invalidation query for clone mutation - currently invalidates 'root' but should invalidate the specific destination folder being cloned into
- [ ] Add move support to extension API (`src/routes/api/extension/folders.ts` PATCH handler)
- Backend `moveFolder` function already exists in `src/lib/folders/functions.ts` but has no UI

---

## Review todo.txt Items

Review the components and routes listed in `todo.txt` and determine what needs attention.

**Components:**

- **Gallery** (`src/components/gallery/`)
  - `ImageGallery.tsx` and `ImageCard.tsx` exist but need review
  - Verify they work correctly with current image data and presigned URLs
  - Check responsive layout, loading states, and error handling
- **Overview** (`src/components/overview/`)
  - `StatsCards.tsx`, `StatCard.tsx`, and `StatsCardsSkeleton.tsx` exist but need review
  - `getOverviewStats` in `src/lib/stats/functions.ts` returns mock/hardcoded data — replace with actual database queries
  - Wire up to real database queries

**Routes:**

- **Overview** (`src/routes/(authenticated)/overview/index.tsx`)
  - Route exists but needs review
  - Verify it renders correctly with current overview components
  - Ensure stats display real data once stats functions are updated

---

## Unused Code to Wire Up or Remove

Functions and query options that exist but are not currently used by any UI. Wire these up when building the corresponding features, or remove if no longer needed.

**Folders:**

- `getFolder` in `src/lib/folders/functions.ts` — fetches a single folder with children/parent
- `folderQueryOptions` in `src/lib/folders/queries.ts` — query options for `getFolder`

**Sharing:**

- `getShareLinks` in `src/lib/sharing/functions.ts` — list non-expired share links for a folder
- `deleteShareLink` in `src/lib/sharing/functions.ts` — delete a share link by ID
- `revokeUserShare` in `src/lib/sharing/functions.ts` — revoke a user's access to a shared folder
- `accessSharedLink` in `src/lib/sharing/functions.ts` — access a shared folder via link (unauthenticated)
- `getSharedFolderContents` in `src/lib/sharing/functions.ts` — get folder contents via share link
- `shareLinksQueryOptions` in `src/lib/sharing/queries.ts` — query options for `getShareLinks`
- `sharedLinkAccessQueryOptions` in `src/lib/sharing/queries.ts` — query options for `accessSharedLink`


