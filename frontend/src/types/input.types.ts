import type { UseFormRegisterReturn } from "react-hook-form";

export interface IInput {
  type?: "text" | "password" | "email";
  label?: string;
  name: string;
  Icon?: React.ElementType;
  placeholderText?: string;
  registration?: UseFormRegisterReturn;
  error?: string;
}

export interface IOTPInput {
  length?: number;
  onComplete: (top: string) => void;
  isError?: boolean;
  isLoading?: boolean;
  email?: string;
  onResend?: () => void;
}
