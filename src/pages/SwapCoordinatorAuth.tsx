import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { AuthHeader } from "@/components/AuthHeader";
import mapBackgroundImage from "@/assets/map-background.jpg";

export default function SwapCoordinatorAuth() {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);

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
        const { data: profile } = await supabase
          .rpc('get_user_profile')
          .maybeSingle();

        if (profile?.user_type !== 'swap_coordinator') {
          // Wrong account type - sign them out immediately
          await supabase.auth.signOut();
          throw new Error(
            `This is a swap coordinator login page. Your account is registered as a ${profile?.user_type || 'different type'}. Please use the correct login page: ${
              profile?.user_type === 'dealer' ? '/dealer/auth' : 
              profile?.user_type === 'driver' ? '/driver/auth' : 
              '/'
            }`
          );
        }

        navigate("/swap-coordinator/dashboard");
      } else {
        const { error } = await supabase.auth.signUp({
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
        toast.success("Account created! Redirecting...");
        navigate("/swap-coordinator/dashboard");
      }
    } catch (error: any) {
      toast.error(error.message);
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
