export async function deleteImage(fileId: string) {
  const authHeader = Buffer.from(
    `${process.env.NEXT_PUBLIC_IMAGEKIT_PRIVATE_KEY}:`
  ).toString("base64");

  await fetch(`https://api.imagekit.io/v1/files/${fileId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Basic ${authHeader}`,
    },
  });
}