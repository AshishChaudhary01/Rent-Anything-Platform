import { IoStar, IoStarOutline } from "react-icons/io5"

function StarRating({
  value,
  onChange,
  readOnly = false,
  size = "lg",
  showValue = false,
}: {
  value: number
  onChange?: (rating: number) => void
  readOnly?: boolean
  size?: "sm" | "lg"
  showValue?: boolean
}) {
  const iconClass = size === "sm" ? "size-4" : "size-10"
  return (
    <div className="flex items-center gap-1.5" role={readOnly ? undefined : "radiogroup"} aria-label="Rating">
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => {
          const filled = star <= Math.round(value)
          const icon = filled
            ? <IoStar className={`${iconClass} text-yellow-400`} />
            : <IoStarOutline className={`${iconClass} text-muted`} />
          if (readOnly) {
            return <span key={star}>{icon}</span>
          }
          return (
            <button
              key={star}
              type="button"
              role="radio"
              aria-checked={filled && star === value}
              aria-label={`${star} star${star > 1 ? "s" : ""}`}
              className="p-1 cursor-pointer"
              onClick={() => onChange?.(star)}
            >
              {icon}
            </button>
          )
        })}
      </div>
      {showValue && (
        <span className={size === "sm" ? "text-sm font-bold" : "text-lg font-bold"}>
          {value ? value.toFixed(1).replace(/\.0$/, "") : "—"}
        </span>
      )}
    </div>
  )
}

export default StarRating
