import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Mail, User, Calendar, Phone, MapPin, Star } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import mapBackgroundImage from "@/assets/map-background.jpg";
import { ProfilePhoto } from "@/components/driver/ProfilePhoto";
import { EditDriverProfile } from "@/components/driver/EditDriverProfile";
import type { JobData, EarningsData, DriverProfile } from '@/services/driver-data';

interface DriverData {
  id: string;
  name: string;
  email: string;
  phone?: string;
  profile_photo_url?: string;
  created_at: string;
  rating_avg?: number;
  rating_count?: number;
  max_miles?: number;
  city_ok?: boolean;
  available?: boolean;
}

export default function DriverDashboard() {
  const [loading, setLoading] = useState(true);
  const [driverData, setDriverData] = useState<DriverData | null>(null);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [jobs, setJobs] = useState<JobData[]>([]);
  const [jobsLoading, setJobsLoading] = useState(true);
  const [earnings, setEarnings] = useState<EarningsData | null>(null);
  const [earningsLoading, setEarningsLoading] = useState(true);
  const { user, userProfile, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Fetch jobs
  const fetchJobs = async () => {
    setJobsLoading(true);
    try {
      const { data, error } = await supabase
        .from('jobs')
        .select('*')
        .eq('status', 'open')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      // Transform to JobData format
      const transformedJobs: JobData[] = (data || []).map(job => ({
        id: job.id,
        pickup: job.pickup_address || '',
        dropoff: job.delivery_address || '',
        distanceMi: Number(job.distance_miles) || 0,
        pay: 0,
        status: 'Upcoming' as const,
        vehicleMake: job.make,
        vehicleModel: job.model,
        vehicleYear: job.year,
        vin: job.vin
      }));
      
      setJobs(transformedJobs);
    } catch (error) {
      console.error('Error fetching jobs:', error);
    } finally {
      setJobsLoading(false);
    }
  };

  // Fetch earnings
  const fetchEarnings = async () => {
    if (!userProfile?.driver_id) return;
    
    setEarningsLoading(true);
    try {
      const { data, error } = await supabase
        .from('payouts')
        .select('*')
        .eq('driver_id', userProfile.driver_id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      const total = data?.reduce((sum, payout) => sum + (payout.amount_cents || 0), 0) || 0;
      setEarnings({
        today: 0,
        week: 0,
        month: total / 100
      });
    } catch (error) {
      console.error('Error fetching earnings:', error);
    } finally {
      setEarningsLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    if (userProfile?.user_type === 'driver') {
      fetchDriverData();
      fetchJobs();
      fetchEarnings();
    }
  }, [userProfile]);

  async function checkAuth() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      navigate("/driver/auth");
      return;
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("user_type")
      .eq("user_id", user.id)
      .single();

    if (profile?.user_type !== "driver") {
      navigate("/driver/auth");
      return;
    }
    setLoading(false);
  }

  const fetchDriverData = async () => {
    if (!userProfile?.driver_id) return;

    try {
      const { data, error } = await supabase
        .from("drivers")
        .select("*")
        .eq("id", userProfile.driver_id)
        .single();

      if (error) throw error;
      setDriverData(data);
    } catch (error) {
      console.error("Error fetching driver data:", error);
    }
  };

  const handlePhotoUpdate = (newUrl: string) => {
    setDriverData(prev => prev ? { ...prev, profile_photo_url: newUrl } : null);
  };

  const handleProfileUpdate = (updatedData: Partial<DriverData>) => {
    setDriverData(prev => prev ? { ...prev, ...updatedData } : null);
    setIsEditingProfile(false);
    toast({
      title: "Profile Updated",
      description: "Your profile has been successfully updated."
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen relative bg-black" style={{
        backgroundImage: `url(${mapBackgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center top',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed'
      }}>
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

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <>
      <title>Driver Dashboard | SwapRunn</title>
      <meta name="description" content="Manage your driving jobs and earnings from your SwapRunn driver dashboard." />
      <link rel="canonical" href="/driver/dashboard" />
      
      <div className="min-h-screen relative bg-black" style={{
        backgroundImage: `url(${mapBackgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center top',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed'
      }}>
        <div className="absolute inset-0 bg-gradient-to-b from-black/75 via-black/65 to-black/40 z-0"></div>
        
        <div className="relative z-10 container mx-auto px-4 md:px-6 py-6 md:py-24 pb-safe pt-safe">
          <div className="space-y-6 md:space-y-8">
            {/* Page Header */}
            <div className="text-center lg:text-left mb-8 pt-6 md:pt-0 space-y-4 md:space-y-6 flex flex-col lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h1 className="text-3xl md:text-6xl font-display font-black tracking-tight text-white drop-shadow-lg leading-tight">
                  Driver Dashboard
                </h1>
                <p className="text-lg md:text-2xl text-white font-medium leading-relaxed">
                  Your Jobs, Earnings & Profile
                </p>
              </div>
            </div>

            {/* Horizontal Navigation Tabs */}
            <Tabs defaultValue="profile" className="w-full">
              <TabsList className="w-full">
                <TabsTrigger value="profile">Profile</TabsTrigger>
                <TabsTrigger value="jobs">Available Jobs</TabsTrigger>
                <TabsTrigger value="earnings">Earnings</TabsTrigger>
                <TabsTrigger value="documents">Documents</TabsTrigger>
              </TabsList>

              {/* Profile Tab */}
              <TabsContent value="profile" className="mt-6 md:mt-8 space-y-6 animate-fade-in px-4 md:px-0">
                <Card className="bg-white/15 backdrop-blur-md border-2 border-white/30 shadow-2xl rounded-3xl">
                  <CardContent className="p-6 md:p-10">
                    <div className="flex flex-col items-center gap-6 md:gap-8 text-center">
                      {/* Profile Photo */}
                      <div className="relative">
                        {driverData?.profile_photo_url ? (
                          <img
                            src={driverData.profile_photo_url}
                            alt={driverData.name}
                            className="w-32 h-32 md:w-40 md:h-40 rounded-full object-cover border-4 border-white/30 shadow-2xl"
                          />
                        ) : (
                          <div className="w-32 h-32 md:w-40 md:h-40 bg-[#E11900]/30 rounded-full flex items-center justify-center shadow-2xl border-4 border-white/30">
                            <span className="text-4xl md:text-5xl font-bold text-white">
                              {driverData?.name ? getInitials(driverData.name) : 'DR'}
                            </span>
                          </div>
                        )}
                        <ProfilePhoto
                          photoUrl={driverData?.profile_photo_url || ''}
                          driverName={driverData?.name || ''}
                          onPhotoUpdate={handlePhotoUpdate}
                        />
                      </div>

                      {/* Driver Info */}
                      <div className="space-y-4 md:space-y-6 w-full">
                        <h2 className="text-2xl md:text-4xl font-bold text-white">{driverData?.name}</h2>
                        
                        {/* Rating */}
                        {driverData?.rating_avg && (
                          <div className="flex items-center justify-center gap-2 text-white">
                            <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                            <span className="text-lg font-semibold">
                              {driverData.rating_avg.toFixed(1)}
                            </span>
                            <span className="text-white/70">
                              ({driverData.rating_count || 0} reviews)
                            </span>
                          </div>
                        )}

                        {/* Contact Info */}
                        <div className="space-y-3 md:space-y-4">
                          <div className="flex items-center justify-center gap-3 md:gap-4 text-white text-base md:text-lg">
                            <Mail className="h-5 w-5 md:h-6 md:w-6 text-white/80 flex-shrink-0" />
                            <span className="font-medium break-all">{driverData?.email || user?.email}</span>
                          </div>
                          {driverData?.phone && (
                            <div className="flex items-center justify-center gap-3 md:gap-4 text-white text-base md:text-lg">
                              <Phone className="h-5 w-5 md:h-6 md:w-6 text-white/80 flex-shrink-0" />
                              <span className="font-medium">{driverData.phone}</span>
                            </div>
                          )}
                          {driverData?.max_miles && (
                            <div className="flex items-center justify-center gap-3 md:gap-4 text-white text-base md:text-lg">
                              <MapPin className="h-5 w-5 md:h-6 md:w-6 text-white/80 flex-shrink-0" />
                              <span className="font-medium">Up to {driverData.max_miles} miles</span>
                            </div>
                          )}
                          <div className="flex items-center justify-center gap-3 md:gap-4 text-white/80 pt-2 md:pt-4">
                            <Calendar className="h-4 w-4 md:h-5 md:w-5 flex-shrink-0" />
                            <span className="text-sm md:text-base">
                              Member since {new Date(driverData?.created_at || '').toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto mt-4">
                        <Button 
                          onClick={() => setIsEditingProfile(true)}
                          className="w-full sm:w-auto bg-[#E11900] hover:bg-[#E11900]/90 text-white text-base md:text-lg px-6 md:px-8 h-12 md:h-14 rounded-2xl font-semibold shadow-xl"
                        >
                          Edit Profile
                        </Button>
                        <Button 
                          onClick={() => signOut()} 
                          variant="outline" 
                          className="w-full sm:w-auto bg-transparent text-white border-2 border-white/30 hover:bg-white/15 text-base md:text-lg px-6 md:px-8 h-12 md:h-14 rounded-2xl font-semibold"
                        >
                          Sign Out
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Jobs Tab */}
              <TabsContent value="jobs" className="mt-6 md:mt-8 animate-fade-in">
                <Card className="bg-white/15 backdrop-blur-md border-2 border-white/30 shadow-2xl rounded-3xl">
                  <CardContent className="p-6 md:p-10">
                    {jobsLoading ? (
                      <div className="text-center text-white py-8">Loading jobs...</div>
                    ) : jobs.length === 0 ? (
                      <div className="text-center text-white/70 py-8 text-lg">No available jobs at the moment</div>
                    ) : (
                      <div className="space-y-4">
                        {jobs.map((job: any) => (
                          <div key={job.id} className="bg-white/10 p-6 rounded-2xl border border-white/20">
                            <h3 className="text-xl font-bold text-white mb-2">{job.make} {job.model}</h3>
                            <p className="text-white/80">{job.pickup_address} → {job.delivery_address}</p>
                            <p className="text-white/60 mt-2">{job.distance_miles} miles</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Earnings Tab */}
              <TabsContent value="earnings" className="mt-6 md:mt-8 animate-fade-in">
                <Card className="bg-white/15 backdrop-blur-md border-2 border-white/30 shadow-2xl rounded-3xl">
                  <CardContent className="p-6 md:p-10">
                    {earningsLoading ? (
                      <div className="text-center text-white py-8">Loading earnings...</div>
                    ) : (
                      <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          <div className="text-center">
                            <p className="text-white/70 mb-2">Today</p>
                            <p className="text-3xl font-bold text-white">
                              ${earnings?.today.toFixed(2) || '0.00'}
                            </p>
                          </div>
                          <div className="text-center">
                            <p className="text-white/70 mb-2">This Week</p>
                            <p className="text-3xl font-bold text-white">
                              ${earnings?.week.toFixed(2) || '0.00'}
                            </p>
                          </div>
                          <div className="text-center">
                            <p className="text-white/70 mb-2">This Month</p>
                            <p className="text-3xl font-bold text-white">
                              ${earnings?.month.toFixed(2) || '0.00'}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Documents Tab */}
              <TabsContent value="documents" className="mt-6 md:mt-8 animate-fade-in">
                <Card className="bg-white/15 backdrop-blur-md border-2 border-white/30 shadow-2xl rounded-3xl">
                  <CardContent className="p-6 md:p-10">
                    <div className="text-center text-white/70 py-8 text-lg">
                      Document management coming soon
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      {driverData && (
        <EditDriverProfile
          isOpen={isEditingProfile}
          onClose={() => setIsEditingProfile(false)}
          driverData={driverData}
          onUpdate={handleProfileUpdate}
        />
      )}
    </>
  );
}
