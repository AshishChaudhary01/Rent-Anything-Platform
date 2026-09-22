import { useMemo, useState } from "react"
import { Link } from "react-router-dom"
import {
  IoAlertCircleOutline,
  IoBagHandleOutline,
  IoCashOutline,
  IoCheckmarkCircleOutline,
  IoDownloadOutline,
  IoIdCardOutline,
  IoPeopleOutline,
  IoSwapHorizontalOutline,
} from "react-icons/io5"
import RaCard from "../../../components/card/RaCard"
import RaButton from "../../../components/button/RaButton"
import { useAdminStore } from "../../../store/adminStore"
import {
  DASHBOARD_RANGES,
  ADMIN_AS_OF,
  downloadCsv,
  inDashboardRange,
  type DashboardRangeId,
} from "../../../components/admin/adminUi"
import { raToast } from "../../../lib/raToast"
import type { AdminRental } from "../../../data/admin"

function Stat({
  label,
  value,
  to,
  icon: Icon,
}: {
  label: string
  value: string | number
  to?: string
  icon: React.ElementType
}) {
  const inner = (
    <RaCard round="round" styleClass={`p-4! flex items-center gap-4 ${to ? "hover:shadow-md transition" : ""}`}>
      <div className="size-12 rounded-2xl bg-primary/10 flex items-center justify-center">
        <Icon className="size-6 text-primary" />
      </div>
      <div>
        <div className="text-sm text-muted">{label}</div>
        <div className="text-2xl font-bold">{value}</div>
      </div>
    </RaCard>
  )
  return to ? <Link to={to}>{inner}</Link> : inner
}

function paid(rental: AdminRental) {
  return rental.status !== "Cancelled" && rental.status !== "Failed"
}

function addDays(iso: string, days: number) {
  const d = new Date(`${iso}T12:00:00`)
  d.setDate(d.getDate() + days)
  return d
}

function labelDay(d: Date) {
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "short" })
}

function labelMonth(d: Date) {
  return d.toLocaleDateString("en-GB", { month: "short" })
}

