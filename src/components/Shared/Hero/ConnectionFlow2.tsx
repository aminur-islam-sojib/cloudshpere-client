import { Users, Sparkles, MessageCircle, ArrowRight } from "lucide-react";

export default function Hero() {
  const handleGetStarted = () => {
    console.log("Getting started");
    // Handle button click
  };

  return (
    <div className="min-h-screen bg-linear-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300 relative overflow-hidden">
      {/* Hero Section */}
      <div className="container mx-auto px-6 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            <div className="inline-flex items-center space-x-2 px-4 py-2 bg-purple-100 dark:bg-purple-900/30 rounded-full">
              <Sparkles className="w-4 h-4 text-purple-600 dark:text-purple-400" />
              <span className="text-sm font-medium text-purple-600 dark:text-purple-400">
                Join thousands of groups today
              </span>
            </div>

            <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
              <span className="text-gray-900 dark:text-white">
                Create & Join
              </span>
              <br />
              <span className="bg-linear-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                Amazing Groups
              </span>
            </h1>

            <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed">
              Connect with like-minded people, share incredible content, and
              build communities that matter. Create your own group or discover
              thousands of existing ones.
            </p>

            {/* CTA Button */}
            <div>
              <button
                onClick={handleGetStarted}
                className="px-10 py-5 bg-linear-to-r from-purple-600 to-blue-600 text-white text-lg rounded-full font-semibold hover:shadow-xl hover:scale-105 transition-all duration-300 flex items-center space-x-3"
              >
                <span>Get Started Free</span>
                <ArrowRight className="w-6 h-6" />
              </button>
            </div>

            {/* Stats */}
            <div className="flex items-center space-x-8 pt-4">
              <div>
                <div className="text-3xl font-bold text-gray-900 dark:text-white">
                  50K+
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Active Groups
                </div>
              </div>
              <div className="w-px h-12 bg-gray-300 dark:bg-gray-700"></div>
              <div>
                <div className="text-3xl font-bold text-gray-900 dark:text-white">
                  2M+
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Happy Members
                </div>
              </div>
              <div className="w-px h-12 bg-gray-300 dark:bg-gray-700"></div>
              <div>
                <div className="text-3xl font-bold text-gray-900 dark:text-white">
                  4.9★
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  User Rating
                </div>
              </div>
            </div>
          </div>

          {/* Right Content - Visual */}
          <div className="relative">
            {/* Grid Background behind the card */}
            <div className="absolute inset-0 -z-10">
              {/* Grid pattern */}
              <div
                className="absolute inset-0 translate-x-8 translate-y-8"
                style={{
                  backgroundImage: `
                  linear-linear(to right, rgb(147 51 234 / 0.1) 1px, transparent 1px),
                  linear-linear(to bottom, rgb(147 51 234 / 0.1) 1px, transparent 1px)
                `,
                  backgroundSize: "40px 40px",
                }}
              ></div>

              {/* Accent squares */}
              <div className="absolute top-10 right-10 w-32 h-32 border-2 border-purple-400/30 dark:border-purple-600/30 rounded-2xl"></div>
              <div className="absolute bottom-10 left-10 w-24 h-24 border-2 border-blue-400/30 dark:border-blue-600/30 rounded-2xl rotate-12"></div>
            </div>

            {/* Main Card */}
            <div className="relative z-10 bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-8 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-12 h-12 bg-linear-to-br from-purple-600 to-blue-600 rounded-xl flex items-center justify-center">
                  <MessageCircle className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    Design Enthusiasts
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    1,234 members
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="bg-linear-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-xl p-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-purple-600 rounded-full shrink-0"></div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-700 dark:text-gray-300">
                        Just shared a new design system!
                      </p>
                      <div className="mt-2 w-full h-24 bg-linear-to-br from-purple-200 to-blue-200 dark:from-purple-700 dark:to-blue-700 rounded-lg"></div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <div className="flex -space-x-2">
                    <div className="w-8 h-8 bg-pink-500 rounded-full border-2 border-white dark:border-gray-800"></div>
                    <div className="w-8 h-8 bg-yellow-500 rounded-full border-2 border-white dark:border-gray-800"></div>
                    <div className="w-8 h-8 bg-green-500 rounded-full border-2 border-white dark:border-gray-800"></div>
                    <div className="w-8 h-8 bg-blue-500 rounded-full border-2 border-white dark:border-gray-800 flex items-center justify-center text-xs text-white font-semibold">
                      +99
                    </div>
                  </div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    people are viewing
                  </span>
                </div>
              </div>
            </div>

            {/* Floating Cards */}
            <div className="absolute -top-6 -right-6 w-40 h-40 bg-linear-to-br from-purple-400 to-pink-400 rounded-3xl blur-3xl opacity-30"></div>
            <div className="absolute -bottom-6 -left-6 w-40 h-40 bg-linear-to-br from-blue-400 to-cyan-400 rounded-3xl blur-3xl opacity-30"></div>

            {/* Small floating card */}
            <div className="absolute -top-4 right-8 bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-4 border border-gray-200 dark:border-gray-700 animate-bounce">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  342 online now
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Preview */}
      <div className="container mx-auto px-6 py-12">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-shadow">
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center mb-4">
              <Users className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Create Groups
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Start your own community in seconds. Customize and manage with
              powerful tools.
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-shadow">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center mb-4">
              <MessageCircle className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Share Content
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Post updates, media, and engage with members in real-time
              conversations.
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-shadow">
            <div className="w-12 h-12 bg-pink-100 dark:bg-pink-900/30 rounded-xl flex items-center justify-center mb-4">
              <Sparkles className="w-6 h-6 text-pink-600 dark:text-pink-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Discover Groups
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Find and join groups that match your interests and passions.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
