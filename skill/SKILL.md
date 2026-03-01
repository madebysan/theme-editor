---
name: theme-editor
description: Inject a floating visual theme editor into any React + Tailwind v4 + shadcn/ui project. Tweak colors, fonts, radius, shadows, and presets live in the browser. 14 built-in presets, undo/redo, shuffle, export/import. Three phases — inject, apply, remove.
user_invocable: true
---

# Theme Editor v2

A modular floating theme editor for React + Tailwind v4 + shadcn/ui projects.

**Features:**
- 14 color presets with prev/next navigation
- Project-aware color tokens (adapts to whatever variables the project actually uses)
- Undo/redo with Cmd+Z / Cmd+Shift+Z keyboard shortcuts
- Shuffle per category (colors, type, style) or shuffle everything
- 10 curated Google Font pairings with auto-loading
- 6 style combos (Sharp, Rounded, Default, Soft, Bold, Minimal)
- Export as CSS or JSON, import from JSON file
- LocalStorage persistence across sessions
- Dev-only rendering (stripped from production builds)
- Floating popover anchored bottom-left with arrow indicator

## Prerequisites

- React project with Tailwind CSS **v4+** and shadcn/ui
- CSS file using `@theme inline {}` with CSS variables (standard shadcn v4 setup)
- Dev server running (`npm run dev` or `next dev`)

If the project uses Tailwind v3 or earlier, tell the user: "Theme Editor requires Tailwind CSS v4+. Your project appears to use an earlier version."

---

## Architecture

11 files get injected into the project:

| Asset file | Target path (under {root}/) | Purpose |
|------------|---------------------------|---------|
| `useTheme.ts` | `hooks/useTheme.ts` | State with useReducer, undo/redo (50 states), debounced persistence |
| `theme-defaults.ts` | `lib/theme-defaults.ts` | Token definitions — **GENERATED per project from CSS + component audit** |
| `theme-storage.ts` | `lib/theme-storage.ts` | localStorage CRUD — **update STORAGE_KEY per project** |
| `theme-apply.ts` | `lib/theme-apply.ts` | Sets/removes CSS vars on document.documentElement |
| `theme-presets.ts` | `lib/theme-presets.ts` | 14 presets using project token names, 10 font pairings, 6 style combos, font loader |
| `ThemeDrawer.tsx` | `components/theme-editor/ThemeDrawer.tsx` | Main floating popover UI |
| `ColorControl.tsx` | `components/theme-editor/ColorControl.tsx` | Color picker with hex input |
| `FontControl.tsx` | `components/theme-editor/FontControl.tsx` | Font input with Google Fonts auto-loading |
| `RangeControl.tsx` | `components/theme-editor/RangeControl.tsx` | Range slider for numeric tokens |
| `ChoiceControl.tsx` | `components/theme-editor/ChoiceControl.tsx` | Segmented button group for discrete options |
| `ThemeExportImport.tsx` | `components/theme-editor/ThemeExportImport.tsx` | Export CSS/JSON, import JSON |

Where `{root}` is `src/` for Vite projects or `` (project root) for Next.js App Router.

---

## Critical Concept: Static vs Dynamic CSS Variables

In Tailwind v4, there are two ways to define theme tokens — and only one of them works with a runtime theme editor:

| Block | How it works | Can override at runtime? |
|-------|-------------|-------------------------|
| `@theme { --color-brand: #00A82D; }` | Compiled **statically** into utility classes (`bg-brand { background-color: #00A82D; }`) | **NO** — changing `--color-brand` on the DOM does nothing |
| `@theme inline { --color-brand: var(--brand); }` + `:root { --brand: #00A82D; }` | Compiled into utility classes that use `var()` (`bg-brand { background-color: var(--color-brand); }`) | **YES** — changing `--brand` on `documentElement.style` cascades through |

**The editor ONLY works with the `@theme inline` + `:root` pattern.** Any color variables in `@theme {}` (without `inline`) MUST be restructured before injection.

---

## Phase 1: Inject

Triggered by `/theme-editor` or "inject theme editor" or "add theme editor".

### Steps

1. **Detect project type:**
   - `next.config.*` exists → Next.js → `root=''`, CSS at `app/globals.css`, layout at `app/layout.tsx`
   - `vite.config.*` exists → Vite → `root='src'`, CSS at `src/index.css`, entry at `src/App.tsx`
   - If neither found, ask the user where their CSS and root component are

