import { useEffect, useMemo, useRef, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { IoArrowForward, IoSearchOutline } from "react-icons/io5"
import { searchCatalog } from "../../data/catalog"

interface RaSearchBarProps {
  placeholderText?: string
  value?: string
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
  onSubmit?: (query: string) => void
  styleClass?: string
  suggestions?: boolean
}

const RaSearchBar = ({
  placeholderText = "Search...",
  value,
  onChange,
  onSubmit,
  styleClass = "",
  suggestions = true,
}: RaSearchBarProps) => {
  const navigate = useNavigate()
  const wrapRef = useRef<HTMLDivElement>(null)
  const [inner, setInner] = useState(value ?? "")
  const [open, setOpen] = useState(false)
  const query = value ?? inner

  useEffect(() => {
    if (value !== undefined) setInner(value)
  }, [value])

  useEffect(() => {
    const close = (e: MouseEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener("mousedown", close)
    return () => document.removeEventListener("mousedown", close)
  }, [])

  const matches = useMemo(() => searchCatalog(query), [query])
  const preview = matches.slice(0, 6)
  const showList = suggestions && open && query.trim().length > 0

  const goSearch = () => {
    const q = query.trim()
    if (!q) return
    setOpen(false)
    onSubmit?.(q)
    navigate(`/user/search?q=${encodeURIComponent(q)}`)
  }

  return (
    <div ref={wrapRef} className={`relative ${styleClass}`}>
      <div className="flex items-center gap-2 bg-surface border border-gray-300 rounded-full px-4 py-2 focus-within:border-muted transition">
        <IoSearchOutline className="size-5 text-muted" />
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setInner(e.target.value)
            onChange?.(e)
            setOpen(true)
          }}
          onFocus={() => setOpen(true)}
          placeholder={placeholderText}
          className="w-full bg-transparent outline-none text-sm text-text-dark placeholder:text-muted"
          onKeyDown={(e) => {
            if (e.key === "Enter") goSearch()
          }}
        />
      </div>

      {showList && (
        <div className="absolute z-40 mt-2 w-full bg-white border border-gray-200 rounded-2xl shadow-lg overflow-hidden">
          {preview.length === 0 ? (
            <div className="px-4 py-3 text-sm text-muted">No matches</div>
          ) : (
            <>
              {preview.map((item) => (
                <Link
                  key={item.id}
                  to="/user/listing"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 px-4 py-2 hover:bg-surface"
                >
                  <img src={item.image} alt="" className="size-10 rounded-lg object-cover" />
                  <div className="min-w-0 flex-1">
                    <div className="font-semibold text-sm truncate">{item.title}</div>
                    <div className="text-xs text-muted truncate">{item.location}</div>
                  </div>
                  <div className="text-sm font-bold text-primary shrink-0">Nrs. {item.rate}</div>
                </Link>
              ))}
              {matches.length >= 6 && (
                <button
                  type="button"
                  onClick={goSearch}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 text-sm font-semibold text-primary border-t border-gray-100 cursor-pointer hover:bg-surface"
                >
                  View all {matches.length} results <IoArrowForward />
                </button>
              )}
            </>
          )}
        </div>
      )}
    </div>
  )
}

export default RaSearchBar
