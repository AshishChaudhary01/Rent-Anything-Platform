import { useEffect, useState } from "react"
import { Link, Navigate, useNavigate, useParams } from "react-router-dom"
import { IoArrowBackOutline, IoBanOutline, IoCallOutline, IoLockClosedOutline, IoMailOutline, IoPersonOutline, IoRefreshOutline, IoTrashOutline, IoSaveOutline } from "react-icons/io5"
import RaCard from "../../../components/card/RaCard"
import RaButton from "../../../components/button/RaButton"
import RaInput from "../../../components/input/RaInput"
import { statusClass } from "../../../components/admin/adminUi"
import { AdminSectionTitle } from "../../../components/admin/AdminPageHeader"
import { profile01 } from "../../../utils/images"
import { useAuthStore } from "../../../store/authStore"
import { raToast } from "../../../lib/raToast"
import { apiErrorMessage } from "../../../lib/formErrors"
import { useAdminStaffMember, useDeleteAdminAccount, useSetAdminStaffStatus, useUpdateAdminAccount } from "../../../hooks/queries/useAdmin"

function passwordError(password: string) {
  if (!password) return ""
  if (password.length < 8) return "Use at least 8 characters"
  if (!/[A-Z]/.test(password) || !/[0-9]/.test(password) || !/[^a-zA-Z0-9]/.test(password)) {
    return "Include an uppercase letter, a number, and a special character"
  }
  return ""
}

function AdminStaffDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const role = useAuthStore((s) => s.role)
  const { data: admin, isPending } = useAdminStaffMember(id)
  const updateAdmin = useUpdateAdminAccount()
  const setStatus = useSetAdminStaffStatus()
  const removeAdmin = useDeleteAdminAccount()
  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [password, setPassword] = useState("")
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (!admin) return
    setFullName(admin.fullName)
    setEmail(admin.email)
    setPhone(admin.phone)
  }, [admin])

  if (role !== "SUPER_ADMIN") {
    return <Navigate to="/admin/settings" replace />
  }

  if (isPending) {
    return <div className="text-muted">Loading admin…</div>
  }

  if (!admin) {
    return <div className="text-muted">Admin not found. <Link to="/admin/staff" className="text-primary">Back</Link></div>
  }

  const changeStatus = async (status: string, message: string) => {
    try {
      await setStatus.mutateAsync({ id: admin.id, status })
      raToast.success(message)
    } catch (error) {
      raToast.error(apiErrorMessage(error))
    }
  }

  return (
    <div className="max-w-xl flex flex-col gap-6">
      <Link to="/admin/staff" className="flex items-center gap-1 text-sm text-muted">
        <IoArrowBackOutline className="size-4" /> Admins
      </Link>
      <RaCard round="round" styleClass="p-4! flex items-center gap-4">
        <img src={admin.avatarUrl || profile01} alt="" className="size-16 rounded-full object-cover" />
        <div className="min-w-0 flex-1">
          <div className="font-bold text-lg">{admin.fullName}</div>
          <div className="text-sm text-muted">{admin.email}</div>
          <div className="text-sm text-muted">Joined {admin.joined}</div>
        </div>
        <span className={`text-xs font-semibold px-2 py-1 rounded-full ${statusClass(admin.status === "Active" ? "Active" : "Disabled")}`}>{admin.status === "Active" ? "Active" : "Disabled"}</span>
      </RaCard>

      <form
        className="flex flex-col gap-3"
        onSubmit={async (e) => {
          e.preventDefault()
          const next: Record<string, string> = {}
          if (!fullName.trim()) next.fullName = "Full name is required"
          if (!email.includes("@")) next.email = "Enter a valid email"
          const pwd = passwordError(password)
          if (pwd) next.password = pwd
          if (Object.keys(next).length) {
            setErrors(next)
            return
          }
          try {
            await updateAdmin.mutateAsync({
              id: admin.id,
              payload: {
                fullName: fullName.trim(),
                email: email.trim(),
                phone: phone.trim() || undefined,
                password: password || undefined,
              },
            })
            setPassword("")
            setErrors({})
            raToast.success("Admin updated")
          } catch (error) {
            raToast.error(apiErrorMessage(error))
          }
        }}
      >
        <RaCard round="round" styleClass="flex flex-col gap-3">
          <AdminSectionTitle icon={IoPersonOutline}>Edit profile</AdminSectionTitle>
          <RaInput name="fullName" label="Full name" Icon={IoPersonOutline} value={fullName} error={errors.fullName} onChange={(e) => { setFullName(e.target.value); setErrors((p) => ({ ...p, fullName: "" })) }} />
          <RaInput type="email" name="email" label="Email" Icon={IoMailOutline} value={email} error={errors.email} onChange={(e) => { setEmail(e.target.value); setErrors((p) => ({ ...p, email: "" })) }} />
          <RaInput name="phone" label="Phone" Icon={IoCallOutline} value={phone} onChange={(e) => setPhone(e.target.value)} />
          <RaInput type="password" name="password" label="New password (optional)" Icon={IoLockClosedOutline} value={password} error={errors.password} onChange={(e) => { setPassword(e.target.value); setErrors((p) => ({ ...p, password: "" })) }} placeholderText="Leave blank to keep current" />
          <RaButton type="submit" btnText="Save changes" icon={<IoSaveOutline />} iconPosition="left" />
        </RaCard>
      </form>

      <div className="flex flex-wrap gap-2">
        {admin.status === "Active" ? (
          <RaButton
            type="button"
            btnText="Disable"
            variant="outline"
            icon={<IoBanOutline />}
            iconPosition="left"
            clickFunc={() => void changeStatus("Banned", `${admin.fullName} disabled`)}
          />
        ) : (
          <RaButton
            type="button"
            btnText="Restore"
            variant="outline"
            icon={<IoRefreshOutline />}
            iconPosition="left"
            clickFunc={() => void changeStatus("Active", "Admin restored")}
          />
        )}
        <RaButton
          type="button"
          btnText="Delete admin"
          variant="danger"
          icon={<IoTrashOutline />}
          iconPosition="left"
          clickFunc={async () => {
            if (!window.confirm(`Delete ${admin.fullName}? This cannot be undone.`)) return
            try {
              await removeAdmin.mutateAsync(admin.id)
              raToast.success("Admin deleted")
              navigate("/admin/staff")
            } catch (error) {
              raToast.error(apiErrorMessage(error))
            }
          }}
        />
      </div>
    </div>
  )
}

export default AdminStaffDetails
