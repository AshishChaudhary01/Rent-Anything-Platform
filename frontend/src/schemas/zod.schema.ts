import { z } from "zod";

export const requiredString = (label: string) =>
  z
    .string({ error: `Provide string value for ${label}` })
    .nonempty()
    .nonoptional();

export const requiredEmail = () =>
  z.string().email({ error: "Invalid email format" }).nonoptional();

export const requiredPassword = () =>
  z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .regex(
      /[^a-zA-Z0-9]/,
      "Password must contain at least one special character",
    )
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[0-9]/, "Password must contain at least one digit")
    .nonempty()
    .nonoptional();
