import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { IoCallOutline, IoLockClosedOutline, IoMailOutline } from "react-icons/io5"
import RaContainerXS from "../../../components/container/RaContainerXS"
import RaInput from "../../../components/input/RaInput"
import RaOtpInput from "../../../components/input/RaOtpInput"
import RaButton from "../../../components/button/RaButton"
import { sendOtp, verifyOtp, type OtpChannel } from "../../../services/otp.service"
import { raToast } from "../../../lib/raToast"

type Step = "identify" | "otp" | "reset"

function ForgotPassword() {
  const navigate = useNavigate()
  const [channel, setChannel] = useState<OtpChannel>("email")
  const [destination, setDestination] = useState("")
  const [step, setStep] = useState<Step>("identify")
  const [otpError, setOtpError] = useState(false)
  const [otpKey, setOtpKey] = useState(0)
  const [demoCode, setDemoCode] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  const isEmail = channel === "email"

  const requestCode = () => {
    const value = destination.trim()
    if (isEmail && !value.includes("@")) {
      raToast.error("Enter a valid email")
      return
    }
    if (!isEmail && value.replace(/\D/g, "").length < 10) {
      raToast.error("Enter a valid phone number")
      return
    }
    const code = sendOtp(channel, value)
    setDemoCode(code)
    setOtpError(false)
    setOtpKey((n) => n + 1)
    setStep("otp")
    raToast.success(`Code sent to ${value}`)
  }

  const checkCode = (otp: string) => {
    const result = verifyOtp(channel, destination.trim(), otp)
    if (!result.ok) {
      setOtpError(true)
      raToast.error(result.message)
      return
    }
    setStep("reset")
    raToast.success("Code verified. Set a new password.")
  }

  return (
    <RaContainerXS>
      <div className="flex flex-col gap-y-6">
        <div className="flex flex-col gap-y-4">
          <p className="text-2xl font-bold md:text-4xl md:font-extrabold">Forgot password</p>
          <p className="font-extralight text-sm md:font-light md:text-base text-muted">
            {step === "identify" && "Choose email or phone. We will send a one-time code to reset your password."}
            {step === "otp" && "Enter the 6-digit code to continue."}
            {step === "reset" && "Choose a new password for your RAP account."}
          </p>
        </div>

        {step === "identify" && (
          <form
            className="flex flex-col gap-y-4"
            onSubmit={(e) => {
              e.preventDefault()
              requestCode()
            }}
          >
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => {
                  setChannel("email")
                  setDestination("")
                }}
                className={`rounded-full py-2 text-sm font-semibold border cursor-pointer ${
                  isEmail ? "border-primary bg-primary/10 text-primary" : "border-gray-200"
                }`}
              >
                Email
              </button>
              <button
                type="button"
                onClick={() => {
                  setChannel("phone")
                  setDestination("")
                }}
                className={`rounded-full py-2 text-sm font-semibold border cursor-pointer ${
                  !isEmail ? "border-primary bg-primary/10 text-primary" : "border-gray-200"
                }`}
              >
                Phone
              </button>
            </div>
            <RaInput
              type={isEmail ? "email" : "text"}
              name="destination"
              label={isEmail ? "Email" : "Phone number"}
              placeholderText={isEmail ? "you@example.com" : "9801234567"}
              Icon={isEmail ? IoMailOutline : IoCallOutline}
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
            />
            <RaButton type="submit" btnText={isEmail ? "Send email code" : "Send SMS code"} />
          </form>
        )}

        {step === "otp" && (
          <div className="flex flex-col gap-y-4">
            <RaOtpInput
              key={otpKey}
              email={destination.trim()}
              isError={otpError}
              onComplete={checkCode}
              onResend={requestCode}
            />
            <div className="text-xs text-muted">
              Prototype code: {demoCode}. This will be delivered by {isEmail ? "email" : "SMS"} when the gateway is connected.
            </div>
            <button
              type="button"
              className="text-sm text-muted text-left cursor-pointer"
              onClick={() => {
                setStep("identify")
                setDemoCode("")
              }}
            >
              Use a different {isEmail ? "email" : "number"}
            </button>
          </div>
        )}

        {step === "reset" && (
          <form
            className="flex flex-col gap-y-4"
            onSubmit={(e) => {
              e.preventDefault()
              if (password.length < 8) {
                raToast.error("Password must be at least 8 characters")
                return
              }
              if (password !== confirmPassword) {
                raToast.error("Passwords do not match")
                return
              }
              raToast.success("Password updated. You can log in now.")
              navigate("/auth/login")
            }}
          >
            <RaInput
              type="password"
              name="newPassword"
              label="New password"
              placeholderText="********"
              Icon={IoLockClosedOutline}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <RaInput
              type="password"
              name="confirmPassword"
              label="Confirm new password"
              placeholderText="********"
              Icon={IoLockClosedOutline}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <RaButton type="submit" btnText="Update password" />
          </form>
        )}

        <div className="text-muted text-sm font-light text-center">
          Remembered it?
          <span className="text-primary">
            <Link to="/auth/login" className="font-semibold"> Login</Link>
          </span>
        </div>
      </div>
    </RaContainerXS>
  )
}

export default ForgotPassword
