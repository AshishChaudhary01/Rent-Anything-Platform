import { useState } from "react"
import { Link } from "react-router-dom"
import { IoArrowBackOutline, IoStar } from "react-icons/io5"
import RaBadge from "../../../../components/badge/RaBadge"
import RaCard from "../../../../components/card/RaCard"
import MediaGallery, { type MediaItem } from "../../../../components/mediaGallery/MediaGallery"
import ChatLink from "../../core/chat/ChatLink"
import { chatWithArpan } from "../../core/chat/chatData"
import { backpack01, ladder01, profile01, tent01, tools01 } from "../../../../utils/images"

const rentalMedia: MediaItem[] = [
  { type: "image", url: tools01 },
  { type: "image", url: tent01 },
  { type: "image", url: backpack01 },
  { type: "image", url: ladder01 },
  { type: "image", url: tools01 },
]

function RentalDetailsMain() {
  const [note, setNote] = useState("")

  return (
    <div className="flex flex-col gap-y-4">
      <Link to="/user/my-rentals" className="flex items-center gap-x-1 text-muted text-sm">
        <IoArrowBackOutline className="size-4" />
        Back
      </Link>

      <div className="flex items-center gap-x-3">
        <RaBadge badgeText="Active Rental" size="sm" />
        <div className="text-sm text-muted">Rental ID: #RA-88421</div>
      </div>

      <MediaGallery media={rentalMedia} />

      <div className="text-xl md:text-2xl font-bold">Sony A7R IV 61.0MP Full-frame Camera</div>
      <p className="font-light text-muted">
        High-resolution mirrorless camera paired with a 24-70mm f/2.8 GM lens. Perfect for commercial shoots, landscapes, and professional portraiture. Includes 2 batteries and a 128GB UHS-II card.
      </p>

      <RaCard round="round" styleClass="flex flex-col gap-y-3">
        <div className="flex items-center gap-x-3">
          <img src={profile01} alt="Owner" className="size-10 rounded-full object-cover" />
          <div>
            <div className="font-semibold">Message Arpan Sharma</div>
            <div className="flex items-center gap-x-1 text-sm text-muted">
              <IoStar className="size-3 text-yellow-400" />
              Typically replies in 5 mins
            </div>
          </div>
        </div>
        <div className="flex gap-2 items-end">
          <input
            className="flex-1 bg-surface border border-muted/20 p-3 rounded-full outline-0"
            placeholder="Ask about the item..."
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
          <ChatLink
            context={{ ...chatWithArpan, draft: note || "Ask about the item..." }}
            btnText="Send"
            size="sm"
            widthFill={false}
            variant="primary"
            icon={undefined}
          />
        </div>
      </RaCard>
    </div>
  )
}

export default RentalDetailsMain
