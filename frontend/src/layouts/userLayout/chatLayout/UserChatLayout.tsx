import { Outlet } from "react-router-dom";
import RaUserTopNavbar from "../../../components/nav/RaUserTopNavbar";

const UserChatLayout = () => {
  return (
    <div className="overflow-hidden bg-bg flex flex-col min-h-dvh">
      <header className="h-14 md:h-16">
        <RaUserTopNavbar />
      </header>
      <main>
        <Outlet />
      </main>
    </div>
  )
}

export default UserChatLayout;