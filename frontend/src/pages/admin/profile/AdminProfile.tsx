import { IoHomeOutline, IoLocationOutline, IoMailOutline, IoPersonOutline, IoShieldCheckmarkOutline } from "react-icons/io5"
import RaCard from "../../../components/card/RaCard"
import RaInput from "../../../components/input/RaInput"
import { useAuthStore } from "../../../store/authStore"
import { useAccountStore } from "../../../store/accountStore"

function AdminProfile() {
  const role = useAuthStore((s) => s.role)
  const { fullName, email, phone, addressLine, city, district, avatarUrl } = useAccountStore()

  return (
    <div className="max-w-xl flex flex-col gap-6">
      <div>
        <div className="text-xl md:text-2xl font-bold">Profile</div>
        <div className="text-sm text-muted">View-only staff profile. Contact a super admin to change these details.</div>
      </div>

      <RaCard round="round" styleClass="flex items-center gap-4 p-4!">
        <img
          src={avatarUrl || "https://ui-avatars.com/api/?name=Admin"}
          alt=""
          className="size-16 rounded-full object-cover"
        />
        <div className="min-w-0">
          <div className="font-semibold truncate">{fullName || "Admin"}</div>
          <div className="text-sm text-muted">{role === "SUPER_ADMIN" ? "Super admin" : "Admin"}</div>
        </div>
      </RaCard>

      <RaCard round="round" styleClass="flex flex-col gap-y-4">
        <RaInput name="fullName" label="Full name" Icon={IoPersonOutline} value={fullName} disabled />
        <RaInput name="email" label="Email" Icon={IoMailOutline} value={email} disabled />
        <RaInput name="phone" label="Phone" Icon={IoPersonOutline} value={phone} disabled />
        <RaInput name="role" label="Role" Icon={IoShieldCheckmarkOutline} value={role === "SUPER_ADMIN" ? "Super admin" : "Admin"} disabled />
        <RaInput name="addressLine" label="Address" Icon={IoHomeOutline} value={addressLine} disabled />
        <RaInput name="city" label="City / municipality" Icon={IoLocationOutline} value={city} disabled />
        <RaInput name="district" label="District" Icon={IoLocationOutline} value={district} disabled />
      </RaCard>
    </div>
  )
}

export default AdminProfile
