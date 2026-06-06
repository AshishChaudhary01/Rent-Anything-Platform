import { logoHorizontal, profile01 } from "../../utils/images"
import RaContainer from "../container/RaContainer"
import NotificationDropdown from "../notificationDropdown/NotificationDropdown"
import ProfileDropdown from "../profileDropdown/ProfileDropdown"

function RaUserTopNavbar() {
  return (
    <nav className=" bg-white shadow py-2 px-6 md:px-7 lg:px-8 xxl:px-0 fixed z-50 top-0 w-full">
      <RaContainer>
        <div className="flex items-center justify-between h-12 md:h-12">
          <div className="h-10 md:h-12 cursor-pointer">
            <img src={logoHorizontal} alt="Logo" className="size-full" />
          </div>
          <div className="flex gap-x-4">
            <NotificationDropdown />
            <ProfileDropdown username="Ram Rai" email="ramrai@gmail.com" avatarUrl={profile01} />
          </div>
        </div>
      </RaContainer>
    </nav>
  )
}

export default RaUserTopNavbar