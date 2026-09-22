import { useRef } from "react"
import { IoCameraOutline, IoHomeOutline, IoLocationOutline, IoPersonOutline } from "react-icons/io5"
import { raToast } from "../../../../lib/raToast"
import RaContainer from "../../../../components/container/RaContainer"
import RaContainerPadding from "../../../../components/container/RaContainerPadding"
import RaBreadcrumb from "../../../../components/breadcrumb/RaBreadcrumb"
import RaCard from "../../../../components/card/RaCard"
import RaInput from "../../../../components/input/RaInput"
import RaButton from "../../../../components/button/RaButton"
import { useAccountStore } from "../../../../store/accountStore"

function Profile() {
  const fileRef = useRef<HTMLInputElement>(null)
  const { fullName, addressLine, city, district, avatarUrl, setProfile } = useAccountStore()

  const pickPhoto = (file: File | undefined) => {
    if (!file || !file.type.startsWith("image/")) {
      raToast.error("Choose an image file")
      return
    }
    const reader = new FileReader()
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setProfile({ avatarUrl: reader.result })
        raToast.success("Profile photo updated")
      }
    }
    reader.readAsDataURL(file)
  }

  return (
    <RaContainer>
      <RaContainerPadding>
        <div className="max-w-xl mx-auto flex flex-col gap-y-6 pb-32">
          <RaBreadcrumb items={[{ label: "Profile" }]} />
          <div>
            <div className="text-xl md:text-2xl font-bold">Profile</div>
            <div className="text-sm md:text-base font-light text-muted">
              This name and address are used on bookings, pickup, and KYC.
            </div>
          </div>

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
              <img src={avatarUrl} alt="" className="size-16 rounded-full object-cover" />
              <span className="absolute inset-0 rounded-full bg-black/40 flex items-center justify-center">
                <IoCameraOutline className="size-6 text-white" />
              </span>
            </button>
            <div className="min-w-0">
              <div className="font-semibold truncate">{fullName}</div>
              <button
                type="button"
                className="text-sm text-primary cursor-pointer"
                onClick={() => fileRef.current?.click()}
              >
                Change photo
              </button>
            </div>
          </RaCard>

          <form
            className="flex flex-col gap-y-4"
            onSubmit={(e) => {
              e.preventDefault()
              raToast.success("Profile saved")
            }}
          >
            <RaCard round="round" styleClass="flex flex-col gap-y-4">
              <RaInput
                name="fullName"
                label="Full name"
                placeholderText="Ram Rai"
                Icon={IoPersonOutline}
                value={fullName}
                onChange={(e) => setProfile({ fullName: e.target.value })}
              />
              <RaInput
                name="addressLine"
                label="Address"
                placeholderText="Street, tole, or house no."
                Icon={IoHomeOutline}
                value={addressLine}
                onChange={(e) => setProfile({ addressLine: e.target.value })}
              />
              <RaInput
                name="city"
                label="City / municipality"
                placeholderText="Kathmandu"
                Icon={IoLocationOutline}
                value={city}
                onChange={(e) => setProfile({ city: e.target.value })}
              />
              <RaInput
                name="district"
                label="District"
                placeholderText="Kathmandu"
                Icon={IoLocationOutline}
                value={district}
                onChange={(e) => setProfile({ district: e.target.value })}
              />
            </RaCard>
            <RaButton type="submit" btnText="Save profile" />
          </form>
        </div>
      </RaContainerPadding>
    </RaContainer>
  )
}

export default Profile
