export const ADMIN_PAGE_SIZE = 10

export const ADMIN_AS_OF = "2026-09-22"

export const DASHBOARD_RANGES = [
  { id: "1d", label: "1 day", days: 1 },
  { id: "7d", label: "7 days", days: 7 },
  { id: "30d", label: "30 days", days: 30 },
  { id: "3m", label: "3 months", days: 90 },
  { id: "6m", label: "6 months", days: 180 },
  { id: "all", label: "All time", days: null },
] as const

export type DashboardRangeId = (typeof DASHBOARD_RANGES)[number]["id"]

export function inDashboardRange(isoDate: string, days: number | null, asOf = ADMIN_AS_OF) {
  if (days == null) return true
  const end = new Date(`${asOf}T23:59:59`)
  const start = new Date(end)
  start.setDate(start.getDate() - (days - 1))
  start.setHours(0, 0, 0, 0)
  const t = new Date(isoDate).getTime()
  return Number.isFinite(t) && t >= start.getTime() && t <= end.getTime()
}

export const selectClass = "bg-surface border border-gray-300 rounded-full px-4 py-2 text-sm outline-none"

export function statusClass(status: string) {
  if (status === "Active" || status === "Resolved" || status === "Completed" || status === "Verified") return "text-primary bg-primary/10"
  if (status === "Pending" || status === "Suspended" || status === "Disabled" || status === "Under review") return "text-amber-700 bg-amber-50"
  if (status === "Banned" || status === "Removed" || status === "Failed" || status === "Cancelled" || status === "Rejected") return "text-danger bg-danger/10"
  return "text-muted bg-surface"
}

export function paginate<T>(items: T[], page: number) {
  const pages = Math.max(1, Math.ceil(items.length / ADMIN_PAGE_SIZE))
  const current = Math.min(Math.max(1, page), pages)
  return {
    current,
    pages,
    slice: items.slice((current - 1) * ADMIN_PAGE_SIZE, current * ADMIN_PAGE_SIZE),
  }
}

export function matchesSearch(query: string, ...fields: Array<string | number | null | undefined>) {
  const q = query.trim().toLowerCase()
  if (!q) return true
  return fields.some((field) => String(field ?? "").toLowerCase().includes(q))
}

export function nepalDateTime(date = new Date()) {
  return `${date.toLocaleString("en-GB", {
    timeZone: "Asia/Kathmandu",
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  })} NPT`
}

export function csvFileStamp(date = new Date()) {
  const parts = Object.fromEntries(
    new Intl.DateTimeFormat("en-CA", {
      timeZone: "Asia/Kathmandu",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
      hourCycle: "h23",
    })
      .formatToParts(date)
      .filter((part) => part.type !== "literal")
      .map((part) => [part.type, part.value]),
  )
  return `${parts.year}${parts.month}${parts.day}-${(parts.hour || "00").replace(":", "")}${(parts.minute || "00").replace(":", "")}`
}

export function formatCsvInstant(iso: string | null | undefined) {
  if (!iso) return ""
  const parsed = new Date(iso.length <= 10 ? `${iso}T00:00:00+05:45` : iso)
  if (Number.isNaN(parsed.getTime())) return iso
  return nepalDateTime(parsed)
}

export const formatNptDateTime = formatCsvInstant

export function staffRoleLabel(role: string | null | undefined) {
  const key = (role || "").trim().toUpperCase().replace(/[\s-]+/g, "_")
  if (key === "SUPER_ADMIN") return "Super admin"
  if (key === "ADMIN") return "Admin"
  return ""
}

export type CsvExportOptions = {
  title: string
  period?: string
  extra?: string[]
}

export function downloadCsv(
  filename: string,
  rows: Record<string, string | number>[],
  options?: CsvExportOptions,
) {
  const escape = (value: string | number) => `"${String(value).replaceAll("\"", "\"\"")}"`
  const meta = [
    `# ${options?.title ?? "RAP export"}`,
    `# Generated at,${escape(nepalDateTime())}`,
    "# Timezone,Asia/Kathmandu (NPT)",
  ]
  if (options?.period) meta.push(`# Report period,${escape(options.period)}`)
  meta.push(`# Record count,${rows.length}`)
  for (const line of options?.extra ?? []) {
    meta.push(`# ${line}`)
  }
  meta.push("")
  const table = rows.length === 0
    ? ["note", escape("No records in this period")].join("\n")
    : [
        Object.keys(rows[0]).join(","),
        ...rows.map((row) => Object.keys(rows[0]).map((key) => escape(row[key] ?? "")).join(",")),
      ].join("\n")
  const blob = new Blob(["\uFEFF", meta.join("\n"), "\n", table], { type: "text/csv;charset=utf-8;" })
  const url = URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.href = url
  link.download = filename
  link.click()
  URL.revokeObjectURL(url)
}
