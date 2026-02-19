# Architecture

## Decisions

### Rendering strategy

- **SSG (Static Site Generation)** via `nuxt generate`.
- `ssr: true` is the default Nuxt 4 behaviour and is required for SSG.
- There is no `target: 'static'` option in Nuxt 4. SSG is achieved solely through the `nuxt generate` command.
- At build time, Nuxt fetches all data from Strapi API and pre-renders every page as static HTML.
- The generated output (`.output/public/`) is deployed to a static hosting service.
- No server runtime is required in production.

### Frontend / CMS decoupling

- Frontend (Nuxt 4) and CMS (Strapi) are fully decoupled.
- Strapi is consumed exclusively at build time via its REST API.
- Strapi is never exposed to end users. Only the build pipeline has network access to Strapi.
- The frontend repository contains no editorial content. All editorial content lives in Strapi.

### Page structure

- **Single-page scroll** homepage (`app/pages/index.vue`) containing all sections:
  Hero, About, Experience/Education, Skills, Projects, Contact.
- No dedicated project detail pages in v1. All project information is displayed inline on the homepage.
- Routing is minimal: only the homepage and locale-prefixed variants (`/fr/`).

### Data flow

```
Build time:
  Strapi REST API ──> Nuxt (useAsyncData / useFetch) ──> Static HTML

Runtime:
  CDN ──> Static HTML + JS ──> User browser
```

- All Strapi data is fetched in `app/pages/index.vue` using parallel requests.
- Data is passed to section components via props. Sections do not fetch data themselves.
- No client-side API calls to Strapi at runtime.

### i18n architecture (hybrid)

- **UI strings** (navigation labels, button text, static messages): managed in local JSON files (`locales/en.json`, `locales/fr.json`) consumed by `@nuxtjs/i18n`.
- **Editorial content** (projects, bio, experience descriptions): managed in Strapi with its built-in i18n plugin. Locale is passed as query parameter during build-time fetch.
- Routing strategy: `prefix_except_default`. English is the default locale (no prefix). French uses `/fr/` prefix.

### Folder structure

Nuxt 4 default structure. `srcDir` is `app/` — all application code lives under `app/`. Configuration, server, and static assets stay at the root.

```
portfolio-nuxt/
├── app/                    # srcDir — all application code
│   ├── assets/css/         # Tailwind entry + custom keyframes
│   ├── components/
│   │   ├── ui/             # Atomic design system components
│   │   ├── layout/         # Header, Footer, LanguageSwitcher
│   │   ├── sections/       # Page sections (Hero, About, etc.)
│   │   ├── animations/     # Particles, ScrollReveal, Parallax
│   │   └── content/        # ProjectCard, ExperienceCard, etc.
│   ├── composables/        # Composition API logic
│   ├── layouts/            # Nuxt layouts (default.vue)
│   ├── pages/              # Nuxt pages (index.vue only in v1)
│   ├── plugins/            # Client-side plugins (.client.ts)
│   └── utils/              # Pure utility functions
├── shared/                 # Shared between app and server (types, pure utils)
│   └── types/              # TypeScript type definitions (Strapi, etc.)
├── locales/                # i18n JSON files (UI strings only)
├── public/                 # Static assets (favicon, robots.txt, og-image)
├── specs/                  # This specification directory
└── nuxt.config.ts          # Nuxt configuration (root level)
```

**Note on `~` alias**: In Nuxt 4, `~` (and `@`) resolves to `app/` (the `srcDir`). So `~/components` → `app/components/`, `~/composables` → `app/composables/`, etc.

**Note on `shared/`**: The `shared/` directory is a Nuxt 4 addition. TypeScript types for Strapi and other shared interfaces live in `shared/types/` to benefit from the split tsconfig and proper IDE context separation.

### Component classification

| Directory                  | Responsibility                          | Data fetching | Strapi-aware |
|----------------------------|-----------------------------------------|---------------|--------------|
| `app/components/ui/`       | Stateless, reusable, design system      | No            | No           |
| `app/components/layout/`   | App shell (header, footer, nav)         | No            | No           |
| `app/components/sections/` | Page sections, receive data via props   | No            | Yes (types)  |
| `app/components/content/`  | Content display (cards, timeline items) | No            | Yes (types)  |
| `app/components/animations/` | Visual effects, particles, scroll     | No            | No           |
| `app/pages/`               | Data fetching, SEO, section composition | Yes           | Yes          |

### Plugin loading

- Plugins suffixed `.client.ts` are loaded only in the browser: GSAP, tsparticles, Google Analytics.
- No server-side plugins required (no Strapi auth, no sessions).

## Assumptions

- Strapi instance is accessible from the build environment (CI/CD or local dev machine) via HTTPS.
- Strapi API token with read-only permissions is available as environment variable.
- Media files uploaded to Strapi are stored on AWS S3 and served via S3/CloudFront URLs (not proxied through Strapi).
- Nuxt 4 is used. The `srcDir` is `app/` by default. No `srcDir: '.'` override.

## Open questions

1. ~~**Strapi version**~~: **Resolved. Strapi v5.** API response is flat (no `data.attributes` wrapping). Types and composables use v5 format.
2. **Project detail pages**: Deferred to a future version. The data model already includes `fullDescription` and `slug` to support this without schema migration. Decision to implement is explicitly deferred.
3. **Contact form backend**: Deferred. Current scope is links only. No server route, no email service integration.
4. **RGPD consent banner**: Google Analytics requires user consent under GDPR. No consent management solution has been chosen. This must be decided before GA is activated.

## Nuxt 4 specifics

Key Nuxt 4 changes that affect this project:

- **`srcDir: app/`**: All application code is under `app/`. The `~` alias resolves to `app/`.
- **`shared/` directory**: New directory for types/utils shared between app and server contexts. Strapi types live here.
- **`generate` config removed**: SSG configuration uses `nitro.prerender` instead of the top-level `generate` key.
- **`useAsyncData` / `useFetch`**: `data` is now a `shallowRef`. `data` and `error` default to `undefined` (not `null`). Code must not check for `null`.
- **`noUncheckedIndexedAccess: true`** by default in TypeScript config. Array and object index access returns `T | undefined`. Code must handle this explicitly.
- **TypeScript config splitting**: Nuxt generates separate `tsconfig.app.json`, `tsconfig.server.json`, `tsconfig.shared.json`, `tsconfig.node.json` for better context isolation.

## Risks

- **Strapi downtime during build**: If Strapi is unreachable, `nuxt generate` will fail. Mitigation: retry logic in CI, or cached API responses as fallback.
- **Build time growth**: As content grows, build time increases linearly. Acceptable for a portfolio with <50 content items.
- **tsparticles bundle**: Even the slim variant adds significant JS. Must be lazy-loaded and limited to the hero viewport.
