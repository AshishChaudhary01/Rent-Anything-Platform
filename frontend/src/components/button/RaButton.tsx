export interface IButtonProps {
  type?: "button" | "submit" | "reset";
  btnText: string;
  clickFunc?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  disabled?: boolean;
  variant?:
  | "primary"
  | "lean"
  | "outline"
  | "danger"
  | "inverted"
  size?: "sm" | "md" | "large";
  icon?: React.ReactElement;
  iconPosition?: "left" | "right";
  widthFill?: boolean;
  styleClass?: string;
}

const variantStlyes = {
  primary: "bg-[image:var(--gradient-primary)] text-white hover:opacity-90",
  lean: "bg-transparent border-transparent border-1 text-primary hover:border-1 hover:border-primary hover:opacity-90",
  outline: "bg-light text-primary hover:bg-[image:var(--gradient-primary)] hover:text-white border border-primary",
  danger: "bg-danger text-light border-danger hover:bg-soft-danger",
  inverted: "bg-white text-primary hover:bg-light",
};

const buttonStyles = {
  sm: "px-4 py-2 text-xs",
  md: "px-6 py-3 text-sm",
  large: "px-6 py-4 md:text-base",
};

const RaButton = ({
  type = "submit",
  btnText,
  clickFunc,
  disabled,
  widthFill = true,
  variant = "primary",
  size = "md",
  icon,
  iconPosition,
  styleClass,
}: IButtonProps) => {
  const iconIsLeft = iconPosition === "left";
  return (
    <button
      type={type}
      onClick={clickFunc}
      disabled={disabled}
      className={`${buttonStyles[size]} rounded-full font-semibold ${variantStlyes[variant]} ${!widthFill ? "" : "w-full px-auto"} flex items-center justify-center gap-2 hover:shadow-lg transition group cursor-pointer disabled:opacity-50 
        disabled:cursor-not-allowed 
        disabled:pointer-events-none 
        disabled:shadow-none
        ${!disabled ? "cursor-pointer" : ""} ${styleClass}`}
    >
      {iconIsLeft && icon && (
        <span className="group-hover:translate-x-2 transition-transform duration-300">
          {icon}
        </span>
      )}
      <span>{btnText}</span>
      {!iconIsLeft && icon && (
        <span className="group-hover:translate-x-2 transition-transform duration-300">
          {icon}
        </span>
      )}
    </button>
  );
};

export default RaButton;
