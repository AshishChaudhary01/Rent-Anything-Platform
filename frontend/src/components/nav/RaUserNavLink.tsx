import type React from "react";
import { Link } from "react-router-dom";
interface ILinkProps {
  path: string;
  name: string;
  icon: React.ReactNode;
  active: boolean;
}

const RaUserNavlink = ({ path, name, icon, active }: ILinkProps) => {
  return (
    <Link
      to={path}
      className={`flex flex-col text-xs items-center gap-y-1 transition-colors
        ${active ? "text-primary font-bold" : "text-gray-500"}
      `}
    >
      <div className="size-5">{icon}</div>

      <p className="text-center">{name}</p>

      {/* active underline */}
      <span
        className={`h-0.5 w-6 bg-primary transition-all ${active ? "opacity-100" : "opacity-0"
          }`}
      />
    </Link>
  );
};

export default RaUserNavlink;