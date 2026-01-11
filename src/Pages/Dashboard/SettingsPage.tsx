/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Settings, Globe } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useAuth } from "@/Context/AuthContext";
import { toast } from "sonner";
import { updateProfile, updateEmail } from "firebase/auth";
import { Button } from "@/components/ui/button";

type UserData = {
  name: string;
  email: string;
};

type ThemeForm = {
  theme: "light" | "dark" | "auto";
};

const SettingsPage = () => {
  const { user } = useAuth();

  const { register, handleSubmit, reset } = useForm<UserData>();

  const themeForm = useForm<ThemeForm>({
    defaultValues: {
      theme:
        ((localStorage.getItem("theme") as "light" | "dark" | "auto") ||
          "auto") ??
        "auto",
    },
  });

  // Auto-fill user data when Firebase user loads
  useEffect(() => {
    if (user) {
      reset({
        name: user.displayName || "User",
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
  // UPDATE THEME (LOCAL ONLY)
  // ------------------------------------------------------
  const onSubmitTheme = (data: ThemeForm) => {
    const root = document.documentElement;

    // Apply theme to DOM
    if (data.theme === "dark") {
      root.classList.add("dark");
    } else if (data.theme === "light") {
      root.classList.remove("dark");
    } else {
      // "auto" - check system preference
      const prefersDark =
        window.matchMedia &&
        window.matchMedia("(prefers-color-scheme: dark)").matches;
      if (prefersDark) {
        root.classList.add("dark");
      } else {
        root.classList.remove("dark");
      }
    }

    // Save to localStorage
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

              <Button className=" bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300">
                Save Changes
              </Button>
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

              <Button
                type="submit"
                className=" bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Save Theme
              </Button>
            </CardContent>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default SettingsPage;
