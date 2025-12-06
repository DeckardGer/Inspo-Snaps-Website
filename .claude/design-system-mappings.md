# Design System Color Mappings

This file documents when and where to use each semantic color token in the design system.

## Text Colors
Use text color variables to manage all text fill colors in your designs across light and dark modes.

| Token | Usage |
|-------|-------|
| `text-primary` | Primary text such as page headings |
| `text-primary_on-brand` | Primary text when used on solid brand color backgrounds. Commonly used for brand theme website sections (e.g. CTA sections) |
| `text-secondary` | Secondary text such as labels and section headings |
| `text-secondary_hover` | Secondary text when in hover state |
| `text-secondary_on-brand` | Secondary text when used on solid brand color backgrounds. Commonly used for brand theme website sections (e.g. CTA sections) |
| `text-tertiary` | Tertiary text such as supporting text and paragraph text |
| `text-tertiary_hover` | Tertiary text when in hover state |
| `text-tertiary_on-brand` | Tertiary text when used on solid brand color backgrounds. Commonly used for brand theme website sections (e.g. CTA sections) |
| `text-quaternary` | Quaternary text for more subtle and lower-contrast text, such as footer column headings |
| `text-quaternary_on-brand` | Quaternary text when used on solid brand color backgrounds. Commonly used for brand theme website sections (e.g. footers) |
| `text-white` | Text that is always white, regardless of the mode |
| `text-disabled` | Default color for disabled text such as disabled input fields or buttons |
| `text-placeholder` | Default color for placeholder text such as input field placeholders |
| `text-placeholder_subtle` | A more subtle (lower contrast) alternative text. Useful for components such as verification code input fields |
| `text-brand-primary` | Primary brand text useful for heading (e.g. cards in pricing page headers) |
| `text-brand-secondary` | Secondary brand text for brand buttons, as well as accented text, highlights, and subheadings (e.g. subheadings in blog post cards) |
| `text-brand-secondary_hover` | Secondary brand text when in hover state (e.g. brand buttons) |
| `text-brand-tertiary` | Tertiary brand text for lighter accented text and highlights (e.g. numbers in metric cards) |
| `text-brand-tertiary_alt` | An alternative to tertiary brand text that is lighter in dark mode (e.g. numbers in metric cards) |
| `text-error-primary` | Default error state semantic text color (e.g. input field error states) |
| `text-warning-primary` | Default warning state semantic text color |
| `text-success-primary` | Default success state semantic text color |

## Border Colors
Use border color variables to manage all stroke colors in your designs across light and dark modes.

| Token | Usage |
|-------|-------|
| `border-primary` | High contrast borders. These are used for components such as input fields, button groups, and checkboxes |
| `border-secondary` | Medium contrast borders. This is the most commonly used border color and is the default for most components (such as file uploaders), cards (such as tables), and content dividers |
| `border-secondary_alt` | An alternative to secondary border that uses alpha transparency. This is used exclusively for floating menus such as input dropdowns and notifications to create a sharper bottom border |
| `border-tertiary` | low contrast border useful for very subtle dividers and border such as line and bar chart axis dividers |
| `border-disabled` | Default disabled border color for disabled states in components such as input fields and checkboxes |
| `border-disabled_subtle` | A more subtle (lower contrast) alternative for disabled borders such as disabled buttons |
| `border-brand` | Default brand border color. Useful for active states in components such as input fields |
| `border-brand_alt` | A brand border color that switches to gray when in dark mode. Useful for components such as brand-style variants of banners and footers |
| `border-error` | Default error state semantic border color. Useful for error states in components such as input fields and file uploaders |
| `border-error_subtle` | A more subtle (lower contrast) alternative for error state semantic borders such as error state input fields |
| `border-warning` | Default warning state semantic border color. Useful for warning states in components such as input fields and file uploaders |
| `border-warning_subtle` | A more subtle (lower contrast) alternative for warning state semantic borders such as warning state input fields |
| `border-success` | Default success state semantic border color. Useful for success states in components such as input fields and file uploaders |
| `border-success_subtle` | A more subtle (lower contrast) alternative for success state semantic borders such as success state input fields |

## Foreground Colors
Use foreground color variables to manage all non-text foreground colors (icons, etc.) in your designs across light and dark modes.

