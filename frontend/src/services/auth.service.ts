import { api } from "../config/api";
import type {
  UserResponseType,
  UserLoginType,
  UserRegisterType,
  AuthReponseType,
} from "../types/user.types";

export const registerUser = async (
  payload: UserRegisterType,
): Promise<UserResponseType> => {
  const { data } = await api.post("/auth/register", payload);

  return data;
};

export const loginUser = async (
  payload: UserLoginType,
): Promise<AuthReponseType> => {
  const { data } = await api.post("/auth/login", payload);

  return data;
};

export const googleAuth = async (accessToken: string): Promise<AuthReponseType> => {
  const { data } = await api.post("/auth/google", { accessToken });
  return data;
};
