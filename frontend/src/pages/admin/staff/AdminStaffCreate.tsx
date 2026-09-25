import { useState } from "react"
import { Link, Navigate, useNavigate } from "react-router-dom"
import { IoArrowBackOutline, IoCallOutline, IoLockClosedOutline, IoMailOutline, IoPersonAddOutline, IoPersonOutline } from "react-icons/io5"
import RaCard from "../../../components/card/RaCard"
import RaButton from "../../../components/button/RaButton"
import RaInput from "../../../components/input/RaInput"
import AdminPageHeader from "../../../components/admin/AdminPageHeader"
import { useAuthStore } from "../../../store/authStore"
import { raToast } from "../../../lib/raToast"
import { apiErrorMessage } from "../../../lib/formErrors"
import { useCreateAdminAccount } from "../../../hooks/queries/useAdmin"

function passwordError(password: string) {
  if (password.length < 8) return "Use at least 8 characters"
  if (!/[A-Z]/.test(password) || !/[0-9]/.test(password) || !/[^a-zA-Z0-9]/.test(password)) {
    return "Include an uppercase letter, a number, and a special character"
  }
  return ""
}

function AdminStaffCreate() {
  const navigate = useNavigate()
  const role = useAuthStore((s) => s.role)
  const createAdmin = useCreateAdminAccount()
  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [password, setPassword] = useState("")
  const [errors, setErrors] = useState<Record<string, string>>({})

  if (role !== "SUPER_ADMIN") {
    return <Navigate to="/admin/settings" replace />
  }

  return (
    <div className="max-w-xl flex flex-col gap-6">
      <Link to="/admin/staff" className="flex items-center gap-1 text-sm text-muted">
        <IoArrowBackOutline className="size-4" /> Admins
      </Link>
      <AdminPageHeader
        icon={IoPersonAddOutline}
        title="Add admin"
        subtitle="They can sign in at /admin with this email and password."
      />
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
            const created = await createAdmin.mutateAsync({
              fullName: fullName.trim(),
              email: email.trim(),
              password,
              phone: phone.trim() || undefined,
            })
            raToast.success("Admin account created")
            navigate(`/admin/staff/${created.id}`)
          } catch (error) {
            raToast.error(apiErrorMessage(error))
          }
        }}
      >
        <RaCard round="round" styleClass="flex flex-col gap-3">
          <RaInput name="fullName" label="Full name" Icon={IoPersonOutline} value={fullName} error={errors.fullName} onChange={(e) => { setFullName(e.target.value); setErrors((p) => ({ ...p, fullName: "" })) }} placeholderText="Staff name" />
          <RaInput type="email" name="email" label="Email" Icon={IoMailOutline} value={email} error={errors.email} onChange={(e) => { setEmail(e.target.value); setErrors((p) => ({ ...p, email: "" })) }} placeholderText="staff@rap.np" />
          <RaInput type="password" name="password" label="Temporary password" Icon={IoLockClosedOutline} value={password} error={errors.password} onChange={(e) => { setPassword(e.target.value); setErrors((p) => ({ ...p, password: "" })) }} placeholderText="At least 8 characters" />
          <RaInput name="phone" label="Phone" Icon={IoCallOutline} value={phone} onChange={(e) => setPhone(e.target.value)} placeholderText="9800000000" />
          <RaButton type="submit" btnText="Create admin" icon={<IoPersonAddOutline />} iconPosition="left" />
        </RaCard>
      </form>
    </div>
  )
}

export default AdminStaffCreate
