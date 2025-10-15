import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const SimpleDriverRequest = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 flex flex-col items-center justify-center p-8">
      <div className="text-white text-4xl mb-8">Simple Driver Request - Test Page</div>
      <Button 
        onClick={() => navigate('/dealer/dashboard')}
        className="bg-red-600 hover:bg-red-700 text-white px-8 py-3"
      >
        Back to Dashboard
      </Button>
    </div>
  );
};

  // Multi-step wizard state
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 4;

  // Essential fields only
  const [vehicleInfo, setVehicleInfo] = useState({
    year: "",
    make: "Toyota",
    model: "",
    vin: ""
  });

  const [deliveryAddress, setDeliveryAddress] = useState<AddressData>({
    street: "",
    city: "",
    state: "",
    zip: "",
  });

  const [customerInfo, setCustomerInfo] = useState({
    name: "",
    phone: ""
  });

  const [timeframe, setTimeframe] = useState("asap");
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Smart defaults from dealer profile
  const [pickupAddress, setPickupAddress] = useState<AddressData>({
    street: userProfile?.dealership_address || "168 Charlestown Rd",
    city: userProfile?.dealership_city || "Claremont", 
    state: userProfile?.dealership_state || "NH",
    zip: userProfile?.dealership_zip || "03743",
  });

  const steps = [
    { number: 1, title: "Vehicle", icon: Car },
    { number: 2, title: "Address", icon: MapPin },
    { number: 3, title: "Customer", icon: User },
    { number: 4, title: "Details", icon: Clock }
  ];

  const canProceedToNext = () => {
    switch (currentStep) {
      case 1:
        return vehicleInfo.year && vehicleInfo.make && vehicleInfo.model;
      case 2:
        return deliveryAddress.street && deliveryAddress.city;
      case 3:
        return customerInfo.name && customerInfo.phone;
      case 4:
        return true;
      default:
        return false;
    }
  };

  const nextStep = () => {
    if (canProceedToNext() && currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    // Validation
    if (!vehicleInfo.year || !vehicleInfo.make || !vehicleInfo.model) {
      toast({
        title: "Missing Vehicle Info",
        description: "Please fill in vehicle year, make, and model.",
        variant: "destructive"
      });
      return;
    }

    if (!deliveryAddress.street || !deliveryAddress.city) {
      toast({
        title: "Missing Delivery Address", 
        description: "Please provide a delivery address.",
        variant: "destructive"
      });
      return;
    }

    if (!customerInfo.name || !customerInfo.phone) {
      toast({
        title: "Missing Customer Info",
        description: "Please provide customer name and phone number.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Submit the request with smart defaults
      const { error } = await supabase
        .from('jobs')
        .insert({
          dealer_id: userProfile?.dealer_id,
          type: 'delivery',
          pickup_address: `${pickupAddress.street}, ${pickupAddress.city}, ${pickupAddress.state} ${pickupAddress.zip}`,
          delivery_address: `${deliveryAddress.street}, ${deliveryAddress.city}, ${deliveryAddress.state} ${deliveryAddress.zip}`,
          vehicle_year: vehicleInfo.year,
          vehicle_make: vehicleInfo.make,
          vehicle_model: vehicleInfo.model,
          vin: vehicleInfo.vin,
          customer_name: customerInfo.name,
          customer_phone: customerInfo.phone,
          timeframe: timeframe,
          notes: notes,
          status: 'pending',
          // Smart defaults
          requires_two: false,
          estimated_pay_cents: 7500, // $75 default
          distance_miles: 25 // Default estimate
        });

      if (error) throw error;

      toast({
        title: "Driver Request Submitted!",
        description: "We'll notify you when a driver accepts the job.",
      });

      navigate('/dealer/dashboard');
    } catch (error) {
      console.error('Error submitting request:', error);
      toast({
        title: "Error",
        description: "Failed to submit request. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800">
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Button
            onClick={() => navigate('/dealer/dashboard')}
            variant="outline"
            size="icon"
            className="bg-white/10 border-white/20 text-white hover:bg-white/20"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-white">Request a Driver</h1>
            <p className="text-white/70">Step {currentStep} of {totalSteps}</p>
          </div>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-between mb-8 bg-white/5 backdrop-blur-sm rounded-2xl p-4">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isCompleted = step.number < currentStep;
            const isActive = step.number === currentStep;
            
            return (
              <div key={step.number} className="flex items-center">
                <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all ${
                  isCompleted 
                    ? 'bg-[#E11900] border-[#E11900] text-white' 
                    : isActive 
                    ? 'border-[#E11900] text-[#E11900] bg-white/10' 
                    : 'border-white/30 text-white/50'
                }`}>
                  {isCompleted ? <Check className="h-5 w-5" /> : <Icon className="h-5 w-5" />}
                </div>
                <span className={`ml-2 text-sm font-medium ${
                  isActive ? 'text-white' : 'text-white/60'
                }`}>
                  {step.title}
                </span>
                {index < steps.length - 1 && (
                  <div className={`hidden sm:block w-8 h-px mx-4 ${
                    isCompleted ? 'bg-[#E11900]' : 'bg-white/20'
                  }`} />
                )}
              </div>
            );
          })}
        </div>

        {/* Step Content Card */}
        <Card className="bg-white/10 backdrop-blur-sm border-white/20 shadow-xl min-h-[400px]">
          <CardContent className="p-8">
            
            {/* Step 1: Vehicle Info */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <div className="text-center mb-8">
                  <Car className="h-16 w-16 text-[#E11900] mx-auto mb-4" />
                  <h2 className="text-2xl font-bold text-white mb-2">What vehicle needs delivery?</h2>
                  <p className="text-white/70">Tell us about the car</p>
                </div>
                
                <div className="space-y-4 max-w-md mx-auto">
                  <Input
                    placeholder="Year (e.g., 2024)"
                    value={vehicleInfo.year}
                    onChange={(e) => setVehicleInfo({...vehicleInfo, year: e.target.value})}
                    className="bg-white/10 border-white/30 text-white placeholder:text-white/50 h-14 text-lg"
                  />
                  <Input
                    placeholder="Make (e.g., Toyota)"
                    value={vehicleInfo.make}
                    onChange={(e) => setVehicleInfo({...vehicleInfo, make: e.target.value})}
                    className="bg-white/10 border-white/30 text-white placeholder:text-white/50 h-14 text-lg"
                  />
                  <Input
                    placeholder="Model (e.g., Camry)"
                    value={vehicleInfo.model}
                    onChange={(e) => setVehicleInfo({...vehicleInfo, model: e.target.value})}
                    className="bg-white/10 border-white/30 text-white placeholder:text-white/50 h-14 text-lg"
                  />
                </div>
              </div>
            )}

            {/* Step 2: Delivery Address */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <div className="text-center mb-8">
                  <MapPin className="h-16 w-16 text-[#E11900] mx-auto mb-4" />
                  <h2 className="text-2xl font-bold text-white mb-2">Where should we deliver it?</h2>
                  <p className="text-white/70">Enter the customer's address</p>
                </div>
                
                <div className="max-w-md mx-auto">
                  <AddressInput
                    label=""
                    value={deliveryAddress}
                    onChange={setDeliveryAddress}
                    required
                    className="[&_input]:bg-white/10 [&_input]:border-white/30 [&_input]:text-white [&_input]:placeholder:text-white/50 [&_input]:h-14 [&_input]:text-lg"
                  />
                </div>
              </div>
            )}

            {/* Step 3: Customer Info */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <div className="text-center mb-8">
                  <User className="h-16 w-16 text-[#E11900] mx-auto mb-4" />
                  <h2 className="text-2xl font-bold text-white mb-2">Who's the customer?</h2>
                  <p className="text-white/70">We need their contact info</p>
                </div>
                
                <div className="space-y-4 max-w-md mx-auto">
                  <Input
                    placeholder="Customer Name"
                    value={customerInfo.name}
                    onChange={(e) => setCustomerInfo({...customerInfo, name: e.target.value})}
                    className="bg-white/10 border-white/30 text-white placeholder:text-white/50 h-14 text-lg"
                  />
                  <Input
                    placeholder="Phone Number"
                    value={customerInfo.phone}
                    onChange={(e) => setCustomerInfo({...customerInfo, phone: e.target.value})}
                    className="bg-white/10 border-white/30 text-white placeholder:text-white/50 h-14 text-lg"
                  />
                </div>
              </div>
            )}

            {/* Step 4: Final Details */}
            {currentStep === 4 && (
              <div className="space-y-6">
                <div className="text-center mb-8">
                  <Clock className="h-16 w-16 text-[#E11900] mx-auto mb-4" />
                  <h2 className="text-2xl font-bold text-white mb-2">When do you need this?</h2>
                  <p className="text-white/70">Choose timing and add any notes</p>
                </div>
                
                <div className="space-y-6 max-w-md mx-auto">
                  <div className="grid grid-cols-2 gap-4">
                    <Button
                      onClick={() => setTimeframe('asap')}
                      variant={timeframe === 'asap' ? "default" : "outline"}
                      className={`h-14 text-lg ${timeframe === 'asap' ? 
                        "bg-[#E11900] hover:bg-[#E11900]/90 text-white" : 
                        "bg-white/10 border-white/30 text-white hover:bg-white/20"
                      }`}
                    >
                      ASAP
                    </Button>
                    <Button
                      onClick={() => setTimeframe('today')}
                      variant={timeframe === 'today' ? "default" : "outline"}
                      className={`h-14 text-lg ${timeframe === 'today' ? 
                        "bg-[#E11900] hover:bg-[#E11900]/90 text-white" : 
                        "bg-white/10 border-white/30 text-white hover:bg-white/20"
                      }`}
                    >
                      Later Today
                    </Button>
                  </div>
                  
                  <Textarea
                    placeholder="Any special instructions? (Optional)"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="bg-white/10 border-white/30 text-white placeholder:text-white/50 min-h-20 text-lg"
                  />
                </div>
              </div>
            )}

          </CardContent>
        </Card>

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-6">
          <Button
            onClick={prevStep}
            variant="outline"
            disabled={currentStep === 1}
            className="bg-white/10 border-white/20 text-white hover:bg-white/20 disabled:opacity-50 h-12 px-6"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>

          {currentStep === totalSteps ? (
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting || !canProceedToNext()}
              className="bg-[#E11900] hover:bg-[#E11900]/90 text-white h-12 px-8 font-semibold"
            >
              {isSubmitting ? "Submitting..." : "Request Driver"}
              <Check className="h-4 w-4 ml-2" />
            </Button>
          ) : (
            <Button
              onClick={nextStep}
              disabled={!canProceedToNext()}
              className="bg-[#E11900] hover:bg-[#E11900]/90 text-white h-12 px-6 disabled:opacity-50"
            >
              Next
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default SimpleDriverRequest;