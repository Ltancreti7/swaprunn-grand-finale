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
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown } from "lucide-react";
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
  const [make, setMake] = useState("Toyota"); // Default to Toyota
  const [model, setModel] = useState("");
  const [vin, setVin] = useState("");
  const [transmission, setTransmission] = useState("");
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

  // Collapsible states - all open by default
  const [openSections, setOpenSections] = useState({
    vehicle: false,
    pickup: false,
    customer: false,
    driver: false,
    delivery: false,
    notes: false,
  });
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

  // Brand-specific models mapping
  const brandModels: Record<string, string[]> = {
    Acura: ["ILX", "TLX", "RLX", "RDX", "MDX", "NSX"],
    Audi: ["A3", "A4", "A5", "A6", "A7", "A8", "Q3", "Q5", "Q7", "Q8", "TT", "R8"],
    BMW: ["2 Series", "3 Series", "4 Series", "5 Series", "6 Series", "7 Series", "X1", "X3", "X5", "X7", "Z4"],
    Buick: ["Encore", "Envision", "Enclave", "Regal", "LaCrosse"],
    Cadillac: ["ATS", "CTS", "XTS", "XT4", "XT5", "XT6", "Escalade"],
    Chevrolet: [
      "Spark",
      "Sonic",
      "Cruze",
      "Malibu",
      "Impala",
      "Camaro",
      "Corvette",
      "Trax",
      "Equinox",
      "Traverse",
      "Tahoe",
      "Suburban",
      "Silverado",
      "Colorado",
    ],
    Chrysler: ["300", "Pacifica", "Voyager"],
    Dodge: ["Charger", "Challenger", "Journey", "Durango", "Ram 1500", "Ram 2500"],
    Ford: [
      "Fiesta",
      "Focus",
      "Fusion",
      "Mustang",
      "EcoSport",
      "Escape",
      "Edge",
      "Explorer",
      "Expedition",
      "F-150",
      "F-250",
      "F-350",
    ],
    GMC: ["Terrain", "Acadia", "Yukon", "Sierra", "Canyon"],
    Honda: ["Fit", "Civic", "Insight", "Accord", "HR-V", "CR-V", "Passport", "Pilot", "Ridgeline"],
    Hyundai: ["Accent", "Elantra", "Sonata", "Veloster", "Genesis", "Kona", "Tucson", "Santa Fe", "Palisade"],
    Infiniti: ["Q50", "Q60", "Q70", "QX30", "QX50", "QX60", "QX80"],
    Jaguar: ["XE", "XF", "XJ", "F-TYPE", "E-PACE", "F-PACE", "I-PACE"],
    Jeep: ["Compass", "Cherokee", "Grand Cherokee", "Wrangler", "Gladiator", "Renegade"],
    Kia: ["Rio", "Forte", "Optima", "Stinger", "Soul", "Sportage", "Sorento", "Telluride"],
    "Land Rover": [
      "Discovery Sport",
      "Discovery",
      "Range Rover Evoque",
      "Range Rover Velar",
      "Range Rover",
      "Range Rover Sport",
    ],
    Lexus: ["IS", "ES", "GS", "LS", "LC", "NX", "RX", "GX", "LX"],
    Lincoln: ["MKZ", "Continental", "MKC", "Corsair", "Nautilus", "Aviator", "Navigator"],
    Mazda: ["Mazda3", "Mazda6", "MX-5 Miata", "CX-3", "CX-5", "CX-9"],
    "Mercedes-Benz": [
      "A-Class",
      "C-Class",
      "E-Class",
      "S-Class",
      "CLA",
      "CLS",
      "SL",
      "SLC",
      "GLA",
      "GLC",
      "GLE",
      "GLS",
    ],
    Mitsubishi: ["Mirage", "Lancer", "Eclipse Cross", "Outlander", "Outlander Sport"],
    Nissan: [
      "Versa",
      "Sentra",
      "Altima",
      "Maxima",
      "370Z",
      "GT-R",
      "Kicks",
      "Rogue",
      "Murano",
      "Pathfinder",
      "Armada",
      "Titan",
    ],
    Porsche: ["718 Boxster", "718 Cayman", "911", "Panamera", "Macan", "Cayenne"],
    Ram: ["1500", "2500", "3500", "ProMaster City", "ProMaster"],
    Subaru: ["Impreza", "Legacy", "Outback", "Forester", "Crosstrek", "Ascent", "WRX", "BRZ"],
    Tesla: ["Model 3", "Model S", "Model X", "Model Y", "Cybertruck"],
    Toyota: [
      "Yaris",
      "Corolla",
      "Camry",
      "Avalon",
      "86",
      "Supra",
      "C-HR",
      "RAV4",
      "Highlander",
      "4Runner",
      "Sequoia",
      "Land Cruiser",
      "Prius",
      "Tacoma",
      "Tundra",
    ],
    Volkswagen: ["Jetta", "Passat", "Arteon", "Golf", "Beetle", "Tiguan", "Atlas"],
    Volvo: ["S60", "S90", "XC40", "XC60", "XC90"],
  };

  // Get available models based on selected make
  const availableModels = make ? brandModels[make] || [] : [];

  // Time slots for specific time selection
  const timeSlots = [
    "8:00 AM",
    "8:30 AM",
    "9:00 AM",
    "9:30 AM",
    "10:00 AM",
    "10:30 AM",
    "11:00 AM",
    "11:30 AM",
    "12:00 PM",
    "12:30 PM",
    "1:00 PM",
    "1:30 PM",
    "2:00 PM",
    "2:30 PM",
    "3:00 PM",
    "3:30 PM",
    "4:00 PM",
    "4:30 PM",
    "5:00 PM",
    "5:30 PM",
    "6:00 PM",
  ];

  // Date options (current month and next month)
  const currentDate = new Date();
  const dateOptions = [];
  for (let i = 0; i < 60; i++) {
    const date = new Date(currentDate);
    date.setDate(currentDate.getDate() + i);
    dateOptions.push({
      value: date.toISOString().split("T")[0],
      label: date.toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
      }),
    });
  }

  // Fetch available drivers
  useEffect(() => {
    const fetchDrivers = async () => {
      try {
        const { data: drivers, error } = await supabase
          .from("drivers")
          .select("id, name, rating_avg, rating_count, available, city_ok")
          .eq("available", true)
          .order("rating_avg", {
            ascending: false,
          });
        if (error) throw error;
        setAvailableDrivers(drivers || []);
      } catch (error) {
        console.error("Error fetching drivers:", error);
      }
    };
    fetchDrivers();
  }, []);

  // Calculate distance when delivery address changes
  useEffect(() => {
    const calculateDistance = async () => {
      if (!deliveryAddress.street.trim()) {
        setEstimatedDistance(25);
        return;
      }
      setIsCalculatingDistance(true);
      try {
        const result = await distanceService.calculateDistance(
          addressToString(pickupAddress),
          addressToString(deliveryAddress),
        );
        setEstimatedDistance(result.distance);
      } catch (error) {
        console.error("Distance calculation failed:", error);
        setEstimatedDistance(25); // fallback
      } finally {
        setIsCalculatingDistance(false);
      }
    };
    const debounceTimer = setTimeout(calculateDistance, 500);
    return () => clearTimeout(debounceTimer);
  }, [pickupAddress, deliveryAddress]);

  // Clear model when make changes
  useEffect(() => {
    setModel("");
  }, [make]);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (!userProfile?.dealer_id) {
        throw new Error("No dealer profile found");
      }

      // Validation
      if (!deliveryAddress.street.trim()) {
        toast({
          title: "Delivery address is required",
          variant: "destructive",
        });
        return;
      }
      if (!customerName.trim()) {
        toast({
          title: "Customer name is required",
          variant: "destructive",
        });
        return;
      }

      // Create job in database with all the new fields
      const jobData: any = {
        type: "delivery",
        year: year ? parseInt(year) : null,
        make,
        model,
        vin,
        pickup_address: addressToString(pickupAddress),
        delivery_address: addressToString(deliveryAddress),
        customer_name: customerName,
        customer_phone: customerPhone,
        distance_miles: estimatedDistance,
        requires_two: driversNeeded === "2",
        status: "open",
        dealer_id: userProfile.dealer_id,
        timeframe,
        transmission,
        specific_time: specificTime || null,
        specific_date: specificDate || null,
        notes: notes.trim() || null,
      };

      // Add new fields to notes for now (until DB columns are added)
      const additionalNotes = [];
      if (paymentMethod) additionalNotes.push(`Payment: ${paymentMethod}`);
      if (amountToCollect) additionalNotes.push(`Collect: $${amountToCollect}`);
      if (paperwork.length > 0) additionalNotes.push(`Paperwork: ${paperwork.join(", ")}`);
      const checklistItems = [];
      if (preDeliveryChecklist.gasTank) checklistItems.push("Gas tank ≥1/4");
      if (preDeliveryChecklist.licensePlate) checklistItems.push("License plate attached");
      if (preDeliveryChecklist.paperwork) checklistItems.push("All paperwork ready");
      if (preDeliveryChecklist.carWashed) checklistItems.push("Car washed/vacuumed");
      if (preDeliveryChecklist.vinVerified) checklistItems.push("VIN verified");
      if (checklistItems.length > 0) additionalNotes.push(`Pre-Delivery: ${checklistItems.join(", ")}`);
      if (additionalNotes.length > 0) {
        jobData.notes = jobData.notes
          ? `${jobData.notes}\n\n${additionalNotes.join("\n")}`
          : additionalNotes.join("\n");
      }

      const { data: job, error } = await supabase.from("jobs").insert(jobData).select().single();
      if (error) throw error;

      // Send push notifications to all available drivers about the new job
      try {
        await supabase.functions.invoke("notify-drivers-new-job", {
          body: {
            job_id: job.id,
            type: job.type,
            year: job.year,
            make: job.make,
            model: job.model,
            pickup_address: job.pickup_address,
            delivery_address: job.delivery_address,
            distance_miles: job.distance_miles,
            requires_two: job.requires_two,
            customer_name: job.customer_name,
          },
        });
        console.log("Push notifications sent to drivers");
      } catch (notifError) {
        console.error("Error sending push notifications:", notifError);
        // Don't fail the job creation if notifications fail
      }

      // If a specific driver was selected, create an assignment
      if (specificDriverId && specificDriverId !== "auto" && job) {
        const { error: assignmentError } = await supabase.from("assignments").insert({
          job_id: job.id,
          driver_id: specificDriverId,
          accepted_at: new Date().toISOString(),
        });
        if (assignmentError) {
          console.error("Error creating assignment:", assignmentError);
          // Continue anyway - the job was created successfully
        }
      }
      // Show success banner
      setShowSuccessBanner(true);

      // Navigate after a short delay to allow banner to be seen
      setTimeout(() => {
        navigate("/dealer/dashboard");
      }, 1500);
    } catch (error) {
      console.error("Error creating job:", error);
      toast({
        title: "Error sending request",
        variant: "destructive",
      });
    }
  };
  return (
    <>
      <title>Request Driver | SwapRunn</title>
      <meta
        name="description"
        content="Request a driver for vehicle delivery. Quick and easy driver dispatch for auto dealers."
      />
      <link rel="canonical" href="/dealer/request" />

      <SuccessBanner
        show={showSuccessBanner}
        message="✅ Request successfully sent!"
        onDismiss={() => setShowSuccessBanner(false)}
      />

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
        {/* Dark overlay - matching homepage theme */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/75 via-black/65 to-black/40 z-0"></div>

        <div className="relative z-10 container max-w-5xl mx-auto px-4 sm:px-6 pt-20 pb-12">
          <div className="text-center mb-8">
            <h1 className="text-4xl lg:text-6xl font-black tracking-tight mb-4 leading-tight text-white">
              Request <span className="text-[#E11900]">Driver</span>
              <span className="text-[#E11900]">.</span>
            </h1>
            <p className="text-xl text-white/80 max-w-2xl mx-auto">
              Submit your vehicle delivery request and get matched with professional drivers instantly
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* 1. Vehicle Information */}
            <Collapsible
              open={openSections.vehicle}
              onOpenChange={(open) =>
                setOpenSections({
                  ...openSections,
                  vehicle: open,
                })
              }
              className="bg-black/40 backdrop-blur-sm border border-white/10 rounded-2xl shadow-2xl overflow-hidden"
            >
              <CollapsibleTrigger className="w-full flex items-center justify-between p-6 hover:bg-white/5 transition-all duration-300 group">
                <h3 className="text-2xl font-bold text-white">Vehicle Information</h3>
                <ChevronDown
                  className={`h-6 w-6 text-white/60 group-hover:text-[#E11900] transition-all duration-300 ${openSections.vehicle ? "rotate-180" : ""}`}
                />
              </CollapsibleTrigger>
              <CollapsibleContent className="px-6 pb-6">
                <div className="space-y-6 pt-2">
                  {/* VIN Scanner Button */}
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

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Select value={year} onValueChange={setYear}>
                      <SelectTrigger className="h-12 rounded-xl border-white/20 bg-black/20 text-white hover:border-[#E11900]/50 focus:border-[#E11900] focus:ring-[#E11900]/20 transition-all duration-300">
                        <SelectValue placeholder="Year" />
                      </SelectTrigger>
                      <SelectContent className="bg-black/95 backdrop-blur-sm border-white/20 z-50">
                        {years.map((yearOption) => (
                          <SelectItem key={yearOption} value={yearOption}>
                            {yearOption}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <Select value={make} onValueChange={setMake}>
                      <SelectTrigger className="h-12 rounded-xl border-white/20 bg-black/20 text-white hover:border-[#E11900]/50 focus:border-[#E11900] focus:ring-[#E11900]/20 transition-all duration-300">
                        <SelectValue placeholder="Make" />
                      </SelectTrigger>
                      <SelectContent className="bg-black/95 backdrop-blur-sm border-white/20 z-50">
                        {makes.map((makeOption) => (
                          <SelectItem key={makeOption} value={makeOption}>
                            {makeOption}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <Select value={model} onValueChange={setModel} disabled={!make}>
                      <SelectTrigger className="h-12 rounded-xl border-white/20 bg-black/20 text-white hover:border-[#E11900]/50 focus:border-[#E11900] focus:ring-[#E11900]/20 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed">
                        <SelectValue placeholder={make ? "Select model" : "Select make first"} />
                      </SelectTrigger>
                      <SelectContent className="bg-black/95 backdrop-blur-sm border-white/20 z-50">
                        {availableModels.map((modelOption) => (
                          <SelectItem key={modelOption} value={modelOption}>
                            {modelOption}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <Input
                      type="text"
                      value={vin}
                      onChange={(e) => setVin(e.target.value.toUpperCase())}
                      placeholder="VIN"
                      maxLength={17}
                      className="h-12 rounded-xl border-white/20 bg-black/20 text-white placeholder:text-white/50 hover:border-[#E11900]/50 focus:border-[#E11900] focus:ring-[#E11900]/20 transition-all duration-300 uppercase font-mono"
                    />

                    <div className="col-span-1 md:col-span-2">
                      <Label className="text-white mb-4 block text-lg font-semibold">Transmission</Label>
                      <div className="flex gap-6">
                        <label className="flex items-center space-x-3 cursor-pointer text-white hover:text-[#E11900] transition-colors duration-300">
                          <input
                            type="radio"
                            name="transmission"
                            value="automatic"
                            checked={transmission === "automatic"}
                            onChange={(e) => setTransmission(e.target.value)}
                            className="w-5 h-5 accent-[#E11900] focus:ring-[#E11900]/20"
                          />
                          <span className="text-lg">Automatic</span>
                        </label>
                        <label className="flex items-center space-x-3 cursor-pointer text-white hover:text-[#E11900] transition-colors duration-300">
                          <input
                            type="radio"
                            name="transmission"
                            value="manual"
                            checked={transmission === "manual"}
                            onChange={(e) => setTransmission(e.target.value)}
                            className="w-5 h-5 accent-[#E11900] focus:ring-[#E11900]/20"
                          />
                          <span className="text-lg">Manual</span>
                        </label>
                      </div>
                    </div>

                    <Input
                      type="text"
                      value={stockNumber}
                      onChange={(e) => setStockNumber(e.target.value)}
                      placeholder="Stock Number (Optional)"
                      className="h-12 rounded-xl border-white/20 bg-black/20 text-white placeholder:text-white/50 hover:border-[#E11900]/50 focus:border-[#E11900] focus:ring-[#E11900]/20 transition-all duration-300"
                    />
                  </div>
                </div>
              </CollapsibleContent>
            </Collapsible>

            {/* 2. Pickup & Delivery */}
            <Collapsible
              open={openSections.pickup}
              onOpenChange={(open) =>
                setOpenSections({
                  ...openSections,
                  pickup: open,
                })
              }
              className="bg-black/40 backdrop-blur-sm border border-white/10 rounded-2xl shadow-2xl overflow-hidden"
            >
              <CollapsibleTrigger className="w-full flex items-center justify-between p-6 hover:bg-white/5 transition-all duration-300 group">
                <h3 className="text-2xl font-bold text-white">Pickup & Delivery</h3>
                <ChevronDown
                  className={`h-6 w-6 text-white/60 group-hover:text-[#E11900] transition-all duration-300 ${openSections.pickup ? "rotate-180" : ""}`}
                />
              </CollapsibleTrigger>
              <CollapsibleContent className="px-6 pb-6">
                <div className="space-y-6 pt-2">
                  <div>
                    <Label className="text-white mb-2 block">Pickup Address (Default to Dealership)</Label>
                    <AddressInput
                      label=""
                      value={pickupAddress}
                      onChange={setPickupAddress}
                      className="[&_input]:h-12 [&_input]:rounded-xl [&_input]:border-white/20 [&_input]:bg-black/20 [&_input]:text-white [&_input]:placeholder:text-white/50 [&_input]:hover:border-[#E11900]/50 [&_input]:focus:border-[#E11900] [&_input]:focus:ring-[#E11900]/20 [&_input]:transition-all [&_input]:duration-300"
                    />
                  </div>

                  <div>
                    <Label className="text-gray-900 mb-2 block">Delivery Address *</Label>
                    <AddressInput
                      label=""
                      value={deliveryAddress}
                      onChange={setDeliveryAddress}
                      required
                      className="[&_input]:bg-gray-50 [&_input]:border-gray-300 [&_input]:text-gray-900 [&_input]:placeholder:text-gray-400"
                    />
                  </div>

                  <div className="text-center p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="text-gray-600 text-sm">
                      {isCalculatingDistance ? (
                        <span className="flex items-center justify-center gap-2">
                          <div className="animate-spin rounded-full h-4 w-4 border-2 border-gray-900 border-t-transparent"></div>
                          Calculating distance...
                        </span>
                      ) : (
                        <span>
                          Estimated Distance:{" "}
                          <span className="font-medium text-gray-900">{estimatedDistance} miles</span>
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </CollapsibleContent>
            </Collapsible>

            {/* 3. Customer Information */}
            <Collapsible
              open={openSections.customer}
              onOpenChange={(open) =>
                setOpenSections({
                  ...openSections,
                  customer: open,
                })
              }
              className="bg-black/40 backdrop-blur-sm border border-white/10 rounded-2xl shadow-2xl overflow-hidden"
            >
              <CollapsibleTrigger className="w-full flex items-center justify-between p-6 hover:bg-white/5 transition-all duration-300 group">
                <h3 className="text-2xl font-bold text-white">Customer Information</h3>
                <ChevronDown
                  className={`h-6 w-6 text-white/60 group-hover:text-[#E11900] transition-all duration-300 ${openSections.customer ? "rotate-180" : ""}`}
                />
              </CollapsibleTrigger>
              <CollapsibleContent className="px-6 pb-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                  <Input
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="Customer Name *"
                    className="h-12 rounded-xl border-white/20 bg-black/20 text-white placeholder:text-white/50 hover:border-[#E11900]/50 focus:border-[#E11900] focus:ring-[#E11900]/20 transition-all duration-300"
                    required
                  />
                  <Input
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="Customer Phone"
                    className="bg-gray-50 border-gray-300 text-gray-900 placeholder:text-gray-400"
                  />
                </div>
              </CollapsibleContent>
            </Collapsible>

            {/* 4. Driver Requirements */}
            <Collapsible
              open={openSections.driver}
              onOpenChange={(open) =>
                setOpenSections({
                  ...openSections,
                  driver: open,
                })
              }
              className="bg-black/40 backdrop-blur-sm border border-white/10 rounded-2xl shadow-2xl overflow-hidden"
            >
              <CollapsibleTrigger className="w-full flex items-center justify-between p-6 hover:bg-white/5 transition-all duration-300 group">
                <h3 className="text-2xl font-bold text-white">Driver Requirements</h3>
                <ChevronDown
                  className={`h-6 w-6 text-white/60 group-hover:text-[#E11900] transition-all duration-300 ${openSections.driver ? "rotate-180" : ""}`}
                />
              </CollapsibleTrigger>
              <CollapsibleContent className="px-6 pb-6">
                <div className="space-y-6 mt-2">
                  <div>
                    <Label className="text-white mb-3 block">Number of Drivers</Label>
                    <div className="flex gap-3">
                      <label className="relative flex-1">
                        <input
                          type="radio"
                          name="driversNeeded"
                          value="1"
                          checked={driversNeeded === "1"}
                          onChange={(e) => setDriversNeeded(e.target.value)}
                          className="peer sr-only"
                        />
                        <div className="cursor-pointer rounded-lg border-2 border-neutral-600 bg-neutral-700/50 p-4 text-center text-white transition-all hover:bg-neutral-700 peer-checked:border-[#E11900] peer-checked:bg-[#E11900]/20">
                          <span className="text-sm font-medium">1 Driver</span>
                        </div>
                      </label>
                      <label className="relative flex-1">
                        <input
                          type="radio"
                          name="driversNeeded"
                          value="2"
                          checked={driversNeeded === "2"}
                          onChange={(e) => setDriversNeeded(e.target.value)}
                          className="peer sr-only"
                        />
                        <div className="cursor-pointer rounded-lg border-2 border-neutral-600 bg-neutral-700/50 p-4 text-center text-white transition-all hover:bg-neutral-700 peer-checked:border-[#E11900] peer-checked:bg-[#E11900]/20">
                          <span className="text-sm font-medium">2 Drivers</span>
                        </div>
                      </label>
                    </div>
                  </div>

                  <div>
                    <Label className="text-white mb-2 block">Assign Specific Driver (Optional)</Label>
                    <Select value={specificDriverId} onValueChange={setSpecificDriverId}>
                      <SelectTrigger className="rounded-lg border-neutral-600 bg-neutral-700/50 text-white">
                        <SelectValue placeholder="Auto-assign or select driver" />
                      </SelectTrigger>
                      <SelectContent className="bg-background border-border z-50">
                        <SelectItem value="auto">Auto-assign to first available</SelectItem>
                        {availableDrivers.map((driver) => (
                          <SelectItem key={driver.id} value={driver.id}>
                            {driver.name} ⭐ {driver.rating_avg.toFixed(1)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label className="text-gray-900 mb-3 block">Delivery Timeframe</Label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {[
                        {
                          value: "asap",
                          label: "ASAP",
                        },
                        {
                          value: "today",
                          label: "Today",
                        },
                        {
                          value: "tomorrow",
                          label: "Tomorrow",
                        },
                        {
                          value: "this-week",
                          label: "This Week",
                        },
                        {
                          value: "flexible",
                          label: "Flexible",
                        },
                      ].map((option) => (
                        <label key={option.value} className="relative">
                          <input
                            type="radio"
                            name="timeframe"
                            value={option.value}
                            checked={timeframe === option.value}
                            onChange={(e) => setTimeframe(e.target.value)}
                            className="peer sr-only"
                          />
                          <div className="cursor-pointer rounded-lg border-2 border-gray-300 bg-gray-50 p-3 text-center text-gray-900 text-sm transition-all hover:bg-gray-100 peer-checked:border-primary peer-checked:bg-primary/10">
                            {option.label}
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label className="text-gray-900 mb-3 block">Or Select Exact Time/Date</Label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <Select value={specificTime} onValueChange={setSpecificTime}>
                        <SelectTrigger className="rounded-lg border-gray-300 bg-gray-50 text-gray-900">
                          <SelectValue placeholder="Select time" />
                        </SelectTrigger>
                        <SelectContent className="bg-background border-border z-50">
                          {timeSlots.map((time) => (
                            <SelectItem key={time} value={time}>
                              {time}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      <Select value={specificDate} onValueChange={setSpecificDate}>
                        <SelectTrigger className="rounded-lg border-gray-300 bg-gray-50 text-gray-900">
                          <SelectValue placeholder="Select date" />
                        </SelectTrigger>
                        <SelectContent className="bg-background border-border z-50">
                          {dateOptions.map((dateOption) => (
                            <SelectItem key={dateOption.value} value={dateOption.value}>
                              {dateOption.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </CollapsibleContent>
            </Collapsible>

            {/* 5. Delivery Context */}
            <Collapsible
              open={openSections.delivery}
              onOpenChange={(open) =>
                setOpenSections({
                  ...openSections,
                  delivery: open,
                })
              }
              className="bg-black/40 backdrop-blur-sm border border-white/10 rounded-2xl shadow-2xl overflow-hidden"
            >
              <CollapsibleTrigger className="w-full flex items-center justify-between p-6 hover:bg-white/5 transition-all duration-300 group">
                <h3 className="text-2xl font-bold text-white">Delivery Context</h3>
                <ChevronDown
                  className={`h-6 w-6 text-white/60 group-hover:text-[#E11900] transition-all duration-300 ${openSections.delivery ? "rotate-180" : ""}`}
                />
              </CollapsibleTrigger>
              <CollapsibleContent className="px-6 pb-6">
                <div className="space-y-6 mt-2">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-white mb-2 block">Money Due at Delivery</Label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">$</span>
                        <Input
                          type="number"
                          value={amountToCollect}
                          onChange={(e) => setAmountToCollect(e.target.value)}
                          placeholder="0.00"
                          className="pl-7 bg-neutral-700/50 border-neutral-600 text-white placeholder:text-gray-400"
                          step="0.01"
                          min="0"
                        />
                      </div>
                    </div>

                    <div>
                      <Label className="text-white mb-2 block">Payment Method</Label>
                      <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                        <SelectTrigger className="rounded-lg border-neutral-600 bg-neutral-700/50 text-white">
                          <SelectValue placeholder="Select method" />
                        </SelectTrigger>
                        <SelectContent className="bg-background border-border z-50">
                          <SelectItem value="cash">Cash</SelectItem>
                          <SelectItem value="card">Card</SelectItem>
                          <SelectItem value="check">Check</SelectItem>
                          <SelectItem value="paid">Already Paid</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label className="text-white mb-3 block">Paperwork Checklist</Label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {[
                        {
                          value: "dmv-reg",
                          label: "DMV Registration",
                        },
                        {
                          value: "temp-tag",
                          label: "Temporary Tag",
                        },
                        {
                          value: "insurance",
                          label: "Insurance Binder",
                        },
                        {
                          value: "customer-copy",
                          label: "Customer Copy",
                        },
                      ].map((item) => (
                        <div key={item.value} className="flex items-center space-x-2 bg-neutral-700/30 p-3 rounded-lg">
                          <Checkbox
                            id={item.value}
                            checked={paperwork.includes(item.value)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setPaperwork([...paperwork, item.value]);
                              } else {
                                setPaperwork(paperwork.filter((p) => p !== item.value));
                              }
                            }}
                            className="border-neutral-600 data-[state=checked]:bg-[#E11900] data-[state=checked]:border-[#E11900]"
                          />
                          <label htmlFor={item.value} className="text-white text-sm cursor-pointer">
                            {item.label}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label className="text-white mb-3 block">Pre-Delivery Checklist</Label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {[
                        {
                          key: "gasTank",
                          label: "Gas tank ≥ 1/4 full",
                        },
                        {
                          key: "licensePlate",
                          label: "License plate attached",
                        },
                        {
                          key: "paperwork",
                          label: "All paperwork ready",
                        },
                        {
                          key: "carWashed",
                          label: "Car washed/vacuumed",
                        },
                        {
                          key: "vinVerified",
                          label: "VIN verified",
                        },
                      ].map((item) => (
                        <div key={item.key} className="flex items-center space-x-2 bg-neutral-700/30 p-3 rounded-lg">
                          <Checkbox
                            id={item.key}
                            checked={preDeliveryChecklist[item.key as keyof typeof preDeliveryChecklist]}
                            onCheckedChange={(checked) => {
                              setPreDeliveryChecklist({
                                ...preDeliveryChecklist,
                                [item.key]: checked === true,
                              });
                            }}
                            className="border-neutral-600 data-[state=checked]:bg-[#E11900] data-[state=checked]:border-[#E11900]"
                          />
                          <label htmlFor={item.key} className="text-white text-sm cursor-pointer">
                            {item.label}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CollapsibleContent>
            </Collapsible>

            {/* 6. Additional Notes */}
            <Collapsible
              open={openSections.notes}
              onOpenChange={(open) =>
                setOpenSections({
                  ...openSections,
                  notes: open,
                })
              }
              className="bg-black/40 backdrop-blur-sm border border-white/10 rounded-2xl shadow-2xl overflow-hidden"
            >
              <CollapsibleTrigger className="w-full flex items-center justify-between p-6 hover:bg-white/5 transition-all duration-300 group">
                <h3 className="text-2xl font-bold text-white">Additional Notes</h3>
                <ChevronDown
                  className={`h-6 w-6 text-white/60 group-hover:text-[#E11900] transition-all duration-300 ${openSections.notes ? "rotate-180" : ""}`}
                />
              </CollapsibleTrigger>
              <CollapsibleContent className="px-6 pb-6">
                ...
                <div className="mt-2">
                  <Textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Special instructions, customer preferences, delivery notes..."
                    className="min-h-[100px] rounded-xl border-white/20 bg-black/20 text-white placeholder:text-white/50 hover:border-[#E11900]/50 focus:border-[#E11900] focus:ring-[#E11900]/20 transition-all duration-300 resize-none"
                    rows={4}
                  />
                </div>
              </CollapsibleContent>
            </Collapsible>

            {/* Submit Button - Pinned at bottom */}
            <div className="sticky bottom-0 bg-gradient-to-t from-black via-black/95 to-transparent pt-8 pb-6 -mx-6 px-6 mt-8">
              <div className="flex justify-center">
                <button
                  type="submit"
                  className="bg-[#E11900] hover:bg-[#E11900]/90 text-white text-lg font-bold rounded-full py-4 px-16 transition-all duration-300 shadow-2xl hover:shadow-[0_0_30px_rgba(225,25,0,0.5)] hover:scale-105"
                >
                  Send Request
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};
export default DealerRequest;
