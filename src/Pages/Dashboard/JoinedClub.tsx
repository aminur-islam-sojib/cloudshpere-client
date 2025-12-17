import { useAuth } from "@/Context/AuthContext";
import { axiosSecure } from "@/Hooks/useAxiosSecure";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { toast } from "sonner";
import { Link } from "react-router";
import { Button } from "@/components/ui/button";

interface Club {
  _id: string;
  clubName: string;
  category: string;
  description: string;
  managerEmail: string;
}

interface Membership {
  _id: string;
  userEmail: string;
  clubId: string;
  status: string;
  joinedAt: string;
  paymentType?: string;
  expiresAt?: string | null;
  paymentId: string | null;
}

interface MembershipWithClub extends Membership {
  clubDetails?: Club;
}

const JoinedClub = () => {
  const { user } = useAuth();
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Fetch memberships
  const { data: memberships = [], isLoading: membershipsLoading } = useQuery({
    queryKey: ["memberships", user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axiosSecure.get("/memberships/user");
      return res.data as Membership[];
    },
  });

  // Fetch club details for each membership
  const { data: membershipsWithClubs = [], isLoading: clubsLoading } = useQuery(
    {
      queryKey: ["memberships-with-clubs", memberships],
      enabled: memberships.length > 0,
      queryFn: async () => {
        const membershipsWithClubDetails = await Promise.all(
          memberships.map(async (membership) => {
            try {
              const res = await axiosSecure.get(
                `/club-details/${membership.clubId}`
              );
              return { ...membership, clubDetails: res.data };
            } catch (err) {
              console.error("Error fetching club details:", err);
              return membership;
            }
          })
        );
        return membershipsWithClubDetails as MembershipWithClub[];
      },
    }
  );

  const isLoading = membershipsLoading || clubsLoading;

  const copyToClipboard = async (transactionId: string) => {
    try {
      await navigator.clipboard.writeText(transactionId);
      setCopiedId(transactionId);

      // Reset after 2 seconds
      setTimeout(() => {
        setCopiedId(null);
      }, 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  console.log(memberships);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (membershipsWithClubs.length === 0) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
        <p className="text-center text-gray-500">
          You haven't joined any clubs yet.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
      {/* Toast Notification */}
      {copiedId && toast.success("Transaction ID copied!")}

      <div className="border-b border-gray-200 px-6 py-4">
        <h2 className="text-2xl font-bold text-gray-900">My Joined Clubs</h2>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Club Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Category
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Payment Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Transaction Id
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Joined Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {membershipsWithClubs.map((membership) => (
              <tr
                key={membership._id}
                className="hover:bg-gray-50 transition-colors"
              >
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {membership.clubDetails?.clubName || "Loading..."}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                  {membership.clubDetails?.category || "N/A"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      membership.status === "active"
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {membership.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800 border border-blue-200">
                    {membership.paymentType || "free"}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  {membership.paymentId ? (
                    <button
                      onClick={() => copyToClipboard(membership.paymentId!)}
                      className="group relative inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer"
                    >
                      <code className="text-xs font-mono text-gray-800">
                        {membership.paymentId}
                      </code>
                      {copiedId === membership.paymentId ? (
                        <Check className="w-3.5 h-3.5 text-green-600" />
                      ) : (
                        <Copy className="w-3.5 h-3.5 text-gray-500 group-hover:text-gray-700" />
                      )}
                    </button>
                  ) : (
                    <span className="text-gray-400">N/A</span>
                  )}
                </td>

                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                  {new Date(membership.joinedAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                  <Link to={`/dashboard/club-inbox/${membership.clubId}`}>
                    <Button
                      className="w-full bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                      size="lg"
                    >
                      Open
                    </Button>
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default JoinedClub;
