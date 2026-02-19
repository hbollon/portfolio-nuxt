# Deployment

## Decisions

### Environments

| Environment | Purpose                    | Branch  |
|-------------|----------------------------|---------|
| Dev         | Local development          | `develop` or feature branches |
| Prod        | Live site                  | `main`  |

No staging environment. Decision is explicit: portfolio scope does not justify a third environment.

### Infrastructure overview

```
┌──────────────┐     Build time      ┌──────────────┐
│   Strapi     │ ──── REST API ────> │  GitHub CI   │
│   (AWS)      │                     │  (Actions)   │
└──────────────┘                     └──────┬───────┘
                                            │
                                      nuxt generate
                                            │
                                            ▼
                                     ┌──────────────┐
                                     │   AWS S3     │
                                     │  (static)    │
                                     └──────┬───────┘
                                            │
                                            ▼
                                     ┌──────────────┐
              End users ◄──────────  │  CloudFront  │
                                     │   (CDN)      │
                                     └──────────────┘
```

### Frontend hosting

| Component    | Service           | Detail                                    |
|--------------|-------------------|-------------------------------------------|
| Static files | AWS S3            | Bucket with static website hosting enabled |
| CDN          | AWS CloudFront    | Global edge distribution                  |
| SSL          | AWS ACM           | Free managed certificate                  |
| DNS          | To be determined  | `hugobollon.dev` → CloudFront             |

Decision: AWS hosting is chosen for coherence with existing Strapi infrastructure. This is not open for reconsideration.

### CI/CD pipeline

**Tool**: GitHub Actions.

**Trigger**: Push to `main` branch.

**Pipeline steps**:
1. Checkout repository.
2. Setup Node.js 20 with Yarn cache.
3. `yarn install --frozen-lockfile`.
4. `yarn generate` (with Strapi env vars from GitHub Secrets).
5. Upload `.output/public/` to S3 bucket (`aws s3 sync --delete`).
6. Invalidate CloudFront cache (`aws cloudfront create-invalidation --paths "/*"`).

**Required GitHub Secrets**:
| Secret                        | Description                       |
|-------------------------------|-----------------------------------|
| `STRAPI_URL`                  | Strapi API base URL               |
| `STRAPI_TOKEN`                | Strapi read-only API token        |
| `AWS_ACCESS_KEY_ID`           | AWS credentials for S3/CloudFront |
| `AWS_SECRET_ACCESS_KEY`       | AWS credentials for S3/CloudFront |
| `AWS_REGION`                  | AWS region (e.g., `eu-west-3`)    |
| `S3_BUCKET_NAME`              | Target S3 bucket name             |
| `CLOUDFRONT_DISTRIBUTION_ID`  | CloudFront distribution ID        |
| `GOOGLE_ANALYTICS_ID`         | GA4 measurement ID (optional)     |

### Content update workflow

When editorial content changes in Strapi:

**Option A — Manual rebuild** (v1):
- Author logs into GitHub and manually triggers the workflow via `workflow_dispatch`.

**Option B — Webhook-triggered rebuild** (future):
- Strapi webhook fires on `entry.create`, `entry.update`, `entry.delete`.
- Webhook targets GitHub API to trigger `repository_dispatch`.
- GitHub Actions workflow triggers on `repository_dispatch` event type `strapi-update`.

Decision: Option A for v1. Option B is documented for future implementation.

### Cache strategy

| Asset type           | Cache-Control                                   | CloudFront TTL |
|----------------------|-------------------------------------------------|----------------|
| HTML files           | `public, max-age=0, must-revalidate`            | Short (5 min)  |
| Hashed assets (JS/CSS) | `public, max-age=31536000, immutable`         | 1 year         |
| Images               | `public, max-age=86400`                         | 1 day          |
| Fonts                | `public, max-age=31536000`                      | 1 year         |

Nuxt generates hashed filenames for JS/CSS bundles, enabling aggressive caching.

### Compression

CloudFront is configured to compress responses with Brotli (preferred) or Gzip.
S3 serves uncompressed files; compression happens at the CloudFront edge.

## Assumptions

- AWS credentials used in CI have minimal permissions: `s3:PutObject`, `s3:DeleteObject`, `s3:ListBucket` on the target bucket, and `cloudfront:CreateInvalidation` on the distribution.
- S3 bucket is configured for static website hosting with index document `index.html` and error document `404.html` (or `200.html` for SPA fallback, though SSG should not need this).
- CloudFront is configured with the S3 bucket as origin (via OAI or OAC, not public bucket).
- HTTPS is enforced (HTTP → HTTPS redirect at CloudFront level).

## Open questions

1. ~~**Domain name**~~: **Resolved. `hugobollon.dev`.** Required for CloudFront alternate domain name (CNAME), ACM certificate, and DNS configuration.
2. **404 handling**: Nuxt SSG generates a `404.html`. CloudFront custom error response must be configured to return this page with HTTP 404 status on S3 403 responses (object not found).
3. **Webhook rebuild**: Not implemented in v1. When implementing, the Strapi webhook needs a GitHub Personal Access Token with `repo` scope. Security implications must be evaluated.
4. **AWS IAM**: Exact IAM policy for CI deployment is not specified. Should follow least-privilege principle.

## Risks

- **Strapi unreachable during CI build**: `nuxt generate` will fail if it cannot fetch data. No retry or fallback cache is configured in v1. Build failure is acceptable (manual retry).
- **CloudFront invalidation cost**: AWS charges per invalidation path after the first 1000/month. Using `/*` wildcard counts as one path. At portfolio update frequency, this is negligible.
- **S3 sync --delete**: This removes files from S3 that are not in the build output. If a deployment fails midway, the site could be partially broken until the next successful deployment.
