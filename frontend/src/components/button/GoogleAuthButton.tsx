import { useGoogleLogin } from "@react-oauth/google";
import { raToast } from "../../lib/raToast";
import { useGoogleAuth } from "../../hooks/mutations/useAuth";

interface IGoogleAuthButtonProp {
  label: string;
}

const GoogleAuthButton = ({ label }: IGoogleAuthButtonProp) => {
  const { mutate: googleAuthMutate, isPending } = useGoogleAuth();
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

  const handleGoogleAuth = useGoogleLogin({
    onSuccess: (tokenResponse) => {
      googleAuthMutate(tokenResponse.access_token, {
        onSuccess: () => {
          raToast.success("Signed in with Google");
        },
        onError: (error) => {
          raToast.fromError(error);
        },
      });
    },
    onError: () => {
      raToast.error("Google login failed. Please try again.");
    },
  });

  return (
    <button
      type="button"
      onClick={() => {
        if (!clientId) {
          raToast.error("Google sign-in is not configured.");
          return;
        }
        handleGoogleAuth();
      }}
      disabled={isPending}
      className="w-full flex items-center justify-center gap-2 rounded-full px-5 py-3 lg:text-base text-sm font-semibold bg-white drop-shadow-sm hover:drop-shadow-lg transition duration-300 cursor-pointer disabled:opacity-50"
    >
      <img
        src="https://www.svgrepo.com/show/475656/google-color.svg"
        alt="Google"
        className="w-4 h-4"
      />
      <span>{isPending ? "Please wait..." : label}</span>
    </button>
  );
};

export default GoogleAuthButton;
