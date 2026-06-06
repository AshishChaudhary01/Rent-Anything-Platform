import { Link, Outlet } from "react-router-dom"
import RaContainer from "../../components/container/RaContainer"
import { logoHorizontal } from "../../utils/images"
import RaContainerXS from "../../components/container/RaContainerXS"
import Footer from "../../components/footer/Footer"

const Auth = () => {
  return (
    <div className="flex flex-col overflow-hidden min-h-dvh bg-bg">
      <header className="flex-none">
        <nav className="bg-white drop-shadow-xs py-2 px-6 md:px-7 lg:px-8 xxl:px-0 fixed z-50 top-0 w-full">
          <RaContainer>
            <div className="h-12 flex">
              <Link to={""} className="cursor-pointer">
                <img src={logoHorizontal} className="w-auto h-full"></img>
              </Link>
            </div>
          </RaContainer>
        </nav>
      </header>
      <main className="flex flex-col min-h-full justify-center bg-bg flex-1 mt-16">
        <RaContainerXS>
          <div className="px-4 md:px-0 pt-8 pb-4 md:pt-16 md:pb-8">
            {/* Other Components */}
            <Outlet />
          </div>
        </RaContainerXS>
      </main>
      <footer className="inset-shadow-xs flex-none">
        <Footer />
      </footer>
    </div>
  )
}

export default Auth