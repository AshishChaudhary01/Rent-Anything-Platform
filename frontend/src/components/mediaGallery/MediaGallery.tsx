import { useState } from "react"
import { IoChevronBack, IoChevronForward, IoPlay } from "react-icons/io5"

export type MediaItem = {
  type: "image" | "video"
  url: string
}

function MediaGallery({ media, compact = false }: { media: MediaItem[]; compact?: boolean }) {
  const [active, setActive] = useState(0)
  const total = media.length
  const activeItem = media[active] ?? media[0]
  if (!activeItem) return null

  const go = (next: number) => {
    if (total === 0) return
    setActive((next + total) % total)
  }

  return (
    <div className="flex flex-col gap-3">
      <div className={`relative w-full overflow-hidden rounded-2xl bg-gray-100 ${compact ? "h-72" : "h-[min(70vh,36rem)] min-h-80"}`}>
        {activeItem.type === "video" ? (
          <video src={activeItem.url} controls className="size-full object-contain" />
        ) : (
          <img src={activeItem.url} alt="" className="size-full object-contain" />
        )}
        {total > 1 && (
          <>
            <button
              type="button"
              aria-label="Previous media"
              onClick={() => go(active - 1)}
              className="absolute left-3 top-1/2 -translate-y-1/2 size-10 rounded-full bg-black/45 text-white flex items-center justify-center cursor-pointer hover:bg-black/60"
            >
              <IoChevronBack className="size-5" />
            </button>
            <button
              type="button"
              aria-label="Next media"
              onClick={() => go(active + 1)}
              className="absolute right-3 top-1/2 -translate-y-1/2 size-10 rounded-full bg-black/45 text-white flex items-center justify-center cursor-pointer hover:bg-black/60"
            >
              <IoChevronForward className="size-5" />
            </button>
            <span className="absolute bottom-3 right-3 text-xs font-medium text-white bg-black/50 rounded-full px-2.5 py-1">
              {active + 1} / {total}
            </span>
          </>
        )}
      </div>
      {total > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {media.map((item, i) => (
            <button
              key={`${item.url}-${i}`}
              type="button"
              onClick={() => setActive(i)}
              className={`relative shrink-0 overflow-hidden rounded-xl border-2 cursor-pointer ${
                compact ? "size-16" : "size-20 md:size-24"
              } ${active === i ? "border-primary" : "border-transparent opacity-80 hover:opacity-100"}`}
              aria-label={`Media ${i + 1}`}
            >
              {item.type === "video" ? (
                <video src={item.url} className="size-full object-cover" muted />
              ) : (
                <img src={item.url} alt="" className="size-full object-cover" />
              )}
              {item.type === "video" && (
                <span className="absolute inset-0 flex items-center justify-center bg-black/35">
                  <IoPlay className="size-4 text-white" />
                </span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default MediaGallery
