import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, Check, X, Mail, Phone, Calendar, FileText, MapPin, Briefcase } from "lucide-react";

interface PendingDriver {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  created_at: string;
  checkr_status: string | null;
}

interface DriverApplication {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  dob: string;
  address: string;
  contact_method: string;
  license_number: string;
  license_state: string;
  license_expiration: string;
  drive_radius: number;
  availability: string;
  status: string;
  created_at: string;
}

export const PendingDriverApproval = () => {
  const { userProfile } = useAuth();
  const { toast } = useToast();
  const [pendingDrivers, setPendingDrivers] = useState<PendingDriver[]>([]);
  const [driverApplications, setDriverApplications] = useState<DriverApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [expandedAppId, setExpandedAppId] = useState<string | null>(null);

  useEffect(() => {
    if (userProfile?.dealer_id) {
      fetchPendingData();
    }
  }, [userProfile?.dealer_id]);

  const fetchPendingData = async () => {
    if (!userProfile?.dealer_id) return;

    try {
      setLoading(true);

      const [driversResult, applicationsResult] = await Promise.all([
        supabase
          .from("drivers")
          .select("id, name, email, phone, created_at, checkr_status")
          .eq("dealer_id", userProfile.dealer_id)
          .eq("approval_status", "pending_approval")
          .order("created_at", { ascending: false }),

        supabase
          .from("driver_applications")
          .select("*")
          .eq("dealer_id", userProfile.dealer_id)
          .eq("status", "pending")
          .order("created_at", { ascending: false })
      ]);

      if (driversResult.error) throw driversResult.error;
      if (applicationsResult.error) throw applicationsResult.error;

      setPendingDrivers(driversResult.data || []);
      setDriverApplications(applicationsResult.data || []);
    } catch (error) {
      console.error("Error fetching pending data:", error);
      toast({
        title: "Error",
        description: "Could not load pending applications.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleApproveDriver = async (driverId: string) => {
    setProcessingId(driverId);

    try {
      const { error } = await supabase
        .from("drivers")
        .update({
          approval_status: "approved",
          approved_by: userProfile?.user_id,
          approved_at: new Date().toISOString(),
        })
        .eq("id", driverId);

      if (error) throw error;

      toast({
        title: "Driver Approved",
        description: "The driver can now receive job notifications.",
      });

      await fetchPendingData();
    } catch (error) {
      console.error("Error approving driver:", error);
      toast({
        title: "Approval Failed",
        description: "Could not approve driver. Please try again.",
        variant: "destructive",
      });
    } finally {
      setProcessingId(null);
    }
  };

  const handleRejectDriver = async (driverId: string) => {
    setProcessingId(driverId);

    try {
      const { error } = await supabase
        .from("drivers")
        .update({
          approval_status: "rejected",
          approved_by: userProfile?.user_id,
          approved_at: new Date().toISOString(),
          rejection_reason: rejectionReason || null,
        })
        .eq("id", driverId);

      if (error) throw error;

      toast({
        title: "Driver Rejected",
        description: "The application has been rejected.",
      });

      setRejectionReason("");
      await fetchPendingData();
    } catch (error) {
      console.error("Error rejecting driver:", error);
      toast({
        title: "Rejection Failed",
        description: "Could not reject driver. Please try again.",
        variant: "destructive",
      });
    } finally {
      setProcessingId(null);
    }
  };

  const handleApproveApplication = async (applicationId: string) => {
    setProcessingId(applicationId);

    try {
      const { error } = await supabase
        .from("driver_applications")
        .update({
          status: "approved",
          reviewed_by: userProfile?.user_id,
          reviewed_at: new Date().toISOString(),
        })
        .eq("id", applicationId);

      if (error) throw error;

      toast({
        title: "Application Approved",
        description: "The driver application has been approved. They can now create an account.",
      });

      await fetchPendingData();
    } catch (error) {
      console.error("Error approving application:", error);
      toast({
        title: "Approval Failed",
        description: "Could not approve application. Please try again.",
        variant: "destructive",
      });
    } finally {
      setProcessingId(null);
    }
  };

  const handleRejectApplication = async (applicationId: string) => {
    setProcessingId(applicationId);

    try {
      const { error } = await supabase
        .from("driver_applications")
        .update({
          status: "rejected",
          reviewed_by: userProfile?.user_id,
          reviewed_at: new Date().toISOString(),
          rejection_reason: rejectionReason || null,
        })
        .eq("id", applicationId);

      if (error) throw error;

      toast({
        title: "Application Rejected",
        description: "The driver application has been rejected.",
      });

      setRejectionReason("");
      await fetchPendingData();
    } catch (error) {
      console.error("Error rejecting application:", error);
      toast({
        title: "Rejection Failed",
        description: "Could not reject application. Please try again.",
        variant: "destructive",
      });
    } finally {
      setProcessingId(null);
    }
  };

  if (loading) {
    return (
      <Card className="bg-white/10 backdrop-blur-sm border-white/20">
        <CardHeader>
          <CardTitle className="text-white">Pending Applications</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            <div className="h-20 bg-white/10 rounded-lg"></div>
            <div className="h-20 bg-white/10 rounded-lg"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (pendingDrivers.length === 0 && driverApplications.length === 0) {
    return null;
  }

  return (
    <Card className="bg-white/10 backdrop-blur-sm border-white/20 shadow-lg rounded-xl sm:rounded-2xl">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <User className="h-5 w-5" />
          Pending Applications ({pendingDrivers.length + driverApplications.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="applications" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-white/5">
            <TabsTrigger value="applications" className="data-[state=active]:bg-[#E11900] data-[state=active]:text-white">
              New Applications ({driverApplications.length})
            </TabsTrigger>
            <TabsTrigger value="drivers" className="data-[state=active]:bg-[#E11900] data-[state=active]:text-white">
              Driver Approvals ({pendingDrivers.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="applications" className="space-y-4 mt-4">
            {driverApplications.length === 0 ? (
              <p className="text-white/70 text-center py-8">No pending applications</p>
            ) : (
              driverApplications.map((app) => (
                <Card key={app.id} className="bg-white/5 border-white/10">
                  <CardContent className="p-4">
                    <div className="space-y-4">
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                        <div className="space-y-2 flex-1">
                          <h4 className="text-lg font-semibold text-white">{app.full_name}</h4>
                          <div className="space-y-1 text-sm text-white/70">
                            <div className="flex items-center gap-2">
                              <Mail className="h-4 w-4" />
                              <span>{app.email}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Phone className="h-4 w-4" />
                              <span>{app.phone}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4" />
                              <span>Applied {new Date(app.created_at).toLocaleDateString()}</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <Button
                            onClick={() => handleApproveApplication(app.id)}
                            disabled={processingId === app.id}
                            className="bg-green-600 hover:bg-green-700 text-white"
                          >
                            <Check className="h-4 w-4 mr-1" />
                            Approve
                          </Button>

                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                variant="destructive"
                                disabled={processingId === app.id}
                              >
                                <X className="h-4 w-4 mr-1" />
                                Reject
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent className="bg-neutral-900 border-white/20">
                              <AlertDialogHeader>
                                <AlertDialogTitle className="text-white">Reject Application?</AlertDialogTitle>
                                <AlertDialogDescription className="text-white/70">
                                  This will reject {app.full_name}'s application. You can optionally provide a reason.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <Textarea
                                placeholder="Reason for rejection (optional)"
                                value={rejectionReason}
                                onChange={(e) => setRejectionReason(e.target.value)}
                                className="bg-white/10 border-white/20 text-white"
                              />
                              <AlertDialogFooter>
                                <AlertDialogCancel className="bg-white/10 text-white border-white/20">
                                  Cancel
                                </AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleRejectApplication(app.id)}
                                  className="bg-red-600 hover:bg-red-700 text-white"
                                >
                                  Reject Application
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </div>

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setExpandedAppId(expandedAppId === app.id ? null : app.id)}
                        className="text-white/70 hover:text-white hover:bg-white/10 w-full"
                      >
                        <FileText className="h-4 w-4 mr-2" />
                        {expandedAppId === app.id ? "Hide Details" : "View Full Application"}
                      </Button>

                      {expandedAppId === app.id && (
                        <div className="p-4 bg-white/5 rounded-lg space-y-3 text-sm text-white/80">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div>
                              <span className="font-semibold text-white">Date of Birth:</span>
                              <p>{new Date(app.dob).toLocaleDateString()}</p>
                            </div>
                            <div>
                              <span className="font-semibold text-white">Preferred Contact:</span>
                              <p className="capitalize">{app.contact_method}</p>
                            </div>
                            <div className="col-span-2">
                              <span className="font-semibold text-white flex items-center gap-1">
                                <MapPin className="h-4 w-4" />
                                Address:
                              </span>
                              <p>{app.address}</p>
                            </div>
                            <div className="col-span-2">
                              <span className="font-semibold text-white flex items-center gap-1">
                                <Briefcase className="h-4 w-4" />
                                License Info:
                              </span>
                              <p>
                                {app.license_state} #{app.license_number}
                                <br />
                                Expires: {new Date(app.license_expiration).toLocaleDateString()}
                              </p>
                            </div>
                            <div>
                              <span className="font-semibold text-white">Drive Radius:</span>
                              <p>{app.drive_radius} miles</p>
                            </div>
                            <div className="col-span-2">
                              <span className="font-semibold text-white">Availability:</span>
                              <p className="whitespace-pre-wrap">{app.availability}</p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>

          <TabsContent value="drivers" className="space-y-4 mt-4">
            {pendingDrivers.length === 0 ? (
              <p className="text-white/70 text-center py-8">No pending driver approvals</p>
            ) : (
              pendingDrivers.map((driver) => (
                <Card key={driver.id} className="bg-white/5 border-white/10">
                  <CardContent className="p-4">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                      <div className="space-y-2 flex-1">
                        <h4 className="text-lg font-semibold text-white">{driver.name}</h4>
                        <div className="space-y-1 text-sm text-white/70">
                          <div className="flex items-center gap-2">
                            <Mail className="h-4 w-4" />
                            <span>{driver.email}</span>
                          </div>
                          {driver.phone && (
                            <div className="flex items-center gap-2">
                              <Phone className="h-4 w-4" />
                              <span>{driver.phone}</span>
                            </div>
                          )}
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            <span>Applied {new Date(driver.created_at).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button
                          onClick={() => handleApproveDriver(driver.id)}
                          disabled={processingId === driver.id}
                          className="bg-green-600 hover:bg-green-700 text-white"
                        >
                          <Check className="h-4 w-4 mr-1" />
                          Approve
                        </Button>

                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="destructive"
                              disabled={processingId === driver.id}
                            >
                              <X className="h-4 w-4 mr-1" />
                              Reject
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent className="bg-neutral-900 border-white/20">
                            <AlertDialogHeader>
                              <AlertDialogTitle className="text-white">Reject Driver?</AlertDialogTitle>
                              <AlertDialogDescription className="text-white/70">
                                This will reject {driver.name}'s account. You can optionally provide a reason.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <Textarea
                              placeholder="Reason for rejection (optional)"
                              value={rejectionReason}
                              onChange={(e) => setRejectionReason(e.target.value)}
                              className="bg-white/10 border-white/20 text-white"
                            />
                            <AlertDialogFooter>
                              <AlertDialogCancel className="bg-white/10 text-white border-white/20">
                                Cancel
                              </AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleRejectDriver(driver.id)}
                                className="bg-red-600 hover:bg-red-700 text-white"
                              >
                                Reject Driver
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
