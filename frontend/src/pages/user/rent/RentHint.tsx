import type { ReactElement, ReactNode } from "react"
import RaCard from "../../../components/card/RaCard"

const tones = {
  info: { bg: "info" as const, icon: "text-info" },
  success: { bg: "success" as const, icon: "text-success" },
  warning: { bg: "warning" as const, icon: "text-warning" },
  danger: { bg: "danger" as const, icon: "text-danger" },
  accent: { bg: "accent" as const, icon: "text-primary" },
}

function RentHint({
  icon,
  title,
  children,
  tone = "info",
}: {
  icon: ReactElement
  title: string
  children: ReactNode
  tone?: keyof typeof tones
}) {
  const style = tones[tone]
  return (
    <RaCard round="round" bg={style.bg} styleClass="flex gap-3 items-start">
      <div className={`mt-0.5 shrink-0 ${style.icon}`}>{icon}</div>
      <div className="min-w-0">
        <div className="font-semibold">{title}</div>
        <div className="text-sm text-muted">{children}</div>
      </div>
    </RaCard>
  )
}

export default RentHint
