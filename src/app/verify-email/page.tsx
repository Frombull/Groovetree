"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
// import Aurora from "@/app/components/Aurora";
import { FaCheckCircle, FaTimesCircle, FaSpinner } from "react-icons/fa";

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");

  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setMessage("Invalid verification link");
      return;
    }

    verifyEmail(token);
  }, [token]);

  const verifyEmail = async (token: string) => {
    try {
      const response = await fetch("/api/auth/verify-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token }),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus("success");
        setMessage(data.message || "Email verified successfully!");
        
        // Redirect to settings after 3 seconds
        setTimeout(() => {
          router.push("/settings");
        }, 3000);
      } else {
        setStatus("error");
        setMessage(data.error || "Failed to verify email");
      }
    } catch (error) {
      console.error("Verification error:", error);
      setStatus("error");
      setMessage("An error occurred during verification");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950 relative flex items-center justify-center">
      {/* Aurora Background */}
      {/* <div className="absolute inset-0 opacity-30 dark:opacity-40 pointer-events-none">
        <Aurora colorStops={["#5227FF", "#7cff67", "#5227FF"]} />
      </div> */}

      <div className="relative z-10 max-w-md w-full mx-4">
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl border dark:border-gray-800 p-8">
          {/* Logo */}
          <div className="text-center mb-8">
            <Link href="/">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-purple-900 bg-clip-text text-transparent">
                Groovetree
              </h1>
            </Link>
          </div>

          {/* Status Content */}
          <div className="text-center">
            {status === "loading" && (
              <>
                <FaSpinner className="w-16 h-16 text-purple-600 mx-auto mb-4 animate-spin" />
                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                  Verifying Email...
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  Please wait while we verify your email address
                </p>
              </>
            )}

            {status === "success" && (
              <>
                <FaCheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                  Email Verified!
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  {message}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-500">
                  Redirecting to settings...
                </p>
              </>
            )}

            {status === "error" && (
              <>
                <FaTimesCircle className="w-16 h-16 text-red-600 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                  Verification Failed
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  {message}
                </p>
                <div className="space-y-3 flex justify-center">

                  <Link
                    href="/settings"
                    className="block w-64 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all">
                    Back to Groovetree
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 dark:bg-slate-950 relative flex items-center justify-center">
        {/* <div className="absolute inset-0 opacity-30 dark:opacity-40 pointer-events-none">
          <Aurora colorStops={["#5227FF", "#7cff67", "#5227FF"]} />
        </div> */}
        <div className="relative z-10 max-w-md w-full mx-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl border dark:border-gray-800 p-8">
            <div className="text-center mb-8">
              <Link href="/">
                <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-purple-900 bg-clip-text text-transparent">
                  Groovetree
                </h1>
              </Link>
            </div>
            <div className="text-center">
              <FaSpinner className="w-16 h-16 text-purple-600 mx-auto mb-4 animate-spin" />
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                Loading...
              </h2>
            </div>
          </div>
        </div>
      </div>
    }>
      <VerifyEmailContent />
    </Suspense>
  );
}
