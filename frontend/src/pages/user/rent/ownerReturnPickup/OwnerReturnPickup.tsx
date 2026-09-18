import { useEffect, useRef, useState } from "react"
import { useNavigate } from "react-router-dom"
import { IoScanOutline } from "react-icons/io5"
import RaContainerLG from "../../../../components/container/RaContainerLG"
import RaContainerPadding from "../../../../components/container/RaContainerPadding"
import RaCard from "../../../../components/card/RaCard"
import RaButton from "../../../../components/button/RaButton"
import ReturnFlowHeader from "../ReturnFlowHeader"
import OwnerReturnNav from "../OwnerReturnNav"
import { OWNER_RETURN_STEPS } from "../returnSteps"

function OwnerReturnPickup() {
  const navigate = useNavigate()
  const videoRef = useRef<HTMLVideoElement>(null)
  const uploadRef = useRef<HTMLInputElement>(null)
  const [stream, setStream] = useState<MediaStream | null>(null)
  const [scanned, setScanned] = useState(false)
  const [preview, setPreview] = useState("")

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

  return (
    <RaContainerLG>
      <RaContainerPadding>
        <div className="max-w-xl mx-auto flex flex-col gap-y-6 pb-10">
          <ReturnFlowHeader current={2} title="End Rental" steps={OWNER_RETURN_STEPS} />

          <div>
            <div className="text-xl font-bold">Pickup / Meetup</div>
            <div className="text-sm md:text-base font-light text-muted">
              Scan the renter QR at meetup to finish the return.
            </div>
          </div>

          <RaCard round="round" styleClass="flex flex-col items-center gap-y-3 text-center">
            <div className="flex items-center gap-2 font-semibold">
              <IoScanOutline className="size-5 text-primary" />
              Scan renter QR
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

          <OwnerReturnNav
            onPrev={() => navigate("/user/rent/owner-return-review")}
            onNext={() => navigate("/user/rent/owner-return-confirm", { state: { scanned: true } })}
            nextDisabled={!scanned}
            nextText="Next"
          />
        </div>
      </RaContainerPadding>
    </RaContainerLG>
  )
}

export default OwnerReturnPickup
