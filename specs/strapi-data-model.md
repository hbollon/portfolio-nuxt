# Strapi Data Model

## Strapi version

**Confirmed: Strapi v5.** The API response shape is flat (no `data.attributes` wrapping). TypeScript types use the v5 format directly. Query syntax uses the v5 Document Service API.

## i18n configuration

- Plugin: Strapi built-in Internationalization (installed by default in v4/v5).
- Locales: `en` (default), `fr`.
- i18n is enabled per content type (see table below).
- When fetching, locale is passed as query parameter: `?locale=fr`.
- Content in the default locale (`en`) is returned when no locale is specified.

## Content types overview

| Content Type   | Kind        | i18n enabled | Draft/Publish | API ID (singular) | API ID (plural) |
|----------------|-------------|--------------|---------------|--------------------|-----------------|
| Technology     | Collection  | No           | No            | `technology`       | `technologies`  |
| Project        | Collection  | Yes          | Yes           | `project`          | `projects`      |
| Experience     | Collection  | Yes          | No            | `experience`       | `experiences`   |
| Education      | Collection  | Yes          | No            | `education`        | `educations`    |
| About          | Single Type | Yes          | No            | `about`            | —               |
| Homepage       | Single Type | Yes          | No            | `homepage`         | —               |
| Contact        | Single Type | Yes          | No            | `contact`          | —               |

### Rationale for i18n decisions

- **Technology**: i18n disabled. Technology names are universal ("Go", "Kubernetes", "TypeScript"). No translation needed. This avoids duplicating entries per locale.
- **Project**: i18n enabled. Project titles and descriptions should be translated for FR/EN audiences.
- **Experience / Education**: i18n enabled. Job titles, company descriptions, degree names differ by language.
- **Single Types**: i18n enabled. Hero text, bio, section titles are translated.

### Rationale for Draft/Publish decisions

- **Project**: Draft/Publish enabled. Projects may be work-in-progress and should not appear until published.
- **All others**: Draft/Publish disabled. These are always-visible content that doesn't need a draft workflow.

## Detailed field specifications

### Technology (Collection)

| Field        | Type         | Required | Unique | Constraints              | Notes                           |
|--------------|--------------|----------|--------|--------------------------|----------------------------------|
| `name`       | Short text   | Yes      | Yes    | —                        | Display name ("Go", "Docker")   |
| `slug`       | UID          | Yes      | Yes    | Auto-generated from name | URL/key identifier              |
| `category`   | Enumeration  | Yes      | No     | Values: `language`, `framework`, `tool`, `cloud`, `database`, `other` | Used for filtering in Skills section |
| `icon`       | Short text   | No       | No     | —                        | Icon identifier (e.g., devicon class name or icon component name) |
| `proficiency`| Enumeration  | No       | No     | Values: `beginner`, `intermediate`, `advanced`, `expert` | Visual indicator in UI |
| `color`      | Short text   | No       | No     | Hex color format         | Accent color for badge styling  |
| `order`      | Integer      | No       | No     | Default: 0               | Manual sort order               |

**Relations**: Referenced by Project, Experience, and About via many-to-many.

**Assumption**: Icon strategy decided: **`@nuxt/icon`** module (Iconify). The `icon` field stores an Iconify icon name (e.g., `devicon:go`, `mdi:docker`, `simple-icons:kubernetes`). The frontend renders these using the `<Icon>` component from `@nuxt/icon`.

### Project (Collection)