function chartBuckets(range: DashboardRangeId, asOf: string, rentals: AdminRental[]) {
  const rows = rentals.filter(paid)
  if (range === "1d") {
    const slots = [
      { label: "Morning", amount: 0 },
      { label: "Afternoon", amount: 0 },
      { label: "Evening", amount: 0 },
      { label: "Night", amount: 0 },
    ]
    rows.forEach((rental) => {
      slots[Number(rental.id.replace(/\D/g, "")) % 4].amount += rental.platformFee
    })
    return slots
  }
  if (range === "7d") {
    return Array.from({ length: 7 }, (_, i) => {
      const day = addDays(asOf, i - 6)
      const key = day.toISOString().slice(0, 10)
      return {
        label: labelDay(day),
        amount: rows.filter((r) => r.startDate === key).reduce((sum, r) => sum + r.platformFee, 0),
      }
    })
  }
  if (range === "30d") {
    return Array.from({ length: 6 }, (_, i) => {
      const start = addDays(asOf, -29 + i * 5)
      const end = addDays(asOf, -29 + (i + 1) * 5 - 1)
      return {
        label: labelDay(start),
        amount: rows
          .filter((r) => r.startDate >= start.toISOString().slice(0, 10) && r.startDate <= end.toISOString().slice(0, 10))
          .reduce((sum, r) => sum + r.platformFee, 0),
      }
    })
  }
  const months = range === "3m" ? 3 : 6
  return Array.from({ length: months }, (_, i) => {
    const d = addDays(asOf, 0)
    d.setMonth(d.getMonth() - (months - 1 - i))
    const prefix = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`
    return {
      label: labelMonth(d),
      amount: rows.filter((r) => r.startDate.startsWith(prefix)).reduce((sum, r) => sum + r.platformFee, 0),
    }
  })
}

function AdminDashboard() {
  const users = useAdminStore((s) => s.users)
  const listings = useAdminStore((s) => s.listings)
  const rentals = useAdminStore((s) => s.rentals)
  const reports = useAdminStore((s) => s.reports)
  const kycCases = useAdminStore((s) => s.kycCases)
  const [range, setRange] = useState<DashboardRangeId>("30d")
  const selected = DASHBOARD_RANGES.find((item) => item.id === range) ?? DASHBOARD_RANGES[2]

  const scoped = useMemo(() => {
    const days = selected.days
    const platformUsers = users.filter((u) => u.role === "USER" && inDashboardRange(u.joinedAt, days))
    const periodListings = listings.filter((l) => inDashboardRange(l.createdAt, days))
    const periodRentals = rentals.filter((r) => inDashboardRange(r.startDate, days))
    const periodReports = reports.filter((r) => inDashboardRange(r.openedAt, days))
    const periodKyc = kycCases.filter((k) => inDashboardRange(k.submittedAt, days))
    const completed = periodRentals.filter((r) => r.status === "Completed")
    const revenue = periodRentals.filter(paid).reduce((sum, r) => sum + r.platformFee, 0)
    return {
      platformUsers,
      periodListings,
      periodRentals,
      periodReports,
      pendingReports: periodReports.filter((r) => r.status === "Pending"),
      pendingKyc: periodKyc.filter((k) => k.status === "Pending"),
      gmv: completed.reduce((sum, r) => sum + r.amount, 0),
      revenue,
      activeRentals: periodRentals.filter((r) => r.status === "Active").length,
      chart: chartBuckets(range, ADMIN_AS_OF, periodRentals),
    }
  }, [users, listings, rentals, reports, kycCases, selected, range])

  const maxBar = Math.max(...scoped.chart.map((m) => m.amount), 1)
  const windowLabel = selected.days == null ? "all time" : `last ${selected.label}`

  const exportRevenue = () => {
    downloadCsv(`rap-revenue-${range}.csv`, scoped.chart.map((m) => ({ period: m.label, platform_fee_nrs: m.amount })))
    raToast.success("Revenue report downloaded")
  }
  const exportRentals = () => {
    downloadCsv(`rap-rentals-${range}.csv`, scoped.periodRentals.map((r) => ({
      id: r.id, listing: r.listingTitle, owner: r.ownerName, renter: r.renterName, amount: r.amount, fee: r.platformFee, status: r.status,
    })))
    raToast.success("Rentals report downloaded")
  }
  const exportUsers = () => {
    downloadCsv(`rap-users-${range}.csv`, scoped.platformUsers.map((u) => ({
      id: u.id, name: u.fullName, email: u.email, phone: u.phone, status: u.status, kyc: u.kycStatus, location: u.location,
    })))
    raToast.success("Users report downloaded")
  }
  const exportListings = () => {
    downloadCsv(`rap-listings-${range}.csv`, scoped.periodListings.map((l) => ({
      id: l.id, title: l.title, owner: l.ownerName, rate: l.rate, status: l.status, location: l.location,
    })))
    raToast.success("Listings report downloaded")
  }
  const exportReports = () => {
    downloadCsv(`rap-reports-${range}.csv`, scoped.periodReports.map((r) => ({
      id: r.id, reason: r.reason, listing: r.listingTitle, reporter: r.reporterName, accused: r.accusedName, status: r.status, resolver: r.resolution?.resolverName ?? "",
    })))
    raToast.success("Disputes report downloaded")
  }

  return (
    <div className="flex flex-col gap-6 max-w-6xl">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3">
        <div>
          <div className="text-xl md:text-2xl font-bold">Dashboard</div>
          <div className="text-sm md:text-base font-light text-muted">Overview for {windowLabel}.</div>
        </div>
        <div className="flex flex-wrap gap-2">
          {DASHBOARD_RANGES.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setRange(item.id)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium cursor-pointer ${
                range === item.id ? "bg-primary text-white" : "bg-surface text-muted border border-gray-200"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        <Stat label="Earned revenue" value={`Nrs. ${scoped.revenue.toLocaleString()}`} icon={IoCashOutline} />
        <Stat label="Completed volume" value={`Nrs. ${scoped.gmv.toLocaleString()}`} to="/admin/rentals?status=Completed" icon={IoCheckmarkCircleOutline} />
        <Stat label="New users" value={scoped.platformUsers.length} to="/admin/users" icon={IoPeopleOutline} />
        <Stat label="New listings" value={scoped.periodListings.length} to="/admin/listings" icon={IoBagHandleOutline} />
        <Stat label="Active rentals" value={scoped.activeRentals} to="/admin/rentals?status=Active" icon={IoSwapHorizontalOutline} />
        <Stat label="Reports opened" value={scoped.periodReports.length} to="/admin/reports" icon={IoAlertCircleOutline} />
        <Stat label="Pending KYC" value={scoped.pendingKyc.length} to="/admin/kyc?status=Pending" icon={IoIdCardOutline} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <RaCard round="round" styleClass="p-4! lg:col-span-2">
          <div className="font-semibold mb-1">Platform fee</div>
          <div className="text-sm text-muted mb-4">Commission in this window.</div>
          <div className="flex items-end gap-3 h-44">
            {scoped.chart.map((m) => (
              <div key={m.label} className="flex-1 flex flex-col items-center gap-2 h-full justify-end min-w-0">
                <div className="text-xs text-muted">{m.amount.toLocaleString()}</div>
                <div
                  className="w-full rounded-t-lg bg-primary/80"
                  style={{ height: `${Math.max(8, (m.amount / maxBar) * 100)}%` }}
                />
                <div className="text-xs font-medium truncate w-full text-center">{m.label}</div>
              </div>
            ))}
          </div>
        </RaCard>
        <RaCard round="round" styleClass="p-4! flex flex-col gap-3">
          <div className="flex items-center gap-2 font-semibold">
            <IoDownloadOutline className="size-5 text-primary" />
            Download reports
          </div>
          <div className="text-sm text-muted">CSV for {windowLabel}.</div>
          <RaButton type="button" btnText="Revenue" variant="outline" size="sm" clickFunc={exportRevenue} />
          <RaButton type="button" btnText="Rentals" variant="outline" size="sm" clickFunc={exportRentals} />
          <RaButton type="button" btnText="Users" variant="outline" size="sm" clickFunc={exportUsers} />
          <RaButton type="button" btnText="Listings" variant="outline" size="sm" clickFunc={exportListings} />
          <RaButton type="button" btnText="Reports" variant="outline" size="sm" clickFunc={exportReports} />
        </RaCard>
      </div>

      <RaCard round="round" styleClass="p-4!">
        <div className="font-semibold mb-3">Open reports in this period</div>
        {scoped.pendingReports.length === 0 ? (
          <div className="text-sm text-muted">No pending reports in this window.</div>
        ) : (
          <div className="flex flex-col divide-y divide-gray-100">
            {scoped.pendingReports.map((report) => (
              <Link key={report.id} to={`/admin/reports/${report.id}`} className="py-3 flex justify-between gap-3 hover:text-primary">
                <div className="min-w-0">
                  <div className="font-medium truncate">{report.reason}</div>
                  <div className="text-sm text-muted truncate">{report.id} · {report.listingTitle} · {report.opened}</div>
                </div>
                <span className="text-sm shrink-0">{report.id}</span>
              </Link>
            ))}
          </div>
        )}
      </RaCard>
    </div>
  )
}

export default AdminDashboard
