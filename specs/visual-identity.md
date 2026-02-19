# Visual Identity

## 1. Positioning

### Tone

Premium, modern, technical. The site must communicate engineering competence and taste simultaneously. It is not a creative agency portfolio — it is a technical professional's personal brand.

### Emotional objective

A visitor should feel:
- **Competence**: "This person knows what they are doing."
- **Precision**: Clean execution, nothing improvised.
- **Modernity**: Up-to-date with current industry standards.
- **Depth**: Literally (visual depth via layers/parallax) and figuratively (technical substance behind the aesthetics).

The visual identity draws from space/cosmos imagery as a metaphor for exploration, precision, and advanced technology. It is not literal sci-fi or retro-futurism. It is modern, restrained, and purposeful.

### What it is NOT

- Not a gaming website (no neon overload, no aggressive animations).
- Not a creative agency showcase (no avant-garde layouts that break usability).
- Not a template (no generic hero-with-stock-photo).
- Not minimalist-bland (must have visual personality).

## 2. Color palette

### Primary colors (backgrounds)

| Token          | Hex       | Role                              |
|----------------|-----------|-----------------------------------|
| `space-black`  | `#0a0a0f` | Main background, body             |
| `space-deep`   | `#12121a` | Alternate section backgrounds     |
| `space-void`   | `#1a1a28` | Elevated surfaces (cards, modals) |

Rationale: Near-black with subtle blue-purple undertone creates depth without being pure black (which is harsh on screens). The three-tier darkness system creates natural visual hierarchy.

### Accent colors

| Token            | Hex       | Role                        |
|------------------|-----------|-----------------------------|
| `nebula-purple`  | `#a855f7` | Primary accent (CTAs, links, active states) |
| `electric-blue`  | `#3b82f6` | Secondary accent (gradients, secondary actions) |
| `cosmic-cyan`    | `#06b6d4` | Tertiary accent (hover variations, highlights) |

Rationale: Purple-blue-cyan triad creates a cohesive cool spectrum. Purple is distinctive (most portfolios use blue or green). The three accents enable gradient combinations without clashing.

### Text colors

| Token         | Hex       | Role                           |
|---------------|-----------|--------------------------------|
| `star-white`  | `#f8fafc` | Primary text (headings, body)  |
| `star-gray`   | `#94a3b8` | Secondary text (meta, captions)|

Rationale: `#f8fafc` is softer than pure white, reducing eye strain on dark backgrounds. `#94a3b8` provides sufficient contrast (WCAG AA on `#0a0a0f`) while clearly indicating secondary information.

### Gradients

| Name              | Value                                                      | Usage                          |
|-------------------|------------------------------------------------------------|--------------------------------|
| `gradient-nebula` | `linear-gradient(135deg, #a855f7 0%, #3b82f6 100%)`       | Primary CTAs, active states    |
| `gradient-space`  | `linear-gradient(180deg, #0a0a0f 0%, #1a1a28 100%)`       | Section transitions            |
| `gradient-aurora` | `linear-gradient(90deg, #a855f7 0%, #06b6d4 50%, #3b82f6 100%)` | Decorative lines, highlights |

### Glow effects

| Name           | Value                                       | Usage                     |
|----------------|---------------------------------------------|---------------------------|
| `glow-purple`  | `0 0 20px rgba(168, 85, 247, 0.5)`          | Hover on primary elements |
| `glow-blue`    | `0 0 20px rgba(59, 130, 246, 0.5)`          | Hover on secondary elements |
| `glow-cyan`    | `0 0 20px rgba(6, 182, 212, 0.5)`           | Hover variations          |
| `glow-subtle`  | `0 0 40px rgba(168, 85, 247, 0.15)`         | Ambient glow on cards     |

Rationale: Glow effects reinforce the space/neon aesthetic without overwhelming content. All glow values use the accent palette at reduced opacity.

## 3. Typography

### Font selection

| Role          | Font            | Fallback stack          | Rationale                                      |
|---------------|-----------------|-------------------------|-------------------------------------------------|
| **Primary**   | Inter           | system-ui, sans-serif   | Industry standard for technical UI. Excellent readability, variable font support, broad weight range. |
| **Monospace** | JetBrains Mono  | monospace               | Designed for code. Signals technical identity. Used for tech badges and code references. |

