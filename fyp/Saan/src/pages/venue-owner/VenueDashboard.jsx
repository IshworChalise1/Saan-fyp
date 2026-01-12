import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { venueRegistrationAPI } from "../../services/api";

function VenueDashboard() {
  const navigate = useNavigate();
  const [registrationData, setRegistrationData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch registration status on mount
  useEffect(() => {
    const fetchRegistration = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setIsLoading(false);
          return;
        }

        const response = await venueRegistrationAPI.getMyRegistration(token);
        console.log("Registration response:", response); // Debug log
        if (response.success && response.exists && response.registration) {
          setRegistrationData(response.registration);
        } else {
          setRegistrationData(null);
        }
      } catch (error) {
        console.error("Error fetching registration:", error);
        setRegistrationData(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRegistration();
  }, []);

  // Helper function to check if any section is rejected
  const hasRejectedSections = () => {
    if (!registrationData) return false;

    const statusFields = [
      registrationData.venueNameStatus?.status,
      registrationData.phoneStatus?.status,
      registrationData.locationStatus?.status,
      registrationData.profileImageStatus?.status,
      registrationData.venueImagesStatus?.status,
      registrationData.documents?.citizenshipFrontStatus?.status,
      registrationData.documents?.citizenshipBackStatus?.status,
      registrationData.documents?.businessRegistrationStatus?.status,
      registrationData.documents?.panCardStatus?.status,
    ];

    return statusFields.some(status => status === "REJECTED");
  };

  // Determine if action banner should be shown
  const shouldShowActionBanner = () => {
    if (isLoading) return false;

    // No registration exists - show banner to start registration
    if (!registrationData) return true;

    const status = registrationData.registrationStatus;

    // Show banner if:
    // 1. Draft (not submitted yet)
    // 2. Has rejected sections that need correction
    // 3. Overall status is REJECTED
    if (status === "DRAFT" || status === "NOT_SUBMITTED") return true;
    if (hasRejectedSections()) return true;
    if (status === "REJECTED") return true;

    return false;
  };

  // Get action banner message based on status
  const getActionBannerInfo = () => {
    if (!registrationData) {
      return {
        title: "Complete Your Venue Registration",
        message: "Add your venue details, upload images, and submit for verification to start accepting bookings.",
        buttonText: "Start Registration",
        urgent: false
      };
    }

    const status = registrationData.registrationStatus;

    if (hasRejectedSections()) {
      return {
        title: "Action Required: Update Rejected Sections",
        message: "Some sections of your registration have been rejected. Please update them and resubmit.",
        buttonText: "Fix & Resubmit",
        urgent: true
      };
    }

    if (status === "REJECTED") {
      return {
        title: "Registration Rejected",
        message: "Your registration has been rejected. Please review the feedback and resubmit.",
        buttonText: "Review & Resubmit",
        urgent: true
      };
    }

    if (status === "DRAFT" || status === "NOT_SUBMITTED") {
      return {
        title: "Complete Your Venue Registration",
        message: "Your registration is incomplete. Add your venue details and submit for verification.",
        buttonText: "Continue Registration",
        urgent: false
      };
    }

    return {
      title: "Complete Your Venue Registration",
      message: "Add your venue details, upload images, and submit for verification to start accepting bookings.",
      buttonText: "Continue Registration",
      urgent: false
    };
  };

  // ==================== SECTION A: ACTION BANNER ====================
  const ActionBanner = () => {
    // Show loading skeleton while fetching
    if (isLoading) {
      return (
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm animate-pulse">
          <div className="h-3 bg-gray-200 rounded w-24 mb-3"></div>
          <div className="h-5 bg-gray-200 rounded w-64 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-96 mb-4"></div>
          <div className="h-10 bg-gray-200 rounded w-40"></div>
        </div>
      );
    }

    if (!shouldShowActionBanner()) return null;

    const bannerInfo = getActionBannerInfo();

    // Determine progress steps based on registration data
    const getProgressSteps = () => {
      if (!registrationData) {
        return [
          { label: "Account Created", done: true },
          { label: "Venue Details", done: false },
          { label: "Upload Images", done: false },
          { label: "Verification", done: false },
          { label: "Go Live", done: false },
        ];
      }

      const status = registrationData.registrationStatus;
      const hasVenueDetails = registrationData.venueName && registrationData.phone;
      const hasImages = registrationData.venueImages?.length > 0;
      const hasDocs = registrationData.documents?.citizenshipFront?.url;

      return [
        { label: "Account Created", done: true },
        { label: "Venue Details", done: hasVenueDetails },
        { label: "Upload Images", done: hasImages && hasDocs },
        { label: "Verification", done: status === "APPROVED" },
        { label: "Go Live", done: status === "APPROVED" },
      ];
    };

    const steps = getProgressSteps();
    const currentStep = steps.findIndex(s => !s.done) + 1 || steps.length;

    return (
      <div className={`rounded-2xl p-6 border shadow-sm ${bannerInfo.urgent ? "bg-red-50 border-red-200" : "bg-white border-gray-100"}`}>
        <div className="flex items-start justify-between gap-8">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <span className={`w-2 h-2 rounded-full animate-pulse ${bannerInfo.urgent ? "bg-red-500" : "bg-amber-400"}`}></span>
              <span className={`text-xs font-medium uppercase tracking-wide ${bannerInfo.urgent ? "text-red-600" : "text-amber-600"}`}>
                {bannerInfo.urgent ? "Urgent Action Required" : "Action Required"}
              </span>
            </div>
            <h2 className="text-lg font-semibold text-gray-900">{bannerInfo.title}</h2>
            <p className="text-sm text-gray-500 mt-1">{bannerInfo.message}</p>
            <button
              onClick={() => navigate("/venue-owner/registration")}
              className={`mt-4 px-5 py-2.5 text-white text-sm font-medium rounded-lg transition-colors ${
                bannerInfo.urgent ? "bg-red-600 hover:bg-red-700" : "bg-[#5d0f0f] hover:bg-[#4a0c0c]"
              }`}
            >
              {bannerInfo.buttonText}
            </button>
          </div>

          {/* Progress Steps */}
          <div className="hidden xl:flex items-center gap-1 flex-shrink-0">
            {steps.map((step, i) => (
              <div key={i} className="flex items-center">
                <div className="flex flex-col items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium ${
                      step.done
                        ? "bg-emerald-500 text-white"
                        : i === currentStep - 1
                        ? "bg-[#5d0f0f] text-white"
                        : "bg-gray-100 text-gray-400"
                    }`}
                  >
                    {step.done ? (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      i + 1
                    )}
                  </div>
                  <span className={`text-[10px] mt-1.5 w-16 text-center ${step.done || i === currentStep - 1 ? "text-gray-700" : "text-gray-400"}`}>
                    {step.label}
                  </span>
                </div>
                {i < steps.length - 1 && (
                  <div className={`w-8 h-0.5 mb-5 ${step.done ? "bg-emerald-500" : "bg-gray-200"}`}></div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  // ==================== SECTION B: KEY METRICS ====================
  const MetricCard = ({ title, value, subtitle, icon, trend, trendUp }) => (
    <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm h-full">
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <p className="text-sm text-gray-500 font-medium">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
          {trend && (
            <p className={`text-xs font-medium mt-2 flex items-center gap-1 ${trendUp ? "text-emerald-600" : "text-red-500"}`}>
              <svg className={`w-3 h-3 ${trendUp ? "" : "rotate-180"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
              </svg>
              {trend}
            </p>
          )}
          {subtitle && !trend && <p className="text-xs text-gray-400 mt-2">{subtitle}</p>}
        </div>
        <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center flex-shrink-0">
          {icon}
        </div>
      </div>
    </div>
  );

  const KeyMetrics = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
      <MetricCard
        title="Total Bookings"
        value="24"
        trend="+12% from last month"
        trendUp={true}
        icon={
          <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        }
      />
      <MetricCard
        title="Pending Requests"
        value="5"
        subtitle="Awaiting your response"
        icon={
          <svg className="w-5 h-5 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        }
      />
      <MetricCard
        title="Confirmed Events"
        value="8"
        subtitle="Upcoming this month"
        icon={
          <svg className="w-5 h-5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        }
      />
      <MetricCard
        title="Monthly Revenue"
        value="Rs. 85,000"
        trend="+8% from last month"
        trendUp={true}
        icon={
          <svg className="w-5 h-5 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        }
      />
    </div>
  );

  // ==================== SECTION C: INSIGHTS ====================
  const BarChart = () => {
    const data = [
      { month: "Jan", value: 8 },
      { month: "Feb", value: 12 },
      { month: "Mar", value: 18 },
      { month: "Apr", value: 14 },
      { month: "May", value: 22 },
      { month: "Jun", value: 19 },
      { month: "Jul", value: 16 },
      { month: "Aug", value: 24 },
    ];
    const max = Math.max(...data.map((d) => d.value));

    return (
      <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm h-full">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-sm font-semibold text-gray-900">Monthly Bookings</h3>
          <span className="text-xs text-gray-400">2024</span>
        </div>
        <div className="flex items-end justify-between gap-3 h-52">
          {data.map((item, i) => (
            <div key={i} className="flex-1 flex flex-col items-center">
              <span className="text-xs font-medium text-gray-600 mb-2">{item.value}</span>
              <div className="w-full bg-gray-50 rounded-lg relative" style={{ height: "160px" }}>
                <div
                  className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[#5d0f0f] to-[#8b2020] rounded-lg transition-all duration-500"
                  style={{ height: `${(item.value / max) * 100}%` }}
                />
              </div>
              <span className="text-[11px] text-gray-500 mt-2 font-medium">{item.month}</span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const DonutChart = () => {
    const data = [
      { label: "Pending", value: 5, color: "#f59e0b" },
      { label: "Confirmed", value: 8, color: "#10b981" },
      { label: "Completed", value: 11, color: "#6366f1" },
    ];
    const total = data.reduce((sum, d) => sum + d.value, 0);
    const radius = 40;
    const circumference = 2 * Math.PI * radius;
    let offset = 0;

    return (
      <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm h-full">
        <h3 className="text-sm font-semibold text-gray-900 mb-6">Booking Status</h3>
        <div className="flex items-center justify-center gap-12">
          <div className="relative">
            <svg width="120" height="120" viewBox="0 0 100 100">
              {data.map((item, i) => {
                const pct = item.value / total;
                const dash = pct * circumference;
                const currentOffset = offset;
                offset += dash;
                return (
                  <circle
                    key={i}
                    cx="50"
                    cy="50"
                    r={radius}
                    fill="none"
                    stroke={item.color}
                    strokeWidth="12"
                    strokeDasharray={`${dash} ${circumference}`}
                    strokeDashoffset={-currentOffset}
                    transform="rotate(-90 50 50)"
                  />
                );
              })}
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-2xl font-bold text-gray-900">{total}</span>
              <span className="text-xs text-gray-500">Total</span>
            </div>
          </div>
          <div className="space-y-4">
            {data.map((item, i) => (
              <div key={i} className="flex items-center gap-3">
                <span className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: item.color }}></span>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">{item.label}</span>
                  <span className="text-sm font-semibold text-gray-900">{item.value}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  // ==================== SECTION D: ACTIVITY & ACTIONS ====================
  const RecentActivity = () => {
    const bookings = [
      { event: "Wedding Reception", customer: "Rahul Sharma", date: "Dec 28, 2024", status: "pending", amount: "Rs. 45,000" },
      { event: "Birthday Party", customer: "Priya Patel", date: "Dec 30, 2024", status: "confirmed", amount: "Rs. 25,000" },
      { event: "Corporate Meet", customer: "Tech Solutions", date: "Jan 5, 2025", status: "pending", amount: "Rs. 35,000" },
      { event: "Anniversary", customer: "Amit & Neha", date: "Jan 12, 2025", status: "confirmed", amount: "Rs. 28,000" },
      { event: "Product Launch", customer: "StartUp Inc", date: "Jan 18, 2025", status: "pending", amount: "Rs. 50,000" },
    ];

    return (
      <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm h-full">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-sm font-semibold text-gray-900">Recent Booking Requests</h3>
          <button
            onClick={() => navigate("/venue-owner/bookings/requests")}
            className="text-xs font-medium text-[#5d0f0f] hover:underline"
          >
            View all
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left text-xs font-medium text-gray-500 pb-3">Event</th>
                <th className="text-left text-xs font-medium text-gray-500 pb-3">Customer</th>
                <th className="text-left text-xs font-medium text-gray-500 pb-3">Date</th>
                <th className="text-left text-xs font-medium text-gray-500 pb-3">Amount</th>
                <th className="text-left text-xs font-medium text-gray-500 pb-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((b, i) => (
                <tr key={i} className="border-b border-gray-50 last:border-0 hover:bg-gray-50 cursor-pointer">
                  <td className="py-3">
                    <p className="text-sm font-medium text-gray-900">{b.event}</p>
                  </td>
                  <td className="py-3">
                    <p className="text-sm text-gray-600">{b.customer}</p>
                  </td>
                  <td className="py-3">
                    <p className="text-sm text-gray-500">{b.date}</p>
                  </td>
                  <td className="py-3">
                    <p className="text-sm font-medium text-gray-900">{b.amount}</p>
                  </td>
                  <td className="py-3">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wide ${
                      b.status === "confirmed" ? "bg-emerald-50 text-emerald-600" : "bg-amber-50 text-amber-600"
                    }`}>
                      {b.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  const QuickActions = () => {
    const actions = [
      {
        label: "Add Event",
        desc: "Create new event",
        icon: (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
        ),
        color: "text-emerald-600 bg-emerald-50",
        path: "/venue-owner/events",
      },
      {
        label: "Upload Images",
        desc: "Add photos",
        icon: (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        ),
        color: "text-purple-600 bg-purple-50",
        path: "/venue-owner/gallery",
      },
      {
        label: "Manage Venue",
        desc: "Update details",
        icon: (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
        ),
        color: "text-blue-600 bg-blue-50",
        path: "/venue-owner/registration",
      },
      {
        label: "View Bookings",
        desc: "Check requests",
        icon: (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        ),
        color: "text-amber-600 bg-amber-50",
        path: "/venue-owner/bookings/requests",
      },
    ];

    return (
      <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm h-full">
        <h3 className="text-sm font-semibold text-gray-900 mb-5">Quick Actions</h3>
        <div className="grid grid-cols-2 gap-3">
          {actions.map((a, i) => (
            <button
              key={i}
              onClick={() => navigate(a.path)}
              className="flex flex-col items-center gap-2 p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors text-center"
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${a.color}`}>
                {a.icon}
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">{a.label}</p>
                <p className="text-[10px] text-gray-500">{a.desc}</p>
              </div>
            </button>
          ))}
        </div>
      </div>
    );
  };

  // ==================== RENDER ====================
  return (
    <div className="space-y-6">
      {/* Section A: Action Banner */}
      <ActionBanner />

      {/* Section B: Key Metrics */}
      <KeyMetrics />

      {/* Section C: Insights - Full width split */}
      <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">
        <div className="xl:col-span-3">
          <BarChart />
        </div>
        <div className="xl:col-span-2">
          <DonutChart />
        </div>
      </div>

      {/* Section D: Activity & Actions - Full width split */}
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        <div className="xl:col-span-3">
          <RecentActivity />
        </div>
        <div className="xl:col-span-1">
          <QuickActions />
        </div>
      </div>
    </div>
  );
}

export default VenueDashboard;
