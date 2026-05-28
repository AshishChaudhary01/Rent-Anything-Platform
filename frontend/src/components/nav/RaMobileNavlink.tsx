import { Link } from "react-router-dom";
import type { ILinkProps } from "./RaNavlink";

const baseClass = `text-sm text-muted rounded-sm p-2 hover:bg-primary hover:text-white transition-all duration-300`;

const activeClass = `bg-primary/20 font-semibold`;

const RaMobileNavLink = ({
  path,
  name,
  activeLink,
  setActiveLink,
}: ILinkProps) => {
  const isHash = path.includes("#");
  if (isHash) {
    return (
      <a
        href={path}
        onClick={() => setActiveLink(path)}
        className={`${baseClass} ${activeLink === path ? activeClass : ""}`}
      >
        {name}
      </a>
    );
  }

  return (
    <Link
      to={path}
      onClick={() => setActiveLink(path)}
      className={`${baseClass} ${activeLink === path ? activeClass : ""}`}
    >
      {name}
    </Link>
  );
};

export default RaMobileNavLink;
