"use client";
import { useAuth } from "@/Context/AuthContext";
import {
  ChevronDown,
  CreditCard,
  HelpCircle,
  LogOut,
  Settings,
  User,
  UserCircle,
} from "lucide-react";
import React, { useState, useEffect, useRef, type ReactNode } from "react";
import { toast } from "sonner";
import Swal from "sweetalert2";
import ThemeToggle from "../ThemeToggle/ThemeToggle";
import { useNavigate } from "react-router";
import useGetRole from "@/Hooks/useGetRole";

interface DropdownMenuProps {
  children: ReactNode;
  trigger: ReactNode;
}

const DropdownMenu = ({ children, trigger }: DropdownMenuProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleTriggerClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsOpen(!isOpen);
  };

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <div onClick={handleTriggerClick} className="cursor-pointer">
        {trigger}
      </div>
      {isOpen && (
        <div
          className="origin-top-right absolute right-0 mt-2 w-72 rounded-xl shadow-xl bg-white dark:bg-zinc-900 ring-1 ring-black ring-opacity-5 focus:outline-none z-50 animate-in fade-in-0 zoom-in-95 p-2"
          role="menu"
          aria-orientation="vertical"
        >
          {children}
        </div>
      )}
    </div>
  );
};

interface DropdownMenuItemProps {
  children: ReactNode;
  onClick?: () => void;
}

const DropdownMenuItem = ({ children, onClick }: DropdownMenuItemProps) => (
  <a
    href="#"
    onClick={(e: React.MouseEvent) => {
      e.preventDefault();
      if (onClick) onClick();
    }}
    className="text-zinc-700 dark:text-zinc-300 group flex items-center px-3 py-2.5 text-sm rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors duration-150"
    role="menuitem"
  >
    {children}
  </a>
);

const DropdownMenuSeparator = () => (
  <div className="my-2 h-px bg-zinc-200 dark:bg-zinc-700" />
);

export default function UserProfileDropdown() {
  const { logOut, user } = useAuth();
  const navigate = useNavigate();
  const { role } = useGetRole();
  const [imgError, setImgError] = useState(false);

  const firstLetter = user?.displayName?.trim().charAt(0).toUpperCase() || "U";

  const handleSignOut = async () => {
    Swal.fire({
      title: "Are you sure?",
      text: "You wanna log out this account!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Log Out!",
    }).then((result) => {
      if (result.isConfirmed) {
        logOut();
        toast.success("Log Out Successfully!");
      }
    });
  };

  return (
    <div className="flex items-center justify-center font-sans py-5 px-5">
      <DropdownMenu
        trigger={
          <div className="flex items-center gap-3 pl-4  border-slate-200 dark:border-slate-800">
            <div className="hidden sm:block text-right">
              <p className="text-sm font-medium text-slate-900 dark:text-white">
                {user?.displayName || "User"}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 capitalize">
                {role || "Loading..."}
              </p>
            </div>
            <div className="w-10 h-10 bg-linear-to-r from-indigo-600 to-purple-600 rounded-full flex items-center justify-center overflow-hidden">
              {user?.photoURL ? (
                <img
                  src={user.photoURL}
                  alt={user?.displayName || "User"}
                  className="w-full h-full object-cover"
                />
              ) : (
                <UserCircle className="w-6 h-6 text-white" />
              )}
            </div>
            {/* <UserProfileDropdown /> */}
            <ChevronDown className="w-4 h-4 text-slate-600 dark:text-slate-400" />
          </div>
        }
      >
        <div className="px-3 py-3 border-b border-zinc-200 dark:border-zinc-700">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-linear-to-br from-blue-500 to-purple-600 rounded-full flex  items-center justify-center text-white font-semibold overflow-hidden">
              {!imgError && user?.photoURL ? (
                <img
                  src={user.photoURL}
                  alt={user.displayName || "User"}
                  className="w-full h-full object-cover"
                  onError={() => setImgError(true)}
                />
              ) : (
                <span className="text-sm font-bold">{firstLetter}</span>
              )}
            </div>
            <div>
              <div className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                {user?.displayName}
              </div>
              <div className="text-xs text-zinc-500 dark:text-zinc-400">
                {user?.email}
              </div>
              <div className="text-xs text-blue-600 dark:text-blue-400 font-medium capitalize">
                {role || "Loading..."}
              </div>
            </div>
          </div>
        </div>

        <div className="py-1">
          <DropdownMenuItem onClick={() => console.log("Profile")}>
            <User className="mr-3 h-4 w-4 text-zinc-500" />
            Your Profile
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => console.log("Settings")}>
            <Settings className="mr-3 h-4 w-4 text-zinc-500" />
            Settings
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => console.log("Billing")}>
            <CreditCard className="mr-3 h-4 w-4 text-zinc-500" />
            Billing & Plans
          </DropdownMenuItem>
        </div>

        <DropdownMenuSeparator />

        <div className="py-1">
          <DropdownMenuItem onClick={() => navigate("/dashboard")}>
            <HelpCircle className="mr-3 h-4 w-4 text-zinc-500" />
            Dashboard
          </DropdownMenuItem>

          <DropdownMenuItem onClick={handleSignOut}>
            <LogOut className="mr-3 h-4 w-4 text-zinc-500" />
            Sign Out
          </DropdownMenuItem>
        </div>
        <ThemeToggle />
      </DropdownMenu>
    </div>
  );
}
