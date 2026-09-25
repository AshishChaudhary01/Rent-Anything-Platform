import { Link } from "react-router-dom"
import RaButton from "../../components/button/RaButton"
import RaContainer from "../../components/container/RaContainer"
import RaContainerPadding from "../../components/container/RaContainerPadding"

type SiteCtaProps = {
  title: string
  lead: string
  primaryTo: string
  primaryLabel: string
  secondaryTo?: string
  secondaryLabel?: string
}

export default function SiteCta({
  title,
  lead,
  primaryTo,
  primaryLabel,
  secondaryTo,
  secondaryLabel,
}: SiteCtaProps) {
  return (
    <section className="py-12 md:py-16">
      <RaContainer>
        <RaContainerPadding>
          <div className="bg-primary text-white rounded-4xl py-12 px-6 md:py-16 md:px-10">
            <div className="max-w-2xl mx-auto flex flex-col items-center gap-6 text-center">
              <div className="font-extrabold text-2xl md:text-4xl">{title}</div>
              <p className="font-light text-base md:text-lg opacity-90">{lead}</p>
              <div className="flex flex-wrap justify-center gap-3">
                <Link to={primaryTo}>
                  <RaButton type="button" btnText={primaryLabel} variant="inverted" widthFill={false} />
                </Link>
                {secondaryTo && secondaryLabel ? (
                  <Link to={secondaryTo}>
                    <RaButton type="button" btnText={secondaryLabel} variant="lean" widthFill={false} styleClass="text-white border-white hover:border-white" />
                  </Link>
                ) : null}
              </div>
            </div>
          </div>
        </RaContainerPadding>
      </RaContainer>
    </section>
  )
}
