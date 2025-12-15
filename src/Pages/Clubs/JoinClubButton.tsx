import { useState } from "react";
import { Button } from "@/components/ui/button";
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
import { CreditCard, UserPlus } from "lucide-react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { axiosSecure } from "@/Hooks/useAxiosSecure";
import { useAuth } from "@/Context/AuthContext";
import { useNavigate } from "react-router";

interface JoinClubButtonProps {
  clubId: string;
  clubName: string;
  description: string;
  membershipFee: number;
  managerEmail: string;
  isAlreadyMember: boolean;
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

const JoinClubButton = ({
  clubId,
  clubName,
  description,
  membershipFee,
  managerEmail,
}: JoinClubButtonProps) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [isAlreadyMember, setIsAlreadyMember] = useState<boolean>();

  const isFree = membershipFee === 0;

  const paymentInfo = {
    clubId,
    clubName,
    description,
    cost: membershipFee,
    email: managerEmail,
  };

  const { data: membership } = useQuery<Membership>({
    queryKey: ["verified-user", clubId, user?.email],
    enabled: !!clubId && !!user?.email,
    queryFn: async () => {
      const res = await axiosSecure.get(`/payment-user/${clubId}`);
      return res.data;
    },
  });

  console.log(membership);
  if (membership?.type === "membership") {
    setIsAlreadyMember(true);
  }

  const { mutate, isPending } = useMutation({
    mutationFn: async () => {
      const res = await axiosSecure.post(
        "/create-checkout-session",
        paymentInfo
      );
      return res.data;
    },
    onSuccess: (url) => {
      window.location.href = url;
    },
  });

  const handleOpen = () => {
    if (!user) {
      return navigate("/log-in");
    }
    setOpen(true);
  };

  const handleConfirm = () => {
    mutate();
    setOpen(false);
  };

  // If already member → show Open button
  if (isAlreadyMember) {
    return (
      <Button
        className="w-full bg-linear-to-r from-blue-600 to-purple-600 text-white"
        onClick={() => navigate(`/dashboard/club-inbox/${clubId}`)}
      >
        Open
      </Button>
    );
  }

  return (
    <>
      <Button
        onClick={handleOpen}
        size="lg"
        className="w-full bg-linear-to-r from-blue-600 to-purple-600 text-white"
      >
        {isFree ? "Join Club" : "Join & Pay"}
      </Button>

      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent className="bg-white dark:bg-gray-900">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              {isFree ? <UserPlus /> : <CreditCard />}
              {isFree ? "Join Club" : "Confirm Payment"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {isFree
                ? `Join ${clubName} for free`
                : `Pay $${membershipFee} to join ${clubName}`}
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirm} disabled={isPending}>
              {isFree ? "Join Now" : "Proceed to Payment"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default JoinClubButton;
