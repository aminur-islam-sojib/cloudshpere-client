/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  MapPin,
  Calendar,
  Users,
  DollarSign,
  Sparkles,
  CreditCard,
  UserPlus,
  Clock,
  Building,
} from "lucide-react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Link, useNavigate, useParams } from "react-router";
import axiosPublic from "@/Hooks/axiosPublic";
import { axiosSecure } from "@/Hooks/useAxiosSecure";
import { useAuth } from "@/Context/AuthContext";

interface EventData {
  _id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  fee?: number;
  capacity?: number;
  clubId?: string;
  clubName?: string;
  createdAt: string;
}

const EventDetails = () => {
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const { data, isLoading } = useQuery<EventData>({
    queryKey: ["event-details", id],
    enabled: !!id,
    queryFn: async () => {
      const res = await axiosPublic.get<EventData>(`/api/events/${id}`);
      return res.data;
    },
  });

  const { mutate: registerMutation } = useMutation({
    mutationFn: async () => {
      const res = await axiosSecure.post("/api/registrations", {
        eventId: id,
      });
      return res.data;
    },
    onSuccess: (data) => {
      if (data.requiresPayment) {
        // Handle paid event registration
        const paymentData = {
          eventId: data.event.id,
          eventTitle: data.event.title,
          email: user?.email,
          description: data.event.description,
          cost: data.event.fee,
        };

        axiosSecure
          .post("/api/create-event-checkout-session", paymentData)
          .then((res) => {
            window.location.href = res.data;
          })
          .catch((err) => {
            console.error("Payment error:", err);
          });
      } else {
        // Free event registration successful
        alert("Successfully registered for the event!");
        setIsRegisterModalOpen(false);
      }
    },
    onError: (err: any) => {
      console.log(err);
      if (err.response?.status === 409) {
        alert("You are already registered for this event");
      } else {
        alert("Registration failed. Please try again.");
      }
      setIsRegisterModalOpen(false);
    },
  });

  const handleRegisterButton = () => {
    if (!user) {
      navigate("/log-in");
      return;
    }
    setIsRegisterModalOpen(true);
  };

  const handleConfirmRegister = () => {
    registerMutation();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const isEventPassed = data ? new Date(data.date) < new Date() : false;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-linear-to-br from-gray-50 to-gray-100 dark:from-gray-950 dark:to-gray-900">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-200 dark:border-gray-700 border-t-blue-600 dark:border-t-blue-500 mx-auto mb-4"></div>
            <Sparkles className="w-6 h-6 text-blue-600 dark:text-blue-400 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-pulse" />
          </div>
          <p className="text-lg font-medium text-gray-700 dark:text-gray-300">
            Loading event details...
          </p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-linear-to-br from-gray-50 to-gray-100 dark:from-gray-950 dark:to-gray-900">
        <div className="text-center">
          <div className="w-16 h-16 bg-gray-200 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">😕</span>
          </div>
          <p className="text-lg font-medium text-gray-700 dark:text-gray-300">
            Event not found
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      {/* Event Header */}
      <Card className="overflow-hidden">
        <div className="relative h-64 bg-linear-to-br from-blue-500 to-purple-600">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center text-white">
              <Calendar size={64} className="mx-auto mb-4 opacity-80" />
              <h1 className="text-3xl font-bold mb-2">{data.title}</h1>
              <p className="text-lg opacity-90">{formatDate(data.date)}</p>
            </div>
          </div>
        </div>

        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Event Details */}
            <div className="flex-1 space-y-4">
              <div>
                <h2 className="text-xl font-semibold mb-2">About This Event</h2>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  {data.description}
                </p>
              </div>

              <Separator />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="font-medium">Location</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {data.location}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="font-medium">Date & Time</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {formatDate(data.date)}
                    </p>
                  </div>
                </div>

                {data.clubName && (
                  <div className="flex items-center gap-3">
                    <Building className="w-5 h-5 text-blue-600" />
                    <div>
                      <p className="font-medium">Organized by</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {data.clubName}
                      </p>
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-3">
                  <DollarSign className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="font-medium">Registration Fee</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {data.fee && data.fee > 0 ? `$${data.fee}` : "Free"}
                    </p>
                  </div>
                </div>

                {data.capacity && (
                  <div className="flex items-center gap-3">
                    <Users className="w-5 h-5 text-blue-600" />
                    <div>
                      <p className="font-medium">Capacity</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {data.capacity} attendees
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Registration Card */}
            <div className="lg:w-80">
              <Card className="sticky top-4">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <UserPlus className="w-5 h-5" />
                    Event Registration
                  </CardTitle>
                  <CardDescription>
                    {isEventPassed
                      ? "This event has already passed"
                      : "Secure your spot for this event"}
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Registration Fee:</span>
                    <span className="text-lg font-bold text-green-600">
                      {data.fee && data.fee > 0 ? `$${data.fee}` : "Free"}
                    </span>
                  </div>

                  {data.fee && data.fee > 0 && (
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <CreditCard className="w-4 h-4" />
                      <span>Secure payment required</span>
                    </div>
                  )}

                  <Button
                    onClick={handleRegisterButton}
                    disabled={isEventPassed}
                    className="w-full bg-linear-to-r from-blue-600 to-indigo-600 hover:scale-[1.02] disabled:opacity-50"
                    size="lg"
                  >
                    {isEventPassed ? "Event Passed" : "Register Now"}
                  </Button>

                  {!user && (
                    <p className="text-sm text-gray-500 text-center">
                      <Link
                        to="/log-in"
                        className="text-blue-600 hover:underline"
                      >
                        Login required
                      </Link>{" "}
                      to register
                    </p>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Registration Confirmation Dialog */}
      <AlertDialog
        open={isRegisterModalOpen}
        onOpenChange={setIsRegisterModalOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Registration</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to register for "{data.title}"?
              {data.fee && data.fee > 0 && (
                <span className="block mt-2 font-medium text-red-600">
                  This will cost ${data.fee} and redirect you to payment.
                </span>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmRegister}>
              {data.fee && data.fee > 0 ? "Proceed to Payment" : "Register"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default EventDetails;
