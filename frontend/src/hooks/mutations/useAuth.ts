import { authKeys } from "../../lib/queryKeys";
import { googleAuth, loginUser, registerUser } from "../../services/auth.service";
import { useAuthStore } from "../../store/authStore";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

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

  return useMutation({
    mutationFn: loginUser,
    onSuccess: (data) => {
      setAuth(data.accessKey, data.role, data.userId, data.isActive);
      queryClient.setQueryData(authKeys.currentUser(), data);
    },
    onError: (error) => {
      console.error("Login failed", error);
    },
  });
};

export const useGoogleAuth = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);

  return useMutation({
    mutationFn: (idToken: string) => googleAuth(idToken),
    onSuccess: (data) => {
      setAuth(
        data.data.access_token,
        data.data.role,
        data.data.userId,
        data.data.isActive,
      );
      queryClient.setQueryData(authKeys.currentUser(), data);

      if (data.data.role === "USER") {
        navigate("/user/dashboard");
      } else {
        navigate("/admin/dashboard");
      }
    },
    onError: (error) => {
      console.error("Google OAuth failed: ", error);
    },
  });
};
