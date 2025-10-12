import { Link } from "react-router-dom";
import SiteHeader from "@/components/SiteHeader";
import mapBackgroundImage from "@/assets/map-background.jpg";

const GetStarted = () => {
  return (
    <div className="min-h-screen relative" style={{
      backgroundImage: `url(${mapBackgroundImage})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center'
    }}>
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/38 to-black/65"></div>
      
      {/* Site Header */}
      <SiteHeader />
      
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4">
        {/* Branded Header */}
        <div className="text-center mb-8">
        </div>
        
        {/* Top Card (Role Selector) */}
        <div className="bg-black/20 backdrop-blur-sm border border-white/10 p-8 rounded-2xl shadow-2xl max-w-sm mx-auto mb-10">
          
          {/* Headline */}
          <h1 className="text-2xl font-semibold text-white text-center">
            I am a...
          </h1>
          
          {/* Subtext */}
          <p className="text-sm text-white/70 text-center mb-6">
            Choose your role to continue
          </p>
          
          {/* Buttons */}
          <div className="flex flex-col gap-4">
            <Link to="/driver">
              <button className="w-full bg-[#DC2626] text-white py-3 rounded-full font-semibold transition hover:bg-[#b91c1c] active:scale-95 shadow-lg">
                Driver
              </button>
            </Link>
            
            <Link to="/dealer">
              <button className="w-full bg-[#DC2626] text-white py-3 rounded-full font-semibold transition hover:bg-[#b91c1c] active:scale-95 shadow-lg">
                Dealer
              </button>
            </Link>
          </div>
        </div>

        <div className="flex flex-col items-center mt-10">
          <p className="text-[#DC2626] text-lg font-semibold italic mb-2">
            From dealer to driveway.
          </p>
          <div className="w-12 h-0.5 bg-[#DC2626] opacity-60"></div>
        </div>
        
        {/* Subheading */}
        <p className="text-sm text-white/70 text-center mt-2">
          Streamline the delivery and swap process — fast, simple, and trackable.
        </p>
      </div>
    </div>
  );
};

export default GetStarted;