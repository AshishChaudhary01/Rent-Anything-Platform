import { Link } from "react-router-dom"
import RaButton from "../../../components/button/RaButton"
import RaContainerXS from "../../../components/container/RaContainerXS"
import GoogleAuthButton from "../../../components/button/GoogleAuthButton"
import z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLogin } from "../../../hooks/mutations/useAuth";
import { toast } from "sonner";
import axios from "axios";
import RaInput from "../../../components/input/RaInput";
import { IoLockClosedOutline, IoMailOutline } from "react-icons/io5";

const loginSchema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  keepSignedIn: z.boolean().optional(),
});

type LoginFormData = z.infer<typeof loginSchema>;

const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const { mutate: loginUser, isPending } = useLogin();

  const handleLogin = async (data: LoginFormData) => {
    loginUser(data, {
      onSuccess: () => {
        toast.success("User authenticated!");
      },
      onError(error) {
        if (axios.isAxiosError(error)) {
          const message =
            error.response?.data?.details ??
            error.response?.data?.message ??
            "something went wrong";
          toast.error(message);
        } else {
          toast.error("Something went wrong");
          console.error(error);
        }
      },
    });
  };

  return (
    <RaContainerXS>
      <div className="flex flex-col gap-y-6">
        <div className="flex flex-col gap-y-4">
          <p className="text-2xl font-bold md:text-4xl md:font-extrabold">Welcome back.</p>
          <p className="font-extralight text-sm md:font-light md:text-base text-muted">Login to manage rentals and discover thousands of items nearby.</p>
        </div>
        <form
          onSubmit={handleSubmit(handleLogin)}
          className="flex flex-col gap-y-2"
        >

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

          {/* Keep signed in */}
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              className="w-4 h-4 border border-muted/30 cursor-pointer"
            />
            <span className="text-sm text-gray-500">Keep me signed in</span>
          </label>

          <Link to={""} className="text-primary text-end">Forgot password?</Link>

          {/* Login */}
          <RaButton type="submit" btnText="Login" variant="primary" />
        </form>


        {/* Divider */}
        <div className="flex items-center gap-3">
          <div className="flex-1 h-px bg-gray-200" />
          <span className="text-sm text-gray-400">OR</span>
          <div className="flex-1 h-px bg-gray-200" />
        </div>

        {/* Google */}
        <GoogleAuthButton label="Login With Google" />

        {/* Signup */}
        <div className="text-muted text-sm font-light text-center">
          Don't have an account?
          <span className="text-primary">
            <Link to={"/auth/register"} className="font-semibold"> Signup</Link>
          </span>
        </div>
      </div>
    </RaContainerXS>
  )
}

export default Login