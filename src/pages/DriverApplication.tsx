import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
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
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowLeft, CheckCircle2, User, Briefcase, MapPin } from "lucide-react";
import mapBackgroundImage from "@/assets/map-background.jpg";
import { formatPhoneNumber, cleanPhoneNumber } from "@/lib/utils";

interface Dealer {
  id: string;
  name: string;
  city: string | null;
  state: string | null;
  is_active: boolean;
}

interface FormData {
  full_name: string;
  email: string;
  phone: string;
  password: string;
  confirm_password: string;
  dob: string;
  address: string;
  contact_method: string;
  license_number: string;
  license_state: string;
  license_expiration: string;
  drive_radius: string;
  availability: string;
  dealer_id: string;
}

export default function DriverApplication() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [dealers, setDealers] = useState<Dealer[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState<FormData>({
    full_name: "",
    email: "",
    phone: "",
    password: "",
    confirm_password: "",
    dob: "",
    address: "",
    contact_method: "email",
    license_number: "",
    license_state: "",
    license_expiration: "",
    drive_radius: "",
    availability: "",
    dealer_id: "",
  });

  const usStates = [
    "AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "FL", "GA",
    "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD",
    "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ",
    "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC",
    "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY"
  ];

  useEffect(() => {
    fetchDealers();
  }, []);

  const fetchDealers = async () => {
    try {
      const { data, error } = await supabase
        .from("dealers")
        .select("id, name, city, state")
        .order("name");

      if (error) throw error;
      setDealers(data || []);
    } catch (error) {
      console.error("Error fetching dealers:", error);
      toast({
        title: "Error",
        description: "Could not load dealerships. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleChange = (key: keyof FormData, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const validateForm = (): boolean => {
    if (!form.full_name.trim()) {
      toast({
        title: "Missing Information",
        description: "Please enter your full name.",
        variant: "destructive",
      });
      return false;
    }

    if (!form.email.trim() || !form.email.includes("@")) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      return false;
    }

    if (!form.phone.trim()) {
      toast({
        title: "Missing Information",
        description: "Please enter your phone number.",
        variant: "destructive",
      });
      return false;
    }

    if (!form.password || form.password.length < 6) {
      toast({
        title: "Invalid Password",
        description: "Password must be at least 6 characters long.",
        variant: "destructive",
      });
      return false;
    }

    if (form.password !== form.confirm_password) {
      toast({
        title: "Password Mismatch",
        description: "Passwords do not match.",
        variant: "destructive",
      });
      return false;
    }

    if (!form.dob) {
      toast({
        title: "Missing Information",
        description: "Please enter your date of birth.",
        variant: "destructive",
      });
      return false;
    }

    if (!form.address.trim()) {
      toast({
        title: "Missing Information",
        description: "Please enter your home address.",
        variant: "destructive",
      });
      return false;
    }

    if (!form.license_number.trim()) {
      toast({
        title: "Missing Information",
        description: "Please enter your driver's license number.",
        variant: "destructive",
      });
      return false;
    }

    if (!form.license_state) {
      toast({
        title: "Missing Information",
        description: "Please select your license state.",
        variant: "destructive",
      });
      return false;
    }

    if (!form.license_expiration) {
      toast({
        title: "Missing Information",
        description: "Please enter your license expiration date.",
        variant: "destructive",
      });
      return false;
    }

    if (!form.drive_radius || parseInt(form.drive_radius) <= 0) {
      toast({
        title: "Invalid Drive Radius",
        description: "Please enter a valid drive radius in miles.",
        variant: "destructive",
      });
      return false;
    }

    if (!form.availability.trim()) {
      toast({
        title: "Missing Information",
        description: "Please enter your availability.",
        variant: "destructive",
      });
      return false;
    }

    if (!form.dealer_id) {
      toast({
        title: "Missing Information",
        description: "Please select the dealership you're applying to.",
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: form.email.trim().toLowerCase(),
        password: form.password,
        options: {
          data: {
            user_type: "driver",
            full_name: form.full_name.trim(),
            phone: cleanPhoneNumber(form.phone) || form.phone,
            dealer_id: form.dealer_id,
          },
        },
      });

      if (authError) throw authError;
      if (!authData.user) throw new Error("Failed to create account");

      const { error: applicationError } = await supabase.from("driver_applications").insert([
        {
          user_id: authData.user.id,
          full_name: form.full_name.trim(),
          email: form.email.trim().toLowerCase(),
          phone: cleanPhoneNumber(form.phone) || form.phone,
          dob: form.dob,
          address: form.address.trim(),
          contact_method: form.contact_method,
          license_number: form.license_number.trim().toUpperCase(),
          license_state: form.license_state,
          license_expiration: form.license_expiration,
          drive_radius: parseInt(form.drive_radius),
          availability: form.availability.trim(),
          dealer_id: form.dealer_id,
          status: "pending",
        },
      ]);

      if (applicationError) throw applicationError;

      await supabase.rpc("create_profile_for_current_user", {
        _user_type: "driver",
        _name: form.full_name.trim(),
        _phone: cleanPhoneNumber(form.phone) || form.phone,
      });

      const { data: profile } = await supabase.rpc("get_user_profile").maybeSingle();
      if (profile?.driver_id) {
        await supabase
          .from("drivers")
          .update({
            dealer_id: form.dealer_id,
            approval_status: "pending_approval"
          })
          .eq("id", profile.driver_id);
      }

      toast({
        title: "Account Created!",
        description: "Redirecting to your driver dashboard...",
      });

      setTimeout(() => {
        navigate("/driver/dashboard");
      }, 1500);
    } catch (error) {
      console.error("Error creating account:", error);
      toast({
        title: "Submission Failed",
        description: error instanceof Error ? error.message : "Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div
        className="min-h-screen bg-black relative flex items-center justify-center"
        style={{
          backgroundImage: `url(${mapBackgroundImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundAttachment: "fixed",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/70 to-black/60 z-0"></div>
        <div className="relative z-10 container mx-auto px-4">
          <Card className="max-w-2xl mx-auto bg-black/40 backdrop-blur-sm border-white/20">
            <CardContent className="p-12 text-center">
              <CheckCircle2 className="h-20 w-20 text-green-500 mx-auto mb-6" />
              <h1 className="text-3xl font-bold text-white mb-4">
                Application Submitted Successfully!
              </h1>
              <p className="text-white/80 text-lg mb-8">
                Thank you for applying to join SwapRunn. The dealership will review your
                application and contact you soon.
              </p>
              <div className="flex gap-4 justify-center">
                <Button
                  onClick={() => navigate("/")}
                  className="bg-[#E11900] hover:bg-[#CC1600] text-white"
                >
                  Back to Home
                </Button>
                <Button
                  onClick={() => navigate("/driver/auth")}
                  variant="outline"
                  className="border-white/40 text-white hover:bg-white/10"
                >
                  Sign In
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

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
        <div className="mb-6">
          <Button
            onClick={() => navigate(-1)}
            variant="outline"
            className="border-white/40 text-white hover:bg-white/10 hover:border-white/60 transition-all"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
        </div>

        {/* Hero Section */}
        <div className="max-w-3xl mx-auto text-center mb-8">
          <div className="inline-block bg-gradient-to-r from-[#E11900] to-[#FF4444] text-white px-6 py-2 rounded-full text-sm font-bold mb-4 shadow-lg">
            ✨ Start Earning Today!
          </div>
          <h1 className="text-5xl md:text-6xl font-black text-white mb-4 leading-tight">
            Join Our Driver Network
          </h1>
          <p className="text-xl text-white/90 mb-6 leading-relaxed">
            Flexible hours, competitive pay, and be part of the automotive delivery revolution
          </p>
          <div className="flex flex-wrap gap-4 justify-center text-white/80 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span>Quick approval process</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span>Work on your schedule</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span>Weekly payouts</span>
            </div>
          </div>
        </div>

        <Card className="max-w-3xl mx-auto bg-gradient-to-br from-neutral-900/95 to-neutral-800/95 backdrop-blur-md border-white/10 shadow-2xl">
          <CardHeader className="text-center pb-6 border-b border-white/10">
            <CardTitle className="text-2xl font-bold text-white mb-2">
              Complete Your Application
            </CardTitle>
            <CardDescription className="text-white/70 text-base">
              Takes about 5 minutes. All fields are required to get started.
            </CardDescription>
          </CardHeader>

          <CardContent className="p-8">
            <form onSubmit={handleSubmit} className="space-y-10">
              {/* Personal Information Section */}
              <div className="space-y-6">
                <div className="flex items-center gap-3 pb-3 border-b border-white/10">
                  <div className="bg-[#E11900] p-2 rounded-lg">
                    <User className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-white font-bold text-xl">Personal Information</h3>
                    <p className="text-white/60 text-sm">Tell us about yourself</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label className="text-white mb-2 block font-medium text-sm">Full Name *</Label>
                    <Input
                      value={form.full_name}
                      onChange={(e) => handleChange("full_name", e.target.value)}
                      placeholder="John Doe"
                      className="bg-white/5 border-white/20 text-white placeholder:text-white/40 h-12 focus:bg-white/10 focus:border-[#E11900] transition-all"
                      required
                    />
                  </div>

                  <div>
                    <Label className="text-white mb-2 block font-medium text-sm">Email Address *</Label>
                    <Input
                      type="email"
                      value={form.email}
                      onChange={(e) => handleChange("email", e.target.value)}
                      placeholder="john@example.com"
                      className="bg-white/5 border-white/20 text-white placeholder:text-white/40 h-12 focus:bg-white/10 focus:border-[#E11900] transition-all"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label className="text-white mb-2 block font-medium text-sm">Phone Number *</Label>
                    <Input
                      type="tel"
                      value={form.phone}
                      onChange={(e) => handleChange("phone", formatPhoneNumber(e.target.value))}
                      placeholder="(555) 123-4567"
                      className="bg-white/5 border-white/20 text-white placeholder:text-white/40 h-12 focus:bg-white/10 focus:border-[#E11900] transition-all"
                      maxLength={14}
                      required
                    />
                  </div>

                  <div>
                    <Label className="text-white mb-2 block font-medium text-sm">Date of Birth *</Label>
                    <Input
                      type="date"
                      value={form.dob}
                      onChange={(e) => handleChange("dob", e.target.value)}
                      className="bg-white/5 border-white/20 text-white h-12 focus:bg-white/10 focus:border-[#E11900] transition-all"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label className="text-white mb-2 block font-medium text-sm">Create Password *</Label>
                    <Input
                      type="password"
                      value={form.password}
                      onChange={(e) => handleChange("password", e.target.value)}
                      placeholder="At least 6 characters"
                      className="bg-white/5 border-white/20 text-white placeholder:text-white/40 h-12 focus:bg-white/10 focus:border-[#E11900] transition-all"
                      required
                    />
                    <p className="text-white/50 text-xs mt-1">Use this to login to your dashboard</p>
                  </div>

                  <div>
                    <Label className="text-white mb-2 block font-medium text-sm">Confirm Password *</Label>
                    <Input
                      type="password"
                      value={form.confirm_password}
                      onChange={(e) => handleChange("confirm_password", e.target.value)}
                      placeholder="Re-enter password"
                      className="bg-white/5 border-white/20 text-white placeholder:text-white/40 h-12 focus:bg-white/10 focus:border-[#E11900] transition-all"
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label className="text-white mb-2 block font-medium text-sm">Home Address *</Label>
                  <Textarea
                    value={form.address}
                    onChange={(e) => handleChange("address", e.target.value)}
                    placeholder="123 Main St, City, State, ZIP"
                    className="bg-white/5 border-white/20 text-white placeholder:text-white/40 resize-none focus:bg-white/10 focus:border-[#E11900] transition-all"
                    rows={3}
                    required
                  />
                </div>

                <div>
                  <Label className="text-white mb-2 block font-medium text-sm">Preferred Contact Method *</Label>
                  <Select value={form.contact_method} onValueChange={(v) => handleChange("contact_method", v)}>
                    <SelectTrigger className="bg-white/5 border-white/20 text-white h-12 focus:border-[#E11900] transition-all">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="phone">📞 Phone Call</SelectItem>
                      <SelectItem value="text">💬 Text Message</SelectItem>
                      <SelectItem value="email">📧 Email</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* License Information Section */}
              <div className="space-y-6">
                <div className="flex items-center gap-3 pb-3 border-b border-white/10">
                  <div className="bg-[#E11900] p-2 rounded-lg">
                    <Briefcase className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-white font-bold text-xl">Driver's License</h3>
                    <p className="text-white/60 text-sm">Your license information</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label className="text-white mb-2 block font-medium text-sm">License Number *</Label>
                    <Input
                      value={form.license_number}
                      onChange={(e) => handleChange("license_number", e.target.value.toUpperCase())}
                      placeholder="D1234567"
                      className="bg-white/5 border-white/20 text-white placeholder:text-white/40 h-12 focus:bg-white/10 focus:border-[#E11900] transition-all"
                      required
                    />
                  </div>

                  <div>
                    <Label className="text-white mb-2 block font-medium text-sm">License State *</Label>
                    <Select value={form.license_state} onValueChange={(v) => handleChange("license_state", v)}>
                      <SelectTrigger className="bg-white/5 border-white/20 text-white h-12 focus:border-[#E11900] transition-all">
                        <SelectValue placeholder="Select state" />
                      </SelectTrigger>
                      <SelectContent className="max-h-60">
                        {usStates.map((state) => (
                          <SelectItem key={state} value={state}>
                            {state}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label className="text-white mb-2 block font-medium text-sm">License Expiration Date *</Label>
                  <Input
                    type="date"
                    value={form.license_expiration}
                    onChange={(e) => handleChange("license_expiration", e.target.value)}
                    className="bg-white/5 border-white/20 text-white h-12 focus:bg-white/10 focus:border-[#E11900] transition-all"
                    required
                  />
                </div>
              </div>

              {/* Preferences Section */}
              <div className="space-y-6">
                <div className="flex items-center gap-3 pb-3 border-b border-white/10">
                  <div className="bg-[#E11900] p-2 rounded-lg">
                    <MapPin className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-white font-bold text-xl">Driving Preferences</h3>
                    <p className="text-white/60 text-sm">Tell us your availability</p>
                  </div>
                </div>

                <div>
                  <Label className="text-white mb-2 block font-medium text-sm">
                    Maximum Driving Distance (miles) *
                  </Label>
                  <Input
                    type="number"
                    value={form.drive_radius}
                    onChange={(e) => handleChange("drive_radius", e.target.value)}
                    placeholder="50"
                    min="1"
                    className="bg-white/5 border-white/20 text-white placeholder:text-white/40 h-12 focus:bg-white/10 focus:border-[#E11900] transition-all"
                    required
                  />
                  <p className="text-white/50 text-xs mt-1">Most jobs are between 10-30 miles</p>
                </div>

                <div>
                  <Label className="text-white mb-2 block font-medium text-sm">Your Availability *</Label>
                  <Textarea
                    value={form.availability}
                    onChange={(e) => handleChange("availability", e.target.value)}
                    placeholder="e.g. Monday-Friday 8 AM - 6 PM, Weekends available"
                    className="bg-white/5 border-white/20 text-white placeholder:text-white/40 resize-none focus:bg-white/10 focus:border-[#E11900] transition-all"
                    rows={3}
                    required
                  />
                </div>

                <div>
                  <Label className="text-white mb-2 block font-medium text-sm">Which Dealership? *</Label>
                  <Select value={form.dealer_id} onValueChange={(v) => handleChange("dealer_id", v)}>
                    <SelectTrigger className="bg-white/5 border-white/20 text-white h-12 focus:border-[#E11900] transition-all">
                      <SelectValue placeholder="Choose your dealership" />
                    </SelectTrigger>
                    <SelectContent className="max-h-60">
                      {dealers.map((d) => (
                        <SelectItem key={d.id} value={d.id}>
                          {d.name}
                          {d.city && d.state && ` – ${d.city}, ${d.state}`}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-white/50 text-xs mt-1">You'll receive delivery jobs from this dealership</p>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-6 border-t border-white/10">
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-[#E11900] to-[#FF4444] hover:from-[#CC1600] hover:to-[#E11900] text-white px-8 py-6 text-lg font-bold rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:scale-[1.02] active:scale-[0.98]"
                >
                  {loading ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                      Creating Your Account...
                    </div>
                  ) : (
                    <div className="flex items-center justify-center gap-2">
                      <span>Submit Application & Create Account</span>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </div>
                  )}
                </Button>
                <p className="text-center text-white/60 text-sm mt-4">
                  By submitting, you agree to our terms and conditions
                </p>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