2. **Verify Tailwind v4:**
   - Read the CSS file — look for `@theme inline` or `@theme {`
   - If not found, warn: "This doesn't look like a Tailwind v4 project"

3. **Install lucide-react** if not present:
   - `npm ls lucide-react 2>/dev/null || npm install lucide-react`

4. **Audit which tokens actually drive the UI** (THE CRITICAL STEP):

   This step determines what the editor controls. Skipping it means the editor changes invisible variables.

   a. **Read the CSS file** and categorize every variable:
      - Variables in `@theme {}` → **static tokens** (need restructuring)
      - Variables in `@theme inline {}` → **dynamic tokens** (already good)
      - Variables in `:root {}` → **base values** (what the editor will set)

   b. **Grep the components** (`src/components/` or `app/`) to find which Tailwind color utilities are actually used:
      ```
      # Look for color utility patterns like bg-brand, text-heading, etc.
      grep -roh '\b\(bg\|text\|border\|ring\|outline\)-[a-z][a-z0-9-]*' src/components/ | sort -u
      ```

   c. **Classify the project** into one of these patterns:

   | Pattern | How to detect | What to do |
   |---------|--------------|------------|
   | **Standard shadcn** | Components use `bg-primary`, `text-foreground`, `bg-secondary`, etc. All color tokens are in `:root {}` referenced via `@theme inline {}`. | Use asset templates as-is. The standard 19 shadcn color tokens work. |
   | **Custom tokens** | Components use project-specific utilities like `bg-brand`, `text-heading`, `bg-background-alt`. These are defined in `@theme {}` (static). | **Restructure CSS** (step 5), then generate custom token lists. |
   | **Hybrid** | Mix of standard shadcn utilities AND custom ones. | Restructure the custom tokens, include both sets in the editor. |

   d. **Build the token map** — for each custom color variable found in components, note:
      - The utility name used in components (e.g., `bg-brand`)
      - The Tailwind token (e.g., `--color-brand`)
      - The current value from `@theme {}` or `:root {}` (e.g., `#00A82D`)
      - A human-readable label for the editor (e.g., "Brand")

5. **Restructure static `@theme {}` variables** (if custom tokens pattern detected):

   For every custom color/font variable in `@theme {}`, move it to the dynamic pattern:

   **Before:**
   ```css
   @theme {
     --color-brand: #00A82D;
     --color-brand-hover: #009426;
     --color-heading: #1A1A1A;
     --color-body: #4A4A4A;
     --font-sans: 'DM Sans', sans-serif;
   }
   ```

   **After:**
   ```css
   @theme {
     --font-sans: 'DM Sans', sans-serif;
   }

   /* Add to @theme inline: */
   @theme inline {
     --color-brand: var(--brand);
     --color-brand-hover: var(--brand-hover);
     --color-heading: var(--heading);
     --color-body: var(--body-text);
   }

   /* Add to :root: */
   :root {
     --brand: #00A82D;
     --brand-hover: #009426;
     --heading: #1A1A1A;
     --body-text: #4A4A4A;
   }
   ```

   **Naming convention:** The `:root` variable drops the `--color-` prefix. The `@theme inline` entry maps `--color-X` → `var(--X)`. This matches the existing shadcn pattern (`--color-primary: var(--primary)`).

   **Font exception:** `--font-sans` can stay in `@theme {}` because the `body { font-family: var(--font-sans); }` rule already uses `var()`. The editor overrides `--font-sans` via inline style on `documentElement`, which takes precedence over the `@theme`-generated value. No restructuring needed for fonts.

