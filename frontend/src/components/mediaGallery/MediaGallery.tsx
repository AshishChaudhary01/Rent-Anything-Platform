import { useState } from "react";

export type MediaItem = {
  type: "image" | "video";
  url: string;
};

interface MediaGalleryProps {
  media: MediaItem[];
}

function MediaGallery({ media }: MediaGalleryProps) {
  const [active, setActive] = useState(0);

  const activeItem = media[active];

  const visibleThumbs = media.slice(0, 4);
  const extraCount = media.length - 4;

  return (
    <div className="flex flex-col md:flex-row gap-4 justify-center bg-surface rounded-2xl shadow-sm">

      {/* ACTIVE MEDIA */}
      <div className="flex-1 flex justify-center">
        <div className="w-md aspect-4/3 rounded-lg overflow-hidden bg-black">

          {activeItem.type === "image" ? (
            <img
              src={activeItem.url}
              className="w-full h-full object-cover"
            />
          ) : (
            <video
              src={activeItem.url}
              controls
              className="w-full h-full object-cover"
            />
          )}

        </div>
      </div>

      {/* THUMBNAILS */}
      <div className="flex md:flex-col items-center justify-center gap-0">

        {visibleThumbs.map((item, i) => {
          const isLastVisible = i === 3 && extraCount > 0;

          return (
            <button
              key={i}
              onClick={() => !isLastVisible && setActive(i)}
              className={`flex-1 relative w-20 h-20 rounded-md overflow-hidden border-4 ${active === i ? "border-blue-700 shadow-lg" : "border-gray-200"
                }`}
            >
              {item.type === "image" ? (
                <img
                  src={item.url}
                  className="w-full h-full object-cover"
                />
              ) : (
                <video
                  src={item.url}
                  className="w-full h-full object-cover"
                />
              )}

              {/* +N overlay */}
              {isLastVisible && (
                <div
                  onClick={() => setActive(i)}
                  className="absolute inset-0 bg-black/60 flex items-center justify-center text-white text-sm font-medium cursor-pointer"
                >
                  +{extraCount}
                </div>
              )}
            </button>
          );
        })}

      </div>
    </div>
  );
}

export default MediaGallery;