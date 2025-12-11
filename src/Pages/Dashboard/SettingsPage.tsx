/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Settings, Bell, Lock, Globe, Eye, EyeOff } from "lucide-react";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useAuth } from "@/Context/AuthContext";
import { toast } from "sonner";
import {
  updateProfile,
  updateEmail,
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider,
} from "firebase/auth";

type UserData = {
  name: string;
  email: string;
};

type PasswordForm = {
  currentPass: string;
  newPass: string;
  confirmPass: string;
};

type ThemeForm = {
  theme: "light" | "dark" | "auto";
};

const SettingsPage = () => {
  const { user } = useAuth();

  const { register, handleSubmit, reset } = useForm<UserData>();
  const passwordForm = useForm<PasswordForm>();
  const themeForm = useForm<ThemeForm>({
    defaultValues: {
      theme:
        ((localStorage.getItem("theme") as "light" | "dark" | "auto") ||
          "auto") ??
        "auto",
    },
  });

  // Password visibility toggles
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // Auto-fill user data when Firebase user loads
  useEffect(() => {
    if (user) {
      reset({
        name: user.displayName || "",
        email: user.email || "",
      });
    }
  }, [user, reset]);

  // ------------------------------------------------------
  // UPDATE BASIC USER INFO (NAME + EMAIL) USING FIREBASE
  // ------------------------------------------------------
  const onSubmitUser = async (data: UserData) => {
    if (!user) return;

    try {
      // Update Name
      if (data.name && data.name !== user.displayName) {
        await updateProfile(user, { displayName: data.name });
        toast.success("Name updated successfully!");
      }

      // Update Email
      if (data.email && data.email !== user.email) {
        await updateEmail(user, data.email);
        toast.success("Email updated successfully!");
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to update user info");
    }
  };

  // ------------------------------------------------------
  // UPDATE PASSWORD (NEEDS REAUTH)
  // ------------------------------------------------------
  const onSubmitPassword = async (data: PasswordForm) => {
    if (!user || !user.email) return;

    if (data.newPass !== data.confirmPass) {
      toast.error("New password and confirm password do not match!");
      return;
    }

    try {
      // Re-authenticate user
      const credential = EmailAuthProvider.credential(
        user.email,
        data.currentPass
      );
      await reauthenticateWithCredential(user, credential);

      // Update password
      await updatePassword(user, data.newPass);
      toast.success("Password changed successfully!");

      passwordForm.reset();
    } catch (err: any) {
      toast.error(err.message || "Password update failed");
    }
  };

  // ------------------------------------------------------
  // UPDATE THEME (LOCAL ONLY)
  // ------------------------------------------------------
  const onSubmitTheme = (data: ThemeForm) => {
    localStorage.setItem("theme", data.theme);
    toast.success("Theme updated!");
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold dark:text-white">Settings</h1>
        <p className="text-slate-600 dark:text-slate-400">
          Manage your account and application settings.
        </p>
      </div>

      <div className="space-y-6">
        {/* ======================== ACCOUNT SETTINGS ======================= */}
        <Card>
          <CardHeader>
            <CardTitle className="flex gap-2 items-center">
              <Settings /> Account Settings
            </CardTitle>
            <CardDescription>Update your personal info</CardDescription>
          </CardHeader>

          <form onSubmit={handleSubmit(onSubmitUser)}>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Full Name</label>
                  <input
                    type="text"
                    {...register("name")}
                    className="w-full px-4 py-2 rounded-lg border bg-white dark:bg-slate-800"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">Email</label>
                  <input
                    type="email"
                    {...register("email")}
                    className="w-full px-4 py-2 rounded-lg border bg-white dark:bg-slate-800"
                  />
                </div>
              </div>

              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg">
                Save Changes
              </button>
            </CardContent>
          </form>
        </Card>

        {/* ========================== NOTIFICATIONS ======================== */}
        <Card>
          <CardHeader>
            <CardTitle className="flex gap-2 items-center">
              <Bell /> Notification Preferences
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {["Email", "SMS", "Push"].map((n) => (
              <label key={n} className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" className="w-4 h-4" defaultChecked />
                <span>{n} Notifications</span>
              </label>
            ))}
          </CardContent>
        </Card>

        {/* =========================== SECURITY ============================ */}
        <Card>
          <CardHeader>
            <CardTitle className="flex gap-2 items-center">
              <Lock /> Security Settings
            </CardTitle>
          </CardHeader>

          <form onSubmit={passwordForm.handleSubmit(onSubmitPassword)}>
            <CardContent className="space-y-4">
              {/* Current Password */}
              <div className="relative">
                <label className="text-sm font-medium">Current Password</label>
                <input
                  type={showCurrent ? "text" : "password"}
                  {...passwordForm.register("currentPass")}
                  className="w-full px-4 py-2 border rounded-lg dark:bg-slate-800"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrent(!showCurrent)}
                  className="absolute right-3 top-9"
                >
                  {showCurrent ? <EyeOff /> : <Eye />}
                </button>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                {/* New Password */}
                <div className="relative">
                  <label className="text-sm font-medium">New Password</label>
                  <input
                    type={showNew ? "text" : "password"}
                    {...passwordForm.register("newPass")}
                    className="w-full px-4 py-2 border rounded-lg dark:bg-slate-800"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNew(!showNew)}
                    className="absolute right-3 top-9"
                  >
                    {showNew ? <EyeOff /> : <Eye />}
                  </button>
                </div>

                {/* Confirm Password */}
                <div className="relative">
                  <label className="text-sm font-medium">
                    Confirm Password
                  </label>
                  <input
                    type={showConfirm ? "text" : "password"}
                    {...passwordForm.register("confirmPass")}
                    className="w-full px-4 py-2 border rounded-lg dark:bg-slate-800"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm(!showConfirm)}
                    className="absolute right-3 top-9"
                  >
                    {showConfirm ? <EyeOff /> : <Eye />}
                  </button>
                </div>
              </div>

              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg">
                Change Password
              </button>
            </CardContent>
          </form>
        </Card>

        {/* ============================ APPEARANCE ========================== */}
        <Card>
          <CardHeader>
            <CardTitle className="flex gap-2 items-center">
              <Globe /> Appearance
            </CardTitle>
          </CardHeader>

          <form onSubmit={themeForm.handleSubmit(onSubmitTheme)}>
            <CardContent className="space-y-4">
              <label className="text-sm font-medium">Theme</label>
              <select
                {...themeForm.register("theme")}
                className="w-full px-4 py-2 border rounded-lg dark:bg-slate-800"
              >
                <option value="light">Light</option>
                <option value="dark">Dark</option>
                <option value="auto">Auto</option>
              </select>

              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg">
                Save Theme
              </button>
            </CardContent>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default SettingsPage;
