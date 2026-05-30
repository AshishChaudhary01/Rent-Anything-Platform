import { IoEyeOffOutline, IoEyeOutline } from "react-icons/io5";
import type { IInput } from "../../types/input.types";
import { useState } from "react";

const RaInput = ({
  type = "text",
  label,
  name,
  Icon,
  placeholderText,
  registration,
  error,
}: IInput) => {
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const isPassword = type === "password";

  return (
    <div className="grid gap-3">
      <label htmlFor={name} className="font-medium text-text-dark">
        {label}
      </label>
      <div className="bg-surface border border-muted/20 p-3 rounded-full flex items-center gap-3 focus-within:border-muted/80 focus-within:bg-gray-200 transition-colors duration-300">
        <span>{Icon && <Icon className="stroke-muted/70 size-4" />}</span>
        <input
          className="border-0 outline-0 w-full placeholder:text-muted/50"
          type={isPassword ? (showPassword ? "text" : "password") : type}
          id={name}
          name={name}
          placeholder={placeholderText}
          {...registration}
        />
        {isPassword && (
          <span>
            {showPassword ? (
              <IoEyeOffOutline
                className="cursor-pointer"
                onClick={() => setShowPassword((prev) => !prev)}
              />
            ) : (
              <IoEyeOutline
                className="cursor-pointer"
                onClick={() => setShowPassword((prev) => !prev)}
              />
            )}
          </span>
        )}
      </div>
      {error && <span className="text-danger text-xs">{error}</span>}
    </div>
  );
};

export default RaInput;