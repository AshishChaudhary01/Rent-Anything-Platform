import { useState } from "react"
import { raToast } from "../../lib/raToast"
import { apiFieldErrors } from "../../lib/formErrors"
import RaInput from "../input/RaInput"
import RaOtpInput from "../input/RaOtpInput"
import RaButton from "../button/RaButton"
import RaCard from "../card/RaCard"
import { confirmEmailChange, sendEmailChangeOtp } from "../../services/otp.service"
import { IoMailOutline } from "react-icons/io5"

function ContactOtpChange({
  current,
  onVerified,
}: {
  current: string
  onVerified?: (value: string) => Promise<void> | void
}) {
  const [nextValue, setNextValue] = useState("")
  const [awaitingOtp, setAwaitingOtp] = useState(false)
  const [otpError, setOtpError] = useState("")
  const [emailError, setEmailError] = useState("")
  const [otpKey, setOtpKey] = useState(0)
  const [sending, setSending] = useState(false)

  const destination = nextValue.trim()

  const requestCode = async () => {
    if (!destination.includes("@")) {
      setEmailError("Enter a valid email")
      return
    }
    if (destination.toLowerCase() === current.toLowerCase()) {
      setEmailError("That is already your email")
      return
    }
    setEmailError("")
    setSending(true)
    try {
      await sendEmailChangeOtp(destination)
      setAwaitingOtp(true)
      setOtpError("")
      setOtpKey((n) => n + 1)
      raToast.success(`Code sent to ${destination}`)
    } catch (error) {
      const fields = apiFieldErrors(error)
      setEmailError(fields.email || "Could not send the code")
      raToast.fromError(error, "Could not send the email code")
    } finally {
      setSending(false)
    }
  }

  const checkCode = async (otp: string) => {
    try {
      await confirmEmailChange({ email: destination, code: otp })
      await onVerified?.(destination)
      setNextValue("")
      setAwaitingOtp(false)
      setOtpError("")
      raToast.success("Email updated")
    } catch (error) {
      const fields = apiFieldErrors(error)
      setOtpError(fields.code || fields.email || "Could not verify that code")
    }
  }

  return (
    <form
      className="flex flex-col gap-y-4"
      onSubmit={(e) => {
        e.preventDefault()
        if (!awaitingOtp) void requestCode()
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
          }}
        />
        {awaitingOtp && (
          <RaOtpInput
            key={otpKey}
            email={destination}
            isError={Boolean(otpError)}
            error={otpError}
            onComplete={checkCode}
            onResend={() => void requestCode()}
          />
        )}
      </RaCard>
      {!awaitingOtp && (
        <RaButton type="submit" btnText={sending ? "Sending…" : "Send email code"} disabled={sending} />
      )}
    </form>
  )
}

export default ContactOtpChange
