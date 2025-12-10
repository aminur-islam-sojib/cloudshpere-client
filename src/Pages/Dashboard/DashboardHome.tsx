import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { TrendingUp } from "lucide-react";

const DashboardHome = () => {
  const stats = [
    { title: "Total Revenue", value: "$45,231", change: "+20.1%", trend: "up" },
    { title: "Active Users", value: "2,345", change: "+15.3%", trend: "up" },
    { title: "New Orders", value: "156", change: "-4.2%", trend: "down" },
    { title: "Conversion Rate", value: "3.24%", change: "+2.5%", trend: "up" },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
          Welcome back, John! 👋
        </h1>
        <p className="text-slate-600 dark:text-slate-400">
          Here's what's happening with your business today.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
        {stats.map((stat, index) => (
          <Card
            key={index}
            className="hover:shadow-lg transition-shadow border-slate-200 dark:border-slate-700"
          >
            <CardHeader className="pb-2">
              <CardDescription className="text-xs font-medium text-slate-500">
                {stat.title}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white">
                    {stat.value}
                  </p>
                  <p
                    className={`text-sm font-medium mt-1 ${
                      stat.trend === "up" ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {stat.change}
                  </p>
                </div>
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center ${
                    stat.trend === "up" ? "bg-green-100" : "bg-red-100"
                  }`}
                >
                  <TrendingUp
                    className={`w-6 h-6 ${
                      stat.trend === "up" ? "text-green-600" : "text-red-600"
                    }`}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-slate-200 dark:border-slate-700">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Your latest business activities</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { action: "New user registered", time: "2 minutes ago" },
                { action: "Order #1234 completed", time: "15 minutes ago" },
                { action: "New document uploaded", time: "1 hour ago" },
                { action: "Settings updated", time: "3 hours ago" },
              ].map((item, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between py-3 border-b border-slate-200 dark:border-slate-700 last:border-b-0"
                >
                  <span className="text-sm text-slate-600 dark:text-slate-400">
                    {item.action}
                  </span>
                  <span className="text-xs text-slate-500 dark:text-slate-500">
                    {item.time}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200 dark:border-slate-700">
          <CardHeader>
            <CardTitle>Quick Stats</CardTitle>
            <CardDescription>Performance overview</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { label: "Page Views", value: "12,458" },
                { label: "Unique Visitors", value: "8,932" },
                { label: "Bounce Rate", value: "32.5%" },
                { label: "Avg Session", value: "4m 32s" },
              ].map((item, i) => (
                <div key={i} className="flex justify-between items-center">
                  <span className="text-sm text-slate-600 dark:text-slate-400">
                    {item.label}
                  </span>
                  <span className="text-sm font-semibold text-slate-900 dark:text-white">
                    {item.value}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardHome;
