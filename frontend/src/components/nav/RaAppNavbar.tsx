import { useEffect, useState } from "react";
import { IoCloseOutline, IoMenu } from "react-icons/io5";
import RaContainer from "../container/RaContainer";
import { logoHorizontal } from "../../utils/images";
import RaNavlink from "./RaNavlink";
import { Link } from "react-router-dom";
import RaButton from "../button/RaButton";
import RaMobileNavLink from "./RaMobileNavlink";

export interface INavbarProps {
  isOpen: boolean;
  isMenuOpen: boolean;
}

const navLinks = [
  { id: 1, path: "/", name: "Home" },
  { id: 2, path: "/#about", name: "About" },
  { id: 3, path: "/#how-it-works", name: "How It Works" },
  { id: 4, path: "/#safety", name: "Safety" }
];

function RaAppNavbar() {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);

  const [scrolled, setScrolled] = useState<boolean>(false);

  const [activeLink, setActiveLink] = useState<string>("/");

  const handleToggleNav = () => {
    setIsMenuOpen((prev) => !prev);
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsMenuOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 100) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`bg-white drop-shadow-xs py-2 px-6 md:px-7 lg:px-8 xxl:px-0 fixed z-50 top-0 w-full ${scrolled ? "bg-light/80 shadow backdrop-blur-sm" : "bg-bg"} transition`}
    >
      <RaContainer>
        <div className="flex items-center justify-between h-16">
          <div className="h-7 lg:h-12 cursor-pointer flex flex-col">
            <img src={logoHorizontal} alt="Logo" className="w-full h-full" />
          </div>

          <div className="hidden lg:flex items-center md:gap-5 lg:gap-8">
            {navLinks.map((link) => (
              <RaNavlink
                key={link.id}
                path={link.path}
                name={link.name}
                activeLink={activeLink}
                setActiveLink={setActiveLink}
              />
            ))}
          </div>
          <div className="hidden lg:flex items-center gap-3">
            <Link to={`/auth/login`}>
              <RaButton btnText="Log in" variant="outline" widthFill={false} />
            </Link>
            <RaButton btnText="Get Started" widthFill={false} />
          </div>

          <button
            className="lg:hidden p-1.5 rounded-md hover:text-primary hover:bg-primary/10 transition-all duration-200 cursor-pointer"
            onClick={handleToggleNav}
          >
            <IoMenu className={`w-7 h-7`} />
          </button>

          {/* mobile menu */}
          <div
            className={`fixed min-h-screen inset-0 z-40 backdrop-blur-xs transition-opacity duration-300 lg:hidden ${isMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
          >
            <div className="fixed top-0 z-50 right-0 h-full w-[78vw] max-w-xs bg-light shadow-2xl flex flex-col transition-transform duration-300 ease-in-out lg:hidden">
              <div className="flex items-center justify-between px-6 py-5">
                <div className="h-7 lg:h-8 cursor-pointer">
                  <img src={logoHorizontal} alt="Logo" className="w-full h-full" />
                </div>
                <button
                  onClick={handleToggleNav}
                  className="p-1.5 rounded-md text-muted hover:text-primary hover:bg-primary/10 transition-all duration-200 cursor-pointer"
                >
                  <IoCloseOutline className="w-6 h-6" />
                </button>
              </div>
              <div className="flex flex-col px-4 py-6 gap-1 flex-1 overflow-y-auto">
                {navLinks.map((link) => (
                  <RaMobileNavLink
                    key={link.id}
                    path={link.path}
                    name={link.name}
                    activeLink={activeLink}
                    setActiveLink={setActiveLink}
                  />
                ))}
              </div>
              <div className="px-6 py-6 flex flex-col gap-3">
                <RaButton btnText="Log in" variant="outline" widthFill={false} />
                <RaButton btnText="Get Started" widthFill={false} />
              </div>
            </div>
          </div>
        </div>
      </RaContainer>
    </nav>
  )
}

export default RaAppNavbar