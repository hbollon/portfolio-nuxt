# Tech Stack

## Decisions

### Core framework

| Layer      | Technology          | Version   | Status     |
|------------|---------------------|-----------|------------|
| Framework  | Nuxt 4              | latest    | Imposed    |
| UI         | Vue 3               | latest    | Imposed    |
| Language   | TypeScript          | latest    | Imposed    |
| Styling    | TailwindCSS         | ^4.x      | Imposed    |
| Package mgr| Yarn Berry          | 4.x       | Imposed    |
| Runtime    | Node.js             | v24 LTS   | Imposed    |

These choices are imposed by the project owner and are not open for discussion unless a critical blocking issue is identified.

### Nuxt modules

| Module                  | Purpose                         | Loading     |
|-------------------------|---------------------------------|-------------|
| `@nuxtjs/i18n`          | Internationalization (FR + EN)  | Universal   |
| `@nuxt/image`           | Image optimization (local assets) | Universal   |
| `@vueuse/nuxt`          | Vue composition utilities       | Universal   |
| `@nuxtjs/sitemap`       | Sitemap generation              | Build       |
| `@nuxt/icon`            | Iconify icon system             | Universal   |

**Note**: `@nuxtjs/tailwindcss` is **not used**. Tailwind v4 integrates directly via the `@tailwindcss/vite` Vite plugin, without a Nuxt module layer. Configuration is CSS-based (`@theme` in `assets/css/main.css`), not a `tailwind.config.ts` JS file.

### External libraries

| Library              | Purpose                 | Loading      | Bundle concern          |
|----------------------|-------------------------|--------------|-------------------------|
| `gsap`               | Advanced animations     | Client-only  | ~30kb min (tree-shaken) |
| `@tsparticles/vue3`  | Particles component     | Client-only  | Depends on engine       |
| `@tsparticles/slim`  | Slim particle engine    | Client-only  | ~30kb                   |
| `vue-gtag-next`      | Google Analytics 4      | Client-only  | ~5kb                    |

### Strapi integration

**Decision: Custom composable** wrapping Nuxt's built-in `useFetch` / `useAsyncData` with the Strapi API token passed via `Authorization` header. This is lighter, more explicit, and avoids pulling in auth-related code that will never be used.

- No `@nuxtjs/strapi` module. The composable interface is `useStrapi()` in `composables/useStrapi.ts`.
- Strapi version: **v5** (flat API response, no `data.attributes` wrapping).
- See `strapi-data-model.md` for content types and query patterns.

### Dev tooling

| Tool                          | Purpose                      |
|-------------------------------|------------------------------|
| ESLint                        | Code linting (flat config)   |
| Prettier                      | Code formatting              |
| `prettier-plugin-tailwindcss` | Tailwind class ordering      |
| TypeScript `strict: true`     | Strict type checking         |

**Note**: `prettier-plugin-tailwindcss` supports Tailwind v4 starting from v0.6.x.

### Not included (explicit exclusions)

| Technology      | Reason                                                    |
|-----------------|-----------------------------------------------------------|
| Vitest          | No tests planned in v1 (portfolio scope)                  |
| Storybook       | Overkill for single-developer portfolio                   |
| GraphQL         | REST is sufficient for the data complexity                |
| Pinia           | No client-side state management needed (SSG, props-based) |
| Blog engine     | Explicitly excluded from v1 scope                         |

## TypeScript configuration

- `strict: true` enforced.
- `typeCheck: true` in `nuxt.config.ts` to enable build-time type checking.
- `noUncheckedIndexedAccess: true` — Nuxt 4 default. Array and object index access returns `T | undefined`. All index access must be guarded.
- No `any` type allowed. Strapi response types defined in `shared/types/strapi.ts`.
- Vue components use `<script setup lang="ts">` exclusively.
- Props defined with `defineProps<T>()` using generic syntax.
- Nuxt 4 generates split tsconfig files: `tsconfig.app.json`, `tsconfig.server.json`, `tsconfig.shared.json`, `tsconfig.node.json`. Types in `shared/` are picked up by `tsconfig.shared.json`.

## Environment variables

| Variable              | Required | Used at      | Description                    |
|-----------------------|----------|--------------|--------------------------------|
| `STRAPI_URL`          | Yes      | Build time   | Strapi API base URL            |
| `STRAPI_TOKEN`        | Yes      | Build time   | Strapi read-only API token     |
| `GOOGLE_ANALYTICS_ID` | No       | Runtime      | GA4 measurement ID (G-XXXXX)   |
| `NUXT_PUBLIC_SITE_URL`| Yes      | Build time   | Canonical site URL for SEO     |

- Build-time variables are consumed via `runtimeConfig` (private) or `runtimeConfig.public` (exposed to client).
- `STRAPI_URL` and `STRAPI_TOKEN` must NOT be exposed to the client. They are only used during `nuxt generate`.

## Assumptions

- Node.js v24 LTS is the target runtime for development and CI.
- Yarn Berry (v4) is used. `.yarn/` directory and `.yarnrc.yml` are committed. `yarn.lock` format is v8.
- PnP mode is **disabled** (`nodeLinker: node-modules` in `.yarnrc.yml`) for compatibility with Nuxt and native modules.
- ESLint uses the new flat config format (`eslint.config.js`, not `.eslintrc`).

## Open questions

1. ~~**Strapi module vs custom composable**~~: **Resolved. Custom composable (`useStrapi.ts`).**
2. ~~**Tailwind v3 vs v4**~~: **Resolved. Tailwind v4 with `@tailwindcss/vite` plugin. No `tailwind.config.ts`, configuration is CSS-based.**
3. **`@tsparticles/slim` vs `@tsparticles/engine` + presets**: The slim bundle includes common shapes and interactions. If only the stars preset is needed, a more minimal import may be possible. To investigate during Phase 4.
