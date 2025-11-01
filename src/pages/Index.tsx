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
              <h1 className="text-4xl sm:text-6xl lg:text-7xl xl:text-8xl font-black tracking-tight mb-6 leading-[1.1] text-white">
                Stop Losing Sales
                <br />
                <span className="text-[#E11900]">Because You Can't Deliver.</span>
              </h1>

              {/* Subheadline */}
              <p className="text-xl sm:text-2xl lg:text-3xl text-white/95 mb-8 max-w-4xl mx-auto font-normal leading-relaxed">
                Built by a sales manager who was tired of scrambling to find drivers. SwapRunn connects your dealership with vetted drivers for customer deliveries, dealer trades, and service shuttles.
              </p>

              {/* Value Props - Quick Scan */}
              <div className="flex flex-wrap justify-center gap-6 mb-12 text-white/80 text-base sm:text-lg">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-[#E11900] rounded-full"></div>
                  <span>14-Day Free Trial</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-[#E11900] rounded-full"></div>
                  <span>No Credit Card Required</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-[#E11900] rounded-full"></div>
                  <span>$99/mo + $1.50 per delivery</span>
                </div>
              </div>

              {/* Primary CTA */}
              <div className="max-w-2xl mx-auto mb-8">
                <Button
                  asChild
                  size="lg"
                  className="bg-[#E11900] hover:bg-[#B51400] text-white px-12 py-7 rounded-xl text-xl font-bold shadow-2xl w-full transition-all hover:shadow-[0_0_40px_rgba(225,25,0,0.5)] hover:scale-105"
                >
                  <Link to="/dealership/register">
                    Start Your Free Trial →
                  </Link>
                </Button>
                <p className="text-white/60 text-sm mt-4 text-center">
                  Set up your account in under 5 minutes. No setup fees.
                </p>
              </div>

              {/* Secondary Actions - Subdued */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-sm">
                <Link
                  to="/dealer/auth"
                  className="text-white/70 hover:text-white underline underline-offset-4 transition-colors"
                >
                  Already a customer? Sign in
                </Link>
                <span className="hidden sm:inline text-white/40">•</span>
                <Link
                  to="/driver/auth"
                  className="text-white/70 hover:text-white underline underline-offset-4 transition-colors"
                >
                  Looking to drive? Apply here
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* App Preview Section */}
        <section className="relative z-10 pb-20">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="max-w-5xl mx-auto">
              <div className="bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-sm border border-white/20 rounded-3xl p-4 sm:p-8 shadow-2xl">
                <div className="aspect-video bg-gradient-to-br from-neutral-900 to-neutral-800 rounded-2xl flex items-center justify-center relative overflow-hidden border border-white/10">
                  {/* Subtle grid pattern */}
                  <div className="absolute inset-0 opacity-20" style={{
                    backgroundImage: `linear-gradient(rgba(255,255,255,.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.05) 1px, transparent 1px)`,
                    backgroundSize: '50px 50px'
                  }}></div>

                  {/* Dashboard Preview Placeholder */}
                  <div className="relative z-10 text-center px-8">
                    <div className="mb-6">
                      <Truck className="w-20 h-20 text-[#E11900] mx-auto mb-4" />
                    </div>
                    <h3 className="text-2xl sm:text-3xl font-bold text-white mb-3">
                      Your Dashboard
                    </h3>
                    <p className="text-white/70 text-lg max-w-2xl mx-auto">
                      Request drivers, track deliveries in real-time, manage your team, and see your entire operation from one simple dashboard.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works - Prominent Section */}
        <section className="relative z-10 py-16">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="bg-black/60 backdrop-blur-sm border border-white/20 rounded-3xl p-8 sm:p-10 lg:p-14 mb-12">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6 text-center">
                How It Works
              </h2>
              <p className="text-lg sm:text-xl text-white/80 max-w-2xl mx-auto mb-14 text-center">
                Three simple steps from request to delivery. No complexity, no hassle.
              </p>

              {/* Step Process */}
              <div className="grid md:grid-cols-3 gap-10 lg:gap-12 max-w-5xl mx-auto">
                <div className="text-center group">
                  <div className="w-24 h-24 bg-gradient-to-br from-[#E11900] to-[#B51400] rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                    <span className="text-3xl font-black text-white">1</span>
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4">
                    Request a Driver
                  </h3>
                  <p className="text-white/80 text-base leading-relaxed">
                    Submit a delivery request in under 2 minutes. Vehicle details, pickup, and delivery address.
                  </p>
                </div>

                <div className="text-center group">
                  <div className="w-24 h-24 bg-gradient-to-br from-[#E11900] to-[#B51400] rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                    <span className="text-3xl font-black text-white">2</span>
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4">
                    Driver Accepts
                  </h3>
                  <p className="text-white/80 text-base leading-relaxed">
                    Vetted drivers get instant notifications. Someone accepts within minutes.
                  </p>
                </div>

                <div className="text-center group">
                  <div className="w-24 h-24 bg-gradient-to-br from-[#E11900] to-[#B51400] rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                    <span className="text-3xl font-black text-white">3</span>
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4">
                    Delivered
                  </h3>
                  <p className="text-white/80 text-base leading-relaxed">
                    Track in real-time. Customer gets their car on schedule, every time.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* What We Do Section */}
        <section className="relative z-10 py-20">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 text-center">
                Everything Your Dealership Needs
              </h2>
              <p className="text-lg sm:text-xl text-white/80 mb-16 text-center max-w-3xl mx-auto">
                From customer deliveries to dealer trades. One platform, every logistics need covered.
              </p>
              <div className="bg-black/60 backdrop-blur-lg border border-white/20 rounded-3xl p-8 sm:p-12">
                <div className="grid lg:grid-cols-3 gap-10">
                  <div className="bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl p-8 transition-all duration-300 group cursor-default">
                    <div className="w-16 h-16 bg-gradient-to-br from-[#E11900] to-[#B51400] rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                      <Truck className="w-8 h-8 text-white" />
                    </div>
                    <h4 className="text-2xl font-bold text-white mb-3">
                      Customer Deliveries
                    </h4>
                    <p className="text-white/80 text-base leading-relaxed">
                      Deliver sold vehicles and test drives anywhere. Stop losing sales because you can't get the car to the customer.
                    </p>
                  </div>

                  <div className="bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl p-8 transition-all duration-300 group cursor-default">
                    <div className="w-16 h-16 bg-gradient-to-br from-[#E11900] to-[#B51400] rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                      <ArrowRight className="w-8 h-8 text-white" />
                    </div>
                    <h4 className="text-2xl font-bold text-white mb-3">
                      Dealer Trades
                    </h4>
                    <p className="text-white/80 text-base leading-relaxed">
                      Move inventory between locations fast. Get the right car to the right lot without tying up your staff.
                    </p>
                  </div>

                  <div className="bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl p-8 transition-all duration-300 group cursor-default">
                    <div className="w-16 h-16 bg-gradient-to-br from-[#E11900] to-[#B51400] rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                      <Shield className="w-8 h-8 text-white" />
                    </div>
                    <h4 className="text-2xl font-bold text-white mb-3">
                      Service Shuttles
                    </h4>
                    <p className="text-white/80 text-base leading-relaxed">
                      White-glove pickup and drop-off for service appointments. Keep customers happy without disrupting operations.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>


        {/* Founder Story Section */}
        <section className="relative z-10 py-20">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="max-w-4xl mx-auto">
              <div className="bg-gradient-to-br from-[#E11900]/10 to-[#E11900]/5 backdrop-blur-sm border border-[#E11900]/20 rounded-3xl p-8 sm:p-12">
                <div className="text-center mb-8">
                  <div className="inline-block bg-[#E11900]/20 px-4 py-2 rounded-full mb-6">
                    <span className="text-[#E11900] font-bold text-sm uppercase tracking-wider">
                      Built by a Dealer, For Dealers
                    </span>
                  </div>
                  <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
                    Why SwapRunn Exists
                  </h2>
                </div>

                <div className="space-y-6 text-white/90 text-lg leading-relaxed">
                  <p>
                    I'm a sales manager at a Toyota dealership where we sell 200+ cars monthly. We don't have the best location, so we sell a lot of vehicles remotely and deliver for free up to 200 miles.
                  </p>
                  <p>
                    The problem? <span className="text-white font-semibold">Finding drivers and coordinating them around customer schedules was a nightmare.</span> We'd lose sales because we couldn't guarantee delivery. Customers would go elsewhere because we couldn't bring the car to them.
                  </p>
                  <p>
                    I built SwapRunn to solve this exact problem. No more scrambling to find drivers. No more lost sales. No more coordination headaches.
                  </p>
                  <p className="text-white font-semibold text-xl pt-4">
                    If you're dealing with the same frustration, this platform was built for you.
                  </p>
                </div>

                <div className="mt-10 text-center">
                  <Button
                    asChild
                    size="lg"
                    className="bg-white hover:bg-white/90 text-[#E11900] px-10 py-6 rounded-xl text-lg font-bold shadow-lg transition-all hover:scale-105"
                  >
                    <Link to="/dealership/register">
                      Start Solving This Problem Today →
                    </Link>
                  </Button>
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
