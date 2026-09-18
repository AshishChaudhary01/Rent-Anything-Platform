import { Link, useParams } from "react-router-dom"
import {
  IoCalendarOutline,
  IoCashOutline,
  IoChatbubbleOutline,
  IoCheckmarkCircleOutline,
  IoCheckmarkOutline,
  IoClose,
  IoDocumentTextOutline,
  IoLocationOutline,
  IoPersonOutline,
  IoStar,
  IoTimeOutline,
} from "react-icons/io5"
import RaContainer from "../../../../components/container/RaContainer"
import RaContainerPadding from "../../../../components/container/RaContainerPadding"
import RaBreadcrumb from "../../../../components/breadcrumb/RaBreadcrumb"
import RaCard from "../../../../components/card/RaCard"
import RaButton from "../../../../components/button/RaButton"
import RaBadge from "../../../../components/badge/RaBadge"
import Divider from "../../../../components/divider/Divider"
import ChatLink from "../chat/ChatLink"
import { chatWithRenter } from "../chat/chatData"
import { getListingRequest } from "../../../../data/listingRequests"
import { profile01 } from "../../../../utils/images"

function RequestDetails() {
  const { id = "" } = useParams()
  const req = getListingRequest(Number(id))

  if (!req) {
    return (
      <RaContainer>
        <RaContainerPadding>
          <div className="flex flex-col gap-y-4 pb-10">
            <RaBreadcrumb items={[
              { label: "My Listings", path: "/user/my-listings" },
              { label: "My Requests", path: "/user/listing-requests" },
              { label: "Request Details" },
            ]} />
            <div className="text-muted py-8 text-center">This request could not be found.</div>
          </div>
        </RaContainerPadding>
      </RaContainer>
    )
  }

  const chatContext = {
    ...chatWithRenter,
    threadId: `request-${req.id}`,
    peerName: req.name,
    listingTitle: req.listing,
    listingImage: req.listingImage,
  }

  return (
    <RaContainer>
      <RaContainerPadding>
        <div className="grid grid-cols-9 gap-6 pb-10">
          <div className="col-span-full lg:col-span-6 flex flex-col gap-y-4">
            <RaBreadcrumb items={[
              { label: "My Listings", path: "/user/my-listings" },
              { label: "My Requests", path: "/user/listing-requests" },
              { label: "Request Details" },
            ]} />

            <RaCard round="round" styleClass="p-0! overflow-hidden flex flex-col sm:flex-row">
              <div className="w-full sm:w-52 md:w-60 lg:w-64 shrink-0 overflow-hidden">
                <img src={req.listingImage} alt={req.listing} className="w-full aspect-square sm:aspect-4/5 object-cover" />
              </div>
              <div className="flex-1 min-w-0 p-4 md:p-5 flex flex-col gap-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="text-xl md:text-2xl font-bold leading-snug">{req.listing}</div>
                    <div className="flex items-center gap-1.5 text-sm text-muted mt-1">
                      <IoDocumentTextOutline className="size-4 text-primary shrink-0" />
                      Request ID: #RQ-{String(req.id).padStart(4, "0")}
                    </div>
                  </div>
                  <RaBadge
                    badgeText={req.status.toUpperCase()}
                    size="sm"
                    variant={req.status === "Accepted" ? "accent" : "primary"}
                    styleClass="shrink-0"
                  />
                </div>

                <div className="flex items-center justify-between text-center">
                  <div className="flex flex-col items-center gap-1">
                    <IoCalendarOutline className="size-4 text-primary" />
                    <div className="text-xs text-muted">PICK UP</div>
                    <div className="font-bold">{req.startDate}</div>
                  </div>
                  <div className="flex flex-col items-center gap-1">
                    <IoTimeOutline className="size-4 text-primary" />
                    <div className="text-xs font-bold text-primary">{req.duration.toUpperCase()}</div>
                  </div>
                  <div className="flex flex-col items-center gap-1">
                    <IoCalendarOutline className="size-4 text-primary" />
                    <div className="text-xs text-muted">RETURN</div>
                    <div className="font-bold">{req.endDate}</div>
                  </div>
                </div>

                <Divider />

                <div className="flex justify-between items-center text-muted">
                  <span className="flex items-center gap-1.5">
                    <IoTimeOutline className="size-4 text-primary shrink-0" />
                    Requested
                  </span>
                  <span className="font-semibold text-inherit">{req.time}</span>
                </div>
                <div className="flex justify-between items-center text-muted">
                  <span className="flex items-center gap-1.5">
                    <IoCashOutline className="size-4 text-primary shrink-0" />
                    Rate
                  </span>
                  <span className="font-semibold text-inherit">{req.rate} / day</span>
                </div>
                <div className="flex justify-between items-center text-lg font-bold">
                  <span className="flex items-center gap-1.5">
                    <IoCashOutline className="size-4 text-primary shrink-0" />
                    Total
                  </span>
                  <span className="text-primary">{req.amount}</span>
                </div>

                <Divider />

                <div>
                  <div className="flex items-center gap-1.5 text-sm text-muted mb-1">
                    <IoChatbubbleOutline className="size-4 text-primary shrink-0" />
                    Message from requester
                  </div>
                  <p className="font-light">{req.message}</p>
                </div>
              </div>
            </RaCard>
          </div>

          <aside className="col-span-full lg:col-span-3 flex flex-col gap-y-4">
            <RaCard round="round" styleClass="flex flex-col gap-4">
              <div className="font-bold text-lg">Requester</div>
              <div className="flex items-center gap-3">
                <img src={profile01} alt="" className="size-14 rounded-full object-cover shrink-0 aspect-square" />
                <div className="min-w-0">
                  <div className="font-semibold truncate">{req.name}</div>
                  <div className="flex items-center gap-1 text-sm text-muted">
                    <IoStar className="size-3.5 text-yellow-400" />
                    <span className="font-semibold text-text-dark">{req.rating.toFixed(1)}</span>
                    <span>({req.reviews} reviews)</span>
                  </div>
                </div>
              </div>
              <p className="text-sm font-light text-muted">{req.bio}</p>
              <div className="flex gap-x-2 text-sm">
                <IoLocationOutline className="size-4 text-primary shrink-0 mt-0.5" />
                <span>{req.location}</span>
              </div>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="flex items-start gap-1.5">
                  <IoPersonOutline className="size-4 text-primary shrink-0 mt-0.5" />
                  <div>
                    <div className="text-muted">Member since</div>
                    <div className="font-semibold">{req.memberSince}</div>
                  </div>
                </div>
                <div className="flex items-start gap-1.5">
                  <IoCheckmarkCircleOutline className="size-4 text-primary shrink-0 mt-0.5" />
                  <div>
                    <div className="text-muted">Completed</div>
                    <div className="font-semibold">{req.completedRentals} rentals</div>
                  </div>
                </div>
              </div>
              <ChatLink context={chatContext} btnText="Chat" size="sm" />
              {req.status === "Pending" && (
                <div className="flex gap-2">
                  <RaButton type="button" btnText="Accept" size="sm" icon={<IoCheckmarkOutline />} iconPosition="left" />
                  <RaButton type="button" btnText="Reject" size="sm" variant="danger" icon={<IoClose />} iconPosition="left" />
                </div>
              )}
              {req.status === "Accepted" && (
                <Link to="/user/rental-details">
                  <RaButton
                    type="button"
                    btnText="Manage Booking"
                    size="sm"
                    variant="outline"
                    icon={<IoCalendarOutline />}
                    iconPosition="left"
                  />
                </Link>
              )}
            </RaCard>
          </aside>
        </div>
      </RaContainerPadding>
    </RaContainer>
  )
}

export default RequestDetails
