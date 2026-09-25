import { Link } from "react-router-dom"
import { logoHorizontal } from "../../utils/images"
import RaContainer from "../container/RaContainer"
import NotificationDropdown from "../notificationDropdown/NotificationDropdown"
import ProfileDropdown from "../profileDropdown/ProfileDropdown"
import RaHelpButton from "../help/RaHelpButton"
import RaButton from "../button/RaButton"
import { useAccountStore } from "../../store/accountStore"
import { useAuthStore } from "../../store/authStore"
import { rememberAuthReturn } from "../../store/loginGateStore"

function RaUserTopNavbar() {
  const { fullName, email, avatarUrl, hasAvatar } = useAccountStore()
  const token = useAuthStore((s) => s.accessToken)

  return (
    <nav className=" bg-white shadow py-2 px-6 md:px-7 lg:px-8 xxl:px-0 fixed z-50 top-0 w-full">
      <RaContainer>
        <div className="flex items-center justify-between h-12 md:h-12">
          <Link to="/user" className="h-10 md:h-12 cursor-pointer">
            <img src={logoHorizontal} alt="Logo" className="size-full object-contain" />
          </Link>
          <div className="flex gap-x-3 items-center">
            <RaHelpButton />
            {token ? (
              <>
                <NotificationDropdown />
                <ProfileDropdown username={fullName} email={email} avatarUrl={hasAvatar ? avatarUrl : ""} />
              </>
            ) : (
              <>
                <Link to="/auth/login" onClick={() => rememberAuthReturn()}>
                  <RaButton type="button" btnText="Log in" variant="outline" size="sm" widthFill={false} />
                </Link>
                <Link to="/auth/register" onClick={() => rememberAuthReturn()} className="hidden sm:block">
                  <RaButton type="button" btnText="Sign up" size="sm" widthFill={false} />
                </Link>
              </>
            )}
          </div>
        </div>
      </RaContainer>
    </nav>
  )
}

export default RaUserTopNavbar