| Token | Usage |
|-------|-------|
| `fg-primary` | Highest contrast non-text foreground elements such as icons |
| `fg-secondary` | High contrast non-text foreground elements such as icons |
| `fg-secondary_hover` | Secondary foreground elements when in hover state |
| `fg-tertiary` | Medium contrast non-text foreground elements such as icons |
| `fg-tertiary_hover` | Tertiary foreground elements when in hover state |
| `fg-quaternary` | Low contrast non-text foreground elements such as icons in buttons, help icons, and icons used in input fields |
| `fg-quaternary_hover` | Quaternary foreground elements when in hover state, such as help icons |
| `fg-white` | Foreground elements that are always white, regardless of the mode |
| `fg-disabled` | Default color for disabled non-text foreground elements such as icons in disabled button group buttons and input dropdown menu items |
| `fg-disabled_subtle` | A more subtle (lower contrast) alternative for non-text disabled foreground elements such as disabled active checkboxes and tag checkboxes |
| `fg-brand-primary` | Primary brand color non-text foreground elements such as featured icons and progress bars |
| `fg-brand-primary_alt` | An alternative for primary brand color non-text foreground elements that switches to gray when in dark mode such as active horizontal tabs |
| `fg-brand-secondary` | Secondary brand color non-text foreground elements such as accents and arrows in marketing site sections (e.g. hero header sections) |
| `fg-brand-secondary_alt` | An alternative for secondary brand color non-text foreground elements that switches to gray when in dark mode such as brand buttons |
| `fg-error-primary` | Primary error state color for non-text foreground elements such as featured icons |
| `fg-error-secondary` | Secondary error state color for non-text foreground elements such as icons in error state input fields and negative metrics item charts and icons |
| `fg-warning-primary` | Primary warning state color for non-text foreground elements such as featured icons |
| `fg-warning-secondary` | Secondary warning state color for non-text foreground elements |
| `fg-success-primary` | Primary success state color for non-text foreground elements such as featured icons |
| `fg-success-secondary` | Secondary success state color for non-text foreground elements such as button dots, avatar online indicator dots, and negative metrics item charts and icons |

## Background Colors
Use background color variables to manage all fill colors for elements in your designs across light and dark modes.

| Token | Usage |
|-------|-------|
| `bg-primary` | The primary background color (white) used across all layouts and components |
| `bg-primary_alt` | An alternative primary background color (white) that switches to bg-secondary when in dark mode |
| `bg-primary_hover` | Primary background hover color. This acts as the default hover state background color for components with white backgrounds (e.g. input dropdown menu items) |
| `bg-primary-solid` | The primary dark background color used across layouts and components. This switches to bg-secondary when in dark mode and is useful for components such as tooltips and text editor tooltips |
| `bg-secondary` | The secondary background color used to create contrast against white backgrounds, such as website sections backgrounds |
| `bg-secondary_alt` | An alternative secondary background color that switches to bg-primary when in dark mode. Useful for components such as border-style horizontal tabs |
| `bg-secondary_hover` | Secondary background hover color. Useful for hover states for components with gray-50 backgrounds such as active states (e.g. navigation items and date pickers) |
| `bg-secondary_subtle` | An alternative secondary background color that is slightly lighter and more subtle in light mode. This is useful for components such as banners |
| `bg-secondary-solid` | The secondary dark background color used across layouts and components. This is useful for components such as featured icons |
| `bg-tertiary` | The tertiary background color used to create contrast against light backgrounds such as toggles |
| `bg-tertiary_hover` | Tertiary background hover color. Useful for hover states for components with light backgrounds |
| `bg-quaternary` | The quaternary background color used to create contrast against light backgrounds, such as sliders and progress bars |
| `bg-active` | Default active background color for components such as selected menu items in input dropdowns |
| `bg-disabled` | Default disabled background color for components such as disabled primary buttons and toggles |
| `bg-disabled_subtle` | An alternative disabled background color that is more subtle. This is useful for components such as disabled input fields and checkboxes |
| `bg-overlay` | Default background color for background overlays. These are useful for overlay components such as modals |
| `bg-brand-primary` | The primary brand background color. Useful for components such as check icons |
| `bg-brand-primary_alt` | An alternative primary brand background color that switches to bg-secondary when in dark mode. Useful for components such as active horizontal tabs |
| `bg-brand-secondary` | The secondary brand background color. Useful for components such as featured icons |
| `bg-brand-solid` | Default solid (dark) brand background color. Useful for components such as toggles and messages |
| `bg-brand-solid_hover` | Solid brand background color when in hover state. Useful for components such as toggles |
| `bg-brand-section` | This is the default dark brand color background used for website sections such as CTA sections and testimonial sections. Switches to bg-secondary when in dark mode |
| `bg-brand-section_subtle` | An alternative brand section background color to provide contrast for website sections such as FAQ sections. Switches to bg-primary when in dark mode |
| `bg-error-primary` | Primary error state background color for components such as buttons |
| `bg-error-secondary` | Secondary error state background color for components such as featured icons |
| `bg-error-solid` | Default solid (dark) error state background color for components such as buttons, featured icons and metric items |
| `bg-error-solid_hover` | Default solid (dark) error hover state background color for components such as buttons |
| `bg-warning-primary` | Primary warning state background color for components |
| `bg-warning-secondary` | Secondary warning state background color for components such as featured icons |
| `bg-warning-solid` | Default solid (dark) warning state background color for components such as featured icons |
| `bg-success-primary` | Primary success state background color for components |
| `bg-success-secondary` | Secondary success state background color for components such as featured icons |
| `bg-success-solid` | Default solid (dark) success state background color for components such as featured icons and metric items |

