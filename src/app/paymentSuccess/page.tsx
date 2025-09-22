"use client";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";

export interface Parent {
  _id: string;
  username: string;
  email: string;
  whatsapp: string;
  motherFirstName: string;
  motherLastName: string;
  fatherFirstName: string;
  fatherLastName: string;
  country: string;
  studentName?: string;
}

export default function PaymentSuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session, update } = useSession();
  const studentId = searchParams.get("studentId");
  const amount = searchParams.get("amount");
  const transactionId = searchParams.get("transactionId");

  const [parents, setParents] = useState<Parent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [downloading, setDownloading] = useState(false);

  const fetchParentByStudent = async () => {
    try {
      const parentRes = await fetch(
        `/api/parents/fetchParentByStudent?studentIds=${studentId}`
      );
      const parentData = await parentRes.json();
      const transformed = parentData.map((parent: any) => {
        const studentNames =
          parent.student?.map((s: any) => s.name).join(", ") || "";
        return {
          _id: parent._id,
          username: parent.username,
          country: parent.country,
          email: parent.email,
          whatsapp: parent.whatsapp,
          studentName: studentNames,
        };
      });
      setParents(transformed);
      return transformed;
    } catch (err) {
      console.error("Failed to fetch parent:", err);
      return [];
    }
  };

  const handleDownloadInvoice = async () => {
    if (!transactionId) return;
    setDownloading(true);
    try {
      const response = await fetch("/api/regenerateInvoice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ transactionId }),
      });

      if (!response.ok) throw new Error("Failed to generate invoice");

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `Universal_Tamil_Academy_Invoice_${transactionId}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      setError("Failed to download invoice.");
    } finally {
      setDownloading(false);
    }
  };

  useEffect(() => {
    const handlePaymentSuccess = async () => {
      if (!studentId) return;
      try {
        // Fetch parent data first
        const parentsData = await fetchParentByStudent();
        if (parentsData.length === 0) {
          throw new Error("No parent data found");
        }

        // Update payment status in backend
        const paymentResponse = await fetch("/api/paymentStatus", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            studentId,
            transactionId: transactionId || "",
          }),
        });

        if (!paymentResponse.ok) {
          throw new Error("Payment status update failed");
        }

        // Force a visible session refresh
        await fetch("/api/auth/session", {
          method: "GET",
          credentials: "include",
          cache: "no-store",
        });

        // Update client-side session state
        await update({
          ...session,
          updated: Date.now(),
        });
      } catch (error) {
        console.error("Payment processing error:", error);
        setError(
          "Payment succeeded but session update failed. Please refresh the page."
        );
      } finally {
        setLoading(false);
      }
    };

    handlePaymentSuccess();
  }, [studentId, transactionId, update, session]);

  const handleDashboardRedirect = () => {
    router.push("/dashboard/parent");
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-center">
        <div>
          <h1 className="text-3xl font-bold mb-2">Processing Payment...</h1>
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto my-4"></div>
          <p>Updating your session... Please wait.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 13l4 4L19 7"
              ></path>
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            Payment Successful!
          </h1>
          <p className="text-gray-600">
            You can download your invoice or redirect to dashboard
          </p>
          <div className="mt-4 p-3 bg-blue-50 rounded-md">
            <p className="text-blue-800 font-semibold">Amount Paid: ${amount}</p>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
            {error}
          </div>
        )}

        <div className="mt-6 space-y-4">
          <button
            onClick={handleDownloadInvoice}
            disabled={downloading}
            className="w-full flex items-center justify-center px-4 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            {downloading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Downloading...
              </>
            ) : (
              <>
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  ></path>
                </svg>
                Download Invoice
              </>
            )}
          </button>

          <button
            onClick={handleDashboardRedirect}
            className="w-full flex items-center justify-center px-4 py-3 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
              ></path>
            </svg>
            Go to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}