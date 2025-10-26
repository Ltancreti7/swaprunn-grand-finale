import { useState, useEffect, useCallback } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import SiteHeader from "@/components/SiteHeader";
import { AuthHeader } from "@/components/AuthHeader";
import { Crown } from "lucide-react";
import mapBackgroundImage from "@/assets/map-background.jpg";
import BackButton from "@/components/BackButton";
import type { User } from "@supabase/supabase-js";

type DealerMetadata = {
  user_type?: string;
  full_name?: string;
  first_name?: string;
  last_name?: string;
  company_name?: string;
  dealership_name?: string;
  organization?: string;
  phone?: string;
  phone_number?: string;
  contact_phone?: string;
};

const extractDealerMetadata = (user: User | null): DealerMetadata => {
  const raw = user?.user_metadata;
  if (raw && typeof raw === "object") {
    return raw as DealerMetadata;
  }
  return {};
};

const SAVED_EMAIL_KEY = "swaprunn_saved_email";
const PENDING_DEALER_SIGNUP = "pending_dealer_signup";

const DealerAuth = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [role, setRole] = useState<"salesperson" | "manager" | "owner">(
    "salesperson",
  );
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Check for admin role in URL params
  const urlParams = new URLSearchParams(window.location.search);
  const isAdminSignup = urlParams.get("role") === "admin";

  // Load saved email on mount
  useEffect(() => {
    const savedEmail = localStorage.getItem(SAVED_EMAIL_KEY);
    if (savedEmail) {
      setEmail(savedEmail);
    }
  }, []);

  // After magic link, if user is signed in, ensure dealer profile exists and redirect
  useEffect(() => {
    const completeDealerOnboarding = async () => {
      const { data: session } = await supabase.auth.getSession();
      if (!session.session?.user) return;

      // If profile exists, go to dashboard
      const { data: profile } = await supabase
        .rpc("get_user_profile")
        .maybeSingle();

      if (profile?.user_type === "dealer") {
        navigate(isAdminSignup ? "/dealer/admin" : "/dealer/dashboard", {
          replace: true,
        });
        return;
      }

      // Attempt to create profile from pending signup data or metadata
      try {
        const pendingRaw = localStorage.getItem(PENDING_DEALER_SIGNUP);
        const pending = pendingRaw ? JSON.parse(pendingRaw) : null;

        await createDealerProfile({
          fullName: pending?.fullName || null,
          companyName: pending?.companyName || null,
          phone: pending?.phone || null,
        });

        // Clear pending data
        localStorage.removeItem(PENDING_DEALER_SIGNUP);
      } catch (e) {
        console.warn("Dealer profile create on verify failed, proceeding");
      }

      navigate(isAdminSignup ? "/dealer/admin" : "/dealer/dashboard", {
        replace: true,
      });
    };

    // Run once on mount
    void completeDealerOnboarding();
  }, [navigate, isAdminSignup]);

  const createDealerProfile = async (details?: {
    fullName?: string | null;
    companyName?: string | null;
    phone?: string | null;
  }) => {
    try {
      const resolvedFullName = (
        details?.fullName ?? `${firstName} ${lastName}`.trim()
      ).trim();
      const hasFullName = resolvedFullName.length > 0;
      const resolvedCompany = (details?.companyName ?? companyName).trim();
      const hasCompany = resolvedCompany.length > 0;
      const resolvedPhone = details?.phone?.trim() ?? undefined;

      const { data, error } = await supabase.rpc(
        "create_profile_for_current_user",
        {
          _user_type: "dealer",
          _company_name: hasCompany ? resolvedCompany : null,
          _name: hasFullName ? resolvedFullName : null,
          _phone: resolvedPhone ?? null,
        },
      );
      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Error creating dealer profile:", error);
      throw error;
    }
  };

  const tryRepairDealerProfile = async (authUser: User | null) => {
    if (!authUser) return null;

    const metadata = extractDealerMetadata(authUser);
    const metadataUserType = metadata.user_type;

    if (metadataUserType !== "dealer") {
      return null;
    }

    const metadataFullName = (() => {
      const direct =
        typeof metadata.full_name === "string" ? metadata.full_name : "";
      if (direct?.trim()) return direct.trim();
      const first =
        typeof metadata.first_name === "string" ? metadata.first_name : "";
      const last =
        typeof metadata.last_name === "string" ? metadata.last_name : "";
      return `${first} ${last}`.trim();
    })();

    const metadataCompany = (() => {
      const companyCandidates = [
        metadata.company_name,
        metadata.dealership_name,
        metadata.organization,
        metadataFullName,
      ];
      for (const candidate of companyCandidates) {
        if (typeof candidate === "string" && candidate.trim()) {
          return candidate.trim();
        }
      }
      return null;
    })();

    const metadataPhone = (() => {
      const candidates = [
        metadata.phone,
        metadata.phone_number,
        metadata.contact_phone,
      ];
      for (const candidate of candidates) {
        if (typeof candidate === "string" && candidate.trim()) {
          return candidate.trim();
        }
      }
      return null;
    })();

    try {
      return await createDealerProfile({
        fullName: metadataFullName || null,
        companyName: metadataCompany,
        phone: metadataPhone,
      });
    } catch (repairError) {
      console.error("Automatic dealer profile repair failed:", repairError);
      return null;
    }
  };
  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isSignUp) {
        // Sign up with email and password
        const { data: authData, error: authError } = await supabase.auth.signUp(
          {
            email,
            password,
            options: {
              data: {
                user_type: "dealer",
                role: role,
                full_name: `${firstName} ${lastName}`.trim() || undefined,
                company_name: companyName || undefined,
              },
              emailRedirectTo: `${window.location.origin}/dealer/auth`,
            },
          },
        );

        if (authError) throw authError;
        if (!authData.user) throw new Error("Failed to create user account");

        // Create dealer profile
        await createDealerProfile({
          fullName: `${firstName} ${lastName}`.trim(),
          companyName,
          phone: null,
        });

        localStorage.setItem(SAVED_EMAIL_KEY, email);
        toast({
          title: "Account created successfully",
          description: "Redirecting to dashboard...",
        });

        // Redirect to appropriate dashboard
        navigate(isAdminSignup ? "/dealer/admin" : "/dealer/dashboard", {
          replace: true,
        });
      } else {
        // Sign in with email and password
        const { data: authData, error: authError } =
          await supabase.auth.signInWithPassword({
            email,
            password,
          });

        if (authError) throw authError;

        // Check if user has dealer profile
        const { data: profile } = await supabase
          .rpc("get_user_profile")
          .maybeSingle();

        if (!profile) {
          // Try to repair profile
          await tryRepairDealerProfile(authData.user);
        }

        localStorage.setItem(SAVED_EMAIL_KEY, email);
        toast({
          title: "Signed in successfully",
          description: "Redirecting to dashboard...",
        });

        // Redirect to appropriate dashboard
        navigate(isAdminSignup ? "/dealer/admin" : "/dealer/dashboard", {
          replace: true,
        });
      }
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Please try again.";
      toast({
        title: isSignUp ? "Sign up failed" : "Sign in failed",
        description: message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  return (
    <div
      className="min-h-screen relative"
      style={{
        backgroundImage: `url(${mapBackgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Back Button */}
      <BackButton />

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70 z-0"></div>

      {/* Content */}
      <div className="relative z-10 container max-w-7xl mx-auto px-4 sm:px-6 pt-28">
        <div className="text-center mb-4">
          <h1 className="font-bold text-white mb-2 my-0 text-5xl">
            Dealer{" "}
            <span className="text-[#E11900]">
              {isSignUp ? "Sign Up" : "Sign In"}
            </span>
            <span className="text-[#E11900]">.</span>
          </h1>
          <p className="text-lg text-white/80 my-0">
            {isSignUp
              ? "Create your dealer account"
              : "Access the Dealer Portal"}
          </p>
        </div>

        <Card className="w-full max-w-md mx-auto bg-gradient-to-br from-neutral-800 to-neutral-900 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.3)] border-transparent">
          <CardContent className="space-y-6">
            {isAdminSignup && (
              <div className="flex items-center justify-center gap-2">
                <Crown className="w-4 h-4 text-primary" />
                <Badge className="bg-primary/20 text-primary border-primary/30">
                  Admin Access
                </Badge>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleAuth} className="space-y-4">
              {isSignUp && (
                <>
                  <div className="space-y-2">
                    <Label
                      htmlFor="firstName"
                      className="text-white text-sm font-medium"
                    >
                      First Name
                    </Label>
                    <Input
                      id="firstName"
                      type="text"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder="Enter your first name"
                      className="h-12 bg-white border-gray-300 text-gray-900 placeholder:text-gray-500 focus:border-[#E11900] focus:ring-2 focus:ring-[#E11900]/20"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="lastName"
                      className="text-white text-sm font-medium"
                    >
                      Last Name
                    </Label>
                    <Input
                      id="lastName"
                      type="text"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      placeholder="Enter your last name"
                      className="h-12 bg-white border-gray-300 text-gray-900 placeholder:text-gray-500 focus:border-[#E11900] focus:ring-2 focus:ring-[#E11900]/20"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="company"
                      className="text-white text-sm font-medium"
                    >
                      Company Name
                    </Label>
                    <Input
                      id="company"
                      type="text"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      placeholder="Enter your company name"
                      className="h-12 bg-white border-gray-300 text-gray-900 placeholder:text-gray-500 focus:border-[#E11900] focus:ring-2 focus:ring-[#E11900]/20"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-white text-sm font-medium">
                      Your Role
                    </Label>
                    <Select
                      value={role}
                      onValueChange={(
                        value: "salesperson" | "manager" | "owner",
                      ) => setRole(value)}
                    >
                      <SelectTrigger className="h-12 bg-white border-gray-300 text-gray-900 focus:border-[#E11900] focus:ring-2 focus:ring-[#E11900]/20">
                        <SelectValue placeholder="Select your role" />
                      </SelectTrigger>
                      <SelectContent className="bg-white border-gray-200">
                        <SelectItem
                          value="salesperson"
                          className="text-gray-900 hover:bg-gray-100 focus:bg-gray-100"
                        >
                          Sales
                        </SelectItem>
                        <SelectItem
                          value="manager"
                          className="text-gray-900 hover:bg-gray-100 focus:bg-gray-100"
                        >
                          Swap Manager
                        </SelectItem>
                        <SelectItem
                          value="owner"
                          className="text-gray-900 hover:bg-gray-100 focus:bg-gray-100"
                        >
                          Admin/Owner
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </>
              )}

              {/* Email Field */}
              <div className="space-y-2">
                <Label
                  htmlFor="email"
                  className="text-white text-sm font-medium"
                >
                  Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  className="h-12 bg-white border-gray-300 text-gray-900 placeholder:text-gray-500 focus:border-[#E11900] focus:ring-2 focus:ring-[#E11900]/20"
                  required
                />
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <Label
                  htmlFor="password"
                  className="text-white text-sm font-medium"
                >
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={
                    isSignUp ? "Create a password" : "Enter your password"
                  }
                  className="h-12 bg-white border-gray-300 text-gray-900 placeholder:text-gray-500 focus:border-[#E11900] focus:ring-2 focus:ring-[#E11900]/20"
                  required
                  minLength={6}
                />
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full h-12 bg-[#E11900] hover:bg-[#B51400] text-white font-semibold text-base rounded-xl transition-all duration-200 active:scale-95 shadow-lg hover:shadow-xl"
                disabled={loading}
              >
                {loading
                  ? isSignUp
                    ? "Creating account..."
                    : "Signing in..."
                  : isSignUp
                    ? "Create Account"
                    : "Sign In"}
              </Button>
            </form>

            {/* Toggle Link */}
            <div className="text-center pt-4 border-t border-white/20">
              <button
                type="button"
                onClick={() => setIsSignUp(!isSignUp)}
                className="text-white/80 hover:text-white hover:underline transition-colors duration-200 font-medium"
              >
                {isSignUp
                  ? "Already have an account? Sign in"
                  : "Don't have an account? Create one"}
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DealerAuth;
