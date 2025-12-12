/* eslint-disable @typescript-eslint/no-explicit-any */
import { useAuth } from "@/Context/AuthContext";
import { axiosSecure } from "@/Hooks/useAxiosSecure";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

import { Search, CheckCircle, Clock, XCircle, Info } from "lucide-react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const ManagerDashboard = () => {
  const { user } = useAuth();

  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const { data: clubs = [], isLoading } = useQuery({
    queryKey: ["manager-clubs", user?.email, searchText, statusFilter],
    queryFn: async () => {
      const res = await axiosSecure.get(
        `/clubs/${user?.email}?search=${searchText}&status=${statusFilter}`
      );
      return res.data;
    },
  });

  const total = clubs.length;
  const approved = clubs.filter((c: any) => c.status === "approved").length;
  const pending = clubs.filter((c: any) => c.status === "pending").length;
  const rejected = clubs.filter((c: any) => c.status === "rejected").length;

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* TITLE */}
      <h1 className="text-2xl md:text-3xl font-bold">Manager Dashboard</h1>

      {/* RESPONSIVE STATS GRID */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard title="Total" value={total} />
        <StatCard
          title="Approved"
          value={approved}
          icon={<CheckCircle className="text-green-600" />}
        />
        <StatCard
          title="Pending"
          value={pending}
          icon={<Clock className="text-yellow-600" />}
        />
        <StatCard
          title="Rejected"
          value={rejected}
          icon={<XCircle className="text-red-600" />}
        />
      </div>

      {/* SEARCH + FILTER */}
      <div className="flex flex-col md:flex-row gap-4 items-center">
        {/* Search */}
        <div className="flex items-center border rounded-xl p-2 w-full md:w-1/2">
          <Search className="mr-2" />
          <input
            type="text"
            placeholder="Search clubs..."
            className="w-full outline-none"
            onChange={(e) => setSearchText(e.target.value)}
          />
        </div>

        {/* Filter */}
        <select
          className="border p-2 rounded-xl w-full md:w-auto"
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="all">All</option>
          <option value="approved">Approved</option>
          <option value="pending">Pending</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      {/* TABLE CARD */}
      <Card className="overflow-x-auto">
        <CardHeader>
          <CardTitle>Your Clubs</CardTitle>
        </CardHeader>

        <CardContent className="min-w-[700px] md:min-w-full">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-20">Image</TableHead>
                <TableHead>Club Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Fee</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {clubs.map((club: any) => (
                <TableRow key={club._id}>
                  {/* Image */}
                  <TableCell>
                    <img
                      src={club.bannerImage}
                      alt="banner"
                      className="h-14 w-14 object-cover rounded-xl border"
                    />
                  </TableCell>

                  <TableCell className="font-medium">{club.clubName}</TableCell>
                  <TableCell>{club.category}</TableCell>
                  <TableCell>{club.location}</TableCell>
                  <TableCell>${club.membershipFee}</TableCell>

                  <TableCell>
                    <StatusBadge status={club.status} />
                  </TableCell>

                  <TableCell className="text-right">
                    <Button size="sm" variant="outline">
                      <Info className="h-4 w-4 mr-1" /> Details
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {clubs.length === 0 && (
            <p className="text-center text-gray-500 py-4">
              No clubs match your search or filter.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

// STATUS BADGE
const StatusBadge = ({ status }: { status: string }) => {
  const colors: any = {
    approved: "bg-green-600 hover:bg-green-700",
    pending: "bg-yellow-500 hover:bg-yellow-600",
    rejected: "bg-red-600 hover:bg-red-700",
  };

  return (
    <Badge className={`${colors[status]} text-white capitalize`}>
      {status}
    </Badge>
  );
};

// CARD COMPONENT FOR STATS
const StatCard = ({
  title,
  value,
  icon,
}: {
  title: string;
  value: number;
  icon?: React.ReactNode;
}) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between pb-2">
      <CardTitle className="flex items-center gap-2 text-sm md:text-base">
        {icon} {title}
      </CardTitle>
    </CardHeader>
    <CardContent>
      <p className="text-2xl md:text-3xl font-bold">{value}</p>
    </CardContent>
  </Card>
);

export default ManagerDashboard;
