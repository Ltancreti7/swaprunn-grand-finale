import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import {
  Clock,
  MapPin,
  User,
  Package,
  Calendar,
  CheckCircle,
} from "lucide-react";
import { format } from "date-fns";

interface DriverRequest {
  id: string;
  outgoing_vin: string;
  outgoing_year?: number;
  outgoing_make?: string;
  outgoing_model?: string;
  outgoing_stock_number?: string;
  incoming_vin: string;
  incoming_year?: number;
  incoming_make?: string;
  incoming_model?: string;
  incoming_stock_number?: string;
  destination_dealer_name: string;
  destination_address: string;
  driver_name?: string;
  driver_id?: string;
  request_timestamp: string;
  departure_time?: string;
  estimated_arrival_time?: string;
  completion_time?: string;
  status: string;
  contact_name?: string;
  contact_phone?: string;
  reason_for_swap?: string;
  notes?: string;
  fuel_level?: string;
}

export function ActiveSwapsDashboard() {
  const [requests, setRequests] = useState<DriverRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const { toast } = useToast();

  useEffect(() => {
    fetchRequests();

    // Real-time subscription
    const channel = supabase
      .channel("driver_requests_changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "driver_requests",
        },
        () => {
          fetchRequests();
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchRequests = async () => {
    try {
      const { data, error } = await supabase
        .from("driver_requests")
        .select("*")
        .order("request_timestamp", { ascending: false });

      if (error) throw error;
      setRequests(data || []);
    } catch (error) {
      console.error("Error fetching requests:", error);
      toast({
        title: "Error",
        description: "Failed to load driver requests",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (requestId: string, newStatus: string) => {
    try {
      const updateData: any = { status: newStatus };

      if (
        newStatus === "in_transit" &&
        !requests.find((r) => r.id === requestId)?.departure_time
      ) {
        updateData.departure_time = new Date().toISOString();
      }

      if (newStatus === "delivered" || newStatus === "returned") {
        updateData.completion_time = new Date().toISOString();
      }

      const { error } = await supabase
        .from("driver_requests")
        .update(updateData)
        .eq("id", requestId);

      if (error) throw error;

      toast({
        title: "Status Updated",
        description: `Request marked as ${newStatus}`,
      });

      fetchRequests();
    } catch (error: any) {
      console.error("Error updating status:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to update status",
        variant: "destructive",
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-500/20 text-yellow-300 border-yellow-500/30";
      case "in_transit":
        return "bg-blue-500/20 text-blue-300 border-blue-500/30";
      case "delivered":
        return "bg-green-500/20 text-green-300 border-green-500/30";
      case "returned":
        return "bg-purple-500/20 text-purple-300 border-purple-500/30";
      default:
        return "bg-gray-500/20 text-gray-300 border-gray-500/30";
    }
  };

  const filteredRequests =
    statusFilter === "all"
      ? requests
      : requests.filter((r) => r.status === statusFilter);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="text-white/60">Loading active swaps...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold text-white">
          Active Swaps Dashboard
        </h2>

        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px] bg-black/20 border-white/20 text-white">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="in_transit">In Transit</SelectItem>
            <SelectItem value="delivered">Delivered</SelectItem>
            <SelectItem value="returned">Returned</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {filteredRequests.length === 0 ? (
        <Card className="bg-black/40 border-white/10">
          <CardContent className="py-12 text-center">
            <Package className="w-16 h-16 mx-auto mb-4 text-white/40" />
            <p className="text-white/60 text-lg">No driver requests found</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredRequests.map((request) => (
            <Card
              key={request.id}
              className="bg-black/40 border-white/10 hover:border-white/30 transition-all"
            >
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="text-white text-lg">
                    Swap Request
                  </CardTitle>
                  <Badge className={getStatusColor(request.status)}>
                    {request.status.replace("_", " ").toUpperCase()}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Vehicles */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-xs text-white/60">Outgoing Vehicle</p>
                    <p className="text-white font-medium">
                      {request.outgoing_year} {request.outgoing_make}{" "}
                      {request.outgoing_model}
                    </p>
                    <p className="text-xs text-white/60">
                      VIN: {request.outgoing_vin}
                    </p>
                    {request.outgoing_stock_number && (
                      <p className="text-xs text-white/60">
                        Stock: {request.outgoing_stock_number}
                      </p>
                    )}
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-white/60">Incoming Vehicle</p>
                    <p className="text-white font-medium">
                      {request.incoming_year} {request.incoming_make}{" "}
                      {request.incoming_model}
                    </p>
                    <p className="text-xs text-white/60">
                      VIN: {request.incoming_vin}
                    </p>
                    {request.incoming_stock_number && (
                      <p className="text-xs text-white/60">
                        Stock: {request.incoming_stock_number}
                      </p>
                    )}
                  </div>
                </div>

                {/* Destination */}
                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-white/60 mt-1" />
                  <div className="flex-1">
                    <p className="text-white font-medium">
                      {request.destination_dealer_name}
                    </p>
                    <p className="text-sm text-white/60">
                      {request.destination_address}
                    </p>
                  </div>
                </div>

                {/* Driver */}
                {request.driver_name && (
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-white/60" />
                    <p className="text-white">{request.driver_name}</p>
                  </div>
                )}

                {/* Times */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-white/60" />
                    <div>
                      <p className="text-white/60 text-xs">Requested</p>
                      <p className="text-white">
                        {format(
                          new Date(request.request_timestamp),
                          "MMM d, h:mm a",
                        )}
                      </p>
                    </div>
                  </div>
                  {request.departure_time && (
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-white/60" />
                      <div>
                        <p className="text-white/60 text-xs">Departed</p>
                        <p className="text-white">
                          {format(
                            new Date(request.departure_time),
                            "MMM d, h:mm a",
                          )}
                        </p>
                      </div>
                    </div>
                  )}
                  {request.estimated_arrival_time && (
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-white/60" />
                      <div>
                        <p className="text-white/60 text-xs">Est. Arrival</p>
                        <p className="text-white">
                          {format(
                            new Date(request.estimated_arrival_time),
                            "MMM d, h:mm a",
                          )}
                        </p>
                      </div>
                    </div>
                  )}
                  {request.completion_time && (
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-400" />
                      <div>
                        <p className="text-white/60 text-xs">Completed</p>
                        <p className="text-white">
                          {format(
                            new Date(request.completion_time),
                            "MMM d, h:mm a",
                          )}
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Contact & Details */}
                {(request.contact_name || request.contact_phone) && (
                  <div className="pt-2 border-t border-white/10">
                    <p className="text-xs text-white/60 mb-1">Contact</p>
                    <p className="text-white text-sm">
                      {request.contact_name}{" "}
                      {request.contact_phone && `• ${request.contact_phone}`}
                    </p>
                  </div>
                )}

                {request.notes && (
                  <div className="text-sm">
                    <p className="text-white/60 text-xs mb-1">Notes</p>
                    <p className="text-white/80">{request.notes}</p>
                  </div>
                )}

                {request.fuel_level && (
                  <div className="text-sm">
                    <p className="text-white/60 text-xs">
                      Fuel:{" "}
                      <span className="text-white">{request.fuel_level}</span>
                    </p>
                  </div>
                )}

                {/* Status Actions */}
                <div className="flex flex-wrap gap-2 pt-2">
                  {request.status === "pending" && (
                    <Button
                      size="sm"
                      onClick={() => updateStatus(request.id, "in_transit")}
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      Mark In Transit
                    </Button>
                  )}
                  {request.status === "in_transit" && (
                    <>
                      <Button
                        size="sm"
                        onClick={() => updateStatus(request.id, "delivered")}
                        className="bg-green-600 hover:bg-green-700 text-white"
                      >
                        Mark Delivered
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => updateStatus(request.id, "returned")}
                        className="bg-purple-600 hover:bg-purple-700 text-white"
                      >
                        Mark Returned
                      </Button>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
