import { IoFlagOutline } from "react-icons/io5"
import AuthLink from "../auth/AuthLink"
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
      <AuthLink to={to} message="Sign in to report a problem." className="text-muted hover:text-danger shrink-0" >
        <IoFlagOutline className="size-5" />
      </AuthLink>
    )
  }
  return (
    <AuthLink to={to} message="Sign in to report a problem." className={widthFill ? "block w-full" : "inline-block"}>
      <RaButton
        type="button"
        btnText={btnText}
        size={size}
        variant={variant}
        widthFill={widthFill}
        icon={<IoFlagOutline className="size-4" />}
        iconPosition="left"
      />
    </AuthLink>
  )
}

export default ReportLink
