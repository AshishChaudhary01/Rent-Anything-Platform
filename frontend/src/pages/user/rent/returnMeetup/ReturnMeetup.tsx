import { useEffect, useRef, useState } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import {
  IoCalendarOutline,
  IoCameraOutline,
  IoChatbubbleOutline,
  IoCloudUploadOutline,
  IoLocationOutline,
  IoQrCodeOutline,
  IoScanOutline,
  IoStopCircleOutline,
  IoTimeOutline,
} from "react-icons/io5"
import RaContainerLG from "../../../../components/container/RaContainerLG"
import RaContainerPadding from "../../../../components/container/RaContainerPadding"
import RaCard from "../../../../components/card/RaCard"
import RaButton from "../../../../components/button/RaButton"
import RaQrBox from "../../../../components/qr/RaQrBox"
import ReturnFlowHeader from "../ReturnFlowHeader"
import RentHint from "../RentHint"
import { OWNER_RETURN_STEPS } from "../returnSteps"
import ChatLink from "../../core/chat/ChatLink"
import { raToast } from "../../../../lib/raToast"
import ReportLink from "../../../../components/report/ReportLink"
import { useFinishReturn, useRental } from "../../../../hooks/queries/useRentals"
import { decodeQrFromFile, decodeQrFromVideo } from "../../../../lib/decodeQr"