| Field              | Type              | Required | Unique | Constraints                  | Notes                                |
|--------------------|-------------------|----------|--------|------------------------------|--------------------------------------|
| `title`            | Short text        | Yes      | No     | —                            | Translated via i18n                  |
| `slug`             | UID               | Yes      | Yes    | Auto-generated from title    | Unique per locale                    |
| `shortDescription` | Short text        | Yes      | No     | Max 200 characters           | Used on cards (homepage)             |
| `fullDescription`  | Rich text (MD)    | Yes      | No     | —                            | Reserved for future detail page      |
| `thumbnail`        | Media (single)    | Yes      | No     | Images only                  | Card thumbnail                       |
| `gallery`          | Media (multiple)  | No       | No     | Images only                  | Reserved for future detail page      |
| `technologies`     | Relation          | No       | No     | Many-to-many with Technology | Displayed as badges on card          |
| `links`            | Component (repeat)| No       | No     | Component: `project.link`    | GitHub, live demo, etc.              |
| `featured`         | ~~Boolean~~           | ~~No~~       | ~~No~~     | ~~Default: false~~               | **DEPRECATED** — Use Homepage `featuredProjects` relation instead |
| `startDate`        | Date              | Yes      | No     | —                            | Project start date                   |
| `endDate`          | Date              | No       | No     | —                            | Null if ongoing                      |
| `projectStatus`    | Enumeration       | No       | No     | Values: `completed`, `in_progress`, `archived` | Display status badge. Renamed from `status` to avoid collision with Strapi's internal `status` field (reserved by `draftAndPublish`). |
| `order`            | Integer           | No       | No     | Default: 0                   | Manual sort order                    |
| `seo`              | Component (single)| No       | No     | Component: `shared.seo`      | Reserved for future detail page      |

**Query for homepage**: `GET /api/projects?populate=thumbnail,technologies,links&sort=order:asc&locale={locale}` — Featured projects are fetched via the Homepage `featuredProjects` relation, not via a `featured` filter.

**Note on `fullDescription`, `gallery`, and `seo`**: These fields exist for forward compatibility. When project detail pages are implemented, these fields are already available without schema migration. In v1, they are not fetched or displayed.

### Experience (Collection)

| Field          | Type              | Required | Unique | Constraints                  | Notes                           |
|----------------|-------------------|----------|--------|------------------------------|---------------------------------|
| `company`      | Short text        | Yes      | No     | —                            | Company name                    |
| `position`     | Short text        | Yes      | No     | —                            | Job title (translated)          |
| `location`     | Short text        | Yes      | No     | —                            | City, Country                   |
| `startDate`    | Date              | Yes      | No     | —                            | Employment start                |
| `endDate`      | Date              | No       | No     | —                            | Null if current position        |
| `isCurrent`    | Boolean           | No       | No     | Default: false               | Redundant with null endDate, but explicit for querying |
| `description`  | Rich text (MD)    | Yes      | No     | —                            | Role description (translated)   |
| `technologies` | Relation          | No       | No     | Many-to-many with Technology | Tech used in this role          |
| `logo`         | Media (single)    | No       | No     | Images only                  | Company logo                    |
| `order`        | Integer           | No       | No     | Default: 0                   | Manual sort order               |

**Query**: `GET /api/experiences?populate=logo,technologies&sort=order:asc&locale={locale}`

**Note on `isCurrent`**: This field is technically redundant (`endDate === null` implies current). However, it makes Strapi admin UX clearer and avoids null-check logic in queries. Acceptable trade-off.

### Education (Collection)

| Field          | Type           | Required | Unique | Constraints | Notes                           |
|----------------|----------------|----------|--------|-------------|---------------------------------|
| `institution`  | Short text     | Yes      | No     | —           | School/university name          |
| `degree`       | Short text     | Yes      | No     | —           | Degree type (translated)        |
| `field`        | Short text     | Yes      | No     | —           | Field of study (translated)     |
| `location`     | Short text     | Yes      | No     | —           | City, Country                   |
| `startDate`    | Date           | Yes      | No     | —           | Start date                      |
| `endDate`      | Date           | Yes      | No     | —           | End date (required, education is completed) |
| `description`  | Long text      | No       | No     | —           | Optional additional info        |
| `logo`         | Media (single) | No       | No     | Images only | Institution logo                |
| `order`        | Integer        | No       | No     | Default: 0  | Manual sort order               |

