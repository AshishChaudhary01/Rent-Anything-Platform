import { Link, Outlet } from "react-router-dom";
import { logoHorizontal } from "../../../utils/images";
import RaContainer from "../../../components/container/RaContainer";
import RequireAuth from "../../../components/auth/RequireAuth";
import RaHelpButton from "../../../components/help/RaHelpButton";
import RaHelpPanel from "../../../components/help/RaHelpPanel";

const UserFlowLayout = () => {
  return (
    <RequireAuth>
      <div className="overflow-hidden bg-bg flex flex-col min-h-dvh">
        <header className="h-14 md:h-16">
          <nav className=" bg-white drop-shadow-xs py-2 px-6 md:px-7 lg:px-8 xxl:px-0 fixed z-50 top-0 w-full">
            <RaContainer>
              <div className="flex items-center justify-between h-12 md:h-12">
                <Link to="/user" className="h-10 md:h-12 cursor-pointer">
                  <img src={logoHorizontal} alt="Logo" className="size-full" />
                </Link>
                <div className="flex gap-x-4 items-center">
                  <RaHelpButton />
                </div>
              </div>
            </RaContainer>
          </nav>
        </header>
        <main className="pt-6 mb-24 lg:mb-0">
          <Outlet />
        </main>
        <RaHelpPanel />
      </div>
    </RequireAuth>
  )
}

export default UserFlowLayout;
