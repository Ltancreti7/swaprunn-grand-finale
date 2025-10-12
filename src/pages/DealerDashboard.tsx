import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Truck, Calendar, MapPin, User, Star, Eye, Phone, Mail } from "lucide-react";
import DealerProfile from "@/components/dealer/DealerProfile";
import SiteHeader from "@/components/SiteHeader";
import { ChatButton } from "@/components/chat/ChatButton";
import mapBackgroundImage from "@/assets/map-background.jpg";

const DealerDashboard = () => {
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { user, userProfile, signOut } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (userProfile?.user_type === 'dealer') {
      fetchJobs();
    }
  }, [userProfile]);

  // Enhanced real-time subscription with error recovery
  useEffect(() => {
    if (!userProfile?.dealer_id) return;

    const channel = supabase
      .channel(`dealer-jobs-${userProfile.dealer_id}-${Date.now()}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'jobs',
          filter: `dealer_id=eq.${userProfile.dealer_id}`
        },
        (payload) => {
          console.log('Job updated:', payload);
          fetchJobs();
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'assignments'
        },
        (payload) => {
          console.log('New assignment:', payload);
          fetchJobs();
        }
      )
      .on('system', {}, (payload) => {
        if (payload.status === 'error') {
          console.error('Realtime error:', payload);
        }
      })
      .subscribe((status) => {
        console.log('Subscription status:', status);
        if (status === 'CHANNEL_ERROR') {
          // Attempt to reconnect after a delay
          setTimeout(() => {
            fetchJobs();
          }, 2000);
        }
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userProfile?.dealer_id]);

  const fetchJobs = async () => {
    if (!userProfile?.dealer_id) return;
    
    try {
      const { data, error } = await supabase
        .from('jobs')
        .select(`
          *,
          assignments(*, drivers(name, email, phone, rating_avg, rating_count, available))
        `)
        .eq('dealer_id', userProfile.dealer_id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setJobs(data || []);
    } catch (error) {
      console.error('Error fetching jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const PendingDeliveryCard = ({ job }: { job: any }) => {
    const driver = job.assignments?.[0]?.drivers;
    const assignment = job.assignments?.[0];
    const isAccepted = !!assignment?.accepted_at;

    return (
      <div className={`bg-white/5 border rounded-lg p-4 hover:bg-white/10 transition-colors ${
        isAccepted 
          ? 'border-green-400/30' 
          : 'border-white/10'
      }`}>
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="text-white font-medium">
                {job.year} {job.make} {job.model} {job.customer_name && `- ${job.customer_name}`}
              </h3>
              <Badge className={
                isAccepted 
                  ? 'bg-green-500/20 text-green-300 border-green-500/30'
                  : 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30'
              }>
                {isAccepted ? '✅ Accepted' : '⏳ Waiting for acceptance'}
              </Badge>
            </div>
            <div className="flex items-center text-sm text-white/60 gap-4 mb-3">
              <span className="flex items-center">
                <MapPin className="w-3 h-3 mr-1" />
                {job.distance_miles}mi
              </span>
              <span className="flex items-center">
                <Calendar className="w-3 h-3 mr-1" />
                {new Date(job.created_at).toLocaleDateString()}
              </span>
            </div>
            {driver && (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-blue-300" />
                  <span className="text-white font-medium">{driver.name}</span>
                  <div className="flex items-center gap-1">
                    <Star className="w-3 h-3 text-yellow-400 fill-current" />
                    <span className="text-yellow-400 text-sm">
                      {driver.rating_avg ? driver.rating_avg.toFixed(1) : '5.0'}
                    </span>
                    <span className="text-white/40 text-xs">
                      ({driver.rating_count || 0})
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {assignment && (
                    <ChatButton
                      jobId={job.id}
                      assignmentId={assignment.id}
                      currentUserType="dealer"
                      currentUserId={userProfile?.user_id || ''}
                      size="sm"
                    />
                  )}
                  <Sheet>
                    <SheetTrigger asChild>
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        View Driver
                      </Button>
                    </SheetTrigger>
                    <SheetContent className="bg-background border-border">
                      <SheetHeader>
                        <SheetTitle>Driver Details</SheetTitle>
                      </SheetHeader>
                      <div className="space-y-6 mt-6">
                        <div className="text-center">
                          <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                            <User className="w-10 h-10 text-primary" />
                          </div>
                          <h3 className="text-lg font-semibold">{driver.name}</h3>
                          <div className="flex items-center justify-center gap-1 mt-1">
                            <Star className="w-4 h-4 text-yellow-400 fill-current" />
                            <span className="font-medium">
                              {driver.rating_avg ? driver.rating_avg.toFixed(1) : '5.0'}
                            </span>
                            <span className="text-muted-foreground text-sm">
                              ({driver.rating_count || 0} reviews)
                            </span>
                          </div>
                          <Badge 
                            variant={driver.available ? "default" : "secondary"}
                            className="mt-2"
                          >
                            {driver.available ? "Available" : "Busy"}
                          </Badge>
                        </div>
                        
                        <div>
                          <h4 className="font-semibold mb-3">Contact Information</h4>
                          <div className="space-y-2">
                            {driver.email && (
                              <div className="flex items-center gap-2">
                                <Mail className="w-4 h-4 text-muted-foreground" />
                                <span className="text-sm">{driver.email}</span>
                              </div>
                            )}
                            {driver.phone && (
                              <div className="flex items-center gap-2">
                                <Phone className="w-4 h-4 text-muted-foreground" />
                                <span className="text-sm">{driver.phone}</span>
                              </div>
                            )}
                          </div>
                        </div>

                        <div>
                          <h4 className="font-semibold mb-3">Assignment Details</h4>
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Job:</span>
                              <span>{job.year} {job.make} {job.model}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Distance:</span>
                              <span>{job.distance_miles} miles</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Assigned:</span>
                              <span>{assignment?.accepted_at ? new Date(assignment.accepted_at).toLocaleDateString() : 'Recently'}</span>
                            </div>
                            {job.pickup_address && (
                              <div>
                                <span className="text-muted-foreground">Pickup:</span>
                                <p className="text-sm mt-1">{job.pickup_address}</p>
                              </div>
                            )}
                            {job.delivery_address && (
                              <div>
                                <span className="text-muted-foreground">Delivery:</span>
                                <p className="text-sm mt-1">{job.delivery_address}</p>
                              </div>
                            )}
                          </div>
                        </div>

                        {assignment && (
                          <div>
                            <h4 className="font-semibold mb-3">Communication</h4>
                            <ChatButton
                              jobId={job.id}
                              assignmentId={assignment.id}
                              currentUserType="dealer"
                              currentUserId={userProfile?.user_id || ''}
                              size="default"
                            />
                          </div>
                        )}
                      </div>
                    </SheetContent>
                  </Sheet>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <title>Dealer Dashboard | SwapRunn</title>
      <meta name="description" content="Manage your vehicle deliveries and track driver requests from your SwapRunn dealer dashboard." />
      <link rel="canonical" href="/dealer/dashboard" />
      

      <div className="min-h-screen" style={{
        backgroundImage: `url(${mapBackgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}>
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/38 to-black/65"></div>
        
        {/* Site Header */}
        <SiteHeader />

        <div className="relative z-10">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Welcome Header */}
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-white mb-2">
                Welcome back, {userProfile?.dealers?.name || 'Dealer'}!
              </h1>
              <p className="text-white/70">
                Manage your vehicle deliveries
              </p>
            </div>

            {/* Quick Action */}
            <div className="mb-8">
              <Link to="/dealer/request">
                <Button 
                  size="lg" 
                  className="w-full bg-[#E11900] hover:bg-[#E11900]/90 text-white font-semibold py-6 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  <Truck className="w-5 h-5 mr-2" />
                  Request Driver
                </Button>
              </Link>
            </div>

            {/* Pending Deliveries - Moved to Top for Urgency */}
            {jobs.some(job => job.status === 'assigned') && (() => {
              const assignedJobs = jobs.filter(job => job.status === 'assigned');
              const acceptedJobs = assignedJobs.filter(job => job.assignments?.[0]?.accepted_at);
              const allAccepted = assignedJobs.length > 0 && acceptedJobs.length === assignedJobs.length;
              
              return (
                <Card className={`bg-white/10 backdrop-blur-sm border-white/20 mb-6 shadow-lg ${
                  allAccepted 
                    ? 'border-l-4 border-l-green-400' 
                    : acceptedJobs.length > 0 
                    ? 'border-l-4 border-l-yellow-400' 
                    : 'border-l-4 border-l-destructive'
                }`}>
                  <CardHeader>
                    <CardTitle className={`text-white flex items-center ${!allAccepted ? 'animate-pulse' : ''}`}>
                      <Truck className={`w-5 h-5 mr-2 ${
                        allAccepted 
                          ? 'text-green-400' 
                          : acceptedJobs.length > 0 
                          ? 'text-yellow-400' 
                          : 'text-destructive'
                      }`} />
                      {allAccepted 
                        ? '✅ All Drivers Assigned' 
                        : acceptedJobs.length > 0 
                        ? `⏳ ${acceptedJobs.length} of ${assignedJobs.length} drivers responded`
                        : '🚨 Pending Deliveries'
                      }
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {jobs.filter(job => job.status === 'assigned').map((job) => (
                        <PendingDeliveryCard key={job.id} job={job} />
                      ))}
                    </div>
                  </CardContent>
                </Card>
              );
            })()}

            {/* Dealer Profile Section */}
            <DealerProfile />

            {/* Dashboard Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {/* Active Jobs Count */}
              <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium flex items-center">
                    <Truck className="w-4 h-4 mr-2" />
                    Active Jobs
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {jobs.filter(job => job.status !== 'completed').length}
                  </div>
                </CardContent>
              </Card>

              {/* Recent Completions */}
              <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium flex items-center">
                    <Calendar className="w-4 h-4 mr-2" />
                    This Month
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {jobs.filter(job => {
                      const jobDate = new Date(job.created_at);
                      const now = new Date();
                      return jobDate.getMonth() === now.getMonth() && 
                             jobDate.getFullYear() === now.getFullYear();
                    }).length}
                  </div>
                </CardContent>
              </Card>

              {/* Profile Management */}
              <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium flex items-center">
                    <User className="w-4 h-4 mr-2" />
                    Account
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-sm space-y-1">
                    <div className="truncate font-medium">{userProfile?.dealers?.name}</div>
                    <div className="text-white/60 text-xs truncate">{user?.email}</div>
                  </div>
                  <Button 
                    onClick={handleSignOut} 
                    variant="ghost" 
                    size="sm"
                    className="text-red-300 hover:text-red-200 hover:bg-red-500/10 mt-3 p-0 h-auto text-xs"
                  >
                    Sign Out
                  </Button>
                </CardContent>
              </Card>
            </div>


            {/* Recent Jobs */}
            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Truck className="w-5 h-5 mr-2" />
                  Recent Jobs
                </CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="text-center py-8 text-white/70">Loading jobs...</div>
                ) : jobs.length === 0 ? (
                  <div className="text-center py-8 text-white/70">
                    No jobs yet. Click "Request Driver" to get started!
                  </div>
                ) : (
                  <div className="space-y-3">
                    {jobs.filter(job => job.status !== 'assigned').slice(0, 5).map((job) => (
                      <div key={job.id} className="bg-white/5 border border-white/10 rounded-lg p-4 hover:bg-white/10 transition-colors">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="text-white font-medium">
                                {job.year} {job.make} {job.model} {job.customer_name && `- ${job.customer_name}`}
                              </h3>
                              <Badge variant={
                                job.status === 'completed' ? 'default' : 
                                job.status === 'in_progress' ? 'secondary' : 
                                'outline'
                              }>
                                {job.status === 'completed' ? 'Completed' :
                                 job.status === 'in_progress' ? 'In Progress' :
                                 'Open'}
                              </Badge>
                            </div>
                            <div className="flex items-center text-sm text-white/60 gap-4 mb-2">
                              <span className="flex items-center">
                                <MapPin className="w-3 h-3 mr-1" />
                                {job.distance_miles}mi
                              </span>
                              <span className="flex items-center">
                                <Calendar className="w-3 h-3 mr-1" />
                                {new Date(job.created_at).toLocaleDateString()}
                              </span>
                            </div>
                            {job.assignments?.[0]?.drivers && (
                              <div className="flex items-center gap-2 text-sm">
                                <User className="w-3 h-3 text-blue-300" />
                                <span className="text-white/80">
                                  Driver: {job.assignments[0].drivers.name}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
};

export default DealerDashboard;