import React from "react";
import { useNavigate } from "react-router-dom";
import Navigation from "../../components/Navigation";
import LoginForm from "../../components/LoginForm";
import SignupForm from "../../components/SignupForm";
import OtpVerificationModal from "../../components/OtpVerificationModal";
import SuccessModal from "../../components/SuccessModal";
import { authAPI, otpAPI } from "../../services/api";


function LoginPage() {
  const navigate = useNavigate();
  const [showSignup, setShowSignup] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState("");
  const [showOtpModal, setShowOtpModal] = React.useState(false);
  const [pendingUser, setPendingUser] = React.useState(null);
  const [showSuccessModal, setShowSuccessModal] = React.useState(false);

  const handleLogin = async (email, password) => {
    setIsLoading(true);
    setError("");
    try {
      console.log("Attempting login with:", email);
      const response = await authAPI.login(email, password);

      console.log("Login response:", response);

      if (response.success) {
        // Store token and user info
        localStorage.setItem("token", response.token);
        localStorage.setItem("userRole", response.user.role);
        localStorage.setItem("userId", response.user.id);
        localStorage.setItem("userName", response.user.name);
        localStorage.setItem("userEmail", response.user.email);

        console.log("User data stored. Role:", response.user.role);

        // Redirect based on actual role from backend
        const actualRole = response.user.role;
        console.log("Redirecting to:", actualRole);

        if (actualRole === "admin") {
          navigate("/admin-dashboard");
        } else if (actualRole === "venue-owner") {
          navigate("/venue-dashboard");
        } else if (actualRole === "user") {
          navigate("/home");
        } else {
          console.error("Unknown role:", actualRole);
          setError(`Unknown role: ${actualRole}`);
        }
      } else if (response.requiresVerification) {
        // User needs to verify email
        setPendingUser({
          email: response.user.email,
          name: response.user.name
        });
        // Send OTP for verification
        await otpAPI.resendOtp(response.user.email, response.user.name);
        setShowOtpModal(true);
      } else {
        console.error("Login failed:", response.message);
        setError(response.message || "Login failed. Please try again.");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError(err.message || "Connection error. Please check if the backend is running.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = async (formData) => {
    setIsLoading(true);
    setError("");
    try {
      const response = await authAPI.register(formData);

      if (response.success) {
        // Show OTP verification modal
        setPendingUser({
          email: formData.email,
          name: formData.name
        });
        setShowOtpModal(true);
        setShowSignup(false);
      } else {
        setError(response.message || "Signup failed. Please try again.");
      }
    } catch (err) {
      setError("Connection error. Please check if the backend is running.");
      console.error("Signup error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpVerified = () => {
    setShowOtpModal(false);
    setPendingUser(null);
    setShowSuccessModal(true);
  };

  const handleSuccessModalClose = () => {
    setShowSuccessModal(false);
  };

  const handleOtpModalClose = () => {
    setShowOtpModal(false);
    setError("Please verify your email to complete registration. You can login and verify later.");
  };

  if (showSignup) {
    return (
      <div className="min-h-screen bg-gray-200 flex flex-col">
        <Navigation />

        {/* Page Layout */}
        <div className="flex flex-1 items-center justify-center px-10 py-10 space-x-16">
          {/* Left Image */}
          <div className="w-[420px] h-auto shadow-xl rounded-lg overflow-hidden">
            <img
              src="src/assets/loginpage.png"
              alt="Decor"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Signup Form Component */}
          <SignupForm
            onSignup={handleSignup}
            onBackClick={() => {
              setShowSignup(false);
              setError("");
            }}
            isLoading={isLoading}
            error={error}
          />
        </div>

        {/* OTP Verification Modal */}
        {showOtpModal && pendingUser && (
          <OtpVerificationModal
            email={pendingUser.email}
            name={pendingUser.name}
            onVerified={handleOtpVerified}
            onClose={handleOtpModalClose}
          />
        )}

        {/* Success Modal */}
        {showSuccessModal && (
          <SuccessModal
            title="Email Verified!"
            message="Your email has been verified successfully. You can now login to your account."
            onClose={handleSuccessModalClose}
            autoClose={4000}
          />
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-200 flex flex-col">
      <Navigation />

      {/* Page Layout */}
      <div className="flex flex-1 items-center justify-center px-10 py-10 space-x-16">
        {/* Left Image */}
        <div className="w-[420px] h-auto shadow-xl rounded-lg overflow-hidden">
          <img
            src="src/assets/loginpage.png"
            alt="Decor"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Login Form Component */}
        <LoginForm
          onLogin={handleLogin}
          onSignupClick={() => {
            setShowSignup(true);
            setError("");
          }}
          isLoading={isLoading}
          error={error}
        />
      </div>

      {/* OTP Verification Modal */}
      {showOtpModal && pendingUser && (
        <OtpVerificationModal
          email={pendingUser.email}
          name={pendingUser.name}
          onVerified={handleOtpVerified}
          onClose={handleOtpModalClose}
        />
      )}

      {/* Success Modal */}
      {showSuccessModal && (
        <SuccessModal
          title="Email Verified!"
          message="Your email has been verified successfully. You can now login to your account."
          onClose={handleSuccessModalClose}
          autoClose={4000}
        />
      )}
    </div>
  );
}

export default LoginPage;
