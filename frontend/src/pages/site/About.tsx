import {
  IoEarthOutline,
  IoPeopleOutline,
  IoShieldCheckmarkOutline,
} from "react-icons/io5"
import SiteLayout from "../../layouts/SiteLayout"
import SiteHero from "./SiteHero"
import SiteCta from "./SiteCta"
import RaCard from "../../components/card/RaCard"
import RaContainer from "../../components/container/RaContainer"
import RaContainerPadding from "../../components/container/RaContainerPadding"

const pillars = [
  {
    title: "Peer-to-peer",
    body: "Owners list idle gear. Neighbours rent it for the days they need. RAP is the marketplace in between — not a warehouse.",
    icon: IoPeopleOutline,
  },
  {
    title: "Trusted locally",
    body: "KYC, ratings, in-app chat, and staff-reviewed reports keep the community honest before money or items change hands.",
    icon: IoShieldCheckmarkOutline,
  },
  {
    title: "Built for Nepal",
    body: "Payments go through eSewa. Pickup and return happen in person with a QR scan. Support is based in Kathmandu.",
    icon: IoEarthOutline,
  },
]

function About() {
  return (
    <SiteLayout>
      <SiteHero
        kicker="ABOUT US"
        title="Building a resourceful Nepal"
        lead="We are a Kathmandu-based team reimagining ownership for people who need something for a weekend, a project, or a season — without buying it forever."
      />

      <section className="pb-8">
        <RaContainer>
          <RaContainerPadding>
            <div className="grid lg:grid-cols-2 gap-8 max-w-5xl">
              <div className="flex flex-col gap-3">
                <h2 className="text-2xl md:text-3xl font-extrabold">Our mission</h2>
                <p className="text-muted text-base md:text-lg font-light">
                  Rent Anything (RAP) connects temporary needs with local availability. High-quality tools, cameras, outdoor gear, and everyday items stay in circulation instead of sitting unused.
                </p>
                <p className="text-muted text-base md:text-lg font-light">
                  Sharing reduces duplicate purchases and shortens the distance between neighbours who already have what someone else needs this week.
                </p>
              </div>
              <div className="flex flex-col gap-3">
                <h2 className="text-2xl md:text-3xl font-extrabold">How we work</h2>
                <p className="text-muted text-base md:text-lg font-light">
                  Guests can browse the catalog. Listing or renting needs a verified account: profile photo, contact details, and KYC reviewed by RAP staff.
                </p>
                <p className="text-muted text-base md:text-lg font-light">
                  Funds stay in escrow until pickup, return, and condition proof are complete. RAP takes a platform commission so owners get a clear payout.
                </p>
              </div>
            </div>
          </RaContainerPadding>
        </RaContainer>
      </section>

      <section className="py-8">
        <RaContainer>
          <RaContainerPadding>
            <h2 className="text-2xl md:text-3xl font-extrabold mb-8">The vision</h2>
            <div className="grid md:grid-cols-3 gap-6">
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

      <SiteCta
        title="Ready to share or borrow?"
        lead="Browse listings as a guest, or create an account to list an item and send rental requests."
        primaryTo="/user"
        primaryLabel="Browse items"
        secondaryTo="/how-it-works"
        secondaryLabel="How it works"
      />
    </SiteLayout>
  )
}

export default About
