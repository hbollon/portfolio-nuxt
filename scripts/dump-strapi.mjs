/**
 * dump-strapi.mjs
 *
 * Fetches every Strapi endpoint and writes the raw JSON responses to
 * scripts/dump/<endpoint>.json for manual schema/content validation.
 *
 * Usage:
 *   node scripts/dump-strapi.mjs [--locale fr|en]
 *
 * Reads STRAPI_URL and STRAPI_TOKEN from the environment or from .env at
 * the project root (dotenv is a transitive dependency via Nuxt).
 *
 * Output files are ignored by git (see .gitignore: scripts/dump/).
 */

import { readFileSync, mkdirSync, writeFileSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { $fetch } from 'ofetch'

// ---------------------------------------------------------------------------
// Bootstrap: load .env if present
// ---------------------------------------------------------------------------
const __dirname = dirname(fileURLToPath(import.meta.url))
const root = resolve(__dirname, '..')

try {
  const raw = readFileSync(resolve(root, '.env'), 'utf8')
  for (const line of raw.split('\n')) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue
    const eqIdx = trimmed.indexOf('=')
    if (eqIdx === -1) continue
    const key = trimmed.slice(0, eqIdx).trim()
    const value = trimmed
      .slice(eqIdx + 1)
      .trim()
      .replace(/^["']|["']$/g, '')
    if (!(key in process.env)) {
      process.env[key] = value
    }
  }
} catch {
  // No .env file — rely on environment variables already set
}

// ---------------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------------
const BASE_URL = process.env['STRAPI_URL']
const TOKEN = process.env['STRAPI_TOKEN']
const LOCALE = process.argv.includes('--locale')
  ? process.argv[process.argv.indexOf('--locale') + 1]
  : undefined

if (!BASE_URL) {
  console.error('Error: STRAPI_URL is not set. Set it in .env or as an env variable.')
  process.exit(1)
}

const OUT_DIR = resolve(__dirname, 'dump')
mkdirSync(OUT_DIR, { recursive: true })

// ---------------------------------------------------------------------------
// Endpoint definitions
// ---------------------------------------------------------------------------
const endpoints = [
  {
    name: 'homepage',
    path: '/api/homepage',
    query: {
      ...(LOCALE ? { locale: LOCALE } : {}),
      populate: {
        featuredProjects: {
          populate: ['thumbnail', 'technologies', 'links'],
        },
        seo: {
          populate: ['ogImage'],
        },
      },
    },
  },
  {
    name: 'about',
    path: '/api/about',
    query: {
      ...(LOCALE ? { locale: LOCALE } : {}),
      populate: ['profilePicture', 'resume', 'socialLinks', 'highlightedSkills'],
    },
  },
  {
    name: 'contact',
    path: '/api/contact',
    query: {
      ...(LOCALE ? { locale: LOCALE } : {}),
      populate: ['contactMethods'],
    },
  },
  {
    name: 'projects',
    path: '/api/projects',
    query: {
      ...(LOCALE ? { locale: LOCALE } : {}),
      populate: ['thumbnail', 'technologies', 'links'],
      sort: ['order:asc'],
    },
  },
  {
    name: 'experiences',
    path: '/api/experiences',
    query: {
      ...(LOCALE ? { locale: LOCALE } : {}),
      populate: ['logo', 'technologies'],
      sort: ['order:asc'],
    },
  },
  {
    name: 'educations',
    path: '/api/educations',
    query: {
      ...(LOCALE ? { locale: LOCALE } : {}),
      populate: ['logo'],
      sort: ['order:asc'],
    },
  },
  {
    name: 'technologies',
    path: '/api/technologies',
    query: {
      sort: ['order:asc'],
    },
  },
]

// ---------------------------------------------------------------------------
// Fetch & dump
// ---------------------------------------------------------------------------
const headers = TOKEN ? { Authorization: `Bearer ${TOKEN}` } : {}

let success = 0
let failure = 0

for (const endpoint of endpoints) {
  process.stdout.write(`Fetching ${endpoint.name}... `)
  try {
    const data = await $fetch(endpoint.path, {
      baseURL: BASE_URL,
      headers,
      query: endpoint.query,
    })
    const outFile = resolve(OUT_DIR, `${endpoint.name}.json`)
    writeFileSync(outFile, JSON.stringify(data, null, 2) + '\n', 'utf8')
    console.log(`OK → scripts/dump/${endpoint.name}.json`)
    success++
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    console.log(`FAILED — ${message}`)
    failure++
  }
}

console.log(`\nDone: ${success} succeeded, ${failure} failed.`)
if (LOCALE) {
  console.log(`Locale: ${LOCALE}`)
} else {
  console.log('No locale filter applied (default Strapi locale will be used).')
  console.log('Tip: use --locale fr or --locale en to filter by locale.')
}
