# Roadmap

## Scope definition

This roadmap reflects decisions made during the planning session. It is not a wishlist. Each phase has explicit deliverables and exit criteria.

## Phase 1 — Project initialization

**Estimated effort**: 1 day

**Deliverables**:
- Nuxt 4 project initialized with `nuxi init`.
- All dependencies installed via Yarn Berry v4.
- `.yarnrc.yml` configured (`nodeLinker: node-modules`). `.yarn/` directory committed (releases only, not cache).
- `nuxt.config.ts` fully configured (modules, SSG via `nitro.prerender`, TypeScript, i18n, image optimization, `@tailwindcss/vite` Vite plugin).
- Tailwind v4 design tokens defined in `app/assets/css/main.css` via `@theme` directive (colors, fonts, shadows, animations). No `tailwind.config.ts`.
- `tsconfig.json` at root using Nuxt 4 project references (`tsconfig.app.json`, `tsconfig.shared.json`, etc.).
- ESLint flat config + Prettier + `prettier-plugin-tailwindcss`.
- `app/assets/css/main.css` with `@import "tailwindcss"`, `@theme` design tokens, base styles, and utility classes (`.glass`, `.text-gradient`) under `@layer components`.
- `app/assets/css/animations.css` with custom `@keyframes`.
- `.env.example` with all required variables documented.
- `.gitignore` configured for Nuxt 4 + Yarn Berry.
- Complete folder structure created matching Nuxt 4 layout (`app/`, `shared/`, `public/`, `locales/` at root).
- `yarn dev` starts successfully.

**Exit criteria**: `yarn dev` runs without errors. `yarn typecheck` passes.

**Commit**: `feat: initialize nuxt 4 project with full configuration`

## Phase 2 — Strapi integration layer

**Estimated effort**: 0.5 day

**Deliverables**:
- `shared/types/strapi.ts`: Complete TypeScript type definitions for all Strapi content types.
- `app/composables/useStrapi.ts`: Typed fetch functions for each content type (projects, experiences, education, technologies, about, homepage, contact).
- `app/utils/strapi.ts`: Helper functions (`getStrapiMedia`, date formatting).
- Plugin or configuration for Strapi API authentication (token via env var).

**Dependencies**: Strapi content types must be created (see strapi-data-model.md). Types must match the actual API response shape (Strapi v5, flat format). Custom composable approach confirmed.

**Exit criteria**: Composable functions compile without type errors. If Strapi is accessible, a manual test fetch returns expected data shape.

**Commit**: `feat: add strapi types and integration layer`

**Parallel work (manual, on Strapi instance)**:
- Create all content types per strapi-data-model.md.
- Enable i18n plugin, add `fr` locale.
- Create API token (read-only).
- Populate initial content.

## Phase 3 — Design system and layout

**Estimated effort**: 1 day

**Deliverables**:
- `app/components/ui/Button.vue` (primary, secondary, ghost variants; sm, md, lg sizes).
- `app/components/ui/Card.vue` (glassmorphism container).
- `app/components/ui/Badge.vue` (technology badge with color and icon).
- `app/components/ui/Section.vue` (section wrapper with id anchor and padding).
- `app/components/ui/Container.vue` (max-width + responsive padding).
- `app/components/layout/AppHeader.vue` (fixed, glassmorphism, scroll spy, mobile hamburger).
- `app/components/layout/AppFooter.vue` (minimal footer).
- `app/components/layout/LanguageSwitcher.vue` (FR/EN toggle).
- `app/layouts/default.vue` (header + main + footer shell).

**Exit criteria**: Layout renders correctly on desktop and mobile. Navigation links exist (not yet wired to sections). Language switcher toggles locale.

**Commits**:
- `feat(ui): add atomic ui components`
- `feat(layout): add header, footer and navigation`

## Phase 4 — Animations and effects

**Estimated effort**: 0.5-1 day

**Deliverables**:
- `app/plugins/gsap.client.ts`: GSAP + ScrollTrigger initialization.
- `app/plugins/particles.client.ts`: tsparticles initialization with slim engine.
- `app/plugins/gtag.client.ts`: Google Analytics 4 setup (conditional on env var).
- `app/components/animations/ParticlesBackground.vue` (stars preset, fixed behind all content).
- `app/components/animations/ScrollReveal.vue` (fade-in wrapper, Intersection Observer).
- `app/components/animations/TypedText.vue` (GSAP-powered text cycling).
- `app/composables/useScrollAnimation.ts` (GSAP ScrollTrigger helpers).
- `prefers-reduced-motion` support in CSS and GSAP initialization.

**Exit criteria**: Particles render without performance issues (<60 FPS). ScrollReveal triggers correctly. Reduced motion is respected.

**Commit**: `feat(animations): add particles background and scroll reveal components`

## Phase 5 — i18n and SEO

**Estimated effort**: 0.5 day

