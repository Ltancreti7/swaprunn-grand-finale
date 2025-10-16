import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import BackButton from "@/components/BackButton";
import SiteHeader from "@/components/SiteHeader";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { AddressInput, addressToString, stringToAddress, AddressData } from "@/components/ui/address-input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronRight, ChevronLeft, Car, MapPin, User, Clock, CheckCircle } from "lucide-react";
import { distanceService } from "@/services/distanceService";
import mapBackgroundImage from "@/assets/map-background.jpg";
import { SuccessBanner } from "@/components/dealer/SuccessBanner";
import { VINScanner } from "@/components/dealer/VINScanner";

interface Driver {
  id: string;
  name: string;
  rating_avg: number;
  rating_count: number;
  available: boolean;
  city_ok: boolean;
}

const DealerRequest = () => {
  const [timeframe, setTimeframe] = useState("");
  const [driversNeeded, setDriversNeeded] = useState("1");
  const [specificDriverId, setSpecificDriverId] = useState("");
  const [availableDrivers, setAvailableDrivers] = useState<Driver[]>([]);
  const [year, setYear] = useState("");
  const [make, setMake] = useState("Toyota");
  const [model, setModel] = useState("");
  const [vin, setVin] = useState("");
  const [transmission, setTransmission] = useState("");
  
  // Trade-in vehicle (driver will drive this home)
  const [tradeYear, setTradeYear] = useState("");
  const [tradeMake, setTradeMake] = useState("");
  const [tradeModel, setTradeModel] = useState("");
  const [tradeTransmission, setTradeTransmission] = useState("");
  const [hasTradeIn, setHasTradeIn] = useState(false);
  
  const [pickupAddress, setPickupAddress] = useState<AddressData>({
    street: "168 Charlestown Rd",
    city: "Claremont",
    state: "NH",
    zip: "03743",
  });
  const [deliveryAddress, setDeliveryAddress] = useState<AddressData>({
    street: "",
    city: "",
    state: "",
    zip: "",
  });
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [specificTime, setSpecificTime] = useState("");
  const [specificDate, setSpecificDate] = useState("");
  const [stockNumber, setStockNumber] = useState("");
  const [estimatedDistance, setEstimatedDistance] = useState(25);
  const [isCalculatingDistance, setIsCalculatingDistance] = useState(false);
  const [notes, setNotes] = useState("");
  const [showSuccessBanner, setShowSuccessBanner] = useState(false);

  // Payment & Delivery Details
  const [paymentMethod, setPaymentMethod] = useState("");
  const [amountToCollect, setAmountToCollect] = useState("");

  // Paperwork for Driver
  const [paperwork, setPaperwork] = useState<string[]>([]);

  // Pre-Delivery Checklist
  const [preDeliveryChecklist, setPreDeliveryChecklist] = useState({
    gasTank: false,
    licensePlate: false,
    paperwork: false,
    carWashed: false,
    vinVerified: false,
  });

  // Step management
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const totalSteps = 5;

  const navigate = useNavigate();
  const { toast } = useToast();
  const { userProfile } = useAuth();

  // Generate years from 2026 to 2005
  const years = Array.from(
    {
      length: 22,
    },
    (_, i) => (2026 - i).toString(),
  );

  // Popular car makes
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
    "Genesis",
    "GMC",
    "Honda",
    "Hyundai",
    "Infiniti",
    "Jeep",
    "Kia",
    "Lexus",
    "Lincoln",
    "Mazda",
    "Mercedes-Benz",
    "Mitsubishi",
    "Nissan",
    "Ram",
    "Subaru",
    "Tesla",
    "Toyota",
    "Volkswagen",
    "Volvo",
  ];

  // Models by make (simplified for demo)
  const modelsForMake: Record<string, string[]> = {
    Toyota: ["Camry", "Corolla", "Prius", "RAV4", "Highlander", "4Runner", "Tacoma", "Tundra"],
    Honda: ["Civic", "Accord", "CR-V", "Pilot", "Ridgeline", "Passport"],
    Ford: ["F-150", "Mustang", "Explorer", "Escape", "Edge", "Expedition"],
    Chevrolet: ["Silverado", "Equinox", "Malibu", "Traverse", "Tahoe", "Suburban"],
    // Add more as needed
  };

  // Distance calculation effect
  useEffect(() => {
    const calculateDistance = async () => {
      if (
        pickupAddress.street &&
        pickupAddress.city &&
        deliveryAddress.street &&
        deliveryAddress.city
      ) {
        setIsCalculatingDistance(true);
        try {
          const distance = await distanceService.calculateDistance(
            addressToString(pickupAddress),
            addressToString(deliveryAddress)
          );
          setEstimatedDistance(distance.distance || 25);
        } catch (error) {
          console.error("Error calculating distance:", error);
          setEstimatedDistance(25); // fallback
        }
        setIsCalculatingDistance(false);
      }
    };

    const timeoutId = setTimeout(calculateDistance, 1000);
    return () => clearTimeout(timeoutId);
  }, [pickupAddress, deliveryAddress]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!userProfile) {
      toast({
        title: "Authentication Required",
        description: "Please log in to submit a delivery request.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const jobData: any = {
        dealer_id: userProfile.id,
        vehicle_year: year,
        vehicle_make: make,
        vehicle_model: model,
        vehicle_vin: vin || null,
        stock_number: stockNumber || null,
        // Trade-in vehicle data
        has_trade_in: hasTradeIn,
        trade_year: hasTradeIn ? tradeYear : null,
        trade_make: hasTradeIn ? tradeMake : null,
        trade_model: hasTradeIn ? tradeModel : null,
        trade_transmission: hasTradeIn ? tradeTransmission : null,
        // Addresses and other data
        pickup_address: addressToString(pickupAddress),
        delivery_address: addressToString(deliveryAddress),
        customer_name: customerName,
        customer_phone: customerPhone,
        estimated_distance: estimatedDistance,
        timeframe: timeframe,
        specific_date: specificDate || null,
        specific_time: specificTime || null,
        drivers_needed: parseInt(driversNeeded),
        specific_driver_id: specificDriverId || null,
        notes: notes || null,
        payment_method: paymentMethod || null,
        amount_to_collect: amountToCollect || null,
        paperwork: paperwork,
        pre_delivery_checklist: preDeliveryChecklist,
        status: "pending",
      };

      const { data, error } = await supabase.from("jobs").insert([jobData]).select();

      if (error) throw error;

      setShowSuccessBanner(true);
      toast({
        title: "Request Submitted!",
        description: "Your delivery request has been submitted successfully. You'll be notified when a driver accepts.",
      });

      // Reset form after successful submission
      setTimeout(() => {
        setShowSuccessBanner(false);
        navigate("/dealer/dashboard");
      }, 3000);

    } catch (error) {
      console.error("Error submitting request:", error);
      toast({
        title: "Submission Failed",
        description: "There was an error submitting your request. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const validateCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return year && make && model;
      case 2:
        if (!hasTradeIn) return true; // No trade-in is valid
        return tradeYear && tradeMake && tradeModel && tradeTransmission;
      case 3:
        return pickupAddress.street && pickupAddress.city && deliveryAddress.street && deliveryAddress.city;
      case 4:
        return customerName && customerPhone;
      case 5:
        return true; // Optional step
      default:
        return false;
    }
  };

  const canProceed = validateCurrentStep();

  if (showSuccessBanner) {
    return <SuccessBanner show={true} message="Request submitted successfully!" onDismiss={() => setShowSuccessBanner(false)} />;
  }

  return (
    <>
      <div
        className="min-h-screen relative bg-black"
        style={{
          backgroundImage: `url(${mapBackgroundImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center top",
          backgroundRepeat: "no-repeat",
          backgroundAttachment: "fixed",
        }}
      >
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/75 via-black/65 to-black/40 z-0"></div>

        <div className="relative z-10 min-h-screen flex items-center justify-center px-4 sm:px-6 py-8">
          <div className="w-full max-w-4xl">
            {/* Centered Logo */}
            <div className="text-center mb-8">
              <img 
                src="/swaprunn-logo-2025.png" 
                alt="SwapRunn" 
                className="h-12 mx-auto mb-6 opacity-90"
              />
              {/* Centered Back Button */}
              <div className="flex justify-center">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => window.history.back()}
                  className="text-white/80 hover:text-white hover:bg-white/10 px-4 py-2"
                >
                  <ChevronLeft className="mr-2 h-4 w-4" />
                  Back to Dashboard
                </Button>
              </div>
            </div>
            
            <div className="text-center mb-12">
              <h1 className="text-4xl lg:text-5xl font-bold tracking-tight mb-4 text-white">
                Request <span className="text-[#E11900]">Driver</span>
              </h1>
              <p className="text-lg text-white/80 max-w-2xl mx-auto mb-12">
                Submit your vehicle delivery request in 5 simple steps
              </p>
              
              {/* Modern Progress Steps */}
              <div className="flex justify-center items-center mb-16">
                <div className="flex items-center space-x-1 bg-white/10 backdrop-blur-sm rounded-full p-2 shadow-2xl">
                  {[
                    { step: 1, label: 'Vehicle', icon: Car },
                    { step: 2, label: 'Trade-In', icon: Car },
                    { step: 3, label: 'Addresses', icon: MapPin },
                    { step: 4, label: 'Customer', icon: User },
                    { step: 5, label: 'Details', icon: Clock }
                  ].map((item, index) => (
                    <div key={item.step} className="flex items-center">
                      <button
                        type="button"
                        onClick={() => setCurrentStep(item.step)}
                        className={`flex items-center space-x-2 px-3 py-2.5 rounded-full transition-all duration-200 text-sm font-medium ${
                          currentStep === item.step
                            ? 'bg-[#E11900] text-white shadow-lg scale-105'
                            : currentStep > item.step
                            ? 'bg-green-600 text-white hover:bg-green-500'
                            : 'text-white/60 hover:text-white hover:bg-white/10'
                        }`}
                      >
                        {currentStep > item.step ? (
                          <CheckCircle className="w-4 h-4" />
                        ) : (
                          <item.icon className="w-4 h-4" />
                        )}
                        <span className="hidden sm:block">{item.label}</span>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <Card className="bg-white/8 backdrop-blur-xl border-white/20 shadow-2xl rounded-2xl overflow-hidden">
              <CardContent className="p-8 lg:p-12">
                <form onSubmit={handleSubmit} className="space-y-8">
                
                {/* Step 1: Vehicle Information */}
                {currentStep === 1 && (
                  <div className="space-y-8">
                    <div className="text-center mb-8">
                      <div className="w-16 h-16 bg-[#E11900]/20 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Car className="w-8 h-8 text-[#E11900]" />
                      </div>
                      <h2 className="text-3xl font-bold text-white mb-3">Vehicle Information</h2>
                      <p className="text-white/70 text-lg">Tell us about the vehicle that needs delivery</p>
                    </div>
                    
                    <div className="max-w-2xl mx-auto">
                      <VINScanner
                        onVINScanned={(vehicleInfo) => {
                          setVin(vehicleInfo.vin);
                          setYear(vehicleInfo.year);
                          setMake(vehicleInfo.make);
                          setModel(vehicleInfo.model);
                          if (vehicleInfo.transmission) {
                            const trans = vehicleInfo.transmission.toLowerCase();
                            if (trans.includes("automatic") || trans.includes("auto")) {
                              setTransmission("automatic");
                            } else if (trans.includes("manual")) {
                              setTransmission("manual");
                            }
                          }
                        }}
                      />
                    </div>
                    
                    <div className="max-w-3xl mx-auto">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                          <Label className="text-white mb-3 block text-sm font-medium">Year *</Label>
                          <Select value={year} onValueChange={setYear}>
                            <SelectTrigger className="bg-white/10 border-white/20 text-white h-12">
                              <SelectValue placeholder="Select Year" />
                            </SelectTrigger>
                            <SelectContent className="bg-gray-900 border-gray-700">
                              {years.map((yearOption) => (
                                <SelectItem key={yearOption} value={yearOption} className="text-white hover:bg-gray-800">
                                  {yearOption}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div>
                          <Label className="text-white mb-3 block text-sm font-medium">Make *</Label>
                          <Select value={make} onValueChange={setMake}>
                            <SelectTrigger className="bg-white/10 border-white/20 text-white h-12">
                              <SelectValue placeholder="Select Make" />
                            </SelectTrigger>
                            <SelectContent className="bg-gray-900 border-gray-700">
                              {makes.map((makeOption) => (
                                <SelectItem key={makeOption} value={makeOption} className="text-white hover:bg-gray-800">
                                  {makeOption}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div>
                          <Label className="text-white mb-3 block text-sm font-medium">Model *</Label>
                          <Input
                            value={model}
                            onChange={(e) => setModel(e.target.value)}
                            placeholder="Enter model"
                            className="bg-white/10 border-white/20 text-white placeholder:text-white/50 h-12"
                            required
                          />
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                        <div>
                          <Label className="text-white mb-3 block text-sm font-medium">VIN (Optional)</Label>
                          <Input
                            value={vin}
                            onChange={(e) => setVin(e.target.value)}
                            placeholder="Vehicle Identification Number"
                            className="bg-white/10 border-white/20 text-white placeholder:text-white/50 h-12"
                          />
                        </div>
                        <div>
                          <Label className="text-white mb-3 block text-sm font-medium">Stock Number (Optional)</Label>
                          <Input
                            value={stockNumber}
                            onChange={(e) => setStockNumber(e.target.value)}
                            placeholder="Stock number"
                            className="bg-white/10 border-white/20 text-white placeholder:text-white/50 h-12"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 2: Trade-In Vehicle */}
                {currentStep === 2 && (
                  <div className="space-y-8">
                    <div className="text-center mb-8">
                      <div className="w-16 h-16 bg-[#E11900]/20 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Car className="w-8 h-8 text-[#E11900]" />
                      </div>
                      <h2 className="text-3xl font-bold text-white mb-3">Trade-In Vehicle</h2>
                      <p className="text-white/70 text-lg">Is there a trade-in vehicle the driver will need to drive back?</p>
                    </div>
                    
                    <div className="max-w-2xl mx-auto">
                      <div className="flex items-center justify-center space-x-4 mb-8 p-6 bg-white/5 rounded-xl border border-white/10">
                        <Checkbox
                          id="hasTradeIn"
                          checked={hasTradeIn}
                          onCheckedChange={(checked) => setHasTradeIn(!!checked)}
                          className="border-white/40 data-[state=checked]:bg-[#E11900] w-5 h-5"
                        />
                        <Label htmlFor="hasTradeIn" className="text-white text-lg font-medium cursor-pointer">
                          Yes, there is a trade-in vehicle
                        </Label>
                      </div>
                    </div>
                    
                    {hasTradeIn && (
                      <div className="max-w-3xl mx-auto">
                        <div className="space-y-8 bg-white/5 rounded-xl p-8 border border-white/10">
                          <div className="text-center mb-6">
                            <h3 className="text-xl font-semibold text-white mb-2">Trade-In Vehicle Details</h3>
                            <p className="text-white/60">The driver will drive this vehicle back from the delivery location</p>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div>
                              <Label className="text-white mb-3 block text-sm font-medium">Year *</Label>
                              <Select value={tradeYear} onValueChange={setTradeYear}>
                                <SelectTrigger className="bg-white/10 border-white/20 text-white h-12">
                                  <SelectValue placeholder="Select Year" />
                                </SelectTrigger>
                                <SelectContent className="bg-gray-900 border-gray-700">
                                  {years.map((yearOption) => (
                                    <SelectItem key={yearOption} value={yearOption} className="text-white hover:bg-gray-800">
                                      {yearOption}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                            
                            <div>
                              <Label className="text-white mb-3 block text-sm font-medium">Make *</Label>
                              <Select value={tradeMake} onValueChange={setTradeMake}>
                                <SelectTrigger className="bg-white/10 border-white/20 text-white h-12">
                                  <SelectValue placeholder="Select Make" />
                                </SelectTrigger>
                                <SelectContent className="bg-gray-900 border-gray-700">
                                  {makes.map((makeOption) => (
                                    <SelectItem key={makeOption} value={makeOption} className="text-white hover:bg-gray-800">
                                      {makeOption}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                            
                            <div>
                              <Label className="text-white mb-3 block text-sm font-medium">Model *</Label>
                              <Input
                                value={tradeModel}
                                onChange={(e) => setTradeModel(e.target.value)}
                                placeholder="Enter model"
                                className="bg-white/10 border-white/20 text-white placeholder:text-white/50 h-12"
                                required
                              />
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                              <Label className="text-white mb-3 block text-sm font-medium">Transmission *</Label>
                              <Select value={tradeTransmission} onValueChange={setTradeTransmission}>
                                <SelectTrigger className="bg-white/10 border-white/20 text-white h-12">
                                  <SelectValue placeholder="Select transmission" />
                                </SelectTrigger>
                                <SelectContent className="bg-gray-900 border-gray-700">
                                  <SelectItem value="automatic" className="text-white hover:bg-gray-800">Automatic</SelectItem>
                                  <SelectItem value="manual" className="text-white hover:bg-gray-800">Manual</SelectItem>
                                  <SelectItem value="cvt" className="text-white hover:bg-gray-800">CVT</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="flex items-end">
                              <div className="bg-amber-500/20 border border-amber-500/30 rounded-lg p-4 w-full">
                                <p className="text-amber-200 text-sm">
                                  <strong>Note:</strong> We'll match you with drivers who can operate this transmission type.
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {!hasTradeIn && (
                      <div className="max-w-2xl mx-auto">
                        <div className="bg-green-500/20 border border-green-500/30 rounded-xl p-6 text-center">
                          <p className="text-green-200 text-lg">
                            <strong>One-way delivery:</strong> The driver will only deliver the vehicle and return via other means.
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Step 3: Pickup & Delivery */}
                {currentStep === 3 && (
                  <div className="space-y-6">
                    <div className="text-center mb-6">
                      <MapPin className="w-12 h-12 text-[#E11900] mx-auto mb-3" />
                      <h2 className="text-2xl font-bold text-white mb-2">Pickup & Delivery</h2>
                      <p className="text-white/60">Where should we pick up and deliver the vehicle?</p>
                    </div>
                    
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <div>
                        <Label className="text-white mb-3 block font-medium">Pickup Address *</Label>
                        <AddressInput
                          value={pickupAddress}
                          onChange={setPickupAddress}
                          label="Pickup Address"
                          className="bg-white/10 border-white/20 text-white"
                        />
                      </div>
                      
                      <div>
                        <Label className="text-white mb-3 block font-medium">Delivery Address *</Label>
                        <AddressInput
                          value={deliveryAddress}
                          onChange={setDeliveryAddress}
                          label="Delivery Address"
                          className="bg-white/10 border-white/20 text-white"
                        />
                      </div>
                    </div>
                    
                    {estimatedDistance > 0 && (
                      <div className="bg-blue-500/20 border border-blue-500/30 rounded-lg p-4">
                        <p className="text-blue-200">
                          <strong>Estimated Distance:</strong> {estimatedDistance} miles
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {/* Step 4: Customer Information */}
                {currentStep === 4 && (
                  <div className="space-y-6">
                    <div className="text-center mb-6">
                      <User className="w-12 h-12 text-[#E11900] mx-auto mb-3" />
                      <h2 className="text-2xl font-bold text-white mb-2">Customer Information</h2>
                      <p className="text-white/60">Who will receive the vehicle?</p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label className="text-white mb-2 block">Customer Name *</Label>
                        <Input
                          value={customerName}
                          onChange={(e) => setCustomerName(e.target.value)}
                          placeholder="Customer name"
                          className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                          required
                        />
                      </div>
                      <div>
                        <Label className="text-white mb-2 block">Customer Phone *</Label>
                        <Input
                          value={customerPhone}
                          onChange={(e) => setCustomerPhone(e.target.value)}
                          placeholder="Customer phone"
                          className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                          required
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 5: Timing & Details */}
                {currentStep === 5 && (
                  <div className="space-y-6">
                    <div className="text-center mb-6">
                      <Clock className="w-12 h-12 text-[#E11900] mx-auto mb-3" />
                      <h2 className="text-2xl font-bold text-white mb-2">Timing & Details</h2>
                      <p className="text-white/60">When do you need this delivery completed?</p>
                    </div>
                    
                    <div>
                      <Label className="text-white mb-3 block">Delivery Timeframe</Label>
                      <Select value={timeframe} onValueChange={setTimeframe}>
                        <SelectTrigger className="bg-white/10 border-white/20 text-white">
                          <SelectValue placeholder="When do you need this delivered?" />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-900 border-gray-700">
                          <SelectItem value="asap" className="text-white hover:bg-gray-800">ASAP (Today)</SelectItem>
                          <SelectItem value="today" className="text-white hover:bg-gray-800">Today</SelectItem>
                          <SelectItem value="tomorrow" className="text-white hover:bg-gray-800">Tomorrow</SelectItem>
                          <SelectItem value="this_week" className="text-white hover:bg-gray-800">This Week</SelectItem>
                          <SelectItem value="next_week" className="text-white hover:bg-gray-800">Next Week</SelectItem>
                          <SelectItem value="flexible" className="text-white hover:bg-gray-800">Flexible</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label className="text-white mb-2 block">Preferred Date (Optional)</Label>
                        <Input
                          type="date"
                          value={specificDate}
                          onChange={(e) => setSpecificDate(e.target.value)}
                          className="bg-white/10 border-white/20 text-white"
                        />
                      </div>
                      <div>
                        <Label className="text-white mb-2 block">Preferred Time (Optional)</Label>
                        <Input
                          type="time"
                          value={specificTime}
                          onChange={(e) => setSpecificTime(e.target.value)}
                          className="bg-white/10 border-white/20 text-white"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <Label className="text-white mb-2 block">Additional Notes (Optional)</Label>
                      <Textarea
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="Any special instructions, customer preferences, or delivery notes..."
                        className="min-h-[120px] bg-white/10 border-white/20 text-white placeholder:text-white/50 resize-none"
                        rows={4}
                      />
                    </div>
                  </div>
                )}

                {/* Navigation Buttons */}
                <div className="flex justify-between items-center pt-12 mt-12 border-t border-white/20">
                  {currentStep > 1 ? (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setCurrentStep(currentStep - 1)}
                      className="border-white/40 text-white hover:bg-white/10 hover:border-white/60 px-8 py-3 rounded-lg font-medium transition-all duration-200"
                    >
                      <ChevronLeft className="w-4 h-4 mr-2" />
                      Previous
                    </Button>
                  ) : (
                    <div></div>
                  )}
                  
                  <div className="text-center">
                    <span className="text-white/50 text-sm">
                      Step {currentStep} of {totalSteps}
                    </span>
                  </div>
                  
                  {currentStep < totalSteps ? (
                    <Button
                      type="button"
                      onClick={() => setCurrentStep(currentStep + 1)}
                      disabled={!canProceed}
                      className="bg-[#E11900] hover:bg-[#CC1600] text-white disabled:opacity-50 disabled:cursor-not-allowed px-8 py-3 rounded-lg font-medium transition-all duration-200 shadow-lg"
                    >
                      Next
                      <ChevronRight className="w-4 h-4 ml-2" />
                    </Button>
                  ) : (
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="bg-gradient-to-r from-[#E11900] to-[#CC1600] hover:from-[#CC1600] hover:to-[#B01400] text-white px-12 py-3 rounded-lg font-medium transition-all duration-200 shadow-lg disabled:opacity-50"
                    >
                      {isSubmitting ? (
                        <div className="flex items-center">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Submitting...
                        </div>
                      ) : (
                        "Request Driver"
                      )}
                    </Button>
                  )}
                </div>
              </form>
            </CardContent>
          </Card>
          </div>
        </div>
      </div>
    </>
  );
};

export default DealerRequest;