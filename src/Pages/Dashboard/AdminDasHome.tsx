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
import {
  TrendingUp,
  Users,
  Building,
  CreditCard,
  CalendarDays,
} from "lucide-react";
import { motion } from "framer-motion";

const AdminDasHome = () => {
  // Fetch all users
  const { data: users = [] } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const res = await axiosSecure.get("/users");
      return res.data;
    },
  });

  // Fetch approved clubs
  const { data: clubs = [] } = useQuery({
    queryKey: ["approved-club"],
    queryFn: async () => {
      const res = await axiosSecure.get("/clubs/approved");
      return res.data;
    },
  });

  // Fetch all events
  const { data: events = [] } = useQuery({
    queryKey: ["events"],
    queryFn: async () => {
      const res = await axiosSecure.get("/events");
      return res.data;
    },
  });

  // Fetch payments
  const { data: payments = [] } = useQuery({
    queryKey: ["payments"],
    queryFn: async () => {
      const res = await axiosSecure.get("/payments");
      return res.data;
    },
  });

  const totalRevenue =
    payments?.reduce((sum: number, p: any) => sum + p.amount, 0) || 0;

  const stats = [
    {
      title: "Total Users",
      value: users.length,
      icon: <Users className="h-6 w-6 text-primary" />,
      desc: "Active platform users",
    },
    {
      title: "Approved Clubs",
      value: clubs.length,
      icon: <Building className="h-6 w-6 text-primary" />,
      desc: "Clubs currently live",
    },
    {
      title: "Total Events",
      value: events.length,
      icon: <CalendarDays className="h-6 w-6 text-primary" />,
      desc: "Upcoming & past events",
    },
    {
      title: "Total Revenue",
      value: `$${totalRevenue}`,
      icon: <CreditCard className="h-6 w-6 text-primary" />,
      desc: "Membership & event income",
    },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Admin Overview</h1>

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

      {/* Example Chart Section */}
      <Card className="mt-6 rounded-xl shadow-md">
        <CardHeader>
          <CardTitle>Revenue Overview</CardTitle>
          <CardDescription>Monthly payment trends</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-48 flex items-center justify-center text-muted-foreground">
            <TrendingUp className="h-6 w-6 mr-2" />
            Chart Coming Soon (Optional)
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDasHome;