**Deliverables**:
- `locales/en.json`: Complete English UI translations.
- `locales/fr.json`: Complete French UI translations.
- `app/composables/useSeo.ts`: Dynamic meta tags, Open Graph, Twitter Card, canonical URL.
- `public/robots.txt`.
- Default `public/og-image.jpg` (placeholder, to be replaced with final design).

**Exit criteria**: Switching locale changes all UI strings. Meta tags are present in SSG HTML output. Sitemap generates correctly.

**Commit**: `feat(i18n): add french and english translations and seo composable`

## Phase 6 — Page sections

**Estimated effort**: 2-3 days

**Deliverables** (one commit per section):

| Section              | Component                      | Key features                                    |
|----------------------|--------------------------------|-------------------------------------------------|
| Hero                 | `HeroSection.vue`              | Particles bg, typed text, parallax, scroll CTA  |
| About                | `AboutSection.vue`             | Photo, bio, social links, resume download        |
| Experience/Education | `ExperienceSection.vue`        | Timeline, cards, tech badges, scroll animation   |
| Skills               | `SkillsSection.vue`            | Category filters, badge grid, hover effects      |
| Projects             | `ProjectsSection.vue`          | Featured grid, project cards, links              |
| Contact              | `ContactSection.vue`           | Email, social links, availability status         |

Supporting content components:
- `app/components/content/ProjectCard.vue`
- `app/components/content/ExperienceCard.vue`
- `app/components/content/SkillBadge.vue`
- `app/components/content/SocialLink.vue`

**Exit criteria**: Each section renders with mock/static data. Layout is responsive. Scroll animations trigger correctly.

**Commits**: One per section (`feat(hero): ...`, `feat(about): ...`, etc.)

## Phase 7 — Data integration

**Estimated effort**: 0.5-1 day

**Deliverables**:
- `app/pages/index.vue`: Fetches all data from Strapi via `useStrapi()` composable. Passes data as props to sections.
- SSG generates complete HTML with real content.
- SEO meta tags populated from Strapi data.

**Dependencies**: Strapi must be populated with real content and accessible from dev machine.

**Exit criteria**: `yarn generate` produces complete static HTML. Opening `index.html` shows all sections with real Strapi content.

**Commit**: `feat: integrate strapi data fetching in homepage`

## Phase 8 — Optimization and polish

**Estimated effort**: 1-2 days

**Deliverables**:
- Image optimization verification (correct formats, lazy loading, sizes).
- Bundle size audit (`nuxt analyze`).
- Lighthouse audit and fixes (target scores met).
- Accessibility audit (ARIA labels, focus management, contrast).
- Responsive fine-tuning on all breakpoints.
- Animation performance verification (60 FPS).

**Exit criteria**: Lighthouse scores meet targets. No accessibility violations. Responsive layout verified on mobile, tablet, desktop.

**Commits**:
- `perf: optimize images and bundle size`
- `fix(a11y): improve accessibility`
- `style: responsive polish`

## Phase 9 — Documentation

**Estimated effort**: 0.5 day

**Deliverables**:
- `README.md`: Project description, prerequisites, installation, commands, environment variables.
- `.env.example` updated with final variables.
- Final build verification (`yarn dev`, `yarn build`, `yarn generate`, `yarn preview`).

**Exit criteria**: A new developer can clone the repo, follow README instructions, and run the project locally.

**Commit**: `docs: add project setup instructions`

## Total estimated effort

| Phase | Effort      |
|-------|-------------|
| 1     | 1 day       |
| 2     | 0.5 day     |
| 3     | 1 day       |
| 4     | 0.5-1 day   |
| 5     | 0.5 day     |
| 6     | 2-3 days    |
| 7     | 0.5-1 day   |
| 8     | 1-2 days    |
| 9     | 0.5 day     |
| **Total** | **7-10 days** |

Note: This estimate assumes full-time focus. Session initially estimated 12-15 days, later refined to 7-10. The difference accounts for reduced scope (no contact form backend, no project detail pages, no blog, basic README).

## Deferred to future versions

| Feature                  | Reason for deferral                          |
|--------------------------|----------------------------------------------|
| Project detail pages     | Not needed for v1 single-page format         |
| Contact form backend     | Complexity vs value for v1                   |
| Blog                     | Explicitly excluded from scope               |
| Strapi webhook rebuild   | Manual trigger sufficient for portfolio      |
| RGPD consent banner      | Required before GA activation, not blocking  |
| Staging environment      | Not justified for portfolio scope            |
| Unit tests               | Portfolio scope, low ROI                     |
| Storybook                | Single developer, low ROI                    |

## Git workflow

- Conventional Commits enforced.
- Atomic commits: one logical change per commit.
- **No push from agent.** All pushes are manual.
- Branch strategy: `main` for production, feature branches as needed (at developer's discretion).
