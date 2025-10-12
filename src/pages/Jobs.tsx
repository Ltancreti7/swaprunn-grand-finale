import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Plus, Truck, Package, Clock, CheckCircle, ExternalLink } from "lucide-react";
import { supabaseService, Job } from "@/services/supabaseService";
import { subscriptionService, SubscriptionLimits } from "@/services/subscriptionService";
import SiteHeader from "@/components/SiteHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { AddressInput, addressToString, AddressData } from "@/components/ui/address-input";
import { useToast } from "@/hooks/use-toast";
import mapBackgroundImage from "@/assets/map-background.jpg";

const Jobs = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [subscriptionLimits, setSubscriptionLimits] = useState<SubscriptionLimits | null>(null);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    type: '' as 'delivery' | 'swap',
    vin: '',
    year: '',
    make: '',
    model: '',
    customerName: '',
    customerPhone: '',
    pickup: { street: '', city: '', state: '', zip: '' },
    delivery: { street: '', city: '', state: '', zip: '' },
    notes: '',
  });

  useEffect(() => {
    loadJobs();
    checkSubscriptionLimits();
  }, []);

  const checkSubscriptionLimits = async () => {
    try {
      const limits = await subscriptionService.checkSubscriptionLimits('demo-dealer-id');
      setSubscriptionLimits(limits);
    } catch (error) {
      console.error('Error checking subscription limits:', error);
    }
  };

  const loadJobs = async () => {
    try {
      const jobList = await supabaseService.listJobs();
      setJobs(jobList);
    } catch (error) {
      console.error('Error loading jobs:', error);
      toast({
        title: "Error",
        description: "Failed to load jobs.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateJob = async () => {
    // Check subscription limits first
    if (subscriptionLimits && !subscriptionLimits.canCreateJob) {
      toast({
        title: "Subscription Limit Reached",
        description: `You've reached your ${subscriptionLimits.planName} plan limit of ${subscriptionLimits.monthlyLimit} jobs per month. Please upgrade to continue.`,
        variant: "destructive",
      });
      return;
    }

    if (!formData.type || !formData.customerName || !formData.customerPhone || 
        !formData.pickup.street || !formData.delivery.street) {
      toast({
        title: "Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    try {
      await supabaseService.createJob({
        type: formData.type,
        vin: formData.vin,
        year: formData.year ? parseInt(formData.year) : undefined,
        make: formData.make,
        model: formData.model,
        customer_name: formData.customerName,
        customer_phone: formData.customerPhone,
        pickup_address: addressToString(formData.pickup),
        delivery_address: addressToString(formData.delivery),
        notes: formData.notes,
      });

      // Increment usage counter
      await subscriptionService.incrementUsage('demo-dealer-id');
      
      await loadJobs();
      await checkSubscriptionLimits(); // Refresh limits
      setIsCreateDialogOpen(false);
      setFormData({
        type: '' as 'delivery' | 'swap',
        vin: '',
        year: '',
        make: '',
        model: '',
        customerName: '',
        customerPhone: '',
        pickup: { street: '', city: '', state: '', zip: '' },
        delivery: { street: '', city: '', state: '', zip: '' },
        notes: '',
      });

      toast({
        title: "Job Created",
        description: `${formData.type} job for ${formData.customerName} has been posted.`,
      });
    } catch (error) {
      console.error('Error creating job:', error);
      toast({
        title: "Error",
        description: "Failed to create job.",
        variant: "destructive",
      });
    }
  };

  const getStatusIcon = (status: Job['status']) => {
    switch (status) {
      case 'open': return <Package className="h-4 w-4" />;
      case 'assigned': return <Truck className="h-4 w-4" />;
      case 'in_progress': return <Clock className="h-4 w-4" />;
      case 'completed': return <CheckCircle className="h-4 w-4" />;
      default: return <Package className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: Job['status']) => {
    switch (status) {
      case 'open': return 'bg-gray-100 text-gray-800';
      case 'assigned': return 'bg-blue-100 text-blue-800';
      case 'in_progress': return 'bg-orange-100 text-orange-800';
      case 'completed': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusDisplay = (status: Job['status']) => {
    switch (status) {
      case 'open': return 'Open';
      case 'assigned': return 'Assigned';
      case 'in_progress': return 'In Progress';
      case 'completed': return 'Completed';
      default: return status;
    }
  };

  const activeJobs = jobs.filter(job => job.status !== 'completed');

  if (loading) {
    return (
      <div className="min-h-screen relative" style={{
        backgroundImage: `url(${mapBackgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center top',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed'
      }}>
        <div className="absolute inset-0 bg-gradient-to-b from-black/75 via-black/65 to-black/40"></div>
        <div className="relative z-10 flex items-center justify-center h-64 pt-24">
          <div className="text-white/70">Loading jobs...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative" style={{
      backgroundImage: `url(${mapBackgroundImage})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center top',
      backgroundRepeat: 'no-repeat',
      backgroundAttachment: 'fixed'
    }}>
      <div className="absolute inset-0 bg-gradient-to-b from-black/75 via-black/65 to-black/40"></div>
      <div className="relative z-10 max-w-7xl mx-auto pt-24 py-8 px-4 sm:px-6 lg:px-8">
        <div className="space-y-6">
          {/* Subscription Status */}
          {subscriptionLimits && (
            <Card className={`bg-white/10 backdrop-blur-sm border-white/20 border-l-4 ${subscriptionLimits.upgradeRequired ? 'border-l-red-500' : 'border-l-[#DC2626]'}`}>
              <CardContent className="pt-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-white">
                      {subscriptionLimits.planName.charAt(0).toUpperCase() + subscriptionLimits.planName.slice(1)} Plan
                    </h3>
                    <p className="text-sm text-white/70">
                      {subscriptionLimits.currentUsage} of {subscriptionLimits.monthlyLimit === -1 ? '∞' : subscriptionLimits.monthlyLimit} jobs used this month
                    </p>
                  </div>
                  {subscriptionLimits.upgradeRequired && (
                    <Link to="/billing">
                      <Button className="bg-red-600 hover:bg-red-700 text-white" size="sm">
                        Upgrade Plan
                      </Button>
                    </Link>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white">Jobs Management</h1>
              <p className="text-white/70 mt-1">Create and monitor delivery and swap jobs</p>
            </div>
          
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button 
                className="bg-[#DC2626] hover:bg-[#b91c1c] text-white border-none" 
                disabled={subscriptionLimits?.upgradeRequired}
              >
                <Plus className="h-5 w-5 mr-2" />
                Create Job
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px] bg-white/95 backdrop-blur-sm border-white/20">
              <DialogHeader>
                <DialogTitle className="text-gray-900">Create New Job</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="type">Job Type *</Label>
                  <Select 
                    value={formData.type} 
                    onValueChange={(value: 'delivery' | 'swap') => 
                      setFormData({...formData, type: value})
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select job type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="delivery">Delivery</SelectItem>
                      <SelectItem value="swap">Swap</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="vin">VIN</Label>
                    <Input
                      id="vin"
                      value={formData.vin}
                      onChange={(e) => setFormData({...formData, vin: e.target.value})}
                      placeholder="Vehicle VIN"
                    />
                  </div>
                  <div>
                    <Label htmlFor="year">Year</Label>
                    <Input
                      id="year"
                      value={formData.year}
                      onChange={(e) => setFormData({...formData, year: e.target.value})}
                      placeholder="2023"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="make">Make</Label>
                    <Input
                      id="make"
                      value={formData.make}
                      onChange={(e) => setFormData({...formData, make: e.target.value})}
                      placeholder="Toyota"
                    />
                  </div>
                  <div>
                    <Label htmlFor="model">Model</Label>
                    <Input
                      id="model"
                      value={formData.model}
                      onChange={(e) => setFormData({...formData, model: e.target.value})}
                      placeholder="Camry"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="customerName">Customer Name *</Label>
                    <Input
                      id="customerName"
                      value={formData.customerName}
                      onChange={(e) => setFormData({...formData, customerName: e.target.value})}
                      placeholder="Enter customer name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="customerPhone">Phone Number *</Label>
                    <Input
                      id="customerPhone"
                      value={formData.customerPhone}
                      onChange={(e) => setFormData({...formData, customerPhone: e.target.value})}
                      placeholder="(555) 123-4567"
                    />
                  </div>
                </div>

                <AddressInput
                  label="Pickup Address"
                  value={formData.pickup}
                  onChange={(pickup) => setFormData({...formData, pickup})}
                  required
                />

                <AddressInput
                  label="Delivery Address"
                  value={formData.delivery}
                  onChange={(delivery) => setFormData({...formData, delivery})}
                  required
                />

                <div>
                  <Label htmlFor="notes">Notes</Label>
                  <Textarea
                    id="notes"
                    value={formData.notes}
                    onChange={(e) => setFormData({...formData, notes: e.target.value})}
                    placeholder="Additional instructions or notes"
                    rows={3}
                  />
                </div>

                <Button onClick={handleCreateJob} className="w-full bg-[#DC2626] hover:bg-[#b91c1c] text-white">
                  Create Job
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

          {/* Active Jobs List */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-white">Active Jobs ({activeJobs.length})</h2>
          
            {activeJobs.length === 0 ? (
              <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                <CardContent className="pt-6 text-center">
                  <Package className="h-12 w-12 text-white/60 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-white mb-2">No Active Jobs</h3>
                  <p className="text-white/70 mb-4">Create your first delivery or swap job to get started.</p>
                  <Button onClick={() => setIsCreateDialogOpen(true)} className="bg-[#DC2626] hover:bg-[#b91c1c] text-white">
                    <Plus className="h-4 w-4 mr-2" />
                    Create First Job
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4">
                {activeJobs.map((job) => (
                  <Card key={job.id} className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/15 transition-colors">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="flex items-center space-x-3">
                          <span className="text-lg text-white">{job.type} - {job.customer_name}</span>
                          <span className={`px-2 py-1 rounded text-xs font-medium flex items-center space-x-1 ${getStatusColor(job.status)}`}>
                            {getStatusIcon(job.status)}
                            <span>{getStatusDisplay(job.status)}</span>
                          </span>
                        </CardTitle>
                        <div className="flex items-center space-x-2">
                          <Link
                            to={`/track/${job.track_token}`}
                            className="text-[#DC2626] hover:text-[#b91c1c] text-sm font-medium flex items-center space-x-1"
                          >
                            <ExternalLink className="h-3 w-3" />
                            <span>Customer Link</span>
                          </Link>
                        </div>
                    </div>
                  </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="font-medium text-white">Pickup:</span>
                            <div className="text-white/70">{job.pickup_address}</div>
                          </div>
                          <div>
                            <span className="font-medium text-white">Delivery:</span>
                            <div className="text-white/70">{job.delivery_address}</div>
                          </div>
                        </div>

                        {job.vin && (
                          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                            <div>
                              <span className="font-medium text-white">VIN:</span>
                              <div className="text-white/70 font-mono">{job.vin}</div>
                            </div>
                            <div>
                              <span className="font-medium text-white">Year:</span>
                              <div className="text-white/70">{job.year}</div>
                            </div>
                            <div>
                              <span className="font-medium text-white">Make:</span>
                              <div className="text-white/70">{job.make}</div>
                            </div>
                            <div>
                              <span className="font-medium text-white">Model:</span>
                              <div className="text-white/70">{job.model}</div>
                            </div>
                          </div>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                          <div>
                            <span className="font-medium text-white">Customer:</span>
                            <div className="text-white/70">{job.customer_name}</div>
                            <div className="text-white/70">{job.customer_phone}</div>
                          </div>
                          <div>
                            <span className="font-medium text-white">Job ID:</span>
                            <div className="text-white/70 font-mono">{job.id}</div>
                          </div>
                          <div>
                            <span className="font-medium text-white">Tracking:</span>
                            <div className="text-white/70 font-mono">{job.track_token}</div>
                          </div>
                        </div>

                        {job.driver_name && (
                          <div className="text-sm">
                            <span className="font-medium text-white">Driver:</span>
                            <span className="text-white/70 ml-2">{job.driver_name}</span>
                          </div>
                        )}

                        {job.notes && (
                          <div className="text-sm">
                            <span className="font-medium text-white">Notes:</span>
                            <div className="text-white/70 mt-1">{job.notes}</div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
  );
};

export default Jobs;