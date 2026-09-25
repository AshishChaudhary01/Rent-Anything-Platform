import type React from "react";
import { Link } from "react-router-dom";

interface ILinkProps {
  path: string;
  name: string;
  icon: React.ReactNode;
  active: boolean;
  onLocked?: () => void;
}

const RaUserNavlink = ({ path, name, icon, active, onLocked }: ILinkProps) => {
  const className = `flex flex-col text-xs items-center gap-y-1 transition-colors
        ${active ? "text-primary font-bold" : "text-gray-500"}
      `

  const body = (
    <>
      <div className="size-5">{icon}</div>
      <p className="text-center">{name}</p>
      <span
        className={`h-0.5 w-6 bg-primary transition-all ${active ? "opacity-100" : "opacity-0"}`}
      />
    </>
  )

  if (onLocked) {
    return (
      <button type="button" className={`${className} cursor-pointer`} onClick={onLocked}>
        {body}
      </button>
    )
  }

  return (
    <Link to={path} className={className}>
      {body}
    </Link>
  );
};

export default RaUserNavlink;
