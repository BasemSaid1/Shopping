export function getImageUrl(url?: string | null) {
  if (!url) return null;

  const index = url.indexOf("/uploads/");
  return index === -1 ? url : url.slice(index);
}
