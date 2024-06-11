export const isImage = (typeFile?: string) => {
  if (!typeFile) return

  const imageTypes = [
    'jpeg',
    'jpg',
    'png',
    'gif',
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/webp'
  ]
  return imageTypes.includes(typeFile)
}
