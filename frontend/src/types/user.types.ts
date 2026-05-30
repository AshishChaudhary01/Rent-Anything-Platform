import {
  requiredEmail,
  requiredPassword,
  requiredString,
} from "../schemas/zod.schema";
import { z } from "zod";

export const RoleEnumSchema = z.enum(["USER", "ADMIN"], {
  error: "Value of USER / ADMIN only",
});

export const userRegisterBody = z.object({
  fullName: requiredString("full name"),
  email: requiredEmail(),
  password: requiredPassword(),
  role: RoleEnumSchema.nonoptional(),
});

export type UserRegisterType = z.infer<typeof userRegisterBody>;

export const userLoginBody = z.object({
  email: requiredEmail(),
  password: requiredPassword(),
});

export type UserLoginType = z.infer<typeof userLoginBody>;

export const UserResponse = z.object({
  id: z.string().uuid(),
  fullName: z.string(),
  email: z.string().email(),
  role: RoleEnumSchema,
  createdAt: z.string().datetime(),
  isActive: z.boolean(),
  accountLocked: z.boolean(),
  lockedAt: z.string().datetime(),
});

export type UserResponseType = z.infer<typeof UserResponse>;

export const AuthReponse = z.object({
  accessKey: z.string(),
  role: RoleEnumSchema,
  userId: z.string().uuid(),
  isActive: z.boolean(),
});

export type AuthReponseType = z.infer<typeof AuthReponse>;
