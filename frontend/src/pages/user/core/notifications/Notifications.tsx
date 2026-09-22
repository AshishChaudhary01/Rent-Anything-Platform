import { useState } from "react"
import { IoCheckmarkOutline } from "react-icons/io5"
import RaContainer from "../../../../components/container/RaContainer"
import RaContainerPadding from "../../../../components/container/RaContainerPadding"
import RaBreadcrumb from "../../../../components/breadcrumb/RaBreadcrumb"
import RaCard from "../../../../components/card/RaCard"
import RaButton from "../../../../components/button/RaButton"
import NotificationItem from "../../../../components/notificationDropdown/NotificationItem"
import { NOTIFICATION_PAGE_SIZE, initialNotifications } from "../../../../data/notifications"
import { raToast } from "../../../../lib/raToast"

function Notifications() {
  const [items, setItems] = useState(initialNotifications)
  const [page, setPage] = useState(1)
  const pages = Math.max(1, Math.ceil(items.length / NOTIFICATION_PAGE_SIZE))
  const current = Math.min(page, pages)
  const slice = items.slice((current - 1) * NOTIFICATION_PAGE_SIZE, current * NOTIFICATION_PAGE_SIZE)

  return (
    <RaContainer>
      <RaContainerPadding>
        <div className="max-w-xl mx-auto flex flex-col gap-y-6 pb-24">
          <RaBreadcrumb items={[{ label: "Notifications" }]} />

          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="text-xl md:text-2xl font-bold">Notifications</div>
              <div className="text-sm md:text-base font-light text-muted">
                Updates about rentals, messages, and listings.
              </div>
            </div>
            <RaButton
              type="button"
              btnText="Mark all read"
              size="sm"
              variant="outline"
              widthFill={false}
              icon={<IoCheckmarkOutline />}
              iconPosition="left"
              clickFunc={() => {
                setItems((prev) => prev.map((n) => ({ ...n, read: true })))
                raToast.success("All notifications marked as read")
              }}
            />
          </div>

          {slice.map((item) => (
            <RaCard key={item.id} round="round" styleClass="p-0! overflow-hidden">
              <NotificationItem
                item={item}
                onMarkRead={(id) =>
                  setItems((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)))
                }
              />
            </RaCard>
          ))}

          {pages > 1 && (
            <div className="flex items-center justify-center gap-2">
              <div className="w-28">
                <RaButton type="button" btnText="Previous" variant="outline" size="sm" disabled={current === 1} clickFunc={() => setPage(current - 1)} />
              </div>
              <div className="text-sm font-medium">{current} / {pages}</div>
              <div className="w-28">
                <RaButton type="button" btnText="Next" variant="outline" size="sm" disabled={current === pages} clickFunc={() => setPage(current + 1)} />
              </div>
            </div>
          )}
        </div>
      </RaContainerPadding>
    </RaContainer>
  )
}

export default Notifications
