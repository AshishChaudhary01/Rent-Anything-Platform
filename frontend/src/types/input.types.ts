import type { UseFormRegisterReturn } from "react-hook-form";

export interface IInput {
  type?: "text" | "password" | "email" | "date" | "time" | "datetime-local";
  label?: string;
  name: string;
  Icon?: React.ElementType;
  placeholderText?: string;
  value?: string;
  min?: string;
  max?: string;
  registration?: UseFormRegisterReturn;
  error?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export interface IOTPInput {
  length?: number;
  onComplete: (top: string) => void;
  isError?: boolean;
  isLoading?: boolean;
  email?: string;
  onResend?: () => void;
}
