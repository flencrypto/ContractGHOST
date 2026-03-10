/**
 * Validates that a URL is safe to use in an href attribute.
 * Only allows http: and https: protocols to prevent javascript: injection.
 */
export function isSafeUrl(url: string | undefined | null): boolean {
  if (!url) return false;
  try {
    const parsed = new URL(url);
    return parsed.protocol === 'https:' || parsed.protocol === 'http:';
  } catch {
    return false;
  }
}
