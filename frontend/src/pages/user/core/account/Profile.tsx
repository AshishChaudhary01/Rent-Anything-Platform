import { useRef, useState } from "react"
import { IoCameraOutline, IoCallOutline, IoHomeOutline, IoLocationOutline, IoPersonOutline } from "react-icons/io5"
import { raToast } from "../../../../lib/raToast"
import { apiFieldErrors } from "../../../../lib/formErrors"
import RaContainer from "../../../../components/container/RaContainer"
import RaContainerPadding from "../../../../components/container/RaContainerPadding"
import RaBreadcrumb from "../../../../components/breadcrumb/RaBreadcrumb"
import RaCard from "../../../../components/card/RaCard"
import RaInput from "../../../../components/input/RaInput"
import RaButton from "../../../../components/button/RaButton"
import AccountSetupBanner from "../../../../components/account/AccountSetupBanner"
import { useAccountStore } from "../../../../store/accountStore"
import { useUpdateProfile, useUploadAvatar } from "../../../../hooks/queries/useAccount"

function Profile() {
  const fileRef = useRef<HTMLInputElement>(null)
  const { fullName, phone, addressLine, city, district, avatarUrl, hasAvatar, setProfile, setPhone } = useAccountStore()
  const { mutate: saveProfile, isPending } = useUpdateProfile()
  const { mutate: saveAvatar, isPending: uploading } = useUploadAvatar()
  const [errors, setErrors] = useState<Record<string, string>>({})

  const pickPhoto = (file: File | undefined) => {
    if (!file || !file.type.startsWith("image/")) {
      setErrors((prev) => ({ ...prev, avatar: "Choose an image file" }))
      return
    }
    saveAvatar(file, {
      onSuccess: () => {
        setErrors((prev) => ({ ...prev, avatar: "" }))
        raToast.success("Profile photo updated")
      },
      onError: (error) => {
        const fields = apiFieldErrors(error)
        setErrors((prev) => ({ ...prev, avatar: fields.avatar || "Could not update photo" }))
        raToast.fromError(error, "Could not update photo")
      },
    })
  }

  return (
    <RaContainer>
      <RaContainerPadding>
        <div className="max-w-xl mx-auto flex flex-col gap-y-6 pb-32">
          <RaBreadcrumb items={[{ label: "Profile" }]} />
          <div>
            <div className="text-xl md:text-2xl font-bold">Profile</div>
            <div className="text-sm md:text-base font-light text-muted">
              This name, phone, and address are used on bookings, pickup, and KYC. Upload your own photo — Google pictures are not used.
            </div>
          </div>

          <AccountSetupBanner />

          <RaCard round="round" styleClass="flex items-center gap-4 p-4!">
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                pickPhoto(e.target.files?.[0])
                e.target.value = ""
              }}
            />
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="relative size-16 shrink-0 cursor-pointer"
              aria-label="Change profile photo"
            >
              <img
                src={avatarUrl && hasAvatar ? avatarUrl : `https://ui-avatars.com/api/?name=${encodeURIComponent(fullName || "User")}`}
                alt=""
                className="size-16 rounded-full object-cover"
              />
              <span className="absolute inset-0 rounded-full bg-black/40 flex items-center justify-center">
                <IoCameraOutline className="size-6 text-white" />
              </span>
            </button>
            <div className="min-w-0">
              <div className="font-semibold truncate">{fullName || "Your name"}</div>
              <button
                type="button"
                className="text-sm text-primary cursor-pointer"
                onClick={() => fileRef.current?.click()}
                disabled={uploading}
              >
                {uploading ? "Uploading…" : hasAvatar ? "Change photo" : "Upload a profile photo"}
              </button>
              {!hasAvatar && (
                <div className="text-xs text-muted mt-1">Required before you can list or rent.</div>
              )}
              {errors.avatar && <div className="text-danger text-xs mt-1">{errors.avatar}</div>}
            </div>
          </RaCard>

          <form
            className="flex flex-col gap-y-4"
            onSubmit={(e) => {
              e.preventDefault()
              const next: Record<string, string> = {}
              if (!fullName.trim()) next.fullName = "Full name is required"
              if (!phone.trim()) next.phone = "Phone is required"
              if (!addressLine.trim()) next.addressLine = "Address is required"
              if (!city.trim()) next.city = "City is required"
              if (!district.trim()) next.district = "District is required"
              if (Object.keys(next).length) {
                setErrors(next)
                return
              }
              saveProfile(
                { fullName, phone, addressLine, city, district },
                {
                  onSuccess: () => {
                    setErrors({})
                    raToast.success("Profile saved")
                  },
                  onError: (error) => {
                    setErrors(apiFieldErrors(error))
                    raToast.fromError(error)
                  },
                },
              )
            }}
          >
            <RaCard round="round" styleClass="flex flex-col gap-y-4">
              <RaInput
                name="fullName"
                label="Full name"
                placeholderText="Ram Rai"
                Icon={IoPersonOutline}
                value={fullName}
                error={errors.fullName}
                onChange={(e) => {
                  setProfile({ fullName: e.target.value })
                  setErrors((prev) => ({ ...prev, fullName: "" }))
                }}
              />
              <RaInput
                name="phone"
                label="Phone"
                placeholderText="9801234567"
                Icon={IoCallOutline}
                value={phone}
                error={errors.phone}
                onChange={(e) => {
                  setPhone(e.target.value)
                  setErrors((prev) => ({ ...prev, phone: "" }))
                }}
              />
              <RaInput
                name="addressLine"
                label="Address"
                placeholderText="Street, tole, or house no."
                Icon={IoHomeOutline}
                value={addressLine}
                error={errors.addressLine}
                onChange={(e) => {
                  setProfile({ addressLine: e.target.value })
                  setErrors((prev) => ({ ...prev, addressLine: "" }))
                }}
              />
              <RaInput
                name="city"
                label="City / municipality"
                placeholderText="Kathmandu"
                Icon={IoLocationOutline}
                value={city}
                error={errors.city}
                onChange={(e) => {
                  setProfile({ city: e.target.value })
                  setErrors((prev) => ({ ...prev, city: "" }))
                }}
              />
              <RaInput
                name="district"
                label="District"
                placeholderText="Kathmandu"
                Icon={IoLocationOutline}
                value={district}
                error={errors.district}
                onChange={(e) => {
                  setProfile({ district: e.target.value })
                  setErrors((prev) => ({ ...prev, district: "" }))
                }}
              />
            </RaCard>
            <RaButton type="submit" btnText={isPending ? "Saving" : "Save profile"} disabled={isPending} />
          </form>
        </div>
      </RaContainerPadding>
    </RaContainer>
  )
}

export default Profile
