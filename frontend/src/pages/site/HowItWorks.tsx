import { IoCameraOutline, IoCardOutline, IoCheckmarkCircleOutline, IoHandLeftOutline, IoListOutline, IoSearchOutline } from "react-icons/io5"
import SiteLayout from "../../layouts/SiteLayout"
import SiteHero from "./SiteHero"
import SiteCta from "./SiteCta"
import RaCard from "../../components/card/RaCard"
import RaContainer from "../../components/container/RaContainer"
import RaContainerPadding from "../../components/container/RaContainerPadding"

const renterSteps = [
  {
    n: "1",
    title: "Browse",
    body: "Search or open categories. Guests can view listings and public profiles. Requesting to rent needs a verified account.",
    icon: IoSearchOutline,
  },
  {
    n: "2",
    title: "Request and pay",
    body: "Pick dates and send a request. You pay only after the owner accepts: Nrs. 100 commitment in eSewa, then remaining rent after pickup.",
    icon: IoCardOutline,
  },
  {
    n: "3",
    title: "Meet, use, return",
    body: "Meet in person, scan one RAP QR, then enjoy the item. Schedule the return, upload condition photos, scan again, and rate.",
    icon: IoHandLeftOutline,
  },
]

const ownerSteps = [
  {
    n: "1",
    title: "List for free",
    body: "Complete KYC, add photos, a daily rate, deposit, and a map pin. There is no listing fee.",
    icon: IoListOutline,
  },
  {
    n: "2",
    title: "Approve requests",
    body: "Read the renter’s profile and ratings. Accept so they can pay, or decline if the dates do not work.",
    icon: IoCheckmarkCircleOutline,
  },
  {
    n: "3",
    title: "Handover and earn",
    body: "Complete pickup QR, then return QR and condition review. RAP takes about 8% commission and releases the rest after settlement.",
    icon: IoCameraOutline,
  },
]

function StepGrid({ heading, lead, steps }: { heading: string; lead: string; steps: typeof renterSteps }) {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-2xl md:text-3xl font-extrabold">{heading}</h2>
        <p className="text-muted mt-2 max-w-2xl">{lead}</p>
      </div>
      <div className="grid md:grid-cols-3 gap-6">
        {steps.map((step) => (
          <RaCard key={step.title} bg="surface" round="round" styleClass="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <step.icon className="size-8 text-primary" />
              <span className="text-primary font-extrabold text-2xl">{step.n}</span>
            </div>
            <div className="font-semibold text-lg">{step.title}</div>
            <p className="text-sm md:text-base text-muted font-light">{step.body}</p>
          </RaCard>
        ))}
      </div>
    </div>
  )
}

function HowItWorks() {
  return (
    <SiteLayout>
      <SiteHero
        kicker="HOW IT WORKS"
        title="Three simple steps to start"
        lead="Rent high-quality items from neighbours, or turn idle goods into a local income stream. Every paid rental follows the same request, pay, meetup, and return path."
      />

      <section className="pb-12">
        <RaContainer>
          <RaContainerPadding>
            <div className="flex flex-col gap-16">
              <StepGrid
                heading="For renters"
                lead="Access what you need without buying or storing it."
                steps={renterSteps}
              />
              <StepGrid
                heading="For owners"
                lead="You keep the item. RAP handles requests, escrow, and payout after a clean return."
                steps={ownerSteps}
              />
            </div>
          </RaContainerPadding>
        </RaContainer>
      </section>

      <SiteCta
        title="Ready to join the community?"
        lead="Create an account, finish KYC, then list an item or send your first request."
        primaryTo="/auth/register"
        primaryLabel="Create an account"
        secondaryTo="/safety"
        secondaryLabel="Trust & safety"
      />
    </SiteLayout>
  )
}

export default HowItWorks
