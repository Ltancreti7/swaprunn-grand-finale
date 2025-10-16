import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { supabaseService } from "@/services/supabaseService";
import SiteHeader from "@/components/SiteHeader";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { useDriverNotifications } from "@/hooks/useDriverNotifications";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import mapBackgroundImage from "@/assets/map-background.jpg";

interface RequestData {
  id: string;
  type: string;
  created_at: string;
  pickup_address: string;
  delivery_address: string;
  distance_miles: number;
  requires_two: boolean;
  notes: string;
  vin: string;
  year: string;
  make: string;
  model: string;
  dealer_name: string;
  dealer_store: string;
  estimated_pay_cents: number;
  customer_name: string;
  customer_phone: string;
  status: string;
}

const DriverRequests = () => {
  const [requests, setRequests] = useState<RequestData[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, userProfile, loading: authLoading } = useAuth();
  const { markJobsSeen } = useDriverNotifications();

  useEffect(() => {
    if (!authLoading && userProfile?.user_type === 'driver') {
      fetchRequests();
      // Mark jobs as seen when user visits requests page
      markJobsSeen();
    }
  }, [authLoading, userProfile, markJobsSeen]);

  const fetchRequests = async () => {
    try {
      // Use secure function that excludes customer personal information
      const { data: jobs, error } = await supabase
        .rpc('get_open_jobs_for_drivers');

      if (error) throw error;

      const formattedRequests = jobs?.map(job => ({
        id: job.id,
        type: job.type || 'delivery',
        created_at: job.created_at || '',
        pickup_address: job.pickup_address || '',
        delivery_address: job.delivery_address || '',
        distance_miles: job.distance_miles || 0,
        requires_two: job.requires_two || false,
        notes: job.notes || '',
        vin: job.vin || '',
        year: job.year?.toString() || '',
        make: job.make || '',
        model: job.model || '',
        dealer_name: job.dealer_name || '',
        dealer_store: job.dealer_store || '',
        estimated_pay_cents: job.estimated_pay_cents || 0,
        customer_name: job.customer_name || '',
        customer_phone: job.customer_phone || '',
        status: job.status
      })) || [];

      setRequests(formattedRequests);
    } catch (error) {
      console.error('Error fetching requests:', error);
    } finally {
      setLoading(false);
    }
  };

  const [acceptingJobId, setAcceptingJobId] = useState<string | null>(null);

  const handleAccept = async (requestId: string) => {
    if (!userProfile?.driver_id) {
      toast({
        title: "Error: Driver profile not found",
        description: "Please complete your driver profile setup.",
        variant: "destructive",
      });
      return;
    }

    if (acceptingJobId) return; // Prevent multiple submissions

    setAcceptingJobId(requestId);

    try {
      // Use the service method which handles the correct order
      const result = await supabaseService.acceptJob(requestId, userProfile.driver_id);
      
      if (result) {
        toast({
          title: "Drive confirmed. Check your dashboard.",
          variant: "default",
        });
        navigate('/driver/dashboard');
      } else {
        throw new Error('Failed to accept job');
      }
    } catch (error: unknown) {
      console.error('Error accepting request:', error);
      
      // Handle specific error cases
      const errorMessage = error instanceof Error ? error.message : String(error);
      const errorCode = (error as { code?: string })?.code;
      
      if (errorMessage === 'JOB_ALREADY_TAKEN' || errorCode === '23505' || errorMessage?.includes('duplicate key')) {
        toast({
          title: "Job already taken",
          description: "Another driver has already accepted this job.",
          variant: "destructive",
        });
        // Remove this job from local state since it's no longer available
        setRequests(prev => prev.filter(req => req.id !== requestId));
      } else {
        toast({
          title: "Error accepting request",
          description: "Please try again.",
          variant: "destructive",
        });
      }
    } finally {
      setAcceptingJobId(null);
    }
  };

  const handleDecline = async (requestId: string) => {
    // For now, just remove from local state
    setRequests(prev => prev.filter(req => req.id !== requestId));
    
    toast({
      title: "Request declined",
      variant: "default",
    });
  };

  // Show loading while authentication or requests are loading
  if (authLoading || loading) {
    return (
      <div className="min-h-screen" style={{
        backgroundImage: `url(${mapBackgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}>
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/38 to-black/65"></div>
        <div className="relative z-10 max-w-4xl mx-auto pt-28 pb-12 px-6">
          <div className="text-center py-8 text-white/70">
            {authLoading ? "Loading..." : "Loading requests..."}
          </div>
        </div>
      </div>
    );
  }

  // Redirect if not authenticated or not a driver
  if (!authLoading && (!user || userProfile?.user_type !== 'driver')) {
    navigate('/driver/auth');
    return null;
  }

  return (
    <div className="min-h-screen" style={{
      backgroundImage: `url(${mapBackgroundImage})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center'
    }}>
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/38 to-black/65"></div>
      
      <div className="relative z-10 max-w-4xl mx-auto pt-28 pb-12 px-6">
        <h1 className="text-2xl font-bold text-white mb-6 text-center">Incoming Requests</h1>

        {requests.length === 0 ? (
          <Card className="bg-white/20 border-white/30 backdrop-blur-sm shadow-lg">
            <CardContent className="p-6 text-center">
              <div className="text-white/70">No pending requests</div>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {requests.map((request) => {
              const timeAgo = new Date(request.created_at).toLocaleTimeString([], { 
                hour: '2-digit', 
                minute: '2-digit' 
              });
              
              // Calculate pay based on $20/hour for round trip
              const roundTripMiles = request.distance_miles * 2;
              const estimatedHours = roundTripMiles / 35; // 35 mph average speed
              const estimatedPay = Math.round(estimatedHours * 20); // $20/hour
              
              return (
                <Card key={request.id} className="bg-white/20 backdrop-blur-sm border-l-4 border-primary shadow-lg">
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-white text-lg">{request.dealer_name}</CardTitle>
                        {request.dealer_store && (
                          <p className="text-sm text-white/70">{request.dealer_store}</p>
                        )}
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-white/60">Posted at {timeAgo}</p>
                        <Badge variant="secondary" className="mt-1">
                          {request.type}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    {/* Vehicle Information */}
                    <div>
                      <h4 className="text-sm font-semibold text-white mb-2">Vehicle Details</h4>
                      <div className="bg-white/15 border border-white/20 p-3 rounded-lg">
                        <p className="font-medium text-white">
                          {request.year} {request.make} {request.model} {request.customer_name && `- ${request.customer_name}`}
                        </p>
                        <p className="text-sm text-white/70">VIN: {request.vin}</p>
                        {request.customer_phone && (
                          <p className="text-sm text-white/70">Customer: {request.customer_phone}</p>
                        )}
                        {request.requires_two && (
                          <Badge variant="destructive" className="mt-1">
                            ⚠️ Requires 2 drivers
                          </Badge>
                        )}
                      </div>
                    </div>

                    {/* Addresses */}
                    <div className="space-y-3">
                      <div>
                        <h4 className="text-sm font-semibold text-white/90 mb-1">Pickup Location</h4>
                                                <p className="text-sm text-white bg-white/15 border border-white/20 p-2 rounded">{request.pickup_address}</p>
                      </div>
                      <div>
                        <h5 className="text-xs font-medium text-white/80 mb-1">DELIVERY ADDRESS</h5>
                        <p className="text-sm text-white bg-white/15 border border-white/20 p-2 rounded">{request.delivery_address}</p>
                      </div>
                    </div>

                    {/* Notes */}
                    {request.notes && (
                      <div>
                        <h4 className="text-sm font-semibold text-white/90 mb-1">Special Instructions</h4>
                        <p className="text-sm text-white bg-yellow-500/30 border border-yellow-500/40 p-2 rounded border-l-2">
                          {request.notes}
                        </p>
                      </div>
                    )}

                    {/* Payment and Distance */}
                    <div className="bg-green-500/30 border border-green-500/40 p-3 rounded-lg">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-sm text-white/70">Round Trip Distance</p>
                          <p className="font-semibold text-white">{roundTripMiles} miles</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-white/70">Estimated Pay ($20/hr)</p>
                          <p className="text-2xl font-bold text-green-400">${estimatedPay}</p>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3 pt-2">
                      <Button
                        variant="outline"
                        onClick={() => handleDecline(request.id)}
                        className="flex-1 border-white/30 text-white hover:bg-white/10"
                      >
                        Decline
                      </Button>
                      <Button
                        onClick={() => handleAccept(request.id)}
                        disabled={acceptingJobId === request.id}
                        className="flex-1 bg-primary hover:bg-primary/90"
                      >
                        {acceptingJobId === request.id ? 'Accepting...' : 'Accept'}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default DriverRequests;