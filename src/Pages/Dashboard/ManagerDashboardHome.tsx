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
import { Building, Users, CreditCard, CalendarDays } from "lucide-react";
import { motion } from "framer-motion";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Link } from "react-router";
import { Button } from "@/components/ui/button";

const ManagerDasHome = () => {
  const { user } = useAuth();

  // Fetch analytics data from backend
  const { data: analytics } = useQuery({
    queryKey: ["manager-analytics"],
    queryFn: async () => {
      const res = await axiosSecure.get("/analytics/dashboard");
      return res.data;
    },
  });

  // Fetch manager's clubs
  const { data: clubs = [] } = useQuery({
    queryKey: ["manager-clubs", user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get(`/clubs/${user?.email}`);
      return res.data;
    },
  });

  const stats = [
    {
      title: "My Clubs",
      value: analytics?.myClubs || 0,
      icon: <Building className="h-6 w-6 text-primary" />,
      desc: "Clubs I manage",
    },
    {
      title: "Total Members",
      value: analytics?.totalMembers || 0,
      icon: <Users className="h-6 w-6 text-primary" />,
      desc: "Members across my clubs",
    },
    {
      title: "My Events",
      value: analytics?.totalEvents || 0,
      icon: <CalendarDays className="h-6 w-6 text-primary" />,
      desc: "Events from my clubs",
    },
    {
      title: "Club Revenue",
      value: `$${analytics?.totalRevenue?.toFixed(2) || 0}`,
      icon: <CreditCard className="h-6 w-6 text-primary" />,
      desc: "Revenue from memberships",
    },
  ];

  // Prepare chart data for club status
  const clubStatusData = [
    {
      name: "Approved",
      value: clubs.filter((c: any) => c.status === "approved").length,
    },
    {
      name: "Pending",
      value: clubs.filter((c: any) => c.status === "pending").length,
    },
    {
      name: "Rejected",
      value: clubs.filter((c: any) => c.status === "rejected").length,
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
        Manager Dashboard
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

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="flex gap-4"
      >
        <Link to="/create-group" className="flex-1">
          <Button className="w-full bg-linear-to-r from-green-600 to-emerald-600 hover:scale-[1.02]">
            <Building className="w-4 h-4 mr-2" />
            Create New Club
          </Button>
        </Link>
        <Link to="/create-event" className="flex-1">
          <Button className="w-full bg-linear-to-r from-blue-600 to-indigo-600 hover:scale-[1.02]">
            <CalendarDays className="w-4 h-4 mr-2" />
            Create New Event
          </Button>
        </Link>
      </motion.div>

      {/* Club Status Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <Card className="rounded-xl shadow-md">
          <CardHeader>
            <CardTitle>My Clubs Status</CardTitle>
            <CardDescription>Approval status of my clubs</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={clubStatusData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </motion.div>

      {/* Recent Clubs Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        <Card className="rounded-xl shadow-md">
          <CardHeader>
            <CardTitle>My Recent Clubs</CardTitle>
            <CardDescription>Latest club activities</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {clubs.slice(0, 5).map((club: any, idx: number) => (
                <motion.div
                  key={club._id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: idx * 0.1 }}
                >
                  <div>
                    <h3 className="font-semibold">{club.clubName}</h3>
                    <p className="text-sm text-muted-foreground">
                      {club.category}
                    </p>
                  </div>
                  <div
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      club.status === "approved"
                        ? "bg-green-100 text-green-800"
                        : club.status === "pending"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {club.status}
                  </div>
                </motion.div>
              ))}
              {clubs.length === 0 && (
                <p className="text-center text-muted-foreground py-8">
                  No clubs found. Create your first club!
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default ManagerDasHome;
