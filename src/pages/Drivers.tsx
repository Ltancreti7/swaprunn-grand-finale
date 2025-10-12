import { Link } from "react-router-dom";
import mapBackgroundImage from "@/assets/map-background.jpg";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, DollarSign, ShieldCheck, Gauge } from "lucide-react";
const Drivers = () => {
  return <div className="min-h-screen relative bg-black" style={{
    backgroundImage: `url(${mapBackgroundImage})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundAttachment: 'fixed'
  }}>
      <div className="absolute inset-0 bg-gradient-to-b from-black/75 via-black/65 to-black/40 z-0"></div>
      
      <div className="relative z-10 container mx-auto px-4 sm:px-6 pt-24 pb-0 py-[33px] my-[35px]">
        <div className="max-w-6xl mx-auto">
          {/* Two Column Layout: Hero + Login - Compact */}
          <div className="grid lg:grid-cols-[1.2fr,1fr] gap-2 lg:gap-4 items-center min-h-[calc(100vh-200px)] py-0 px-[17px] my-0">
            
            {/* Left Column: Hero Content - Clean & Minimal */}
            <div className="text-center lg:text-left flex items-center justify-center lg:justify-start">
              <div className="relative px-4 py-0 mb-0">
                {/* Black to transparent gradient overlay for contrast */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-transparent blur-lg -z-10 rounded-3xl"></div>
                
                <style>{`
                  @keyframes underline-sweep {
                    0% {
                      transform: scaleX(0);
                      opacity: 0;
                    }
                    100% {
                      transform: scaleX(1);
                      opacity: 0.8;
                    }
                  }
                  
                  .underline-sweep {
                    animation: underline-sweep 0.3s ease-out forwards;
                    animation-delay: 0.8s;
                    transform-origin: left;
                    opacity: 0;
                  }
                  
                  @media (min-width: 640px) {
                    .repeat-text { font-size: calc(3rem + 4px) !important; }
                  }
                  @media (min-width: 1024px) {
                    .repeat-text { font-size: calc(3.75rem + 4px) !important; }
                  }
                  
                  /* Mobile only - add 2px to Repeat */
                  @media (max-width: 639px) {
                    .repeat-text { font-size: calc(2.5rem + 6px) !important; }
                  }
                  
                  .text-gradient {
                    background: linear-gradient(180deg, #ffffff 0%, #f5f5f5 100%);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                  }
                `}</style>
                
                <h1 className="relative py-1 font-['Inter',sans-serif]" style={{
                lineHeight: '1.05'
              }}>
                  {/* Drive - Regular weight, fade in first */}
                  <div className="text-4xl sm:text-5xl lg:text-6xl font-normal text-gradient tracking-tight animate-fade-in mb-1" style={{
                  letterSpacing: '-0.02em',
                  animationDelay: '0s',
                  textShadow: '0 2px 8px rgba(0, 0, 0, 0.3)'
                }}>
                    Drive.
                  </div>
                  
                  {/* Earn - Semi-Bold, fade in second */}
                  <div className="text-4xl sm:text-5xl lg:text-6xl font-semibold text-gradient tracking-tight animate-fade-in mb-0.5" style={{
                  letterSpacing: '-0.02em',
                  animationDelay: '0.25s',
                  opacity: 0,
                  animationFillMode: 'forwards',
                  textShadow: '0 2px 8px rgba(0, 0, 0, 0.3)'
                }}>
                    Earn.
                  </div>
                  
                  {/* Repeat - Bold, slightly larger with red sweep underline */}
                  <div className="font-bold text-gradient tracking-tight animate-fade-in relative inline-block" style={{
                  letterSpacing: '-0.02em',
                  animationDelay: '0.5s',
                  opacity: 0,
                  animationFillMode: 'forwards',
                  textShadow: '0 2px 8px rgba(0, 0, 0, 0.3)'
                }}>
                    <span className="repeat-text">Repeat.</span>
                    {/* Red sweep underline with rounded corners */}
                    <div className="absolute -bottom-0.5 left-0 right-0 h-0.5 bg-[#E11900] underline-sweep" style={{
                    borderRadius: '12px'
                  }}></div>
                  </div>
                </h1>
              </div>
              
              {/* Soft separator overlay */}
              <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-b from-transparent to-black/20 pointer-events-none"></div>
            </div>

            {/* Right Column: Login Card - Compact & Always Visible */}
            <div className="flex justify-center lg:justify-end -mt-12 lg:-mt-8">
              <Card className="w-full max-w-md bg-black/40 backdrop-blur-md border-white/20 shadow-2xl">
                <CardContent className="p-4 sm:p-5 py-[23px] my-0">
                  <div className="text-center mb-4">
                    <h2 className="text-xl sm:text-2xl font-bold text-white mb-1.5">Driver Portal</h2>
                    <p className="text-white/70 text-xs sm:text-sm">Sign in or create your account</p>
                  </div>

                  <div className="space-y-2.5">
                    <Button asChild size="lg" className="w-full bg-[#E11900] hover:bg-[#E11900]/90 text-white h-11 sm:h-12 rounded-2xl font-semibold">
                      <Link to="/driver-auth">
                        Sign In
                      </Link>
                    </Button>

                    <div className="relative">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-white/20"></div>
                      </div>
                      <div className="relative flex justify-center text-xs">
                        <span className="px-2 bg-black/40 text-white/60">or</span>
                      </div>
                    </div>

                    <Button asChild size="lg" className="w-full bg-white/10 hover:bg-white/20 border border-white/40 text-white h-11 sm:h-12 rounded-2xl font-semibold backdrop-blur-sm">
                      <Link to="/driver-auth">
                        Create Account
                      </Link>
                    </Button>
                  </div>

                  <p className="mt-4 text-center text-white/60 text-xs">
                    New drivers complete a quick background check
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Benefits Grid - Below the Fold */}
          <div className="max-w-4xl mx-auto mt-12">
            <h3 className="text-xl sm:text-2xl font-bold text-white text-center mb-6">Why Drive with Us?</h3>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
              <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                <CardContent className="p-5">
                  <div className="w-12 h-12 bg-[#E11900]/20 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Calendar className="h-6 w-6 text-[#E11900]" />
                  </div>
                  <h4 className="text-base font-bold text-white mb-1.5 text-center">Your Schedule</h4>
                  <p className="text-white/70 text-sm text-center">
                    Work when you want, where you want
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                <CardContent className="p-5">
                  <div className="w-12 h-12 bg-[#E11900]/20 rounded-full flex items-center justify-center mx-auto mb-3">
                    <DollarSign className="h-6 w-6 text-[#E11900]" />
                  </div>
                  <h4 className="text-base font-bold text-white mb-1.5 text-center">Fast Payouts</h4>
                  <p className="text-white/70 text-sm text-center">
                    Weekly direct deposits, insurance covered
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                <CardContent className="p-5">
                  <div className="w-12 h-12 bg-[#E11900]/20 rounded-full flex items-center justify-center mx-auto mb-3">
                    <ShieldCheck className="h-6 w-6 text-[#E11900]" />
                  </div>
                  <h4 className="text-base font-bold text-white mb-1.5 text-center">Trusted Platform</h4>
                  <p className="text-white/70 text-sm text-center">
                    Backed by established auto groups
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>;
};
export default Drivers;