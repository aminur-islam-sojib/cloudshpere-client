/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useMemo } from "react";
import { Outlet, useNavigate, useLocation, Link } from "react-router";
import {
  LayoutDashboard,
  Users,
  Settings,
  BarChart3,
  Menu,
  X,
  Search,
  LogOut,
  Calendar,
  BarChart2,
} from "lucide-react";
import { useAuth } from "@/Context/AuthContext";
import Swal from "sweetalert2";
import { toast } from "sonner";
import useGetRole from "@/Hooks/useGetRole";
import { Button } from "@/components/ui/button";
import UserProfileDropdown from "@/components/Shared/Navbar/UserDropDown";
import AppLoader from "@/components/Shared/Loader/AppLoader";
// import UserProfileDropdown from "@/components/Shared/Navbar/UserDropDown";

// Define navigation item type
interface NavItem {
  icon: any;
  label: string;
  path: string;
  roles?: string[]; // Optional: restrict to specific roles
}

const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const { logOut } = useAuth();
  const { role, isLoading: roleLoading } = useGetRole();

  // Define all possible navigation items with role restrictions
  const allNavItems: NavItem[] = [
    {
      icon: LayoutDashboard,
      label: "Dashboard",
      path: "/dashboard",
      roles: ["admin", "manager", "member"],
    },
    {
      icon: Users,
      label: "All Users",
      path: "/dashboard/users",
      roles: ["admin"], // Only admin can see this
    },
    {
      icon: Calendar,
      label: "Requested  ",
      path: "/dashboard/requested-group",
      roles: ["admin"],
    },
    {
      icon: BarChart3,
      label: "Reports",
      path: "/dashboard/reports",
      roles: ["admin"], // Admin and manager only
    },
    {
      icon: Settings,
      label: "Settings",
      path: "/dashboard/settings",
      roles: ["admin", "manager", "member"],
    },
    {
      icon: BarChart2,
      label: "My Clubs",
      path: "/dashboard/my-clubs",
      roles: ["manager"],
    },
    {
      icon: BarChart2,
      label: "Joined Clubs",
      path: "/dashboard/accessed-club",
      roles: ["admin", "manager", "member"],
    },
  ];

  // Filter navigation items based on user role using useMemo for performance
  const navItems = useMemo(() => {
    if (!role) return [];

    return allNavItems.filter((item) => {
      // If no roles specified, show to everyone
      if (!item.roles || item.roles.length === 0) return true;

      // Check if user's role is in the allowed roles
      return item.roles.includes(role);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [role]);

  const isActive = (path: string) => location.pathname === path;

  const handleLogOut = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "You want to log out of this account!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Log Out!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        await logOut();
        toast.success("Logged Out Successfully!");
        navigate("/login");
      }
    });
  };

  // Show loading state while role is being fetched
  if (roleLoading) {
    return <AppLoader />;
  }

  return (
    <div className="flex h-screen bg-white dark:bg-black">
      {/* Sidebar */}
      <div
        className={`${
          sidebarOpen ? "w-64" : "w-20"
        } bg-slate-900 dark:bg-slate-950 text-white transition-all duration-300 flex flex-col`}
      >
        {/* Logo */}
        <div className="h-16 flex items-center justify-center border-b border-slate-800">
          <Link to={"/"} className="flex items-center gap-3">
            <div className="w-8 h-8 bg-linear-to-r from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center">
              <LayoutDashboard className="w-5 h-5" />
            </div>
            {sidebarOpen && (
              <span className="font-bold text-lg">ClubSphere</span>
            )}
          </Link>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 pt-8 px-4 space-y-3">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            return (
              <Button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`w-full flex justify-self-start  gap-3 px-4 py-3 rounded-lg transition-all ${
                  active
                    ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/50"
                    : "text-slate-300 hover:bg-slate-800 hover:text-white"
                }`}
                variant="ghost"
              >
                <Icon className="w-5 h-5 shrink-0" />
                {sidebarOpen && (
                  <span className="text-sm font-medium">{item.label}</span>
                )}
              </Button>
            );
          })}
        </nav>

        {/* User Profile & Logout */}
        <div className="p-4 border-t border-slate-800">
          <Button
            onClick={handleLogOut}
            className="w-full flex items-center gap-3 px-4 py-3 text-slate-300 hover:bg-red-600/20 hover:text-red-400 rounded-lg transition-all"
            variant="ghost"
          >
            <LogOut className="w-5 h-5 shrink-0" />
            {sidebarOpen && <span className="text-sm font-medium">Logout</span>}
          </Button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-6 sticky top-0 z-40">
          <div className="flex items-center gap-4">
            <Button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
              variant="ghost"
            >
              {sidebarOpen ? (
                <X className="w-5 h-5 text-slate-600 dark:text-slate-400" />
              ) : (
                <Menu className="w-5 h-5 text-slate-600 dark:text-slate-400" />
              )}
            </Button>

            {/* Search Bar */}
            <div className="hidden md:flex items-center gap-2 bg-slate-100 dark:bg-slate-800 px-4 py-2 rounded-lg">
              <Search className="w-4 h-4 text-slate-500 dark:text-slate-400" />
              <input
                type="text"
                placeholder="Search..."
                className="bg-transparent outline-none text-sm text-slate-700 dark:text-slate-300 placeholder-slate-500 dark:placeholder-slate-400 w-48"
              />
            </div>
          </div>

          {/* Header Right */}
          <div className="flex items-center gap-4">
            <UserProfileDropdown />
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-auto bg-slate-50 dark:bg-slate-900">
          <div className="p-6 md:p-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
