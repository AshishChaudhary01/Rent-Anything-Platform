import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { IoLockClosedOutline, IoMailOutline } from "react-icons/io5"
import RaContainerXS from "../../../components/container/RaContainerXS"
import RaInput from "../../../components/input/RaInput"
import RaOtpInput from "../../../components/input/RaOtpInput"
import RaButton from "../../../components/button/RaButton"
import { sendOtp, verifyOtp } from "../../../services/otp.service"
import { raToast } from "../../../lib/raToast"
import { requiredPassword } from "../../../schemas/zod.schema"

type Step = "identify" | "otp" | "reset"

function ForgotPassword() {
  const navigate = useNavigate()
  const [email, setEmail] = useState("")
  const [step, setStep] = useState<Step>("identify")
  const [otpError, setOtpError] = useState("")
  const [emailError, setEmailError] = useState("")
  const [passwordError, setPasswordError] = useState("")
  const [confirmError, setConfirmError] = useState("")
  const [otpKey, setOtpKey] = useState(0)
  const [demoCode, setDemoCode] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  const requestCode = () => {
    const value = email.trim()
    if (!value.includes("@")) {
      setEmailError("Enter a valid email")
      return
    }
    setEmailError("")
    const code = sendOtp(value)
    setDemoCode(code)
    setOtpError("")
    setOtpKey((n) => n + 1)
    setStep("otp")
    raToast.success(`Code sent to ${value}`)
  }

  const checkCode = (otp: string) => {
    const result = verifyOtp(email.trim(), otp)
    if (!result.ok) {
      setOtpError(result.message)
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
            {step === "identify" && "Enter the email on your account. We will send a one-time code to reset your password."}
            {step === "otp" && "Enter the 6-digit code sent to your email."}
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
            <RaInput
              type="email"
              name="email"
              label="Email"
              placeholderText="you@example.com"
              Icon={IoMailOutline}
              value={email}
              error={emailError}
              onChange={(e) => {
                setEmail(e.target.value)
                setEmailError("")
              }}
            />
            <RaButton type="submit" btnText="Send email code" />
          </form>
        )}

        {step === "otp" && (
          <div className="flex flex-col gap-y-4">
            <RaOtpInput
              key={otpKey}
              email={email.trim()}
              isError={Boolean(otpError)}
              error={otpError}
              onComplete={checkCode}
              onResend={requestCode}
            />
            <div className="text-xs text-muted">
              Prototype code: {demoCode}. This will be delivered by email when SMTP is connected.
            </div>
            <button
              type="button"
              className="text-sm text-muted text-left cursor-pointer"
              onClick={() => {
                setStep("identify")
                setDemoCode("")
                setOtpError("")
              }}
            >
              Use a different email
            </button>
          </div>
        )}

        {step === "reset" && (
          <form
            className="flex flex-col gap-y-4"
            onSubmit={(e) => {
              e.preventDefault()
              const parsed = requiredPassword().safeParse(password)
              if (!parsed.success) {
                setPasswordError(parsed.error.issues[0]?.message || "Enter a stronger password")
                setConfirmError("")
                return
              }
              if (password !== confirmPassword) {
                setPasswordError("")
                setConfirmError("Passwords do not match")
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
              error={passwordError}
              onChange={(e) => {
                setPassword(e.target.value)
                setPasswordError("")
              }}
            />
            <RaInput
              type="password"
              name="confirmPassword"
              label="Confirm new password"
              placeholderText="********"
              Icon={IoLockClosedOutline}
              value={confirmPassword}
              error={confirmError}
              onChange={(e) => {
                setConfirmPassword(e.target.value)
                setConfirmError("")
              }}
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
