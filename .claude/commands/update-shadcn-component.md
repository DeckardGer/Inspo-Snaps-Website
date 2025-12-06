---
description: Update a shadcn component to use our custom design system colors
---

Read the color mapping from `.claude/design-system-mappings.md`

Then update the shadcn component at **$ARGUMENTS** to replace all shadcn color classes/variables with our custom semantic color classes.

Common replacements:
- `bg-background` → use appropriate bg-* semantic class
- `text-foreground` → `text-primary`
- `text-muted-foreground` → `text-tertiary` or `text-secondary`
- `bg-muted` → `bg-secondary`
- `border` → `border-primary` or appropriate border class
- shadcn `primary` colors → brand colors
- shadcn `destructive` → destructive/error colors
- shadcn `secondary` → appropriate secondary styling

Preserve all functionality and component structure - only update the color classes.
