import { Link } from "react-router-dom"
import SiteLayout from "../../layouts/SiteLayout"
import SiteHero from "./SiteHero"
import RaCard from "../../components/card/RaCard"
import RaContainer from "../../components/container/RaContainer"
import RaContainerPadding from "../../components/container/RaContainerPadding"
import { SITE_CONTACT } from "../../data/siteContact"

const sections = [
  {
    title: "Definitions",
    body: [
      "Platform means the Rent Anything website and related services that match owners and renters.",
      "Owner is the member who lists an item.",
      "Renter is the member who requests, pays, and uses an item through RAP.",
      "RAP is a facilitator. We do not own listed items and we are not a party to the underlying loan of goods except as described here for payments and safety.",
    ],
  },
  {
    title: "Accounts",
    body: [
      "You may browse without signing in. Listing, requesting, chatting, paying, and reporting require an account.",
      "You must provide accurate details. KYC must match a real person. Misrepresentation can lead to suspension.",
      "One RAP session is stored per browser. Do not share your login.",
    ],
  },
  {
    title: "Listings and care",
    body: [
      "Owners describe items honestly, set a daily rate and deposit, and keep the listing available when they accept a request.",
      "Renters treat items with care and return them in the condition shown at pickup, ordinary wear aside.",
      "Illegal, unsafe, or prohibited items must not be listed.",
    ],
  },
  {
    title: "Payments",
    body: [
      "No payment is due until an owner accepts a request.",
      "The renter then pays a Nrs. 100 commitment fee through RAP’s eSewa checkout, and remaining rent after the pickup QR is confirmed.",
      "RAP holds funds in escrow and takes a platform commission of about 8% when a rental settles. Payout follows a completed return, not a private transfer.",
      "Do not pay owners outside RAP. Off-platform payments are not protected.",
    ],
  },
  {
    title: "Handover, no-shows, and returns",
    body: [
      "Pickup and return use a single QR scan in the app. Coordinate the place in in-app chat.",
      "Record a no-show only if the other party did not arrive. That action cannot be undone and may settle the commitment fee.",
      "Renters schedule returns and upload condition photos. Owners review and confirm pickup of the item.",
      "Active rentals cannot be cancelled from the cancel action; finish the return or open a report.",
    ],
  },
  {
    title: "Cancellations",
    body: [
      "A renter may cancel an unpaid request.",
      "After payment, cancellation follows RAP’s rental status rules. Completed rentals cannot be cancelled.",
      "RAP does not currently offer owner-selected Flexible / Standard / Firm refund windows like some marketplaces. Check the rental screen for what is still allowed.",
    ],
  },
  {
    title: "Safety and disputes",
    body: [
      "Use reports with proof media if an item is damaged, missing, or a member breaks these Terms.",
      "RAP staff review tickets. RAP is not an insurer and does not guarantee a fixed compensation amount.",
      "Public ratings must be honest and about the rental, not harassment.",
    ],
  },
]

function Terms() {
  return (
    <SiteLayout>
      <SiteHero
        kicker="TERMS OF SERVICE"
        title="Terms & conditions"
        lead="These terms explain how Rent Anything works today: peer-to-peer listings in Nepal, KYC, eSewa escrow, QR handovers, and staff-reviewed reports. This is a student-project draft, not a substitute for professional legal advice."
      />

      <section className="pb-16">
        <RaContainer>
          <RaContainerPadding>
            <p className="text-sm text-muted mb-8">Last updated {SITE_CONTACT.lastUpdated}.</p>
            <div className="flex flex-col gap-6 max-w-3xl">
              {sections.map((section) => (
                <RaCard key={section.title} round="round" styleClass="flex flex-col gap-3">
                  <h2 className="text-lg font-bold">{section.title}</h2>
                  <ul className="list-disc pl-5 flex flex-col gap-2 text-sm md:text-base text-muted font-light">
                    {section.body.map((line) => (
                      <li key={line}>{line}</li>
                    ))}
                  </ul>
                </RaCard>
              ))}
              <RaCard bg="surface" round="round" styleClass="flex flex-col gap-2">
                <h2 className="text-lg font-bold">Questions</h2>
                <p className="text-sm md:text-base text-muted font-light">
                  Email{" "}
                  <a className="text-primary font-medium" href={`mailto:${SITE_CONTACT.legalEmail}`}>
                    {SITE_CONTACT.legalEmail}
                  </a>
                  , visit{" "}
                  <Link to="/contact" className="text-primary font-medium">
                    Contact
                  </Link>
                  , or read{" "}
                  <Link to="/privacy" className="text-primary font-medium">
                    Privacy
                  </Link>{" "}
                  and{" "}
                  <Link to="/safety" className="text-primary font-medium">
                    Trust &amp; Safety
                  </Link>
                  .
                </p>
              </RaCard>
            </div>
          </RaContainerPadding>
        </RaContainer>
      </section>
    </SiteLayout>
  )
}

export default Terms
