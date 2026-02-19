# Design System

## Decisions

### Design tokens (Tailwind)

All visual values are defined as Tailwind design tokens via the `@theme` directive in `app/assets/css/main.css`. No magic values or arbitrary Tailwind classes (`[#fff]`) unless explicitly justified. There is no `tailwind.config.ts` file — Tailwind v4 configuration is entirely CSS-based.

### Color tokens

```
space-black:    #0a0a0f     (primary background)
space-deep:     #12121a     (alternate section background)
space-void:     #1a1a28     (card/container surfaces)
nebula-purple:  #a855f7     (primary accent)
electric-blue:  #3b82f6     (secondary accent)
cosmic-cyan:    #06b6d4     (tertiary accent, hover states)
star-white:     #f8fafc     (primary text)
star-gray:      #94a3b8     (secondary text)
```

Defined via `@theme` in `app/assets/css/main.css` as CSS custom properties:

```css
@theme {
  --color-space-black: #0a0a0f;
  --color-space-deep: #12121a;
  --color-space-void: #1a1a28;
  --color-nebula-purple: #a855f7;
  --color-electric-blue: #3b82f6;
  --color-cosmic-cyan: #06b6d4;
  --color-star-white: #f8fafc;
  --color-star-gray: #94a3b8;
}
```

Tailwind v4 generates utility classes directly from these custom properties (e.g. `bg-space-black`, `text-nebula-purple`).

### Gradient tokens

```
gradient-nebula:  linear-gradient(135deg, #a855f7 0%, #3b82f6 100%)
gradient-space:   linear-gradient(180deg, #0a0a0f 0%, #1a1a28 100%)
gradient-aurora:  linear-gradient(90deg, #a855f7 0%, #06b6d4 50%, #3b82f6 100%)
```

Defined via `@theme` in `app/assets/css/main.css`:

```css
@theme {
  --background-image-gradient-nebula: linear-gradient(135deg, #a855f7 0%, #3b82f6 100%);
  --background-image-gradient-space: linear-gradient(180deg, #0a0a0f 0%, #1a1a28 100%);
  --background-image-gradient-aurora: linear-gradient(90deg, #a855f7 0%, #06b6d4 50%, #3b82f6 100%);
}
```

### Shadow tokens (glow effects)

```
glow-purple:  0 0 20px rgba(168, 85, 247, 0.5)
glow-blue:    0 0 20px rgba(59, 130, 246, 0.5)
glow-cyan:    0 0 20px rgba(6, 182, 212, 0.5)
glow-subtle:  0 0 40px rgba(168, 85, 247, 0.15)
```

Defined via `@theme` in `app/assets/css/main.css`:

```css
@theme {
  --shadow-glow-purple: 0 0 20px rgba(168, 85, 247, 0.5);
  --shadow-glow-blue: 0 0 20px rgba(59, 130, 246, 0.5);
  --shadow-glow-cyan: 0 0 20px rgba(6, 182, 212, 0.5);
  --shadow-glow-subtle: 0 0 40px rgba(168, 85, 247, 0.15);
}
```

### Typography tokens

| Role       | Font family    | Source       | Tailwind class |
|------------|----------------|--------------|----------------|
| Sans-serif | Inter          | Google Fonts | `font-sans`    |
| Monospace  | JetBrains Mono | Google Fonts | `font-mono`    |

Defined via `@theme` in `app/assets/css/main.css`:

```css
@theme {
  --font-sans: 'Inter', sans-serif;
  --font-mono: 'JetBrains Mono', monospace;
}
```

### Spacing

Uses Tailwind's default spacing scale (4px base). No custom spacing tokens added. Consistency is enforced by using only Tailwind's built-in scale: `1` = 4px, `2` = 8px, `4` = 16px, etc.

### Animation tokens

| Name            | Duration | Easing            | Tailwind class           |
|-----------------|----------|-------------------|--------------------------|
| float           | 6s       | ease-in-out       | `animate-float`          |
| glow-pulse      | 2s       | ease-in-out       | `animate-glow-pulse`     |
| slide-in-right  | 0.3s     | ease-out          | `animate-slide-in-right` |

