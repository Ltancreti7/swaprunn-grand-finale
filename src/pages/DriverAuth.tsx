import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { formatPhoneNumber, cleanPhoneNumber } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { AuthHeader } from "@/components/AuthHeader";
import SiteHeader from "@/components/SiteHeader";
import { ArrowLeft } from "lucide-react";
import mapBackgroundImage from "@/assets/map-background.jpg";
import BackButton from "@/components/BackButton";
import type { User } from "@supabase/supabase-js";

type DriverMetadata = {
  user_type?: string;
  full_name?: string;
  first_name?: string;
  last_name?: string;
  phone?: string;
  phone_number?: string;
  contact_phone?: string;
};

const extractDriverMetadata = (user: User | null): DriverMetadata => {
  const raw = user?.user_metadata;
  if (raw && typeof raw === "object") {
    return raw as DriverMetadata;
  }
  return {};
};

const SAVED_EMAIL_KEY = "swaprunn_driver_saved_email";
const SAVED_PASSWORD_KEY = "swaprunn_driver_saved_password";
const REMEMBER_ME_KEY = "swaprunn_driver_remember_me";

const DriverAuth = () => {
  const location = useLocation();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Load saved credentials on mount
  useEffect(() => {
    const savedEmail = localStorage.getItem(SAVED_EMAIL_KEY);
    const savedPassword = localStorage.getItem(SAVED_PASSWORD_KEY);
    const savedRememberMe = localStorage.getItem(REMEMBER_ME_KEY) === "true";

    if (savedEmail) {
      setEmail(savedEmail);
    }
    if (savedPassword && savedRememberMe) {
      setPassword(savedPassword);
    }
    setRememberMe(savedRememberMe);
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const mode = params.get("mode");

    if (mode === "signup") {
      setIsSignUp(true);
    } else if (mode === "login") {
      setIsSignUp(false);
    }
  }, [location.search]);

  const createDriverProfile = async (details?: {
    fullName?: string | null;
    phone?: string | null;
  }) => {
    try {
      const resolvedFullName = (details?.fullName ?? fullName).trim();
      const hasFullName = resolvedFullName.length > 0;
      const resolvedPhoneInput = details?.phone ?? phoneNumber;
      const cleanedPhone = cleanPhoneNumber(resolvedPhoneInput);

      const { error } = await supabase.rpc("create_profile_for_current_user", {
        _user_type: "driver",
        _name: hasFullName ? resolvedFullName : null,
        _phone: cleanedPhone,
      });

      if (error) throw error;
    } catch (error) {
      console.error("Error creating driver profile:", error);
      throw error;
    }
  };

  const tryRepairDriverProfile = async (authUser: User | null) => {
    if (!authUser) return;

    const metadata = extractDriverMetadata(authUser);
    if (metadata.user_type !== "driver") {
      return;
    }

    const metadataFullName = (() => {
      const direct =
        typeof metadata.full_name === "string" ? metadata.full_name : "";
      if (direct.trim()) return direct.trim();
      const first =
        typeof metadata.first_name === "string" ? metadata.first_name : "";
      const last =
        typeof metadata.last_name === "string" ? metadata.last_name : "";
      return `${first} ${last}`.trim();
    })();

    const metadataPhoneCandidate = [
      metadata.phone,
      metadata.phone_number,
      metadata.contact_phone,
    ].find((candidate) => typeof candidate === "string" && candidate.trim());

    try {
      await createDriverProfile({
        fullName: metadataFullName || null,
        phone: metadataPhoneCandidate ?? null,
      });
    } catch (repairError) {
      console.error("Automatic driver profile repair failed:", repairError);
    }
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isSignUp) {
        // Log driver signup to database (background task)
        const logSignup = async (
          status: "success" | "failure",
          errorMsg?: string,
        ) => {
          try {
            await supabase.from("form_submissions").insert({
              form_type: "driver_signup",
              name: fullName,
              email: email,
              message: `Phone: ${phoneNumber}`,
              status,
              error_message: errorMsg,
              metadata: {
                phone: phoneNumber,
              },
            });
          } catch (err) {
            console.error("Failed to log driver signup:", err);
          }
        };

        const { data: authData, error: signUpError } =
          await supabase.auth.signUp({
            email,
            password,
            options: {
              emailRedirectTo: `${window.location.origin}/`,
              data: {
                full_name: fullName,
                phone_number: cleanPhoneNumber(phoneNumber),
                user_type: "driver",
              },
            },
          });

        if (signUpError) {
          await logSignup("failure", signUpError.message);
          throw signUpError;
        }

        if (authData.user) {
          try {
            await createDriverProfile();
            await logSignup("success");
          } catch (profileError) {
            console.error("Profile creation failed:", profileError);
            await logSignup("failure", "Profile creation failed");
          }

          if (!authData.user.email_confirmed_at) {
            toast({
              title: "Account created!",
              description:
                "Check your email to verify your account, then sign in.",
            });
            setIsSignUp(false);
          } else {
            toast({
              title: "Account created!",
              description: "Successfully logged in.",
            });
            navigate("/driver/dashboard");
          }
        }
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;

        // CRITICAL: Verify user is actually a driver
        const { data: initialProfile } = await supabase
          .rpc("get_user_profile")
          .maybeSingle();

        let profile = initialProfile;

        if (!profile) {
          await tryRepairDriverProfile(data.user ?? null);
          const { data: repairedProfile } = await supabase
            .rpc("get_user_profile")
            .maybeSingle();
          profile = repairedProfile ?? null;
        }

        if (profile?.user_type !== "driver") {
          await supabase.auth.signOut();
          const metadataUserType = extractDriverMetadata(
            data.user ?? null,
          ).user_type;
          const accountType =
            profile?.user_type || metadataUserType || "different type";
          throw new Error(
            `This is a driver login page. Your account is registered as a ${accountType}. Please use the correct login page: ${
              accountType === "dealer"
                ? "/dealer/auth"
                : accountType === "swap_coordinator"
                  ? "/swap-coordinator/auth"
                  : "/"
            }`,
          );
        }

        // Save credentials based on "Remember Me" preference
        localStorage.setItem(SAVED_EMAIL_KEY, email);
        localStorage.setItem(REMEMBER_ME_KEY, rememberMe.toString());

        if (rememberMe) {
          localStorage.setItem(SAVED_PASSWORD_KEY, password);
        } else {
          localStorage.removeItem(SAVED_PASSWORD_KEY);
        }

        toast({
          title: "Welcome back!",
          description: "Successfully logged in.",
        });
        navigate("/driver/dashboard");
      }
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Please try again.";
      toast({
        title: "Authentication failed",
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
            {isSignUp ? "Join as" : "Driver"}{" "}
            <span className="text-[#E11900]">
              {isSignUp ? "Driver" : "Login"}
            </span>
            <span className="text-[#E11900]">.</span>
          </h1>
          <p className="text-lg text-white/80 my-0">
            {isSignUp
              ? "Start earning with SwapRunn"
              : "Sign in to access your dashboard"}
          </p>
        </div>

        <Card className="w-full max-w-md mx-auto bg-gradient-to-br from-neutral-800 to-neutral-900 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.3)] border-transparent">
          <CardContent className="space-y-6">
            <form onSubmit={handleAuth} className="space-y-4">
              {isSignUp && (
                <>
                  <div className="space-y-2">
                    <Label
                      htmlFor="fullName"
                      className="text-white text-sm font-medium"
                    >
                      Full Name
                    </Label>
                    <Input
                      id="fullName"
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Enter your full name"
                      className="h-12 bg-white border-gray-300 text-gray-900 placeholder:text-gray-500 focus:border-[#E11900] focus:ring-2 focus:ring-[#E11900]/20"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="phoneNumber"
                      className="text-white text-sm font-medium"
                    >
                      Phone Number
                    </Label>
                    <Input
                      id="phoneNumber"
                      type="tel"
                      value={phoneNumber}
                      onChange={(e) =>
                        setPhoneNumber(formatPhoneNumber(e.target.value))
                      }
                      placeholder="(802) 444-4444"
                      className="h-12 bg-white border-gray-300 text-gray-900 placeholder:text-gray-500 focus:border-[#E11900] focus:ring-2 focus:ring-[#E11900]/20"
                      maxLength={14}
                      required
                    />
                  </div>
                </>
              )}

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
                  placeholder="Enter your password"
                  className="h-12 bg-white border-gray-300 text-gray-900 placeholder:text-gray-500 focus:border-[#E11900] focus:ring-2 focus:ring-[#E11900]/20"
                  required={isSignUp}
                  minLength={isSignUp ? 6 : undefined}
                />
              </div>

              {/* Remember Me Option - Only show for sign in */}
              {!isSignUp && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="remember-driver"
                        checked={rememberMe}
                        onCheckedChange={(checked) => {
                          setRememberMe(checked as boolean);
                          if (!checked) {
                            localStorage.removeItem(SAVED_PASSWORD_KEY);
                          }
                        }}
                        className="border-white/20 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                      />
                      <Label
                        htmlFor="remember-driver"
                        className="text-sm text-white/80 cursor-pointer font-medium"
                      >
                        Remember my login details
                      </Label>
                    </div>

                    {(localStorage.getItem(SAVED_EMAIL_KEY) ||
                      localStorage.getItem(SAVED_PASSWORD_KEY)) && (
                      <button
                        type="button"
                        onClick={() => {
                          localStorage.removeItem(SAVED_EMAIL_KEY);
                          localStorage.removeItem(SAVED_PASSWORD_KEY);
                          localStorage.removeItem(REMEMBER_ME_KEY);
                          setEmail("");
                          setPassword("");
                          setRememberMe(false);
                          toast({
                            title: "Cleared",
                            description:
                              "Saved login details have been cleared",
                          });
                        }}
                        className="text-xs text-white/50 hover:text-white/80 underline"
                      >
                        Clear saved data
                      </button>
                    )}
                  </div>

                  {rememberMe && (
                    <p className="text-xs text-white/50 italic">
                      Your email and password will be saved for faster login
                      next time
                    </p>
                  )}

                  <div className="flex justify-end">
                    <Button
                      type="button"
                      variant="link"
                      className="px-0 text-sm text-white/80 hover:text-white"
                      onClick={() => navigate("/auth/reset")}
                    >
                      Forgot password?
                    </Button>
                  </div>
                </div>
              )}

              <Button
                type="submit"
                className="w-full h-12 bg-[#E11900] hover:bg-[#B51400] text-white font-semibold text-base rounded-xl transition-all duration-200 active:scale-95 shadow-lg hover:shadow-xl"
                disabled={loading}
              >
                {loading
                  ? "Processing..."
                  : isSignUp
                    ? "Create Account"
                    : "Sign In"}
              </Button>
            </form>

            <div className="text-center pt-4 border-t border-white/20">
              <button
                type="button"
                onClick={() => setIsSignUp(!isSignUp)}
                className="text-white/80 hover:text-white hover:underline transition-colors duration-200 font-medium"
              >
                {isSignUp
                  ? "Already have an account? Sign in"
                  : "Don't have an account? Sign up here."}
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DriverAuth;
