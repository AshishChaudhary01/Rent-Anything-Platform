import MediaGallery, { type MediaItem } from "../mediaGallery/MediaGallery"

function isVideoUrl(url: string) {
  return /\/video\//i.test(url) || /\.(mp4|webm|mov)(\?|$)/i.test(url)
}

function ProofGallery({ urls }: { urls: string[] }) {
  if (urls.length === 0) {
    return <div className="text-sm text-muted">No proof was attached.</div>
  }
  const media: MediaItem[] = urls.map((url) => ({
    type: isVideoUrl(url) ? "video" : "image",
    url,
  }))
  return <MediaGallery media={media} compact />
}

export default ProofGallery
