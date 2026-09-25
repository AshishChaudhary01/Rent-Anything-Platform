import { Link } from "react-router-dom"
import { useAuthStore } from "../../store/authStore"
import { openLoginGate } from "../../store/loginGateStore"

function AuthLink({
  to,
  message,
  className,
  children,
}: {
  to: string
  message?: string
  className?: string
  children: React.ReactNode
}) {
  const token = useAuthStore((s) => s.accessToken)
  if (token) {
    return <Link to={to} className={className}>{children}</Link>
  }
  return (
    <button
      type="button"
      className={className || "cursor-pointer"}
      onClick={() => openLoginGate({ message, next: to })}
    >
      {children}
    </button>
  )
}

export default AuthLink
