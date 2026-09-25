import RaUserNavlink from "./RaUserNavLink";
import { IoAddCircle, IoBagHandle, IoChatbubble, IoGrid, IoHome } from "react-icons/io5";
import RaContainerMD from "../container/RaContainerMD";
import RaContainerPadding from "../container/RaContainerPadding";
import { useLocation } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";
import { openLoginGate } from "../../store/loginGateStore";

const navLinks = [
  { id: 1, path: "/user", name: "Home", icon: <IoHome className="size-5" />, public: true },
  { id: 2, path: "/user/my-rentals", name: "My Rentals", icon: <IoBagHandle className="size-5" />, message: "Sign in to see your rentals." },
  { id: 3, path: "/user/add-listing", name: "Add Listing", icon: <IoAddCircle className="size-5" />, message: "Sign in to list an item." },
  { id: 4, path: "/user/my-listings", name: "My Listings", icon: <IoGrid className="size-5" />, message: "Sign in to manage your listings." },
  { id: 5, path: "/user/chat", name: "Chat", icon: <IoChatbubble className="size-5" />, message: "Sign in to chat with owners and renters." },
];

function RaUserBottomNavbar() {
  const location = useLocation();
  const token = useAuthStore((s) => s.accessToken)
  const activePath = location.pathname;

  return (
    <footer className="bg-white rounded-t-4xl shadow-2xl pt-2 pb-4 fixed z-50 bottom-0 w-full">
      <RaContainerMD>
        <RaContainerPadding>
          <ul className="flex items-center justify-around gap-x-4">
            {navLinks.map((link) => (
              <li key={link.id}>
                <RaUserNavlink
                  path={link.path}
                  name={link.name}
                  icon={link.icon}
                  active={activePath === link.path}
                  onLocked={!token && !link.public
                    ? () => openLoginGate({ message: link.message, next: link.path })
                    : undefined}
                />
              </li>
            ))}
          </ul>
        </RaContainerPadding>
      </RaContainerMD>
    </footer>
  );
}

export default RaUserBottomNavbar
