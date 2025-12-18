import { axiosSecure } from "@/Hooks/useAxiosSecure";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router";
import { useAuth } from "@/Context/AuthContext";
import { Award, Clock, MapPin, Sparkles, Bell, Settings } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import EventCard from "../Events/EventCard";
import AppLoader from "@/components/Shared/Loader/AppLoader";
import type { EventType } from "../Events/Events_text";

interface Club {
  _id: string;
  clubName: string;
  category: string;
  description: string;
  location: string;
  managerEmail: string;
  membershipFee: number;
  status: string;
  createdAt: string;
}

interface Membership {
  _id: string;
  userEmail: string;
  clubId: string;
  status: string;
  joinedAt: string;
  expiresAt?: string | null;
  type: string;
}

const ClubInbox = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();

  const { data: clubDetails, isLoading: clubLoading } = useQuery<Club>({
    queryKey: ["club-details", id],
    enabled: !!id,
    queryFn: async () => {
      const res = await axiosSecure.get(`/club-details/${id}`);
      return res.data;
    },
  });

  const { data: membership, isLoading: membershipLoading } =
    useQuery<Membership>({
      queryKey: ["verified-user", id, user?.email],
      enabled: !!id && !!user?.email,
      queryFn: async () => {
        const res = await axiosSecure.get(`/payment-user/${id}`);
        return res.data;
      },
    });

  const { data: events = [], isLoading: clubsLoading } = useQuery<EventType[]>({
    queryKey: ["club-events", id],
    enabled: !!id,
    queryFn: async () => {
      const res = await axiosSecure.get<EventType[]>(`/club-events/${id}`);
      return res.data;
    },
  });

  console.log(events);

  const isLoading = clubLoading || membershipLoading || clubsLoading;

  if (isLoading) {
    return <AppLoader />;
  }

  if (!clubDetails) {
    return (
      <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-6">
        <Alert variant="destructive">
          <AlertDescription>Club not found</AlertDescription>
        </Alert>
      </div>
    );
  }

  const memberSince = membership?.joinedAt
    ? new Date(membership.joinedAt).toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      })
    : "Recently";

  return (
    <div>
      {membership && membership?.type === "membership" ? (
        <div className=" bg-linear-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
          {/* Header Section */}
          <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">
                      {clubDetails.clubName}
                    </h1>
                    <Badge variant="secondary" className="text-sm">
                      <Sparkles className="w-3 h-3 mr-1" />
                      Premium
                    </Badge>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 mb-3">
                    {clubDetails.description}
                  </p>
                  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {clubDetails.location}
                    </div>
                    <div className="flex items-center gap-1">
                      <Award className="w-4 h-4" />
                      {clubDetails.category}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      Member since {memberSince}
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="icon">
                    <Bell className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="icon">
                    <Settings className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        " You have no access in this course "
      )}

      <div className=" flex flex-col gap-2 mt-5">
        {events && events.map((event) => <EventCard event={event} />)}
      </div>
    </div>
  );
};

export default ClubInbox;
