import { Link } from "react-router-dom";
import SiteHeader from "@/components/SiteHeader";
import BackButton from "@/components/BackButton";
import mapBackgroundImage from "@/assets/map-background.jpg";
import { Button } from "@/components/ui/button";
import { Handshake, CheckCircle, MapPin, ArrowLeft } from "lucide-react";

const HowItWorks = () => {
  return (
    <div className="min-h-screen relative bg-black" style={{
      backgroundImage: `url(${mapBackgroundImage})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center top',
      backgroundRepeat: 'no-repeat',
      backgroundAttachment: 'fixed'
    }}>
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/70 to-black/60 z-0"></div>

      {/* Header */}
      <header className="relative z-10 pt-12 pb-8">
        <div className="container mx-auto px-6">
          <Button asChild variant="ghost" size="lg" className="text-white/80 hover:text-white hover:bg-white/10 mb-8">
            <Link to="/">
              <ArrowLeft className="mr-2 h-5 w-5" />
              Back to Home
            </Link>
          </Button>
          
          <div className="text-center">
            <h1 className="text-5xl lg:text-7xl font-black tracking-tight text-white mb-6 leading-tight">
              How It <span className="text-[#E11900]">Works</span>
            </h1>
            <p className="text-xl lg:text-2xl text-white/90 mb-16 max-w-4xl mx-auto font-light">
              SwapRunn simplifies your vehicle delivery process in three simple steps
            </p>
          </div>
        </div>
      </header>

      {/* Steps Section */}
      <section className="relative z-10 pb-20">
        <div className="container mx-auto px-6">
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Step 1 */}
              <div className="group">
                <div className="bg-black/60 backdrop-blur-lg border border-white/20 rounded-2xl p-8 lg:p-10 h-full hover:bg-black/70 transition-all duration-300 hover:scale-105">
                  <div className="flex items-center justify-center w-20 h-20 bg-gradient-to-br from-[#E11900] to-[#B51400] rounded-full mx-auto mb-8 group-hover:scale-110 transition-transform duration-200">
                    <span className="text-3xl font-black text-white">1</span>
                  </div>
                  <h3 className="text-3xl font-bold text-white mb-6 text-center">Post</h3>
                  <p className="text-white/80 text-lg leading-relaxed text-center">
                    Dealer posts delivery request with vehicle and customer details. Include pickup location, delivery address, and any special instructions.
                  </p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="group">
                <div className="bg-black/60 backdrop-blur-lg border border-white/20 rounded-2xl p-8 lg:p-10 h-full hover:bg-black/70 transition-all duration-300 hover:scale-105">
                  <div className="flex items-center justify-center w-20 h-20 bg-gradient-to-br from-[#E11900] to-[#B51400] rounded-full mx-auto mb-8 group-hover:scale-110 transition-transform duration-200">
                    <span className="text-3xl font-black text-white">2</span>
                  </div>
                  <h3 className="text-3xl font-bold text-white mb-6 text-center">Accept</h3>
                  <p className="text-white/80 text-lg leading-relaxed text-center">
                    Verified drivers receive instant notifications and accept jobs. Our smart matching system ensures the best driver for each delivery.
                  </p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="group">
                <div className="bg-black/60 backdrop-blur-lg border border-white/20 rounded-2xl p-8 lg:p-10 h-full hover:bg-black/70 transition-all duration-300 hover:scale-105">
                  <div className="flex items-center justify-center w-20 h-20 bg-gradient-to-br from-[#E11900] to-[#B51400] rounded-full mx-auto mb-8 group-hover:scale-110 transition-transform duration-200">
                    <span className="text-3xl font-black text-white">3</span>
                  </div>
                  <h3 className="text-3xl font-bold text-white mb-6 text-center">Track & Rate</h3>
                  <p className="text-white/80 text-lg leading-relaxed text-center">
                    Real-time GPS tracking with delivery proof and driver ratings. Get instant updates and delivery confirmation with photos.
                  </p>
                </div>
              </div>
            </div>

            {/* CTA Section */}
            <div className="text-center mt-16">
              <div className="bg-black/40 backdrop-blur-sm border border-white/20 rounded-2xl p-8 max-w-2xl mx-auto">
                <h2 className="text-2xl lg:text-3xl font-bold text-white mb-4">Ready to Get Started?</h2>
                <p className="text-white/80 mb-8 text-lg">Join dealerships already using SwapRunn to streamline their delivery process</p>
                
                <div className="flex justify-center">
                  <Button asChild size="lg" className="bg-[#E11900] hover:bg-[#B51400] text-white px-8 py-4 rounded-full text-lg font-semibold shadow-xl">
                    <Link to="/dealership/register">
                      Get Started Today
                    </Link>
                  </Button>
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
              <span className="text-white/60 text-lg font-medium">© 2025 SwapRunn</span>
              <span className="text-white/30 text-sm ml-3">Dealership Logistics Platform</span>
            </div>
            
            <div className="flex gap-8">
              <Link to="/privacy" className="text-white/60 hover:text-white transition-colors font-medium">
                Privacy Policy
              </Link>
              <Link to="/terms" className="text-white/60 hover:text-white transition-colors font-medium">
                Terms of Service
              </Link>
              <Link to="/contact" className="text-white/60 hover:text-white transition-colors font-medium">
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HowItWorks;