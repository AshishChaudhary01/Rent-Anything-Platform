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
  | "success"
  | "secondary"
  | "ghost"
  | "camera"
  | "upload"
  size?: "sm" | "md" | "large";
  icon?: React.ReactElement;
  iconPosition?: "left" | "right";
  widthFill?: boolean;
  styleClass?: string;
  loading?: boolean;
}

const variantStlyes = {
  primary: "bg-[image:var(--gradient-primary)] text-white hover:opacity-90",
  lean: "bg-transparent border-transparent border-1 text-primary hover:border-1 hover:border-primary hover:opacity-90",
  outline: "bg-light text-primary hover:bg-[image:var(--gradient-primary)] hover:text-white border border-primary",
  danger: "bg-danger text-white hover:bg-soft-danger hover:text-danger border border-danger",
  inverted: "bg-white text-primary hover:bg-light",
  success: "bg-success text-white hover:bg-soft-success hover:text-success border border-success",
  secondary: "bg-accent-secondary text-muted-secondary hover:opacity-90 border border-transparent",
  ghost: "bg-transparent text-muted border border-gray-200 hover:bg-light hover:text-primary",
  camera: "bg-primary text-white hover:opacity-90 border border-primary",
  upload: "bg-accent text-primary hover:bg-soft-info border border-accent",
};

const buttonStyles = {
  sm: "px-2 py-1 lg:px-4 lg:py-2 text-sm",
  md: "px-3 py-2 lg:px-5 lg:py-3 lg:text-base",
  large: "px-4 py-3 lg:px-6 lg:py-4 md:text-lg",
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
  loading = false,
}: IButtonProps) => {
  const iconIsLeft = iconPosition === "left";
  const busy = Boolean(disabled || loading);
  return (
    <button
      type={type}
      onClick={clickFunc}
      disabled={busy}
      aria-busy={loading || undefined}
      className={`${buttonStyles[size]} rounded-full font-bold ${variantStlyes[variant]} ${!widthFill ? "" : "w-full px-auto"} flex items-center justify-center gap-2 hover:shadow-lg transition group cursor-pointer disabled:opacity-50 
        disabled:cursor-not-allowed 
        disabled:pointer-events-none 
        disabled:shadow-none
        ${!busy ? "cursor-pointer" : ""} ${styleClass}`}
    >
      {loading ? (
        <span className="rap-spinner size-4 border-2" />
      ) : (
        iconIsLeft && icon && (
          <span className="group-hover:translate-x-2 transition-transform duration-300">
            {icon}
          </span>
        )
      )}
      <span>{btnText}</span>
      {!loading && !iconIsLeft && icon && (
        <span className="group-hover:translate-x-2 transition-transform duration-300">
          {icon}
        </span>
      )}
    </button>
  );
};

export default RaButton;
