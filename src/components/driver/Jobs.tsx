import { useState } from 'react';
import { Briefcase, ArrowRight, Eye } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { ChatButton } from '@/components/chat/ChatButton';
import { useAuth } from '@/hooks/useAuth';
import type { JobData } from '@/services/driver-data';
interface JobsProps {
  jobs: JobData[];
  isLoading: boolean;
}
export function Jobs({
  jobs,
  isLoading
}: JobsProps) {
  const [selectedJob, setSelectedJob] = useState<JobData | null>(null);
  const {
    userProfile
  } = useAuth();
  const upcomingJobs = jobs.filter(job => job.status === 'Upcoming');
  const completedJobs = jobs.filter(job => job.status === 'Completed');
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount);
  };
  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleString(undefined, {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Upcoming':
        return;
      case 'Completed':
        return <Badge variant="secondary">Completed</Badge>;
      case 'Cancelled':
        return <Badge className="bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300">Cancelled</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };
  const getJobTitle = (job: JobData) => {
    const year = job.vehicleYear || '';
    const make = job.vehicleMake || '';
    const model = job.vehicleModel || '';
    const type = job.jobType === 'swap' ? 'Swap' : 'Delivery';
    if (year && make && model) {
      return `${year} ${make} ${model} ${type}`;
    } else if (make && model) {
      return `${make} ${model} ${type}`;
    } else if (job.customerName) {
      return `${type} for ${job.customerName}`;
    }
    return `Vehicle ${type}`;
  };
  const JobRow = ({
    job
  }: {
    job: JobData;
  }) => <div className="p-4 border border-white/20 rounded-lg bg-white/10 backdrop-blur-sm space-y-3">
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <div className="font-semibold text-white text-sm">{getJobTitle(job)}</div>
          <div className="text-xs text-white/70">
            {job.customerName && <span className="font-medium">Customer: {job.customerName}</span>}
            {job.vin && <span className="ml-2 font-mono">VIN: {job.vin.slice(-6)}</span>}
          </div>
          <div className="flex items-center gap-2 text-sm text-white/60">
            <span className="truncate max-w-32">{job.pickup}</span>
            <ArrowRight className="h-4 w-4 text-white/60" />
            <span className="truncate max-w-32">{job.dropoff}</span>
          </div>
        </div>
        
      </div>
      
        <div className="flex items-center justify-between">
        <div className="flex items-center gap-4 text-sm text-white/60">
          <span>{job.distanceMi} mi</span>
          <span className="font-semibold text-swaprunn-red">{formatCurrency(job.pay)}</span>
        </div>
        
        <div className="flex gap-2">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="secondary" size="sm" onClick={() => setSelectedJob(job)} className="flex items-center gap-2 bg-white/20 hover:bg-white/30 text-white border-white/30">
                <Eye className="h-4 w-4" />
                Details
              </Button>
            </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Job Details</SheetTitle>
            </SheetHeader>
            {selectedJob && <div className="space-y-6 mt-6">
                {/* Vehicle Information */}
                <div>
                  <h3 className="font-semibold text-text-primary mb-2">Vehicle Information</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-text-secondary">Vehicle:</span>
                      <span className="font-medium">{getJobTitle(selectedJob)}</span>
                    </div>
                    {selectedJob.vin && <div className="flex justify-between">
                        <span className="text-text-secondary">VIN:</span>
                        <span className="font-mono text-sm">{selectedJob.vin}</span>
                      </div>}
                    <div className="flex justify-between">
                      <span className="text-text-secondary">Job Type:</span>
                      <Badge variant="outline" className="text-xs">
                        {selectedJob.jobType === 'swap' ? 'Swap' : 'Delivery'}
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* Customer Information */}
                <div>
                  <h3 className="font-semibold text-text-primary mb-2">Customer Information</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-text-secondary">Customer:</span>
                      <span className="font-medium">{selectedJob.customerName || 'N/A'}</span>
                    </div>
                  </div>
                </div>

                {/* Job Details */}
                <div>
                  <h3 className="font-semibold text-text-primary mb-2">Job Details</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-text-secondary">Status:</span>
                      {getStatusBadge(selectedJob.status)}
                    </div>
                    <div className="flex justify-between">
                      <span className="text-text-secondary">Distance:</span>
                      <span>{selectedJob.distanceMi} miles</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-text-secondary">Pay:</span>
                      <span className="font-semibold">{formatCurrency(selectedJob.pay)}</span>
                    </div>
                    {selectedJob.date && <div className="flex justify-between">
                        <span className="text-text-secondary">Date:</span>
                        <span>{selectedJob.date}</span>
                      </div>}
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-text-primary mb-2">Addresses</h3>
                  <div className="space-y-3">
                    <div>
                      <div className="text-sm text-text-secondary mb-1">Pickup:</div>
                      <div className="text-text-primary">{selectedJob.pickup}</div>
                    </div>
                    <div>
                      <div className="text-sm text-text-secondary mb-1">Dropoff:</div>
                      <div className="text-text-primary">{selectedJob.dropoff}</div>
                    </div>
                  </div>
                </div>

                 <div>
                   <h3 className="font-semibold text-text-primary mb-2">Timeline</h3>
                   <div className="space-y-2">
                     {selectedJob.startedAt && <div className="flex justify-between">
                         <span className="text-text-secondary">Started:</span>
                         <span>{formatDate(selectedJob.startedAt)}</span>
                       </div>}
                     {selectedJob.completedAt && <div className="flex justify-between">
                         <span className="text-text-secondary">Completed:</span>
                         <span>{formatDate(selectedJob.completedAt)}</span>
                       </div>}
                   </div>
                 </div>

                  {selectedJob.status === 'Upcoming' && selectedJob.assignmentId && userProfile?.driver_id && <div className="pt-4 border-t">
                      <ChatButton jobId={selectedJob.id} assignmentId={selectedJob.assignmentId} currentUserType="driver" currentUserId={userProfile.driver_id} size="default" />
                    </div>}
               </div>}
           </SheetContent>
         </Sheet>
         
          {job.status === 'Upcoming' && job.assignmentId && userProfile?.driver_id && <ChatButton jobId={job.id} assignmentId={job.assignmentId} currentUserType="driver" currentUserId={userProfile.driver_id} size="sm" />}
        </div>
      </div>
    </div>;
  const EmptyState = ({
    message
  }: {
    message: string;
  }) => <div className="text-center py-8 text-white/60">
      <Briefcase className="h-12 w-12 mx-auto mb-3 text-white/30" />
      <p>{message}</p>
    </div>;
  if (isLoading) {
    return <div className="space-y-4">
        <h2 className="flex items-center gap-2 text-lg font-semibold text-white">
          <Briefcase className="h-5 w-5" />
          Upcoming / Recent Jobs
        </h2>
        <div className="space-y-4">
          {Array.from({
          length: 3
        }).map((_, i) => <div key={i} className="h-20 w-full bg-white/10 backdrop-blur-sm rounded-lg animate-pulse" />)}
        </div>
      </div>;
  }
  return <div className="space-y-4">
      <h2 className="flex items-center gap-2 text-lg font-semibold text-white">
        <Briefcase className="h-5 w-5" />
        Upcoming / Recent Jobs
      </h2>
      <Tabs defaultValue="upcoming" className="w-full">
        <TabsList className="grid w-full grid-cols-2 bg-white/10 backdrop-blur-sm border border-white/20">
          <TabsTrigger value="upcoming" className="data-[state=active]:bg-white/20 data-[state=active]:text-white text-white/70">
            Upcoming ({upcomingJobs.length})
          </TabsTrigger>
          <TabsTrigger value="completed" className="data-[state=active]:bg-white/20 data-[state=active]:text-white text-white/70">
            Completed ({completedJobs.length})
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="upcoming" className="space-y-4 mt-4">
          {upcomingJobs.length === 0 ? <EmptyState message="No upcoming jobs. New assignments will appear here." /> : upcomingJobs.map(job => <JobRow key={job.id} job={job} />)}
        </TabsContent>
        
        <TabsContent value="completed" className="space-y-4 mt-4">
          {completedJobs.length === 0 ? <EmptyState message="No completed jobs yet." /> : completedJobs.map(job => <JobRow key={job.id} job={job} />)}
        </TabsContent>
      </Tabs>
    </div>;
}