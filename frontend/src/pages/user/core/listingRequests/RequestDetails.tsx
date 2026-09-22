import { Link, useParams } from "react-router-dom"
import { useMediaQuery } from "react-responsive"
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
import RaBottomSheet from "../../../../components/bottomSheet/RaBottomSheet"
import ChatLink from "../chat/ChatLink"
import { chatWithRenter } from "../chat/chatData"
import { getListingRequest, type ListingRequest } from "../../../../data/listingRequests"
import { profile01 } from "../../../../utils/images"
import type { ChatContext } from "../chat/chatTypes"
import { raToast } from "../../../../lib/raToast"

function RequesterActions({
  req,
  chatContext,
  compact = false,
}: {
  req: ListingRequest
  chatContext: ChatContext
  compact?: boolean
}) {
  const chat = (
    <ChatLink
      context={chatContext}
      btnText="Chat"
      size="md"
      widthFill
    />
  )

  if (compact) {
    const compactBtn = "min-h-10 px-3! py-2! text-sm"
    return (
      <div className="flex items-center gap-2 shrink-0">
        <ChatLink
          context={chatContext}
          btnText="Chat"
          size="sm"
          widthFill={false}
          icon={<IoChatbubbleOutline className="size-5" />}
          styleClass={compactBtn}
        />
        {req.status === "Pending" && (
          <>
            <RaButton
              type="button"
              btnText="Accept"
              size="sm"
              widthFill={false}
              icon={<IoCheckmarkOutline className="size-5" />}
              iconPosition="left"
              styleClass={compactBtn}
              clickFunc={() => raToast.success(`Accepted request from ${req.name}`)}
            />
            <RaButton
              type="button"
              btnText="Reject"
              size="sm"
              variant="danger"
              widthFill={false}
              icon={<IoClose className="size-5" />}
              iconPosition="left"
              styleClass={compactBtn}
              clickFunc={() => raToast.warning(`Rejected request from ${req.name}`)}
            />
          </>
        )}
        {req.status === "Accepted" && (
          <Link to="/user/rental-details">
            <RaButton
              type="button"
              btnText="Manage"
              size="sm"
              variant="outline"
              widthFill={false}
              icon={<IoCalendarOutline className="size-5" />}
              iconPosition="left"
              styleClass={compactBtn}
            />
          </Link>
        )}
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-2">
      {chat}
      {req.status === "Pending" && (
        <div className="flex gap-2">
          <RaButton type="button" btnText="Accept" size="md" icon={<IoCheckmarkOutline className="size-5" />} iconPosition="left" clickFunc={() => raToast.success(`Accepted request from ${req.name}`)} />
          <RaButton type="button" btnText="Reject" size="md" variant="danger" icon={<IoClose className="size-5" />} iconPosition="left" clickFunc={() => raToast.warning(`Rejected request from ${req.name}`)} />
        </div>
      )}
      {req.status === "Accepted" && (
        <Link to="/user/rental-details">
          <RaButton type="button" btnText="Manage Booking" size="md" variant="outline" icon={<IoCalendarOutline className="size-5" />} iconPosition="left" />
        </Link>
      )}
    </div>
  )
}

function RequesterPanel({
  req,
  chatContext,
  variant = "sidebar",
}: {
  req: ListingRequest
  chatContext: ChatContext
  variant?: "sidebar" | "sheet"
}) {
  const isSheet = variant === "sheet"

  return (
    <div className={`flex flex-col ${isSheet ? "gap-3" : "gap-3"}`}>
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <img src={profile01} alt="" className="size-9 rounded-full object-cover shrink-0 aspect-square" />
          <div className="min-w-0">
            {!isSheet && <div className="text-xs text-muted">Requester</div>}
            <div className="font-semibold truncate text-sm leading-tight">{req.name}</div>
            <div className="flex items-center gap-1 text-xs text-muted">
              <IoStar className="size-3 text-yellow-400" />
              <span className="font-semibold text-text-dark">{req.rating.toFixed(1)}</span>
              <span>({req.reviews})</span>
            </div>
          </div>
        </div>
        {isSheet && <RequesterActions req={req} chatContext={chatContext} compact />}
      </div>

      {!isSheet && <RequesterActions req={req} chatContext={chatContext} />}

      <div className="flex gap-x-2 text-sm">
        <IoLocationOutline className="size-4 text-primary shrink-0 mt-0.5" />
        <span>{req.location}</span>
      </div>
      <p className="text-sm font-light text-muted">{req.bio}</p>
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
    </div>
  )
}

function RequestDetails() {
  const { id = "" } = useParams()
  const isMobile = useMediaQuery({ maxWidth: 768 })
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
        <div className="grid grid-cols-9 gap-6 pb-28 lg:pb-10">
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

          <aside className="hidden lg:block lg:col-span-3">
            <RaCard round="round" styleClass="flex flex-col gap-4">
              <RequesterPanel req={req} chatContext={chatContext} />
            </RaCard>
          </aside>

          {isMobile && (
            <RaBottomSheet snapPoints={[0, 80, 0.75, 1]} initialSnap={1} contentClassName="px-3 pb-4">
              <RequesterPanel req={req} chatContext={chatContext} variant="sheet" />
            </RaBottomSheet>
          )}
        </div>
      </RaContainerPadding>
    </RaContainer>
  )
}

export default RequestDetails
