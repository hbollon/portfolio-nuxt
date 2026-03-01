export type StrapiId = number

export interface StrapiMeta {
  createdAt: string
  updatedAt: string
  publishedAt?: string | null
  locale?: string
}

export interface StrapiMediaFormat {
  ext: string
  url: string
  hash: string
  mime: string
  name: string
  path?: string | null
  size: number
  width?: number | null
  height?: number | null
}

export interface StrapiMedia extends StrapiMeta {
  id: StrapiId
  name: string
  alternativeText?: string | null
  caption?: string | null
  width?: number | null
  height?: number | null
  formats?: Record<string, StrapiMediaFormat> | null
  hash: string
  ext: string
  mime: string
  size: number
  url: string
  previewUrl?: string | null
  provider?: string | null
  provider_metadata?: Record<string, unknown> | null
}

export type TechnologyCategory = 'language' | 'framework' | 'tool' | 'cloud' | 'database' | 'other'

export type TechnologyProficiency = 'beginner' | 'intermediate' | 'advanced' | 'expert'

export interface Technology extends StrapiMeta {
  id: StrapiId
  name: string
  slug: string
  category: TechnologyCategory
  icon?: string | null
  proficiency?: TechnologyProficiency | null
  color?: string | null
  order?: number | null
}

export type ProjectStatus = 'completed' | 'in_progress' | 'archived'

export type ProjectLinkType = 'github' | 'live' | 'demo' | 'article'

export interface ProjectLink {
  label: string
  url: string
  type?: ProjectLinkType | null
}

export interface SharedSeo {
  metaTitle?: string | null
  metaDescription?: string | null
  keywords?: string | null
  ogImage?: StrapiMedia | null
}

export interface Project extends StrapiMeta {
  id: StrapiId
  title: string
  slug: string
  shortDescription: string
  fullDescription: string
  thumbnail: StrapiMedia
  gallery?: StrapiMedia[] | null
  technologies?: Technology[] | null
  links?: ProjectLink[] | null
  startDate: string
  endDate?: string | null
  projectStatus?: ProjectStatus | null
  order?: number | null
  seo?: SharedSeo | null
}

export interface Experience extends StrapiMeta {
  id: StrapiId
  company: string
  position: string
  location: string
  startDate: string
  endDate?: string | null
  isCurrent?: boolean | null
  description: string
  technologies?: Technology[] | null
  logo?: StrapiMedia | null
  order?: number | null
}

export interface Education extends StrapiMeta {
  id: StrapiId
  institution: string
  degree: string
  field: string
  location: string
  startDate: string
  endDate: string
  description?: string | null
  logo?: StrapiMedia | null
  order?: number | null
}

export type SocialPlatform = 'github' | 'linkedin' | 'twitter' | 'email' | 'website'

export interface SocialLink {
  platform: SocialPlatform
  url: string
  label: string
}

export interface About extends StrapiMeta {
  id: StrapiId
  title: string
  subtitle: string
  bio: string
  profilePicture: StrapiMedia
  resume?: StrapiMedia | null
  socialLinks?: SocialLink[] | null
  highlightedSkills?: Technology[] | null
}

export interface Homepage extends StrapiMeta {
  id: StrapiId
  appTitle: string
  heroTitle: string
  heroSubtitle: string
  heroDescription: string
  heroCtaText: string
  heroCtaLink: string
  featuredProjects?: Project[] | null
  seo?: SharedSeo | null
}

export interface ContactMethod {
  method: string
  value: string
  icon?: string | null
}

export interface Contact extends StrapiMeta {
  id: StrapiId
  title: string
  description: string
  email: string
  availableForWork?: boolean | null
  contactMethods?: ContactMethod[] | null
}

export interface StrapiCollectionResponse<T> {
  data: T[]
}

export interface StrapiSingleResponse<T> {
  data: T
}
