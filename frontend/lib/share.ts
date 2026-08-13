export function getShareLinks(url: string, title: string) {
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  return {
    whatsapp: `https://api.whatsapp.com/send/?text=${encodedTitle}%20${encodedUrl}`,

    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,

    telegram: `https://t.me/share/url?url=${encodedUrl}&text=${encodedTitle}`,

    mail: `mailto:?subject=${encodedTitle}&body=${encodedUrl}`,
  };
}
