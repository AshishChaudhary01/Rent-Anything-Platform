import { useState } from "react"
import {
  IoCashOutline,
  IoFingerPrintOutline,
  IoShieldOutline,
  IoWarningOutline,
} from "react-icons/io5"
import SiteLayout from "../../layouts/SiteLayout"
import SiteHero from "./SiteHero"
import SiteCta from "./SiteCta"
import RaCard from "../../components/card/RaCard"
import RaContainer from "../../components/container/RaContainer"
import RaContainerPadding from "../../components/container/RaContainerPadding"

const pillars = [
  {
    title: "Identity verification (KYC)",
    body: "Listing or paying requires a complete profile and government ID photos reviewed by RAP staff. Guests can browse. Only verified members transact.",
    icon: IoFingerPrintOutline,
  },
  {
    title: "Escrow payments",
    body: "After an owner accepts a request, the renter pays a Nrs. 100 commitment fee in eSewa, then remaining rent after the pickup QR scan. RAP holds funds until the rental flow releases them.",
    icon: IoCashOutline,
  },
  {
    title: "Security deposits",
    body: "Owners set a deposit on each listing. RAP settles deposit, commission, and payout after return photos and the owner’s confirmation.",
    icon: IoShieldOutline,
  },
  {
    title: "Reports and staff review",
    body: "If something goes wrong, open a report from the listing or rental. Attach proof photos. RAP staff handle the ticket in the admin console.",
    icon: IoWarningOutline,
  },
]

const faqs = [
  {
    q: "How are items protected?",
    a: "Owners choose a security deposit. Renters must be KYC-verified before they can pay. Pickup and return both use an in-app QR scan. Condition photos are required on return so both sides have a record.",
  },
  {
    q: "What if an item comes back damaged?",
    a: "Upload return condition photos, then complete the owner return steps. Open a report with proof if you need RAP staff to mediate. Deposit handling follows the rental settlement, not a private cash transfer.",
  },
  {
    q: "How do I check a renter?",
    a: "You do not run your own background check. RAP verifies ID, email, and phone through KYC. Open their public profile to see ratings, reviews, and other listings before you accept a request.",
  },
  {
    q: "What does RAP not cover?",
    a: "RAP is a marketplace, not an insurance company. We do not promise a fixed rupee or dollar payout for theft or damage. Use deposits, photos, chat, and reports. Do not pay or settle disputes outside the app.",
  },
]

function TrustSafety() {
  const [open, setOpen] = useState(0)

  return (
    <SiteLayout>
      <SiteHero
        kicker="TRUST & SAFETY"
        title="Your safety is our top priority"
        lead="Trust is the currency of this marketplace. KYC, escrow, deposits, QR handovers, and staff-reviewed reports are built into every rental — not bolted on after something goes wrong."
      />

      <section className="pb-8">
        <RaContainer>
          <RaContainerPadding>
            <h2 className="text-2xl md:text-3xl font-extrabold mb-2">Four pillars of trust</h2>
            <p className="text-muted mb-8 max-w-2xl">Local community values, plus the checks RAP actually runs today.</p>
            <div className="grid md:grid-cols-2 gap-6">
              {pillars.map((pillar) => (
                <RaCard key={pillar.title} bg="surface" round="round" styleClass="flex flex-col gap-3">
                  <pillar.icon className="size-8 text-primary" />
                  <div className="font-semibold text-lg">{pillar.title}</div>
                  <p className="text-sm md:text-base text-muted font-light">{pillar.body}</p>
                </RaCard>
              ))}
            </div>
          </RaContainerPadding>
        </RaContainer>
      </section>

      <section className="py-8">
        <RaContainer>
          <RaContainerPadding>
            <h2 className="text-2xl md:text-3xl font-extrabold mb-8">Common safety questions</h2>
            <div className="flex flex-col gap-3 max-w-3xl">
              {faqs.map((faq, index) => {
                const expanded = open === index
                return (
                  <RaCard key={faq.q} round="round" styleClass="flex flex-col gap-2">
                    <button
                      type="button"
                      className="text-left font-semibold cursor-pointer"
                      onClick={() => setOpen(expanded ? -1 : index)}
                    >
                      {faq.q}
                    </button>
                    {expanded ? <p className="text-sm md:text-base text-muted font-light">{faq.a}</p> : null}
                  </RaCard>
                )
              })}
            </div>
          </RaContainerPadding>
        </RaContainer>
      </section>

      <SiteCta
        title="Need help with a live rental?"
        lead="Use in-app Help for step-by-step guides, or Contact us if you cannot reach a ticket from the app."
        primaryTo="/user/help"
        primaryLabel="Help & guides"
        secondaryTo="/contact"
        secondaryLabel="Contact us"
      />
    </SiteLayout>
  )
}

export default TrustSafety
