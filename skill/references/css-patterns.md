# CSS Pattern Detection

How to identify and handle different CSS file structures in san's React + Tailwind v4 + shadcn/ui projects.

## Pattern A: Standard (oklch)

**Example projects:** `script-to-production`, `landing-shelf`

**Structure:**
```css
@import "tailwindcss";
@import "tw-animate-css";
@import "shadcn/tailwind.css";

@custom-variant dark (&:is(.dark *));

@theme inline {
  --radius-sm: calc(var(--radius) - 4px);
  /* ...radius and --color-* mappings... */
  --color-background: var(--background);
  --color-primary: var(--primary);
  /* etc. */
}

:root {
  --radius: 0.625rem;
  --background: oklch(1 0 0);
  --foreground: oklch(0.145 0 0);
  --primary: oklch(0.205 0 0);
  /* ...all variables in oklch format... */
}

.dark {
  --background: oklch(0.145 0 0);
  --foreground: oklch(0.985 0 0);
  /* ...dark mode overrides... */
}
```

**Detection rules:**
1. Has `@theme inline {` block
2. Has `:root {` block with `oklch(` values
3. May or may not have `.dark {` block

**On apply:**
- Write oklch values directly (the JSON already contains oklch)
- Replace values inside `:root { }` block
- Replace values inside `.dark { }` block (or create it if missing)

---

## Pattern B: Hex values

**Example project:** `landing-digitalroommate`

**Structure:**
```css
@import "tailwindcss";
@import "tw-animate-css";
@import "shadcn/tailwind.css";

@custom-variant dark (&:is(.dark *));

@theme inline {
  --radius-sm: calc(var(--radius) - 4px);
  --color-background: var(--background);
  /* ...standard mappings... */
  /* May also have custom color mappings */
  --color-brand: var(--brand);
  --color-warm: var(--warm);
  /* May have font families */
  --font-heading: "IBM Plex Sans", system-ui, sans-serif;
  --font-sans: "Inter", system-ui, sans-serif;
}

:root {
  --radius: 0.75rem;
  --background: #FAFAFA;
  --foreground: #1A1A1A;
  --primary: #3B82F6;
  /* ...all variables in hex format... */
  /* May have custom variables */
  --brand: #3B82F6;
  --warm: #F5F3EF;
}
```

**Detection rules:**
1. Has `@theme inline {` block
2. Has `:root {` block with `#` hex values (not oklch)
3. Usually no `.dark {}` block

**On apply:**
- Convert oklch values from the JSON to hex before writing
- oklch → hex conversion: use this approach:
  ```
  Create a temporary canvas/element, set color to the oklch value,
  read back as computed hex. Or use a lookup table for common values.
  ```
- For the skill's purposes, provide a note in the apply instructions about converting
- Preserve custom variables (`--brand`, `--warm`, etc.) untouched

---

## Pattern C: Direct @theme values

**Example project:** `landing-shelf` (has both a direct `@theme {}` and `@theme inline {}`)

**Structure:**
```css
@theme {
  --color-background-alt: #F7F7F5;
  --color-surface: #FFFFFF;
  --color-heading: #1A1A1A;
  --color-body: #4A4A4A;
  --color-brand: #00A82D;
  --font-sans: 'DM Sans', sans-serif;
}

@theme inline {
  /* standard shadcn mappings */
}

:root {
  /* standard shadcn values in oklch */
}
```

**Detection rules:**
1. Has a `@theme {` block (WITHOUT `inline`) containing direct values
2. The direct `@theme {}` block has project-specific custom variables and fonts
3. Also has `@theme inline {}` + `:root {}` for standard shadcn variables

**On apply:**
- Write standard shadcn variables to `:root {}` (same as Pattern A)
- Leave the direct `@theme {}` block untouched — it contains custom project-specific values
- If fonts changed, update the `--font-sans` in whichever block it appears in

---

## Detection Algorithm

When the skill reads a CSS file, run this check:

```
1. Find all @theme blocks:
   - @theme inline { ... }  → theme_inline = true
   - @theme { ... }         → theme_direct = true

2. Find :root { ... } block:
   - If contains "oklch(" → format = "oklch"
   - If contains "#"      → format = "hex"
   - If no :root block    → format = null

3. Find .dark { ... } block:
   - has_dark = true/false

4. Classify:
   if (theme_inline && format === "oklch")  → Pattern A
   if (theme_inline && format === "hex")    → Pattern B
   if (theme_direct && !theme_inline)       → Pattern C (rare)
   if (theme_direct && theme_inline)        → Hybrid (A/C) — treat as Pattern A for shadcn vars
```

---

## Writing Rules

| What to write | Pattern A | Pattern B | Pattern C / Hybrid |
|--------------|-----------|-----------|-------------------|
| `:root` values | oklch as-is | Convert to hex | oklch as-is (in `:root`) |
| `.dark` values | oklch as-is | Convert to hex | oklch as-is |
| Missing `.dark` block | Create after `:root` | Create after `:root` | Create after `:root` |
| `--radius` | Update in `:root` | Update in `:root` | Update in `:root` |
| Font family | Update in `@theme inline` | Update in `@theme inline` | Update in whichever `@theme` block has `--font-sans` |
| Custom variables | Skip, warn user | Skip, warn user | Skip, warn user |
| `@import` lines | Never touch | Never touch | Never touch |
| `@layer base` | Never touch | Never touch | Never touch |
| Animations/keyframes | Never touch | Never touch | Never touch |

---

## oklch → hex Conversion

For Pattern B projects, the skill needs to convert oklch values to hex when writing. The approach:

1. Parse the oklch string: `oklch(L C H)` or `oklch(L C H / alpha)`
2. Convert oklch → sRGB → hex using the CSS Color Level 4 spec
3. If the value has an alpha channel (`oklch(1 0 0 / 10%)`), write as hex with alpha: `#RRGGBBAA`

Since this conversion happens at apply-time in Claude's code generation (not in the browser), Claude should:
- Use known conversion formulas or a reference table
- For common neutral values (no chroma), the conversion is straightforward:
  - `oklch(1 0 0)` → `#FFFFFF`
  - `oklch(0 0 0)` → `#000000`
  - `oklch(0.145 0 0)` → approximately `#1A1A1A`
  - `oklch(0.985 0 0)` → approximately `#FAFAFA`
- For chromatic values, use the oklch → Lab → XYZ → sRGB → hex pipeline
- Alpha values: `oklch(1 0 0 / 10%)` → `#FFFFFF1A`
