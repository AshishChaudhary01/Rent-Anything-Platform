import { Link, useNavigate } from "react-router-dom";
import RaContainerXS from "../../../components/container/RaContainerXS"
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import axios from "axios";
import RaInput from "../../../components/input/RaInput";
import { IoLockClosedOutline, IoMailOutline, IoPersonOutline } from "react-icons/io5";
import RaButton from "../../../components/button/RaButton";
import GoogleAuthButton from "../../../components/button/GoogleAuthButton";
import { useRegister } from "../../../hooks/mutations/useAuth";
import { userRegisterBody, type UserRegisterType } from "../../../types/user.types";

function Register() {
  const navigate = useNavigate();
  const { mutate: registerUser, isPending } = useRegister();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<UserRegisterType>({
    resolver: zodResolver(userRegisterBody),
    defaultValues: {
      role: "USER",
    },
  });

  const handleRegister = (data: UserRegisterType) => {
    registerUser(data, {
      onSuccess: () => {
        navigate("/auth/login");
        toast.success("Account created. Please check your email.");
      },
      onError: (error) => {
        if (axios.isAxiosError(error)) {
          const message =
            error.response?.data?.details ??
            error.response?.data?.message ??
            "Something went wrong.";
          toast.error(message);
        } else {
          toast.error("Something went wrong.");
        }
      },
    });
  };

  return (
    <RaContainerXS>
      <div className="flex flex-col gap-y-6">
        <div className="flex flex-col gap-y-4">
          <p className="text-2xl font-bold md:text-4xl md:font-extrabold">Create your account</p>
          <p className="font-extralight text-sm md:font-light md:text-base text-muted">Your account will be created immediately.</p>
        </div>
        <form
          onSubmit={handleSubmit(handleRegister)}
          className="flex flex-col gap-y-2"
        >

          {/* Full name */}
          <RaInput
            type="text"
            label="Full name"
            name="fullName"
            placeholderText="Romesh Bhattarai"
            Icon={IoPersonOutline}
            registration={register("fullName")}
            error={errors.fullName?.message}
          />
          {/* Email */}
          <RaInput
            type="email"
            label="Email"
            name="email"
            placeholderText="you@example.com"
            Icon={IoMailOutline}
            registration={register("email")}
            error={errors.email?.message}
          />
          {/* Password */}
          <RaInput
            type="password"
            label="Password"
            name="password"
            placeholderText="********"
            Icon={IoLockClosedOutline}
            registration={register("password")}
            error={errors.password?.message}
          />

          {/* Terms*/}
          {/* <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
            required
              type="checkbox"
              className="w-4 h-4 rounded-full cursor-pointer"
            />
            <span className="text-sm text-gray-500">
              I agree to RAP's{" "}
              <Link
                to="/terms"
                className="text-black/90 font-semibold hover:underline"
              >
                Terms
              </Link>{" "}
              and{" "}
              <Link
                to="/privacy"
                className="text-black/90 font-semibold hover:underline"
              >
                Privacy Policy
              </Link>
            </span>
          </label> */}

          {/* Register */}
          <RaButton
            type="submit"
            btnText={isPending ? "Creating account " : "Create account"}
            variant="primary" disabled={isSubmitting || isPending}
            styleClass="mt-6"
          />
        </form>

        {/* Divider */}
        <div className="flex items-center gap-3">
          <div className="flex-1 h-px bg-gray-200" />
          <span className="text-sm text-gray-400">OR</span>
          <div className="flex-1 h-px bg-gray-200" />
        </div>

        {/* Google */}
        <GoogleAuthButton label="Sign up With Google" />

        {/* Signup */}
        <div className="text-muted text-sm font-light text-center">
          Already have an account?
          <span className="text-primary">
            <Link to={"/auth/login"} className="font-semibold"> Login</Link>
          </span>
        </div>
      </div>
    </RaContainerXS>
  )
}

export default Register