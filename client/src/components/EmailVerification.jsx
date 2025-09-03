import React, { useState, useEffect } from "react";
import { CheckCircle, AlertCircle, Mail, Loader } from "lucide-react";

const EmailVerification = ({ token }) => {
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [countdown, setCountdown] = useState(3);

  const verifyEmail = async (token) => {
    const response = await fetch(
      `http://localhost:5000/api/auth/verifyEmail/${token}`,
      {
        method: "GET",
        credentials: "include",
      }
    );
    return await response.json();
  };

  const getTokenFromURL = () => {
    const path = window.location.pathname;
    return path.split("/verify-email/")[1] || token;
  };

  useEffect(() => {
    const handleEmailVerification = async () => {
      const currentToken = getTokenFromURL();

      if (!currentToken) {
        setError(
          "Invalid verification link. Please check your email for the correct link."
        );
        setLoading(false);
        return;
      }

      try {
        const response = await verifyEmail(currentToken);

        if (response.status === "success") {
          setSuccess(true);
          setError("");

          // Start countdown for redirect
          const countdownInterval = setInterval(() => {
            setCountdown((prev) => {
              if (prev <= 1) {
                clearInterval(countdownInterval);
                window.location.href = "/dashboard";
                return 0;
              }
              return prev - 1;
            });
          }, 1000);
        } else {
          setError(
            response.message || "Email verification failed. Please try again."
          );
        }
      } catch (err) {
        console.error("Email verification error:", err);
        setError("Network error. Please check your connection and try again.");
      } finally {
        setLoading(false);
      }
    };

    handleEmailVerification();
  }, [token]);

  const goToLogin = () => {
    window.location.href = "/login";
  };

  const goToDashboard = () => {
    window.location.href = "/dashboard";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <div className="mx-auto h-16 w-16 bg-blue-100 rounded-full flex items-center justify-center">
              <Loader className="h-8 w-8 text-blue-600 animate-spin" />
            </div>
            <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
              Verifying Your Email... 📧
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Please wait while we verify your email address
            </p>
          </div>

          <div className="bg-white py-8 px-6 shadow-xl rounded-lg">
            <div className="text-center space-y-4">
              <div className="animate-pulse">
                <div className="flex justify-center space-x-1 mb-4">
                  <div className="h-2 w-2 bg-blue-600 rounded-full animate-bounce"></div>
                  <div
                    className="h-2 w-2 bg-blue-600 rounded-full animate-bounce"
                    style={{ animationDelay: "0.1s" }}
                  ></div>
                  <div
                    className="h-2 w-2 bg-blue-600 rounded-full animate-bounce"
                    style={{ animationDelay: "0.2s" }}
                  ></div>
                </div>
                <p className="text-gray-600">Verifying your email address...</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <div className="mx-auto h-16 w-16 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
              Email Verified Successfully! 🎉
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Welcome to Pizza App! Your account is now active.
            </p>
          </div>

          <div className="bg-white py-8 px-6 shadow-xl rounded-lg">
            <div className="text-center space-y-4">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <p className="text-green-800 font-medium">
                  🎊 Congratulations! Your email has been verified and you're
                  now logged in!
                </p>
              </div>

              <div className="space-y-3">
                <div className="text-sm text-gray-600">
                  <p>You can now:</p>
                  <ul className="mt-2 text-left space-y-1">
                    <li>🍕 Browse and customize pizzas</li>
                    <li>🛒 Add items to your cart</li>
                    <li>📦 Track your orders</li>
                    <li>👤 Manage your profile</li>
                  </ul>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <p className="text-blue-800 text-sm">
                    Redirecting to your dashboard in{" "}
                    <strong>{countdown}</strong> seconds...
                  </p>
                </div>
              </div>

              <div className="pt-4 space-y-3">
                <button
                  onClick={goToDashboard}
                  className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
                >
                  Go to Dashboard Now
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="mx-auto h-16 w-16 bg-red-100 rounded-full flex items-center justify-center">
            <AlertCircle className="h-8 w-8 text-red-600" />
          </div>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Verification Failed ❌
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            There was a problem verifying your email
          </p>
        </div>

        <div className="bg-white py-8 px-6 shadow-xl rounded-lg">
          <div className="text-center space-y-4">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center justify-center">
                <AlertCircle className="h-5 w-5 text-red-600 mr-2" />
                <p className="text-red-800 text-sm font-medium">{error}</p>
              </div>
            </div>

            <div className="text-sm text-gray-600 space-y-2">
              <p>
                <strong>Possible reasons:</strong>
              </p>
              <ul className="text-left space-y-1">
                <li>• The verification link has expired (24 hours)</li>
                <li>• The link has already been used</li>
                <li>• The link was copied incorrectly</li>
                <li>• Network connection issues</li>
              </ul>
            </div>

            <div className="pt-4 space-y-3">
              <button
                onClick={() => (window.location.href = "/register")}
                className="w-full flex justify-center py-3 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
              >
                Register Again
              </button>

              <button
                onClick={goToLogin}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
              >
                Back to Login
              </button>
            </div>
          </div>

          {/* Help Section */}
          <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="text-sm font-medium text-blue-900 mb-2">
              💡 Need Help?
            </h3>
            <ul className="text-xs text-blue-800 space-y-1">
              <li>• Check your spam/junk folder for the verification email</li>
              <li>• Make sure you clicked the most recent verification link</li>
              <li>• Try registering with the same email to get a new link</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailVerification;
