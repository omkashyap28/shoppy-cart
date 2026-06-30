export function getShareLinks(url: string, title: string) {
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  return {
    whatsapp: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`,

    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,

    telegram: `https://t.me/share/url?url=${encodedUrl}&text=${encodedTitle}`,

    mail: `mailto:?subject=${encodedTitle}&body=${encodedUrl}`,
  };
}

export async function nativeShare({
  title,
  text,
  url,
}: {
  title: string;
  text?: string;
  url: string;
}) {
  if (!navigator.share) return false;

  try {
    await navigator.share({
      title,
      text,
      url,
    });

    return true;
  } catch {
    return false;
  }
}
