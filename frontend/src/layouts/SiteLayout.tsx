import type { IContainerProp } from "../components/container/RaContainer"
import Footer from "../components/footer/Footer"
import RaAppNavbar from "../components/nav/RaAppNavbar"
import RaLoginGate from "../components/auth/RaLoginGate"

const SiteLayout = ({ children }: IContainerProp) => {
  return (
    <div className="overflow-hidden bg-bg min-h-dvh flex flex-col">
      <header className="h-16">
        <RaAppNavbar />
      </header>
      <main className="flex-1">{children}</main>
      <footer className="inset-shadow-xs">
        <Footer />
      </footer>
      <RaLoginGate />
    </div>
  )
}

export default SiteLayout
