import { useState } from "react"
import RaCard from "../../../components/card/RaCard"
import RaInput from "../../../components/input/RaInput"
import RaButton from "../../../components/button/RaButton"
import { useAdminStore } from "../../../store/adminStore"
import { useAuthStore } from "../../../store/authStore"
import { raToast } from "../../../lib/raToast"

function AdminSettings() {
  const role = useAuthStore((s) => s.role)
  const settings = useAdminStore((s) => s.settings)
  const saveSettings = useAdminStore((s) => s.saveSettings)
  const createAdmin = useAdminStore((s) => s.createAdmin)
  const [form, setForm] = useState(settings)
  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const isSuper = role === "SUPER_ADMIN"

  return (
    <div className="max-w-xl flex flex-col gap-6">
      <div>
        <div className="text-xl md:text-2xl font-bold">System settings</div>
        <div className="text-sm text-muted">Platform fees and global rental rules.</div>
      </div>

      <form
        className="flex flex-col gap-4"
        onSubmit={(e) => {
          e.preventDefault()
          saveSettings(form)
          raToast.success("Settings saved")
        }}
      >
        <RaCard round="round" styleClass="flex flex-col gap-4">
          <RaInput
            name="fee"
            label="Platform fee %"
            value={String(form.platformFeePercent)}
            onChange={(e) => setForm({ ...form, platformFeePercent: Number(e.target.value) || 0 })}
          />
          <RaInput
            name="commitment"
            label="Commitment fee (Nrs.)"
            value={String(form.commitmentFeeNrs)}
            onChange={(e) => setForm({ ...form, commitmentFeeNrs: Number(e.target.value) || 0 })}
          />
          <RaInput
            name="minDays"
            label="Minimum rental days"
            value={String(form.minRentalDays)}
            onChange={(e) => setForm({ ...form, minRentalDays: Number(e.target.value) || 1 })}
          />
          <RaInput
            name="maxDays"
            label="Maximum rental days"
            value={String(form.maxRentalDays)}
            onChange={(e) => setForm({ ...form, maxRentalDays: Number(e.target.value) || 1 })}
          />
          <label className="flex items-center gap-2 text-sm cursor-pointer">
            <input type="checkbox" checked={form.requireKycToList} onChange={(e) => setForm({ ...form, requireKycToList: e.target.checked })} />
            Require KYC to publish a listing
          </label>
          <label className="flex items-center gap-2 text-sm cursor-pointer">
            <input type="checkbox" checked={form.requireKycToRent} onChange={(e) => setForm({ ...form, requireKycToRent: e.target.checked })} />
            Require KYC to rent
          </label>
        </RaCard>
        <RaButton type="submit" btnText="Save settings" />
      </form>

      <RaCard round="round" styleClass="flex flex-col gap-4">
        <div>
          <div className="font-semibold">Create admin</div>
          <div className="text-sm text-muted">
            Public signup cannot create admins. Only a super admin can add staff here.
          </div>
        </div>
        {isSuper ? (
          <form
            className="flex flex-col gap-3"
            onSubmit={(e) => {
              e.preventDefault()
              if (!fullName.trim() || !email.includes("@")) {
                raToast.error("Enter a name and valid email")
                return
              }
              createAdmin({ fullName: fullName.trim(), email: email.trim(), phone: phone.trim() || "—" })
              setFullName("")
              setEmail("")
              setPhone("")
              raToast.success("Admin account created")
            }}
          >
            <RaInput name="adminName" label="Full name" value={fullName} onChange={(e) => setFullName(e.target.value)} placeholderText="Staff name" />
            <RaInput type="email" name="adminEmail" label="Email" value={email} onChange={(e) => setEmail(e.target.value)} placeholderText="staff@rap.np" />
            <RaInput name="adminPhone" label="Phone" value={phone} onChange={(e) => setPhone(e.target.value)} placeholderText="9800000000" />
            <RaButton type="submit" btnText="Create admin" />
          </form>
        ) : (
          <div className="text-sm text-muted">You need super admin access to add staff.</div>
        )}
      </RaCard>
    </div>
  )
}

export default AdminSettings
