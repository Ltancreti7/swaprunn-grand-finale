import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";

import DriverPersonalProfile from "./pages/DriverPersonalProfile";
import DriverDashboard from "./pages/DriverDashboard";
import Track from "./pages/Track";
import History from "./pages/History";
import DealerAuth from "./pages/DealerAuth";
import DealerDashboard from "./pages/DealerDashboard";
import DealerAdminDashboard from "./pages/DealerAdminDashboard";
import DealerRequest from "./pages/DealerRequest";
import SimpleDriverRequest from "./pages/SimpleDriverRequestNew";
import DealerSettings from "./pages/DealerSettings";
import AcceptInvitation from "./pages/AcceptInvitation";
import StaffSignup from "./pages/StaffSignup";
import DriverRequests from "./pages/DriverRequests";
import DriverAuth from "./pages/DriverAuth";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import Contact from "./pages/Contact";
import Drivers from "./pages/Drivers";
import WhyUs from "./pages/WhyUs";
import HowItWorks from "./pages/HowItWorks";
import AboutSwapRunn from "./pages/AboutSwapRunn";
import LearnMore from "./pages/LearnMore";
import DealershipRegistration from "./pages/DealershipRegistration";
import BillingSettings from "./pages/BillingSettings";
import DealersOverview from "./pages/DealersOverview";
import SwapCoordinatorAuth from "./pages/SwapCoordinatorAuth";
import SwapCoordinatorDashboard from "./pages/SwapCoordinatorDashboard";
import PasswordResetRequest from "./pages/PasswordResetRequest";
import PasswordUpdate from "./pages/PasswordUpdate";
import DealerPortal from "./pages/DealerPortal";
import SalesDashboard from "./pages/SalesDashboard";

import NotFound from "./pages/NotFound";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { AuthProvider } from "@/hooks/useAuth";
import { MobileApp } from "@/components/MobileApp";
import DriverJobDetails from "./pages/DriverJobDetails";
import DriverAcceptedJob from "./pages/DriverAcceptedJob";
import { Header } from "@/components/Header";
import { ElasticScrollContainer } from "@/components/ui/elastic-scroll-container";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <MobileApp>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Header />
              <div className="min-h-screen">
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/how-it-works" element={<HowItWorks />} />
          <Route path="/about" element={<AboutSwapRunn />} />
          <Route path="/learn-more" element={<LearnMore />} />
          <Route path="/why-us" element={<WhyUs />} />
          
          <Route path="/dealers" element={<DealersOverview />} />
          <Route path="/dealers/registration" element={<DealershipRegistration />} />
          <Route path="/dealership/register" element={<DealershipRegistration />} />
          <Route path="/billing" element={<BillingSettings />} />
          <Route path="/dealer/auth" element={<DealerAuth />} />
          <Route path="/dealer/dashboard" element={
            <ProtectedRoute requiredUserType="dealer">
              <DealerDashboard />
            </ProtectedRoute>
          } />
          <Route path="/dealer/admin" element={
            <ProtectedRoute requiredUserType="dealer">
              <DealerAdminDashboard />
            </ProtectedRoute>
          } />
          <Route path="/dealer/request" element={
            <ProtectedRoute requiredUserType="dealer">
              <DealerRequest />
            </ProtectedRoute>
          } />
          <Route path="/dealer/request-simple" element={
            <ProtectedRoute requiredUserType="dealer">
              <SimpleDriverRequest />
            </ProtectedRoute>
          } />
          <Route path="/dealer/settings" element={
            <ProtectedRoute requiredUserType="dealer">
              <DealerSettings />
            </ProtectedRoute>
          } />
          <Route path="/dealer/portal" element={
            <ProtectedRoute requiredUserType="dealer">
              <DealerPortal />
            </ProtectedRoute>
          } />
          <Route path="/sales/dashboard" element={
            <ProtectedRoute requiredUserType="dealer">
              <SalesDashboard />
            </ProtectedRoute>
          } />
          <Route path="/accept-invitation/:token" element={<AcceptInvitation />} />
          <Route path="/staff/signup" element={<StaffSignup />} />
          
          <Route path="/driver/auth" element={<DriverAuth />} />
          <Route path="/driver-auth" element={<DriverAuth />} /> {/* Legacy alias */}
          <Route path="/auth/reset" element={<PasswordResetRequest />} />
          <Route path="/auth/password-update" element={<PasswordUpdate />} />
          <Route path="/driver/requests" element={
            <ProtectedRoute requiredUserType="driver">
              <DriverRequests />
            </ProtectedRoute>
          } />
          <Route path="/driver/dashboard" element={
            <ProtectedRoute requiredUserType="driver">
              <DriverDashboard />
            </ProtectedRoute>
          } />
          <Route path="/driver/profile" element={
            <ProtectedRoute requiredUserType="driver">
              <DriverPersonalProfile />
            </ProtectedRoute>
          } />
          <Route path="/driver/job/:jobId" element={
            <ProtectedRoute requiredUserType="driver">
              <DriverAcceptedJob />
            </ProtectedRoute>
          } />
          <Route path="/driver/job-details/:jobId" element={
            <ProtectedRoute requiredUserType="driver">
              <DriverJobDetails />
            </ProtectedRoute>
          } />
          
          <Route path="/track/:token" element={<Track />} />
          
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/drivers" element={<Drivers />} />
          
          <Route path="/swap-coordinator/auth" element={<SwapCoordinatorAuth />} />
          <Route path="/swap-coordinator/dashboard" element={
            <ProtectedRoute requiredUserType="swap_coordinator">
              <SwapCoordinatorDashboard />
            </ProtectedRoute>
          } />
          
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
        </div>
        </BrowserRouter>
      </TooltipProvider>
      </MobileApp>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
