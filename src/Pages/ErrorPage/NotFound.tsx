import { Home, ArrowLeft } from "lucide-react";

export default function NotFoundPage() {
  return (
    <div>
      <div className="min-h-screen bg-linear-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 flex items-center justify-center p-4 transition-colors duration-300">
        <div className="max-w-2xl w-full text-center">
          <div className="mb-8 animate-bounce">
            <div className="text-9xl font-bold bg-linear-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
              404
            </div>
          </div>

          <h1 className="text-4xl font-bold text-slate-900 dark:text-slate-100 mb-4">
            Page Not Found
          </h1>

          <p className="text-lg text-slate-600 dark:text-slate-400 mb-8">
            Oops! The page you're looking for seems to have wandered off into
            the digital void.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => window.history.back()}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 font-medium border border-slate-200 dark:border-slate-700"
            >
              <ArrowLeft className="w-5 h-5" />
              Go Back
            </button>

            <button
              onClick={() => (window.location.href = "/")}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg shadow-md hover:shadow-lg transition-all duration-200 font-medium"
            >
              <Home className="w-5 h-5" />
              Home Page
            </button>
          </div>

          <div className="mt-12 text-sm text-slate-500 dark:text-slate-500">
            Error Code: 404 | Page Not Found
          </div>
        </div>
      </div>
    </div>
  );
}
