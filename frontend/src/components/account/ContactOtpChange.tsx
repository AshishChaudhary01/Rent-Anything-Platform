import { useState } from "react"
import { raToast } from "../../lib/raToast"
import RaInput from "../input/RaInput"
import RaOtpInput from "../input/RaOtpInput"
import RaButton from "../button/RaButton"
import RaCard from "../card/RaCard"
import { sendOtp, verifyOtp, type OtpChannel } from "../../services/otp.service"

function ContactOtpChange({
  channel,
  current,
  icon,
  onVerified,
}: {
  channel: OtpChannel
  current: string
  icon: React.ElementType
  onVerified: (value: string) => void
}) {
  const isEmail = channel === "email"
  const [nextValue, setNextValue] = useState("")
  const [awaitingOtp, setAwaitingOtp] = useState(false)
  const [otpError, setOtpError] = useState(false)
  const [otpKey, setOtpKey] = useState(0)
  const [demoCode, setDemoCode] = useState("")

  const destination = nextValue.trim()

  const requestCode = () => {
    if (isEmail && !destination.includes("@")) {
      raToast.error("Enter a valid email")
      return
    }
    if (!isEmail && destination.replace(/\D/g, "").length < 10) {
      raToast.error("Enter a valid phone number")
      return
    }
    if (destination === current) {
      raToast.error(`That is already your ${isEmail ? "email" : "phone number"}`)
      return
    }
    const code = sendOtp(channel, destination)
    setDemoCode(code)
    setAwaitingOtp(true)
    setOtpError(false)
    setOtpKey((n) => n + 1)
    raToast.success(`Code sent to ${destination}`)
  }

  const checkCode = (otp: string) => {
    const result = verifyOtp(channel, destination, otp)
    if (!result.ok) {
      setOtpError(true)
      raToast.error(result.message)
      return
    }
    onVerified(destination)
    setNextValue("")
    setAwaitingOtp(false)
    setDemoCode("")
    setOtpError(false)
    raToast.success(`${isEmail ? "Email" : "Phone number"} updated`)
  }

  return (
    <form
      className="flex flex-col gap-y-4"
      onSubmit={(e) => {
        e.preventDefault()
        if (!awaitingOtp) requestCode()
      }}
    >
      <RaCard round="round" styleClass="flex flex-col gap-y-4">
        <div>
          <div className="font-semibold">{isEmail ? "Email" : "Phone"}</div>
          <div className="text-sm text-muted">{current}</div>
        </div>
        <RaInput
          type={isEmail ? "email" : "text"}
          name={isEmail ? "newEmail" : "newPhone"}
          label={isEmail ? "New email" : "New phone number"}
          placeholderText={isEmail ? "you@example.com" : "9801234567"}
          Icon={icon}
          value={nextValue}
          onChange={(e) => {
            setNextValue(e.target.value)
            setAwaitingOtp(false)
            setDemoCode("")
          }}
        />
        {awaitingOtp && (
          <>
            <RaOtpInput
              key={otpKey}
              email={destination}
              isError={otpError}
              onComplete={checkCode}
              onResend={requestCode}
            />
            <div className="text-xs text-muted">
              Prototype code: {demoCode}. This will be delivered by {isEmail ? "email" : "SMS"} when the gateway is connected.
            </div>
          </>
        )}
      </RaCard>
      {!awaitingOtp && (
        <RaButton type="submit" btnText={isEmail ? "Send email code" : "Send SMS code"} />
      )}
    </form>
  )
}

export default ContactOtpChange
