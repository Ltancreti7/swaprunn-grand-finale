import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  addressToString,
  AddressInput,
  AddressData,
} from "@/components/ui/address-input";
import { getJobCoordinates } from "@/services/geoService";
import {
  RefreshCw,
  Mail,
  User,
  Calendar,
  MapPin,
  Clock,
  Car,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import mapBackgroundImage from "@/assets/map-background.jpg";
import { RequestDriverForm } from "@/components/swap-coordinator/RequestDriverForm";
import { ActiveSwapsDashboard } from "@/components/swap-coordinator/ActiveSwapsDashboard";
interface SwapCoordinatorData {
  id: string;
  name: string;
  email: string;
  phone?: string;
  profile_photo_url?: string;
  created_at: string;
}
interface DriverRequest {
  id: string;
  created_at: string;
  outgoing_vin: string;
  outgoing_make?: string;
  outgoing_model?: string;
  outgoing_year?: number;
  incoming_vin: string;
  incoming_make?: string;
  incoming_model?: string;
  incoming_year?: number;
  destination_address: string;
  destination_dealer_name: string;
  status: string;
  driver_name?: string;
  contact_name?: string;
  contact_phone?: string;
  special_instructions?: string;
}
export default function SwapCoordinatorDashboard() {
  const [driverRequests, setDriverRequests] = useState<DriverRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [coordinatorData, setCoordinatorData] =
    useState<SwapCoordinatorData | null>(null);
  const [stockNumber, setStockNumber] = useState("");
  const [fromDealer, setFromDealer] = useState("");
  const [toDealer, setToDealer] = useState("");
  const [pickupAddress, setPickupAddress] = useState<AddressData>({
    street: "",
    city: "",
    state: "",
    zip: "",
  });
  const [deliveryAddress, setDeliveryAddress] = useState<AddressData>({
    street: "",
    city: "",
    state: "",
    zip: "",
  });
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { user, userProfile, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  useEffect(() => {
    if (userProfile?.user_type === "swap_coordinator") {
      fetchDriverRequests();
      fetchCoordinatorData();
    }
  }, [userProfile]);
  useEffect(() => {
    checkAuth();
  }, []);
  async function checkAuth() {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      navigate("/swap-coordinator/auth");
      return;
    }
    const { data: profile } = await supabase
      .from("profiles")
      .select("user_type")
      .eq("user_id", user.id)
      .single();
    if (profile?.user_type !== "swap_coordinator") {
      navigate("/swap-coordinator/auth");
      return;
    }
    setLoading(false);
  }
  const fetchDriverRequests = async () => {
    try {
      const { data, error } = await supabase
        .from("driver_requests")
        .select("*")
        .order("created_at", {
          ascending: false,
        });
      if (error) throw error;
      setDriverRequests(data || []);
    } catch (error) {
      console.error("Error fetching driver requests:", error);
    }
  };
  const fetchCoordinatorData = async () => {
    if (!userProfile?.swap_coordinator_id) return;
    try {
      const { data, error } = await supabase
        .from("swap_coordinators")
        .select("*")
        .eq("id", userProfile.swap_coordinator_id)
        .single();
      if (error) throw error;
      setCoordinatorData(data);
    } catch (error) {
      console.error("Error fetching coordinator data:", error);
    }
  };
  const handleRefreshRequests = async () => {
    await fetchDriverRequests();
    toast({
      title: "Requests Refreshed",
      description: "Checking for new updates...",
    });
  };
  const renderDriverRequestCard = (request: DriverRequest) => (
    <Card
      key={request.id}
      className="bg-white/10 backdrop-blur-sm border-white/20 shadow-lg rounded-2xl"
    >
      <CardHeader>
        <CardTitle className="text-white flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Car className="h-5 w-5" />
            {request.outgoing_year} {request.outgoing_make}{" "}
            {request.outgoing_model}
          </span>
          <span
            className={`text-sm px-3 py-1 rounded-full ${request.status === "pending" ? "bg-yellow-500/20 text-yellow-300" : request.status === "assigned" ? "bg-blue-500/20 text-blue-300" : "bg-green-500/20 text-green-300"}`}
          >
            {request.status}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 text-white/90">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-white/60">VIN</p>
            <p className="font-mono text-sm">{request.outgoing_vin}</p>
          </div>
          <div>
            <p className="text-sm text-white/60">Destination</p>
            <p className="text-sm flex items-start gap-2">
              <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
              {request.destination_address}
            </p>
          </div>
        </div>
        {request.driver_name && (
          <div>
            <p className="text-sm text-white/60">Driver</p>
            <p>{request.driver_name}</p>
          </div>
        )}
        {request.special_instructions && (
          <div>
            <p className="text-sm text-white/60">Instructions</p>
            <p className="text-sm">{request.special_instructions}</p>
          </div>
        )}
        <div className="flex items-center gap-2 text-sm text-white/60">
          <Clock className="h-4 w-4" />
          {new Date(request.created_at).toLocaleDateString()} at{" "}
          {new Date(request.created_at).toLocaleTimeString()}
        </div>
      </CardContent>
    </Card>
  );
  if (loading) {
    return (
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
        <div className="absolute inset-0 bg-gradient-to-b from-black/75 via-black/65 to-black/40 z-0"></div>
        <div className="relative z-10 container mx-auto px-6 py-24">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-white/20 rounded w-1/3"></div>
            <div className="h-32 bg-white/10 rounded-2xl"></div>
            <div className="h-64 bg-white/10 rounded-2xl"></div>
          </div>
        </div>
      </div>
    );
  }
  const pendingRequests = driverRequests.filter((r) => r.status === "pending");
  const assignedRequests = driverRequests.filter(
    (r) => r.status === "assigned",
  );
  const completedRequests = driverRequests.filter(
    (r) => r.status === "completed",
  );
  return (
    <>
      <title>Swap Coordinator Dashboard | SwapRunn</title>
      <meta
        name="description"
        content="Manage dealer-to-dealer inventory swaps from your SwapRunn swap coordinator dashboard."
      />
      <link rel="canonical" href="/swap-coordinator/dashboard" />

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
        <div className="absolute inset-0 bg-gradient-to-b from-black/75 via-black/65 to-black/40 z-0"></div>

        <div className="relative z-10 container mx-auto px-6 py-[53px]">
          <div className="space-y-6 md:space-y-8">
            {/* Page Header */}
            <div className="text-center mb-8">
              <h1 className="text-5xl font-display font-black text-white mb-4">
                Swap Portal
              </h1>
              <p className="text-xl text-white/80 font-light">
                Manage dealer-to-dealer inventory swaps
              </p>
            </div>

            {/* Horizontal Navigation Tabs */}
            <Tabs defaultValue="profile" className="w-full">
              <TabsList className="w-full grid grid-cols-4 bg-[#1A1A1A]/80 backdrop-blur-sm border border-white/20 rounded-2xl h-auto p-2 gap-2 shadow-lg">
                <TabsTrigger
                  value="profile"
                  className="data-[state=active]:bg-[#E11900] data-[state=active]:text-white data-[state=active]:shadow-lg text-white/70 rounded-xl font-bold text-sm transition-all duration-300 hover:text-white hover:bg-white/10 py-3 border-0"
                >
                  Profile
                </TabsTrigger>
                <TabsTrigger
                  value="pending"
                  className="relative data-[state=active]:bg-[#E11900] data-[state=active]:text-white data-[state=active]:shadow-lg text-white/70 rounded-xl font-bold text-sm transition-all duration-300 hover:text-white hover:bg-white/10 py-3 border-0"
                >
                  Pending
                  {pendingRequests.length > 0 && (
                    <span className="absolute -top-1 -right-1 bg-[#E11900] text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center shadow-lg">
                      {pendingRequests.length}
                    </span>
                  )}
                </TabsTrigger>
                <TabsTrigger
                  value="assigned"
                  className="relative data-[state=active]:bg-[#E11900] data-[state=active]:text-white data-[state=active]:shadow-lg text-white/70 rounded-xl font-bold text-sm transition-all duration-300 hover:text-white hover:bg-white/10 py-3 border-0"
                >
                  Assigned
                  {assignedRequests.length > 0 && (
                    <span className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center shadow-lg">
                      {assignedRequests.length}
                    </span>
                  )}
                </TabsTrigger>
                <TabsTrigger
                  value="completed"
                  className="data-[state=active]:bg-[#E11900] data-[state=active]:text-white data-[state=active]:shadow-lg text-white/70 rounded-xl font-bold text-sm transition-all duration-300 hover:text-white hover:bg-white/10 py-3 border-0"
                >
                  Completed
                </TabsTrigger>
              </TabsList>

              {/* Profile Tab */}
              <TabsContent
                value="profile"
                className="mt-2 space-y-6 animate-fade-in"
              >
                <Card className="bg-white/10 backdrop-blur-sm border-white/20 shadow-lg rounded-2xl">
                  <CardContent className="p-6">
                    <div className="flex flex-col items-center gap-6 md:gap-8 text-center">
                      {coordinatorData?.profile_photo_url ? (
                        <img
                          src={coordinatorData.profile_photo_url}
                          alt={coordinatorData.name}
                          className="w-32 h-32 md:w-40 md:h-40 rounded-full object-cover border-4 border-white/30 shadow-2xl"
                        />
                      ) : (
                        <div className="w-32 h-32 md:w-40 md:h-40 bg-[#E11900]/30 rounded-full flex items-center justify-center shadow-2xl border-4 border-white/30">
                          <User className="h-16 w-16 md:h-20 md:w-20 text-white" />
                        </div>
                      )}
                      <div className="space-y-4 md:space-y-6">
                        <h2 className="text-2xl md:text-4xl font-bold text-white">
                          {coordinatorData?.name}
                        </h2>
                        <div className="space-y-3 md:space-y-4">
                          <div className="flex items-center justify-center gap-3 md:gap-4 text-white text-base md:text-lg">
                            <Mail className="h-5 w-5 md:h-6 md:w-6 text-white/80 flex-shrink-0" />
                            <span className="font-medium break-all">
                              {coordinatorData?.email || user?.email}
                            </span>
                          </div>
                          {coordinatorData?.phone && (
                            <div className="flex items-center justify-center gap-3 md:gap-4 text-white text-base md:text-lg">
                              <User className="h-5 w-5 md:h-6 md:w-6 text-white/80 flex-shrink-0" />
                              <span className="font-medium">
                                {coordinatorData.phone}
                              </span>
                            </div>
                          )}
                          <div className="flex items-center justify-center gap-3 md:gap-4 text-white/80 pt-2 md:pt-4">
                            <Calendar className="h-4 w-4 md:h-5 md:w-5 flex-shrink-0" />
                            <span className="text-sm md:text-base">
                              Member since{" "}
                              {new Date(
                                coordinatorData?.created_at || "",
                              ).toLocaleDateString()}
                            </span>
                          </div>
                          <div className="flex flex-col md:flex-row gap-3 md:gap-4 mt-6 md:mt-8 w-full">
                            <Button
                              onClick={() => {
                                const requestTab =
                                  document.querySelector('[value="pending"]');
                                if (requestTab instanceof HTMLElement)
                                  requestTab.click();
                              }}
                              className="flex-1 bg-[#E11900] hover:bg-[#E11900]/90 text-white border-0 text-base md:text-lg px-6 md:px-8 h-12 md:h-auto md:py-6 rounded-xl font-semibold shadow-lg"
                            >
                              Request Driver
                            </Button>
                            <Button
                              variant="outline"
                              className="flex-1 bg-transparent text-white border-2 border-white/30 hover:bg-white/15 text-base md:text-lg px-6 md:px-8 h-12 md:h-auto md:py-6 rounded-xl font-semibold"
                            >
                              Edit Info
                            </Button>
                          </div>
                        </div>
                      </div>
                      <Button
                        onClick={() => signOut()}
                        variant="outline"
                        className="mt-4 md:mt-6 w-full md:w-auto bg-transparent text-white border-2 border-white/30 hover:bg-white/15 text-base md:text-lg px-6 md:px-8 h-12 md:h-auto md:py-6 rounded-xl font-semibold"
                      >
                        Sign Out
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Pending Tab */}
              <TabsContent
                value="pending"
                className="mt-2 space-y-6 animate-fade-in"
              >
                <div className="flex justify-between items-center mb-4">
                  <h2 className="font-bold text-white text-xl my-[14px]">
                    Pending Requests
                  </h2>
                  <Button
                    onClick={() => fetchDriverRequests()}
                    variant="outline"
                    className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Refresh
                  </Button>
                </div>
                <RequestDriverForm onSuccess={() => fetchDriverRequests()} />
                {pendingRequests.length > 0 ? (
                  <div className="grid gap-4">
                    {pendingRequests.map(renderDriverRequestCard)}
                  </div>
                ) : (
                  <Card className="bg-white/5 backdrop-blur-sm border-white/10 shadow-lg rounded-2xl">
                    <CardContent className="p-12 text-center py-[37px]">
                      <p className="text-lg text-white/60">
                        No pending requests
                      </p>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              {/* Assigned Tab */}
              <TabsContent
                value="assigned"
                className="mt-2 space-y-6 animate-fade-in"
              >
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-2xl font-bold text-white">
                    Assigned Drives
                  </h2>
                  <Button
                    onClick={() => fetchDriverRequests()}
                    variant="outline"
                    className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Refresh
                  </Button>
                </div>
                {assignedRequests.length > 0 ? (
                  <div className="grid gap-4">
                    {assignedRequests.map(renderDriverRequestCard)}
                  </div>
                ) : (
                  <Card className="bg-white/5 backdrop-blur-sm border-white/10 shadow-lg rounded-2xl">
                    <CardContent className="p-12 text-center">
                      <p className="text-lg text-white/60">
                        No assigned drives
                      </p>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              {/* Completed Tab */}
              <TabsContent
                value="completed"
                className="mt-2 space-y-6 animate-fade-in my-0 py-0"
              >
                <div className="flex justify-between items-center mb-4">
                  <Button
                    onClick={() => fetchDriverRequests()}
                    variant="outline"
                    className="bg-white/10 border-white/20 text-white hover:bg-white/20 py-0 my-[20px]"
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Refresh
                  </Button>
                </div>
                {completedRequests.length > 0 ? (
                  <div className="grid gap-4">
                    {completedRequests.map(renderDriverRequestCard)}
                  </div>
                ) : (
                  <Card className="bg-white/5 backdrop-blur-sm border-white/10 shadow-lg rounded-2xl">
                    <CardContent className="p-12 text-center py-[39px] my-0">
                      <p className="text-lg text-white/60">
                        No completed drives yet
                      </p>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </>
  );
}
