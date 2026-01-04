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
import { Button } from "@/components/ui/button";

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

  const { register, handleSubmit, setValue } = useForm<Inputs>();

  // 🔐 DEMO CREDENTIALS
  const ADMIN_CREDENTIAL = {
    email: "admin@gmail.com",
    password: "Admin@123",
  };

  const MANAGER_CREDENTIAL = {
    email: "manager@gmail.com",
    password: "Manager@123",
  };

  // ------------------------
  // Auto Fill Handlers
  // ------------------------
  const fillAdminCredential = () => {
    setValue("email", ADMIN_CREDENTIAL.email);
    setValue("password", ADMIN_CREDENTIAL.password);
  };

  const fillManagerCredential = () => {
    setValue("email", MANAGER_CREDENTIAL.email);
    setValue("password", MANAGER_CREDENTIAL.password);
  };

  // ------------------------
  // Submit Handler
  // ------------------------
  const onsubmit: SubmitHandler<Inputs> = async (data) => {
    try {
      setIsLoading(true);
      const userRes = await login(data.email, data.password);

      const tokenRes = await axiosPublic.post("/api/auth/jwt", {
        email: userRes.user.email,
        name: userRes.user.displayName || "User",
        photoURL: userRes.user.photoURL || "",
      });

      localStorage.setItem("jwt_token", tokenRes.data.token);
      toast.success("Login Successful!");
      navigate(from, { replace: true });
    } catch (error: any) {
      handleAuthError(error);
    } finally {
      setIsLoading(false);
    }
  };

  // ------------------------
  // Google Login
  // ------------------------
  const handleGoogleLogin = async () => {
    try {
      setIsLoading(true);
      const userRes = await googleLogin();

      const tokenRes = await axiosPublic.post("/api/auth/jwt", {
        email: userRes.user.email,
        name: userRes.user.displayName || "User",
        photoURL: userRes.user.photoURL || "",
      });

      localStorage.setItem("jwt_token", tokenRes.data.token);
      toast.success("Google Login Successful!");
      navigate(from, { replace: true });
    } catch (error: any) {
      handleAuthError(error);
    } finally {
      setIsLoading(false);
    }
  };

  // ------------------------
  // Firebase Error Handler
  // ------------------------
  const handleAuthError = (error: any) => {
    switch (error.code) {
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
        toast.warning("Google login cancelled.");
        break;
      default:
        toast.error("Authentication failed.");
        console.log(error);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-black flex justify-center items-center">
      <div className="w-full max-w-md space-y-4 p-8">
        {/* Header */}
        <div className="text-center">
          <div className="w-12 h-12 bg-linear-to-r from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-4">
            <ShieldIcon className="text-white" />
          </div>
          <h2 className="text-3xl font-bold">Sign In</h2>
          <p className="text-gray-500">Access your secure account</p>
        </div>

        {/* Quick Login */}
        <div className="grid grid-cols-2 gap-4">
          <Button type="button" variant="outline" onClick={fillAdminCredential}>
            Login as Admin
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={fillManagerCredential}
          >
            Login as Manager
          </Button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onsubmit)} className="space-y-4">
          {/* Email */}
          <div>
            <label className="text-sm">Email</label>
            <div className="relative">
              <AtSignIcon className="absolute left-3 top-3 text-gray-400" />
              <input
                {...register("email")}
                type="email"
                className="w-full pl-10 py-3 border rounded-lg"
                placeholder="you@example.com"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="text-sm">Password</label>
            <div className="relative">
              <LockIcon className="absolute left-3 top-3 text-gray-400" />
              <input
                {...register("password")}
                type={showPassword ? "text" : "password"}
                className="w-full pl-10 pr-12 py-3 border rounded-lg"
                placeholder="••••••••"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-3 top-3"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOffIcon /> : <EyeIcon />}
              </Button>
            </div>
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className=" w-full flex-1 bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
          >
            {isLoading ? "Processing..." : "Sign In"}
          </Button>
        </form>

        <div className="flex items-center gap-3  ">
          <div className="flex-1 h-px bg-gray-300 dark:bg-gray-700" />
          <span className="text-xs text-gray-500 uppercase tracking-wide">
            or
          </span>
          <div className="flex-1 h-px bg-gray-300 dark:bg-gray-700" />
        </div>

        {/* Google */}
        <Button
          onClick={handleGoogleLogin}
          disabled={isLoading}
          className="w-full"
          variant="outline"
        >
          <GoogleIcon />
          <span className="ml-2">Continue with Google</span>
        </Button>

        {/* Register */}
        <p className="text-center text-sm">
          New user?{" "}
          <Link to="/register" className="text-indigo-600 font-medium">
            Create account
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