6. **Link shadcn tokens to custom tokens** (if custom tokens pattern detected):

   When a project uses custom tokens, the standard shadcn tokens (used by the editor UI and `@layer base`) should follow the custom ones. This way, changing `--brand` in the editor also updates the editor's own accent color, borders, etc.

   In `:root {}`, replace standalone shadcn values with `var()` references:
   ```css
   :root {
     /* Custom tokens (editor controls these) */
     --brand: #00A82D;
     --heading: #1A1A1A;
     --body-text: #4A4A4A;
     --background-alt: #F7F7F5;
     --surface: #FFFFFF;

     /* Shadcn tokens follow custom tokens */
     --primary: var(--brand);
     --ring: var(--brand);
     --foreground: var(--heading);
     --card-foreground: var(--heading);
     --popover-foreground: var(--heading);
     --secondary-foreground: var(--heading);
     --accent-foreground: var(--heading);
     --muted-foreground: var(--body-text);
     --secondary: var(--background-alt);
     --muted: var(--background-alt);
     --accent: var(--background-alt);
     --card: var(--surface);
     --popover: var(--surface);

     /* These stay independent */
     --background: #FFFFFF;
     --border: #E5E5E5;
     --input: #E5E5E5;
     --destructive: #EF4444;
     --primary-foreground: #FFFFFF;
   }
   ```

   **Mapping guide** — match each shadcn token to the closest custom token:

   | Shadcn token | Links to | Rationale |
   |-------------|----------|-----------|
   | `--primary` | `var(--brand)` or equivalent accent token | Both serve as the primary accent |
   | `--ring` | `var(--brand)` | Focus rings should match the accent |
   | `--foreground` | `var(--heading)` or darkest text token | Both are the darkest text color |
   | `--card-foreground`, `--popover-foreground`, `--secondary-foreground`, `--accent-foreground` | `var(--heading)` | Text on surfaces should match headings |
   | `--muted-foreground` | `var(--body-text)` or body text token | Both are the secondary text color |
   | `--secondary`, `--muted`, `--accent` | `var(--background-alt)` or alt background token | Both are subtle background tints |
   | `--card`, `--popover` | `var(--surface)` or card/surface token | Both are elevated surface colors |

   Tokens without a clear custom equivalent stay at their CSS values (don't link them):
   - `--background` — page background (may differ from surfaces)
   - `--border`, `--input` — border colors
   - `--destructive` — error color
   - `--primary-foreground` — text on primary (usually white)
   - Chart tokens, sidebar tokens — leave as-is

7. **Copy asset files** from `~/.claude/skills/theme-editor/assets/` to the project:
   - Read each asset file and write it to the target path under `{root}/`
   - Create directories as needed (`hooks/`, `lib/`, `components/theme-editor/`)

8. **Generate `theme-defaults.ts`:**

   This file must list the tokens the editor actually controls — NOT a copy of the template.

   **For standard shadcn projects:**
   - Use the template from `assets/theme-defaults.ts`
   - Replace each `defaultValue` with the actual hex value from the project's `:root {}`
   - Convert oklch values to hex for the color picker
   - Remove tokens the project doesn't define

   **For custom token projects:**
   - Build the token list from the audit in step 4
   - Each entry is a `:root` variable the editor sets (e.g., `--brand`, `--heading`, `--background-alt`)
   - Also include key independent shadcn tokens that affect the page (typically `--background`, `--border`)
   - Labels should be human-readable and describe what changes on the page (e.g., "Brand" not "--brand")
   - Default values are hex, taken from the `:root {}` block

   Example for a custom-token project:
   ```ts
   export const THEME_TOKENS: ThemeToken[] = [
     { cssVar: '--brand', label: 'Brand', defaultValue: '#00A82D', category: 'color' },
     { cssVar: '--brand-hover', label: 'Brand hover', defaultValue: '#009426', category: 'color' },
     { cssVar: '--heading', label: 'Heading text', defaultValue: '#1A1A1A', category: 'color' },
     { cssVar: '--body-text', label: 'Body text', defaultValue: '#4A4A4A', category: 'color' },
     { cssVar: '--background', label: 'Page background', defaultValue: '#FFFFFF', category: 'color' },
     { cssVar: '--background-alt', label: 'Section background', defaultValue: '#F7F7F5', category: 'color' },
     { cssVar: '--surface', label: 'Card / Surface', defaultValue: '#FFFFFF', category: 'color' },
     { cssVar: '--footer-bg', label: 'Footer background', defaultValue: '#1A1A1A', category: 'color' },
     { cssVar: '--footer-text', label: 'Footer text', defaultValue: '#FFFFFF', category: 'color' },
     { cssVar: '--border', label: 'Border', defaultValue: '#E5E5E5', category: 'color' },
     // Font, radius, shadow, border, spacing tokens follow...
   ]
   ```

9. **Generate `theme-presets.ts`:**

   Presets must use the project's token names, not generic shadcn names.

   **For standard shadcn projects:**
   - Use the template from `assets/theme-presets.ts` as-is

   **For custom token projects:**
   - Each preset sets the project's custom `:root` variables
   - Map each preset's identity to the project's token structure:

   | Preset value | Maps to custom token | How to derive |
   |-------------|---------------------|---------------|
   | Primary color | `--brand` | The preset's accent color |
   | Primary hover | `--brand-hover` | ~15% darker than brand |
   | Foreground | `--heading` | The preset's darkest text |
   | Muted foreground | `--body-text` | Medium gray matching the preset's neutral family |
   | Page background | `--background` | The preset's lightest color |
   | Secondary/alt bg | `--background-alt` | A light tint of the preset's accent |
   | Card/surface | `--surface` | Usually `#FFFFFF` |
   | Footer bg | `--footer-bg` | Same as `--heading` (dark) |
   | Footer text | `--footer-text` | Usually `#FFFFFF` |
   | Border | `--border` | The preset's neutral border color |

   The shadcn tokens the editor UI needs (`--primary`, `--foreground`, `--popover`, etc.) automatically follow the custom tokens via the `var()` links from step 6 — no need to set them in presets.

10. **Update `theme-storage.ts`:**
    - Read the project's `package.json` to get the project name
    - Replace the STORAGE_KEY `'theme-editor-overrides'` with `'{project-name}-theme-overrides'`
    - Write to `{root}/lib/theme-storage.ts`

11. **Add missing CSS tokens** to the project's CSS file (`:root {}` and `@theme inline {}`):
    These tokens are needed for full editor functionality. Add them ONLY if they don't already exist:

    In `:root {}`:
    ```css
    --radius-button: 9999px;
    --shadow: none;
    --input-border-width: 1px;
    ```

    In `@theme inline {}`:
    ```css
    --radius-button: var(--radius-button);
    --shadow-theme: var(--shadow);
    ```

12. **Wire ThemeDrawer into the root layout:**
    - Add import at top: `import ThemeDrawer from '{path}/components/theme-editor/ThemeDrawer'`
    - Add dev-only JSX as the last child before the closing tag:
      - **Vite:** `{import.meta.env.DEV && <ThemeDrawer />}`
      - **Next.js:** `{process.env.NODE_ENV === 'development' && <ThemeDrawer />}`

13. **Add early theme restore** to the entry point:
    - In `main.tsx` (Vite) or `layout.tsx` (Next.js), add before the app renders:
      ```ts
      import { applyStoredThemeOverrides } from '{path}/lib/theme-apply'
      applyStoredThemeOverrides()
      ```
    - This ensures persisted theme loads on every page refresh without a flash

14. **Type check:** `npx tsc --noEmit` — fix any errors

15. **Report to user:**
    ```
    Theme editor injected! Refresh your browser — you'll see a paintbrush icon in the bottom-left corner.

    Token structure: [standard shadcn | custom tokens | hybrid]
    Color tokens exposed: [list the token labels]
    CSS restructured: [yes — moved N variables from @theme to @theme inline + :root | no — already dynamic]

    How to use:
    - Click the paintbrush to open the editor popover
    - Use [<] [>] arrows to cycle through 14 presets
    - Three tabs: Colors, Type, Style — each with a Shuffle button
    - Cmd+Z / Cmd+Shift+Z for undo/redo
    - Click the dice icon to randomize everything at once
    - Export as CSS or JSON when you're happy
    - Changes persist in localStorage across page refreshes

    To apply the theme permanently to your CSS: export the JSON and say "apply this theme"
    To remove the editor: say "remove theme editor"
    ```

---

## Phase 2: Apply

Triggered by "apply this theme" + JSON payload, or "apply theme" + JSON.

### Steps

1. **Parse the JSON:**
   - The JSON from the editor is a flat `{ "--variable-name": "value" }` object
   - Variable names will match the project's token structure (custom or shadcn)
   - Cross-reference with `references/variable-catalog.md` for standard shadcn tokens

2. **Read the CSS file** and detect the pattern:
   - **Pattern A** (standard shadcn — oklch): `:root { oklch values }` + `@theme inline {}`
   - **Pattern B** (standard shadcn — hex): `:root { hex values }` + `@theme inline {}`
   - **Pattern C** (custom tokens): `:root { custom vars }` with shadcn tokens linked via `var()` + `@theme inline {}` with custom mappings
   - **Pattern D** (direct): `@theme {}` with values directly inside (pre-restructure)

3. **Write values to `:root {}`:**
   - For each variable in the JSON, replace the existing value in the `:root {}` block
   - For custom-token projects: update the custom token values directly (e.g., `--brand: #6366F1`)
   - The linked shadcn tokens (`--primary: var(--brand)`) don't need updating — they follow automatically
   - Match the format: if existing values are oklch → convert hex to oklch; if hex → write hex directly
   - Color values from the editor are always hex

4. **Handle fonts:**
   - If `--font-sans` or `--font-mono` changed, update in both `:root {}` and `@theme {}`
   - For **Vite** projects: add a Google Fonts `<link>` to `index.html`
   - For **Next.js** projects: add the font via `next/font/google` in the layout file

5. **Preserve everything else:**
   - Do NOT touch: `@import` statements, `@custom-variant`, `@layer base` blocks
   - Do NOT touch the `var()` links between shadcn and custom tokens
   - Do NOT touch variables the editor doesn't control

6. **Type check** and verify no errors

7. **Report what changed:**
   ```
   Theme applied to src/index.css:
   - Updated N color variables
   - Changed font to {font name} (added Google Fonts link)
   - Radius: {old} → {new}

   Refresh to verify. The editor is still injected — keep tweaking or say "remove theme editor" when done.
   ```

---

## Phase 3: Remove

Triggered by "remove theme editor" or "clean up theme editor" or "done with theme editor".

### Steps

1. **Delete all theme editor files:**
   - `{root}/hooks/useTheme.ts`
   - `{root}/lib/theme-defaults.ts`
   - `{root}/lib/theme-storage.ts`
   - `{root}/lib/theme-apply.ts`
   - `{root}/lib/theme-presets.ts`
   - `{root}/components/theme-editor/` (entire directory)

   **IMPORTANT:** Only delete these files if no other code imports from them. Search the codebase first.

2. **Remove from root layout/app:**
   - Remove the ThemeDrawer import line
   - Remove the `<ThemeDrawer />` JSX (including the dev-only conditional wrapper)
   - Remove the `applyStoredThemeOverrides()` call and its import from the entry point

3. **Keep the CSS restructuring** — do NOT revert `@theme inline` + `:root` changes or `var()` links. These are an improvement to the CSS architecture regardless of the editor.

4. **Clean up empty directories** if hooks/ or lib/ are now empty

5. **Type check** to verify clean removal

6. **Report:**
   ```
   Theme editor removed. Your theme is permanently applied in your CSS file.
   The CSS restructuring (@theme inline + :root pattern) was preserved — your variables are still dynamic.
   Files removed: hooks/useTheme.ts, lib/theme-defaults.ts, lib/theme-storage.ts, lib/theme-apply.ts, lib/theme-presets.ts, components/theme-editor/
   ```

---

## Reference Files

When executing Phase 2 (Apply), read these references as needed:

- `references/variable-catalog.md` — All shadcn CSS variables with groupings
- `references/css-patterns.md` — How to detect and handle different CSS file structures

---

## Edge Cases

| Situation | What To Do |
|-----------|-----------|
| ThemeEditor already injected | Check for existing `hooks/useTheme.ts` — skip injection, tell user |
| CSS uses oklch values | Convert to hex for theme-defaults.ts default values; convert back when applying |
| No `.dark {}` block | Create it after `:root {}` when applying dark values (if provided) |
| Pre-Tailwind v4 | Reject: "Theme Editor requires Tailwind CSS v4+" |
| Multiple CSS files | Ask user which one is the main theme file |
| Project already has `shadow-theme` utility | Skip adding to `@theme inline` |
| lucide-react not installed | Install it automatically |
| Custom token and shadcn token share a purpose | Link via `var()` — don't duplicate in the editor |
| Component uses hardcoded Tailwind colors (e.g., `bg-gray-800`) | These won't be controllable by the editor — note in report but don't try to fix |
| `--font-sans` in `@theme {}` | Keep it there — font overrides work via inline style precedence. Don't move to `@theme inline` |
