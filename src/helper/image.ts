export const isImageValid = (url?: string): boolean => {
  if (!url) return false

  // Allow data:image/... or valid http/https URLs
  return (
    /^data:image\/[a-zA-Z]+;base64,/.test(url) ||
    (() => {
      try {
        const parsed = new URL(url)
        return ['http:', 'https:'].includes(parsed.protocol)
      } catch {
        return false
      }
    })()
  )
}
