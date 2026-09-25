import { IoCheckmarkOutline, IoNotificationsOutline } from "react-icons/io5"
import RaCard from "../../../components/card/RaCard"
import RaButton from "../../../components/button/RaButton"
import AdminPageHeader from "../../../components/admin/AdminPageHeader"
import NotificationItem from "../../../components/notificationDropdown/NotificationItem"
import { useMarkAllNotificationsRead, useMarkNotificationRead, useNotifications } from "../../../hooks/queries/useNotifications"
import { raToast } from "../../../lib/raToast"
import { useState } from "react"
import RaPageLoader from "../../../components/feedback/RaPageLoader"

function AdminNotifications() {
  const [page, setPage] = useState(0)
  const { data, isPending } = useNotifications(page, 8)
  const markRead = useMarkNotificationRead()
  const markAll = useMarkAllNotificationsRead()
  const items = data?.items ?? []
  const total = data?.total ?? 0
  const pages = Math.max(1, Math.ceil(total / 8))

  return (
    <div className="max-w-xl flex flex-col gap-6">
      <AdminPageHeader
        icon={IoNotificationsOutline}
        title="Notifications"
        subtitle="Reports, KYC, and staff updates."
        actions={
          <RaButton
            type="button"
            btnText="Mark all read"
            size="sm"
            variant="outline"
            widthFill={false}
            icon={<IoCheckmarkOutline />}
            iconPosition="left"
            clickFunc={() => {
              markAll.mutate(undefined, {
                onSuccess: () => raToast.success("All notifications marked as read"),
              })
            }}
          />
        }
      />
      {isPending ? (
        <RaPageLoader label="Loading notifications…" />
      ) : items.length === 0 ? (
        <p className="text-muted">No notifications yet.</p>
      ) : (
        items.map((item) => (
          <RaCard key={item.id} round="round" styleClass="p-0! overflow-hidden">
            <NotificationItem item={item} onMarkRead={(id) => markRead.mutate(id)} />
          </RaCard>
        ))
      )}
      {pages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <div className="w-28">
            <RaButton type="button" btnText="Previous" variant="outline" size="sm" disabled={page === 0} clickFunc={() => setPage(page - 1)} />
          </div>
          <div className="text-sm font-medium">{page + 1} / {pages}</div>
          <div className="w-28">
            <RaButton type="button" btnText="Next" variant="outline" size="sm" disabled={page + 1 >= pages} clickFunc={() => setPage(page + 1)} />
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminNotifications
