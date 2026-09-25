import { Link } from "react-router-dom"
import { IoCashOutline, IoIdCardOutline, IoSettingsOutline, IoShieldOutline } from "react-icons/io5"
import RaCard from "../../../components/card/RaCard"
import AdminPageHeader, { AdminSectionTitle } from "../../../components/admin/AdminPageHeader"
import { useAuthStore } from "../../../store/authStore"
import { useAdminOverview } from "../../../hooks/queries/useAdmin"
import RaPageLoader from "../../../components/feedback/RaPageLoader"

function Rule({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: string }) {
  return (
    <div className="flex justify-between gap-3 items-center">
      <span className="text-muted flex items-center gap-2">
        <Icon className="size-4 text-primary shrink-0" />
        {label}
      </span>
      <span className="font-medium">{value}</span>
    </div>
  )
}

function AdminSettings() {
  const role = useAuthStore((s) => s.role)
  const { data: overview, isPending } = useAdminOverview()
  const isSuper = role === "SUPER_ADMIN"
  const feePercent = overview ? Math.round(overview.commissionPercent * 1000) / 10 : 8

  return (
    <div className="max-w-xl flex flex-col gap-6">
      <AdminPageHeader
        icon={IoSettingsOutline}
        title="System settings"
        subtitle="Platform rules are fixed. Super admins manage staff from Admins."
      />

      <RaCard round="round" styleClass="flex flex-col gap-3 text-sm">
        {isPending || !overview ? (
          <RaPageLoader label="Loading rules…" />
        ) : (
          <>
            <Rule icon={IoCashOutline} label="Platform commission" value={`${feePercent}%`} />
            <Rule icon={IoCashOutline} label="Commitment fee" value={`Nrs. ${overview.commitmentFee}`} />
            <Rule icon={IoIdCardOutline} label="KYC for listings and rentals" value="Always required" />
            <p className="text-muted pt-1">
              Commission and KYC cannot be turned off from the dashboard. Only verified members can list items or send rental requests.
            </p>
          </>
        )}
      </RaCard>

      <RaCard round="round" styleClass="flex flex-col gap-3">
        <AdminSectionTitle icon={IoShieldOutline}>Staff accounts</AdminSectionTitle>
        {isSuper ? (
          <>
            <p className="text-sm text-muted">Add, edit, disable, or delete admin accounts from the Admins module.</p>
            <Link to="/admin/staff" className="text-sm font-semibold text-primary">Manage admins</Link>
          </>
        ) : (
          <div className="text-sm text-muted">Only a super admin can create or manage staff accounts.</div>
        )}
      </RaCard>
    </div>
  )
}

export default AdminSettings
