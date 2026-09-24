import { useMemo, useState } from "react"
import { IoChevronBackOutline, IoChevronForwardOutline } from "react-icons/io5"
import RaCard from "../card/RaCard"

export type ListingBusyWindow = {
  startDate: string
  endDate: string
  status?: string
}

const WEEKDAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"]

function ymd(year: number, month: number, day: number) {
  return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`
}

function inWindow(iso: string, window: ListingBusyWindow) {
  return iso >= window.startDate && iso <= window.endDate
}

function ListingActivityCalendar({
  windows = [],
  title = "Availability",
  compact = false,
}: {
  windows?: ListingBusyWindow[]
  title?: string
  compact?: boolean
}) {
  const now = new Date()
  const [cursor, setCursor] = useState({ year: now.getFullYear(), month: now.getMonth() })
  const today = ymd(now.getFullYear(), now.getMonth(), now.getDate())

  const cells = useMemo(() => {
    const first = new Date(cursor.year, cursor.month, 1)
    const startPad = first.getDay()
    const daysInMonth = new Date(cursor.year, cursor.month + 1, 0).getDate()
    const items: { key: string; day?: number; iso?: string; busy?: ListingBusyWindow }[] = []
    for (let i = 0; i < startPad; i += 1) items.push({ key: `pad-${i}` })
    for (let day = 1; day <= daysInMonth; day += 1) {
      const iso = ymd(cursor.year, cursor.month, day)
      const busy = windows.find((window) => inWindow(iso, window))
      items.push({ key: iso, day, iso, busy })
    }
    return items
  }, [cursor, windows])

  const label = new Date(cursor.year, cursor.month, 1).toLocaleString("en-NP", { month: "long", year: "numeric" })

  return (
    <RaCard round="round" bg="info" styleClass={`flex flex-col ${compact ? "gap-2 p-3! md:p-3!" : "gap-3"}`}>
      <div className={`flex ${compact ? "flex-col gap-2" : "items-center justify-between gap-2"}`}>
        <div className={`font-semibold ${compact ? "text-sm" : ""}`}>{title}</div>
        <div className="flex items-center gap-1 self-end">
          <button
            type="button"
            className={`${compact ? "size-7" : "size-8"} rounded-full bg-white flex items-center justify-center cursor-pointer`}
            onClick={() => setCursor((c) => (c.month === 0 ? { year: c.year - 1, month: 11 } : { year: c.year, month: c.month - 1 }))}
            aria-label="Previous month"
          >
            <IoChevronBackOutline />
          </button>
          <div className={`font-semibold text-center ${compact ? "text-xs min-w-24" : "text-sm min-w-32"}`}>{label}</div>
          <button
            type="button"
            className={`${compact ? "size-7" : "size-8"} rounded-full bg-white flex items-center justify-center cursor-pointer`}
            onClick={() => setCursor((c) => (c.month === 11 ? { year: c.year + 1, month: 0 } : { year: c.year, month: c.month + 1 }))}
            aria-label="Next month"
          >
            <IoChevronForwardOutline />
          </button>
        </div>
      </div>
      <div className={`grid grid-cols-7 gap-0.5 text-center text-muted font-semibold ${compact ? "text-[10px]" : "text-xs"}`}>
        {WEEKDAYS.map((day) => <div key={day}>{day}</div>)}
      </div>
      <div className={`grid grid-cols-7 ${compact ? "gap-0.5" : "gap-1"}`}>
        {cells.map((cell) => {
          if (!cell.day) return <div key={cell.key} />
          const isToday = cell.iso === today
          const booked = Boolean(cell.busy)
          const active = cell.busy?.status === "ACTIVE"
          return (
            <div
              key={cell.key}
              title={booked ? `${cell.busy?.status === "ACTIVE" ? "Rented" : "Booked"}` : "Open"}
              className={`${compact ? "h-7 text-[11px] rounded-md" : "aspect-square text-sm rounded-lg"} flex items-center justify-center ${
                booked
                  ? active
                    ? "bg-warning text-white font-semibold"
                    : "bg-accent-secondary text-muted-secondary font-semibold"
                  : "bg-white text-muted"
              } ${isToday ? "ring-2 ring-primary" : ""}`}
            >
              {cell.day}
            </div>
          )
        })}
      </div>
      <div className={`flex flex-wrap text-muted ${compact ? "gap-2 text-[10px]" : "gap-3 text-xs"}`}>
        <span className="flex items-center gap-1"><span className="size-2.5 rounded bg-white border" /> Open</span>
        <span className="flex items-center gap-1"><span className="size-2.5 rounded bg-accent-secondary" /> Upcoming</span>
        <span className="flex items-center gap-1"><span className="size-2.5 rounded bg-warning" /> Rented</span>
      </div>
    </RaCard>
  )
}

export default ListingActivityCalendar
