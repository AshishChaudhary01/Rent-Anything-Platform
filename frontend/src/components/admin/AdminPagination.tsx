import RaButton from "../button/RaButton"
import { ADMIN_PAGE_SIZE } from "./adminUi"

function AdminPagination({
  page,
  total,
  onPage,
}: {
  page: number
  total: number
  onPage: (page: number) => void
}) {
  const pages = Math.max(1, Math.ceil(total / ADMIN_PAGE_SIZE))
  const current = Math.min(page, pages)
  if (pages <= 1) return null

  return (
    <div className="flex items-center justify-center gap-2">
      <div className="w-28">
        <RaButton type="button" btnText="Previous" variant="outline" size="sm" disabled={current === 1} clickFunc={() => onPage(current - 1)} />
      </div>
      <span className="text-sm text-muted">{current} / {pages}</span>
      <div className="w-28">
        <RaButton type="button" btnText="Next" variant="outline" size="sm" disabled={current === pages} clickFunc={() => onPage(current + 1)} />
      </div>
    </div>
  )
}

export default AdminPagination
