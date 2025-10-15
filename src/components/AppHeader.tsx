import { ArrowLeft } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { NavigationDrawer } from "./NavigationDrawer";
import { MessagesButton } from "./messages/MessagesButton";
import { MessagesOverlay } from "./messages/MessagesOverlay";
import { useUnreadMessages } from "@/hooks/useUnreadMessages";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";
export function AppHeader() {
  const location = useLocation();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [showBounce, setShowBounce] = useState(false);
  const [showMessages, setShowMessages] = useState(false);
  const { totalUnread } = useUnreadMessages();
  const { userProfile } = useAuth();

  // Determine if we should hide the header (but keep hooks consistent)
  const shouldHideHeader = location.pathname === '/' || 
    ['/drivers', '/how-it-works', '/dealership/register'].includes(location.pathname);

  // Top-level routes where back button should be hidden
  const topLevelRoutes = ['/', '/drivers', '/dealer/dashboard', '/driver/dashboard'];
  const shouldShowBack = !topLevelRoutes.includes(location.pathname);
  
  useEffect(() => {
    let ticking = false;
    
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const currentScrollY = window.scrollY;
          const isScrolled = currentScrollY > 50;
          
          // Determine scroll direction and visibility
          if (currentScrollY > lastScrollY && currentScrollY > 50) {
            // Scrolling down - hide header
            setIsVisible(false);
            setShowBounce(false);
          } else if (currentScrollY < lastScrollY) {
            // Scrolling up - show header with bounce
            if (!isVisible) {
              setShowBounce(true);
              // Remove bounce class after animation completes
              setTimeout(() => setShowBounce(false), 500);
            }
            setIsVisible(true);
          }
          
          setScrolled(isScrolled);
          setLastScrollY(currentScrollY);
          ticking = false;
        });
        ticking = true;
      }
    };
    
    window.addEventListener('scroll', handleScroll, {
      passive: true
    });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY, isVisible]);
  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      // Fallback to related dashboard or home
      if (location.pathname.startsWith('/dealer')) {
        navigate('/dealer/dashboard');
      } else if (location.pathname.startsWith('/driver')) {
        navigate('/driver/dashboard');
      } else {
        navigate('/');
      }
    }
  };

  // Hide AppHeader on pages with their own headers (after all hooks are called)
  if (shouldHideHeader) {
    return null;
  }
  return <header className={cn("fixed top-0 left-0 right-0 z-[60] border-b transition-all", scrolled ? "bg-[#1A1A1A]/95 backdrop-blur-lg border-white/20 shadow-2xl" : "bg-black/50 backdrop-blur-xl border-white/10 shadow-lg", !isVisible && "-translate-y-full", showBounce && "animate-header-bounce")} style={{
      transitionDuration: '0.35s',
      transitionTimingFunction: 'ease-out',
      transitionProperty: 'transform, background-color, backdrop-filter, border-color, box-shadow',
    }}>
      <div className="flex items-center justify-between h-24 px-6 py-4">
        {/* Left: Back Button or Hamburger Menu - Only show if user is logged in */}
        <div className="flex items-center justify-center min-w-[50px] h-[50px]">
          {userProfile ? (
            shouldShowBack ? (
              <Button
                variant="ghost"
                size="icon"
                onClick={handleBack}
                className="h-11 w-11 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white shadow-lg border border-white/10"
                aria-label="Go back to previous page"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
            ) : (
              <NavigationDrawer />
            )
          ) : (
            <div className="w-11 h-11" /> // Placeholder for alignment
          )}
        </div>

        {/* Center: Logo */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          <img 
            src="/swaprunn-logo-2025.png?v=20251001" 
            alt="SwapRunn" 
            className={cn(
              "w-auto transition-all duration-300 drop-shadow-lg", 
              scrolled ? "h-20" : "h-24"
            )} 
          />
        </div>

        {/* Right: Messages Button - Only show if user is logged in */}
        <div className="flex items-center justify-center min-w-[50px] h-[50px]">
          {userProfile ? (
            <MessagesButton onClick={() => setShowMessages(true)} unreadCount={totalUnread} />
          ) : (
            <div className="w-11 h-11" /> // Placeholder for alignment
          )}
        </div>
      </div>

      {/* Messages Overlay */}
      <MessagesOverlay 
        isOpen={showMessages} 
        onClose={() => setShowMessages(false)} 
        userType={userProfile?.user_type || 'driver'}
        currentUserId={userProfile?.user_id || 'guest'}
      />
    </header>;
}