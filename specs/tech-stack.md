# Tech Stack

## Decisions

### Core framework

| Layer      | Technology          | Version   | Status     |
|------------|---------------------|-----------|------------|
| Framework  | Nuxt 3              | ^3.15     | Imposed    |
| UI         | Vue 3               | ^3.5      | Imposed    |
| Language   | TypeScript          | ^5.6      | Imposed    |
| Styling    | TailwindCSS         | ^3.4      | Imposed    |
| Package mgr| Yarn (Classic v1)   | 1.22.x    | Imposed    |
| Runtime    | Node.js             | v20 LTS   | Detected   |

These choices are imposed by the project owner and are not open for discussion unless a critical blocking issue is identified.

### Nuxt modules

| Module                  | Purpose                         | Loading     |
|-------------------------|---------------------------------|-------------|
| `@nuxtjs/tailwindcss`   | Tailwind integration            | Universal   |
| `@nuxtjs/i18n`          | Internationalization (FR + EN)  | Universal   |
| `@nuxt/image`           | Image optimization (local assets) | Universal   |
| `@vueuse/nuxt`          | Vue composition utilities       | Universal   |
| `nuxt-simple-sitemap`   | Sitemap generation              | Build       |
| `nuxt-icon`             | Iconify icon system             | Universal   |

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
- No `any` type allowed. Strapi response types defined in `types/strapi.d.ts`.
- Vue components use `<script setup lang="ts">` exclusively.
- Props defined with `defineProps<T>()` using generic syntax.

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

- Node.js v20 LTS is the target runtime for development and CI.
- Yarn Classic (v1) is used, not Yarn Berry (v2+). `yarn.lock` format is v1.
- ESLint uses the new flat config format (`eslint.config.js`, not `.eslintrc`).

## Open questions

1. ~~**Strapi module vs custom composable**~~: **Resolved. Custom composable (`useStrapi.ts`).**
2. **Tailwind v3 vs v4**: Tailwind v4 was released in 2025. The session assumes v3. If v4 is desired, configuration format changes significantly (CSS-based config vs JS). **Decision: Stay on v3 for stability.**
3. **`@tsparticles/slim` vs `@tsparticles/engine` + presets**: The slim bundle includes common shapes and interactions. If only the stars preset is needed, a more minimal import may be possible. To investigate during Phase 4.
