/* eslint-disable @typescript-eslint/no-explicit-any */
import { useAuth } from "@/Context/AuthContext";
import { axiosSecure } from "@/Hooks/useAxiosSecure";
import useGetRole from "@/Hooks/useGetRole";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Button } from "@/components/ui/button";

import { Check, X } from "lucide-react";
import Swal from "sweetalert2";
import { toast } from "sonner";

const RequestedGroupPage = () => {
  const { user } = useAuth();
  const { role } = useGetRole();
  const queryClient = useQueryClient();
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const {
    data: groups,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["pending-groups", user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get(
        `/clubs/pending/${role}/${user?.email}`
      );
      return res.data;
    },
    enabled: !!user?.email && !!role,
  });

  const approveMutation = useMutation({
    mutationFn: async (clubId: string) => {
      const res = await axiosSecure.patch(`/clubs/approve/${clubId}`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["pending-groups"]);
      setActionLoading(null);
    },
    onError: () => setActionLoading(null),
  });

  const rejectMutation = useMutation({
    mutationFn: async (clubId: string) => {
      const res = await axiosSecure.patch(`/clubs/reject/${clubId}`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["pending-groups"]);
      setActionLoading(null);
    },
    onError: () => setActionLoading(null),
  });

  const handleApprove = (id: string) => {
    setActionLoading(id);
    Swal.fire({
      title: "Are you sure?",
      text: "You want to Approve this Group!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Approve!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        approveMutation.mutate(id);
        toast.success("Group Approve Successfully!");
      } else {
        setActionLoading(null);
      }
    });
  };

  const handleReject = (id: string) => {
    setActionLoading(id);
    Swal.fire({
      title: "Are you sure?",
      text: "You want to reject this account!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Reject!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        rejectMutation.mutate(id);
        toast.warning("Account Rejected");
      } else {
        setActionLoading(null);
      }
    });
  };

  if (isLoading)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );

  if (isError)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <h2 className="text-red-600 text-xl font-bold">
          Failed to load groups
        </h2>
      </div>
    );

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Pending Group Requests</h1>

      {groups?.length === 0 ? (
        <div className="text-center py-16 bg-gray-50 rounded-lg">
          <h3 className="text-lg font-medium text-gray-900">
            No Pending Requests
          </h3>
          <p className="text-gray-500">
            All group requests have been processed
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg shadow-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider rounded-tl-lg">
                  Banner
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Club Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Location
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Manager
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fee
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Requested On
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider rounded-tr-lg">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="bg-white divide-y divide-gray-200">
              {groups?.map((group: any, index: number) => (
                <tr
                  key={group._id}
                  className={`${
                    index % 2 === 0 ? "bg-white" : "bg-gray-50"
                  } hover:bg-gray-100 transition`}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    {group.bannerImage ? (
                      <img
                        src={group.bannerImage}
                        alt={group.clubName}
                        className="h-12 w-20 object-cover rounded-md"
                      />
                    ) : (
                      <div className="h-12 w-20 bg-gray-200 rounded-md" />
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                    {group.clubName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                    {group.category}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                    {group.location}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                    {group.managerEmail}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                    ৳{group.membershipFee}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                    {new Date(group.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center flex justify-center gap-2">
                    <Button
                      variant="default"
                      size="sm"
                      className="flex items-center gap-1"
                      onClick={() => handleApprove(group._id)}
                      disabled={actionLoading === group._id}
                    >
                      {actionLoading === group._id ? (
                        "Processing..."
                      ) : (
                        <>
                          <Check className="w-4 h-4" /> Approve
                        </>
                      )}
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      className="flex items-center gap-1"
                      onClick={() => handleReject(group._id)}
                      disabled={actionLoading === group._id}
                    >
                      {actionLoading === group._id ? (
                        "Processing..."
                      ) : (
                        <>
                          <X className="w-4 h-4" /> Reject
                        </>
                      )}
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default RequestedGroupPage;
