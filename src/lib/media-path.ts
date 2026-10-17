export function mediaPath(filename: string) {
  return `/media/${filename}`;
}

export function mediaSrc(url: string) {
  const value = url.trim();
  if (!value || value.startsWith("/")) return value;
  try {
    const parsed = new URL(value);
    const local = parsed.hostname === "localhost" || parsed.hostname === "127.0.0.1";
    if (local) return `${parsed.pathname}${parsed.search}`;
  } catch {
    return value;
  }
  return value;
}
