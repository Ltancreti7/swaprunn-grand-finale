import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Truck, RefreshCw, Plus, Clock, User, Building2, Star, MapPin, Mail, Calendar } from "lucide-react";
import { MobilePullToRefresh } from "@/components/ui/mobile-pull-to-refresh";
import { useToast } from "@/hooks/use-toast";
import { EditDealerProfile } from "@/components/dealer/EditDealerProfile";
import { useUnreadMessages } from '@/hooks/useUnreadMessages';
import { DealerProfilePhoto } from "@/components/dealer/DealerProfilePhoto";
import { JobStatsCard } from "@/components/dealer/JobStatsCard";
import { JobCard } from "@/components/dealer/JobCard";
import { AssignmentCard } from "@/components/dealer/AssignmentCard";
import mapBackgroundImage from "@/assets/map-background.jpg";
interface DealerData {
  id: string;
  name: string;
  email: string;
  store?: string;
  profile_photo_url?: string;
  created_at: string;
  position?: string;
  phone?: string;
  street?: string;
  city?: string;
  state?: string;
  zip?: string;
  website?: string;
}
interface ActiveAssignment {
  id: string;
  job_id: string;
  driver_id: string;
  accepted_at: string;
  started_at?: string;
  jobs: {
    id: string;
    type: string;
    pickup_address: string;
    delivery_address: string;
    year?: number;
    make?: string;
    model?: string;
    customer_name?: string;
    distance_miles?: number;
    created_at: string;
    created_by?: string;
  };
  drivers: {
    id: string;
    name: string;
    email?: string;
    phone?: string;
    rating_avg?: number;
    rating_count?: number;
    profile_photo_url?: string;
    available?: boolean;
    day_off?: string;
    max_miles?: number;
    city_ok?: boolean;
    trust_score?: number;
  };
}
const DealerDashboard = () => {
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [dealerData, setDealerData] = useState<DealerData | null>(null);
  const [activeAssignments, setActiveAssignments] = useState<ActiveAssignment[]>([]);
  const [newAssignmentsCount, setNewAssignmentsCount] = useState(0);
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const {
    user,
    userProfile,
    signOut
  } = useAuth();
  const navigate = useNavigate();
  const {
    toast
  } = useToast();
  useEffect(() => {
    if (userProfile?.user_type === 'dealer') {
      fetchJobs();
      fetchDealerData();
      fetchActiveAssignments();
    }
  }, [userProfile]);

  // Enhanced real-time subscription with error recovery
  useEffect(() => {
    if (!userProfile?.dealer_id) return;
    const channel = supabase.channel(`dealer-jobs-${userProfile.dealer_id}-${Date.now()}`).on('postgres_changes', {
      event: 'UPDATE',
      schema: 'public',
      table: 'jobs',
      filter: `dealer_id=eq.${userProfile.dealer_id}`
    }, payload => {
      // Immediately refresh data when job status changes
      fetchActiveAssignments();
      fetchDealerData();
    }).on('postgres_changes', {
      event: 'INSERT',
      schema: 'public',
      table: 'assignments'
    }, payload => {
      toast({
        title: "Driver Assigned!",
        description: "A driver has accepted your job request.",
        duration: 5000
      });
      fetchJobs();
      fetchActiveAssignments();
    }).subscribe(status => {
      if (status === 'CHANNEL_ERROR') {
        console.error('❌ Real-time subscription error');
        toast({
          title: "Connection Issue",
          description: "Real-time updates may be delayed. Trying to reconnect...",
          variant: "destructive"
        });
      }
    });
    return () => {
      supabase.removeChannel(channel);
    };
  }, [userProfile?.dealer_id, toast]);
  const fetchJobs = async () => {
    if (!userProfile?.dealer_id) return;
    try {
      const {
        data,
        error
      } = await supabase.from('jobs').select(`
          *,
          assignments(*, drivers(name, email, phone, rating_avg, rating_count, available))
        `).eq('dealer_id', userProfile.dealer_id).order('created_at', {
        ascending: false
      });
      if (error) throw error;
      setJobs(data || []);
    } catch (error) {
      console.error('Error fetching jobs:', error);
    } finally {
      setLoading(false);
    }
  };
  const fetchActiveAssignments = async () => {
    if (!userProfile?.dealer_id) return;
    try {
      const {
        data,
        error
      } = await supabase.from('assignments').select(`
          id,
          job_id,
          driver_id,
          accepted_at,
          started_at,
          jobs!inner (
            id,
            type,
            pickup_address,
            delivery_address,
            year,
            make,
            model,
            customer_name,
            distance_miles,
            created_at,
            created_by,
            dealer_id
          ),
          drivers!inner (
            id,
            name,
            email,
            phone,
            rating_avg,
            rating_count,
            profile_photo_url,
            available,
            day_off,
            max_miles,
            city_ok,
            trust_score
          )
        `).eq('jobs.dealer_id', userProfile.dealer_id).is('ended_at', null).not('accepted_at', 'is', null).order('accepted_at', {
        ascending: false
      });
      if (error) {
        console.error('❌ Error fetching active assignments:', error);
        return;
      }
      setActiveAssignments(data || []);
    } catch (error) {
      console.error('❌ Error in fetchActiveAssignments:', error);
    }
  };
  const fetchDealerData = async () => {
    if (!userProfile?.dealer_id) return;
    try {
      const {
        data,
        error
      } = await supabase.from('dealers').select('*').eq('id', userProfile.dealer_id).single();
      if (error) throw error;
      setDealerData(data);
    } catch (error) {
      console.error('Error fetching dealer data:', error);
    }
  };
  const handleRefreshJobs = async () => {
    await fetchJobs();
    await fetchActiveAssignments();
    toast({
      title: "Jobs Refreshed",
      description: "Checking for new job updates..."
    });
  };
  const handlePhotoUpdate = (newUrl: string) => {
    if (dealerData) {
      setDealerData({
        ...dealerData,
        profile_photo_url: newUrl
      });
    }
  };
  const handleDealerProfileUpdate = (updatedData: any) => {
    setDealerData(prev => ({
      ...prev,
      ...updatedData
    }));
  };
  if (loading) {
    return <div className="min-h-screen relative bg-black" style={{
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
      </div>;
  }
  const openJobs = jobs.filter(job => job.status === 'open').length;
  const completedJobs = jobs.filter(job => job.status === 'completed').length;
  return <>
      <title>Dealer Dashboard | SwapRunn</title>
      <meta name="description" content="Manage your vehicle deliveries and track driver requests from your SwapRunn dealer dashboard." />
      <link rel="canonical" href="/dealer/dashboard" />
      
      <div className="min-h-screen relative bg-black" style={{
      backgroundImage: `url(${mapBackgroundImage})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center top',
      backgroundRepeat: 'no-repeat',
      backgroundAttachment: 'fixed'
    }}>
        <div className="absolute inset-0 bg-gradient-to-b from-black/75 via-black/65 to-black/40 z-0"></div>
        
        <div className="relative z-10 container mx-auto px-6 py-24">
          <div className="space-y-8">
            {/* Page Header */}
            <div className="text-center lg:text-left flex items-center justify-between">
              <div>
                <h1 className="text-5xl font-display font-black tracking-tight text-white mb-4">Dealer Portal</h1>
                <p className="text-xl text-white/80 font-light">Manage your deliveries and track driver assignments</p>
              </div>
            </div>

            {/* Horizontal Navigation Tabs */}
            <Tabs defaultValue="profile" className="w-full">
              <TabsList className="w-full grid grid-cols-4 bg-[#1A1A1A]/80 backdrop-blur-sm border border-white/20 rounded-2xl h-auto p-2 gap-2 shadow-lg">
                <TabsTrigger value="profile" className="data-[state=active]:bg-[#E11900] data-[state=active]:text-white data-[state=active]:shadow-lg text-white/70 rounded-xl font-bold text-sm transition-all duration-300 hover:text-white hover:bg-white/10 py-3 border-0">
                  Profile
                </TabsTrigger>
                <TabsTrigger value="pending" className="data-[state=active]:bg-[#E11900] data-[state=active]:text-white data-[state=active]:shadow-lg text-white/70 rounded-xl font-bold text-sm transition-all duration-300 hover:text-white hover:bg-white/10 py-3 border-0 relative">
                  Pending
                  {openJobs > 0 && <span className="absolute -top-1 -right-1 bg-[#E11900] text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center shadow-lg">
                      {openJobs}
                    </span>}
                </TabsTrigger>
                <TabsTrigger value="assigned" className="data-[state=active]:bg-[#E11900] data-[state=active]:text-white data-[state=active]:shadow-lg text-white/70 rounded-xl font-bold text-sm transition-all duration-300 hover:text-white hover:bg-white/10 py-3 border-0 relative" onClick={() => setNewAssignmentsCount(0)}>
                  Assigned
                  {newAssignmentsCount > 0 && <span className="absolute -top-1 -right-1 bg-green-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center shadow-lg animate-pulse">
                      {newAssignmentsCount}
                    </span>}
                </TabsTrigger>
                <TabsTrigger value="done" className="data-[state=active]:bg-[#E11900] data-[state=active]:text-white data-[state=active]:shadow-lg text-white/70 rounded-xl font-bold text-sm transition-all duration-300 hover:text-white hover:bg-white/10 py-3 border-0">
                  Done
                </TabsTrigger>
              </TabsList>

              {/* Profile Tab */}
              <TabsContent value="profile" className="mt-2 space-y-6 animate-fade-in">
                <Card className="bg-white/10 backdrop-blur-sm border-white/20 shadow-lg rounded-2xl">
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row items-center md:items-start gap-8 md:gap-12">
                      <div className="flex-shrink-0">
                        <DealerProfilePhoto photoUrl={dealerData?.profile_photo_url} dealerName={dealerData?.name} onPhotoUpdate={handlePhotoUpdate} />
                      </div>
                      <div className="flex-1 w-full min-w-0 text-center md:text-left">
                        <div className="flex flex-col md:flex-row items-center md:items-center gap-3 mb-8">
                          <Star className="h-7 w-7 text-yellow-400 fill-current flex-shrink-0" />
                          <div className="flex flex-col">
                            <h1 className="text-3xl md:text-4xl font-bold text-white">{dealerData?.name}</h1>
                            {dealerData?.store ? (
                              <span className="text-sm text-white/70 mt-1">
                                {dealerData.store}
                              </span>
                            ) : (
                              <button
                                onClick={() => setIsEditProfileOpen(true)}
                                className="text-sm text-white/50 hover:text-[#E11900] mt-1 underline"
                              >
                                Add your dealership
                              </button>
                            )}
                            {dealerData?.position && <span className="text-lg md:text-xl text-white/90 font-medium mt-2">
                                {dealerData.position}
                              </span>}
                          </div>
                        </div>
                        <div className="space-y-4 mb-8">
                          <div className="flex items-center justify-center md:justify-start gap-3 text-white/90">
                            <Mail className="h-5 w-5 text-white/60 flex-shrink-0" />
                            <span className="text-base break-all md:truncate">
                              {dealerData?.email || user?.email}
                            </span>
                          </div>
                          <div className="flex items-center justify-center md:justify-start gap-3 text-white/90">
                            <Calendar className="h-5 w-5 text-white/60 flex-shrink-0" />
                            <span className="text-base">
                              Member since {new Date(dealerData?.created_at || '').toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                          <Link to="/dealer/request-simple" className="w-full sm:w-auto">
                            <Button className="w-full sm:w-auto bg-[#E11900] hover:bg-[#E11900]/90 text-white h-12 px-8 rounded-2xl text-base font-semibold shadow-lg hover:shadow-xl transition-all">
                              <Plus className="h-5 w-5 mr-2" />
                              Request Driver
                            </Button>
                          </Link>
                          <Button onClick={() => setIsEditProfileOpen(true)} variant="outline" className="w-full sm:w-auto h-12 px-8 rounded-2xl border-white/40 text-slate-950 bg-white hover:bg-white/90 text-base font-semibold shadow-lg hover:shadow-xl transition-all">
                            Edit Personal Info
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                
                
                <JobStatsCard openJobs={openJobs} assignedJobs={activeAssignments.length} completedJobs={completedJobs} totalUnread={0} />
              </TabsContent>

              {/* Pending Tab */}
              <TabsContent value="pending" className="mt-2 space-y-6 animate-fade-in">
                <h3 className="text-3xl font-bold text-white mb-2">Pending Drives</h3>
                
                {openJobs > 0 ? <div className="grid gap-4">
                    {jobs.filter(job => job.status === 'open').map(job => <JobCard key={job.id} job={job} onCancel={fetchJobs} />)}
                  </div> : <Card className="bg-white/5 backdrop-blur-sm border-white/10 shadow-lg rounded-2xl">
                    <CardContent className="p-12 text-center">
                      <Truck className="h-20 w-20 text-white/30 mx-auto mb-6" />
                      <h4 className="text-2xl font-semibold text-white mb-3">No Pending Drives</h4>
                      <p className="text-white/60 text-lg">Create a new delivery request to get started.</p>
                    </CardContent>
                  </Card>}
              </TabsContent>

              {/* Assigned Tab */}
              <TabsContent value="assigned" className="mt-2 space-y-6 animate-fade-in">
                <h3 className="text-3xl font-bold text-white mb-2 px-[16px]">Active Assignments</h3>
                
                {activeAssignments.length > 0 ? <div className="space-y-6">
                    {activeAssignments.map(assignment => <AssignmentCard key={assignment.id} assignment={assignment} currentUserId={userProfile?.user_id || ''} />)}
                  </div> : <Card className="bg-white/5 backdrop-blur-sm border-white/10 shadow-lg rounded-2xl">
                    <CardContent className="p-12 text-center">
                      <User className="h-20 w-20 text-white/30 mx-auto mb-6" />
                      <h4 className="text-2xl font-semibold text-white mb-3">No Assigned Jobs</h4>
                      <p className="text-white/60 text-lg">No drivers are currently assigned to jobs.</p>
                    </CardContent>
                  </Card>}
              </TabsContent>

              {/* Done Tab */}
              <TabsContent value="done" className="mt-2 space-y-6 animate-fade-in">
                <h3 className="text-3xl font-bold text-white mb-2">Complete</h3>
                
                {completedJobs > 0 ? <div className="grid gap-4">
                    {jobs.filter(job => job.status === 'completed').map(job => <JobCard key={job.id} job={job} />)}
                  </div> : <Card className="bg-white/5 backdrop-blur-sm border-white/10 shadow-lg rounded-2xl">
                    <CardContent className="p-12 text-center">
                      <Clock className="h-20 w-20 text-white/30 mx-auto mb-6" />
                      <h4 className="text-2xl font-semibold text-white mb-3">No Completed Jobs</h4>
                      <p className="text-white/60 text-lg">Your completed jobs will appear here.</p>
                    </CardContent>
                  </Card>}
              </TabsContent>
            </Tabs>
          </div>
        </div>
        
        {/* Footer */}
        <footer className="relative z-10 py-12 border-t border-white/10">
          <div className="container mx-auto px-6">
            <div className="flex flex-col md:flex-row justify-between items-center gap-6">
              <div className="flex items-center gap-4">
                <img src="/swaprunn-logo-2025.png?v=20251001" alt="SwapRunn" className="h-8 w-auto" />
                <span className="text-white/70">© SwapRunn</span>
              </div>
              
              <div className="flex gap-6">
                <Link to="/privacy" className="text-white/70 hover:text-white transition-colors">
                  Privacy
                </Link>
                <Link to="/terms" className="text-white/70 hover:text-white transition-colors">
                  Terms
                </Link>
                <Link to="/about" className="text-white/70 hover:text-white transition-colors">
                  Contact
                </Link>
              </div>
            </div>
          </div>
        </footer>
      </div>
      
      {/* Edit Profile Modal */}
      {dealerData && <EditDealerProfile isOpen={isEditProfileOpen} onClose={() => setIsEditProfileOpen(false)} dealerData={dealerData} onUpdate={handleDealerProfileUpdate} />}
    </>;
};
export default DealerDashboard;