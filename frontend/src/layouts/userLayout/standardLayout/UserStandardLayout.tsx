import { Outlet } from "react-router-dom";
import RaUserTopNavbar from "../../../components/nav/RaUserTopNavbar";
import RaUserBottomNavbar from "../../../components/nav/RaUserBottomNavbar";

const UserStandardLayout = () => {
  return (
    <div className="overflow-hidden bg-bg flex flex-col min-h-dvh">
      <header className="h-14 md:h-16">
        <RaUserTopNavbar />
      </header>
      <main className="pb-18 pt-6">
        <Outlet />
      </main>
      <RaUserBottomNavbar />
    </div>
  )
}

export default UserStandardLayout;