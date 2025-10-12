import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { AuthHeader } from "@/components/AuthHeader";
import SiteHeader from "@/components/SiteHeader";
import { ArrowLeft } from "lucide-react";
import mapBackgroundImage from "@/assets/map-background.jpg";

const DriverAuth = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const createDriverProfile = async () => {
    try {
      const { error } = await supabase.rpc('create_profile_for_current_user', {
        _user_type: 'driver',
        _name: fullName,
        _phone: phoneNumber
      });

      if (error) throw error;
    } catch (error) {
      console.error('Error creating driver profile:', error);
      throw error;
    }
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isSignUp) {
        // Log driver signup to database (background task)
        const logSignup = async (status: 'success' | 'failure', errorMsg?: string) => {
          try {
            await supabase.from('form_submissions').insert({
              form_type: 'driver_signup',
              name: fullName,
              email: email,
              message: `Phone: ${phoneNumber}`,
              status,
              error_message: errorMsg,
              metadata: {
                phone: phoneNumber
              }
            });
          } catch (err) {
            console.error('Failed to log driver signup:', err);
          }
        };

        const { data: authData, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/`,
            data: {
              full_name: fullName,
              phone_number: phoneNumber,
              user_type: 'driver'
            }
          }
        });

        if (signUpError) {
          await logSignup('failure', signUpError.message);
          throw signUpError;
        }

        if (authData.user) {
          try {
            await createDriverProfile();
            await logSignup('success');
          } catch (profileError) {
            console.error('Profile creation failed:', profileError);
            await logSignup('failure', 'Profile creation failed');
          }

          if (!authData.user.email_confirmed_at) {
            toast({
              title: "Account created!",
              description: "Check your email to verify your account, then sign in."
            });
            setIsSignUp(false);
          } else {
            toast({
              title: "Account created!",
              description: "Successfully logged in."
            });
            navigate('/driver/dashboard');
          }
        }
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password
        });

        if (error) throw error;

        // CRITICAL: Verify user is actually a driver
        const { data: profile } = await supabase
          .rpc('get_user_profile')
          .maybeSingle();

        if (profile?.user_type !== 'driver') {
          // Wrong account type - sign them out immediately
          await supabase.auth.signOut();
          throw new Error(
            `This is a driver login page. Your account is registered as a ${profile?.user_type || 'different type'}. Please use the correct login page: ${
              profile?.user_type === 'dealer' ? '/dealer/auth' : 
              profile?.user_type === 'swap_coordinator' ? '/swap-coordinator/auth' : 
              '/'
            }`
          );
        }

        toast({
          title: "Welcome back!",
          description: "Successfully logged in."
        });
        navigate('/driver/dashboard');
      }
    } catch (error: any) {
      toast({
        title: "Authentication failed",
        description: error.message,
        variant: "destructive"
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
            {isSignUp ? 'Join as' : 'Driver'} <span className="text-[#E11900]">{isSignUp ? 'Driver' : 'Login'}</span>
            <span className="text-[#E11900]">.</span>
          </h1>
          <p className="text-lg text-white/80 my-0">
            {isSignUp ? 'Start earning with SwapRunn' : 'Sign in to access your dashboard'}
          </p>
        </div>

        <Card className="w-full max-w-md mx-auto bg-gradient-to-br from-neutral-800 to-neutral-900 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.3)] border-transparent">
          
          <CardContent className="space-y-6">
            <form onSubmit={handleAuth} className="space-y-4">
              {isSignUp && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="fullName" className="text-white text-sm font-medium">
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
                    <Label htmlFor="phoneNumber" className="text-white text-sm font-medium">
                      Phone Number
                    </Label>
                    <Input 
                      id="phoneNumber" 
                      type="tel" 
                      value={phoneNumber} 
                      onChange={(e) => setPhoneNumber(e.target.value)} 
                      placeholder="Enter your phone number" 
                      className="h-12 bg-white border-gray-300 text-gray-900 placeholder:text-gray-500 focus:border-[#E11900] focus:ring-2 focus:ring-[#E11900]/20" 
                      required 
                    />
                  </div>
                </>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="email" className="text-white text-sm font-medium">
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
                <Label htmlFor="password" className="text-white text-sm font-medium">
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
              
              <Button 
                type="submit" 
                className="w-full h-12 bg-[#E11900] hover:bg-[#B51400] text-white font-semibold text-base rounded-xl transition-all duration-200 active:scale-95 shadow-lg hover:shadow-xl" 
                disabled={loading}
              >
                {loading ? "Processing..." : isSignUp ? "Create Account" : "Sign In"}
              </Button>
            </form>
            
            <div className="text-center pt-4 border-t border-white/20">
              <button 
                type="button" 
                onClick={() => setIsSignUp(!isSignUp)} 
                className="text-white/80 hover:text-white hover:underline transition-colors duration-200 font-medium"
              >
                {isSignUp ? "Already have an account? Sign in" : "Don't have an account? Sign up here."}
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DriverAuth;