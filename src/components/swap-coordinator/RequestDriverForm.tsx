import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import {
  AddressInput,
  AddressData,
  addressToString,
} from "@/components/ui/address-input";
import { Camera, FileSignature } from "lucide-react";
interface Driver {
  id: string;
  name: string;
}
interface VehicleMaster {
  make: string;
  model: string;
}
interface RequestDriverFormProps {
  onSuccess?: () => void;
}
export function RequestDriverForm({ onSuccess }: RequestDriverFormProps) {
  const { toast } = useToast();
  const [submitting, setSubmitting] = useState(false);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [vehicleMasters, setVehicleMasters] = useState<VehicleMaster[]>([]);
  const [makes, setMakes] = useState<string[]>([]);

  // Outgoing vehicle
  const [outgoingVin, setOutgoingVin] = useState("");
  const [outgoingYear, setOutgoingYear] = useState("");
  const [outgoingMake, setOutgoingMake] = useState("");
  const [outgoingModel, setOutgoingModel] = useState("");
  const [outgoingStock, setOutgoingStock] = useState("");
  const [outgoingModels, setOutgoingModels] = useState<string[]>([]);

  // Incoming vehicle
  const [incomingVin, setIncomingVin] = useState("");
  const [incomingYear, setIncomingYear] = useState("");
  const [incomingMake, setIncomingMake] = useState("");
  const [incomingModel, setIncomingModel] = useState("");
  const [incomingStock, setIncomingStock] = useState("");
  const [incomingModels, setIncomingModels] = useState<string[]>([]);

  // Destination & Driver
  const [destinationDealer, setDestinationDealer] = useState("");
  const [destinationAddress, setDestinationAddress] = useState<AddressData>({
    street: "",
    city: "",
    state: "",
    zip: "",
  });
  const [selectedDriverId, setSelectedDriverId] = useState("");

  // Times
  const [departureTime, setDepartureTime] = useState("");
  const [estimatedArrival, setEstimatedArrival] = useState("");

  // Contact & Details
  const [contactName, setContactName] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [reasonForSwap, setReasonForSwap] = useState("");
  const [notes, setNotes] = useState("");
  const [fuelLevel, setFuelLevel] = useState("");
  const [specialInstructions, setSpecialInstructions] = useState("");
  const [vehicleCondition, setVehicleCondition] = useState("");

  // Fetch available drivers and vehicle masters
  useEffect(() => {
    const fetchData = async () => {
      // Fetch drivers
      const { data: driversData } = await supabase
        .from("drivers")
        .select("id, name")
        .eq("available", true);
      if (driversData) setDrivers(driversData);

      // Fetch vehicle masters
      const { data: vehicleData } = await supabase
        .from("vehicle_masters")
        .select("make, model");
      if (vehicleData) {
        setVehicleMasters(vehicleData);
        // Extract unique makes
        const uniqueMakes = Array.from(
          new Set(vehicleData.map((v) => v.make)),
        ).sort();
        setMakes(uniqueMakes);
      }
    };
    fetchData();
  }, []);

  // Filter models when make changes - Outgoing
  useEffect(() => {
    if (outgoingMake) {
      const filtered = vehicleMasters
        .filter((v) => v.make === outgoingMake)
        .map((v) => v.model)
        .sort();
      setOutgoingModels(filtered);
      // Reset model if it doesn't exist for new make
      if (!filtered.includes(outgoingModel)) {
        setOutgoingModel("");
      }
    } else {
      setOutgoingModels([]);
      setOutgoingModel("");
    }
  }, [outgoingMake, vehicleMasters]);

  // Filter models when make changes - Incoming
  useEffect(() => {
    if (incomingMake) {
      const filtered = vehicleMasters
        .filter((v) => v.make === incomingMake)
        .map((v) => v.model)
        .sort();
      setIncomingModels(filtered);
      // Reset model if it doesn't exist for new make
      if (!filtered.includes(incomingModel)) {
        setIncomingModel("");
      }
    } else {
      setIncomingModels([]);
      setIncomingModel("");
    }
  }, [incomingMake, vehicleMasters]);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");
      const requestData = {
        outgoing_vin: outgoingVin,
        outgoing_year: outgoingYear ? parseInt(outgoingYear) : null,
        outgoing_make: outgoingMake,
        outgoing_model: outgoingModel,
        outgoing_stock_number: outgoingStock,
        incoming_vin: incomingVin,
        incoming_year: incomingYear ? parseInt(incomingYear) : null,
        incoming_make: incomingMake,
        incoming_model: incomingModel,
        incoming_stock_number: incomingStock,
        destination_dealer_name: destinationDealer,
        destination_address: addressToString(destinationAddress),
        driver_id: selectedDriverId || null,
        driver_name:
          drivers.find((d) => d.id === selectedDriverId)?.name || null,
        requester_id: user.id,
        requester_name: user.email,
        departure_time: departureTime || null,
        estimated_arrival_time: estimatedArrival || null,
        contact_name: contactName,
        contact_phone: contactPhone,
        contact_email: contactEmail,
        reason_for_swap: reasonForSwap,
        notes: notes,
        fuel_level: fuelLevel,
        special_instructions: specialInstructions,
        vehicle_condition: vehicleCondition,
        status: "pending",
      };
      const { error } = await supabase
        .from("driver_requests")
        .insert([requestData]);
      if (error) throw error;
      toast({
        title: "Request Created",
        description: "Driver request has been submitted successfully.",
      });

      // Reset form
      setOutgoingVin("");
      setOutgoingYear("");
      setOutgoingMake("");
      setOutgoingModel("");
      setOutgoingStock("");
      setIncomingVin("");
      setIncomingYear("");
      setIncomingMake("");
      setIncomingModel("");
      setIncomingStock("");
      setDestinationDealer("");
      setDestinationAddress({
        street: "",
        city: "",
        state: "",
        zip: "",
      });
      setSelectedDriverId("");
      setDepartureTime("");
      setEstimatedArrival("");
      setContactName("");
      setContactPhone("");
      setContactEmail("");
      setReasonForSwap("");
      setNotes("");
      setFuelLevel("");
      setSpecialInstructions("");
      setVehicleCondition("");
      onSuccess?.();
    } catch (error: any) {
      console.error("Error creating request:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to create driver request",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };
  return (
    <Card className="bg-white/5 border-white/20">
      <CardHeader>
        <CardTitle className="text-white">Request Driver</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Outgoing Vehicle Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">
              Outgoing Vehicle
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="text-white">VIN *</Label>
                <Input
                  value={outgoingVin}
                  onChange={(e) => setOutgoingVin(e.target.value)}
                  required
                  className="bg-white/10 border-white/30 text-white"
                />
              </div>
              <div>
                <Label className="text-white">Stock Number</Label>
                <Input
                  value={outgoingStock}
                  onChange={(e) => setOutgoingStock(e.target.value)}
                  className="bg-white/10 border-white/30 text-white"
                />
              </div>
            </div>
          </div>

          {/* Incoming Vehicle Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">
              Incoming Vehicle
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="text-white">VIN *</Label>
                <Input
                  value={incomingVin}
                  onChange={(e) => setIncomingVin(e.target.value)}
                  required
                  className="bg-white/10 border-white/30 text-white"
                />
              </div>
              <div>
                <Label className="text-white">Stock Number</Label>
                <Input
                  value={incomingStock}
                  onChange={(e) => setIncomingStock(e.target.value)}
                  className="bg-white/10 border-white/30 text-white"
                />
              </div>
            </div>
          </div>

          {/* Destination Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Destination</h3>
            <div>
              <Label className="text-white">Dealer Name *</Label>
              <Input
                value={destinationDealer}
                onChange={(e) => setDestinationDealer(e.target.value)}
                required
                className="bg-white/10 border-white/30 text-white"
              />
            </div>
            <div>
              <Label className="text-white">Address *</Label>
              <AddressInput
                label=""
                value={destinationAddress}
                onChange={setDestinationAddress}
                required
              />
            </div>
          </div>

          {/* Driver Selection */}
          <div>
            <Label className="text-white">Assign Driver (Optional)</Label>
            <Select
              value={selectedDriverId}
              onValueChange={setSelectedDriverId}
            >
              <SelectTrigger className="bg-white/10 border-white/30 text-white">
                <SelectValue placeholder="Select a driver" />
              </SelectTrigger>
              <SelectContent>
                {drivers.map((driver) => (
                  <SelectItem key={driver.id} value={driver.id}>
                    {driver.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Notes */}
          <div>
            <Label className="text-white">Special Instructions</Label>
            <Textarea
              value={specialInstructions}
              onChange={(e) => setSpecialInstructions(e.target.value)}
              className="bg-white/10 border-white/30 text-white"
              rows={3}
            />
          </div>

          <Button
            type="submit"
            disabled={submitting}
            className="w-full bg-[#E11900] hover:bg-[#E11900]/90 text-white"
          >
            {submitting ? "Submitting..." : "Submit Request"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
