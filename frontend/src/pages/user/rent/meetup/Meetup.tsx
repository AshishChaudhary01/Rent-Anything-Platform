import { useEffect, useRef, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { IoCalendarOutline, IoChatbubbleOutline, IoLocationOutline, IoScanOutline, IoTimeOutline } from "react-icons/io5"
import RaContainerLG from "../../../../components/container/RaContainerLG"
import RaContainerPadding from "../../../../components/container/RaContainerPadding"
import RaCard from "../../../../components/card/RaCard"
import RaButton from "../../../../components/button/RaButton"
import RaQrBox from "../../../../components/qr/RaQrBox"
import ReturnFlowHeader from "../ReturnFlowHeader"
import OwnerReturnNav from "../OwnerReturnNav"
import { RENT_STEPS } from "../returnSteps"
import ChatLink from "../../core/chat/ChatLink"
import { chatWithOwner } from "../../core/chat/chatData"
import { raToast } from "../../../../lib/raToast"

function Meetup() {
  const navigate = useNavigate()
  const location = useLocation()
  const paid = Boolean((location.state as { paid?: boolean } | null)?.paid)
  const videoRef = useRef<HTMLVideoElement>(null)
  const uploadRef = useRef<HTMLInputElement>(null)
  const [stream, setStream] = useState<MediaStream | null>(null)
  const [scanned, setScanned] = useState(false)
  const [preview, setPreview] = useState("")

  useEffect(() => {
    if (!paid) navigate("/user/rent/checkout", { replace: true })
  }, [paid, navigate])

  const stopCam = () => {
    stream?.getTracks().forEach((t) => t.stop())
    setStream(null)
  }

  const openScan = async () => {
    stopCam()
    try {
      if (!navigator.mediaDevices?.getUserMedia) throw new Error("no cam")
      const next = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: "environment" } },
      })
      setStream(next)
    } catch {
      uploadRef.current?.click()
    }
  }

  const capture = () => {
    const video = videoRef.current
    if (!video) return
    const canvas = document.createElement("canvas")
    canvas.width = video.videoWidth || 320
    canvas.height = video.videoHeight || 320
    canvas.getContext("2d")?.drawImage(video, 0, 0)
    setPreview(canvas.toDataURL("image/jpeg"))
    setScanned(true)
    stopCam()
  }

  const onUpload = (file: File | undefined) => {
    if (!file) return
    setPreview(URL.createObjectURL(file))
    setScanned(true)
  }

  useEffect(() => {
    if (!videoRef.current || !stream) return
    videoRef.current.srcObject = stream
    videoRef.current.play()
  }, [stream])

  useEffect(() => () => stream?.getTracks().forEach((t) => t.stop()), [stream])

  if (!paid) return null

  return (
    <RaContainerLG>
      <RaContainerPadding>
        <div className="max-w-xl mx-auto flex flex-col gap-y-6 pb-10">
          <ReturnFlowHeader current={3} title="Rent Item" steps={RENT_STEPS} />

          <div>
            <div className="text-xl font-bold">Pickup / Meetup</div>
            <div className="text-sm md:text-base font-light text-muted">
              Show your QR and scan the owner QR to start the rental.
            </div>
          </div>

          <RaCard round="round" styleClass="flex flex-col gap-y-3">
            <div className="flex items-center gap-2 font-semibold">
              <IoCalendarOutline className="size-5 text-primary" />
              Meetup Details
            </div>
            <div className="flex justify-between">
              <div className="flex gap-x-2 text-muted"><IoCalendarOutline className="size-4 text-primary" /> Date</div>
              <div className="font-medium">Oct 24, 2023</div>
            </div>
            <div className="flex justify-between">
              <div className="flex gap-x-2 text-muted"><IoTimeOutline className="size-4 text-primary" /> Time</div>
              <div className="font-medium">10:30 AM</div>
            </div>
            <div className="flex justify-between">
              <div className="flex gap-x-2 text-muted"><IoLocationOutline className="size-4 text-primary" /> Location</div>
              <div className="font-medium">Lazimpat, Kathmandu</div>
            </div>
          </RaCard>

          <RaCard round="round" styleClass="flex flex-col items-center gap-y-3 text-center">
            <div className="flex items-center gap-2 font-semibold">
              <IoScanOutline className="size-5 text-primary" />
              Scan owner QR
            </div>
            <input
              ref={uploadRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => onUpload(e.target.files?.[0])}
            />
            {stream ? (
              <>
                <video ref={videoRef} playsInline muted className="w-full max-w-xs aspect-square object-cover rounded-2xl bg-black" />
                <RaButton type="button" btnText="Capture" icon={<IoScanOutline />} iconPosition="left" clickFunc={capture} />
              </>
            ) : preview ? (
              <img src={preview} alt="Scan" className="size-40 object-cover rounded-xl" />
            ) : (
              <div className="size-40 border-2 border-dashed border-muted/30 rounded-2xl bg-surface flex items-center justify-center text-muted">
                <IoScanOutline className="size-10" />
              </div>
            )}
            <RaButton
              type="button"
              btnText={scanned ? "Scan again" : "Scan QR"}
              variant="outline"
              icon={<IoScanOutline />}
              iconPosition="left"
              clickFunc={openScan}
            />
          </RaCard>

          <RaCard round="round" styleClass="flex flex-col gap-3">
            <div className="flex items-center gap-2 font-semibold">
              <IoChatbubbleOutline className="size-5 text-primary" />
              Need to coordinate?
            </div>
            <ChatLink context={chatWithOwner} btnText="Chat with Owner" />
          </RaCard>

          <OwnerReturnNav
            onPrev={() => navigate("/user/rent/confirmation", { state: { paid: true } })}
            onNext={() => {
              raToast.success("Rental started")
              navigate("/user/my-rentals")
            }}
            nextDisabled={!scanned}
            nextText="Start rental"
          />
        </div>
      </RaContainerPadding>
    </RaContainerLG>
  )
}

export default Meetup