## Shadcn Component Mapping

When updating shadcn components with `/update-shadcn-component`, use these mappings:

| Shadcn Variable/Class | Replace With | Notes |
|----------------------|--------------|-------|
| `bg-background` | `bg-primary` | Main page background |
| `text-foreground` | `text-primary` | Primary text |
| `bg-card` | `bg-primary` | Card backgrounds |
| `text-card-foreground` | `text-primary` | Card text |
| `bg-popover` | `bg-primary` | Popover/dropdown backgrounds |
| `text-popover-foreground` | `text-primary` | Popover/dropdown text |
| `bg-muted` | `bg-secondary` | Muted/subtle backgrounds |
| `text-muted-foreground` | `text-tertiary` | Muted/subtle text |
| `bg-accent` | `bg-secondary_hover` | Accent/hover backgrounds |
| `text-accent-foreground` | `text-primary` | Accent text |
| `border` or `border-border` | `border-primary` or `border-secondary` | Default borders |
| `bg-input` | `bg-primary` | Input field backgrounds |
| `border-input` | `border-primary` | Input field borders |
| `bg-primary` (shadcn) | `bg-brand-solid` | Primary brand buttons |
| `text-primary-foreground` | `text-primary_on-brand` | Text on brand buttons |
| `bg-secondary` (shadcn) | `bg-secondary` | Secondary buttons |
| `text-secondary-foreground` | `text-secondary` | Secondary button text |
| `bg-destructive` | `bg-error-solid` | Destructive/error buttons |
| `text-destructive-foreground` | `text-primary_on-brand` | Destructive button text |
| `ring` or `ring-ring` | `border-brand/50` | Focus ring color |

## Quick Reference

### Common Patterns

**Cards:**
- Background: `bg-primary`
- Border: `border-secondary`
- Heading: `text-primary`
- Body text: `text-tertiary`

**Input Fields:**
- Background: `bg-primary`
- Border (default): `border-primary`
- Border (focus): `border-brand`
- Text: `text-primary`
- Placeholder: `text-placeholder`
- Error border: `border-error`
- Error text: `text-error-primary`

**Buttons (Primary):**
- Background: `bg-brand-solid`
- Hover: `bg-brand-solid_hover`
- Text: `text-primary_on-brand`

**Buttons (Secondary):**
- Background: `bg-secondary`
- Hover: `bg-secondary_hover`
- Text: `text-secondary`
- Border: `border-secondary`

**Icons:**
- Primary: `fg-primary` or `text-primary`
- Secondary: `fg-secondary` or `text-secondary`
- Tertiary: `fg-tertiary` or `text-tertiary`
- On brand: `fg-white` or `text-primary_on-brand`
