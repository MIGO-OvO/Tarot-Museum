---
name: "阿卡纳手稿馆 · THE ARCANUM GALLERY"
description: "A scholarly static-HTML exhibition of the 78 tarot cards, styled as a fine-press museum catalogue."
colors:
  bg: "#f4eee1"
  paper: "#f9f5eb"
  surface: "#efe7d8"
  fg: "#2a1b11"
  muted: "#675345"
  faint: "#948274"
  border: "#cdbaa6"
  rule: "#b4997d"
  gold: "#a76c12"
  gold-deep: "#874e00"
  wine: "#7f2021"
  wine-soft: "#a34943"
  ink-blue: "#284561"
typography:
  display:
    fontFamily: "'Iowan Old Style','Palatino Linotype',Palatino,'Songti SC','Source Han Serif SC',Georgia,'Times New Roman',serif"
    fontSize: "clamp(2.75rem, 7vw, 4.75rem)"
    fontWeight: 400
    lineHeight: 1.12
    letterSpacing: ".01em"
  body:
    fontFamily: "'Iowan Old Style','Palatino Linotype',Palatino,'Songti SC','Source Han Serif SC',Georgia,'Times New Roman',serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.85
  label:
    fontFamily: "'SFMono-Regular',ui-monospace,Menlo,Consolas,monospace"
    fontSize: ".75rem"
    letterSpacing: ".5em"
rounded:
  sm: "2px"
  md: "4px"
spacing:
  sm: "16px"
  md: "30px"
  lg: "40px"
components:
  button-tab:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.muted}"
    rounded: "{rounded.md}"
    padding: "10px 24px"
  button-tab-hover:
    textColor: "{colors.fg}"
  button-tab-active:
    backgroundColor: "{colors.fg}"
    textColor: "{colors.paper}"
  card-exhibit:
    backgroundColor: "{colors.paper}"
    rounded: "{rounded.sm}"
    padding: "40px"
---

# Design System: 阿卡纳手稿馆

## 1. Overview

**Creative North Star: "The Curated Manuscript"**

The Arcanum Gallery is a quiet, scholarly repository of tarot card interpretations, designed to evoke the tactile weight and intellectual authority of a fine-press exhibition catalogue or an illuminated manuscript. The site avoids the contemporary visual grammar of interactive web apps in favor of static, editorial pages where the content is central.

The interface relies on generous whitespace, strict alignment, and a warm-light paper texture that invites the reader to slow down and dwell. It explicitly rejects commercial clutter (no hard-sell CTAs, no banners) and New-Age mysticism clichés (no galaxy gradients, neon accents, or clip-art icons).

**Key Characteristics:**
- **Exhibition Layout:** Structural symmetry, classical hairline rules, and plate-style numbering.
- **Aged Paper Atmosphere:** Low-chroma warm-neutral background with high-contrast text to ensure premium readability.
- **Bilingual Typographic Order:** Chinese prose in fine serif type; English and esoteric metadata in wide-letterspaced monospace.

## 2. Colors

The color palette represents aged paper, iron-gall ink, and precious illumination pigments (gold leaf and cochineal wine).

### Primary
- **Gold** (`#a76c12` / `oklch(58% 0.12 70)`): Used for card frames, subtle division lines, and minor decorative details.
- **Gold Deep** (`#874e00` / `oklch(48% 0.11 65)`): Used for metadata labels and small-caps eyebrows.

### Neutral
- **Paper Background** (`#f4eee1` / `oklch(95% 0.018 85)`): Main viewport background with radial paper-grain textures.
- **Paper Surface** (`#f9f5eb` / `oklch(97% 0.013 88)`): Card and container background.
- **Card Surface** (`#efe7d8` / `oklch(93% 0.022 82)`): Secondary block background.
- **Ink Black** (`#2a1b11` / `oklch(24% 0.03 55)`): Main prose text.
- **Ink Muted** (`#675345` / `oklch(46% 0.035 58)`): Secondary descriptive copy.
- **Ink Faint** (`#948274` / `oklch(62% 0.03 60)`): Inactive states, placeholder texts.
- **Border** (`#cdbaa6` / `oklch(80% 0.035 70)`): Primary divider borders.
- **Rule** (`#b4997d` / `oklch(70% 0.05 68)`): Ornament lines.

