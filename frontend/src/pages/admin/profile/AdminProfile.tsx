import { IoHomeOutline, IoLocationOutline, IoMailOutline, IoPersonOutline, IoShieldCheckmarkOutline } from "react-icons/io5"
import RaCard from "../../../components/card/RaCard"
import RaInput from "../../../components/input/RaInput"
import { useAdminStore } from "../../../store/adminStore"
import { useAuthStore } from "../../../store/authStore"
import { profile01 } from "../../../utils/images"

function AdminProfile() {
  const userId = useAuthStore((s) => s.userId)
  const role = useAuthStore((s) => s.role)
  const users = useAdminStore((s) => s.users)
  const me = users.find((u) => u.id === userId)

  if (!me) {
    return <div className="text-muted">Signed-in admin profile was not found.</div>
  }

  return (
    <div className="max-w-xl flex flex-col gap-6">
      <div>
        <div className="text-xl md:text-2xl font-bold">Profile</div>
        <div className="text-sm text-muted">View-only staff profile. Contact a super admin to change these details.</div>
      </div>

      <RaCard round="round" styleClass="flex items-center gap-4 p-4!">
        <img src={profile01} alt="" className="size-16 rounded-full object-cover" />
        <div className="min-w-0">
          <div className="font-semibold truncate">{me.fullName}</div>
          <div className="text-sm text-muted">{role === "SUPER_ADMIN" ? "Super admin" : "Admin"}</div>
        </div>
      </RaCard>

      <RaCard round="round" styleClass="flex flex-col gap-y-4">
        <RaInput name="fullName" label="Full name" Icon={IoPersonOutline} value={me.fullName} disabled />
        <RaInput name="email" label="Email" Icon={IoMailOutline} value={me.email} disabled />
        <RaInput name="phone" label="Phone" Icon={IoPersonOutline} value={me.phone} disabled />
        <RaInput name="role" label="Role" Icon={IoShieldCheckmarkOutline} value={role === "SUPER_ADMIN" ? "Super admin" : "Admin"} disabled />
        <RaInput name="addressLine" label="Address" Icon={IoHomeOutline} value={me.addressLine} disabled />
        <RaInput name="city" label="City / municipality" Icon={IoLocationOutline} value={me.city} disabled />
        <RaInput name="district" label="District" Icon={IoLocationOutline} value={me.district} disabled />
      </RaCard>
    </div>
  )
}

export default AdminProfile
