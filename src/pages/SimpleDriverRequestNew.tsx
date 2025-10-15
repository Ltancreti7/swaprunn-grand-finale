import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AddressInput, AddressData } from "@/components/ui/address-input";
import { ArrowLeft, ArrowRight, Car, MapPin, User, Clock, Check, ChevronLeft, ChevronRight } from "lucide-react";
import mapBackgroundImage from "@/assets/map-background.jpg";
import { formatPhoneNumber, cleanPhoneNumber } from "@/lib/utils";
import { useSwipeable } from 'react-swipeable';
import { useMobileCapacitor } from "@/hooks/useMobileCapacitor";
import { Haptics, ImpactStyle } from '@capacitor/haptics';

const SimpleDriverRequest = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { userProfile } = useAuth();
  const { isNative } = useMobileCapacitor();



  // Multi-step wizard state
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 4;

  // Vehicle data for dropdowns
  const years = Array.from({ length: 22 }, (_, i) => (2026 - i).toString());
  
  const makes = [
    "Acura", "Audi", "BMW", "Buick", "Cadillac", "Chevrolet", "Chrysler", "Dodge", 
    "Ford", "GMC", "Honda", "Hyundai", "Infiniti", "Jaguar", "Jeep", "Kia", 
    "Land Rover", "Lexus", "Lincoln", "Mazda", "Mercedes-Benz", "Mitsubishi", 
    "Nissan", "Porsche", "Ram", "Subaru", "Tesla", "Toyota", "Volkswagen", "Volvo"
  ];

  const modelsByMake: { [key: string]: string[] } = {
    "Toyota": ["Camry", "Corolla", "RAV4", "Highlander", "Prius", "Tacoma", "Tundra", "4Runner", "Sienna", "Avalon", "C-HR", "Venza", "Sequoia"],
    "Honda": ["Civic", "Accord", "CR-V", "Pilot", "HR-V", "Passport", "Ridgeline", "Odyssey", "Insight", "Fit", "Clarity"],
    "Ford": ["F-150", "Escape", "Explorer", "Mustang", "Edge", "Expedition", "Ranger", "Bronco", "Fusion", "Transit", "EcoSport", "F-250", "F-350"],
    "Chevrolet": ["Silverado", "Equinox", "Malibu", "Traverse", "Tahoe", "Suburban", "Colorado", "Camaro", "Cruze", "Blazer", "Trax", "Spark"],
    "Nissan": ["Altima", "Sentra", "Rogue", "Pathfinder", "Frontier", "Titan", "Murano", "Versa", "Armada", "Leaf", "Kicks", "NV200"],
    "BMW": ["3 Series", "5 Series", "X3", "X5", "7 Series", "X1", "4 Series", "X7", "2 Series", "i4", "iX", "Z4"],
    "Mercedes-Benz": ["C-Class", "E-Class", "GLC", "GLE", "A-Class", "S-Class", "GLS", "CLA", "GLB", "G-Class", "GLA", "EQS"],
    "Audi": ["A4", "Q5", "A3", "Q7", "A6", "Q3", "A8", "Q8", "e-tron", "A5", "Q4", "TT"],
    "Lexus": ["RX", "ES", "NX", "GX", "IS", "LS", "LX", "UX", "RC", "LC", "LFA", "CT"],
    "Hyundai": ["Elantra", "Tucson", "Santa Fe", "Sonata", "Palisade", "Kona", "Accent", "Venue", "Genesis", "Ioniq", "Veloster"],
    "Jeep": ["Wrangler", "Grand Cherokee", "Cherokee", "Compass", "Renegade", "Gladiator", "Grand Wagoneer"],
    "Kia": ["Optima", "Sorento", "Sportage", "Soul", "Forte", "Stinger", "Telluride", "Rio", "Niro"],
    "Subaru": ["Outback", "Forester", "Impreza", "Legacy", "Crosstrek", "Ascent", "WRX", "BRZ"],
    "Dodge": ["Challenger", "Charger", "Durango", "Journey", "Grand Caravan"],
    "Ram": ["1500", "2500", "3500", "ProMaster", "ProMaster City"],
    "GMC": ["Sierra", "Terrain", "Acadia", "Yukon", "Canyon", "Savana"],
    "Buick": ["Enclave", "Encore", "Envision", "Lacrosse"],
    "Cadillac": ["Escalade", "XT5", "CT5", "XT4", "CT4", "Lyriq"],
    "Tesla": ["Model 3", "Model S", "Model X", "Model Y", "Cybertruck"],
    "Volvo": ["XC90", "XC60", "S60", "V60", "XC40", "S90", "V90"],
    "Mazda": ["CX-5", "CX-9", "Mazda3", "Mazda6", "CX-30", "MX-5 Miata"],
    "Acura": ["MDX", "RDX", "TLX", "ILX", "NSX", "RLX"],
    "Infiniti": ["Q50", "QX60", "Q60", "QX80", "QX50"],
    "Lincoln": ["Navigator", "Aviator", "Corsair", "Continental", "MKZ"],
    "Land Rover": ["Range Rover", "Discovery", "Defender", "Evoque", "Velar"],
    "Jaguar": ["F-Pace", "XF", "XE", "I-Pace", "F-Type"],
    "Porsche": ["911", "Cayenne", "Macan", "Panamera", "Taycan", "718"],
    "Mitsubishi": ["Outlander", "Eclipse Cross", "Mirage", "Outlander Sport"],
    "Chrysler": ["Pacifica", "300", "Voyager"],
    "Volkswagen": ["Jetta", "Passat", "Tiguan", "Atlas", "Golf", "ID.4"]
  };

  const [availableModels, setAvailableModels] = useState<string[]>([]);

  // Essential fields only
  const [vehicleInfo, setVehicleInfo] = useState({
    year: "",
    make: "",
    model: "",
    vin: ""
  });

  // Update available models when make changes
  useEffect(() => {
    if (vehicleInfo.make && modelsByMake[vehicleInfo.make]) {
      setAvailableModels(modelsByMake[vehicleInfo.make]);
      // Reset model if it's not available for the new make
      if (vehicleInfo.model && !modelsByMake[vehicleInfo.make].includes(vehicleInfo.model)) {
        setVehicleInfo(prev => ({ ...prev, model: "" }));
      }
    } else {
      setAvailableModels([]);
      setVehicleInfo(prev => ({ ...prev, model: "" }));
    }
  }, [vehicleInfo.make]);

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
  const [pickupAddress] = useState<AddressData>({
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

  // Swipe handlers for mobile navigation
  const handleSwipeLeft = async () => {
    // Swipe left = next step
    if (canProceedToNext() && currentStep < totalSteps) {
      // Add haptic feedback on native platforms
      if (isNative) {
        try {
          await Haptics.impact({ style: ImpactStyle.Light });
        } catch (error) {
          console.log('Haptics not available:', error);
        }
      }
      nextStep();
    }
  };

  const handleSwipeRight = async () => {
    // Swipe right = previous step
    if (currentStep > 1) {
      // Add haptic feedback on native platforms
      if (isNative) {
        try {
          await Haptics.impact({ style: ImpactStyle.Light });
        } catch (error) {
          console.log('Haptics not available:', error);
        }
      }
      prevStep();
    }
  };

  // Configure swipe gestures
  const swipeHandlers = useSwipeable({
    onSwipedLeft: handleSwipeLeft,
    onSwipedRight: handleSwipeRight,
    trackMouse: false, // Only track touch events
    delta: 50, // Minimum swipe distance
  });

  const handleSubmit = async () => {
    // Check if user profile is properly loaded
    if (!userProfile?.dealer_id) {
      toast({
        title: "Account Setup Required",
        description: "Your dealer account is not properly configured. Please log out and log back in, or contact support.",
        variant: "destructive"
      });
      return;
    }

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
          type: 'delivery',
          pickup_address: `${pickupAddress.street}, ${pickupAddress.city}, ${pickupAddress.state} ${pickupAddress.zip}`,
          delivery_address: `${deliveryAddress.street}, ${deliveryAddress.city}, ${deliveryAddress.state} ${deliveryAddress.zip}`,
          year: parseInt(vehicleInfo.year),
          make: vehicleInfo.make,
          model: vehicleInfo.model,
          vin: vehicleInfo.vin,
          customer_name: customerInfo.name,
          customer_phone: cleanPhoneNumber(customerInfo.phone),
          timeframe: timeframe,
          notes: notes,
          status: 'open',
          requires_two: false,
          distance_miles: 25
        });

      if (error) throw error;

      toast({
        title: "Driver Request Submitted!",
        description: "We'll notify you when a driver accepts the job.",
      });

      navigate('/dealer/dashboard');
    } catch (error) {
      console.error('Error submitting request:', error);
      
      let errorMessage = "Failed to submit request. Please try again.";
      
      // Provide more specific error messages
      if (error instanceof Error) {
        if (error.message.includes('row-level security')) {
          errorMessage = "Authentication error. Please log out and log back in.";
        } else if (error.message.includes('dealer_id')) {
          errorMessage = "Account setup incomplete. Please contact support.";
        } else if (error.message.includes('invalid')) {
          errorMessage = "Please check all fields are filled correctly.";
        } else if (error.message.includes('network')) {
          errorMessage = "Network error. Please check your connection.";
        }
      }
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Show loading state
  if (!userProfile) {
    return (
      <div className="min-h-screen relative flex items-center justify-center" style={{
        backgroundImage: `url(${mapBackgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed'
      }}>
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70 z-0"></div>
        <div className="relative z-10 text-white text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative" style={{
      backgroundImage: `url(${mapBackgroundImage})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      backgroundAttachment: 'fixed'
    }}>
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70 z-0"></div>
      
      <div className="relative z-10 container mx-auto px-3 sm:px-4 py-8 max-w-2xl">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Button
            onClick={() => navigate('/dealer/dashboard')}
            variant="outline"
            size="icon"
            className="bg-white/5 backdrop-blur-sm border-white/10 text-white hover:bg-white/10 hover:border-[#E11900]/30 transition-all duration-200"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-white">Request a Driver</h1>
            <p className="text-white/60">Step {currentStep} of {totalSteps}</p>
          </div>
        </div>

        {/* Progress Steps */}
        <div className="mb-8 bg-white/5 backdrop-blur-sm rounded-2xl p-3 sm:p-6 border border-white/10 overflow-hidden">
          {/* Mobile: Grid Layout */}
          <div className="grid grid-cols-4 gap-1 sm:hidden">
            {steps.map((step) => {
              const Icon = step.icon;
              const isCompleted = step.number < currentStep;
              const isActive = step.number === currentStep;
              
              return (
                <div key={step.number} className="flex flex-col items-center">
                  <div className={`flex items-center justify-center w-8 h-8 rounded-full border-2 transition-all duration-300 ${
                    isCompleted 
                      ? 'bg-[#E11900] border-[#E11900] text-white shadow-lg shadow-[#E11900]/20' 
                      : isActive 
                      ? 'border-[#E11900] text-[#E11900] bg-white/10 shadow-lg shadow-[#E11900]/10' 
                      : 'border-white/20 text-white/40 bg-white/5'
                  }`}>
                    {isCompleted ? <Check className="h-3 w-3" /> : <Icon className="h-3 w-3" />}
                  </div>
                  <span className={`mt-1 text-[9px] font-medium text-center leading-tight ${
                    isActive ? 'text-white' : isCompleted ? 'text-white/80' : 'text-white/50'
                  }`}>
                    {step.title}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Desktop: Horizontal Layout */}
          <div className="hidden sm:flex items-center justify-center gap-4">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isCompleted = step.number < currentStep;
              const isActive = step.number === currentStep;
              
              return (
                <div key={step.number} className="flex items-center">
                  <div className="flex flex-col items-center">
                    <div className={`flex items-center justify-center w-12 h-12 rounded-full border-2 transition-all duration-300 ${
                      isCompleted 
                        ? 'bg-[#E11900] border-[#E11900] text-white shadow-lg shadow-[#E11900]/20' 
                        : isActive 
                        ? 'border-[#E11900] text-[#E11900] bg-white/10 shadow-lg shadow-[#E11900]/10' 
                        : 'border-white/20 text-white/40 bg-white/5'
                    }`}>
                      {isCompleted ? <Check className="h-5 w-5" /> : <Icon className="h-5 w-5" />}
                    </div>
                    <span className={`mt-2 text-sm font-medium text-center ${
                      isActive ? 'text-white' : isCompleted ? 'text-white/80' : 'text-white/50'
                    }`}>
                      {step.title}
                    </span>
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`w-8 h-px mx-4 transition-all duration-300 ${
                      isCompleted ? 'bg-[#E11900] shadow-sm shadow-[#E11900]/20' : 'bg-white/10'
                    }`} />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Step Content Card */}
        <Card {...swipeHandlers} className="bg-white/5 backdrop-blur-sm border border-white/10 shadow-2xl min-h-[450px] rounded-2xl relative overflow-hidden">
          {/* Swipe indicators */}
          <div className="absolute top-1/2 left-2 transform -translate-y-1/2 opacity-20 pointer-events-none">
            {currentStep > 1 && <ChevronLeft className="h-8 w-8 text-white" />}
          </div>
          <div className="absolute top-1/2 right-2 transform -translate-y-1/2 opacity-20 pointer-events-none">
            {currentStep < totalSteps && canProceedToNext() && <ChevronRight className="h-8 w-8 text-white" />}
          </div>
          <CardContent className="p-8">
            
            {/* Step 1: Vehicle Info */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <div className="text-center mb-8">
                  <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2 break-words">What vehicle needs delivery?</h2>
                  <p className="text-white/70 text-base sm:text-lg break-words">Tell us about the vehicle</p>
                </div>
                
                <div className="space-y-4 max-w-md mx-auto w-full min-w-0">
                  <Select value={vehicleInfo.year} onValueChange={(value) => setVehicleInfo({...vehicleInfo, year: value})}>
                    <SelectTrigger className="bg-black/30 backdrop-blur-sm border border-white/20 text-white h-14 text-base sm:text-lg rounded-xl focus:border-[#E11900]/50 focus:ring-2 focus:ring-[#E11900]/20 transition-all duration-200 [&>span]:text-white data-[placeholder]:text-white/40 w-full min-w-0">
                      <SelectValue placeholder="Select Year" />
                    </SelectTrigger>
                    <SelectContent className="bg-black/95 backdrop-blur-sm border-white/20 max-h-60">
                      {years.map((year) => (
                        <SelectItem key={year} value={year} className="text-white hover:bg-white/10 focus:bg-[#E11900]/20 break-words">
                          {year}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select value={vehicleInfo.make} onValueChange={(value) => setVehicleInfo({...vehicleInfo, make: value})}>
                    <SelectTrigger className="bg-black/30 backdrop-blur-sm border border-white/20 text-white h-14 text-base sm:text-lg rounded-xl focus:border-[#E11900]/50 focus:ring-2 focus:ring-[#E11900]/20 transition-all duration-200 [&>span]:text-white data-[placeholder]:text-white/40 w-full min-w-0">
                      <SelectValue placeholder="Select Make" />
                    </SelectTrigger>
                    <SelectContent className="bg-black/95 backdrop-blur-sm border-white/20 max-h-60">
                      {makes.map((make) => (
                        <SelectItem key={make} value={make} className="text-white hover:bg-white/10 focus:bg-[#E11900]/20 break-words">
                          {make}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select 
                    value={vehicleInfo.model} 
                    onValueChange={(value) => setVehicleInfo({...vehicleInfo, model: value})}
                    disabled={!vehicleInfo.make}
                  >
                    <SelectTrigger className="bg-black/30 backdrop-blur-sm border border-white/20 text-white h-14 text-base sm:text-lg rounded-xl focus:border-[#E11900]/50 focus:ring-2 focus:ring-[#E11900]/20 transition-all duration-200 [&>span]:text-white data-[placeholder]:text-white/40 disabled:opacity-50 w-full min-w-0">
                      <SelectValue placeholder={vehicleInfo.make ? "Select Model" : "Select Make First"} />
                    </SelectTrigger>
                    <SelectContent className="bg-black/95 backdrop-blur-sm border-white/20 max-h-60">
                      {availableModels.map((model) => (
                        <SelectItem key={model} value={model} className="text-white hover:bg-white/10 focus:bg-[#E11900]/20 break-words">
                          {model}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  {/* Optional VIN field */}
                  <Input
                    placeholder="VIN (Optional)"
                    value={vehicleInfo.vin}
                    onChange={(e) => setVehicleInfo({...vehicleInfo, vin: e.target.value})}
                    className="bg-black/30 backdrop-blur-sm border border-white/20 text-white placeholder:text-white/40 h-14 text-base sm:text-lg rounded-xl focus:border-[#E11900]/50 focus:ring-2 focus:ring-[#E11900]/20 transition-all duration-200 w-full min-w-0"
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
                
                <div className="space-y-4 max-w-md mx-auto">
                  <Input
                    placeholder="Street Address"
                    value={deliveryAddress.street}
                    onChange={(e) => setDeliveryAddress({...deliveryAddress, street: e.target.value})}
                    className="bg-black/30 backdrop-blur-sm border border-white/20 text-white placeholder:text-white/40 h-14 text-lg rounded-xl focus:border-[#E11900]/50 focus:ring-2 focus:ring-[#E11900]/20 transition-all duration-200"
                  />
                  <div className="grid grid-cols-2 gap-3">
                    <Input
                      placeholder="City"
                      value={deliveryAddress.city}
                      onChange={(e) => setDeliveryAddress({...deliveryAddress, city: e.target.value})}
                      className="bg-black/30 backdrop-blur-sm border border-white/20 text-white placeholder:text-white/40 h-14 text-lg rounded-xl focus:border-[#E11900]/50 focus:ring-2 focus:ring-[#E11900]/20 transition-all duration-200"
                    />
                    <Input
                      placeholder="State"
                      value={deliveryAddress.state}
                      onChange={(e) => setDeliveryAddress({...deliveryAddress, state: e.target.value})}
                      className="bg-black/30 backdrop-blur-sm border border-white/20 text-white placeholder:text-white/40 h-14 text-lg rounded-xl focus:border-[#E11900]/50 focus:ring-2 focus:ring-[#E11900]/20 transition-all duration-200"
                    />
                  </div>
                  <Input
                    placeholder="ZIP Code"
                    value={deliveryAddress.zip}
                    onChange={(e) => setDeliveryAddress({...deliveryAddress, zip: e.target.value})}
                    className="bg-black/30 backdrop-blur-sm border border-white/20 text-white placeholder:text-white/40 h-14 text-lg rounded-xl focus:border-[#E11900]/50 focus:ring-2 focus:ring-[#E11900]/20 transition-all duration-200"
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
                    className="bg-black/30 backdrop-blur-sm border border-white/20 text-white placeholder:text-white/40 h-14 text-lg rounded-xl focus:border-[#E11900]/50 focus:ring-2 focus:ring-[#E11900]/20 transition-all duration-200"
                  />
                  <Input
                    placeholder="(802) 444-4444"
                    value={customerInfo.phone}
                    onChange={(e) => {
                      const formatted = formatPhoneNumber(e.target.value);
                      setCustomerInfo({...customerInfo, phone: formatted});
                    }}
                    className="bg-black/30 backdrop-blur-sm border border-white/20 text-white placeholder:text-white/40 h-14 text-lg rounded-xl focus:border-[#E11900]/50 focus:ring-2 focus:ring-[#E11900]/20 transition-all duration-200"
                    maxLength={14} // (xxx) xxx-xxxx = 14 characters
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
                      className={`h-14 text-lg rounded-xl transition-all duration-200 ${timeframe === 'asap' ? 
                        "bg-[#E11900] hover:bg-[#E11900]/90 text-white shadow-lg shadow-[#E11900]/20" : 
                        "bg-white/5 backdrop-blur-sm border border-white/20 text-white hover:bg-white/10 hover:border-[#E11900]/30"
                      }`}
                    >
                      ASAP
                    </Button>
                    <Button
                      onClick={() => setTimeframe('today')}
                      variant={timeframe === 'today' ? "default" : "outline"}
                      className={`h-14 text-lg rounded-xl transition-all duration-200 ${timeframe === 'today' ? 
                        "bg-[#E11900] hover:bg-[#E11900]/90 text-white shadow-lg shadow-[#E11900]/20" : 
                        "bg-white/5 backdrop-blur-sm border border-white/20 text-white hover:bg-white/10 hover:border-[#E11900]/30"
                      }`}
                    >
                      Later Today
                    </Button>
                  </div>
                  
                  <Textarea
                    placeholder="Any special instructions? (Optional)"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="bg-black/30 backdrop-blur-sm border border-white/20 text-white placeholder:text-white/40 min-h-20 text-lg rounded-xl focus:border-[#E11900]/50 focus:ring-2 focus:ring-[#E11900]/20 transition-all duration-200"
                  />
                </div>
              </div>
            )}

          </CardContent>
          
          {/* Mobile Swipe Hint */}
          <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex items-center gap-2 text-white/40 text-xs sm:hidden">
            {currentStep > 1 && <span>← Swipe</span>}
            <div className="flex gap-1">
              {Array.from({ length: totalSteps }).map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full transition-all duration-200 ${
                    index + 1 === currentStep ? 'bg-[#E11900]' : 'bg-white/20'
                  }`}
                />
              ))}
            </div>
            {currentStep < totalSteps && canProceedToNext() && <span>Swipe →</span>}
          </div>
        </Card>

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-8">
          <Button
            onClick={prevStep}
            variant="outline"
            disabled={currentStep === 1}
            className="bg-white/5 backdrop-blur-sm border border-white/20 text-white hover:bg-white/10 hover:border-[#E11900]/30 disabled:opacity-50 h-12 px-6 rounded-xl transition-all duration-200"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>

          {currentStep === totalSteps ? (
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting || !canProceedToNext()}
              className="bg-[#E11900] hover:bg-[#E11900]/90 text-white h-12 px-8 font-semibold rounded-xl shadow-lg shadow-[#E11900]/20 hover:shadow-[#E11900]/30 transition-all duration-200 disabled:opacity-50"
            >
              {isSubmitting ? "Submitting..." : "Request Driver"}
              <Check className="h-4 w-4 ml-2" />
            </Button>
          ) : (
            <Button
              onClick={nextStep}
              disabled={!canProceedToNext()}
              className="bg-[#E11900] hover:bg-[#E11900]/90 text-white h-12 px-6 rounded-xl shadow-lg shadow-[#E11900]/20 hover:shadow-[#E11900]/30 transition-all duration-200 disabled:opacity-50"
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