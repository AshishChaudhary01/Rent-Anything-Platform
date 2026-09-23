import { useState } from "react"
import { raToast } from "../../lib/raToast"
import { apiFieldErrors } from "../../lib/formErrors"
import RaInput from "../input/RaInput"
import RaOtpInput from "../input/RaOtpInput"
import RaButton from "../button/RaButton"
import RaCard from "../card/RaCard"
import { sendOtp, verifyOtp } from "../../services/otp.service"
import { IoMailOutline } from "react-icons/io5"

function ContactOtpChange({
  current,
  onVerified,
}: {
  current: string
  onVerified: (value: string) => Promise<void> | void
}) {
  const [nextValue, setNextValue] = useState("")
  const [awaitingOtp, setAwaitingOtp] = useState(false)
  const [otpError, setOtpError] = useState("")
  const [emailError, setEmailError] = useState("")
  const [otpKey, setOtpKey] = useState(0)
  const [demoCode, setDemoCode] = useState("")

  const destination = nextValue.trim()

  const requestCode = () => {
    if (!destination.includes("@")) {
      setEmailError("Enter a valid email")
      return
    }
    if (destination.toLowerCase() === current.toLowerCase()) {
      setEmailError("That is already your email")
      return
    }
    setEmailError("")
    const code = sendOtp(destination)
    setDemoCode(code)
    setAwaitingOtp(true)
    setOtpError("")
    setOtpKey((n) => n + 1)
    raToast.success(`Code sent to ${destination}`)
  }

  const checkCode = async (otp: string) => {
    const result = verifyOtp(destination, otp)
    if (!result.ok) {
      setOtpError(result.message)
      return
    }
    try {
      await onVerified(destination)
      setNextValue("")
      setAwaitingOtp(false)
      setDemoCode("")
      setOtpError("")
      raToast.success("Email updated")
    } catch (error) {
      const fields = apiFieldErrors(error)
      setEmailError(fields.email || "Could not update email")
      setAwaitingOtp(false)
    }
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
          <div className="font-semibold">Email</div>
          <div className="text-sm text-muted">{current}</div>
        </div>
        <RaInput
          type="email"
          name="newEmail"
          label="New email"
          placeholderText="you@example.com"
          Icon={IoMailOutline}
          value={nextValue}
          error={emailError}
          onChange={(e) => {
            setNextValue(e.target.value)
            setEmailError("")
            setAwaitingOtp(false)
            setDemoCode("")
          }}
        />
        {awaitingOtp && (
          <>
            <RaOtpInput
              key={otpKey}
              email={destination}
              isError={Boolean(otpError)}
              error={otpError}
              onComplete={checkCode}
              onResend={requestCode}
            />
            <div className="text-xs text-muted">
              Prototype code: {demoCode}. This will be delivered by email when SMTP is connected.
            </div>
          </>
        )}
      </RaCard>
      {!awaitingOtp && (
        <RaButton type="submit" btnText="Send email code" />
      )}
    </form>
  )
}

export default ContactOtpChange
