"use client";
import { useAuth } from "@/Context/AuthContext";
import { CreditCard, HelpCircle, LogOut, Settings, User } from "lucide-react";
import React, { useState, useEffect, useRef, type ReactNode } from "react";
import { toast } from "sonner";
import Swal from "sweetalert2";
import ThemeToggle from "../ThemeToggle/ThemeToggle";
import { useNavigate } from "react-router";

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
    <div className="flex items-center justify-center font-sans py-5">
      <DropdownMenu
        trigger={
          <button className="flex items-center space-x-3 p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">
            <div className="w-8 h-8 bg-linear-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
              <img src={user?.photoURL || null || undefined} alt="" />
            </div>
            <div className="text-left">
              <div className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                {user?.displayName}
              </div>
              <div className="text-xs text-zinc-500 dark:text-zinc-400">
                {user?.email}
              </div>
            </div>
          </button>
        }
      >
        <div className="px-3 py-3 border-b border-zinc-200 dark:border-zinc-700">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-linear-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
              <img src={user?.photoURL || null || undefined} alt="" />
            </div>
            <div>
              <div className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                {user?.displayName}
              </div>
              <div className="text-xs text-zinc-500 dark:text-zinc-400">
                {user?.email}
              </div>
              <div className="text-xs text-blue-600 dark:text-blue-400 font-medium">
                Pro Plan
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
