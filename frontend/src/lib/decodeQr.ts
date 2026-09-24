import jsQR from "jsqr"

export async function decodeQrFromFile(file: File): Promise<string | null> {
  const bitmap = await createImageBitmap(file)
  const canvas = document.createElement("canvas")
  canvas.width = bitmap.width
  canvas.height = bitmap.height
  const ctx = canvas.getContext("2d")
  if (!ctx) return null
  ctx.drawImage(bitmap, 0, 0)
  return decodeQrFromCanvas(canvas)
}

export function decodeQrFromCanvas(canvas: HTMLCanvasElement): string | null {
  const ctx = canvas.getContext("2d")
  if (!ctx) return null
  const image = ctx.getImageData(0, 0, canvas.width, canvas.height)
  const result = jsQR(image.data, image.width, image.height)
  return result?.data?.trim() || null
}

export function decodeQrFromVideo(video: HTMLVideoElement): string | null {
  if (!video.videoWidth || !video.videoHeight) return null
  const canvas = document.createElement("canvas")
  canvas.width = video.videoWidth
  canvas.height = video.videoHeight
  const ctx = canvas.getContext("2d")
  if (!ctx) return null
  ctx.drawImage(video, 0, 0)
  return decodeQrFromCanvas(canvas)
}
