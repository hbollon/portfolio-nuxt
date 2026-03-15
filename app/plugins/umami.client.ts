export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig()
  const websiteId = config.public.umamiWebsiteId

  if (!websiteId || typeof window === 'undefined') {
    return
  }

  const script = document.createElement('script')
  script.defer = true
  script.src = (config.public.umamiScriptUrl as string) || 'https://cloud.umami.is/script.js'
  script.dataset.websiteId = websiteId as string
  document.head.appendChild(script)
})
