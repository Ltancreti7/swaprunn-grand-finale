import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signIn, signUp } from "@/services/authService";
import { useToast } from "@/components/ui/use-toast";

interface AuthPageProps {
  role: "dealer" | "driver" | "manager";
}

export default function AuthPage({ role }: AuthPageProps) {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const validate = () => {
    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      toast({ title: "Invalid email", description: "Please enter a valid email.", variant: "destructive" });
      return false;
    }
    if (!password || password.length < 6) {
      toast({ title: "Weak password", description: "Password must be at least 6 characters.", variant: "destructive" });
      return false;
    }
    return true;
  };

  const handleLogin = async () => {
    if (!validate()) return;
    try {
      setLoading(true);
      const { user, error } = await signIn(email, password);
      if (error) throw error;
      const userRole = (user as unknown as { user_metadata?: { role?: string } })?.user_metadata?.role;
      toast({ title: "Signed in", description: "Welcome back", variant: "default" });
      if (userRole) navigate(`/${userRole}-dashboard`);
      else navigate(`/`);
    } catch (err: unknown) {
      let message: string;
      if (typeof err === 'object' && err !== null && 'message' in err && typeof (err as { message?: unknown }).message === 'string') {
        message = (err as { message: string }).message;
      } else {
        message = String(err);
      }
      toast({ title: "Sign in failed", description: message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async () => {
    if (!validate()) return;
    try {
      setLoading(true);
      const { user, error } = await signUp(email, password, role);
      if (error) throw error;
      toast({ title: "Account created", description: "Please check your email to confirm.", variant: "default" });
      navigate(`/${role}-dashboard`);
    } catch (err: unknown) {
      let message: string;
      if (typeof err === 'object' && err !== null && 'message' in err && typeof (err as { message?: unknown }).message === 'string') {
        message = (err as { message: string }).message;
      } else {
        message = String(err);
      }
      toast({ title: "Signup failed", description: message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white px-4">
      <div className="w-full max-w-sm bg-neutral-900 rounded-2xl p-6 shadow-lg">
        <h1 className="text-3xl font-bold text-center mb-2">
          {role.charAt(0).toUpperCase() + role.slice(1)}{" "}
          <span className="text-red-500">Sign In.</span>
        </h1>
        <p className="text-center mb-6 text-gray-400">Access the {role.charAt(0).toUpperCase() + role.slice(1)} Portal</p>

        <label className="block text-sm font-semibold mb-1">Email Address</label>
        <input className="w-full p-3 rounded-lg bg-neutral-800 text-white mb-4 focus:outline-none" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter your email" />

        <label className="block text-sm font-semibold mb-1">Password</label>
        <div className="relative mb-6">
          <input className="w-full p-3 rounded-lg bg-neutral-800 text-white focus:outline-none pr-10" type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter your password" />
          <button type="button" className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" onClick={() => setShowPassword(!showPassword)}>{showPassword ? "🙈" : "👁️"}</button>
        </div>

        <button onClick={handleLogin} disabled={loading} className="w-full bg-red-600 hover:bg-red-700 py-3 rounded-lg font-semibold mb-3 disabled:opacity-50">
          {loading ? "Signing in..." : "Sign In"}
        </button>

        <p className="text-center text-sm text-gray-400">Don't have an account? <span onClick={handleSignup} className={`text-red-500 cursor-pointer ${loading ? 'pointer-events-none opacity-50' : ''}`}>Sign up here.</span></p>
      </div>
    </div>
  );
}
