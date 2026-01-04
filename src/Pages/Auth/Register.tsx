/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { AtSignIcon, EyeIcon, EyeOffIcon, LockIcon, User2 } from "lucide-react";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router";
import { useForm, type SubmitHandler } from "react-hook-form";
import { useAuth } from "@/Context/AuthContext";
import axiosPublic from "@/Hooks/axiosPublic";
import { toast } from "sonner";

type Inputs = {
  name: string;
  email: string;
  password: string;
};

const GoogleIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20">
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

const Register: React.FC = () => {
  const { googleLogin, createUser, loading } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const [avatarPreview, setAvatarPreview] = useState<string>("");
  const [avatarUrl, setAvatarUrl] = useState<string>("");
  const [uploading, setUploading] = useState(false);

  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>();

  // =====================================================
  // HANDLE FIREBASE ERRORS
  // =====================================================
  const handleFirebaseError = (error: any) => {
    switch (error.code) {
      case "auth/email-already-in-use":
        toast.warning("Email already exists!");
        break;
      case "auth/invalid-email":
        toast.warning("Invalid email format!");
        break;
      case "auth/weak-password":
        toast.warning("Password must be at least 6 characters!");
        break;
      case "auth/popup-closed-by-user":
        toast.info("Google popup closed");
        break;
      default:
        toast.error("Something went wrong.");
        console.log(error);
    }
  };

  // =====================================================
  // EMAIL REGISTER SUBMIT
  // =====================================================
  const onsubmit: SubmitHandler<Inputs> = async (data) => {
    if (data.password.length < 6) {
      toast.warning("Password must be at least 6 characters");
      return;
    }

    try {
      const userRes = await createUser(data.email, data.password);

      // Generate token immediately after registration
      try {
        const tokenRes = await axiosPublic.post("/api/auth/jwt", {
          email: userRes.user.email,
          name: data.name,
          photoURL: userRes.user.photoURL || "",
        });
        const token = tokenRes.data.token;
        localStorage.setItem("jwt_token", token);
        toast.success("Registration Successful!");
        navigate("/dashboard", { replace: true });
      } catch (tokenError) {
        console.error("Token generation error:", tokenError);
        toast.error("Failed to generate authentication token");
      }
    } catch (error) {
      handleFirebaseError(error);
    }
  };

  // =====================================================
  // GOOGLE LOGIN
  // =====================================================
  const handleGoogleLogin = async () => {
    try {
      const userRes = await googleLogin();

      // Generate token for Google user
      try {
        const tokenRes = await axiosPublic.post("/api/auth/jwt", {
          email: userRes.user.email,
          name: userRes.user.displayName || "User",
          photoURL: avatarUrl || userRes.user.photoURL || "",
        });
        const token = tokenRes.data.token;
        localStorage.setItem("jwt_token", token);
        toast.success("Google Login Successful!");
        navigate("/dashboard", { replace: true });
      } catch (tokenError) {
        console.error("Token generation error:", tokenError);
        toast.error("Failed to generate authentication token");
      }
    } catch (error) {
      handleFirebaseError(error);
    }
  };

  // =====================================================
  // IMAGE BB PHOTO UPLOAD
  // =====================================================
  const uploadAvatarToImageBB = async (file: File): Promise<string | null> => {
    try {
      setUploading(true);
      const apiKey = import.meta.env.VITE_IMG_BB;
      if (!apiKey) throw new Error("ImageBB key missing");

      const formData = new FormData();
      formData.append("image", file);

      const res = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      return data?.data?.url || null;
    } catch (err) {
      toast.error("Image upload failed");
      return null;
    } finally {
      setUploading(false);
    }
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.warning("Only image files allowed");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.warning("Image must be under 5MB");
      return;
    }

    // Preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setAvatarPreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    // Upload
    const url = await uploadAvatarToImageBB(file);
    if (url) setAvatarUrl(url);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-black flex justify-center items-center">
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md space-y-4">
          {/* Form */}
          <form onSubmit={handleSubmit(onsubmit)} className="space-y-3">
            {/* Avatar Upload */}

            {/* Header */}
            <div className="text-center">
              <div className="flex justify-center">
                <label className="relative cursor-pointer group">
                  <div className="w-24 h-24 rounded-full border-2 border-dashed flex items-center justify-center overflow-hidden bg-gray-100 dark:bg-gray-800">
                    {avatarPreview ? (
                      <img
                        src={avatarPreview}
                        alt="Avatar"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User2 className="text-gray-400" size={40} />
                    )}
                  </div>

                  {/* Overlay */}
                  <div className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-sm transition">
                    {uploading ? "Uploading..." : "Upload"}
                  </div>

                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    className="hidden"
                  />
                </label>
              </div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                Create Account
              </h2>
              <p className="mt-2 text-gray-600 dark:text-gray-400">
                Join our platform
              </p>
            </div>

            {/* Name */}
            <div>
              <label className="block text-sm mb-2">Name</label>
              <div className="relative">
                <User2 className="absolute left-3 top-3 text-gray-400" />
                <input
                  {...register("name", { required: "Name is required" })}
                  className="w-full pl-10 py-3 border rounded-lg"
                  placeholder="Your Name"
                />
              </div>
              {errors.name && (
                <p className="text-red-500 text-sm">{errors.name.message}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm mb-2">Email</label>
              <div className="relative">
                <AtSignIcon className="absolute left-3 top-3 text-gray-400" />
                <input
                  {...register("email", { required: "Email is required" })}
                  className="w-full pl-10 py-3 border rounded-lg"
                  placeholder="you@example.com"
                  type="email"
                />
              </div>
              {errors.email && (
                <p className="text-red-500 text-sm">{errors.email.message}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm mb-2">Password</label>
              <div className="relative">
                <LockIcon className="absolute left-3 top-3 text-gray-400" />
                <input
                  {...register("password", {
                    required: "Password is required",
                    minLength: {
                      value: 6,
                      message: "Password must be at least 6 characters",
                    },
                  })}
                  type={showPassword ? "text" : "password"}
                  className="w-full pl-10 pr-10 py-3 border rounded-lg"
                  placeholder="Enter password"
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute right-3 top-3"
                >
                  {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-sm">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full py-3 bg-indigo-600 text-white rounded-lg shadow"
            >
              {loading ? "Creating..." : "Create Account"}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center">
            <div className="grow border-t"></div>
            <span className="mx-2 text-gray-500">Or </span>
            <div className="grow border-t"></div>
          </div>

          {/* Google */}
          <button
            onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center border py-3 rounded-lg"
          >
            <GoogleIcon />
            <span className="ml-3">Continue with Google</span>
          </button>

          {/* Footer */}
          <p className="text-center text-sm">
            Already have an account?{" "}
            <Link to="/log-in" className="text-indigo-600">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
