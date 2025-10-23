import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { createJob } from "@/services/bulletproofJobService";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { Checkbox } from "@/components/ui/checkbox";
import { AddressInput, AddressData } from "@/components/ui/address-input";
import {
  ArrowLeft,
  Car,
  MapPin,
  User,
  Clock,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";
import mapBackgroundImage from "@/assets/map-background.jpg";
import { formatPhoneNumber, cleanPhoneNumber } from "@/lib/utils";

const CreateJob = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { userProfile, user } = useAuth();

  // Multi-step form state
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 4;
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Vehicle Information
  const [vehicleYear, setVehicleYear] = useState("");
  const [vehicleMake, setVehicleMake] = useState("");
  const [vehicleModel, setVehicleModel] = useState("");
  const [vehicleVin, setVehicleVin] = useState("");

  // Trade-in Information
  const [hasTradeIn, setHasTradeIn] = useState(false);
  const [tradeYear, setTradeYear] = useState("");
  const [tradeMake, setTradeMake] = useState("");
  const [tradeModel, setTradeModel] = useState("");
  const [tradeVin, setTradeVin] = useState("");
  const [tradeTransmission, setTradeTransmission] = useState("");

  // Addresses
  const [pickupAddress, setPickupAddress] = useState<AddressData>({
    street: "",
    city: "",
    state: "",
    zip: "",
  });
  const [deliveryAddress, setDeliveryAddress] = useState<AddressData>({
    street: "",
    city: "",
    state: "",
    zip: "",
  });

  // Customer Information
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");

  // Job Details
  const [timeframe, setTimeframe] = useState("");
  const [notes, setNotes] = useState("");
  const [requiresTwoPeople, setRequiresTwoPeople] = useState(false);

  // Vehicle data
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 30 }, (_, i) =>
    (currentYear + 1 - i).toString(),
  );

  const makes = [
    "Acura",
    "Audi",
    "BMW",
    "Buick",
    "Cadillac",
    "Chevrolet",
    "Chrysler",
    "Dodge",
    "Ford",
    "GMC",
    "Honda",
    "Hyundai",
    "Infiniti",
    "Jaguar",
    "Jeep",
    "Kia",
    "Land Rover",
    "Lexus",
    "Lincoln",
    "Mazda",
    "Mercedes-Benz",
    "Mitsubishi",
    "Nissan",
    "Porsche",
    "Ram",
    "Subaru",
    "Tesla",
    "Toyota",
    "Volkswagen",
    "Volvo",
  ];

  const timeframeOptions = [
    "ASAP - Within 2 hours",
    "Today - Within 8 hours",
    "Tomorrow",
    "This week",
    "Next week",
    "Flexible timing",
  ];

  // Form validation
  const canProceedToStep = (step: number) => {
    switch (step) {
      case 2:
        return vehicleYear && vehicleMake && vehicleModel;
      case 3:
        return (
          pickupAddress.street &&
          pickupAddress.city &&
          deliveryAddress.street &&
          deliveryAddress.city
        );
      case 4:
        return customerName && customerPhone && timeframe;
      default:
        return true;
    }
  };

  const handleNext = () => {
    if (currentStep < totalSteps && canProceedToStep(currentStep + 1)) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    if (!userProfile?.dealer_id) {
      toast({
        title: "Account Setup Required",
        description:
          "Your dealer account is not properly configured. Please contact support.",
        variant: "destructive",
      });
      return;
    }

    // Final validation
    if (!vehicleYear || !vehicleMake || !vehicleModel) {
      toast({
        title: "Missing Vehicle Information",
        description: "Please provide complete vehicle details.",
        variant: "destructive",
      });
      return;
    }

    if (!pickupAddress.street || !deliveryAddress.street) {
      toast({
        title: "Missing Address Information",
        description: "Please provide both pickup and delivery addresses.",
        variant: "destructive",
      });
      return;
    }

    if (!customerName || !customerPhone) {
      toast({
        title: "Missing Customer Information",
        description: "Please provide customer name and phone number.",
        variant: "destructive",
      });
      return;
    }

    if (
      hasTradeIn &&
      (!tradeYear || !tradeMake || !tradeModel || !tradeTransmission)
    ) {
      toast({
        title: "Missing Trade Vehicle Information",
        description: "Please complete all trade vehicle details.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const jobData = {
        type: hasTradeIn ? ("swap" as const) : ("delivery" as const),
        pickup_address: `${pickupAddress.street}, ${pickupAddress.city}, ${pickupAddress.state} ${pickupAddress.zip}`,
        delivery_address: `${deliveryAddress.street}, ${deliveryAddress.city}, ${deliveryAddress.state} ${deliveryAddress.zip}`,
        year: parseInt(vehicleYear),
        make: vehicleMake,
        model: vehicleModel,
        vin: vehicleVin || null,
        customer_name: customerName,
        customer_phone: cleanPhoneNumber(customerPhone) || customerPhone,
        timeframe: timeframe,
        notes: notes || null,
        requires_two: requiresTwoPeople,
        distance_miles: 25, // Will be calculated by the service
        created_by: user?.id ?? null,
        // Trade vehicle parameters
        trade_year: hasTradeIn && tradeYear ? parseInt(tradeYear) : null,
        trade_make: hasTradeIn ? tradeMake : null,
        trade_model: hasTradeIn ? tradeModel : null,
        trade_vin: hasTradeIn ? tradeVin || null : null,
        trade_transmission: hasTradeIn ? tradeTransmission : null,
      };

      const createdJob = await createJob(jobData);

      toast({
        title: "Job Created Successfully!",
        description: `Job ${createdJob.track_token} has been created and drivers will be notified.`,
      });

      navigate("/dealer/dashboard");
    } catch (error) {
      console.error("Job creation failed:", error);
      toast({
        title: "Job Creation Failed",
        description:
          error instanceof Error ? error.message : "Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <Car className="mx-auto h-12 w-12 text-[#E11900] mb-4" />
              <h2 className="text-2xl font-bold text-white mb-2">
                Vehicle Information
              </h2>
              <p className="text-white/70">
                Tell us about the vehicle being delivered
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label className="text-white mb-2 block">Year *</Label>
                <Select value={vehicleYear} onValueChange={setVehicleYear}>
                  <SelectTrigger className="bg-white/10 border-white/20 text-white">
                    <SelectValue placeholder="Select year" />
                  </SelectTrigger>
                  <SelectContent>
                    {years.map((year) => (
                      <SelectItem key={year} value={year}>
                        {year}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-white mb-2 block">Make *</Label>
                <Select value={vehicleMake} onValueChange={setVehicleMake}>
                  <SelectTrigger className="bg-white/10 border-white/20 text-white">
                    <SelectValue placeholder="Select make" />
                  </SelectTrigger>
                  <SelectContent>
                    {makes.map((make) => (
                      <SelectItem key={make} value={make}>
                        {make}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label className="text-white mb-2 block">Model *</Label>
              <Input
                value={vehicleModel}
                onChange={(e) => setVehicleModel(e.target.value)}
                placeholder="Enter vehicle model"
                className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
              />
            </div>

            <div>
              <Label className="text-white mb-2 block">VIN (Optional)</Label>
              <Input
                value={vehicleVin}
                onChange={(e) => setVehicleVin(e.target.value.toUpperCase())}
                placeholder="Enter VIN number"
                className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                maxLength={17}
              />
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="hasTradeIn"
                checked={hasTradeIn}
                onCheckedChange={(checked) => setHasTradeIn(checked === true)}
                className="border-white/30"
              />
              <Label htmlFor="trade-in" className="text-white">
                Customer has a trade-in vehicle (swap job)
              </Label>
            </div>

            {hasTradeIn && (
              <div className="space-y-4 p-4 bg-white/5 rounded-lg border border-white/10">
                <h3 className="text-lg font-semibold text-white">
                  Trade Vehicle Information
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-white mb-2 block">
                      Trade Year *
                    </Label>
                    <Select value={tradeYear} onValueChange={setTradeYear}>
                      <SelectTrigger className="bg-white/10 border-white/20 text-white">
                        <SelectValue placeholder="Select year" />
                      </SelectTrigger>
                      <SelectContent>
                        {years.map((year) => (
                          <SelectItem key={year} value={year}>
                            {year}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label className="text-white mb-2 block">
                      Trade Make *
                    </Label>
                    <Select value={tradeMake} onValueChange={setTradeMake}>
                      <SelectTrigger className="bg-white/10 border-white/20 text-white">
                        <SelectValue placeholder="Select make" />
                      </SelectTrigger>
                      <SelectContent>
                        {makes.map((make) => (
                          <SelectItem key={make} value={make}>
                            {make}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label className="text-white mb-2 block">Trade Model *</Label>
                  <Input
                    value={tradeModel}
                    onChange={(e) => setTradeModel(e.target.value)}
                    placeholder="Enter trade vehicle model"
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-white mb-2 block">
                      Trade VIN (Optional)
                    </Label>
                    <Input
                      value={tradeVin}
                      onChange={(e) =>
                        setTradeVin(e.target.value.toUpperCase())
                      }
                      placeholder="Enter trade VIN"
                      className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                      maxLength={17}
                    />
                  </div>

                  <div>
                    <Label className="text-white mb-2 block">
                      Transmission *
                    </Label>
                    <Select
                      value={tradeTransmission}
                      onValueChange={setTradeTransmission}
                    >
                      <SelectTrigger className="bg-white/10 border-white/20 text-white">
                        <SelectValue placeholder="Select transmission" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Automatic">Automatic</SelectItem>
                        <SelectItem value="Manual">Manual</SelectItem>
                        <SelectItem value="CVT">CVT</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            )}
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <MapPin className="mx-auto h-12 w-12 text-[#E11900] mb-4" />
              <h2 className="text-2xl font-bold text-white mb-2">
                Pickup & Delivery
              </h2>
              <p className="text-white/70">
                Where should we pick up and deliver the vehicle?
              </p>
            </div>

            <div>
              <Label className="text-white mb-2 block">Pickup Address *</Label>
              <AddressInput
                label=""
                value={pickupAddress}
                onChange={setPickupAddress}
                className="bg-white/10 border-white/30 text-white"
              />
            </div>

            <div>
              <Label className="text-white mb-2 block">
                Delivery Address *
              </Label>
              <AddressInput
                label=""
                value={deliveryAddress}
                onChange={setDeliveryAddress}
                className="bg-white/10 border-white/30 text-white"
              />
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="requiresTwoPeople"
                checked={requiresTwoPeople}
                onCheckedChange={(checked) =>
                  setRequiresTwoPeople(checked === true)
                }
                className="border-white/30"
              />
              <Label htmlFor="requires-two" className="text-white">
                This job requires two drivers
              </Label>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <User className="mx-auto h-12 w-12 text-[#E11900] mb-4" />
              <h2 className="text-2xl font-bold text-white mb-2">
                Customer Information
              </h2>
              <p className="text-white/70">Who is receiving the vehicle?</p>
            </div>

            <div>
              <Label className="text-white mb-2 block">Customer Name *</Label>
              <Input
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="Enter customer's full name"
                className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
              />
            </div>

            <div>
              <Label className="text-white mb-2 block">Customer Phone *</Label>
              <Input
                value={customerPhone}
                onChange={(e) =>
                  setCustomerPhone(formatPhoneNumber(e.target.value))
                }
                placeholder="(555) 123-4567"
                className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                maxLength={14}
              />
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <Clock className="mx-auto h-12 w-12 text-[#E11900] mb-4" />
              <h2 className="text-2xl font-bold text-white mb-2">
                Timing & Notes
              </h2>
              <p className="text-white/70">When do you need this delivered?</p>
            </div>

            <div>
              <Label className="text-white mb-2 block">Timeframe *</Label>
              <Select value={timeframe} onValueChange={setTimeframe}>
                <SelectTrigger className="bg-white/10 border-white/20 text-white">
                  <SelectValue placeholder="Select timeframe" />
                </SelectTrigger>
                <SelectContent>
                  {timeframeOptions.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-white mb-2 block">
                Additional Notes (Optional)
              </Label>
              <Textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Any special instructions, customer preferences, or delivery notes..."
                className="min-h-[120px] bg-white/10 border-white/20 text-white placeholder:text-white/50 resize-none"
                rows={4}
              />
            </div>

            {/* Summary */}
            <div className="p-4 bg-white/5 rounded-lg border border-white/10">
              <h3 className="text-lg font-semibold text-white mb-3">
                Job Summary
              </h3>
              <div className="space-y-2 text-sm text-white/80">
                <p>
                  <strong>Vehicle:</strong> {vehicleYear} {vehicleMake}{" "}
                  {vehicleModel}
                </p>
                <p>
                  <strong>Type:</strong>{" "}
                  {hasTradeIn ? "Vehicle Swap" : "Vehicle Delivery"}
                </p>
                <p>
                  <strong>Customer:</strong> {customerName}
                </p>
                <p>
                  <strong>Timeframe:</strong> {timeframe}
                </p>
                {hasTradeIn && (
                  <p>
                    <strong>Trade Vehicle:</strong> {tradeYear} {tradeMake}{" "}
                    {tradeModel}
                  </p>
                )}
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div
      className="min-h-screen bg-black relative"
      style={{
        backgroundImage: `url(${mapBackgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/70 to-black/60 z-0"></div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Button
            onClick={() => navigate("/dealer/dashboard")}
            variant="outline"
            className="border-white/40 text-white hover:bg-white/10"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
          <div className="text-center">
            <h1 className="text-3xl font-bold text-white">Create New Job</h1>
            <p className="text-white/70">
              Step {currentStep} of {totalSteps}
            </p>
          </div>
          <div className="w-24"></div> {/* Spacer for centering */}
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="w-full bg-white/20 rounded-full h-2">
            <div
              className="bg-[#E11900] h-2 rounded-full transition-all duration-300"
              style={{ width: `${(currentStep / totalSteps) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Form Card */}
        <Card className="max-w-2xl mx-auto bg-black/40 backdrop-blur-sm border-white/20">
          <CardContent className="p-8">
            {renderStepContent()}

            {/* Navigation */}
            <div className="flex justify-between items-center pt-8 mt-8 border-t border-white/20">
              {currentStep > 1 ? (
                <Button
                  onClick={handlePrevious}
                  variant="outline"
                  className="border-white/40 text-white hover:bg-white/10"
                >
                  <ChevronLeft className="w-4 h-4 mr-2" />
                  Previous
                </Button>
              ) : (
                <div></div>
              )}

              {currentStep < totalSteps ? (
                <Button
                  onClick={handleNext}
                  disabled={!canProceedToStep(currentStep + 1)}
                  className="bg-[#E11900] hover:bg-[#CC1600] text-white disabled:opacity-50"
                >
                  Next
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              ) : (
                <Button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="bg-gradient-to-r from-[#E11900] to-[#CC1600] hover:from-[#CC1600] hover:to-[#B01400] text-white px-8 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Creating Job...
                    </div>
                  ) : (
                    "Create Job"
                  )}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CreateJob;
