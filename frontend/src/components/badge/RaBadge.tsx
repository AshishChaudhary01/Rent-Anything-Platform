export interface IBadgeProps {
  badgeText: string;
  variant?:
  | "primary"
  | "accent"
  icon?: React.ReactElement;
  iconPosition?: "left" | "right";
  widthFill?: boolean;
  styleClass?: string;
}

const variantStlyes = {
  primary: "bg-accent text-primary",
  accent: "bg-accent-secondary text-muted-secondary",
};

const RaBadge = ({
  badgeText,
  variant = "primary",
  icon,
  iconPosition,
  widthFill = false,
  styleClass,
}: IBadgeProps) => {
  const iconIsLeft = iconPosition === "left";
  return (
    <div
      className=
      {`${variantStlyes[variant]} 
      ${!widthFill ? "" : "w-full px-4 py-2"}
      flex h-fit gap-1.5 items-center p-2 text-[9px] font-bold rounded-4xl 
      ${styleClass}`}
    >
      {iconIsLeft && icon && (
        <span>
          {icon}
        </span>
      )}
      <span className="hidden md:inline-flex">
        {badgeText}
      </span>
      {!iconIsLeft && icon && (
        <span className="size-3">
          {icon}
        </span>
      )}
    </div>
  );
};

export default RaBadge