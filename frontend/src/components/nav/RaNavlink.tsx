import { Link } from "react-router-dom";

export interface ILinkProps {
  path: string;
  name: string;
  activeLink: string;
  setActiveLink: (path: string) => void;
}

const baseClass = `text-lg text-gray-500 after:content-[''] after:block after:mt-1 after:bg-primary after:h-0.5 after:w-0 hover:after:w-full hover:after:transition-all hover:after:duration-400`;

const activeClass = `text-primary font-bold after:w-full`;

const RaNavlink = ({ path, name, activeLink, setActiveLink }: ILinkProps) => {
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

export default RaNavlink;