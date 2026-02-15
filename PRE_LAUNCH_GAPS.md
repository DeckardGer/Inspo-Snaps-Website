# Pre-Launch Gaps

What's left before launching InspoSnaps.

---

## Before Launch

| # | Item | Priority | Notes |
|---|------|----------|-------|
| 1 | **Production deployment config** | Critical | No Dockerfile, CI/CD pipeline, or deployment automation. Only `docker-compose.yml` for local dev. |
| 2 | **Error tracking** | Critical | No Sentry or similar. Production errors will go unnoticed. |
| 3 | **Payments / subscriptions** | Critical | No billing integration. Pricing page exists but isn't wired to anything. |
| 4 | **Account deletion / data export** | High | No way for users to delete account or export data. May be a legal requirement (GDPR, CCPA). |
| 5 | **Application logging** | High | Only a single `console.log` in the entire backend. Need structured logging for production debugging. |
| 6 | **Local folder & image viewing** | High | No way to view folders and images stored locally. Need to be able to browse and view content without requiring S3/cloud storage. |

---

## After Launch

| # | Item | Priority | Notes |
|---|------|----------|-------|
| 7 | **Search / command palette (Cmd+K)** | Medium | See [detail](#7-search--command-palette). |
| 8 | **Move folder UI** | Medium | See [detail](#8-move-folder-ui). |
| 9 | **Move / copy images between folders** | Medium | Backend `addImageToFolder()` / `removeImageFromFolder()` exist but no folder picker UI. Shares the folder picker component with #8. |
| 10 | **Email templates styling** | Medium | Current templates are inline HTML/CSS strings. Could refactor to React Email for maintainability. |
| 11 | **User onboarding flow** | Medium | No guided tour or wizard. Only empty state CTAs ("Create your first folder"). |
| 12 | **Image caching improvements** | Medium | See [detail](#12-image-caching-improvements). |
| 13 | **Settings page polish** | Medium | Storage usage calculation, confirmation dialogs for danger zone actions, mobile layout improvements. Review progress/switch/radio-group component styling. |
| 14 | **Bulk operations** | Low | No multi-select, bulk delete, bulk move, or select-all in gallery. |
| 15 | **Email change** | Low | Field is displayed but disabled in settings. Better Auth supports `changeEmail` — straightforward to add. |
| 16 | **2FA / MFA** | Low | Low risk profile (image collections). Better Auth `twoFactor` plugin makes this easy to add as opt-in. |
| 17 | **OAuth account linking / unlinking** | Low | Can't link/unlink Google account from settings. |
| 18 | **Account lockout after failed attempts** | Low | Rate limiting covers most abuse; lockout is an extra layer. |
| 19 | **Auth audit logging** | Low | No logging for login attempts, password changes, or suspicious activity. |
| 20 | **Share link password protection** | Low | Share links have expiration but no optional password. |
| 21 | **Folder download as ZIP** | Low | No way to download a folder's images as a ZIP archive. |
| 22 | **Share analytics** | Low | No tracking of link access counts or sharing activity. |
| 23 | **Collaborative editing on shared folders** | Low | Shared folders are read-only. |
| 24 | **Performance monitoring / analytics** | Low | No APM, no user analytics. |
| 25 | **Login attempt notifications** | Low | No email alerts for suspicious login activity. |
| 26 | **Anonymous share link viewing** | Low | Share links require authentication. Could allow unauthenticated viewing as an option. |
| 27 | **Activity / audit logs for sharing** | Low | No logging of share link access or collaboration activity. |
| 28 | **Auto-expiring user-to-user shares** | Low | User shares persist indefinitely. No option to set an expiration. |
| 29 | **Custom per-folder permissions** | Low | Team folders use role-based permissions. No granular per-folder overrides. |
| 30 | **Monitor "action is not a function" error** | Low | TanStack Start server function error seen during HMR in dev. Likely doesn't occur in production but needs verification after deploy. See [TanStack issue #4486](https://github.com/TanStack/router/issues/4486). |
| 31 | **Clean up unused code** | Low | `getFolder` / `folderQueryOptions` in folders, `getSharedFolderContents` (unauthenticated version) in sharing. Wire up or remove. |

---

## Detail

### 7. Search / command palette

Universal command palette (Cmd+K / Ctrl+K) as the central hub for all app functionality.

- **Search** folders by name, jump to any folder/page/section
- **Context-aware actions** based on current location (folder: create/share/rename/delete/move, gallery: upload/select/filter, global: new folder/settings/theme)
- **Recent items** for quick access
- Consider `cmdk` library, dynamically registered actions, inline keyboard shortcut hints

### 8. Move folder UI

Backend `moveFolder()` exists with circular reference detection. Need the UI layer.

- [ ] Create folder picker component (tree view or breadcrumb-based)
- [ ] Add "Move to..." action in folder context menu
- [ ] Drag-and-drop support in folder grid
- [ ] Update clone shared folder mutation to accept destination `parentId`
- [ ] Fix clone mutation invalidation — currently invalidates root, should invalidate destination folder

### 12. Image caching improvements

Current state: presigned URLs expire after 7 days, rounded to daily intervals.

- **Quick win:** Increase expiration from 7 to 30 days
- **CDN integration:** CloudFront in front of S3 for edge caching and CDN-level signing
- **Signed cookies:** Replace per-URL signing with a single cookie — URLs become static and infinitely cacheable
- **Goal:** Reduce S3 bandwidth costs, improve load times, enable proper HTTP caching
