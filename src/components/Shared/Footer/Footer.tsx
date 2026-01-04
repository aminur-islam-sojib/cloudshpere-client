import { Github, Linkedin, Mail, X } from "lucide-react";
import { Link } from "react-router";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <div>
      {/* Footer */}
      <footer className="bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 transition-colors duration-200">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            {/* Company Info */}
            <div className="col-span-1 md:col-span-2">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
                Club Sphere
              </h3>
              <p className="text-slate-600 dark:text-slate-400 mb-4 max-w-md">
                Building amazing products that make a difference. Committed to
                excellence and innovation in everything we do.
              </p>
              <div className="flex gap-4">
                <a
                  href="https://x.com/"
                  className="p-2 rounded-lg bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors"
                  aria-label="x"
                  target="_blank"
                >
                  <X className="w-5 h-5 text-slate-700 dark:text-slate-300" />
                </a>
                <a
                  href="https://github.com/aminur-islam-sojib"
                  target="_blank"
                  className="p-2 rounded-lg bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors"
                  aria-label="Github"
                >
                  <Github className="w-5 h-5 text-slate-700 dark:text-slate-300" />
                </a>
                <a
                  href="https://www.linkedin.com/in/sojib-ahmed-ai/"
                  target="_blank"
                  className="p-2 rounded-lg bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors"
                  aria-label="LinkedIn"
                >
                  <Linkedin className="w-5 h-5 text-slate-700 dark:text-slate-300" />
                </a>
                <a
                  href="#"
                  className="p-2 rounded-lg bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors"
                  aria-label="Email"
                >
                  <Mail className="w-5 h-5 text-slate-700 dark:text-slate-300" />
                </a>
              </div>
            </div>

            {/* Product Links */}
            <div>
              <h4 className="text-sm font-semibold text-slate-900 dark:text-white mb-4 uppercase tracking-wider">
                Product
              </h4>
              <ul className="space-y-3">
                <li>
                  <a
                    href="/"
                    className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
                  >
                    Home
                  </a>
                </li>
                <li>
                  <a
                    href="/clubs"
                    className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
                  >
                    Clubs
                  </a>
                </li>

                <li>
                  <a
                    href="/create-group"
                    className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
                  >
                    Create Group
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-slate-900 dark:text-white mb-4 uppercase tracking-wider">
                Company
              </h4>
              <ul className="space-y-3">
                <li>
                  <Link
                    to={"/privacy-policy"}
                    className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
                  >
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link
                    to={"/terms-condition"}
                    className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
                  >
                    Terms of Service
                  </Link>
                </li>

                <li>
                  <Link
                    to={"cookies-policy"}
                    className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
                  >
                    Cookie Policy
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="pt-8 border-t border-slate-200 dark:border-slate-800">
            <p className="text-sm text-slate-600 dark:text-slate-400 text-center">
              © {currentYear} Club Sphere. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Footer;
