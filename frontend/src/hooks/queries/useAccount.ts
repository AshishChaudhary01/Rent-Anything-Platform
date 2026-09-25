import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useNavigate } from "react-router-dom"
import { raToast } from "../../lib/raToast"
import { authKeys } from "../../lib/queryKeys"
import {
  changePassword,
  fetchMe,
  logoutUser,
  updateContact,
  updateProfile,
  uploadAvatar,
  submitKyc,
} from "../../services/account.service"
import { useAccountStore } from "../../store/accountStore"
import { useAuthStore } from "../../store/authStore"

export function useMe() {
  const accessToken = useAuthStore((s) => s.accessToken)
  const hydrate = useAccountStore((s) => s.hydrateFromMe)

  return useQuery({
    queryKey: authKeys.currentUser(),
    queryFn: async () => {
      const me = await fetchMe()
      hydrate(me)
      return me
    },
    enabled: Boolean(accessToken),
    retry: false,
  })
}

export function useUpdateProfile() {
  const queryClient = useQueryClient()
  const hydrate = useAccountStore((s) => s.hydrateFromMe)

  return useMutation({
    mutationFn: updateProfile,
    onSuccess: (me) => {
      hydrate(me)
      queryClient.setQueryData(authKeys.currentUser(), me)
    },
  })
}

export function useUpdateContact() {
  const queryClient = useQueryClient()
  const hydrate = useAccountStore((s) => s.hydrateFromMe)

  return useMutation({
    mutationFn: updateContact,
    onSuccess: (me) => {
      hydrate(me)
      queryClient.setQueryData(authKeys.currentUser(), me)
    },
  })
}

export function useChangePassword() {
  return useMutation({
    mutationFn: changePassword,
  })
}

export function useUploadAvatar() {
  const queryClient = useQueryClient()
  const hydrate = useAccountStore((s) => s.hydrateFromMe)

  return useMutation({
    mutationFn: uploadAvatar,
    onSuccess: (me) => {
      hydrate(me)
      queryClient.setQueryData(authKeys.currentUser(), me)
    },
  })
}

export function useSubmitKyc() {
  const queryClient = useQueryClient()
  const hydrate = useAccountStore((s) => s.hydrateFromMe)

  return useMutation({
    mutationFn: submitKyc,
    onSuccess: (me) => {
      hydrate(me)
      queryClient.setQueryData(authKeys.currentUser(), me)
    },
  })
}

export function useLogout() {
  const queryClient = useQueryClient()
  const clearAuth = useAuthStore((s) => s.clearAuth)
  const resetAccount = useAccountStore((s) => s.reset)
  const navigate = useNavigate()

  return useMutation({
    mutationFn: logoutUser,
    onSettled: () => {
      clearAuth()
      resetAccount()
      queryClient.removeQueries({ queryKey: authKeys.all() })
      raToast.info("Signed out")
      navigate("/auth/login")
    },
  })
}
