import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import mapBackgroundImage from "@/assets/map-background.jpg";
import BackButton from "@/components/BackButton";
import { cleanPhoneNumber } from "@/lib/utils";
import type { User } from "@supabase/supabase-js";

type SwapCoordinatorMetadata = {
  user_type?: string;
  full_name?: string;
  first_name?: string;
  last_name?: string;
  phone?: string;
  phone_number?: string;
  contact_phone?: string;
};

const extractSwapCoordinatorMetadata = (user: User | null): SwapCoordinatorMetadata => {
  const raw = user?.user_metadata;
  if (raw && typeof raw === "object") {
    return raw as SwapCoordinatorMetadata;
  }
  return {};
};

export default function SwapCoordinatorAuth() {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);

  const createSwapCoordinatorProfile = async (details?: {
    fullName?: string | null;
    phone?: string | null;
  }) => {
    const resolvedFullName = (details?.fullName ?? `${firstName} ${lastName}`.trim()).trim();
    const hasFullName = resolvedFullName.length > 0;
    const resolvedPhone = details?.phone ?? phone;
    const sanitizedPhone = resolvedPhone ? cleanPhoneNumber(resolvedPhone) : "";

    try {
      const { error } = await supabase.rpc("create_profile_for_current_user", {
        _user_type: "swap_coordinator",
        _name: hasFullName ? resolvedFullName : null,
        _phone: sanitizedPhone || null,
        _company_name: null
      });

      if (error) throw error;
    } catch (profileError) {
      console.error("Swap coordinator profile creation failed:", profileError);
      throw profileError;
    }
  };

  const tryRepairSwapCoordinatorProfile = async (authUser: User | null) => {
    if (!authUser) return;

    const metadata = extractSwapCoordinatorMetadata(authUser);
    if (metadata.user_type !== "swap_coordinator") {
      return;
    }

    const metadataFullName = (() => {
      const direct = typeof metadata.full_name === "string" ? metadata.full_name : "";
      if (direct.trim()) return direct.trim();
      const first = typeof metadata.first_name === "string" ? metadata.first_name : "";
      const last = typeof metadata.last_name === "string" ? metadata.last_name : "";
      return `${first} ${last}`.trim();
    })();

    const metadataPhoneCandidate = [metadata.phone, metadata.phone_number, metadata.contact_phone]
      .find((candidate) => typeof candidate === "string" && candidate.trim()) ?? null;

    try {
      await createSwapCoordinatorProfile({
        fullName: metadataFullName || null,
        phone: metadataPhoneCandidate,
      });
    } catch (repairError) {
      console.error("Automatic swap coordinator profile repair failed:", repairError);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;

        // CRITICAL: Verify user is actually a swap coordinator
        const { data: initialProfile } = await supabase
          .rpc('get_user_profile')
          .maybeSingle();

        let profile = initialProfile;

        if (!profile) {
          await tryRepairSwapCoordinatorProfile(data.user ?? null);
          const { data: repairedProfile } = await supabase
            .rpc('get_user_profile')
            .maybeSingle();
          profile = repairedProfile ?? null;
        }

        if (profile?.user_type !== 'swap_coordinator') {
          await supabase.auth.signOut();
          const metadataUserType = extractSwapCoordinatorMetadata(data.user ?? null).user_type;
          const accountType = profile?.user_type || metadataUserType || 'different type';
          throw new Error(
            `This is a swap coordinator login page. Your account is registered as a ${accountType}. Please use the correct login page: ${
              accountType === 'dealer' ? '/dealer/auth' : 
              accountType === 'driver' ? '/driver/auth' : 
              '/'
            }`
          );
        }

        navigate("/swap-coordinator/dashboard");
      } else {
        const { data: authData, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/`,
            data: {
              first_name: firstName,
              last_name: lastName,
              full_name: `${firstName} ${lastName}`,
              phone,
              user_type: "swap_coordinator",
            },
          },
        });

        if (error) throw error;
        if (authData.user) {
          try {
            await createSwapCoordinatorProfile({
              fullName: `${firstName} ${lastName}`.trim(),
              phone
            });
          } catch (profileError) {
            console.error('Swap coordinator profile creation after signup failed:', profileError);
          }
        }
        toast.success("Account created! Redirecting...");
        navigate("/swap-coordinator/dashboard");
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "Please try again.";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className="min-h-screen relative px-4" 
      style={{
        backgroundImage: `url(${mapBackgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
    >
      {/* Back Button */}
      <BackButton />
      
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70 z-0"></div>
      
      {/* Content */}
      <div className="relative z-10 container max-w-7xl mx-auto px-6 pt-24">
        <div className="text-center mb-4">
          <h1 className="font-bold text-white mb-2 my-0 text-5xl">
            Swap <span className="text-[#E11900]">Coordinator</span>
            <span className="text-[#E11900]">.</span>
          </h1>
          <p className="text-lg text-white/80 my-0">
            {isLogin ? 'Sign in to manage swaps' : 'Create your coordinator account'}
          </p>
        </div>

        <Card className="w-full max-w-md mx-auto bg-gradient-to-br from-neutral-800 to-neutral-900 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.3)] border-transparent">
          
          <CardContent className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="firstName" className="text-white text-sm font-medium">First Name</Label>
                    <Input
                      id="firstName"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      required
                      placeholder="Enter your first name"
                      className="h-12 bg-white border-gray-300 text-gray-900 placeholder:text-gray-500 focus:border-[#E11900] focus:ring-2 focus:ring-[#E11900]/20"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName" className="text-white text-sm font-medium">Last Name</Label>
                    <Input
                      id="lastName"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      required
                      placeholder="Enter your last name"
                      className="h-12 bg-white border-gray-300 text-gray-900 placeholder:text-gray-500 focus:border-[#E11900] focus:ring-2 focus:ring-[#E11900]/20"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-white text-sm font-medium">Phone</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      required
                      placeholder="Enter your phone number"
                      className="h-12 bg-white border-gray-300 text-gray-900 placeholder:text-gray-500 focus:border-[#E11900] focus:ring-2 focus:ring-[#E11900]/20"
                    />
                  </div>
                </>
              )}

              <div className="space-y-2">
                <Label htmlFor="email" className="text-white text-sm font-medium">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="Enter your email address"
                  className="h-12 bg-white border-gray-300 text-gray-900 placeholder:text-gray-500 focus:border-[#E11900] focus:ring-2 focus:ring-[#E11900]/20"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-white text-sm font-medium">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="Enter your password"
                  className="h-12 bg-white border-gray-300 text-gray-900 placeholder:text-gray-500 focus:border-[#E11900] focus:ring-2 focus:ring-[#E11900]/20"
                  minLength={isLogin ? undefined : 6}
                />
              </div>

              {isLogin && (
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
              )}

              <Button
                type="submit"
                disabled={loading}
                className="w-full h-12 bg-[#E11900] hover:bg-[#B51400] text-white font-semibold text-base rounded-xl transition-all duration-200 active:scale-95 shadow-lg hover:shadow-xl"
              >
                {loading ? "Processing..." : isLogin ? "Sign In" : "Create Account"}
              </Button>
            </form>

            <div className="text-center pt-4 border-t border-white/20">
              <button
                type="button"
                onClick={() => setIsLogin(!isLogin)}
                className="text-white/80 hover:text-white hover:underline transition-colors duration-200 font-medium"
              >
                {isLogin
                  ? "Don't have an account? Sign up here."
                  : "Already have an account? Sign in"}
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
