import { useState } from "react";
import { Menu, X } from "lucide-react";
import MobileNav from "./MobileNav";
import NavAuthButton from "./NavAuthButton";
import NavLinks from "./NavLinks";
import NavLogo from "./NavLogo";
import clubSphereLogo from "/club_sphere_logo.png";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/Context/AuthContext";
import UserProfileDropdown from "./UserDropDown";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const { user } = useAuth();
  return (
    <>
      {/* Desktop Navbar */}
      <div className="hidden md:block">
        <div className="flex justify-between items-center">
          <NavLogo />
          <NavLinks />
          {user ? <UserProfileDropdown /> : <NavAuthButton />}
        </div>
      </div>

      {/* Mobile Navbar */}
      <div className="block md:hidden px-4">
        <div className="flex justify-between items-center py-4">
          <img src={clubSphereLogo} alt="" className="h-10 w-auto" />

          {/* Hamburger Menu */}
          <button
            onClick={() => setOpen(!open)}
            className="p-2 rounded-md bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
          >
            {open ? (
              <X className="h-7 w-7 text-gray-700 dark:text-gray-200" />
            ) : (
              <Menu className="h-7 w-7 text-gray-700 dark:text-gray-200" />
            )}
          </button>
        </div>

        {/* Mobile Menu Panel with Smooth Animation */}
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{
                duration: 0.25,
                ease: "easeInOut",
              }}
              className="mt-2"
            >
              <MobileNav />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
};

export default Navbar;
