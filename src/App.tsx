import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import GetStarted from "./pages/GetStarted";
import About from "./pages/About";
import WhyUs from "./pages/WhyUs";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import NotFound from "./pages/NotFound";

import DealerDashboard from "./pages/DealerDashboard";
import DriverDashboard from "./pages/DriverDashboard";
import ManagerDashboard from "./pages/ManagerDashboard";

import AuthPage from "@/components/AuthPage";
import ProtectedRoute from "@/components/ProtectedRoute";
import { AuthProvider } from "@/hooks/useAuth";
import { MobileApp } from "@/components/MobileApp";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <MobileApp>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              {/* Public Pages */}
              <Route path="/" element={<Index />} />
              <Route path="/about" element={<About />} />
              <Route path="/why-us" element={<WhyUs />} />
              <Route path="/get-started" element={<GetStarted />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/terms" element={<Terms />} />

              {/* Unified Auth Routes */}
              <Route path="/dealer/auth" element={<AuthPage role="dealer" />} />
              <Route path="/driver/auth" element={<AuthPage role="driver" />} />
              <Route path="/manager/auth" element={<AuthPage role="manager" />} />

              {/* Role-Based Dashboards */}
              <Route
                path="/dealer-dashboard"
                element={
                  <ProtectedRoute allowedRoles={["dealer"]}>
                    <DealerDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/driver-dashboard"
                element={
                  <ProtectedRoute allowedRoles={["driver"]}>
                    <DriverDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/manager-dashboard"
                element={
                  <ProtectedRoute allowedRoles={["manager"]}>
                    <ManagerDashboard />
                  </ProtectedRoute>
                }
              />

              {/* Catch-All */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </MobileApp>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
