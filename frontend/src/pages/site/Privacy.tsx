import { Link } from "react-router-dom"
import SiteLayout from "../../layouts/SiteLayout"
import SiteHero from "./SiteHero"
import RaCard from "../../components/card/RaCard"
import RaContainer from "../../components/container/RaContainer"
import RaContainerPadding from "../../components/container/RaContainerPadding"
import { SITE_CONTACT } from "../../data/siteContact"

const sections = [
  {
    title: "1. Information we collect",
    body: [
      "Account details: name, email, phone, address, and profile photo.",
      "KYC: government ID images and the review status staff assign to them.",
      "Listings and rentals: photos, descriptions, prices, deposits, dates, meetup QR events, and condition-proof media.",
      "Payments: we record RAP payment status and eSewa references. Card or wallet secrets stay with the payment provider.",
      "Chat, reports, and notifications: messages and tickets you create on the platform.",
      "Technical logs: request identifiers and device data used to keep the service stable and to investigate abuse. We do not put passwords or tokens in those logs.",
    ],
  },
  {
    title: "2. How we use data",
    body: [
      "To run rental requests, escrow, pickup and return, and owner payouts.",
      "To verify identity before you list or pay.",
      "To show public profiles, ratings, and listings you publish.",
      "To send transactional email and in-app notifications.",
      "To review reports and enforce these Terms.",
    ],
  },
  {
    title: "3. Sharing",
    body: [
      "Other members see the profile, listings, and ratings you make public, plus what they need for an active request (for example chat and meetup status).",
      "Staff see KYC, reports, and rental records required to run Trust & Safety.",
      "eSewa processes commitment and rent payments. RAP does not sell your personal data.",
    ],
  },
  {
    title: "4. Security",
    body: [
      "Access to RAP APIs uses authenticated sessions. Sensitive account fields are not written to application logs.",
      "KYC images are stored so staff can review them. Treat uploads as confidential and never share IDs in public chat.",
      "You can sign in with email and password or Google. Google-only accounts do not store a RAP password.",
    ],
  },
  {
    title: "5. Your choices",
    body: [
      "You can update profile, contact, and payment-method screens while signed in.",
      "You may ask us to export or delete personal data by emailing the privacy address below. Some records (payments, completed rentals, unresolved reports) may be kept where the law or dispute handling requires it.",
      "Guests can browse listings without an account. Acting on a listing requires registration.",
    ],
  },
]

function Privacy() {
  return (
    <SiteLayout>
      <SiteHero
        kicker="PRIVACY POLICY"
        title="How we handle your information"
        lead="Transparency is the foundation of community trust. This policy describes the data Rent Anything collects to run Nepal peer-to-peer rentals. It is a project document, not formal legal advice."
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
                  <a className="text-primary font-medium" href={`mailto:${SITE_CONTACT.privacyEmail}`}>
                    {SITE_CONTACT.privacyEmail}
                  </a>{" "}
                  or use our{" "}
                  <Link to="/contact" className="text-primary font-medium">
                    Contact
                  </Link>{" "}
                  page. Related rules live in the{" "}
                  <Link to="/terms" className="text-primary font-medium">
                    Terms of Service
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

export default Privacy
