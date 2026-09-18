import { Link } from "react-router-dom"
import { IoCalendarOutline, IoClose, IoTimeOutline } from "react-icons/io5"
import RaContainer from "../../../../components/container/RaContainer"
import RaContainerPadding from "../../../../components/container/RaContainerPadding"
import RaCard from "../../../../components/card/RaCard"
import RaButton from "../../../../components/button/RaButton"
import ChatLink from "../chat/ChatLink"
import { chatWithOwner } from "../chat/chatData"
import { backpack01, ladder01, pressureWasher01, tent01, tools01 } from "../../../../utils/images"

const detailsPath = "/user/rental-details"

const pending = [
  { id: 1, image: tools01, title: "Sony A7R IV Mirrorless", status: "Requested 2h ago" },
  { id: 2, image: backpack01, title: "Tissot Gentleman Auto", status: "Waiting for Owner" },
]

const active = [
  { id: 3, image: tent01, title: "PS5 Console + Controllers", returns: "Returns in 3 Days", amount: "NPR 4,500" },
  { id: 4, image: pressureWasher01, title: "Canon EOS R6 Kit", returns: "Returns in 12 Days", amount: "NPR 12,000" },
]

const past = [
  { id: 5, image: backpack01, title: "Air Jordan 1 Retro", date: "Oct 2023", duration: "2 Days", amount: "NPR 1,600" },
  { id: 6, image: tools01, title: "DeWalt Drill", date: "Sep 2023", duration: "1 Day", amount: "NPR 350" },
  { id: 7, image: ladder01, title: "Bose QC Headphones", date: "Aug 2023", duration: "3 Days", amount: "NPR 1,500" },
  { id: 8, image: tent01, title: "4-Person Tent", date: "July 2023", duration: "5 Days", amount: "NPR 3,000" },
]

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
            <div className="text-lg md:text-xl font-bold">Pending Requests</div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {pending.map((item) => (
                <RaCard key={item.id} round="round" styleClass="flex gap-4 p-4!">
                  <Link to={detailsPath}>
                    <img src={item.image} alt={item.title} className="size-28 md:size-32 rounded-xl object-cover" />
                  </Link>
                  <div className="flex-1 flex flex-col justify-between min-w-0 py-1">
                    <Link to={detailsPath}>
                      <div className="font-semibold text-base md:text-lg truncate">{item.title}</div>
                      <div className="text-sm text-muted">{item.status}</div>
                    </Link>
                    <div className="flex gap-2 mt-3">
                      <div className="flex-1">
                        <ChatLink
                          context={{ ...chatWithOwner, threadId: `pending-${item.id}`, listingTitle: item.title, listingImage: item.image }}
                          btnText="Chat"
                          size="sm"
                        />
                      </div>
                      <div className="flex-1">
                        <RaButton type="button" btnText="Cancel" size="sm" variant="outline" icon={<IoClose />} iconPosition="left" />
                      </div>
                    </div>
                  </div>
                </RaCard>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <div className="text-lg md:text-xl font-bold">Active Rentals</div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {active.map((item) => (
                <RaCard key={item.id} round="round" styleClass="flex gap-4 p-4!">
                  <Link to={detailsPath}>
                    <img src={item.image} alt={item.title} className="size-32 md:size-40 rounded-xl object-cover" />
                  </Link>
                  <div className="flex-1 flex flex-col justify-between min-w-0 py-1">
                    <Link to={detailsPath} className="space-y-1">
                      <div className="font-semibold text-base md:text-lg truncate">{item.title}</div>
                      <div className="flex items-center gap-x-1 text-sm text-muted">
                        <IoTimeOutline className="size-4 text-primary" />
                        {item.returns}
                      </div>
                      <div className="font-bold text-primary">{item.amount}</div>
                    </Link>
                    <div className="flex gap-2 mt-3">
                      <Link to="/user/rent/return-schedule" className="flex-1">
                        <RaButton type="button" btnText="Return Item" size="sm" />
                      </Link>
                      <div className="flex-1">
                        <ChatLink
                          context={{ ...chatWithOwner, threadId: `active-${item.id}`, listingTitle: item.title, listingImage: item.image }}
                          btnText="Open Chat"
                          size="sm"
                        />
                      </div>
                    </div>
                  </div>
                </RaCard>
              ))}
            </div>
          </div>

          <div>
            <div className="flex justify-between items-end">
              <div className="text-lg md:text-xl font-bold">Past Experiences</div>
              <Link to={detailsPath} className="text-sm text-primary">See All</Link>
            </div>
            <div className="flex gap-4 overflow-x-auto pb-2">
              {past.slice(0, 4).map((item) => (
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
              {past.length === 0 && (
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
