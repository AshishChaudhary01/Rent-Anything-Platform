function AdminPageHeader({
  icon: Icon,
  title,
  subtitle,
  actions,
}: {
  icon: React.ElementType
  title: string
  subtitle?: string
  actions?: React.ReactNode
}) {
  return (
    <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3">
      <div className="flex items-start gap-3 min-w-0">
        <div className="size-11 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0">
          <Icon className="size-5 text-primary" />
        </div>
        <div className="min-w-0">
          <div className="text-xl md:text-2xl font-bold">{title}</div>
          {subtitle ? <div className="text-sm text-muted">{subtitle}</div> : null}
        </div>
      </div>
      {actions ? <div className="flex flex-wrap gap-2">{actions}</div> : null}
    </div>
  )
}

export function AdminSectionTitle({
  icon: Icon,
  children,
}: {
  icon: React.ElementType
  children: React.ReactNode
}) {
  return (
    <div className="flex items-center gap-2 font-semibold">
      <Icon className="size-5 text-primary shrink-0" />
      <span>{children}</span>
    </div>
  )
}

export default AdminPageHeader
