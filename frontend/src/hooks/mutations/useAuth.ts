import { authKeys } from "../../lib/queryKeys";
import { googleAuth, loginUser, registerUser } from "../../services/auth.service";
import { useAuthStore } from "../../store/authStore";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { demoAdminAccounts } from "../../data/admin";

function homeForRole(role: string) {
  return role === "USER" ? "/user" : "/admin";
}

export const useRegister = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: registerUser,
    onSuccess: (data) => {
      queryClient.setQueryData(authKeys.currentUser(), data);
    },
    onError: (error) => {
      console.error("Registration failed", error);
    },
  });
};

export const useLogin = () => {
  const queryClient = useQueryClient();
  const setAuth = useAuthStore((state) => state.setAuth);
  const navigate = useNavigate();

  return useMutation({
    mutationFn: loginUser,
    onSuccess: (data) => {
      setAuth(data.accessKey, data.role, data.userId, data.isActive);
      queryClient.setQueryData(authKeys.currentUser(), data);
      navigate(homeForRole(data.role));
    },
    onError: (error) => {
      console.error("Login failed", error);
    },
  });
};

export function tryLocalAdminLogin(email: string, password: string) {
  const match = demoAdminAccounts.find(
    (account) => account.email.toLowerCase() === email.trim().toLowerCase() && account.password === password,
  )
  return match ?? null
}

export const useGoogleAuth = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);

  return useMutation({
    mutationFn: (idToken: string) => googleAuth(idToken),
    onSuccess: (data) => {
      const role = data.data.role;
      setAuth(
        data.data.access_token,
        role,
        data.data.userId,
        data.data.isActive,
      );
      queryClient.setQueryData(authKeys.currentUser(), data);
      navigate(homeForRole(role));
    },
    onError: (error) => {
      console.error("Google OAuth failed: ", error);
    },
  });
};