No decorative or display fonts. The visual personality comes from color, spacing, and effects — not typography gimmicks.

### Heading hierarchy

| Level | Size (desktop)              | Weight | Font  | Usage                          |
|-------|-----------------------------|--------|-------|--------------------------------|
| H1    | `text-5xl` / `text-6xl`     | 800    | Inter | Hero title only                |
| H2    | `text-3xl` / `text-4xl`     | 700    | Inter | Section titles                 |
| H3    | `text-xl` / `text-2xl`      | 600    | Inter | Card titles, sub-sections      |
| H4    | `text-lg`                   | 600    | Inter | Minor headings                 |
| Body  | `text-base` (16px)          | 400    | Inter | Paragraphs, descriptions       |
| Small | `text-sm` (14px)            | 400    | Inter | Meta info, dates, captions     |
| Mono  | `text-sm`                   | 400    | JetBrains Mono | Tech badges, code        |

Mobile sizes use Tailwind's responsive utilities to scale down headings (e.g., H1: `text-3xl md:text-5xl lg:text-6xl`).

### Line height and spacing

- Body text: `leading-relaxed` (1.625).
- Headings: `leading-tight` (1.25).
- Letter spacing on headings: `tracking-tight` (-0.025em).

## 4. Layout system

### Grid

- Tailwind's default 12-column grid is not explicitly used.
- Layouts are built with Flexbox and CSS Grid via Tailwind utilities.
- Content container: `max-w-7xl` (1280px) with responsive padding (`px-4 sm:px-6 lg:px-8`).

### Section spacing

- Vertical section padding: `py-20 md:py-32` (80px / 128px).
- Between-element spacing within sections: multiples of 4px (Tailwind default scale).
- Gap between cards in grids: `gap-6` (24px) or `gap-8` (32px).

### Alignment rules

- Text: left-aligned by default. Center-aligned only for hero title and section headings.
- Cards: grid layout, equal-height columns.
- Timeline: centered vertical line with alternating left/right cards on desktop, single-column on mobile.

## 5. Component visual specifications

### Buttons

| Variant     | Background             | Border               | Text          | Hover effect                  |
|-------------|------------------------|----------------------|---------------|-------------------------------|
| Primary     | `gradient-nebula`      | None                 | White         | `shadow-glow-purple`          |
| Secondary   | `space-void/60` glass  | `star-gray/10` 1px   | `star-white`  | `bg-space-void` (opaque)      |
| Ghost       | Transparent            | None                 | `star-white`  | `bg-space-void/50`            |

All buttons: `rounded-xl`, transition duration 200ms.
Focus state: visible ring using `focus-visible:ring-2 ring-nebula-purple ring-offset-2 ring-offset-space-black`.

### Project cards

- Background: glassmorphism (`.glass`).
- Border: 1px `star-gray/10`, transitions to `nebula-purple/30` on hover.
- Thumbnail: top or left, with `overflow-hidden rounded-t-xl`.
- Hover: card lifts (`-translate-y-1`), border glows, thumbnail scales (`scale-105`).
- Content: title (H3), short description, tech badges row, links row.

### Technology badges

- Shape: pill (`rounded-full`).
- Background: `space-void` or tech-specific color at low opacity.
- Text: `text-sm font-mono`.
- Hover: `scale-110` + `shadow-glow-*` matching badge color.

### Timeline (Experience/Education)

- Vertical line: gradient from `nebula-purple` to `electric-blue`.
- Timeline dots: filled circles (`w-3 h-3 rounded-full bg-nebula-purple`).
- Cards: glassmorphism, attached to timeline via horizontal connector.
- Dates: monospace font, positioned outside card.
- Scroll animation: line draws progressively as user scrolls.

### Social link icons

- Size: `w-10 h-10` clickable area.
- Default: `star-gray` color.
- Hover: transition to accent color + glow.

## 6. Dark mode

**Decision: Dark-only. No light mode toggle.**