**Query**: `GET /api/educations?populate=logo&sort=order:asc&locale={locale}`

### About (Single Type)

| Field              | Type              | Required | Unique | Constraints                  | Notes                           |
|--------------------|-------------------|----------|--------|------------------------------|---------------------------------|
| `title`            | Short text        | Yes      | —      | —                            | Section title (translated)      |
| `subtitle`         | Short text        | Yes      | —      | —                            | Section subtitle (translated)   |
| `bio`              | Rich text (MD)    | Yes      | —      | —                            | Bio content (translated)        |
| `profilePicture`   | Media (single)    | Yes      | —      | Images only                  | Profile photo                   |
| `resume`           | Media (single)    | No       | —      | Files only (.pdf)            | Downloadable CV                 |
| `socialLinks`      | Component (repeat)| No       | —      | Component: `about.social-link`| Social media links             |
| `highlightedSkills`| Relation          | No       | —      | Many-to-many with Technology | Top skills to highlight (max 10)|

**Query**: `GET /api/about?populate=profilePicture,resume,socialLinks,highlightedSkills&locale={locale}`

### Homepage (Single Type)

| Field             | Type              | Required | Unique | Constraints                 | Notes                          |
|-------------------|-------------------|----------|--------|-----------------------------|--------------------------------|
| `heroTitle`       | Short text        | Yes      | —      | —                           | Main hero heading (translated) |
| `heroSubtitle`    | Short text        | Yes      | —      | —                           | Hero subheading (translated)   |
| `heroCtaText`     | Short text        | Yes      | —      | —                           | CTA button text (translated)   |
| `heroCtaLink`     | Short text        | Yes      | —      | —                           | CTA anchor target (e.g., `#projects`) |
| `featuredProjects`| Relation          | No       | —      | Many-to-many with Project   | Projects shown in hero or featured section |
| `seo`             | Component (single)| No       | —      | Component: `shared.seo`     | Homepage meta tags             |

**Query**: `GET /api/homepage?populate=featuredProjects.thumbnail,featuredProjects.technologies,seo.ogImage&locale={locale}`

**Note**: `featuredProjects` on Homepage is the **single source of truth** for which projects appear on the homepage. The `featured` boolean on Project is deprecated and should not be created in the Strapi schema. Homepage relation allows explicit ordering and selection of which projects appear.

### Contact (Single Type)

| Field            | Type              | Required | Unique | Constraints                     | Notes                          |
|------------------|-------------------|----------|--------|---------------------------------|--------------------------------|
| `title`          | Short text        | Yes      | —      | —                               | Section title (translated)     |
| `description`    | Long text         | Yes      | —      | —                               | Section description (translated)|
| `email`          | Email             | Yes      | —      | —                               | Contact email address          |
| `availableForWork`| Boolean          | No       | —      | Default: true                   | Availability status indicator  |
| `contactMethods` | Component (repeat)| No       | —      | Component: `contact.method`     | Additional contact methods     |

**Query**: `GET /api/contact?populate=contactMethods&locale={locale}`

**Scope clarification**: `contactMethods` and `socialLinks` (from About) serve different purposes. About's `socialLinks` represent the developer's online identity (GitHub, LinkedIn, etc.). Contact's `contactMethods` represent reachability channels (email, phone, etc.). **Decision: keep both** for separation of concerns (About = identity, Contact = reachability).

## Components

### `project.link`

| Field   | Type        | Required | Constraints                                    |
|---------|-------------|----------|------------------------------------------------|
| `label` | Short text  | Yes      | —                                              |
| `url`   | Short text  | Yes      | URL format                                     |
| `type`  | Enumeration | No       | Values: `github`, `live`, `demo`, `article`    |

### `about.social-link`

