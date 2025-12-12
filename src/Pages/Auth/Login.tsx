/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  AtSignIcon,
  EyeIcon,
  EyeOffIcon,
  LockIcon,
  ShieldIcon,
} from "lucide-react";
import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import { useForm, type SubmitHandler } from "react-hook-form";
import { useAuth } from "@/Context/AuthContext";
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
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 
      1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 
      3.28-8.09z"
    />
    <path
      fill="#34A853"
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 
      1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 
      20.53 7.7 23 12 23z"
    />
    <path
      fill="#FBBC05"
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 
      8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
    />
    <path
      fill="#EA4335"
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 
      2.09 14.97 1 12 1 7.7 1 3.99 
      3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
    />
  </svg>
);

type Inputs = {
  email: string;
  password: string;
};

const Login: React.FC = () => {
  const { googleLogin, login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const from = location.state?.from || "/";
  const { register, handleSubmit } = useForm<Inputs>();

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const onsubmit: SubmitHandler<Inputs> = async (data) => {
    try {
      setIsLoading(true);
      const userRes = await login(data.email, data.password);

      // Generate token immediately after successful login
      try {
        const tokenRes = await axiosPublic.post("/api/auth/jwt", {
          email: userRes.user.email,
          name: userRes.user.displayName || "User",
          photoURL: userRes.user.photoURL || "",
        });
        const token = tokenRes.data.token;
        localStorage.setItem("jwt_token", token);
        toast.success("Login Successful!");
        navigate(from, { replace: true });
      } catch (tokenError) {
        console.error("Token generation error:", tokenError);
        toast.error("Failed to generate authentication token");
      }
    } catch (error: any) {
      handleAuthError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setIsLoading(true);
      const userRes = await googleLogin();

      // Generate token immediately after Google login
      try {
        const tokenRes = await axiosPublic.post("/api/auth/jwt", {
          email: userRes.user.email,
          name: userRes.user.displayName || "User",
          photoURL: userRes.user.photoURL || "",
        });
        const token = tokenRes.data.token;
        localStorage.setItem("jwt_token", token);
        toast.success("Google Login Successful!");
        navigate(from, { replace: true });
      } catch (tokenError) {
        console.error("Token generation error:", tokenError);
        toast.error("Failed to generate authentication token");
      }
    } catch (error: any) {
      handleAuthError(error);
    } finally {
      setIsLoading(false);
    }
  };

  // ------------------------
  // Handle Firebase Errors
  // ------------------------
  const handleAuthError = (error: any) => {
    const code = error.code;

    switch (code) {
      case "auth/invalid-credential":
        toast.error("Invalid email or password.");
        break;
      case "auth/user-not-found":
        toast.error("User not found.");
        break;
      case "auth/wrong-password":
        toast.error("Incorrect password.");
        break;
      case "auth/popup-closed-by-user":
        toast.warning("Google login popup closed.");
        break;
      default:
        toast.error("Authentication error. Try again.");
        console.log("Firebase Error:", error);
    }
  };

  // ========================
  // User already authenticated in handlers
  // Token is generated immediately on login/Google auth
  // ========================

  return (
    <div className="min-h-screen bg-white dark:bg-black flex justify-center items-center">
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md space-y-8">
          {/* Logo + Title */}
          <div className="text-center">
            <div className="w-12 h-12 bg-linear-to-r from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-6">
              <ShieldIcon className="text-white" />
            </div>
            <h2 className="text-3xl font-bold">Sign In</h2>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              Access your secure account
            </p>
          </div>

          {/* LOGIN FORM */}
          <form onSubmit={handleSubmit(onsubmit)} className="space-y-6">
            {/* Email */}
            <div>
              <label className="block text-sm mb-2">Email address</label>
              <div className="relative">
                <AtSignIcon className="absolute left-3 top-3 text-gray-400" />
                <input
                  {...register("email")}
                  type="email"
                  placeholder="you@example.com"
                  className="w-full pl-10 pr-3 py-3 border rounded-lg bg-white dark:bg-black"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm mb-2">Password</label>
              <div className="relative">
                <LockIcon className="absolute left-3 top-3 text-gray-400" />
                <input
                  {...register("password")}
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  className="w-full pl-10 pr-12 py-3 border rounded-lg bg-white dark:bg-black"
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute right-3 top-3 text-gray-500"
                >
                  {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-linear-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-lg font-semibold hover:opacity-90 transition"
            >
              {isLoading ? "Processing..." : "Sign In"}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center">
            <div className="grow border-t"></div>
            <span className="mx-2 text-gray-500">Or continue with</span>
            <div className="grow border-t"></div>
          </div>

          {/* Google Login */}
          <button
            onClick={handleGoogleLogin}
            disabled={isLoading}
            className="w-full flex items-center justify-center border py-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition"
          >
            <GoogleIcon />
            <span className="ml-3">Continue with Google</span>
          </button>

          {/* Register Link */}
          <div className="text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              New user?{" "}
              <Link to="/register" className="text-indigo-600 font-medium">
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
