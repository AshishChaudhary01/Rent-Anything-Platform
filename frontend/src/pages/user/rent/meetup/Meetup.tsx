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
} from "react-icons/io5"
import RaContainerLG from "../../../../components/container/RaContainerLG"
import RaContainerPadding from "../../../../components/container/RaContainerPadding"
import RaCard from "../../../../components/card/RaCard"
import RaButton from "../../../../components/button/RaButton"
import RaQrBox from "../../../../components/qr/RaQrBox"
import ReturnFlowHeader from "../ReturnFlowHeader"
import RentHint from "../RentHint"
import RentFlowLeave from "../RentFlowLeave"
import { RENT_STEPS } from "../returnSteps"
import ChatLink from "../../core/chat/ChatLink"
import { raToast } from "../../../../lib/raToast"
import { runConfirmedAction } from "../../../../lib/criticalAction"
import ReportLink from "../../../../components/report/ReportLink"
import { useRental, useStartRental, useReportNoShow } from "../../../../hooks/queries/useRentals"
import { decodeQrFromFile, decodeQrFromVideo } from "../../../../lib/decodeQr"
import RaPageLoader from "../../../../components/feedback/RaPageLoader"

function Meetup() {
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const rentalId = params.get("rentalId") || ""
  const { data: rental, isPending } = useRental(rentalId, 4000)
  const startRental = useStartRental()
  const noShow = useReportNoShow()
  const videoRef = useRef<HTMLVideoElement>(null)
  const uploadRef = useRef<HTMLInputElement>(null)
  const [stream, setStream] = useState<MediaStream | null>(null)
  const [busy, setBusy] = useState(false)
  const [mode, setMode] = useState<"show" | "scan">("show")

  useEffect(() => {
    if (!rental) return
    if (rental.status === "REQUESTED") {
      navigate(`/user/rent/waiting?rentalId=${rental.id}`, { replace: true })
      return
    }
    if (rental.status === "MEETUP_CONFIRMED") {
      if (rental.renter) {
        raToast.success("Meetup confirmed. Pay remaining rent to start.")
        navigate(`/user/rent/checkout?rentalId=${rental.id}&phase=remaining`, { replace: true })
      } else {
        raToast.success("Meetup confirmed. Waiting for remaining payment.")
        navigate(`/user/request-details/${rental.id}`, { replace: true })
      }
      return
    }
    if (rental.status === "PENDING_PAYMENT") {
      navigate(`/user/rent/checkout?rentalId=${rental.id}`, { replace: true })
    }
    if (rental.status === "ACTIVE") {
      navigate(rental.owner ? `/user/request-details/${rental.id}` : "/user/my-rentals", { replace: true })
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
    if (!rental || !code || busy || startRental.isPending) return
    setBusy(true)
    stopCam()
    startRental.mutate(
      { id: rental.id, code },
      {
        onSuccess: (updated) => {
          if (updated.status === "MEETUP_CONFIRMED") {
            raToast.success("Meetup confirmed")
            navigate(rental.owner
              ? `/user/request-details/${rental.id}`
              : `/user/rent/checkout?rentalId=${rental.id}&phase=remaining`)
            return
          }
          raToast.success("Rental started")
          navigate(rental.owner ? `/user/request-details/${rental.id}` : "/user/my-rentals")
        },
        onError: (error) => {
          setBusy(false)
          raToast.fromError(error, "That QR does not start this rental")
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
  }, [stream, mode, rental?.id, busy, startRental.isPending])

  useEffect(() => () => stream?.getTracks().forEach((t) => t.stop()), [stream])

  if (isPending || !rental) {
    return <RaPageLoader label="Loading meetup…" />
  }

  const peerName = rental.owner ? rental.renterName : rental.ownerName
  const peerId = rental.owner ? rental.renterId : rental.ownerId
  const peerRole = rental.owner ? "renter" : "owner"

  return (
    <RaContainerLG>
      <RaContainerPadding>
        <div className="max-w-xl mx-auto flex flex-col gap-y-6 pb-10">
          <ReturnFlowHeader current={3} title="Rent Item" steps={RENT_STEPS} />

          <div>
            <div className="text-xl font-bold">Pickup / Meetup</div>
            <div className="text-sm md:text-base font-light text-muted">
              One person shows a QR. The other scans it. Pick one option below.
            </div>
          </div>

          <RentHint icon={<IoScanOutline className="size-6" />} title="Only one action at a time" tone="info">
            Scanning your own QR will not confirm pickup. If the camera fails, upload a photo of {peerName}’s QR instead. After a match, the renter pays remaining rent to start.
          </RentHint>

          <div className="grid grid-cols-2 gap-2">
            <RaButton
              type="button"
              btnText="Show my QR"
              variant={mode === "show" ? "secondary" : "ghost"}
              icon={<IoQrCodeOutline />}
              iconPosition="left"
              clickFunc={() => selectMode("show")}
            />
            <RaButton
              type="button"
              btnText={`Scan ${peerRole}`}
              variant={mode === "scan" ? "camera" : "ghost"}
              icon={<IoScanOutline />}
              iconPosition="left"
              clickFunc={() => selectMode("scan")}
            />
          </div>

          {mode === "show" ? (
            <RaCard round="round" bg="accentSecondary" styleClass="flex flex-col items-center gap-y-3 text-center">
              <div className="flex items-center gap-2 font-semibold text-muted-secondary">
                <IoQrCodeOutline className="size-5" />
                Show this QR to {peerName}
              </div>
              <RaQrBox value={rental.myQrPayload || rental.meetupQrPayload || ""} />
              <p className="text-sm text-muted">Ask them to choose “Scan {rental.owner ? "owner" : "renter"}” on their phone.</p>
            </RaCard>
          ) : (
            <RaCard round="round" bg="info" styleClass="flex flex-col items-center gap-y-3 text-center">
              <div className="flex items-center gap-2 font-semibold text-info">
                <IoScanOutline className="size-5" />
                Scan {peerName}’s QR
              </div>
              <input
                ref={uploadRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => void onUpload(e.target.files?.[0])}
              />
              {stream ? (
                <video ref={videoRef} playsInline muted className="w-full max-w-xs aspect-square object-cover rounded-2xl bg-black" />
              ) : (
                <div className="size-40 border-2 border-dashed border-info/30 rounded-2xl bg-white flex items-center justify-center text-info">
                  <IoCameraOutline className="size-10" />
                </div>
              )}
              <div className="flex flex-col sm:flex-row gap-2 w-full">
                <RaButton
                  type="button"
                  btnText={stream ? "Stop camera" : "Open camera"}
                  variant={stream ? "danger" : "camera"}
                  icon={stream ? <IoStopCircleOutline /> : <IoCameraOutline />}
                  iconPosition="left"
                  clickFunc={stream ? stopCam : openScan}
                />
                <RaButton
                  type="button"
                  btnText="Upload QR image"
                  variant="upload"
                  icon={<IoCloudUploadOutline />}
                  iconPosition="left"
                  clickFunc={() => uploadRef.current?.click()}
                />
              </div>
              {busy && <p className="text-sm text-muted">Starting rental…</p>}
            </RaCard>
          )}

          <RaCard round="round" bg="accent" styleClass="flex flex-col gap-y-3">
            <div className="flex items-center gap-2 font-semibold">
              <IoCalendarOutline className="size-5 text-primary" />
              Meetup Details
            </div>
            <div className="flex justify-between">
              <div className="flex gap-x-2 text-muted"><IoCalendarOutline className="size-4 text-primary" /> Dates</div>
              <div className="font-medium">{rental.startDate} – {rental.endDate}</div>
            </div>
            <div className="flex justify-between">
              <div className="flex gap-x-2 text-muted"><IoLocationOutline className="size-4 text-primary" /> Location</div>
              <div className="font-medium text-right max-w-[60%]">{rental.meetupLocation}</div>
            </div>
          </RaCard>

          <RaCard round="round" styleClass="flex flex-col gap-3">
            <div className="flex items-center gap-2 font-semibold">
              <IoChatbubbleOutline className="size-5 text-primary" />
              Need to coordinate?
            </div>
            <ChatLink rentalId={rental.id} btnText={`Chat with ${peerName}`} />
          </RaCard>

          <RentFlowLeave owner={rental.owner} listingId={rental.listingId} rentalId={rental.id} />
          <div className="flex flex-col gap-2">
            <p className="text-sm font-semibold">If pickup does not happen</p>
            <RaButton
              type="button"
              btnText={noShow.isPending
                ? "Recording…"
                : rental.owner
                  ? "Record renter no-show"
                  : "Record owner no-show"}
              variant="danger"
              disabled={noShow.isPending}
              clickFunc={() =>
                void runConfirmedAction({
                  confirm: {
                    title: rental.owner ? "Record renter no-show?" : "Record owner no-show?",
                    body: "This settles the commitment fee and cannot be undone from the app.",
                    confirmText: "Record no-show",
                    danger: true,
                  },
                  run: () => noShow.mutateAsync(rental.id),
                  success: rental.owner
                    ? "No-show recorded. Commitment paid to you."
                    : "No-show recorded. Commitment refunded.",
                }).then((ok) => {
                  if (ok) navigate(rental.owner ? `/user/request-details/${rental.id}` : "/user/my-rentals")
                })
              }
            />
            <p className="text-xs text-muted">
              Use this when the other person never arrived. RAP settles the commitment fee from this report.
            </p>
            <ReportLink
              draft={{
                context: "meetup",
                listingTitle: rental.listingTitle,
                listingId: rental.listingId,
                accusedName: peerName,
                accusedId: peerId,
                rentalId: rental.id,
                reason: "Problem at meetup",
              }}
              btnText="Report a meetup problem"
              variant="lean"
              widthFill
            />
          </div>
        </div>
      </RaContainerPadding>
    </RaContainerLG>
  )
}

export default Meetup
