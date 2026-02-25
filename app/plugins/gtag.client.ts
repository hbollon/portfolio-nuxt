export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig()
  const trackingId = config.public.googleAnalyticsId

  if (!trackingId) {
    return
  }

  if (typeof window === 'undefined') {
    return
  }

  // Load GA only when a tracking ID is provided.
  const script = document.createElement('script')
  script.async = true
  script.src = `https://www.googletagmanager.com/gtag/js?id=${trackingId}`
  document.head.appendChild(script)

  window.dataLayer = window.dataLayer ?? []
  const gtag = (...args: unknown[]) => {
    window.dataLayer?.push(args)
  }

  gtag('js', new Date())
  gtag('config', trackingId, { anonymize_ip: true })
})

declare global {
  interface Window {
    dataLayer?: unknown[]
  }
}
