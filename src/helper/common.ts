/** string to array */
export const normalizeToArray = (val: string | string[] | undefined | null): string[] => {
  if (!val) return []
  if (Array.isArray(val)) return val
  return val
    .split(',')
    .map((v) => v.trim())
    .filter(Boolean)
}