| Field      | Type        | Required | Constraints                                           |
|------------|-------------|----------|-------------------------------------------------------|
| `platform` | Enumeration | Yes      | Values: `github`, `linkedin`, `twitter`, `email`, `website` |
| `url`      | Short text  | Yes      | URL format                                            |
| `label`    | Short text  | Yes      | Display text                                          |

### `contact.method`

| Field    | Type       | Required | Constraints |
|----------|------------|----------|-------------|
| `method` | Short text | Yes      | —           |
| `value`  | Short text | Yes      | —           |
| `icon`   | Short text | No       | —           |

### `shared.seo`

| Field             | Type           | Required | Constraints              |
|-------------------|----------------|----------|--------------------------|
| `metaTitle`       | Short text     | No       | Max 60 characters        |
| `metaDescription` | Long text      | No       | Max 160 characters       |
| `ogImage`         | Media (single) | No       | Images only, 1200x630px recommended |
| `keywords`        | Short text     | No       | Comma-separated          |

## Relations map

```
Technology ──┬── many-to-many ── Project
             ├── many-to-many ── Experience
             └── many-to-many ── About (highlightedSkills)

Project ──── many-to-many ── Homepage (featuredProjects)
```

All relations are bidirectional in Strapi but only queried from one side (the parent content type populates the related Technology/Project).

## API permissions

All content types: **Public role** has `find` and `findOne` enabled (read-only).

No authenticated routes needed. The API token provides authorization for build-time access. Public permissions are needed because the custom composable may not always send the bearer token depending on configuration.

**Security note**: Even with public read permissions, Strapi admin panel remains protected behind authentication. No write operations are exposed.

## Performance considerations

- **Populate depth**: All queries use explicit `populate` parameters to avoid deep recursive population. Strapi v5 uses the Document Service API with similar populate mechanics. All queries in this model require only depth 1 (direct relations), except Homepage which requires depth 2 (`featuredProjects.thumbnail`).
- **Sorting**: All collections are sorted by `order:asc` to respect manual ordering. This requires the `order` field to be indexed for performance on large datasets. For a portfolio (<50 entries per collection), this is negligible.
- **Image formats**: Strapi generates responsive formats (thumbnail, small, medium, large) automatically if the `responsive` option is enabled in upload settings. This should be verified on the deployed instance.

## SEO impact

- **Slug fields**: Enable clean URLs for future project detail pages (`/projects/go-edlib`).
- **SEO component**: Allows per-page meta customization without code changes.
- **Rich text fields**: Markdown content should be rendered to semantic HTML (headings, lists, links) for proper indexation.

## Future evolution

| Feature                     | Impact on data model                             |
|-----------------------------|--------------------------------------------------|
| Project detail pages        | No schema change needed (`fullDescription`, `slug`, `seo` already exist) |
| Blog                        | New collection type `Article` with similar structure to Project |
| Contact form                | New collection type `Message` (or external service, no Strapi impact) |
| Testimonials                | New collection type `Testimonial` (name, role, quote, avatar) |
| Additional locales          | Add locale in Strapi settings, create translations per content type |

## Open questions

1. ~~**Strapi version (v4 vs v5)**~~: **Resolved. Strapi v5.**
2. ~~**`featured` boolean vs Homepage relation**~~: **Resolved. Homepage `featuredProjects` relation is the single source of truth. `featured` boolean is deprecated.**
3. ~~**`contactMethods` vs `socialLinks`**~~: **Resolved. Keep both for separation of concerns (About = identity, Contact = reachability).**
4. **Media storage**: Confirmed as S3, served via CloudFront CDN (see deployment.md and performance.md). The `getStrapiMedia()` helper must handle S3/CloudFront URLs (which are already absolute URLs starting with `https://`). `@nuxt/image` does not proxy these URLs through Strapi — see performance.md for the image optimization strategy.
5. ~~**Rich text format**~~: **Resolved. Markdown.** Frontend rendering uses a Markdown parser (remark/rehype).
