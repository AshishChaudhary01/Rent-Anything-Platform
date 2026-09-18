import { Link } from "react-router-dom"
import { IoCalendarOutline, IoTimeOutline } from "react-icons/io5"
import RaContainer from "../../../../components/container/RaContainer"
import RaContainerPadding from "../../../../components/container/RaContainerPadding"
import RaCard from "../../../../components/card/RaCard"
import PendingRentalCard from "./PendingRentalCard"
import ActiveRentalCard from "./ActiveRentalCard"
import { activeRentals, pendingRentals } from "../../../../data/myRentals"
import { pastRentals } from "../../../../data/pastRentals"

const detailsPath = "/user/rental-details"
const historyPath = "/user/rental-history"
const pendingPath = "/user/pending-requests"
const activePath = "/user/active-rentals"
const previewGrid = "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"

function MyRentals() {
  return (
    <RaContainer>
      <RaContainerPadding>
        <div className="flex flex-col gap-y-8">
          <div>
            <div className="text-xl md:text-2xl font-bold">My Rentals</div>
            <div className="text-sm md:text-base font-light text-muted">Manage your active requests and rental history</div>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-end">
              <div className="text-lg md:text-xl font-bold">Active Rentals</div>
              <Link to={activePath} className="text-sm text-primary">See All</Link>
            </div>
            <div className={previewGrid}>
              {activeRentals.slice(0, 3).map((item) => (
                <ActiveRentalCard key={item.id} item={item} />
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-end">
              <div className="text-lg md:text-xl font-bold">Pending Requests</div>
              <Link to={pendingPath} className="text-sm text-primary">See All</Link>
            </div>
            <div className={previewGrid}>
              {pendingRentals.slice(0, 3).map((item) => (
                <PendingRentalCard key={item.id} item={item} />
              ))}
            </div>
          </div>

          <div>
            <div className="flex justify-between items-end">
              <div className="text-lg md:text-xl font-bold">Past Experiences</div>
              <Link to={historyPath} className="text-sm text-primary">See All</Link>
            </div>
            <div className="flex gap-4 overflow-x-auto pb-2">
              {pastRentals.slice(0, 4).map((item) => (
                <RaCard key={item.id} round="round" styleClass="flex flex-col w-64 min-w-[16rem] p-4!">
                  <Link to={detailsPath} className="flex gap-3 items-center">
                    <img src={item.image} alt={item.title} className="w-16 h-16 rounded-lg object-cover shrink-0" />
                    <div className="flex flex-col flex-1 min-w-0">
                      <div className="font-semibold text-base truncate">{item.title}</div>
                      <div className="flex items-center gap-x-2 text-xs text-muted mt-0.5">
                        <IoCalendarOutline className="size-3.5 text-primary" />
                        <span>{item.date}</span>
                        <IoTimeOutline className="size-3.5 text-primary ml-2" />
                        <span>{item.duration}</span>
                      </div>
                    </div>
                  </Link>
                  <div className="flex items-end justify-between mt-4">
                    <div className="font-bold text-primary text-sm">{item.amount}</div>
                    <Link to={detailsPath} className="text-xs font-bold text-primary whitespace-nowrap">
                      MORE DETAILS
                    </Link>
                  </div>
                </RaCard>
              ))}
              {pastRentals.length === 0 && (
                <div className="flex items-center justify-center w-full text-muted py-8">
                  No past rentals yet.
                </div>
              )}
            </div>
          </div>
        </div>
      </RaContainerPadding>
    </RaContainer>
  )
}

export default MyRentals
