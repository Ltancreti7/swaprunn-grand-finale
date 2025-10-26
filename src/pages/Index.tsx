import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import mapBackgroundImage from "@/assets/map-background.jpg";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Truck, ArrowRight, Shield } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

const Index = () => {
  const { user, userProfile, loading } = useAuth();
  const navigate = useNavigate();
  const [showSignupDropdown, setShowSignupDropdown] = useState(false);

  // Redirect authenticated users to their dashboard
  useEffect(() => {
    if (!loading && user && userProfile) {
      console.log("User authenticated, redirecting to dashboard:", userProfile);

      switch (userProfile.user_type) {
        case "dealer":
          navigate("/dealer/dashboard");
          break;
        case "driver":
          navigate("/driver/dashboard");
          break;
        case "swap_coordinator":
          navigate("/swap-coordinator/dashboard");
          break;
        default:
          // If user type is unknown, stay on homepage but could add error handling
          console.log("Unknown user type:", userProfile.user_type);
      }
    }
  }, [user, userProfile, loading, navigate]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (showSignupDropdown && !target.closest(".relative")) {
        setShowSignupDropdown(false);
      }
    };

    if (showSignupDropdown) {
      document.addEventListener("click", handleClickOutside);
    }

    return () => document.removeEventListener("click", handleClickOutside);
  }, [showSignupDropdown]);

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  // Only show homepage to non-authenticated users
  return (
    <>
      {/* Top Header - Clean & Simple */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-black border-b border-white/10">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-20 sm:h-24">
            {/* Left - Logo */}
            <Link to="/" className="flex items-center">
              <img
                src="/swaprunn-logo-2025.png?v=20251015"
                alt="SwapRunn"
                className="h-12 sm:h-14 w-auto hover:opacity-80 transition-opacity"
              />
            </Link>

            {/* Right - Simple Navigation */}
            <div className="flex items-center space-x-4 lg:space-x-8">
              <Link
                to="/how-it-works"
                className="hidden sm:block text-white/70 hover:text-white transition-colors font-medium text-sm lg:text-base"
              >
                How It Works
              </Link>
              <Link
                to="/contact"
                className="hidden md:block text-white/70 hover:text-white transition-colors font-medium text-sm lg:text-base"
              >
                Contact
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div
        className="min-h-screen relative bg-black"
        style={{
          backgroundImage: `url(${mapBackgroundImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center top",
          backgroundRepeat: "no-repeat",
          backgroundAttachment: "fixed",
        }}
      >
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/75 via-black/65 to-black/40 z-0"></div>

        {/* Hero Section - Main Content */}
        <section className="relative z-10 pt-32 sm:pt-48 pb-20 sm:pb-32">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="text-center max-w-6xl mx-auto">
              {/* Headline */}
              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight mb-8 leading-tight text-white">
                Deliver Faster.
                <br />
                <span className="text-[#E11900]">Swap Smarter.</span>
              </h1>

              {/* Subheadline */}
              <p className="text-lg sm:text-xl lg:text-2xl text-white/90 mb-16 max-w-3xl mx-auto font-light leading-relaxed">
                Streamline off-site deliveries and inventory swaps with a
                tech-first platform built to revolutionize dealership logistics.
              </p>

              {/* Three Call-to-Action Buttons */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                {/* Register Your Dealership - Primary */}
                <div className="flex flex-col items-center text-center">
                  <Button
                    asChild
                    size="lg"
                    className="bg-[#E11900] hover:bg-[#B51400] text-white px-8 py-5 rounded-lg text-lg font-semibold shadow-lg w-full transition-all hover:shadow-xl hover:scale-105"
                  >
                    <Link to="/dealership/register">
                      Register Your Dealership
                    </Link>
                  </Button>
                  <p className="text-white/70 text-base mt-4 leading-relaxed">
                    Create your dealership account and invite your team.
                  </p>
                </div>

                {/* Drive With SwapRunn - Secondary */}
                <div className="flex flex-col items-center text-center">
                  <Button
                    asChild
                    size="lg"
                    variant="outline"
                    className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-black px-8 py-5 rounded-lg text-lg font-semibold w-full transition-all hover:shadow-xl hover:scale-105"
                  >
                    <Link to="/driver/auth">
                      Drive With SwapRunn
                    </Link>
                  </Button>
                  <p className="text-white/70 text-base mt-4 leading-relaxed">
                    Start earning by delivering vehicles for local dealerships.
                  </p>
                </div>

                {/* Sales and Staff Login - Neutral */}
                <div className="flex flex-col items-center text-center">
                  <Button
                    asChild
                    size="lg"
                    variant="ghost"
                    className="bg-white/10 border border-white/30 text-white hover:bg-white/20 hover:border-white/50 px-8 py-5 rounded-lg text-lg font-semibold w-full transition-all hover:shadow-xl hover:scale-105"
                  >
                    <Link to="/dealer/auth">
                      Sales and Staff Login
                    </Link>
                  </Button>
                  <p className="text-white/70 text-base mt-4 leading-relaxed">
                    Access your dealership's delivery dashboard.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works - Prominent Section */}
        <section className="relative z-10 py-6">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="bg-black/60 backdrop-blur-sm border border-white/20 rounded-2xl p-4 sm:p-6 lg:p-8 mb-12">
              <h2 className="text-xl sm:text-2xl lg:text-4xl font-bold text-white mb-4 text-center px-2">
                Simple. Fast. Reliable.
              </h2>
              <p className="text-base sm:text-lg text-white/80 max-w-3xl mx-auto mb-8 text-center px-4">
                SwapRunn connects dealerships with professional drivers for
                seamless vehicle delivery and logistics.
              </p>

              {/* Step Process */}
              <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                <div className="text-center group">
                  <div className="w-20 h-20 bg-gradient-to-br from-[#E11900] to-[#B51400] rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-200">
                    <span className="text-2xl font-bold text-white">1</span>
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4">
                    Request a Driver
                  </h3>
                  <p className="text-white/70 text-base leading-relaxed">
                    Submit a delivery request through our simple form. Include
                    vehicle details, pickup location, and customer delivery
                    address.
                  </p>
                </div>

                <div className="text-center group">
                  <div className="w-20 h-20 bg-gradient-to-br from-[#E11900] to-[#B51400] rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-200">
                    <span className="text-2xl font-bold text-white">2</span>
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4">
                    Driver Accepts
                  </h3>
                  <p className="text-white/70 text-base leading-relaxed">
                    Our network of vetted, insured drivers receive instant
                    notifications. A qualified driver accepts your job within
                    minutes.
                  </p>
                </div>

                <div className="text-center group">
                  <div className="w-20 h-20 bg-gradient-to-br from-[#E11900] to-[#B51400] rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-200">
                    <span className="text-2xl font-bold text-white">3</span>
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4">
                    Delivered
                  </h3>
                  <p className="text-white/70 text-base leading-relaxed">
                    Track real-time progress as your driver picks up and
                    delivers the vehicle. Customer receives their car on time,
                    every time.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* What We Do Section */}
        <section className="relative z-10 py-16">
          <div className="container mx-auto px-6">
            <div className="max-w-5xl mx-auto">
              <div className="bg-black/60 backdrop-blur-lg border border-white/20 rounded-3xl p-12">
                <h3 className="text-4xl font-bold text-white mb-12 text-center">
                  Our Services
                </h3>
                <div className="grid lg:grid-cols-3 gap-8">
                  <div className="text-center group">
                    <div className="w-20 h-20 bg-gradient-to-br from-[#E11900] to-[#B51400] rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-200">
                      <Truck className="w-10 h-10 text-white" />
                    </div>
                    <h4 className="text-2xl font-bold text-white mb-4">
                      Customer Deliveries
                    </h4>
                    <p className="text-white/80 text-lg leading-relaxed">
                      Get vehicles to customers anywhere, anytime. No more lost
                      sales due to delivery challenges. Perfect for sold
                      vehicles and test drives.
                    </p>
                  </div>

                  <div className="text-center group">
                    <div className="w-20 h-20 bg-gradient-to-br from-[#E11900] to-[#B51400] rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-200">
                      <ArrowRight className="w-10 h-10 text-white" />
                    </div>
                    <h4 className="text-2xl font-bold text-white mb-4">
                      Inventory Swaps
                    </h4>
                    <p className="text-white/80 text-lg leading-relaxed">
                      Move inventory between locations efficiently. Optimize
                      your lot space and selection by transferring vehicles
                      where they're needed most.
                    </p>
                  </div>

                  <div className="text-center group">
                    <div className="w-20 h-20 bg-gradient-to-br from-[#E11900] to-[#B51400] rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-200">
                      <Shield className="w-10 h-10 text-white" />
                    </div>
                    <h4 className="text-2xl font-bold text-white mb-4">
                      Service Pickups
                    </h4>
                    <p className="text-white/80 text-lg leading-relaxed">
                      Convenient vehicle pickup and drop-off service for
                      maintenance and repairs. Keep customers happy with
                      white-glove service.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>


        {/* Footer */}
        <footer className="relative z-10 py-12 border-t border-white/10">
          <div className="container mx-auto px-6">
            <div className="flex flex-col md:flex-row justify-between items-center gap-6">
              <div className="text-center md:text-left">
                <span className="text-white/60 text-lg font-medium">
                  © 2025 SwapRunn
                </span>
                <span className="text-white/30 text-sm ml-3">
                  Dealership Logistics Platform
                </span>
              </div>

              <div className="flex gap-8">
                <Link
                  to="/privacy"
                  className="text-white/60 hover:text-white transition-colors font-medium"
                >
                  Privacy Policy
                </Link>
                <Link
                  to="/terms"
                  className="text-white/60 hover:text-white transition-colors font-medium"
                >
                  Terms of Service
                </Link>
                <Link
                  to="/contact"
                  className="text-white/60 hover:text-white transition-colors font-medium"
                >
                  Contact Us
                </Link>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
};
export default Index;
