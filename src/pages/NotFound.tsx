import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import BackButton from "@/components/BackButton";
import SiteHeader from "@/components/SiteHeader";
import mapBackgroundImage from "@/assets/map-background.jpg";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

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
      
      <div className="relative z-10 flex min-h-screen items-center justify-center">
        <BackButton />
        <div className="text-center">
          <h1 className="mb-4 text-4xl font-bold text-white">404</h1>
          <p className="mb-4 text-xl text-white/70">Oops! Page not found</p>
          <a href="/" className="text-red-500 underline hover:text-red-400">
            Return to Home
          </a>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
