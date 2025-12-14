import { axiosSecure } from "@/Hooks/useAxiosSecure";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router";
import {
  CheckCircle2,
  Download,
  Calendar,
  Mail,
  MapPin,
  CreditCard,
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session_id");

  const { data, isLoading, error } = useQuery({
    queryKey: ["verify-payment", sessionId],
    enabled: !!sessionId,
    queryFn: async () => {
      const res = await axiosSecure.patch(
        `/payment/verify?session_id=${sessionId}`
      );
      return res.data;
    },
  });

  const downloadReceipt = () => {
    if (!data) return;

    const receipt = `
═══════════════════════════════════════════
           PAYMENT RECEIPT
═══════════════════════════════════════════

Payment Status: ${data.payment_info.payment_status.toUpperCase()}
Transaction ID: ${sessionId}
Date: ${new Date().toLocaleDateString()}
Time: ${new Date().toLocaleTimeString()}

───────────────────────────────────────────
CUSTOMER DETAILS
───────────────────────────────────────────
Email: ${data.payment_info.customer_email}

───────────────────────────────────────────
PRODUCT DETAILS
───────────────────────────────────────────
Club Name: ${data.product_data.clubName}
Description: ${data.product_data.description}
Category: ${data.product_data.category}
Location: ${data.product_data.location}

───────────────────────────────────────────
PAYMENT DETAILS
───────────────────────────────────────────
Amount: ${(
      data.payment_info.presentment_details.presentment_amount / 100
    ).toFixed(
      2
    )} ${data.payment_info.presentment_details.presentment_currency.toUpperCase()}
Currency: ${data.payment_info.presentment_details.presentment_currency.toUpperCase()}

───────────────────────────────────────────
Thank you for your purchase!
═══════════════════════════════════════════
    `.trim();

    const blob = new Blob([receipt], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `receipt-${sessionId}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-green-50 to-emerald-50 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mb-4"></div>
          <p className="text-lg text-gray-700">Verifying your payment...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-linear-to-br from-red-50 to-orange-50 flex items-center justify-center p-4">
        <Alert className="max-w-md border-red-200 bg-white">
          <AlertDescription className="text-red-800">
            <p className="font-semibold mb-2">Payment Verification Failed</p>
            <p className="text-sm">
              Something went wrong while verifying your payment. Please contact
              support.
            </p>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const amount = (
    data.payment_info.presentment_details.presentment_amount / 100
  ).toFixed(2);
  const currency =
    data.payment_info.presentment_details.presentment_currency.toUpperCase();

  return (
    <div className="min-h-screen bg-linear-to-br from-green-50 via-emerald-50 to-teal-50 flex items-center justify-center p-4 py-12">
      <div className="w-full max-w-2xl">
        {/* Success Header */}
        <div className="text-center mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-4">
            <CheckCircle2 className="w-12 h-12 text-green-600" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            Payment Successful!
          </h1>
          <p className="text-gray-600 text-lg">
            Your transaction has been completed successfully
          </p>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden animate-in fade-in slide-in-from-bottom-8 duration-700 delay-150">
          {/* Club Banner */}
          <div className="relative h-48 md:h-64 overflow-hidden">
            <img
              src={data.product_data.bannerImage}
              alt={data.product_data.clubName}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent"></div>
            <div className="absolute bottom-4 left-4 right-4">
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-1">
                {data.product_data.clubName}
              </h2>
              <p className="text-white/90 text-sm md:text-base line-clamp-2">
                {data.product_data.description}
              </p>
            </div>
          </div>

          {/* Payment Details */}
          <div className="p-6 md:p-8">
            {/* Amount Section */}
            <div className="bg-linear-to-r from-green-50 to-emerald-50 rounded-xl p-6 mb-6 border border-green-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Amount Paid</p>
                  <p className="text-3xl md:text-4xl font-bold text-green-700">
                    {amount} <span className="text-2xl">{currency}</span>
                  </p>
                </div>
                <CreditCard className="w-12 h-12 text-green-600 opacity-50" />
              </div>
            </div>

            {/* Transaction Info */}
            <div className="space-y-4 mb-6">
              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-gray-400 mt-0.5 shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-500">Customer Email</p>
                  <p className="text-gray-900 font-medium break-all">
                    {data.payment_info.customer_email}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-gray-400 mt-0.5 shrink-0" />
                <div className="flex-1">
                  <p className="text-sm text-gray-500">Location</p>
                  <p className="text-gray-900 font-medium">
                    {data.product_data.location}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Calendar className="w-5 h-5 text-gray-400 mt-0.5 hrink-0" />
                <div className="flex-1">
                  <p className="text-sm text-gray-500">Transaction Date</p>
                  <p className="text-gray-900 font-medium">
                    {new Date().toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-100">
                <p className="text-sm text-gray-500 mb-1">Transaction ID</p>
                <p className="text-xs md:text-sm text-gray-900 font-mono bg-gray-50 p-3 rounded-lg break-all">
                  {sessionId}
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={downloadReceipt}
                className="flex-1 flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-xl transition-colors duration-200 shadow-lg shadow-green-600/30"
              >
                <Download className="w-5 h-5" />
                Download Receipt
              </button>
              <button
                onClick={() => (window.location.href = "/")}
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 px-6 rounded-xl transition-colors duration-200"
              >
                Back to Home
              </button>
            </div>
          </div>
        </div>

        {/* Footer Note */}
        <p className="text-center text-sm text-gray-500 mt-6">
          A confirmation email has been sent to your registered email address
        </p>
      </div>
    </div>
  );
};

export default PaymentSuccess;
