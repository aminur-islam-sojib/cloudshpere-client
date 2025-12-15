import { useSearchParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { axiosSecure } from "@/Hooks/useAxiosSecure";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { CheckCircle2, Download, Mail, CreditCard, Copy } from "lucide-react";
import { toast } from "sonner";

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session_id");

  // 1️⃣ Verify payment → get membership
  const { data: verifyData, isLoading } = useQuery({
    queryKey: ["verify-payment", sessionId],
    enabled: !!sessionId,
    queryFn: async () => {
      const res = await axiosSecure.patch(
        `/payment/verify?session_id=${sessionId}`
      );
      return res.data;
    },
  });

  const membership = verifyData?.membership;
  const clubId = membership?.clubId;

  // 2️⃣ Fetch club details
  const { data: clubDetails, isLoading: clubLoading } = useQuery({
    queryKey: ["club-details", clubId],
    enabled: !!clubId,
    queryFn: async () => {
      const res = await axiosSecure.get(`/club-details/${clubId}`);
      return res.data;
    },
  });

  const handleCopyTransactionId = async () => {
    if (!membership?.paymentId) return;
    await navigator.clipboard.writeText(membership.paymentId);
    toast.success("Transaction ID copied");
  };

  const handleDownloadReceipt = () => {
    if (!membership || !clubDetails) {
      toast.error("Receipt not ready");
      return;
    }

    const receipt = `
════════════════════════════════════════════
              PAYMENT RECEIPT
════════════════════════════════════════════

Transaction ID: ${membership.paymentId}
Status: ACTIVE
Date: ${new Date(membership.createdAt).toLocaleString()}

──────── CUSTOMER ────────
Email: ${membership.userEmail}

──────── CLUB DETAILS ────────
Club: ${clubDetails.clubName}
Category: ${clubDetails.category}
Location: ${clubDetails.location}
Description: ${clubDetails.description}

──────── PAYMENT ────────
Method: Stripe (Card)
Membership Status: ${membership.status}

──────── SUPPORT ────────
Contact: ${clubDetails.managerEmail}

════════════════════════════════════════════
    `.trim();

    const blob = new Blob([receipt], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `membership-receipt-${membership._id}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast.success("Receipt downloaded");
  };

  if (isLoading || clubLoading)
    return <p className="text-center mt-10">Processing payment...</p>;

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <Card className="w-full max-w-3xl shadow-xl rounded-2xl">
        <CardHeader className="text-center">
          <CheckCircle2 className="mx-auto h-12 w-12 text-green-500" />
          <CardTitle className="text-2xl">Payment Successful</CardTitle>
          <CardDescription>
            Your membership has been activated successfully.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <Badge
              variant="outline"
              className="text-green-600 border-green-600"
            >
              ACTIVE
            </Badge>

            <div className="flex items-center gap-2 text-sm">
              <span>Transaction ID:</span>
              <code className="rounded bg-muted px-2 py-1 text-xs">
                {membership.paymentId}
              </code>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleCopyTransactionId}
                className="h-7 w-7"
              >
                <Copy className="h-4 w-4 rotate-90" />
              </Button>
            </div>
          </div>

          <Separator />

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <h4 className="font-semibold mb-2">Customer</h4>
              <p className="flex items-center gap-2 text-sm">
                <Mail className="h-4 w-4" /> {membership.userEmail}
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Payment Method</h4>
              <p className="flex items-center gap-2 text-sm">
                <CreditCard className="h-4 w-4" /> Stripe
              </p>
            </div>
          </div>

          <Separator />

          <div>
            <h4 className="font-semibold mb-2">Club Details</h4>
            <div className="rounded-lg border p-4 space-y-1">
              <p className="font-medium">{clubDetails.clubName}</p>
              <p className="text-sm text-muted-foreground">
                {clubDetails.description}
              </p>
              <p className="text-sm">Category: {clubDetails.category}</p>
              <p className="text-sm">Location: {clubDetails.location}</p>
            </div>
          </div>
        </CardContent>

        <div className="flex justify-center pb-6">
          <Button onClick={handleDownloadReceipt} className="gap-2">
            <Download className="h-4 w-4" /> Download Receipt
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default PaymentSuccess;
