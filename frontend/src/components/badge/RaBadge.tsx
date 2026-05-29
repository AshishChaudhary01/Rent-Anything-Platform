export interface IBadgeProps {
  badgeText: string;
  variant?:
  | "primary"
  | "accent"
  size?: "sm" | "md" | "lg"
  icon?: React.ReactElement;
  iconPosition?: "left" | "right";
  widthFill?: boolean;
  styleClass?: string;
}

const variantStlyes = {
  primary: "bg-accent text-muted",
  accent: "bg-accent-secondary text-muted-secondary",
};

const buttonSizes = {
  sm: "text-xs px-2 py-1",
  md: "text-base px-3 py-2",
  lg: "text-lg px-4 py-3",
}

const RaBadge = ({
  badgeText,
  variant = "primary",
  size = "md",
  icon,
  iconPosition,
  widthFill = false,
  styleClass,
}: IBadgeProps) => {
  const iconIsLeft = iconPosition === "left";
  return (
    <div
      className=
      {`${buttonSizes[size]}
      ${variantStlyes[variant]} 
      ${!widthFill ? "" : "w-full px-4 py-2"}
      flex h-fit gap-1.5 items-center font-bold rounded-4xl 
      ${styleClass}`}
    >
      {iconIsLeft && icon && (
        <span>
          {icon}
        </span>
      )}
      {badgeText}
      {!iconIsLeft && icon && (
        <span className="size-3">
          {icon}
        </span>
      )}
    </div>
  );
};

export default RaBadge