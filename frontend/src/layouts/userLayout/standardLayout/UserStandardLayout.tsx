import { Outlet } from "react-router-dom";
import UserArea from "../../../components/auth/UserArea";
import RaUserTopNavbar from "../../../components/nav/RaUserTopNavbar";
import RaUserBottomNavbar from "../../../components/nav/RaUserBottomNavbar";
import RaHelpPanel from "../../../components/help/RaHelpPanel";
import RaLoginGate from "../../../components/auth/RaLoginGate";

const UserStandardLayout = () => {
  return (
    <UserArea>
      <div className="overflow-hidden bg-bg flex flex-col min-h-dvh">
        <header className="h-14 md:h-16">
          <RaUserTopNavbar />
        </header>
        <main className="pb-18 pt-6">
          <Outlet />
        </main>
        <RaUserBottomNavbar />
        <RaHelpPanel />
        <RaLoginGate />
      </div>
    </UserArea>
  )
}

export default UserStandardLayout;
