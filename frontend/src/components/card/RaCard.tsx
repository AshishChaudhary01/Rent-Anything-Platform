import type React from "react";

export interface ICardProps {
  children: React.ReactNode;
  shadow?: "xs" | "sm" | "md" | "lg" | "none";
  bg?: "white" | "accent" | "accentSecondary" | "surface" | "success" | "warning" | "info" | "danger";
  color?: "muted" | "muted-secondary";
  round?: "none" | "round" | "rounder" | "full";
  styleClass?: string;
}

const backgroundStyles = {
  white: "bg-white",
  surface: "bg-surface",
  accent: "bg-accent",
  accentSecondary: "bg-accent-secondary",
  success: "bg-soft-success",
  warning: "bg-soft-warning",
  info: "bg-soft-info",
  danger: "bg-soft-danger",
};

const roundedStyles = {
  none: "rounded-none",
  round: "rounded-xl",
  rounder: "rounded-4xl",
  full: "rounded-full",
};

const RaCard = ({
  shadow = "sm",
  bg="white",
  color,
  round = "rounder",
  styleClass,
  children,
}: ICardProps) => {
  return (
    <div
      className={`${shadow} ${backgroundStyles[bg]} ${color} ${roundedStyles[round]} w-full p-2 md:p-6 ${styleClass}`}
    >
      {children}
    </div>
  );
};

export default RaCard;