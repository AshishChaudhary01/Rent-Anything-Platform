import { IoCallOutline, IoLockClosedOutline, IoMailOutline } from "react-icons/io5"
import { raToast } from "../../../../lib/raToast"
import { useState } from "react"
import RaContainer from "../../../../components/container/RaContainer"
import RaContainerPadding from "../../../../components/container/RaContainerPadding"
import RaBreadcrumb from "../../../../components/breadcrumb/RaBreadcrumb"
import RaCard from "../../../../components/card/RaCard"
import RaInput from "../../../../components/input/RaInput"
import RaButton from "../../../../components/button/RaButton"
import ContactOtpChange from "../../../../components/account/ContactOtpChange"
import { useAccountStore } from "../../../../store/accountStore"

function Security() {
  const { email, phone, setEmail, setPhone } = useAccountStore()
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  return (
    <RaContainer>
      <RaContainerPadding>
        <div className="max-w-xl mx-auto flex flex-col gap-y-6 pb-32">
          <RaBreadcrumb items={[{ label: "Security" }]} />
          <div>
            <div className="text-xl md:text-2xl font-bold">Security</div>
            <div className="text-sm md:text-base font-light text-muted">
              Email and phone changes need a one-time code. Password still uses your current password.
            </div>
          </div>

          <ContactOtpChange
            channel="email"
            current={email}
            icon={IoMailOutline}
            onVerified={setEmail}
          />

          <ContactOtpChange
            channel="phone"
            current={phone}
            icon={IoCallOutline}
            onVerified={setPhone}
          />

          <form
            className="flex flex-col gap-y-4"
            onSubmit={(e) => {
              e.preventDefault()
              if (currentPassword.length < 8 || newPassword.length < 8) {
                raToast.error("Passwords must be at least 8 characters")
                return
              }
              if (newPassword !== confirmPassword) {
                raToast.error("New passwords do not match")
                return
              }
              setCurrentPassword("")
              setNewPassword("")
              setConfirmPassword("")
              raToast.success("Password updated")
            }}
          >
            <RaCard round="round" styleClass="flex flex-col gap-y-4">
              <div className="font-semibold">Password</div>
              <RaInput
                type="password"
                name="currentPassword"
                label="Current password"
                placeholderText="********"
                Icon={IoLockClosedOutline}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
              />
              <RaInput
                type="password"
                name="newPassword"
                label="New password"
                placeholderText="********"
                Icon={IoLockClosedOutline}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
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
            </RaCard>
            <RaButton type="submit" btnText="Update password" />
          </form>
        </div>
      </RaContainerPadding>
    </RaContainer>
  )
}

export default Security
