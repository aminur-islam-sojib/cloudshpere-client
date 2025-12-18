/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { axiosSecure } from "@/Hooks/useAxiosSecure";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/Context/AuthContext";
import { Building, CalendarDays, CreditCard, Trophy } from "lucide-react";
import { motion } from "framer-motion";

const MemberDasHome = () => {
  const { user } = useAuth();

  // Fetch analytics data from backend
  const { data: analytics } = useQuery({
    queryKey: ["member-analytics"],
    queryFn: async () => {
      const res = await axiosSecure.get("/analytics/dashboard");
      return res.data;
    },
  });

  // Fetch user's memberships
  const { data: memberships = [] } = useQuery({
    queryKey: ["user-memberships"],
    queryFn: async () => {
      const res = await axiosSecure.get("/memberships/user");
      return res.data;
    },
  });

  const stats = [
    {
      title: "My Memberships",
      value: analytics?.myClubs || 0,
      icon: <Building className="h-6 w-6 text-primary" />,
      desc: "Active club memberships",
    },
    {
      title: "Event Registrations",
      value: analytics?.totalEvents || 0,
      icon: <CalendarDays className="h-6 w-6 text-primary" />,
      desc: "Events I'm registered for",
    },
    {
      title: "Total Spent",
      value: `$${analytics?.totalSpent?.toFixed(2) || 0}`,
      icon: <CreditCard className="h-6 w-6 text-primary" />,
      desc: "Money spent on memberships & events",
    },
    {
      title: "Achievements",
      value: memberships.length > 0 ? "Active Member" : "New Member",
      icon: <Trophy className="h-6 w-6 text-primary" />,
      desc: "Your membership status",
    },
  ];

  return (
    <div className="space-y-6">
      <motion.h1
        className="text-3xl font-bold tracking-tight"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Welcome back, {user?.name || "Member"}!
      </motion.h1>

      {/* Stat Cards Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((item, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: idx * 0.1 }}
          >
            <Card className="shadow-md hover:shadow-xl transition-all rounded-xl">
              <CardHeader className="flex flex-row justify-between items-center">
                <CardTitle className="text-lg">{item.title}</CardTitle>
                {item.icon}
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">{item.value}</p>
                <CardDescription>{item.desc}</CardDescription>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* My Memberships */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <Card className="rounded-xl shadow-md">
          <CardHeader>
            <CardTitle>My Club Memberships</CardTitle>
            <CardDescription>Clubs you're a member of</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {memberships
                .filter((m: any) => m.status === "active")
                .map((membership: any, idx: number) => (
                  <motion.div
                    key={membership._id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: idx * 0.1 }}
                  >
                    <div>
                      <h3 className="font-semibold">
                        {membership.clubName || "Club"}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Joined{" "}
                        {new Date(membership.joinedAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Active
                    </div>
                  </motion.div>
                ))}
              {memberships.filter((m: any) => m.status === "active").length ===
                0 && (
                <p className="text-center text-muted-foreground py-8">
                  No active memberships. Join a club to get started!
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        <Card className="rounded-xl shadow-md">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks and shortcuts</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <motion.div
                className="p-4 border rounded-lg hover:bg-accent cursor-pointer transition-colors"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Building className="h-8 w-8 text-primary mb-2" />
                <h3 className="font-semibold">Browse Clubs</h3>
                <p className="text-sm text-muted-foreground">
                  Find and join new clubs
                </p>
              </motion.div>

              <motion.div
                className="p-4 border rounded-lg hover:bg-accent cursor-pointer transition-colors"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <CalendarDays className="h-8 w-8 text-primary mb-2" />
                <h3 className="font-semibold">Upcoming Events</h3>
                <p className="text-sm text-muted-foreground">
                  Register for events
                </p>
              </motion.div>

              <motion.div
                className="p-4 border rounded-lg hover:bg-accent cursor-pointer transition-colors"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <CreditCard className="h-8 w-8 text-primary mb-2" />
                <h3 className="font-semibold">Payment History</h3>
                <p className="text-sm text-muted-foreground">
                  View your transactions
                </p>
              </motion.div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default MemberDasHome;
