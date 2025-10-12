import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Clock, 
  DollarSign, 
  MapPin, 
  Smartphone, 
  TrendingDown, 
  Users, 
  CheckCircle,
  ArrowRight,
  Zap,
  Shield
} from "lucide-react";
import mapBackgroundImage from "@/assets/map-background.jpg";

const DealersOverview = () => {
  return (
    <div className="min-h-screen relative bg-black" style={{
      backgroundImage: `url(${mapBackgroundImage})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      backgroundAttachment: 'fixed'
    }}>
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/85 via-black/75 to-black/60 z-0"></div>

      <div className="relative z-10 container mx-auto px-6 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            Streamline Your Dealership <span className="text-[#E11900]">Logistics</span>
          </h1>
          <p className="text-xl text-white/80 max-w-3xl mx-auto mb-8">
            Real-time tracking, faster swaps, and significant cost savings — all in one platform built for modern dealerships.
          </p>
          <Button asChild size="lg" className="bg-[#E11900] hover:bg-[#E11900]/90 text-white h-12 rounded-2xl">
            <Link to="/dealers/registration">
              Get Started Now
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>

        {/* Benefits Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          <Card className="bg-white/5 backdrop-blur-sm border-white/10">
            <CardHeader>
              <div className="w-12 h-12 bg-[#E11900]/20 rounded-full flex items-center justify-center mb-4">
                <MapPin className="h-6 w-6 text-[#E11900]" />
              </div>
              <CardTitle className="text-white">Real-Time Tracking</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-white/70">
                Monitor every delivery with live GPS tracking. Know exactly where your vehicles are at all times.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/5 backdrop-blur-sm border-white/10">
            <CardHeader>
              <div className="w-12 h-12 bg-[#E11900]/20 rounded-full flex items-center justify-center mb-4">
                <Clock className="h-6 w-6 text-[#E11900]" />
              </div>
              <CardTitle className="text-white">Faster Swaps</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-white/70">
                Reduce delivery time by up to 60% with our optimized driver network and instant dispatch system.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/5 backdrop-blur-sm border-white/10">
            <CardHeader>
              <div className="w-12 h-12 bg-[#E11900]/20 rounded-full flex items-center justify-center mb-4">
                <TrendingDown className="h-6 w-6 text-[#E11900]" />
              </div>
              <CardTitle className="text-white">Cost Savings</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-white/70">
                Save up to 40% on logistics costs compared to traditional methods. Pay per swap with transparent pricing.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* How It Works */}
        <div className="mb-16">
          <h2 className="text-4xl font-bold text-white text-center mb-12">
            How SwapRunn Works
          </h2>
          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-[#E11900]/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-[#E11900]" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">1. Sign Up</h3>
              <p className="text-white/70">
                Create your dealership account in minutes
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-[#E11900]/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Smartphone className="h-8 w-8 text-[#E11900]" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">2. Request</h3>
              <p className="text-white/70">
                Submit delivery or swap requests instantly
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-[#E11900]/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="h-8 w-8 text-[#E11900]" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">3. Match</h3>
              <p className="text-white/70">
                We instantly connect you with verified drivers
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-[#E11900]/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-8 w-8 text-[#E11900]" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">4. Track</h3>
              <p className="text-white/70">
                Monitor progress from pickup to delivery
              </p>
            </div>
          </div>
        </div>

        {/* Dashboard Preview */}
        <div className="mb-16">
          <h2 className="text-4xl font-bold text-white text-center mb-8">
            Your Command Center
          </h2>
          <Card className="bg-white/5 backdrop-blur-sm border-white/10 overflow-hidden">
            <CardContent className="p-0">
              <img 
                src="/dashboard-preview.png" 
                alt="SwapRunn Dashboard Preview" 
                className="w-full h-auto opacity-90"
              />
            </CardContent>
          </Card>
          <p className="text-center text-white/70 mt-4">
            Manage all your deliveries, track drivers, and analyze performance from one powerful dashboard
          </p>
        </div>

        {/* Features List */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          <div>
            <h3 className="text-2xl font-bold text-white mb-6">Platform Features</h3>
            <ul className="space-y-4">
              {[
                "Live GPS tracking for all deliveries",
                "Instant driver dispatch system",
                "Automated job assignments",
                "Digital inspection reports",
                "Real-time status updates",
                "Mobile-optimized interface"
              ].map((feature, index) => (
                <li key={index} className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-[#E11900] mt-0.5 flex-shrink-0" />
                  <span className="text-white/80">{feature}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-2xl font-bold text-white mb-6">Security & Compliance</h3>
            <ul className="space-y-4">
              {[
                "Background-checked drivers",
                "Full insurance coverage",
                "Secure payment processing",
                "GDPR compliant data handling",
                "24/7 support availability",
                "Detailed audit trails"
              ].map((feature, index) => (
                <li key={index} className="flex items-start gap-3">
                  <Shield className="h-5 w-5 text-[#E11900] mt-0.5 flex-shrink-0" />
                  <span className="text-white/80">{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Pricing Preview */}
        <div className="mb-16">
          <h2 className="text-4xl font-bold text-white text-center mb-12">
            Transparent Pricing
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="bg-white/5 backdrop-blur-sm border-white/10">
              <CardHeader>
                <CardTitle className="text-white">Starter</CardTitle>
                <div className="text-3xl font-bold text-[#E11900] mt-2">$99<span className="text-lg text-white/70">/mo</span></div>
              </CardHeader>
              <CardContent>
                <p className="text-white/70 mb-4">Perfect for small dealerships</p>
                <ul className="space-y-2 text-white/70 text-sm">
                  <li>• Up to 20 swaps/month</li>
                  <li>• Basic tracking</li>
                  <li>• Email support</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-[#E11900]/10 backdrop-blur-sm border-[#E11900]/30 relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#E11900] text-white px-4 py-1 rounded-full text-sm">
                Popular
              </div>
              <CardHeader>
                <CardTitle className="text-white">Professional</CardTitle>
                <div className="text-3xl font-bold text-[#E11900] mt-2">$249<span className="text-lg text-white/70">/mo</span></div>
              </CardHeader>
              <CardContent>
                <p className="text-white/70 mb-4">For growing dealerships</p>
                <ul className="space-y-2 text-white/70 text-sm">
                  <li>• Up to 100 swaps/month</li>
                  <li>• Advanced tracking & analytics</li>
                  <li>• Priority support</li>
                  <li>• API access</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-white/5 backdrop-blur-sm border-white/10">
              <CardHeader>
                <CardTitle className="text-white">Enterprise</CardTitle>
                <div className="text-3xl font-bold text-[#E11900] mt-2">Custom</div>
              </CardHeader>
              <CardContent>
                <p className="text-white/70 mb-4">For dealership groups</p>
                <ul className="space-y-2 text-white/70 text-sm">
                  <li>• Unlimited swaps</li>
                  <li>• Custom integrations</li>
                  <li>• Dedicated account manager</li>
                  <li>• SLA guarantee</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center bg-gradient-to-r from-[#E11900]/20 to-[#E11900]/10 rounded-3xl p-12 border border-[#E11900]/30">
          <h2 className="text-4xl font-bold text-white mb-4">
            Ready to Transform Your Logistics?
          </h2>
          <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
            Join hundreds of dealerships already saving time and money with SwapRunn
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-[#E11900] hover:bg-[#E11900]/90 text-white h-12 rounded-2xl">
              <Link to="/dealers/registration">
                Start Free Trial
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="bg-transparent text-white border-white/25 hover:bg-white/10 h-12 rounded-2xl">
              <Link to="/contact">
                Contact Sales
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DealersOverview;
