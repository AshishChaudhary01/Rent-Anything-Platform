import { IoStar, IoStarOutline } from "react-icons/io5"

function StarRating({
  value,
  onChange,
}: {
  value: number
  onChange: (rating: number) => void
}) {
  return (
    <div className="flex items-center justify-center gap-2" role="radiogroup" aria-label="Rating">
      {[1, 2, 3, 4, 5].map((star) => {
        const filled = star <= value
        return (
          <button
            key={star}
            type="button"
            role="radio"
            aria-checked={filled && star === value}
            aria-label={`${star} star${star > 1 ? "s" : ""}`}
            className="p-1 cursor-pointer"
            onClick={() => onChange(star)}
          >
            {filled ? (
              <IoStar className="size-10 text-yellow-400" />
            ) : (
              <IoStarOutline className="size-10 text-muted" />
            )}
          </button>
        )
      })}
    </div>
  )
}

export default StarRating
