import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";

export default function ThemeToggle() {
  // To avoid hydration mismatch, start with `null` and set the theme on the client after mount
  const [theme, setTheme] = useState<"light" | "dark" | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // initialize theme once on client mount
    const init = () => {
      try {
        const stored = localStorage.getItem("theme");
        if (stored === "dark" || stored === "light") {
          setTheme(stored as "dark" | "light");
        } else {
          const prefersDark =
            window.matchMedia &&
            window.matchMedia("(prefers-color-scheme: dark)").matches;
          setTheme(prefersDark ? "dark" : "light");
        }
      } catch {
        setTheme("light");
      }
      setMounted(true); // Set mounted to true after initializing theme
    };
    if (typeof window !== "undefined") init();
  }, []);

  useEffect(() => {
    // don't run until mounted and theme is set
    if (!mounted || theme === null) return;
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    try {
      localStorage.setItem("theme", theme);
    } catch {
      // ignore
    }
  }, [theme, mounted]);

  function toggleTheme() {
    setTheme((t) => (t === "dark" ? "light" : "dark"));
  }

  const icon =
    theme === "dark" ? (
      <Sun className="h-4 w-4 text-yellow-300" />
    ) : (
      <Moon className="h-4 w-4" />
    );
  const customCss = `
    /* This is the key to the seamless animation.
      The @property rule tells the browser that '--angle' is a custom property
      of type <angle>. This allows the browser to smoothly interpolate it
      during animations, preventing the "jump" at the end of the loop.
    */
    @property --angle {
      syntax: '<angle>';
      initial-value: 0deg;
      inherits: false;
    }

    /* The keyframe animation simply transitions the --angle property
      from its start (0deg) to its end (360deg).
    */
    @keyframes shimmer-spin {
      to {
        --angle: 360deg;
      }
    }
  `;
  if (!mounted) {
    // Render a small neutral placeholder to avoid SSR/client mismatches
    return (
      <div
        className="inline-flex items-center justify-center rounded-full p-2"
        aria-hidden
      >
        <div className="h-4 w-4 rounded-full bg-gray-300 dark:bg-gray-700" />
      </div>
    );
  }

  return (
    <>
      <div className="flex items-center justify-center font-sans cursor-pointer">
        <style>{customCss}</style>
        <button
          aria-label="Toggle theme"
          aria-pressed={theme === "dark"}
          title="Toggle theme"
          onClick={toggleTheme}
          className="relative inline-flex items-center justify-center p-[1.5px] bg-gray-300 dark:bg-black rounded-full overflow-hidden group cursor-pointer"
        >
          <div
            className="absolute inset-0"
            style={{
              background:
                "conic-gradient(from var(--angle), transparent 25%, #06b6d4, transparent 50%)",
              animation: "shimmer-spin 2.5s linear infinite",
            }}
          />
          <span className="relative z-10 inline-flex items-center justify-center w-full h-full px-5 py-3 text-gray-900 dark:text-white bg-white dark:bg-gray-900 rounded-full group-hover:bg-gray-100 dark:group-hover:bg-gray-800 transition-colors duration-300">
            {icon}
          </span>
        </button>
      </div>
    </>
  );
}
