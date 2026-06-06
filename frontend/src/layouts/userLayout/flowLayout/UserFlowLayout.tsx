import { Link, Outlet } from "react-router-dom";
import { logoHorizontal } from "../../../utils/images";
import RaContainer from "../../../components/container/RaContainer";
import { IoHelpCircleOutline } from "react-icons/io5";

const UserFlowLayout = () => {
  return (
    <div className="overflow-hidden bg-bg flex flex-col min-h-dvh">
      <header className="h-14 md:h-16">
        <nav className=" bg-white drop-shadow-xs py-2 px-6 md:px-7 lg:px-8 xxl:px-0 fixed z-50 top-0 w-full">
          <RaContainer>
            <div className="flex items-center justify-between h-12 md:h-12">
              <div className="h-10 md:h-12 cursor-pointer">
                <img src={logoHorizontal} alt="Logo" className="size-full" />
              </div>
              <div className="flex gap-x-4">
                <Link to={"/user"} className="size-10 text-muted">
                  <IoHelpCircleOutline className="size-full" />
                </Link>
              </div>
            </div>
          </RaContainer>
        </nav>      </header>
      <main>
        <Outlet />
      </main>
    </div>
  )
}

export default UserFlowLayout;