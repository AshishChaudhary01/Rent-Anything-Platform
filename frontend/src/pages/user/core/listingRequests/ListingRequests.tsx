import { Link, useSearchParams } from "react-router-dom"
import { IoArrowBackOutline } from "react-icons/io5"
import RaContainer from "../../../../components/container/RaContainer"
import RaContainerPadding from "../../../../components/container/RaContainerPadding"
import RaCard from "../../../../components/card/RaCard"
import RaButton from "../../../../components/button/RaButton"
import RaBadge from "../../../../components/badge/RaBadge"
import ChatLink from "../chat/ChatLink"
import { chatWithRenter } from "../chat/chatData"
import { profile01, tools01 } from "../../../../utils/images"

const requests = [
  { id: 1, name: "Anish Sharma", dates: "Oct 24 - Oct 27", status: "Pending" },
  { id: 2, name: "Ramesh Kumar", dates: "Nov 2 - Nov 5", status: "Pending" },
]

function ListingRequests() {
  const [params] = useSearchParams()
  const listing = params.get("listing") || "Listing"

  return (
    <RaContainer>
      <RaContainerPadding>
        <div className="max-w-xl mx-auto flex flex-col gap-y-6 pb-10">
          <Link to="/user/my-listing-details" className="flex items-center gap-x-1 text-muted text-sm">
            <IoArrowBackOutline className="size-4" />
            Back
          </Link>

          <div>
            <div className="text-xl md:text-2xl font-bold">Requests</div>
            <div className="text-sm md:text-base font-light text-muted">{listing}</div>
          </div>

          {requests.map((req) => (
            <RaCard key={req.id} round="round" styleClass="flex flex-col gap-3">
              <div className="flex items-center gap-3">
                <img src={profile01} alt="" className="size-10 rounded-full object-cover" />
                <div className="flex-1 min-w-0">
                  <div className="font-semibold">{req.name}</div>
                  <div className="text-sm text-muted">{req.dates}</div>
                </div>
                <RaBadge badgeText={req.status} size="sm" />
              </div>
              <div className="flex gap-2">
                <RaButton type="button" btnText="Accept" size="sm" />
                <RaButton type="button" btnText="Decline" size="sm" variant="outline" />
                <ChatLink
                  context={{
                    ...chatWithRenter,
                    threadId: `request-${req.id}`,
                    peerName: req.name,
                    listingTitle: listing,
                    listingImage: tools01,
                  }}
                  size="sm"
                  widthFill={false}
                />
              </div>
            </RaCard>
          ))}
        </div>
      </RaContainerPadding>
    </RaContainer>
  )
}

export default ListingRequests
