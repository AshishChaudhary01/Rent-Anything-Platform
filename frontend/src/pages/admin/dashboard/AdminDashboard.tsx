import { useMemo, useState } from "react"
import { Link } from "react-router-dom"
import {
  IoAlertCircleOutline,
  IoBagHandleOutline,
  IoCashOutline,
  IoCheckmarkCircleOutline,
  IoDownloadOutline,
  IoIdCardOutline,
  IoGridOutline,
  IoPeopleOutline,
  IoSwapHorizontalOutline,
} from "react-icons/io5"
import RaCard from "../../../components/card/RaCard"
import RaButton from "../../../components/button/RaButton"
import {
  DASHBOARD_RANGES,
  csvFileStamp,
  downloadCsv,
  formatCsvInstant,
  inDashboardRange,
  type DashboardRangeId,
} from "../../../components/admin/adminUi"
import AdminPageHeader, { AdminSectionTitle } from "../../../components/admin/AdminPageHeader"
import { raToast } from "../../../lib/raToast"
import type { AdminRental } from "../../../services/admin.service"
import { useAdminKyc, useAdminListings, useAdminRentals, useAdminReports, useAdminUsers } from "../../../hooks/queries/useAdmin"

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
      const hour = new Date(rental.createdAt || `${rental.startDate}T12:00:00`).getHours()
      const slot = hour < 6 ? 3 : hour < 12 ? 0 : hour < 17 ? 1 : hour < 21 ? 2 : 3
      slots[slot].amount += rental.platformFee
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
  const { data: users = [], isPending: usersPending } = useAdminUsers()
  const { data: listings = [], isPending: listingsPending } = useAdminListings()
  const { data: rentals = [], isPending: rentalsPending } = useAdminRentals()
  const { data: reports = [], isPending: reportsPending } = useAdminReports()
  const { data: kycCases = [], isPending: kycPending } = useAdminKyc()
  const [range, setRange] = useState<DashboardRangeId>("30d")
  const selected = DASHBOARD_RANGES.find((item) => item.id === range) ?? DASHBOARD_RANGES[2]
  const asOf = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Kathmandu",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date())

  const scoped = useMemo(() => {
    const days = selected.days
    const platformUsers = users.filter((u) => u.role === "USER" && inDashboardRange(u.joinedAt, days, asOf))
    const periodListings = listings.filter((l) => inDashboardRange(l.createdAt, days, asOf))
    const periodRentals = rentals.filter((r) => inDashboardRange(r.startDate, days, asOf))
    const periodReports = reports.filter((r) => inDashboardRange(r.openedAt, days, asOf))
    const periodKyc = kycCases.filter((k) => inDashboardRange(k.joinedAt, days, asOf))
    const completed = periodRentals.filter((r) => r.status === "Completed")
    const revenue = periodRentals.filter(paid).reduce((sum, r) => sum + r.platformFee, 0)
    return {
      platformUsers,
      periodListings,
      periodRentals,
      periodReports,
      pendingReports: periodReports.filter((r) => r.status === "Pending"),
      pendingKyc: periodKyc.filter((k) => k.kycStatus === "Pending"),
      gmv: completed.reduce((sum, r) => sum + r.amount, 0),
      revenue,
      activeRentals: periodRentals.filter((r) => r.status === "Active").length,
      chart: chartBuckets(range, asOf, periodRentals),
    }
  }, [users, listings, rentals, reports, kycCases, selected, range, asOf])

  if (usersPending || listingsPending || rentalsPending || reportsPending || kycPending) {
    return <div className="text-sm text-muted">Loading dashboard…</div>
  }

  const maxBar = Math.max(...scoped.chart.map((m) => m.amount), 1)
  const windowLabel = selected.days == null ? "all time" : `last ${selected.label}`
  const periodStart = selected.days == null ? "beginning" : addDays(asOf, -(selected.days - 1)).toISOString().slice(0, 10)
  const periodLabel = selected.days == null
    ? "All time through " + asOf
    : `${periodStart} to ${asOf} (${windowLabel})`
  const stamp = csvFileStamp()
  const csvMeta = (title: string, extra?: string[]) => ({
    title,
    period: periodLabel,
    extra: [
      "Platform,Rent Anything Platform (RAP)",
      `Exported by,Admin dashboard`,
      ...(extra ?? []),
    ],
  })

  const exportRevenue = () => {
    downloadCsv(
      `rap-revenue-${stamp}-${range}.csv`,
      scoped.chart.map((m) => ({
        period_label: m.label,
        platform_fee_nrs: m.amount,
        currency: "NPR",
        dashboard_range: selected.label,
        report_window: periodLabel,
      })),
      csvMeta("RAP platform fee report", [`Total platform fee NPR,${scoped.revenue}`]),
    )
    raToast.success("Revenue report downloaded")
  }
  const exportRentals = () => {
    downloadCsv(
      `rap-rentals-${stamp}-${range}.csv`,
      scoped.periodRentals.map((r) => ({
        rental_id: r.id,
        listing_title: r.listingTitle,
        listing_id: r.listingId,
        owner_name: r.ownerName,
        owner_id: r.ownerId,
        renter_name: r.renterName,
        renter_id: r.renterId,
        start_date: r.startDate,
        end_date: r.endDate,
        created_at: formatCsvInstant(r.createdAt),
        amount_nrs: r.amount,
        platform_fee_nrs: r.platformFee,
        currency: "NPR",
        status: r.status,
      })),
      csvMeta("RAP rentals report", [`Rental count,${scoped.periodRentals.length}`, `Completed volume NPR,${scoped.gmv}`]),
    )
    raToast.success("Rentals report downloaded")
  }
  const exportUsers = () => {
    downloadCsv(
      `rap-users-${stamp}-${range}.csv`,
      scoped.platformUsers.map((u) => ({
        user_id: u.id,
        full_name: u.fullName,
        email: u.email,
        phone: u.phone,
        account_status: u.status,
        kyc_status: u.kycStatus,
        city: u.city,
        district: u.district,
        location: u.location,
        joined_date: u.joinedAt,
        joined_at: formatCsvInstant(u.joinedAt),
      })),
      csvMeta("RAP new users report", [`User count,${scoped.platformUsers.length}`]),
    )
    raToast.success("Users report downloaded")
  }
  const exportListings = () => {
    downloadCsv(
      `rap-listings-${stamp}-${range}.csv`,
      scoped.periodListings.map((l) => ({
        listing_id: l.id,
        title: l.title,
        owner_name: l.ownerName,
        owner_id: l.ownerId,
        category: l.category,
        location: l.location,
        daily_rate_nrs: l.rate,
        deposit_nrs: l.deposit,
        currency: "NPR",
        status: l.status,
        listed_on: l.createdAt,
        listed_at: formatCsvInstant(l.createdAt),
      })),
      csvMeta("RAP listings report", [`Listing count,${scoped.periodListings.length}`]),
    )
    raToast.success("Listings report downloaded")
  }
  const exportReports = () => {
    downloadCsv(
      `rap-reports-${stamp}-${range}.csv`,
      scoped.periodReports.map((r) => ({
        report_id: r.id,
        reason: r.reason,
        listing: r.listingTitle,
        listing_id: r.listingId ?? "",
        reporter: r.reporterName,
        accused: r.accusedName,
        status: r.status,
        opened_at: formatCsvInstant(r.createdAt),
        resolved_at: formatCsvInstant(r.resolvedAt),
        resolver_name: r.resolverName ?? "",
        resolver_role: r.resolverRole ?? "",
        resolver_email: r.resolverEmail ?? "",
        resolution_action: r.resolutionAction ?? "",
        resolution_notes: r.resolutionNotes ?? "",
      })),
      csvMeta("RAP disputes report", [
        `Report count,${scoped.periodReports.length}`,
        `Pending in window,${scoped.pendingReports.length}`,
      ]),
    )
    raToast.success("Disputes report downloaded")
  }

  return (
    <div className="flex flex-col gap-6 max-w-6xl">
      <AdminPageHeader
        icon={IoGridOutline}
        title="Dashboard"
        subtitle={`Overview for ${windowLabel}.`}
        actions={DASHBOARD_RANGES.map((item) => (
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
      />

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
          <AdminSectionTitle icon={IoCashOutline}>Platform fee</AdminSectionTitle>
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
          <div className="text-sm text-muted">CSV for {windowLabel}, stamped with Nepal time when you download.</div>
          <RaButton type="button" btnText="Revenue" variant="outline" size="sm" clickFunc={exportRevenue} />
          <RaButton type="button" btnText="Rentals" variant="outline" size="sm" clickFunc={exportRentals} />
          <RaButton type="button" btnText="Users" variant="outline" size="sm" clickFunc={exportUsers} />
          <RaButton type="button" btnText="Listings" variant="outline" size="sm" clickFunc={exportListings} />
          <RaButton type="button" btnText="Reports" variant="outline" size="sm" clickFunc={exportReports} />
        </RaCard>
      </div>

      <RaCard round="round" styleClass="p-4!">
        <div className="mb-3">
          <AdminSectionTitle icon={IoAlertCircleOutline}>Open reports in this period</AdminSectionTitle>
        </div>
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
