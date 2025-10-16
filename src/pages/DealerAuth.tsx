import { useState, useEffect, useCallback } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import SiteHeader from "@/components/SiteHeader";
import { AuthHeader } from "@/components/AuthHeader";
import { Crown, ArrowLeft, Fingerprint } from "lucide-react";
import mapBackgroundImage from "@/assets/map-background.jpg";
import { useBiometricAuth } from "@/hooks/useBiometricAuth";
import BackButton from "@/components/BackButton";

const SAVED_EMAIL_KEY = 'swaprunn_saved_email';
const SAVED_PASSWORD_KEY = 'swaprunn_saved_password';
const REMEMBER_ME_KEY = 'swaprunn_remember_me';

const DealerAuth = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [role, setRole] = useState<"salesperson" | "manager" | "owner">("salesperson");
  const [rememberMe, setRememberMe] = useState(true);
  const [useBiometric, setUseBiometric] = useState(true);

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const biometric = useBiometricAuth();

  // Check for admin role in URL params
  const urlParams = new URLSearchParams(window.location.search);
  const isAdminSignup = urlParams.get('role') === 'admin';

  // Load saved credentials on mount
  useEffect(() => {
    const savedEmail = localStorage.getItem(SAVED_EMAIL_KEY);
    const savedPassword = localStorage.getItem(SAVED_PASSWORD_KEY);
    const savedRememberMe = localStorage.getItem(REMEMBER_ME_KEY) === 'true';
    
    if (savedEmail) {
      setEmail(savedEmail);
    }
    if (savedPassword && savedRememberMe) {
      setPassword(savedPassword);
    }
    setRememberMe(savedRememberMe);
  }, []);

  const attemptBiometricLogin = useCallback(async () => {
    try {
      const credentials = await biometric.getCredentials();
      if (!credentials) return;

      const verified = await biometric.authenticate('Use Face ID to sign in to SwapRunn');
      if (!verified) return;

      // Auto-login with saved credentials
      const { error } = await supabase.auth.signInWithPassword({
        email: credentials.email,
        password: credentials.password,
      });

      if (error) {
        toast({
          title: "Biometric login failed",
          description: "Please sign in manually",
          variant: "destructive"
        });
        return;
      }

      toast({
        title: "Welcome back!",
        description: "Signed in with Face ID"
      });
    } catch (error) {
      console.error('Biometric login error:', error);
    }
  }, [biometric, toast]);

  // Try biometric login on mount if available
  useEffect(() => {
    if (!isSignUp && biometric.isAvailable) {
      attemptBiometricLogin();
    }
  }, [biometric.isAvailable, isSignUp, attemptBiometricLogin]);

  const createDealerProfile = async () => {
    try {
      const {
        data,
        error
      } = await supabase.rpc('create_profile_for_current_user', {
        _user_type: 'dealer',
        _company_name: companyName,
        _name: `${firstName} ${lastName}`.trim()
      });
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating dealer profile:', error);
      throw error;
    }
  };
  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isSignUp) {
        const {
          data: authData,
          error: signUpError
        } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/`,
            data: {
              first_name: firstName,
              last_name: lastName,
              full_name: `${firstName} ${lastName}`.trim(),
              company_name: companyName,
              user_type: 'dealer',
              role: role
            }
          }
        });
        if (signUpError) throw signUpError;
        if (authData.user) {
          // Manually create dealer and profile records
          try {
            await createDealerProfile();
          } catch (profileError) {
            console.error('Profile creation failed:', profileError);
            // Continue anyway - profile can be created later
          }
          
          // Save email
          localStorage.setItem(SAVED_EMAIL_KEY, email);
          
          if (!authData.user.email_confirmed_at) {
            toast({
              title: "Account created!",
              description: "Check your email to verify your account, then sign in."
            });
            setIsSignUp(false); // Switch to login mode
          } else {
            toast({
              title: "Account created!",
              description: "Successfully logged in."
            });
            navigate(isAdminSignup ? '/dealer/admin' : '/dealer/dashboard');
          }
        }
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        
        if (error) throw error;

        // CRITICAL: Verify user is actually a dealer
        const { data: profile } = await supabase
          .rpc('get_user_profile')
          .maybeSingle();

        if (profile?.user_type !== 'dealer') {
          // Wrong account type - sign them out immediately
          await supabase.auth.signOut();
          throw new Error(
            `This is a dealer login page. Your account is registered as a ${profile?.user_type || 'different type'}. Please use the correct login page: ${
              profile?.user_type === 'driver' ? '/driver/auth' : 
              profile?.user_type === 'swap_coordinator' ? '/swap-coordinator/auth' : 
              '/'
            }`
          );
        }
        
        // Save credentials based on "Remember Me" preference
        localStorage.setItem(SAVED_EMAIL_KEY, email);
        localStorage.setItem(REMEMBER_ME_KEY, rememberMe.toString());
        
        if (rememberMe) {
          // Save password securely in localStorage for convenience
          localStorage.setItem(SAVED_PASSWORD_KEY, password);
          
          // Also save to biometric storage if available
          if (useBiometric && biometric.isAvailable) {
            await biometric.saveCredentials(email, password);
            toast({
              title: "Credentials saved",
              description: "Your login will be remembered for faster access",
              duration: 3000,
            });
          }
        } else {
          // Clear saved password if remember me is unchecked
          localStorage.removeItem(SAVED_PASSWORD_KEY);
        }
        
        toast({
          title: "Welcome back!",
          description: "Successfully logged in."
        });

        navigate('/dealer/dashboard');
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Please try again.';
      toast({
        title: "Authentication failed",
        description: message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  return <div className="min-h-screen relative" style={{
    backgroundImage: `url(${mapBackgroundImage})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center'
  }}>
      {/* Back Button */}
      <BackButton />
      
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70 z-0"></div>
      
      {/* Content */}
      <div className="relative z-10 container max-w-7xl mx-auto px-4 sm:px-6 pt-28">
        <div className="text-center mb-4">
          <h1 className="font-bold text-white mb-2 my-0 text-5xl">
            Dealer <span className="text-[#E11900]">{isSignUp ? 'Sign Up' : 'Sign In'}</span>
            <span className="text-[#E11900]">.</span>
          </h1>
          <p className="text-lg text-white/80 my-0">
            {isSignUp ? 'Create your dealer account' : 'Access the Dealer Portal'}
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
                    <Label htmlFor="firstName" className="text-white text-sm font-medium">
                      First Name
                    </Label>
                    <Input 
                      id="firstName" 
                      type="text" 
                      value={firstName} 
                      onChange={e => setFirstName(e.target.value)} 
                      placeholder="Enter your first name" 
                      className="h-12 bg-white border-gray-300 text-gray-900 placeholder:text-gray-500 focus:border-[#E11900] focus:ring-2 focus:ring-[#E11900]/20" 
                      required 
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="lastName" className="text-white text-sm font-medium">
                      Last Name
                    </Label>
                    <Input 
                      id="lastName" 
                      type="text" 
                      value={lastName} 
                      onChange={e => setLastName(e.target.value)} 
                      placeholder="Enter your last name" 
                      className="h-12 bg-white border-gray-300 text-gray-900 placeholder:text-gray-500 focus:border-[#E11900] focus:ring-2 focus:ring-[#E11900]/20" 
                      required 
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="company" className="text-white text-sm font-medium">
                      Company Name
                    </Label>
                    <Input 
                      id="company" 
                      type="text" 
                      value={companyName} 
                      onChange={e => setCompanyName(e.target.value)} 
                      placeholder="Enter your company name" 
                      className="h-12 bg-white border-gray-300 text-gray-900 placeholder:text-gray-500 focus:border-[#E11900] focus:ring-2 focus:ring-[#E11900]/20" 
                      required 
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="role" className="text-white text-sm font-medium">
                      Your Role
                    </Label>
                    <Select
                      value={role}
                      onValueChange={(value: "salesperson" | "manager" | "owner") => setRole(value)}
                    >
                      <SelectTrigger className="h-12 bg-white border-gray-300 text-gray-900 focus:border-[#E11900] focus:ring-2 focus:ring-[#E11900]/20">
                        <SelectValue placeholder="Select your role" />
                      </SelectTrigger>
                      <SelectContent className="bg-white border-gray-200">
                        <SelectItem value="salesperson" className="text-gray-900 hover:bg-gray-100 focus:bg-gray-100">
                          Sales
                        </SelectItem>
                        <SelectItem value="manager" className="text-gray-900 hover:bg-gray-100 focus:bg-gray-100">
                          Swap Manager
                        </SelectItem>
                        <SelectItem value="owner" className="text-gray-900 hover:bg-gray-100 focus:bg-gray-100">
                          Admin/Owner
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </>
              )}
              
              {/* Email Field */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-white text-sm font-medium">
                  Email Address
                </Label>
                <Input 
                  id="email" 
                  type="email" 
                  value={email} 
                  onChange={e => setEmail(e.target.value)} 
                  placeholder="Enter your email address" 
                  className="h-12 bg-white border-gray-300 text-gray-900 placeholder:text-gray-500 focus:border-[#E11900] focus:ring-2 focus:ring-[#E11900]/20" 
                  required 
                />
              </div>
              
              {/* Password Field */}
              <div className="space-y-2">
                <Label htmlFor="password" className="text-white text-sm font-medium">
                  Password
                </Label>
                <Input 
                  id="password" 
                  type="password" 
                  value={password} 
                  onChange={e => setPassword(e.target.value)} 
                  placeholder="Enter your password" 
                  className="h-12 bg-white border-gray-300 text-gray-900 placeholder:text-gray-500 focus:border-[#E11900] focus:ring-2 focus:ring-[#E11900]/20" 
                  required={isSignUp} 
                  minLength={isSignUp ? 6 : undefined} 
                />
              </div>
              
              {/* Remember Me & Biometric Options - Only show for sign in */}
              {!isSignUp && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="remember" 
                        checked={rememberMe}
                        onCheckedChange={(checked) => {
                          setRememberMe(checked as boolean);
                          if (!checked) {
                            // Clear saved password immediately if unchecked
                            localStorage.removeItem(SAVED_PASSWORD_KEY);
                          }
                        }}
                        className="border-white/20 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                      />
                      <Label 
                        htmlFor="remember" 
                        className="text-sm text-white/80 cursor-pointer font-medium"
                      >
                        Remember my login details
                      </Label>
                    </div>
                    
                    {/* Clear saved data button */}
                    {(localStorage.getItem(SAVED_EMAIL_KEY) || localStorage.getItem(SAVED_PASSWORD_KEY)) && (
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
                            description: "Saved login details have been cleared",
                          });
                        }}
                        className="text-xs text-white/50 hover:text-white/80 underline"
                      >
                        Clear saved data
                      </button>
                    )}
                  </div>
                  
                  {biometric.isAvailable && (
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="biometric" 
                        checked={useBiometric}
                        onCheckedChange={(checked) => setUseBiometric(checked as boolean)}
                        className="border-white/20 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                      />
                      <Label 
                        htmlFor="biometric" 
                        className="text-sm text-white/80 cursor-pointer flex items-center gap-2 font-medium"
                      >
                        <Fingerprint className="w-4 h-4" />
                        Enable {biometric.biometryType === 'face' ? 'Face ID' : 'Touch ID'}
                      </Label>
                    </div>
                  )}
                  
                  {rememberMe && (
                    <p className="text-xs text-white/50 italic">
                      Your email and password will be saved for faster login next time
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
              
              {/* Submit Button */}
              <Button 
                type="submit" 
                className="w-full h-12 bg-[#E11900] hover:bg-[#B51400] text-white font-semibold text-base rounded-xl transition-all duration-200 active:scale-95 shadow-lg hover:shadow-xl" 
                disabled={loading}
              >
                {loading ? "Processing..." : isSignUp ? "Create Account" : "Sign In"}
              </Button>
            </form>
            
            {/* Toggle Link */}
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
    </div>;
};

export default DealerAuth;