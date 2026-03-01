import type {
  About,
  Contact,
  ContactMethod,
  Education,
  Experience,
  Homepage,
  Project,
  ProjectLink,
  ProjectStatus,
  SocialLink,
  StrapiMedia,
  StrapiMeta,
  Technology,
  TechnologyCategory,
  TechnologyProficiency,
} from '../../shared/types/strapi'

export interface LocaleTechnology {
  name: string
  slug: string
  category: TechnologyCategory
  icon?: string
  color?: string
  proficiency?: TechnologyProficiency
  order?: number
}

export interface LocaleProject {
  title: string
  slug: string
  shortDescription: string
  thumbnailUrl?: string
  technologySlugs?: string[]
  links?: ProjectLink[]
  startDate: string
  endDate?: string | null
  projectStatus?: ProjectStatus
  order?: number
  fullDescription?: string
}

export interface LocaleExperience {
  company: string
  position: string
  location: string
  startDate: string
  endDate?: string | null
  isCurrent?: boolean
  description: string
  technologySlugs?: string[]
  logoUrl?: string
  order?: number
}

export interface LocaleEducation {
  institution: string
  degree: string
  field: string
  location: string
  startDate: string
  endDate: string
  description?: string
  logoUrl?: string
  order?: number
}

export interface LocaleAbout {
  title: string
  subtitle: string
  bio: string
  profilePictureUrl?: string
  resumeUrl?: string
  socialLinks?: SocialLink[]
  highlightedSkillSlugs?: string[]
}

export interface LocaleHomepage {
  appTitle: string
  heroTitle: string
  heroSubtitle: string
  heroDescription: string
  heroCtaText: string
  heroCtaLink: string
  featuredProjectSlugs?: string[]
}

export interface LocaleContact {
  title: string
  description: string
  email: string
  availableForWork?: boolean
  contactMethods?: ContactMethod[]
}

export interface LocaleContent {
  homepage: LocaleHomepage
  about: LocaleAbout
  contact: LocaleContact
  technologies: LocaleTechnology[]
  projects: LocaleProject[]
  experiences: LocaleExperience[]
  educations: LocaleEducation[]
}

const FALLBACK_TIMESTAMP = '1970-01-01T00:00:00.000Z'

const createMeta = (locale?: string): StrapiMeta => ({
  createdAt: FALLBACK_TIMESTAMP,
  updatedAt: FALLBACK_TIMESTAMP,
  publishedAt: null,
  locale,
})

const createMedia = (url: string | undefined, locale: string, id: number): StrapiMedia => ({
  id,
  name: '',
  alternativeText: null,
  caption: null,
  width: null,
  height: null,
  formats: null,
  hash: '',
  ext: '',
  mime: '',
  size: 0,
  url: url ?? '',
  previewUrl: null,
  provider: null,
  provider_metadata: null,
  ...createMeta(locale),
})

export interface FallbackData {
  homepage: Homepage
  about: About
  contact: Contact
  projects: Project[]
  experiences: Experience[]
  educations: Education[]
  technologies: Technology[]
}

export const buildFallbackData = (content: LocaleContent, locale: string): FallbackData => {
  const meta = createMeta(locale)

  const technologies: Technology[] = content.technologies.map((tech, index) => ({
    ...meta,
    id: index + 1,
    name: tech.name,
    slug: tech.slug,
    category: tech.category,
    icon: tech.icon ?? null,
    proficiency: tech.proficiency ?? null,
    color: tech.color ?? null,
    order: tech.order ?? null,
  }))

  const techBySlug = new Map<string, Technology>(technologies.map((tech) => [tech.slug, tech]))

  const resolveTech = (slugs?: string[] | null): Technology[] => {
    const resolved: Technology[] = []
    for (const slug of slugs ?? []) {
      const tech = techBySlug.get(slug)
      if (tech) {
        resolved.push(tech)
      }
    }
    return resolved
  }

  const projects: Project[] = content.projects.map((project, index) => ({
    ...meta,
    id: index + 1,
    title: project.title,
    slug: project.slug,
    shortDescription: project.shortDescription,
    fullDescription: project.fullDescription ?? project.shortDescription,
    thumbnail: createMedia(project.thumbnailUrl, locale, index + 1),
    gallery: null,
    technologies: resolveTech(project.technologySlugs),
    links: project.links && project.links.length > 0 ? project.links : null,
    startDate: project.startDate,
    endDate: project.endDate ?? null,
    projectStatus: project.projectStatus ?? null,
    order: project.order ?? null,
    seo: null,
  }))

  const projectBySlug = new Map<string, Project>(projects.map((project) => [project.slug, project]))
  const featuredProjects: Project[] = []
  for (const slug of content.homepage.featuredProjectSlugs ?? []) {
    const project = projectBySlug.get(slug)
    if (project) {
      featuredProjects.push(project)
    }
  }

  const homepage: Homepage = {
    ...meta,
    id: 1,
    appTitle: content.homepage.appTitle,
    heroTitle: content.homepage.heroTitle,
    heroSubtitle: content.homepage.heroSubtitle,
    heroDescription: content.homepage.heroDescription,
    heroCtaText: content.homepage.heroCtaText,
    heroCtaLink: content.homepage.heroCtaLink,
    featuredProjects: featuredProjects.length > 0 ? featuredProjects : null,
    seo: null,
  }

  const about: About = {
    ...meta,
    id: 1,
    title: content.about.title,
    subtitle: content.about.subtitle,
    bio: content.about.bio,
    profilePicture: createMedia(content.about.profilePictureUrl, locale, 1),
    resume: content.about.resumeUrl ? createMedia(content.about.resumeUrl, locale, 2) : null,
    socialLinks:
      content.about.socialLinks && content.about.socialLinks.length > 0
        ? content.about.socialLinks
        : null,
    highlightedSkills: resolveTech(content.about.highlightedSkillSlugs),
  }

  const experiences: Experience[] = content.experiences.map((experience, index) => ({
    ...meta,
    id: index + 1,
    company: experience.company,
    position: experience.position,
    location: experience.location,
    startDate: experience.startDate,
    endDate: experience.endDate ?? null,
    isCurrent: experience.isCurrent ?? null,
    description: experience.description,
    technologies: resolveTech(experience.technologySlugs),
    logo: experience.logoUrl ? createMedia(experience.logoUrl, locale, index + 1) : null,
    order: experience.order ?? null,
  }))

  const educations: Education[] = content.educations.map((education, index) => ({
    ...meta,
    id: index + 1,
    institution: education.institution,
    degree: education.degree,
    field: education.field,
    location: education.location,
    startDate: education.startDate,
    endDate: education.endDate,
    description: education.description ?? null,
    logo: education.logoUrl ? createMedia(education.logoUrl, locale, index + 1) : null,
    order: education.order ?? null,
  }))

  const contact: Contact = {
    ...meta,
    id: 1,
    title: content.contact.title,
    description: content.contact.description,
    email: content.contact.email,
    availableForWork: content.contact.availableForWork ?? null,
    contactMethods:
      content.contact.contactMethods && content.contact.contactMethods.length > 0
        ? content.contact.contactMethods
        : null,
  }

  return {
    homepage,
    about,
    contact,
    projects,
    experiences,
    educations,
    technologies,
  }
}