Rationale:
- The entire visual identity is built around dark backgrounds with luminous accents.
- A light mode would require a parallel design system with inverted semantics.
- For a portfolio, visual consistency trumps user preference flexibility.
- Users who need light mode can use browser/OS forced light mode (graceful degradation accepted).

Implementation: `bg-space-black text-star-white` applied globally on `body`. No `dark:` Tailwind variants needed.

## 7. Animations and micro-interactions

### Scroll reveal (all sections except hero)

- Elements fade in from below: `opacity: 0 → 1`, `translateY: 20px → 0`.
- Duration: 600ms, easing: `ease-out`.
- Trigger: Intersection Observer at 20% visibility threshold.
- Each element fires once (no re-trigger on scroll up).
- Stagger: sequential items (cards, timeline entries) with 100-150ms delay between each.

### Hero section

- Parallax: background particles move slower than foreground content on scroll.
- Typed text effect: GSAP-powered text cycling through descriptors (e.g., "I build", "I deploy", "I automate").
- Scroll indicator: animated chevron or arrow at bottom, looping bounce.
- Elements cascade in on load: logo → title → subtitle → CTA, 200ms stagger.

### Hover states

- Buttons: glow shadow appears (200ms transition).
- Cards: lift + border glow (200ms transition).
- Links: gradient underline slides in from left (300ms transition).
- Badges: scale 1.1 + glow (200ms transition).

### Particles (tsparticles)

- Preset: stars.
- Count: 80-100 particles.
- Colors: mix of accent colors + white.
- Movement: slow random drift (speed: 0.3-0.5).
- Opacity: randomized 0.1-0.8 with twinkle animation.
- Size: 1-3px.
- Scope: full viewport, fixed position behind all content (`z-index: -1`).
- Performance: `fpsLimit: 60`, `detectRetina: true`.

### Reduced motion

When `prefers-reduced-motion: reduce` is active:
- All CSS animations and transitions collapse to 0.01ms duration.
- GSAP animations are disabled (check media query in composable).
- Particles background still renders but movement is frozen.
- Scroll reveal elements start visible (no animation).

## 8. UX constraints

### Readability

- Minimum body text size: 16px (`text-base`). Never smaller for content text.
- Maximum line width: `max-w-prose` (65 characters) for paragraph blocks.
- Contrast ratios must meet WCAG AA (4.5:1 for body text, 3:1 for large text).
- `star-white` (#f8fafc) on `space-black` (#0a0a0f): contrast ratio ~18:1 (AAA).
- `star-gray` (#94a3b8) on `space-black` (#0a0a0f): contrast ratio ~7:1 (AA).

### Information density

- Sections should breathe. Generous padding (`py-20 md:py-32`) between sections.
- Cards: internal padding `p-6` minimum.
- No section should feel crowded. If content overflows, paginate or truncate — never compress spacing.

### Navigation

- Scroll spy: current section highlighted in header navigation.
- Smooth scroll to anchors on nav click (`scroll-behavior: smooth` on `html`).
- Header always visible (fixed position).
- Mobile: hamburger menu, full-width slide-in panel.

### Micro-interactions purpose

Every animation must serve one of:
1. **Orientation**: Help user understand where they are (scroll spy, section transitions).
2. **Feedback**: Confirm interaction happened (button hover, link underline).
3. **Delight**: Subtle surprise that reinforces brand (particles, typed text, glow effects).

No animation for decoration alone. If removing an animation would not reduce usability or brand perception, it should not exist.

## 9. Coherence with professional positioning

Hugo Bollon: DevOps Engineer with Fullstack background, Go expert, open-source contributor.

The visual identity must communicate:

| Trait                    | Visual expression                                       |
|--------------------------|---------------------------------------------------------|
| Technical depth          | Monospace font for tech labels, code-inspired details   |
| Engineering precision    | Pixel-perfect alignment, consistent spacing             |
| Modern stack awareness   | Contemporary design patterns, no dated aesthetics       |
| Open-source contributor  | GitHub links prominent, source code link in footer      |
| DevOps / infrastructure  | Space metaphor (systems at scale, infrastructure depth) |
| Not a designer           | Clean and tasteful, but clearly developer-driven        |

The site should look like it was built by a very good engineer who cares about aesthetics — not by a designer who learned to code.
