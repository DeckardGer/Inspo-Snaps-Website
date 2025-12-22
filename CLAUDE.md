# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Inspo Snaps** is a full-stack web application for managing, organizing, and sharing image collections through folders with collaborative features. Users can create hierarchical folder structures, store images, and share collections with others.

## Development Commands

```bash
# Install dependencies
pnpm install

# Start development server (runs on port 3000)
pnpm dev

# Build for production
pnpm build

# Preview production build
pnpm serve

# Run all tests
pnpm test

# Linting and formatting (uses Biome)
pnpm lint      # Check for linting issues
pnpm format    # Format code
pnpm check     # Run both linting and formatting checks

# Database operations (Drizzle ORM)
pnpm db:generate  # Generate migrations from schema
pnpm db:migrate   # Run migrations
pnpm db:push      # Push schema changes directly to database
pnpm db:pull      # Pull schema from database
pnpm db:studio    # Open Drizzle Studio (database UI)
```

## Tech Stack

### Frontend
- **Framework**: React 19 with TanStack Start (full-stack React)
- **Router**: TanStack Router (file-based routing)
- **State Management**: TanStack Query for server state
- **Form Handling**: TanStack React Form with Zod validation
- **Styling**: Tailwind CSS v4 + Shadcn UI components
- **Icons**: Hugeicons (free-icons + react packages)
- **Theme**: next-themes (light/dark/system)
- **Toasts**: Sonner

### Backend
- **Build Tool**: Vite with Nitro plugin for server-side capabilities
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: Better Auth (email/password + Google OAuth)
- **Storage**: AWS S3 for image files
- **Type Safety**: TypeScript strict mode

### Development & Quality
- **Linting/Formatting**: Biome (replaces ESLint + Prettier)
- **Testing**: Vitest + React Testing Library
- **Devtools**: TanStack Router & Query Devtools

## Project Structure

```
src/
├── routes/                        # File-based TanStack Router routes
│   ├── __root.tsx                # Root layout with document shell
│   ├── index.tsx                 # Landing page
│   ├── (auth-pages)/             # Public auth routes
│   │   ├── login.tsx
│   │   ├── signup.tsx
│   │   └── route.tsx             # Auth layout
│   ├── (authenticated)/          # Protected routes (require auth)
│   │   ├── route.tsx             # Layout with sidebar + navbar
│   │   ├── my-folders/
│   │   │   └── {-$folderId}.tsx  # Folder view with nested routing
│   │   ├── overview/index.tsx    # Dashboard with stats
│   │   ├── shared-folders/       # Shared folders (WIP)
│   │   ├── team-folders/         # Team folders (WIP)
│   │   └── settings/             # User settings
│   └── api/
│       └── auth/$.ts             # Auth API handler (Better Auth)
│
├── components/
│   ├── ui/                       # Shadcn UI components
│   ├── folders/                  # Folder management
│   │   ├── FolderCard.tsx        # Folder display with actions menu
│   │   ├── FolderGrid.tsx        # Responsive grid layout
│   │   ├── FolderModal.tsx       # Create/edit folder dialog
│   │   ├── FolderNotFound.tsx    # Error state
│   │   ├── FoldersEmptyState.tsx # Empty state UI
│   │   └── FoldersSkeleton.tsx   # Loading skeleton
│   ├── gallery/                  # Image gallery
│   │   ├── ImageGallery.tsx
│   │   └── ImageCard.tsx
│   ├── sidebar/                  # Navigation sidebar
│   │   ├── AppSidebar.tsx
│   │   ├── NavMain.tsx
│   │   ├── NavFavourites.tsx
│   │   └── SidebarAppFooter.tsx
│   ├── navbar/                   # Top navigation
│   │   ├── NavBar.tsx
│   │   └── HeaderBreadcrumbs.tsx
│   ├── overview/                 # Dashboard components
│   │   ├── StatsCards.tsx
│   │   └── StatCard.tsx
│   └── forms/                    # Form components
│       └── FieldWrapper.tsx
│
├── lib/                          # Business logic & utilities
│   ├── auth/                     # Authentication
│   │   ├── auth.ts               # Better Auth server instance
│   │   ├── auth-client.ts        # Better Auth React client
│   │   ├── functions.ts          # Server functions (getUser, checkUsername)
│   │   ├── queries.ts            # React Query options
│   │   └── middleware.ts         # Auth middleware
│   │
│   ├── db/                       # Database layer
│   │   ├── index.ts              # Drizzle ORM initialization
│   │   └── schema/               # Schema definitions
│   │       ├── auth.schema.ts
│   │       ├── folder.schema.ts
│   │       ├── image.schema.ts
│   │       ├── folder-image.schema.ts
│   │       ├── favourite-folder.schema.ts
│   │       ├── share-link.schema.ts
│   │       └── user-share.schema.ts
│   │
│   ├── folders/                  # Folder management
│   │   ├── functions.ts          # CRUD server functions
│   │   ├── queries.ts            # React Query options
│   │   └── constants.ts          # Folder colors & styling
│   │
│   ├── images/                   # Image management
│   │   ├── functions.ts          # Server functions
│   │   └── queries.ts            # React Query options
│   │
│   ├── storage/                  # S3 storage
│   │   ├── functions.ts          # Presigned URL generation
│   │   └── s3-client.ts          # AWS S3 client
│   │
│   ├── sharing/                  # Sharing/collaboration
│   │   ├── functions.ts
│   │   └── queries.ts
│   │
│   ├── stats/                    # Dashboard statistics
│   │   ├── functions.ts
│   │   └── queries.ts
│   │
│   ├── ThemeProvider.tsx
│   └── utils.ts                  # cn(), generateUserGradient()
│
├── hooks/
│   └── use-mobile.ts             # Mobile viewport detection
│
├── config/
│   └── env/
│       ├── client.ts             # Client env validation
│       └── server.ts             # Server env validation
│
├── router.tsx                    # Router config with SSR Query
└── routeTree.gen.ts              # Auto-generated routes
```

