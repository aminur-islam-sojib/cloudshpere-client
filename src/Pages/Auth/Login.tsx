import {
  AtSignIcon,
  EyeIcon,
  EyeOffIcon,
  LockIcon,
  ShieldIcon,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { Link } from "react-router";
import { useForm, type SubmitHandler } from "react-hook-form";
import { useAuth } from "@/Context/AuthContext";
import useGenerateToken from "@/Hooks/useGenerateToken";
import type { User } from "firebase/auth";
import axiosPublic from "@/Hooks/axiosPublic";
import { toast } from "sonner";

const GoogleIcon: React.FC = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
  >
    <path
      fill="#4285F4"
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
    />
    <path
      fill="#34A853"
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
    />
    <path
      fill="#FBBC05"
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
    />
    <path
      fill="#EA4335"
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
    />
  </svg>
);

type Inputs = {
  email: string;
  password: string;
};

// Main Component
const Login: React.FC = () => {
  const { googleLogin, login } = useAuth();
  const [user, setUser] = useState<User | null>();
  const [showPassword, setShowPassword] = useState<boolean>(false);

  useGenerateToken(user);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  const { register, handleSubmit } = useForm<Inputs>();

  const onsubmit: SubmitHandler<Inputs> = async (data) => {
    console.log(data);

    try {
      const userRes = await login(data.email, data.password);
      console.log(userRes);
      setUser(userRes.user);
    } catch (error) {
      console.log(error);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const userRes = await googleLogin();
      console.log(userRes);
      const userData = userRes.user;
      setUser(userData);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (user) {
      const payloads = {
        name: user.displayName,
        email: user.email,
        password: "GoogleLogin",
      };

      const fetchData = async () => {
        try {
          await axiosPublic.post("/api/users", payloads);
          toast.success("User Added Successfully!");
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
          if (error.response) {
            // Server responded with an error
            const status = error.response.status;

            if (status === 400) {
              toast.warning(`Bad Request : "${error.response.data.message}"`);
            } else if (status === 409) {
              console.log("User already exists!");
              toast.info("User Already Exist");
            } else {
              console.log("Server Error:", error.response.data);
            }
          } else if (error.request) {
            // No response from server
            toast.error("No response from server");
          } else {
            // Other unexpected errors
            toast.error("Error:", error.message);
            console.log("Error:", error.message);
          }
        }
      };

      fetchData();
    }
  }, [user]);

  return (
    <div className="min-h-screen bg-white dark:bg-black flex justify-center items-center">
      {/* Right side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md space-y-8">
          {/* Header */}
          <div className="text-center">
            <div className="w-12 h-12 bg-linear-to-r from-indigo-600 to-purple-600 dark:from-indigo-500 dark:to-purple-500 rounded-xl flex items-center justify-center mx-auto mb-6">
              <ShieldIcon />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
              Sign in
            </h2>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              Access your secure account
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onsubmit)} className="space-y-6">
            {/* Email Input */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Email address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 dark:text-gray-500">
                  <AtSignIcon />
                </div>
                <input
                  id="email"
                  type="email"
                  {...register("email")}
                  placeholder="you@example.com"
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-black text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent transition-all duration-200"
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label
                htmlFor="password"
                {...register("password")}
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 dark:text-gray-500">
                  <LockIcon />
                </div>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  className="block w-full pl-10 pr-12 py-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-black text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent transition-all duration-200"
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                >
                  {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                </button>
              </div>
            </div>

            {/* Remember & Forgot */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 dark:focus:ring-indigo-400 border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-900"
                />
                <label
                  htmlFor="remember-me"
                  className="ml-2 block text-sm text-gray-700 dark:text-gray-300"
                >
                  Keep me signed in
                </label>
              </div>
              <a
                href="#"
                className="text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300 transition-colors"
              >
                Reset password
              </a>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-linear-to-r from-indigo-600 to-purple-600 dark:from-indigo-500 dark:to-purple-500 text-white font-semibold py-3 px-4 rounded-lg hover:from-indigo-700 hover:to-purple-700 dark:hover:from-indigo-600 dark:hover:to-purple-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 transform transition-all duration-200 hover:scale-[1.01] shadow-lg"
            >
              Sign in to your account
            </button>
          </form>
          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300 dark:border-gray-700"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white dark:bg-black text-gray-500 dark:text-gray-400">
                Or sign in with email
              </span>
            </div>
          </div>
          {/* Social Login */}
          <div className="space-y-3">
            <button
              onClick={handleGoogleLogin}
              className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors font-medium"
            >
              <GoogleIcon />
              <span className="ml-3">Continue with Google</span>
            </button>
          </div>

          {/* Footer */}
          <div className="text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              New to our platform?{" "}
              <Link
                to={"/register"}
                className="font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300 transition-colors"
              >
                Create an account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
