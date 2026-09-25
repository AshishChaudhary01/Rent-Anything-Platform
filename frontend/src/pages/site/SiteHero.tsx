import { useEffect } from "react"
import RaBadge from "../../components/badge/RaBadge"
import RaContainer from "../../components/container/RaContainer"
import RaContainerPadding from "../../components/container/RaContainerPadding"

type SiteHeroProps = {
  kicker?: string
  title: string
  lead: string
  children?: React.ReactNode
}

export default function SiteHero({ kicker, title, lead, children }: SiteHeroProps) {
  useEffect(() => {
    document.title = `${title} · Rent Anything`
    return () => {
      document.title = "Rent Anything"
    }
  }, [title])

  return (
    <section className="pt-10 md:pt-16 pb-8">
      <RaContainer>
        <RaContainerPadding>
          <div className="max-w-3xl flex flex-col gap-4">
            {kicker ? (
              <div className="flex">
                <RaBadge badgeText={kicker} variant="primary" size="sm" widthFill={false} />
              </div>
            ) : null}
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-extrabold">{title}</h1>
            <p className="text-base md:text-xl text-muted font-light">{lead}</p>
          </div>
          {children ? <div className="mt-12">{children}</div> : null}
        </RaContainerPadding>
      </RaContainer>
    </section>
  )
}
