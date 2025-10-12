import { Link } from "react-router-dom";
import mapBackgroundImage from "@/assets/map-background.jpg";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Truck, ArrowRight, Users, Zap } from "lucide-react";
const Index = () => {
  return <div className="min-h-screen relative bg-black" style={{
    backgroundImage: `url(${mapBackgroundImage})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center top',
    backgroundRepeat: 'no-repeat',
    backgroundAttachment: 'fixed'
  }}>
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/75 via-black/65 to-black/40 z-0"></div>

      {/* Hero Section - Center Focused */}
      <section className="relative z-10 lg:py-0 py-0">
        <div className="container mx-auto px-6 text-center py-0 my-[26px]">
          {/* Hero Content */}
          <div className="max-w-4xl mx-auto mb-9 py-[110px]">
            <h1 className="lg:text-7xl font-display font-black tracking-tight mb-6 text-white text-3xl">
              Deliver Faster. <span className="text-[#E11900]">Swap Smarter.</span>
            </h1>
            
            {/* CTA Buttons */}
            <div className="flex flex-col items-center justify-center gap-4 mb-6 max-w-md mx-auto my-[54px]">
              <Button asChild size="lg" className="bg-[#E11900] hover:bg-[#E11900]/90 text-white border-none h-12 w-full rounded-2xl">
                <Link to="/dealer/auth">
                  <Users className="mr-2 h-5 w-5" />
                  Dealer Login
                </Link>
              </Button>
              <Button asChild size="lg" className="bg-[#E11900] hover:bg-[#E11900]/90 text-white border-none h-12 w-full rounded-2xl">
                <Link to="/swap-coordinator/auth">
                  <Truck className="mr-2 h-5 w-5" />
                  Swap Inventory
                </Link>
              </Button>
              <div className="w-full">
                <Button asChild variant="outline" size="lg" className="bg-transparent text-white border-white/25 hover:bg-white/10 h-12 w-full rounded-2xl">
                  <Link to="/drivers">
                    <Truck className="mr-2 h-5 w-5" />
                    Drive with SwapRunn
                  </Link>
                </Button>
                <p className="text-white/60 text-sm mt-2 px-2 text-center">
                  Streamline off-site deliveries and inventory swaps with a tech-first platform built to revolutionize dealership logistics.
                </p>
              </div>
              <Button asChild variant="outline" size="lg" className="bg-transparent text-white border-white/25 hover:bg-white/10 h-12 w-full rounded-2xl">
                <Link to="/dealers">
                  <Users className="mr-2 h-5 w-5" />
                  Register your Dealership
                </Link>
              </Button>
            </div>

            {/* Tagline Steps */}
            <div className="flex flex-row items-center justify-center gap-2 md:gap-6 max-w-3xl mb-4 mx-auto px-4">
              <div className="text-center">
                <div className="w-12 h-12 bg-[#E11900]/20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Users className="h-6 w-6 text-[#E11900]" />
                </div>
                <h3 className="text-base font-inter font-bold text-white mb-2">Sell</h3>
                <p className="text-white/70 text-xs max-w-[180px]">Complete the sale with confidence</p>
              </div>

              {/* Arrow 1 */}
              <div className="hidden md:block">
                <ArrowRight className="h-6 w-6 text-[#E11900]/60" />
              </div>

              <div className="text-center">
                <div className="w-12 h-12 bg-[#E11900]/20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Zap className="h-6 w-6 text-[#E11900]" />
                </div>
                <h3 className="text-base font-inter font-bold text-white mb-2">Tap</h3>
                <p className="text-white/70 text-xs max-w-[180px]">Instant driver dispatch at your fingertips</p>
              </div>

              {/* Arrow 2 */}
              <div className="hidden md:block">
                <ArrowRight className="h-6 w-6 text-[#E11900]/60" />
              </div>

              <div className="text-center">
                <div className="w-12 h-12 bg-[#E11900]/20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Truck className="h-6 w-6 text-[#E11900]" />
                </div>
                <h3 className="text-base font-inter font-bold text-white mb-2">Deliver</h3>
                <p className="text-white/70 text-xs max-w-[180px]">Vehicle delivered safely to customer</p>
              </div>
            </div>
            
            {/* Value Proposition */}
            
            
            {/* Trust Statistics */}
            

          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 py-9 border-t border-white/10">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-4">
              <img src="/swaprunn-logo-2025.png?v=20251001" alt="SwapRunn" className="h-8 w-auto" />
              <span className="text-white/70">© SwapRunn <span className="text-white/40 text-xs ml-2">v2025-10-01</span></span>
            </div>
            
            <div className="flex gap-6">
              <Link to="/privacy" className="text-white/70 hover:text-white transition-colors">
                Privacy
              </Link>
              <Link to="/terms" className="text-white/70 hover:text-white transition-colors">
                Terms
              </Link>
              <Link to="/contact" className="text-white/70 hover:text-white transition-colors">
                Contact
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>;
};
export default Index;