### Named Rules
**The Precious Accent Rule.** Accent colors are strictly limited. Gold and wine must cover less than 10% of any viewport. Their visual power comes from scarcity against the neutral paper background.
**The Thematic Light Rule.** The site is strictly light mode (aged paper). Dark mode is prohibited as it violates the archival manuscript aesthetic.

## 3. Typography

**Display Font:** Songti SC, Source Han Serif SC, Iowan Old Style, Georgia, serif.
**Body Font:** Songti SC, Source Han Serif SC, Iowan Old Style, Georgia, serif.
**Label/Mono Font:** SFMono-Regular, ui-monospace, Menlo, Consolas, monospace.

### Hierarchy
- **Display** (Regular, `clamp(2.75rem, 7vw, 4.75rem)`, `1.12`): Main page titles.
- **Headline** (Regular, `clamp(1.75rem, 3.4vw, 2.375rem)`, `1.4`): Main section headers.
- **Title** (Regular, `1.75rem` / `31.5px`, `1.4`): Card names inside grids and subheadings.
- **Body** (Regular, `1rem` / `18px`, `1.85`): Prose paragraphs. Maximum line length capped at `75ch`.
- **Label** (SemiBold, `0.75rem` / `13.5px`, `0.5em` letter-spacing, Uppercase): Eyebrows, card metadata, and navigation elements.

### Named Rules
**The Bilingual Hierarchy Rule.** Serif faces are reserved for Chinese prose and classical headers to ensure calligraphic grace; monospace faces are strictly used for English metadata, page numbers, and labels.

## 4. Elevation

The system is flat-by-default, simulating sheets of paper and parchment laid out on a curator's table. Depth is expressed through tonal shifts (from `--bg` to `--paper`) and hairline borders rather than volumetric shadows.

### Shadow Vocabulary
- **Exhibit Card Shadow** (`0 18px 44px oklch(40% .05 60 / .14)`): Anchors cards at rest.
- **Hover Lift Shadow** (`0 24px 60px oklch(40% .05 60 / .22), 0 0 25px oklch(58% .12 70 / .15)`): Adds a slight gold aura on hover state.

### Named Rules
**The Flat-at-Rest Rule.** All components sit flat at rest. Depth cues are activated exclusively by scroll-driven reveals or hover states.

## 5. Components

### Buttons / Tabs
- **Shape:** Rounded corners (`4px` radius).
- **Tab Buttons:** At rest: background (`--paper`), text (`--muted`), border (`--border`). Hover: border (`--gold`), text (`--fg`). Active: background (`--fg`), text (`--paper`).

### Cards / Containers
- **Corner Style:** Straight edges or micro-radius (`2px` border-radius).
- **Exhibit Cards:** Padded at `40px` with a subtle inner gold inset border (`1px solid var(--gold)` at `10px` inset, sliding to `6px` on hover).
- **Frame Border:** Single pixel border (`1px solid var(--border)`), transitioning to (`1px solid var(--gold)`) on card hover.

### Navigation / Top bar
- **Top Bar:** Fixed sticky top bar. height (`64px`), background (`var(--bg)` at `86%` opacity) with backdrop-filter blur (`12px`). Uses wide monospace tags for links.

## 6. Do's and Don'ts

### Do:
- **Do** wrap long prose in paragraphs with `text-wrap: pretty` and set maximum line length to `75ch`.
- **Do** use OKLCH color variables to maintain the aged paper aesthetic.
- **Do** use the standard `reveal` class and scroll-observer JS for page entrance effects.
- **Do** ensure all text contrast meets WCAG AA (≥4.5:1).

### Don't:
- **Don't** use neon, vibrant purple, or space-galaxy gradients.
- **Don't** use side-stripe borders (e.g. `border-left` thicker than 1px as a colored accent).
- **Don't** use standard sans-serif font stacks (like Inter or Roboto) for body copy.
- **Don't** introduce dark mode or glassmorphic blur cards as decorative backdrops.
- **Don't** place cards directly in the root directory; always nest detail HTML pages under `cards/`.
