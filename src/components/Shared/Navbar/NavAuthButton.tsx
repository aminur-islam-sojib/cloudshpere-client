import React from "react";
import { motion, type Variants } from "framer-motion";
import { UserPlus, LogIn } from "lucide-react";
import ThemeToggle from "../ThemeToggle/ThemeToggle";

// --- MenuBar Interface ---
interface MenuItem {
  icon: React.ReactNode;
  label: string;
  href: string;
  gradient: string;
  iconColor: string;
}

const menuItems: MenuItem[] = [
  {
    icon: <LogIn className="h-5 w-5" />,
    label: "Log In",
    href: "log-in",
    gradient:
      "radial-gradient(circle, rgba(59,130,246,0.15) 0%, rgba(37,99,235,0.06) 50%, rgba(29,78,216,0) 100%)",
    iconColor: "group-hover:text-blue-500 dark:group-hover:text-blue-400",
  },
  {
    icon: <UserPlus className="h-5 w-5" />,
    label: "Register",
    href: "register",
    gradient:
      "radial-gradient(circle, rgba(59,130,246,0.15) 0%, rgba(37,99,235,0.06) 50%, rgba(29,78,216,0) 100%)",
    iconColor: "group-hover:text-blue-500 dark:group-hover:text-blue-400",
  },
];

// Animations
const itemVariants: Variants = {
  initial: { rotateX: 0, opacity: 1 },
  hover: { rotateX: -90, opacity: 0 },
};

const backVariants: Variants = {
  initial: { rotateX: 90, opacity: 0 },
  hover: { rotateX: 0, opacity: 1 },
};

const glowVariants: Variants = {
  initial: { opacity: 0, scale: 0.8 },
  hover: {
    opacity: 1,
    scale: 2,
    transition: {
      opacity: { duration: 0.5 },
      scale: { duration: 0.5, type: "spring", stiffness: 300, damping: 25 },
    },
  },
};

const navGlowVariants: Variants = {
  initial: { opacity: 0 },
  hover: { opacity: 1, transition: { duration: 0.5 } },
};

const sharedTransition = {
  type: "spring" as const,
  stiffness: 100,
  damping: 20,
  duration: 0.5,
};

function NavAuthButton(): React.JSX.Element {
  return (
    <motion.nav
      className="p-2 rounded-2xl lg:rounded-l-2xl lg:rounded-r-none flex items-center gap-2 bg-white/60 dark:bg-black/60 backdrop-blur-lg border border-gray-200/80 dark:border-gray-800/80 shadow-lg dark:shadow-gray-900/20 relative overflow-hidden"
      initial="initial"
      whileHover="hover"
    >
      {/* Glow Background */}
      <motion.div
        className="absolute -inset-2 rounded-3xl z-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(59,130,246,0.1) 0%, rgba(147,51,234,0.1) 50%, rgba(239,68,68,0.1) 100%)",
        }}
        variants={navGlowVariants}
      />

      {/* DESKTOP MENU */}
      <ul className="hidden md:flex items-center gap-2 relative z-10">
        {menuItems.map((item: MenuItem) => (
          <motion.li key={item.label} className="relative">
            <motion.div
              className="block rounded-xl group relative"
              style={{ perspective: "600px" }}
              whileHover="hover"
              initial="initial"
            >
              {/* Glow */}
              <motion.div
                className="absolute inset-0 z-0 pointer-events-none rounded-2xl"
                variants={glowVariants}
                style={{ background: item.gradient }}
              />

              {/* Front Item */}
              <motion.a
                href={item.href}
                className="flex items-center gap-2 px-4 py-2 relative z-10 bg-transparent text-gray-600 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white rounded-xl"
                variants={itemVariants}
                transition={sharedTransition}
                style={{
                  transformStyle: "preserve-3d",
                  transformOrigin: "center bottom",
                }}
              >
                <span className={item.iconColor}>{item.icon}</span>
                <span className="font-medium">{item.label}</span>
              </motion.a>

              {/* Back Item */}
              <motion.a
                href={item.href}
                className="flex items-center gap-2 px-4 py-2 absolute inset-0 z-10 text-gray-600 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white rounded-xl"
                variants={backVariants}
                transition={sharedTransition}
                style={{
                  transformStyle: "preserve-3d",
                  transformOrigin: "center top",
                  transform: "rotateX(90deg)",
                }}
              >
                <span className={item.iconColor}>{item.icon}</span>
                <span className="font-medium">{item.label}</span>
              </motion.a>
            </motion.div>
          </motion.li>
        ))}
      </ul>

      {/* MOBILE VERSION — ICON ONLY */}
      <div className="md:hidden flex items-center gap-3 relative z-10">
        <a
          href="/log-in"
          className="p-2 rounded-lg flex gap-0.5 text-center items-center justify-center bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition"
        >
          <LogIn className="h-5 w-5 text-gray-700 dark:text-gray-300" />
          <span>Log In</span>
        </a>
        <a
          href="/register"
          className="p-2 rounded-lg flex gap-0.5 text-center items-center justify-center bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition"
        >
          <UserPlus className="h-5 w-5 text-gray-700 dark:text-gray-300" />
          <span>Register</span>
        </a>
      </div>

      {/* THEME TOGGLE (visible in all sizes) */}
      <ThemeToggle />
    </motion.nav>
  );
}

export default NavAuthButton;
