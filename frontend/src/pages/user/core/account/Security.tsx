import { IoLockClosedOutline } from "react-icons/io5"
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
import { useChangePassword, useMe } from "../../../../hooks/queries/useAccount"
import { apiFieldErrors } from "../../../../lib/formErrors"
import { requiredPassword } from "../../../../schemas/zod.schema"

function Security() {
  const { email } = useAccountStore()
  const { refetch } = useMe()
  const { mutate: savePassword, isPending } = useChangePassword()
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [errors, setErrors] = useState<Record<string, string>>({})

  return (
    <RaContainer>
      <RaContainerPadding>
        <div className="max-w-xl mx-auto flex flex-col gap-y-6 pb-32">
          <RaBreadcrumb items={[{ label: "Security" }]} />
          <div>
            <div className="text-xl md:text-2xl font-bold">Security</div>
            <div className="text-sm md:text-base font-light text-muted">
              Email changes need a one-time code sent to the new address. Password updates use your current password.
            </div>
          </div>

          <ContactOtpChange
            current={email}
            onVerified={async () => {
              await refetch()
            }}
          />

          <form
            className="flex flex-col gap-y-4"
            onSubmit={(e) => {
              e.preventDefault()
              const next: Record<string, string> = {}
              if (currentPassword.length < 8) next.currentPassword = "Current password is required"
              const parsed = requiredPassword().safeParse(newPassword)
              if (!parsed.success) next.newPassword = parsed.error.issues[0]?.message || "Enter a stronger password"
              if (newPassword !== confirmPassword) next.confirmPassword = "New passwords do not match"
              if (Object.keys(next).length) {
                setErrors(next)
                return
              }
              savePassword(
                { currentPassword, newPassword },
                {
                  onSuccess: () => {
                    setCurrentPassword("")
                    setNewPassword("")
                    setConfirmPassword("")
                    setErrors({})
                    raToast.success("Password updated")
                  },
                  onError: (error) => setErrors(apiFieldErrors(error)),
                },
              )
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
                error={errors.currentPassword}
                onChange={(e) => {
                  setCurrentPassword(e.target.value)
                  setErrors((prev) => ({ ...prev, currentPassword: "" }))
                }}
              />
              <RaInput
                type="password"
                name="newPassword"
                label="New password"
                placeholderText="********"
                Icon={IoLockClosedOutline}
                value={newPassword}
                error={errors.newPassword}
                onChange={(e) => {
                  setNewPassword(e.target.value)
                  setErrors((prev) => ({ ...prev, newPassword: "" }))
                }}
              />
              <RaInput
                type="password"
                name="confirmPassword"
                label="Confirm new password"
                placeholderText="********"
                Icon={IoLockClosedOutline}
                value={confirmPassword}
                error={errors.confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value)
                  setErrors((prev) => ({ ...prev, confirmPassword: "" }))
                }}
              />
            </RaCard>
            <RaButton type="submit" btnText={isPending ? "Updating" : "Update password"} disabled={isPending} />
          </form>
        </div>
      </RaContainerPadding>
    </RaContainer>
  )
}

export default Security
