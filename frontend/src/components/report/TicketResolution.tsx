import { formatNptDateTime, staffRoleLabel } from "../admin/adminUi"
import {
  IoCalendarOutline,
  IoCheckmarkCircleOutline,
  IoDocumentTextOutline,
  IoFlagOutline,
  IoMailOutline,
  IoPersonOutline,
  IoShieldOutline,
  IoTimeOutline,
} from "react-icons/io5"

function Row({
  icon: Icon,
  label,
  children,
}: {
  icon: React.ElementType
  label: string
  children: React.ReactNode
}) {
  return (
    <div className="flex justify-between gap-3 text-sm items-start">
      <span className="text-muted shrink-0 flex items-center gap-1.5">
        <Icon className="size-4 text-primary" />
        {label}
      </span>
      <span className="text-right min-w-0 break-all">{children || "—"}</span>
    </div>
  )
}

export function resolverDisplayName(name?: string | null, email?: string | null) {
  const trimmed = name?.trim()
  if (trimmed && !/^rap staff$/i.test(trimmed) && !/^staff$/i.test(trimmed)) {
    return trimmed
  }
  return email?.trim() || "Unknown admin"
}

function TicketResolution({
  ticketId,
  context,
  openedAt,
  resolvedAt,
  resolverName,
  resolverRole,
  resolverEmail,
  action,
  notes,
  showStaffContact = false,
}: {
  ticketId: string
  context?: string | null
  openedAt?: string | null
  resolvedAt?: string | null
  resolverName?: string | null
  resolverRole?: string | null
  resolverEmail?: string | null
  action?: string | null
  notes?: string | null
  showStaffContact?: boolean
}) {
  const name = resolverDisplayName(resolverName, resolverEmail)
  const role = staffRoleLabel(resolverRole)

  return (
    <div className="flex flex-col gap-2 text-sm">
      <div className="flex items-center gap-2 font-semibold">
        <IoCheckmarkCircleOutline className="size-5 text-primary" />
        Resolution
      </div>
      <Row icon={IoDocumentTextOutline} label="Ticket">{ticketId}</Row>
      {context ? <Row icon={IoFlagOutline} label="Context">{context}</Row> : null}
      <Row icon={IoTimeOutline} label="Opened">{formatNptDateTime(openedAt) || "—"}</Row>
      <Row icon={IoCalendarOutline} label="Closed">{formatNptDateTime(resolvedAt) || "—"}</Row>
      <Row icon={IoPersonOutline} label="Resolver">{name}</Row>
      {role ? <Row icon={IoShieldOutline} label="Resolver role">{role}</Row> : null}
      {showStaffContact && resolverEmail ? <Row icon={IoMailOutline} label="Resolver email">{resolverEmail}</Row> : null}
      <Row icon={IoCheckmarkCircleOutline} label="Action">{action || "Closed"}</Row>
      {notes ? <p className="text-muted pt-1 whitespace-pre-wrap">{notes}</p> : null}
    </div>
  )
}

export default TicketResolution
