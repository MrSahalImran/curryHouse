const CLOUDINARY_HOST_REGEX = /res\.cloudinary\.com/i;

export function normalizeImageUrl(url, fallback = "https://via.placeholder.com/300x200?text=No+Image") {
  if (!url || typeof url !== "string") return fallback;

  const trimmed = url.trim();
  if (!trimmed) return fallback;

  if (!CLOUDINARY_HOST_REGEX.test(trimmed)) return trimmed;

  const isWebp = /\.webp(?:$|[?#])/i.test(trimmed);
  const hasAutoFormat = /\/f_auto\//i.test(trimmed);

  if (!isWebp && !hasAutoFormat) return trimmed;

  if (hasAutoFormat) {
    return trimmed.replace(/\/f_auto\//i, "/f_jpg,q_auto/");
  }

  return trimmed.replace(/\.webp(?=$|[?#])/i, ".jpg");
}
