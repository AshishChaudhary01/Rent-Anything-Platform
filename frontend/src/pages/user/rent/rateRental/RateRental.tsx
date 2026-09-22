import { useState } from "react"
import { Link, useNavigate, useSearchParams } from "react-router-dom"
import { IoCheckmarkCircle } from "react-icons/io5"
import RaContainerLG from "../../../../components/container/RaContainerLG"
import RaContainerPadding from "../../../../components/container/RaContainerPadding"
import RaCard from "../../../../components/card/RaCard"
import RaButton from "../../../../components/button/RaButton"
import StarRating from "../../../../components/rating/StarRating"
import { chatWithOwner, chatWithRenter } from "../../core/chat/chatData"
import { profile01, tools01 } from "../../../../utils/images"
import { raToast } from "../../../../lib/raToast"

function RateRental() {
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const role = params.get("role") === "owner" ? "owner" : "renter"
  const isOwner = role === "owner"
  const peer = isOwner ? chatWithRenter : chatWithOwner
  const donePath = isOwner ? "/user/my-listings" : "/user/my-rentals"

  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState("")
  const [submitted, setSubmitted] = useState(false)

  if (submitted) {
    return (
      <RaContainerLG>
        <RaContainerPadding>
          <div className="max-w-xl mx-auto flex flex-col gap-y-6 pb-10 text-center">
            <IoCheckmarkCircle className="size-14 mx-auto text-primary" />
            <div>
              <div className="text-xl font-bold">Thanks for your review</div>
              <div className="text-sm md:text-base font-light text-muted mt-1">
                Your rating helps keep RAP safe for the next rental.
              </div>
            </div>
            <RaButton type="button" btnText="Done" clickFunc={() => navigate(donePath)} />
          </div>
        </RaContainerPadding>
      </RaContainerLG>
    )
  }

  return (
    <RaContainerLG>
      <RaContainerPadding>
        <div className="max-w-xl mx-auto flex flex-col gap-y-6 pb-10">
          <div className="text-center space-y-3">
            <img src={profile01} alt="" className="size-20 rounded-full object-cover mx-auto" />
            <div>
              <div className="text-xl font-bold">Rate {peer.peerName}</div>
              <div className="text-sm md:text-base font-light text-muted">
                {isOwner
                  ? "How was this renter? Rate communication, care of the item, and pickup."
                  : "How was this owner? Rate communication, item condition, and handover."}
              </div>
            </div>
          </div>

          <RaCard round="round" styleClass="flex gap-3 items-center p-4!">
            <img src={tools01} alt="" className="size-14 rounded-xl object-cover shrink-0" />
            <div className="min-w-0">
              <div className="font-semibold truncate">{peer.listingTitle}</div>
              <div className="text-sm text-muted">{peer.listingRate}</div>
            </div>
          </RaCard>

          <RaCard round="round" styleClass="flex flex-col gap-4 items-center">
            <div className="text-sm text-muted">Tap a star to rate 1 to 5</div>
            <StarRating value={rating} onChange={setRating} />
            {rating > 0 && (
              <div className="font-semibold text-primary">
                {rating} / 5
              </div>
            )}
            <textarea
              className="w-full min-h-24 bg-surface border border-muted/20 rounded-2xl p-3 outline-none text-sm placeholder:text-muted/50"
              placeholder="Add a comment (optional)"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
          </RaCard>

          <RaButton
            type="button"
            btnText="Submit review"
            disabled={rating < 1}
            clickFunc={() => {
              raToast.success("Review submitted")
              setSubmitted(true)
            }}
          />
          <Link to={donePath} className="text-center text-sm text-muted">
            Skip for now
          </Link>
        </div>
      </RaContainerPadding>
    </RaContainerLG>
  )
}

export default RateRental
