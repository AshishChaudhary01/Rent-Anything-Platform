import { Link } from "react-router-dom"
import RaContainer from "../container/RaContainer"
import RaContainerPadding from "../container/RaContainerPadding"
import { SITE_CONTACT } from "../../data/siteContact"

const company = [
  { to: "/about", label: "About" },
  { to: "/how-it-works", label: "How it works" },
  { to: "/safety", label: "Trust & safety" },
]

const support = [
  { to: "/user/help", label: "Help" },
  { to: "/contact", label: "Contact" },
]

const legal = [
  { to: "/terms", label: "Terms" },
  { to: "/privacy", label: "Privacy" },
]

function Footer() {
  return (
    <RaContainer>
      <RaContainerPadding>
        <div className="pt-8 pb-6 text-muted text-sm lg:text-base flex flex-col gap-8">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="flex flex-col gap-2">
              <div className="font-semibold text-dark">Rent Anything</div>
              <p className="font-light max-w-xs">
                Peer-to-peer rentals in Nepal. Demo office: {SITE_CONTACT.addressLine1}, {SITE_CONTACT.addressLine2}.
              </p>
              <a className="text-primary" href={`mailto:${SITE_CONTACT.email}`}>
                {SITE_CONTACT.email}
              </a>
            </div>
            <FooterCol title="Company" links={company} />
            <FooterCol title="Support" links={support} />
            <FooterCol title="Legal" links={legal} />
          </div>
          <div className="flex flex-wrap gap-4 justify-between border-t border-gray-200 pt-4">
            <div>&copy; 2026 Rent Anything Platform</div>
            <div className="flex flex-wrap gap-x-6">
              <Link to="/contact">Contact</Link>
              <Link to="/terms">Terms</Link>
              <Link to="/privacy">Privacy</Link>
            </div>
          </div>
        </div>
      </RaContainerPadding>
    </RaContainer>
  )
}

function FooterCol({ title, links }: { title: string; links: { to: string; label: string }[] }) {
  return (
    <div className="flex flex-col gap-2">
      <div className="font-semibold text-dark">{title}</div>
      {links.map((link) => (
        <Link key={link.to} to={link.to} className="hover:text-primary">
          {link.label}
        </Link>
      ))}
    </div>
  )
}

export default Footer
