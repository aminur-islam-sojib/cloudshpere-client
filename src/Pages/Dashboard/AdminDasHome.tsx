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
import { Users, Building, CreditCard, Clock } from "lucide-react";
import { motion } from "framer-motion";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

type ClubsResponse = {
  clubs: any[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

const AdminDasHome = () => {
  // Fetch analytics data from backend
  const { data: analytics } = useQuery({
    queryKey: ["admin-analytics"],
    queryFn: async () => {
      const res = await axiosSecure.get("/analytics/dashboard");
      return res.data;
    },
  });

  // Fetch additional data for charts
  const { data: users = [] } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const res = await axiosSecure.get("/api/users");
      return res.data;
    },
  });

  const { data: clubsData = { clubs: [] } } = useQuery<ClubsResponse>({
    queryKey: ["clubs"],
    queryFn: async () => {
      const res = await axiosSecure.get("/api/clubs");
      return res.data;
    },
  });
  const clubs = clubsData.clubs || [];

  // Prepare chart data
  const userRoleData = [
    {
      name: "Members",
      value: users.filter((u: any) => u.role === "member").length,
      color: "#8884d8",
    },
    {
      name: "Managers",
      value: users.filter((u: any) => u.role === "clubManager").length,
      color: "#82ca9d",
    },
    {
      name: "Admins",
      value: users.filter((u: any) => u.role === "admin").length,
      color: "#ffc658",
    },
  ];

  const clubStatusData = [
    {
      name: "Approved",
      value: clubs.filter((c: any) => c.status === "approved").length,
      color: "#4ade80",
    },
    {
      name: "Pending",
      value: clubs.filter((c: any) => c.status === "pending").length,
      color: "#fbbf24",
    },
    {
      name: "Rejected",
      value: clubs.filter((c: any) => c.status === "rejected").length,
      color: "#ef4444",
    },
  ];

  const monthlyRevenueData =
    analytics?.monthlyRevenue?.map((item: any) => ({
      month: `${item._id.year}-${item._id.month.toString().padStart(2, "0")}`,
      revenue: item.revenue,
    })) || [];

  const stats = [
    {
      title: "Total Users",
      value: analytics?.totalUsers || 0,
      icon: <Users className="h-6 w-6 text-primary" />,
      desc: "Active platform users",
    },
    {
      title: "Total Clubs",
      value: analytics?.totalClubs || 0,
      icon: <Building className="h-6 w-6 text-primary" />,
      desc: "All registered clubs",
    },
    {
      title: "Approved Clubs",
      value: analytics?.approvedClubs || 0,
      icon: <Clock className="h-6 w-6 text-primary" />,
      desc: "Live clubs",
    },
    {
      title: "Total Revenue",
      value: `$${analytics?.totalRevenue?.toFixed(2) || 0}`,
      icon: <CreditCard className="h-6 w-6 text-primary" />,
      desc: "Membership & event income",
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
        Admin Overview
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

      {/* Charts Section */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* User Roles Pie Chart */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Card className="rounded-xl shadow-md">
            <CardHeader>
              <CardTitle>User Distribution</CardTitle>
              <CardDescription>Users by role</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={userRoleData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) =>
                      `${name} ${((percent || 0) * 100).toFixed(0)}%`
                    }
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {userRoleData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        {/* Club Status Pie Chart */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <Card className="rounded-xl shadow-md">
            <CardHeader>
              <CardTitle>Club Status</CardTitle>
              <CardDescription>Club approval status</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={clubStatusData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) =>
                      `${name} ${((percent || 0) * 100).toFixed(0)}%`
                    }
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {clubStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Revenue Chart */}
      {monthlyRevenueData.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <Card className="rounded-xl shadow-md">
            <CardHeader>
              <CardTitle>Monthly Revenue</CardTitle>
              <CardDescription>Revenue trends over time</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={monthlyRevenueData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`$${value}`, "Revenue"]} />
                  <Bar dataKey="revenue" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
};

export default AdminDasHome;
