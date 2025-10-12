import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import SiteHeader from "@/components/SiteHeader";
import { DriverProfile } from "@/components/driver/DriverProfile";
import { useDriverNotifications } from "@/hooks/useDriverNotifications";
import { supabaseService } from "@/services/supabaseService";
import { toast } from "@/hooks/use-toast";
import mapBackgroundImage from "@/assets/map-background.jpg";
import { Jobs } from "@/components/driver/Jobs";
import { JobData } from "@/services/driver-data";

const DriverDashboard = () => {
  const [acceptedJobs, setAcceptedJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [driverData, setDriverData] = useState<any>(null);
  const [jobsData, setJobsData] = useState<JobData[]>([]);
  const { user, userProfile, signOut } = useAuth();
  const { newJobsCount, showAlert, latestJob, clearAlert, markJobsSeen } = useDriverNotifications();
  const navigate = useNavigate();

  useEffect(() => {
    if (userProfile?.user_type === 'driver') {
      fetchAcceptedJobs();
      fetchDriverData();
    }
  }, [userProfile]);

  const fetchDriverData = async () => {
    if (!userProfile?.driver_id) return;
    
    try {
      const { data, error } = await supabase
        .from('drivers')
        .select('*')
        .eq('id', userProfile.driver_id)
        .single();

      if (error) throw error;
      setDriverData(data);
    } catch (error) {
      console.error('Error fetching driver data:', error);
    }
  };

  const fetchAcceptedJobs = async () => {
    if (!userProfile?.driver_id) return;
    
    try {
      const { data, error } = await supabase
        .from('assignments')
        .select(`
          *,
          jobs(*)
        `)
        .eq('driver_id', userProfile.driver_id)
        .order('accepted_at', { ascending: false });

      if (error) throw error;
      setAcceptedJobs(data || []);
      
      // Transform data for Jobs component
      const transformedJobs: JobData[] = data?.map((assignment) => ({
        id: assignment.jobs?.id || '',
        assignmentId: assignment.id,
        pickup: assignment.jobs?.pickup_address || 'N/A',
        dropoff: assignment.jobs?.delivery_address || 'N/A',
        distanceMi: (assignment.jobs?.distance_miles || 0) * 2,
        pay: Math.round(((assignment.jobs?.distance_miles || 0) * 2) / 35 * 20),
        status: assignment.jobs?.status === 'completed' ? 'Completed' : 'Upcoming',
        startedAt: assignment.accepted_at,
        type: 'Vehicle Delivery',
        customerName: assignment.jobs?.customer_name || 'N/A',
        pickupLocation: assignment.jobs?.pickup_address || 'N/A',
        dropoffLocation: assignment.jobs?.delivery_address || 'N/A',
        date: new Date(assignment.accepted_at).toLocaleDateString(),
        // Vehicle details
        vehicleMake: assignment.jobs?.make || undefined,
        vehicleModel: assignment.jobs?.model || undefined,
        vehicleYear: assignment.jobs?.year || undefined,
        vin: assignment.jobs?.vin || undefined,
        jobType: assignment.jobs?.type || 'delivery'
      })) || [];
      
      setJobsData(transformedJobs);
    } catch (error) {
      console.error('Error fetching accepted jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <>
      <title>Driver Dashboard | SwapRunn</title>
      <meta name="description" content="Manage your delivery jobs, track earnings, and view upcoming drives from your SwapRunn driver dashboard." />
      <link rel="canonical" href="/driver/dashboard" />
      
      <style dangerouslySetInnerHTML={{
        __html: `
          /* Force dark header on driver dashboard */
          .sr-header{
            background:rgba(0,0,0,.3) !important; 
            backdrop-filter:blur(6px) saturate(120%) !important; 
            border-bottom:1px solid rgba(255,255,255,.08) !important;
          }
          
          /* Dark theme dashboard styles */
          .dashboard-container{
            max-width:840px; margin:28px auto 40px; padding:0 16px;
          }
          .glass-card{
            background:rgba(255,255,255,.06); border:1px solid rgba(255,255,255,.14); 
            border-radius:16px; padding:24px; color:#fff; 
            box-shadow:0 8px 24px rgba(0,0,0,.25); backdrop-filter:blur(10px);
            margin-bottom:24px;
          }
          .action-grid{
            display:grid; grid-template-columns:1fr 1fr; gap:16px; margin-bottom:24px;
          }
          .action-btn{
            padding:12px 24px; border-radius:12px; font-weight:600; 
            transition:all 0.2s ease; text-align:center; text-decoration:none;
          }
          .action-btn-primary{
            background:#DC2626; color:#fff; border:none;
          }
          .action-btn-primary:hover{
            background:#b91c1c; transform:translateY(-2px);
          }
          .action-btn-secondary{
            background:rgba(255,255,255,.1); color:#fff; border:1px solid rgba(255,255,255,.2);
          }
          .action-btn-secondary:hover{
            background:rgba(255,255,255,.15); transform:translateY(-2px);
          }
          .job-card{
            background:rgba(255,255,255,.04); border:1px solid rgba(255,255,255,.1);
            border-radius:12px; padding:16px; margin-bottom:12px;
            backdrop-filter:blur(5px);
          }
          .job-title{
            color:#fff; font-weight:600; margin-bottom:8px;
          }
          .job-detail{
            color:rgba(255,255,255,.8); font-size:14px; margin-bottom:4px;
          }
          .job-meta{
            color:rgba(255,255,255,.6); font-size:12px;
          }
          .status-badge{
            padding:4px 8px; border-radius:999px; font-size:12px; font-weight:600;
            background:rgba(59,130,246,.2); color:#3b82f6; border:1px solid rgba(59,130,246,.3);
          }
          .earnings-display{
            text-align:center; margin-bottom:16px;
          }
          .earnings-amount{
            font-size:3rem; font-weight:900; color:#DC2626; margin-bottom:8px;
          }
          .earnings-meta{
            color:rgba(255,255,255,.8); margin-bottom:4px;
          }
          .earnings-avg{
            color:rgba(255,255,255,.6); font-size:14px;
          }
          .drive-item{
            background:rgba(255,255,255,.04); border:1px solid rgba(255,255,255,.1);
            border-radius:12px; padding:16px; margin-bottom:12px;
            backdrop-filter:blur(5px);
          }
          .drive-header{
            display:flex; justify-content:between; align-items:center; margin-bottom:8px;
          }
          .drive-status{
            display:flex; align-items:center; color:rgba(255,255,255,.7);
          }
          .drive-check{
            color:#22c55e; margin-right:8px;
          }
          .drive-earnings{
            font-size:18px; font-weight:700; color:#DC2626;
          }
          .drive-route{
            color:#fff; font-weight:500;
          }
        `
      }} />

      <div className="min-h-screen" style={{
        backgroundImage: `url(${mapBackgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}>
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/38 to-black/65"></div>
        
        {/* Header */}
        <SiteHeader />

        <div className="relative z-10">
          <div className="dashboard-container">
            <h1 className="text-2xl font-bold text-white mb-6 text-center">Driver Dashboard</h1>
            
            {/* Driver Profile Section */}
            <DriverProfile />
            
            {/* New Job Alert */}
            {showAlert && latestJob && (
              <div className="glass-card" style={{ background: 'rgba(220, 38, 38, 0.15)', border: '1px solid rgba(220, 38, 38, 0.3)' }}>
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-white font-semibold mb-1">🚗 New Drive Request!</h3>
                    <p className="text-white/90 text-sm">
                      {latestJob.year} {latestJob.make} {latestJob.model} - {latestJob.distance_miles || 0} miles
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={async () => {
                        if (!userProfile?.driver_id || !latestJob) return;
                        
                        try {
                          const result = await supabaseService.acceptJob(latestJob.id, userProfile.driver_id);
                          if (result) {
                            toast({
                              title: "Drive confirmed. Check your dashboard.",
                              variant: "default",
                            });
                            clearAlert();
                            fetchAcceptedJobs(); // Refresh the jobs list
                          }
                        } catch (error: any) {
                          console.error('Error accepting job:', error);
                          if (error?.code === '23505' || error?.message?.includes('duplicate key')) {
                            toast({
                              title: "Job already taken",
                              description: "Another driver has already accepted this job.",
                              variant: "destructive",
                            });
                          } else {
                            toast({
                              title: "Failed to accept job",
                              description: "Please try again.",
                              variant: "destructive",
                            });
                          }
                          clearAlert();
                        }
                      }}
                      className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition"
                    >
                      Accept
                    </button>
                    <Link 
                      to="/driver/requests" 
                      className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition"
                      onClick={clearAlert}
                    >
                      View
                    </Link>
                    <button 
                      onClick={clearAlert}
                      className="text-white/70 hover:text-white text-xl leading-none"
                    >
                      ×
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Quick Actions */}
            <div className="action-grid">
              <Link 
                to="/driver/requests" 
                className="action-btn action-btn-primary relative"
                onClick={markJobsSeen}
              >
                View Requests
                {newJobsCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-[#E11900] text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
                    {newJobsCount > 9 ? '9+' : newJobsCount}
                  </span>
                )}
              </Link>
              <button className="action-btn action-btn-secondary">
                Update Status
              </button>
            </div>

            {/* Jobs with Chat */}
            <div className="glass-card">
              <h2 className="text-lg font-semibold text-white mb-4">
                My Jobs
              </h2>
              <Jobs jobs={jobsData} isLoading={loading} />
            </div>

            {/* Earnings Snapshot Section */}
            <div className="glass-card">
              <h3 className="text-lg font-semibold text-white mb-4 text-center">
                Earnings This Week
              </h3>
              
              <div className="earnings-display">
                <div className="earnings-amount">$412</div>
                <div className="earnings-meta">6 drives completed</div>
                <div className="earnings-avg">Average per drive: $68.67</div>
              </div>
            </div>

            {/* Recent Drives Section */}
            <div className="glass-card">
              <h3 className="text-lg font-semibold text-white mb-4 text-center">
                Recent Drives
              </h3>
              
              <div className="space-y-4">
                {/* Drive 1 */}
                <div className="drive-item">
                  <div className="drive-header">
                    <div className="drive-status">
                      <span className="drive-check">✅</span>
                      <span>Yesterday</span>
                    </div>
                    <span className="drive-earnings">$85</span>
                  </div>
                  <div className="drive-route">
                    Boston Dealership → Newton, MA
                  </div>
                </div>

                {/* Drive 2 */}
                <div className="drive-item">
                  <div className="drive-header">
                    <div className="drive-status">
                      <span className="drive-check">✅</span>
                      <span>Tuesday</span>
                    </div>
                    <span className="drive-earnings">$72</span>
                  </div>
                  <div className="drive-route">
                    Cambridge Auto → Somerville, MA
                  </div>
                </div>

                {/* Drive 3 */}
                <div className="drive-item">
                  <div className="drive-header">
                    <div className="drive-status">
                      <span className="drive-check">✅</span>
                      <span>Monday</span>
                    </div>
                    <span className="drive-earnings">$65</span>
                  </div>
                  <div className="drive-route">
                    Watertown Motors → Brookline, MA
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </>
  );
};

export default DriverDashboard;