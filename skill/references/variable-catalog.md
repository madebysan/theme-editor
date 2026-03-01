# shadcn/ui CSS Variable Catalog

All CSS custom properties used by shadcn/ui with Tailwind v4. Grouped by the ThemeEditor tab sections.

## Core

| Variable | Description | Typical Light | Typical Dark |
|----------|------------|---------------|-------------|
| `--background` | Page background | `oklch(1 0 0)` | `oklch(0.145 0 0)` |
| `--foreground` | Default text color | `oklch(0.145 0 0)` | `oklch(0.985 0 0)` |

## Card

| Variable | Description | Typical Light | Typical Dark |
|----------|------------|---------------|-------------|
| `--card` | Card/surface background | `oklch(1 0 0)` | `oklch(0.205 0 0)` |
| `--card-foreground` | Card text color | `oklch(0.145 0 0)` | `oklch(0.985 0 0)` |
| `--popover` | Popover background | `oklch(1 0 0)` | `oklch(0.205 0 0)` |
| `--popover-foreground` | Popover text color | `oklch(0.145 0 0)` | `oklch(0.985 0 0)` |

## Primary

| Variable | Description | Typical Light | Typical Dark |
|----------|------------|---------------|-------------|
| `--primary` | Primary brand color (buttons, links) | `oklch(0.205 0 0)` | `oklch(0.922 0 0)` |
| `--primary-foreground` | Text on primary bg | `oklch(0.985 0 0)` | `oklch(0.205 0 0)` |

## Secondary

| Variable | Description | Typical Light | Typical Dark |
|----------|------------|---------------|-------------|
| `--secondary` | Secondary buttons, subtle bg | `oklch(0.97 0 0)` | `oklch(0.269 0 0)` |
| `--secondary-foreground` | Text on secondary bg | `oklch(0.205 0 0)` | `oklch(0.985 0 0)` |

## Muted

| Variable | Description | Typical Light | Typical Dark |
|----------|------------|---------------|-------------|
| `--muted` | Muted backgrounds | `oklch(0.97 0 0)` | `oklch(0.269 0 0)` |
| `--muted-foreground` | Muted text (placeholders, hints) | `oklch(0.556 0 0)` | `oklch(0.708 0 0)` |

## Accent

| Variable | Description | Typical Light | Typical Dark |
|----------|------------|---------------|-------------|
| `--accent` | Accent backgrounds (hover states) | `oklch(0.97 0 0)` | `oklch(0.269 0 0)` |
| `--accent-foreground` | Text on accent bg | `oklch(0.205 0 0)` | `oklch(0.985 0 0)` |

## Destructive

| Variable | Description | Typical Light | Typical Dark |
|----------|------------|---------------|-------------|
| `--destructive` | Error/danger color | `oklch(0.577 0.245 27.325)` | `oklch(0.704 0.191 22.216)` |

## Borders & Inputs

| Variable | Description | Typical Light | Typical Dark |
|----------|------------|---------------|-------------|
| `--border` | Default border color | `oklch(0.922 0 0)` | `oklch(1 0 0 / 10%)` |
| `--input` | Input border color | `oklch(0.922 0 0)` | `oklch(1 0 0 / 15%)` |
| `--ring` | Focus ring color | `oklch(0.708 0 0)` | `oklch(0.556 0 0)` |

## Charts

| Variable | Description | Typical Light | Typical Dark |
|----------|------------|---------------|-------------|
| `--chart-1` | Chart color 1 | `oklch(0.646 0.222 41.116)` | `oklch(0.488 0.243 264.376)` |
| `--chart-2` | Chart color 2 | `oklch(0.6 0.118 184.704)` | `oklch(0.696 0.17 162.48)` |
| `--chart-3` | Chart color 3 | `oklch(0.398 0.07 227.392)` | `oklch(0.769 0.188 70.08)` |
| `--chart-4` | Chart color 4 | `oklch(0.828 0.189 84.429)` | `oklch(0.627 0.265 303.9)` |
| `--chart-5` | Chart color 5 | `oklch(0.769 0.188 70.08)` | `oklch(0.645 0.246 16.439)` |

## Sidebar

| Variable | Description | Typical Light | Typical Dark |
|----------|------------|---------------|-------------|
| `--sidebar` | Sidebar background | `oklch(0.985 0 0)` | `oklch(0.205 0 0)` |
| `--sidebar-foreground` | Sidebar text | `oklch(0.145 0 0)` | `oklch(0.985 0 0)` |
| `--sidebar-primary` | Sidebar active/selected | `oklch(0.205 0 0)` | `oklch(0.488 0.243 264.376)` |
| `--sidebar-primary-foreground` | Text on sidebar primary | `oklch(0.985 0 0)` | `oklch(0.985 0 0)` |
| `--sidebar-accent` | Sidebar hover/accent | `oklch(0.97 0 0)` | `oklch(0.269 0 0)` |
| `--sidebar-accent-foreground` | Text on sidebar accent | `oklch(0.205 0 0)` | `oklch(0.985 0 0)` |
| `--sidebar-border` | Sidebar border | `oklch(0.922 0 0)` | `oklch(1 0 0 / 10%)` |
| `--sidebar-ring` | Sidebar focus ring | `oklch(0.708 0 0)` | `oklch(0.556 0 0)` |

## Radius

| Variable | Description | Default |
|----------|------------|---------|
| `--radius` | Base border radius | `0.625rem` |

Derived radius values (in `@theme inline`):
- `--radius-sm`: `calc(var(--radius) - 4px)`
- `--radius-md`: `calc(var(--radius) - 2px)`
- `--radius-lg`: `var(--radius)`
- `--radius-xl`: `calc(var(--radius) + 4px)`
- `--radius-2xl`: `calc(var(--radius) + 8px)`
- `--radius-3xl`: `calc(var(--radius) + 12px)`
- `--radius-4xl`: `calc(var(--radius) + 16px)`

## Typography

Font variables are defined in `@theme inline` or `@theme`:
- `--font-sans` — Primary sans-serif font
- `--font-mono` — Monospace font
- `--font-heading` — Heading font (custom, not standard shadcn)

---

## Complete Variable List (for JSON validation)

All standard variables the theme editor controls:

```
background, foreground,
card, card-foreground,
popover, popover-foreground,
primary, primary-foreground,
secondary, secondary-foreground,
muted, muted-foreground,
accent, accent-foreground,
destructive,
border, input, ring,
chart-1, chart-2, chart-3, chart-4, chart-5,
sidebar, sidebar-foreground,
sidebar-primary, sidebar-primary-foreground,
sidebar-accent, sidebar-accent-foreground,
sidebar-border, sidebar-ring
```

Total: 30 color variables + 1 radius + fonts = ~32 controllable values per mode.
