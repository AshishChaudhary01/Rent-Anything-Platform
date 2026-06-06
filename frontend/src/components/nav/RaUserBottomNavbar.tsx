import RaUserNavlink from "./RaUserNavLink";
import { IoAddCircleOutline, IoBagHandle, IoChatbubbleOutline, IoGridOutline, IoHome } from "react-icons/io5";
import RaContainerMD from "../container/RaContainerMD";
import RaContainerPadding from "../container/RaContainerPadding";
import { useLocation } from "react-router-dom";

const navLinks = [
  { id: 1, path: "/user", name: "Home", icon: <IoHome className="size-5" /> },
  { id: 2, path: "/user/my-rentals", name: "My Rentals", icon: <IoBagHandle className="size-5" /> },
  { id: 2, path: "/user/add-listing", name: "Add Listing", icon: <IoAddCircleOutline className="size-5" /> },
  { id: 2, path: "/user/my-listings", name: "My Listings", icon: <IoGridOutline className="size-5" /> },
  { id: 2, path: "/user/chat", name: "chat", icon: <IoChatbubbleOutline className="size-5" /> },
];
function RaUserBottomNavbar() {
  const location = useLocation();

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