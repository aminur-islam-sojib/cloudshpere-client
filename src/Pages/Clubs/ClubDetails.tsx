import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
  Mail,
  Calendar,
  Users,
  DollarSign,
  CreditCard,
  UserPlus,
  User2,
} from "lucide-react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Link, useNavigate, useParams } from "react-router";
import axiosPublic from "@/Hooks/axiosPublic";
import { axiosSecure } from "@/Hooks/useAxiosSecure";
import { useAuth } from "@/Context/AuthContext";
import AppLoader from "@/components/Shared/Loader/AppLoader";

interface ClubData {
  _id: string;
  bannerImage: string;
  category: string;
  clubName: string;
  createdAt: string;
  description: string;
  location: string;
  managerEmail: string;
  membershipFee: number;
}

const ClubDetails = () => {
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const { data, isLoading } = useQuery<ClubData>({
    queryKey: ["club-details", id],
    enabled: !!id,
    queryFn: async () => {
      const res = await axiosPublic.get<ClubData>(`/api/club-details/${id}`);
      return res.data;
    },
  });
  const { data: clubUsers = [] } = useQuery({
    queryKey: ["club-users", id],
    enabled: !!id,
    queryFn: async () => {
      const res = await axiosPublic.get(`/api/payment-users/${id}`);
      return res.data;
    },
  });

  const { data: VerifiedUser } = useQuery({
    queryKey: ["verified-user", id],
    enabled: !!id,
    queryFn: async () => {
      const res = await axiosSecure.get(`/payment-user/${id}`);
      return res.data;
    },
  });

  const paymentInfo = {
    clubName: data?.clubName,
    clubId: data?._id,
    email: data?.managerEmail,
    description: data?.description,
    cost: data?.membershipFee,
  };

  const { mutate } = useMutation({
    mutationFn: async () => {
      const res = await axiosSecure.post(
        "/create-checkout-session",
        paymentInfo
      );
      return res.data;
    },
    onSuccess: (data) => {
      console.log(data);
      window.location.href = data;
    },
    onError: (err) => {
      console.log(err);
    },
  });

  const handleJoinButton = () => {
    setIsJoinModalOpen(true);
  };

  const handleConfirmJoin = () => {
    if (!user) {
      return navigate("/log-in");
    }
    mutate();
    setIsJoinModalOpen(false);
  };

  if (isLoading) {
    return <AppLoader />;
  }

  if (!data) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-linear-to-br from-gray-50 to-gray-100 dark:from-gray-950 dark:to-gray-900">
        <div className="text-center">
          <div className="w-16 h-16 bg-gray-200 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">😕</span>
          </div>
          <p className="text-lg font-medium text-gray-700 dark:text-gray-300">
            Club not found
          </p>
        </div>
      </div>
    );
  }

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const isFree = data.membershipFee === 0;

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 via-blue-50/20 to-purple-50/20 dark:from-gray-950 dark:via-blue-950/20 dark:to-purple-950/20">
      {/* Banner Image */}
      <div className="relative h-96 w-full overflow-hidden">
        <img
          src={data.bannerImage}
          alt={data.clubName}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/40 to-transparent dark:from-black/90 dark:via-black/60"></div>

        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-10 right-10 w-32 h-32 bg-blue-500/10 dark:bg-blue-400/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 left-10 w-40 h-40 bg-purple-500/10 dark:bg-purple-400/10 rounded-full blur-3xl"></div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-8">
          <div className="max-w-6xl mx-auto">
            <Badge className="mb-4 bg-white/95 dark:bg-gray-900/95 text-gray-900 dark:text-white hover:bg-white dark:hover:bg-gray-900 backdrop-blur-sm border border-gray-200 dark:border-gray-700 shadow-lg">
              {data.category}
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-2 drop-shadow-2xl">
              {data.clubName}
            </h1>
            <div className="flex items-center gap-2 text-white/90">
              <MapPin className="w-4 h-4" />
              <span className="text-sm font-medium">{data.location}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Main Info */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="border-gray-200 dark:border-gray-800 shadow-lg hover:shadow-xl transition-shadow duration-300 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-2xl text-gray-900 dark:text-white">
                  About This Club
                </CardTitle>
                <CardDescription className="dark:text-gray-400">
                  Learn more about what we do
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-base">
                  {data.description}
                </p>
              </CardContent>
            </Card>

            <Card className="border-gray-200 dark:border-gray-800 shadow-lg hover:shadow-xl transition-shadow duration-300 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-2xl text-gray-900 dark:text-white">
                  Club Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-4 p-4 rounded-lg bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                    <MapPin className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900 dark:text-white mb-1">
                      Location
                    </p>
                    <p className="text-gray-600 dark:text-gray-400">
                      {data.location}
                    </p>
                  </div>
                </div>

                <Separator className="dark:bg-gray-800" />

                <div className="flex items-start gap-4 p-4 rounded-lg bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                  <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                    <Mail className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900 dark:text-white mb-1">
                      Manager Contact
                    </p>
                    <p className="text-gray-600 dark:text-gray-400 break-all">
                      {data.managerEmail}
                    </p>
                  </div>
                </div>

                <Separator className="dark:bg-gray-800" />

                <div className="flex items-start gap-4 p-4 rounded-lg bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                  <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                    <Calendar className="w-5 h-5 text-green-600 dark:text-green-400" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900 dark:text-white mb-1">
                      Established
                    </p>
                    <p className="text-gray-600 dark:text-gray-400">
                      {formatDate(data.createdAt)}
                    </p>
                  </div>
                </div>

                <Separator className="dark:bg-gray-800" />

                <div className="flex items-start gap-4 p-4 rounded-lg bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                  <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-lg">
                    <DollarSign className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900 dark:text-white mb-1">
                      Membership Fee
                    </p>
                    <p className="text-gray-600 dark:text-gray-400 text-lg font-bold">
                      {isFree ? (
                        <span className="text-green-600 dark:text-green-400">
                          Free
                        </span>
                      ) : (
                        `$${data.membershipFee}`
                      )}
                    </p>
                  </div>
                </div>

                <Separator className="dark:bg-gray-800" />

                <div className="flex items-start gap-4 p-4 rounded-lg bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                  <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                    <User2 className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900 dark:text-white mb-1">
                      Users
                    </p>
                    <p className="text-gray-600 dark:text-gray-400 text-lg font-bold">
                      {clubUsers?.totalUsers}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Actions */}
          <div className="space-y-6">
            <Card className="border-gray-200 dark:border-gray-800 shadow-lg hover:shadow-xl transition-shadow duration-300 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm sticky top-4">
              <CardHeader>
                <CardTitle className="text-xl text-gray-900 dark:text-white">
                  Join Our Community
                </CardTitle>
                <CardDescription className="dark:text-gray-400">
                  Become a member and start your journey with us
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-linear-to-br from-blue-50 to-purple-50 dark:from-blue-950/30 dark:to-purple-950/30 rounded-xl p-6 text-center border border-blue-100 dark:border-blue-900/50">
                  <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/50 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Users className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                  </div>
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Join our growing community
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                    Connect with amazing people
                  </p>
                </div>

                <div>
                  {VerifiedUser ? (
                    <Link to={`/dashboard/club-inbox/${id}`}>
                      <Button
                        className="w-full bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                        size="lg"
                      >
                        Open
                      </Button>
                    </Link>
                  ) : (
                    <Button
                      className="w-full bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                      size="lg"
                      onClick={handleJoinButton}
                    >
                      {isFree ? "Join Club" : "Join & Pay"}
                    </Button>
                  )}
                </div>

                <Button
                  variant="outline"
                  className="w-full border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 dark:text-white"
                  size="lg"
                >
                  Contact Manager
                </Button>
              </CardContent>
            </Card>

            <Card className="border-gray-200 dark:border-gray-800 shadow-lg hover:shadow-xl transition-shadow duration-300 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-xl text-gray-900 dark:text-white">
                  Membership Benefits
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                    <span className="text-green-500 dark:text-green-400 mt-1 text-lg">
                      ✓
                    </span>
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      Access to exclusive events
                    </span>
                  </li>
                  <li className="flex items-start gap-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                    <span className="text-green-500 dark:text-green-400 mt-1 text-lg">
                      ✓
                    </span>
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      Network with like-minded people
                    </span>
                  </li>
                  <li className="flex items-start gap-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                    <span className="text-green-500 dark:text-green-400 mt-1 text-lg">
                      ✓
                    </span>
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      Participate in club activities
                    </span>
                  </li>
                  <li className="flex items-start gap-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                    <span className="text-green-500 dark:text-green-400 mt-1 text-lg">
                      ✓
                    </span>
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      Learn and grow together
                    </span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Join Modal */}
      <AlertDialog open={isJoinModalOpen} onOpenChange={setIsJoinModalOpen}>
        <AlertDialogContent className="sm:max-w-[500px] bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
              {isFree ? (
                <>
                  <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                    <UserPlus className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <span>Join {data.clubName}</span>
                </>
              ) : (
                <>
                  <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                    <CreditCard className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                  </div>
                  <span>Join & Pay for {data.clubName}</span>
                </>
              )}
            </AlertDialogTitle>
            <AlertDialogDescription className="text-gray-600 dark:text-gray-400 text-base mt-2">
              {isFree
                ? "You're about to join this amazing club for free!"
                : `This club requires a membership fee of $${data.membershipFee}.`}
            </AlertDialogDescription>
          </AlertDialogHeader>

          <div className="py-4">
            <div className="bg-linear-to-br from-blue-50 to-purple-50 dark:from-blue-950/30 dark:to-purple-950/30 rounded-xl p-6 border border-blue-100 dark:border-blue-900/50">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Club Name
                  </span>
                  <span className="text-sm font-semibold text-gray-900 dark:text-white">
                    {data.clubName}
                  </span>
                </div>
                <Separator className="dark:bg-gray-700" />
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Category
                  </span>
                  <Badge className="bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900/50">
                    {data.category}
                  </Badge>
                </div>
                <Separator className="dark:bg-gray-700" />
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Membership Fee
                  </span>
                  <span className="text-lg font-bold">
                    {isFree ? (
                      <span className="text-green-600 dark:text-green-400">
                        Free
                      </span>
                    ) : (
                      <span className="text-purple-600 dark:text-purple-400">
                        ${data.membershipFee}
                      </span>
                    )}
                  </span>
                </div>
              </div>
            </div>

            {!isFree && (
              <div className="mt-4 p-4 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/50 rounded-lg">
                <p className="text-sm text-amber-800 dark:text-amber-300 flex items-start gap-2">
                  <span className="text-lg">💳</span>
                  <span>
                    You'll be redirected to the payment page after confirming.
                  </span>
                </p>
              </div>
            )}
          </div>

          <AlertDialogFooter className="gap-2 sm:gap-2">
            <AlertDialogCancel className="border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 dark:text-white">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmJoin}
              className={
                isFree
                  ? "bg-linear-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white flex items-center gap-2"
                  : "bg-linear-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white flex items-center gap-2"
              }
            >
              {isFree ? (
                <>
                  <UserPlus className="w-4 h-4" />
                  Join Now
                </>
              ) : (
                <>
                  <CreditCard className="w-4 h-4" />
                  Proceed to Payment
                </>
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ClubDetails;