## Database Schema

### Auth Tables (Better Auth)
- **user**: id, name, email, emailVerified, image, username, displayUsername
- **session**: id, token, expiresAt, userId, ipAddress, userAgent
- **account**: id, accountId, providerId, userId, accessToken, refreshToken, password
- **verification**: id, identifier, value, expiresAt

### Core Tables
- **folder**: Hierarchical folders with parentId self-reference, color enum, emoji, userId
- **image**: Storage metadata (filename, storageKey, mimeType, dimensions, userId)
- **folder_image**: Many-to-many junction (images can exist in multiple folders)
- **favourite_folder**: User favorites (userId, folderId)
- **share_link**: Public sharing links with optional expiration
- **user_share**: Direct user-to-user folder sharing

## Features

### Implemented
- Email/password authentication
- Google OAuth login
- Username system with availability checking
- Create/edit/delete folders
- Hierarchical folder structure (nested folders)
- Folder colors (9 options) and emojis
- URL-based folder navigation with breadcrumbs
- Favorite folders
- Folder statistics (nested count, image count)
- Dashboard with stats cards
- Light/dark/system theme
- Responsive sidebar with collapsible navigation
- Skeleton loading states and empty states
- Toast notifications

### In Progress / Planned
- Image upload functionality
- Image gallery viewing
- Folder movement/organization
- Share link creation UI
- User-to-user sharing UI
- Shared folders viewing
- Team folders collaboration
- Command palette (Cmd+K)

## Server Functions

### Authentication (`lib/auth/functions.ts`)
- `getUser()` - Get current session user
- `checkUsernameAvailability()` - Validate username

### Folders (`lib/folders/functions.ts`)
- `createFolder()` - Create new folder
- `getFolders()` - Get folders by parent
- `updateFolder()` - Update folder properties
- `deleteFolder()` - Delete with cascade cleanup
- `getFolderPath()` - Get breadcrumb path
- `addFolderToFavourites()` / `removeFolderFromFavourites()`
- `getFavouriteFolders()` - Get user's favorites
- `getFolderStats()` - Get statistics

### Images (`lib/images/functions.ts`)
- `saveImage()` - Save image metadata
- `addImageToFolder()` / `removeImageFromFolder()`
- `deleteImage()` - Delete image and S3 object

### Storage (`lib/storage/functions.ts`)
- `getUploadUrl()` - Generate S3 presigned upload URL
- `getDownloadUrl()` - Generate S3 presigned download URL

### Sharing (`lib/sharing/functions.ts`)
- `createShareLink()` - Create public share link
- `shareWithUser()` - Share with specific user

## Key Patterns

### Server Functions
Use `createServerFn()` for server-side logic:
```typescript
export const myFunction = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(zodSchema)
  .handler(async ({ data, context }) => {
    // Access context.user for authenticated user
  });
```

### React Query
Define query options in `queries.ts` files:
```typescript
export const foldersQueryOptions = (parentId: string | null) =>
  queryOptions({
    queryKey: ["folders", parentId],
    queryFn: () => getFolders({ data: { parentId } }),
    staleTime: 5 * 60 * 1000,
  });
```

### Protected Routes
Routes in `(authenticated)/` require auth via `route.tsx` beforeLoad check.

### Form Validation
Use TanStack Form with Zod schemas for validation.

## Environment Variables

Required in `.env`:
```
DATABASE_URL=postgresql://user:password@host:port/database
BETTER_AUTH_SECRET=your-secret-key
BETTER_AUTH_URL=http://localhost:3000
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
AWS_ACCESS_KEY_ID=your-aws-key
AWS_SECRET_ACCESS_KEY=your-aws-secret
AWS_REGION=your-region
AWS_BUCKET_NAME=your-bucket
VITE_BASE_URL=http://localhost:3000
```

## Adding Features

**New Route**: Create file in `src/routes/`. Use `createFileRoute` for definition.

**New Component**: Add to `src/components/`. Follow existing patterns for folders/gallery.

**Database Change**:
1. Modify schema in `src/lib/db/schema/`
2. Run `pnpm db:generate` then `pnpm db:migrate`

**New Server Function**:
1. Add to appropriate `functions.ts` file
2. Add query options to `queries.ts` if needed
3. Use `authMiddleware` for protected endpoints

**Shadcn Component**: Run `pnpx shadcn@latest add <component-name>`

## Development Notes

- Dev server runs on port 3000
- Biome for linting/formatting (not ESLint/Prettier)
- Path alias `@/*` points to `./src/*`
- TanStack Devtools available in development
- Query stale times: 2-5 minutes depending on data
- Cookie cache enabled for auth sessions (5 min TTL)
