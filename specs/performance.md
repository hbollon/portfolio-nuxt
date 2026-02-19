# Performance

## Decisions

### Target metrics

| Metric                       | Desktop target | Mobile target |
|------------------------------|----------------|---------------|
| Lighthouse Performance       | > 95           | > 90          |
| Lighthouse Accessibility     | 100            | 100           |
| Lighthouse Best Practices    | 100            | 100           |
| Lighthouse SEO               | 100            | 100           |
| First Contentful Paint (FCP) | < 1.0s         | < 1.5s        |
| Largest Contentful Paint (LCP)| < 2.0s        | < 2.5s        |
| Cumulative Layout Shift (CLS)| < 0.05         | < 0.1         |
| Total Blocking Time (TBT)    | < 100ms        | < 200ms       |
| Initial JS bundle (gzipped)  | < 100kb        | < 100kb       |
| Total CSS (gzipped)          | < 30kb         | < 30kb        |

### Rendering strategy

SSG eliminates server response time entirely. All pages are pre-rendered HTML served from CDN. This is the single most impactful performance decision.

### Image optimization

| Decision                          | Implementation                                  |
|-----------------------------------|--------------------------------------------------|
| Format                            | WebP primary, AVIF where supported               |
| Lazy loading                      | Native `loading="lazy"` on all below-fold images |
| Responsive images                 | `<NuxtImg>` with `sizes` attribute               |
| Quality                           | 80% (good balance of quality vs size)            |
| Hero/LCP images                   | Eager loading (`loading="eager"` + `fetchpriority="high"`) |
| Image source                      | Strapi S3 URLs served via CloudFront             |

`@nuxt/image` configuration:
- Provider: `none` (default) — images are served directly from S3/CloudFront URLs, not proxied through Nuxt Image's optimization pipeline.
- Formats: `['webp', 'avif']` when using the IPX provider for local images.
- For Strapi S3 images: the URLs are already final (Strapi v5 / S3 handles no server-side transformation). Image optimization must happen at upload time in Strapi (sharp plugin) or via CloudFront Lambda@Edge.

**Identified issue**: The session proposed using `@nuxt/image` with a `strapi` provider. This provider sends image requests through the Strapi server for on-the-fly transformation. Since Strapi is not exposed to end users (only used at build time), this provider cannot work at runtime. Options:
1. Use `@nuxt/image` with IPX provider for local images only, and raw `<img>` for Strapi S3 images with manual `srcset`.
2. Use CloudFront image transformation (Lambda@Edge or CloudFront Functions) to serve optimized variants.
3. Ensure Strapi generates responsive formats at upload time (Strapi's built-in `responsive` setting creates thumbnail, small, medium, large variants).

**Recommended**: Option 3 (Strapi generates variants) + `<NuxtImg>` pointing to the appropriate Strapi format URL. No runtime image transformation needed.

### Font loading

| Decision                | Implementation                              |
|-------------------------|---------------------------------------------|
| Source                  | Google Fonts CDN                            |
| Loading strategy        | `<link rel="preconnect">` + `<link rel="stylesheet">` |
| Font display            | `font-display: swap`                        |
| Subset                  | `latin` (covers EN + FR characters)         |
| Fonts loaded            | Inter (400, 500, 600, 700, 800), JetBrains Mono (400) |

Performance note: Inter variable font is ~100kb. If this impacts LCP, consider subsetting or using `latin-ext` only if needed.

### JavaScript budget

| Component          | Estimated size (gzipped) | Loading     |
|--------------------|--------------------------|-------------|
| Nuxt runtime       | ~30kb                    | Critical    |
| Vue 3 runtime      | ~15kb                    | Critical    |
| Application code   | ~15-20kb                 | Critical    |
| GSAP core          | ~25kb                    | Client-only, deferred |
| GSAP ScrollTrigger | ~10kb                    | Client-only, deferred |
| tsparticles/slim   | ~30kb                    | Client-only, deferred |
| vue-gtag-next      | ~5kb                     | Client-only, deferred |
| @nuxtjs/i18n       | ~10kb                    | Critical    |
| **Total**          | **~140-160kb**           |             |

This exceeds the 100kb target for initial bundle. Mitigations:
- GSAP, tsparticles, and gtag are loaded only client-side and should be deferred/lazy.
- The initial HTML payload (SSG) renders without JavaScript. JS enhances with animations and interactivity.
- Critical path: Nuxt + Vue + app code + i18n ≈ 70-75kb (within budget).
- Non-critical: GSAP + tsparticles + gtag ≈ 70-80kb (loaded after hydration).

### Animations performance

| Rule                                      | Detail                                    |
|-------------------------------------------|-------------------------------------------|
| Frame rate target                         | 60 FPS consistently                       |
| CSS `will-change`                         | Apply only on elements being animated, remove after |
| Composite-only properties                 | Prefer `transform` and `opacity` over `top/left/width` |
| tsparticles count                         | Maximum 100 particles                     |
| tsparticles FPS limit                     | 60                                        |
| GSAP ScrollTrigger                        | Use `batch` for multiple elements         |
| `prefers-reduced-motion`                  | Disable all non-essential animations      |
| Mobile animations                         | Consider reducing particle count to 50    |

### Build optimization

- `nuxt analyze` to verify bundle composition.
- Tree-shaking: import only used GSAP plugins (`import { ScrollTrigger } from 'gsap/ScrollTrigger'`).
- No unused Tailwind classes in production (PurgeCSS is built into Tailwind).
- Compression: Brotli (preferred) or Gzip via CloudFront.

## Assumptions

- CloudFront serves all static assets with appropriate `Cache-Control` headers (long TTL for hashed assets, short for HTML).
- Strapi generates responsive image formats at upload time (thumbnail, small, medium, large).
- GSAP is not part of the critical rendering path. The page is fully readable without JavaScript.

## Risks

- **Font loading blocking LCP**: If Google Fonts CDN is slow, FCP/LCP degrades. Mitigation: `font-display: swap`, preconnect hints, or consider self-hosting fonts.
- **tsparticles on low-end mobile**: Canvas rendering may cause jank. Mitigation: detect device capability, reduce particle count, or disable entirely on low-end.
- **Hydration mismatch**: Client-only plugins (GSAP, particles) may cause flicker or layout shifts during hydration. Mitigation: wrap client-only components in `<ClientOnly>` with skeleton fallback.