function ReturnMeetup() {
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const rentalId = params.get("rentalId") || ""
  const { data: rental, isPending } = useRental(rentalId)
  const finishReturn = useFinishReturn()
  const videoRef = useRef<HTMLVideoElement>(null)
  const uploadRef = useRef<HTMLInputElement>(null)
  const [stream, setStream] = useState<MediaStream | null>(null)
  const [busy, setBusy] = useState(false)
  const [mode, setMode] = useState<"show" | "scan">("show")

  useEffect(() => {
    if (!rental) return
    if (rental.status === "COMPLETED") {
      navigate(`/user/rent/rate?rentalId=${rental.id}`, { replace: true })
      return
    }
    if (rental.status !== "ACTIVE") {
      navigate(`/user/rental-details?rentalId=${rental.id}`, { replace: true })
      return
    }
    if (!rental.returnScheduled) {
      navigate(`/user/rent/return-schedule?rentalId=${rental.id}`, { replace: true })
    }
  }, [rental, navigate])

  const stopCam = () => {
    stream?.getTracks().forEach((t) => t.stop())
    setStream(null)
  }

  const selectMode = (next: "show" | "scan") => {
    if (next === "show") stopCam()
    setMode(next)
  }

  const applyCode = (code: string | null) => {
    if (!rental || !code || busy || finishReturn.isPending) return
    setBusy(true)
    stopCam()
    finishReturn.mutate(
      { id: rental.id, code },
      {
        onSuccess: () => {
          raToast.success("Return confirmed. Commitment applied, commission taken, lister paid.")
          navigate(`/user/rent/rate?rentalId=${rental.id}`)
        },
        onError: (error) => {
          setBusy(false)
          raToast.fromError(error, "That QR does not finish this return")
        },
      },
    )
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

  const onUpload = async (file: File | undefined) => {
    if (!file) return
    const code = await decodeQrFromFile(file)
    if (!code) {
      raToast.error("Could not read a QR code from that image")
      return
    }
    applyCode(code)
  }

  useEffect(() => {
    if (!videoRef.current || !stream) return
    videoRef.current.srcObject = stream
    void videoRef.current.play()
  }, [stream])

  useEffect(() => {
    if (!stream || mode !== "scan") return
    const timer = window.setInterval(() => {
      const video = videoRef.current
      if (!video) return
      applyCode(decodeQrFromVideo(video))
    }, 400)
    return () => window.clearInterval(timer)
  }, [stream, mode, rental?.id, busy, finishReturn.isPending])

  useEffect(() => () => stream?.getTracks().forEach((t) => t.stop()), [stream])

  if (isPending || !rental) {
    return <p className="px-6 py-10 text-muted">Loading return meetup…</p>
  }

  const peerName = rental.owner ? rental.renterName : rental.ownerName
  const peerId = rental.owner ? rental.renterId : rental.ownerId
  const peerRole = rental.owner ? "renter" : "owner"
  const when = rental.returnMeetupAt ? new Date(rental.returnMeetupAt) : null

  return (
    <RaContainerLG>
      <RaContainerPadding>
        <div className="max-w-xl mx-auto flex flex-col gap-y-6 pb-10">
          <ReturnFlowHeader current={rental.owner ? 2 : 2} title={rental.owner ? "End Rental" : "Return Item"} steps={rental.owner ? OWNER_RETURN_STEPS : undefined} />

          <div>
            <div className="text-xl font-bold">Return Verification</div>
            <div className="text-sm md:text-base font-light text-muted">
              One person shows a QR. The other scans it. The system marks the item returned and settles payment.
            </div>
          </div>

          <RentHint icon={<IoScanOutline className="size-6" />} title="Scan the other person’s QR" tone="info">
            Scanning your own QR will not complete the return.
          </RentHint>

          <div className="grid grid-cols-2 gap-2">
            <RaButton type="button" btnText="Show my QR" variant={mode === "show" ? "secondary" : "ghost"} icon={<IoQrCodeOutline />} iconPosition="left" clickFunc={() => selectMode("show")} />
            <RaButton type="button" btnText={`Scan ${peerRole}`} variant={mode === "scan" ? "camera" : "ghost"} icon={<IoScanOutline />} iconPosition="left" clickFunc={() => selectMode("scan")} />
          </div>

          {mode === "show" ? (
            <RaCard round="round" bg="accentSecondary" styleClass="flex flex-col items-center gap-y-3 text-center">
              <div className="flex items-center gap-2 font-semibold text-muted-secondary">
                <IoQrCodeOutline className="size-5" />
                Show this QR to {peerName}
              </div>
              <RaQrBox value={rental.myReturnQrPayload || ""} />
            </RaCard>
          ) : (
            <RaCard round="round" bg="info" styleClass="flex flex-col items-center gap-y-3 text-center">
              <div className="flex items-center gap-2 font-semibold text-info">
                <IoScanOutline className="size-5" />
                Scan {peerName}’s QR
              </div>
              <input ref={uploadRef} type="file" accept="image/*" className="hidden" onChange={(e) => void onUpload(e.target.files?.[0])} />
              {stream ? (
                <video ref={videoRef} playsInline muted className="w-full max-w-xs aspect-square object-cover rounded-2xl bg-black" />
              ) : (
                <div className="size-40 border-2 border-dashed border-info/30 rounded-2xl bg-white flex items-center justify-center text-info">
                  <IoCameraOutline className="size-10" />
                </div>
              )}
              <div className="flex flex-col sm:flex-row gap-2 w-full">
                <RaButton type="button" btnText={stream ? "Stop camera" : "Open camera"} variant={stream ? "danger" : "camera"} icon={stream ? <IoStopCircleOutline /> : <IoCameraOutline />} iconPosition="left" clickFunc={stream ? stopCam : openScan} />
                <RaButton type="button" btnText="Upload QR image" variant="upload" icon={<IoCloudUploadOutline />} iconPosition="left" clickFunc={() => uploadRef.current?.click()} />
              </div>
              {busy && <p className="text-sm text-muted">Completing return…</p>}
            </RaCard>
          )}

          <RaCard round="round" bg="accent" styleClass="flex flex-col gap-y-3">
            <div className="font-semibold">Meetup Details</div>
            <div className="flex justify-between">
              <div className="flex gap-x-2 text-muted"><IoCalendarOutline className="size-4 text-primary" /> Date</div>
              <div className="font-medium">{when ? when.toLocaleDateString() : "—"}</div>
            </div>
            <div className="flex justify-between">
              <div className="flex gap-x-2 text-muted"><IoTimeOutline className="size-4 text-primary" /> Time</div>
              <div className="font-medium">{when ? when.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "—"}</div>
            </div>
            <div className="flex justify-between">
              <div className="flex gap-x-2 text-muted"><IoLocationOutline className="size-4 text-primary" /> Location</div>
              <div className="font-medium text-right max-w-[60%]">{rental.returnMeetupLocation}</div>
            </div>
          </RaCard>

          <ChatLink rentalId={rental.id} btnText={`Chat with ${peerName}`} />
          <ReportLink
            draft={{
              context: "return",
              listingTitle: rental.listingTitle,
              listingId: rental.listingId,
              accusedName: peerName,
              accusedId: peerId,
              rentalId: rental.id,
              reason: "Return dispute",
            }}
            btnText="Report a return issue"
            variant="lean"
            widthFill
          />
        </div>
      </RaContainerPadding>
    </RaContainerLG>
  )
}

export default ReturnMeetup