Custom animations are defined via `@theme` and `@keyframes` in `app/assets/css/main.css`:

```css
@theme {
  --animate-float: float 6s ease-in-out infinite;
  --animate-glow-pulse: glow-pulse 2s ease-in-out infinite;
  --animate-slide-in-right: slide-in-right 0.3s ease-out;
  --ease-out-expo: cubic-bezier(0.16, 1, 0.3, 1);
}
```

Keyframe definitions live in `app/assets/css/animations.css`.

### Transition defaults

- Duration: `200ms` for hover effects, `300ms` for layout transitions, `600ms` for scroll reveals.
- Easing: `ease-out` for entrances, `ease-in-out` for loops.

## Component catalog

### Atomic components (`components/ui/`)

#### Button

- **Variants**: `primary` (gradient-nebula bg, glow on hover), `secondary` (glassmorphism bg), `ghost` (transparent bg).
- **Sizes**: `sm` (px-4 py-2 text-sm), `md` (px-6 py-3 text-base), `lg` (px-8 py-4 text-lg).
- **States**: hover (shadow-glow-purple for primary), disabled (opacity-50, cursor-not-allowed), focus (ring).
- **Tag**: Polymorphic via `tag` prop (defaults to `button`, can be `a` or `NuxtLink`).

#### Card

- Glassmorphism: `bg-space-void/60 backdrop-blur-md border border-star-gray/10`.
- Used for project cards, experience items, and any elevated surface.

#### Badge

- Used for technology labels.
- Small pill shape with tech color as accent.
- Hover: scale(1.1) + glow.

#### Section

- Wrapper for page sections.
- Provides consistent vertical padding (`py-20 md:py-32`).
- Contains `id` attribute for scroll navigation anchors.

#### Container

- Max-width wrapper: `max-w-7xl mx-auto px-4 sm:px-6 lg:px-8`.

### Layout components (`components/layout/`)

#### AppHeader

- Fixed position, full width, z-50.
- Two states based on scroll position:
  - **Top** (scroll < 50px): transparent background, larger padding.
  - **Scrolled**: glassmorphism background, reduced padding.
- Contains: logo (left), navigation links (center), language switcher (right).
- Scroll spy: active link indicator based on visible section (Intersection Observer).
- Mobile: hamburger menu toggle, slide-in mobile nav.

#### AppFooter

- Minimal: copyright line + optional source link.

#### LanguageSwitcher

- Toggle between FR and EN.
- Uses `@nuxtjs/i18n` `switchLocalePath`.
- Persists choice via cookie.

### CSS utilities

Defined in `assets/css/main.css` under `@layer components`:

- `.glass`: glassmorphism effect.
- `.text-gradient`: gradient text using `bg-clip-text`.

### Responsive breakpoints

Uses Tailwind defaults:
- `sm`: 640px
- `md`: 768px
- `lg`: 1024px
- `xl`: 1280px
- `2xl`: 1536px

Content max-width: `max-w-7xl` (80rem / 1280px).

## Assumptions

- Google Fonts (Inter, JetBrains Mono) are loaded via `<link rel="preconnect">` + `<link rel="stylesheet">` in the document head with `font-display: swap`. This is decided (see performance.md).
- Icon library: **`@nuxt/icon`** module (Iconify). Provides access to 200k+ icons including `devicon`, `mdi`, `heroicons`, `simple-icons`. Usage: `<Icon name="devicon:go" />`.

## Open questions

1. ~~**Icon strategy**~~: **Resolved. `@nuxt/icon` module (Iconify).** Provides `<Icon>` component with access to devicon for tech icons, mdi/heroicons for UI icons.
2. **Custom scrollbar**: Defined in CSS for Webkit browsers. Firefox/Safari support varies. Decide if custom scrollbar is worth the cross-browser inconsistency.
