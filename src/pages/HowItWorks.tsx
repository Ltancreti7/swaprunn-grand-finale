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
      backgroundSize: '120%',
      backgroundPosition: 'center top',
      backgroundRepeat: 'no-repeat',
      backgroundAttachment: 'fixed'
    }}>
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/80 z-0"></div>

      {/* How It Works Section */}
      <section className="relative z-10 py-20">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl lg:text-6xl font-bold text-white mb-6">How It Works</h1>
            <p className="text-lg text-white/80 mb-12 max-w-3xl mx-auto">
              SwapRunn simplifies your vehicle delivery process in three simple steps.
            </p>
            
            <div className="grid md:grid-cols-3 gap-8 mb-16">
              <div className="text-center p-8 bg-white/10 backdrop-blur-sm border border-white/20 rounded-3xl">
                <div className="w-16 h-16 bg-[#E11900]/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Handshake className="h-8 w-8 text-[#E11900]" />
                </div>
                <h3 className="text-xl font-bold text-white mb-4">1. Post</h3>
                <p className="text-white/70">Dealer posts delivery request with vehicle and customer details. Include pickup location, delivery address, and any special instructions.</p>
              </div>

              <div className="text-center p-8 bg-white/10 backdrop-blur-sm border border-white/20 rounded-3xl">
                <div className="w-16 h-16 bg-[#E11900]/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="h-8 w-8 text-[#E11900]" />
                </div>
                <h3 className="text-xl font-bold text-white mb-4">2. Accept</h3>
                <p className="text-white/70">Verified drivers receive instant notifications and accept jobs. Our smart matching system ensures the best driver for each delivery.</p>
              </div>

              <div className="text-center p-8 bg-white/10 backdrop-blur-sm border border-white/20 rounded-3xl">
                <div className="w-16 h-16 bg-[#E11900]/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <MapPin className="h-8 w-8 text-[#E11900]" />
                </div>
                <h3 className="text-xl font-bold text-white mb-4">3. Track & Rate</h3>
                <p className="text-white/70">Real-time GPS tracking with delivery proof and driver ratings. Get instant updates and delivery confirmation with photos.</p>
              </div>
            </div>

            <Button asChild variant="outline" size="lg" className="bg-white/10 text-white border-white/20 hover:bg-white/20 h-12 px-8 rounded-2xl">
              <Link to="/">
                <ArrowLeft className="mr-2 h-5 w-5" />
                Back to Home
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 py-12 border-t border-white/10">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-4">
              <img src="/swaprunn-logo-2025.png?v=20251001" alt="SwapRunn" className="h-8 w-auto" />
              <span className="text-white/70">© SwapRunn</span>
            </div>
            
            <div className="flex gap-6">
              <Link to="/privacy" className="text-white/70 hover:text-white transition-colors">
                Privacy
              </Link>
              <Link to="/terms" className="text-white/70 hover:text-white transition-colors">
                Terms
              </Link>
              <Link to="/about" className="text-white/70 hover:text-white transition-colors">
                Contact
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HowItWorks;