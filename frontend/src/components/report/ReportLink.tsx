import { Link } from "react-router-dom"
import { IoFlagOutline } from "react-icons/io5"
import RaButton from "../button/RaButton"
import { reportHref, type ReportDraft } from "../../data/reports"

function ReportLink({
  draft,
  btnText = "Report",
  size = "sm",
  widthFill = false,
  variant = "outline",
  iconOnly = false,
}: {
  draft: ReportDraft
  btnText?: string
  size?: "sm" | "md" | "large"
  widthFill?: boolean
  variant?: "outline" | "danger" | "lean"
  iconOnly?: boolean
}) {
  const to = reportHref(draft)
  if (iconOnly) {
    return (
      <Link to={to} className="text-muted hover:text-danger shrink-0" aria-label={btnText} title={btnText}>
        <IoFlagOutline className="size-5" />
      </Link>
    )
  }
  return (
    <Link to={to} className={widthFill ? "block w-full" : "inline-block"}>
      <RaButton
        type="button"
        btnText={btnText}
        size={size}
        variant={variant}
        widthFill={widthFill}
        icon={<IoFlagOutline className="size-4" />}
        iconPosition="left"
      />
    </Link>
  )
}

export default ReportLink
