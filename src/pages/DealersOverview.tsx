import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Clock, 
  MapPin, 
  TrendingDown, 
  Users, 
  CheckCircle,
  ArrowRight,
  ArrowLeft,
  Car,
  Smartphone,
  Shield,
  Zap
} from "lucide-react";
import mapBackgroundImage from "@/assets/map-background.jpg";

const DealersOverview = () => {
  return (
    <div className="min-h-screen relative bg-black" style={{
      backgroundImage: `url(${mapBackgroundImage})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center top',
      backgroundRepeat: 'no-repeat',
      backgroundAttachment: 'fixed'
    }}>
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/75 via-black/65 to-black/40 z-0"></div>

      <div className="relative z-10 container mx-auto px-4 sm:px-6 pt-12 pb-12">
        {/* Back Button */}
        <Button asChild variant="ghost" size="lg" className="text-white/80 hover:text-white hover:bg-white/10 mb-8">
          <Link to="/">
            <ArrowLeft className="mr-2 h-5 w-5" />
            Back to Home
          </Link>
        </Button>
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-black tracking-tight text-white mb-6 leading-tight">
            Streamline Your Dealership <span className="text-[#E11900]">Logistics</span>
          </h1>
          <p className="text-xl md:text-2xl text-white/80 max-w-3xl mx-auto leading-relaxed mb-8">
            Real-time tracking, faster swaps, and significant cost savings — all in one platform built for modern dealerships.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/dealer/auth">
              <Button size="lg" className="bg-[#E11900] hover:bg-[#E11900]/90 text-white font-bold py-4 px-8 rounded-xl text-lg shadow-lg hover:shadow-xl transition-all duration-300">
                Get Started Now
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link to="/how-it-works">
              <Button variant="outline" size="lg" className="border-white/40 text-white hover:bg-white/10 font-bold py-4 px-8 rounded-xl text-lg shadow-lg hover:shadow-xl transition-all duration-300">
                See How It Works
              </Button>
            </Link>
          </div>
        </div>

        {/* Benefits Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-20">
          <Card className="bg-gray-900/80 backdrop-blur-sm border-gray-700/50 shadow-2xl rounded-2xl overflow-hidden group hover:scale-105 transition-transform duration-300">
            <CardContent className="p-8">
              <div className="w-16 h-16 bg-[#E11900]/20 rounded-full flex items-center justify-center mb-6">
                <MapPin className="h-8 w-8 text-[#E11900]" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Real-Time Tracking</h3>
              <p className="text-white/80 text-lg leading-relaxed">
                Monitor every delivery with live GPS tracking. Know exactly where your vehicles are at all times.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gray-900/80 backdrop-blur-sm border-gray-700/50 shadow-2xl rounded-2xl overflow-hidden group hover:scale-105 transition-transform duration-300">
            <CardContent className="p-8">
              <div className="w-16 h-16 bg-[#E11900]/20 rounded-full flex items-center justify-center mb-6">
                <Clock className="h-8 w-8 text-[#E11900]" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Faster Swaps</h3>
              <p className="text-white/80 text-lg leading-relaxed">
                Reduce delivery time by up to 60% with our optimized driver network and instant dispatch system.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gray-900/80 backdrop-blur-sm border-gray-700/50 shadow-2xl rounded-2xl overflow-hidden group hover:scale-105 transition-transform duration-300">
            <CardContent className="p-8">
              <div className="w-16 h-16 bg-[#E11900]/20 rounded-full flex items-center justify-center mb-6">
                <TrendingDown className="h-8 w-8 text-[#E11900]" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Cost Savings</h3>
              <p className="text-white/80 text-lg leading-relaxed">
                Save up to 40% on logistics costs compared to traditional methods. Pay per swap with transparent pricing.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Screenshot Gallery Section */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              See SwapRunn in <span className="text-[#E11900]">Action</span>
            </h2>
            <p className="text-lg text-white/70 max-w-2xl mx-auto">
              Real screenshots from our platform showing the actual dealer experience
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {/* Dashboard Screenshot */}
            <Card className="bg-gray-900/80 backdrop-blur-sm border-gray-700/50 shadow-2xl rounded-2xl overflow-hidden group hover:scale-105 transition-transform duration-300">
              <CardContent className="p-0">
                <div className="relative">
                  <img 
                    src="/dashboard-preview.png" 
                    alt="Dealer Dashboard Overview"
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="text-white font-bold text-lg mb-1">Dealer Dashboard</h3>
                    <p className="text-white/80 text-sm">Complete overview of all your delivery requests</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Request Form Screenshot */}
            <Card className="bg-gray-900/80 backdrop-blur-sm border-gray-700/50 shadow-2xl rounded-2xl overflow-hidden group hover:scale-105 transition-transform duration-300">
              <CardContent className="p-0">
                <div className="relative">
                  <div className="w-full h-48 bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
                    <div className="text-center">
                      <Car className="h-12 w-12 text-[#E11900] mx-auto mb-2" />
                      <p className="text-white font-medium">Request Form</p>
                      <p className="text-white/60 text-sm">5-Step Process</p>
                    </div>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="text-white font-bold text-lg mb-1">Easy Requests</h3>
                    <p className="text-white/80 text-sm">Streamlined 5-step vehicle delivery requests</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Mobile Experience */}
            <Card className="bg-gray-900/80 backdrop-blur-sm border-gray-700/50 shadow-2xl rounded-2xl overflow-hidden group hover:scale-105 transition-transform duration-300">
              <CardContent className="p-0">
                <div className="relative">
                  <div className="w-full h-48 bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
                    <div className="text-center">
                      <Smartphone className="h-12 w-12 text-[#E11900] mx-auto mb-2" />
                      <p className="text-white font-medium">Mobile Ready</p>
                      <p className="text-white/60 text-sm">iOS & Android</p>
                    </div>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="text-white font-bold text-lg mb-1">Mobile Experience</h3>
                    <p className="text-white/80 text-sm">Native mobile apps for dealers and drivers</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* How It Works */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              How <span className="text-[#E11900]">SwapRunn</span> Works
            </h2>
            <p className="text-lg text-white/70 max-w-2xl mx-auto">
              Simple steps to get your vehicles delivered professionally
            </p>
          </div>
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
        <div className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Your Command <span className="text-[#E11900]">Center</span>
            </h2>
            <p className="text-lg text-white/70 max-w-2xl mx-auto">
              Manage all your deliveries, track drivers, and analyze performance from one powerful dashboard
            </p>
          </div>
          <Card className="bg-gray-900/80 backdrop-blur-sm border-gray-700/50 shadow-2xl rounded-2xl overflow-hidden">
            <CardContent className="p-0">
              <img 
                src="/dashboard-preview.png" 
                alt="SwapRunn Dashboard Preview" 
                className="w-full h-auto opacity-90"
              />
            </CardContent>
          </Card>
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
        <div className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Transparent <span className="text-[#E11900]">Pricing</span>
            </h2>
            <p className="text-lg text-white/70 max-w-2xl mx-auto">
              Choose the plan that fits your dealership's needs
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="bg-gray-900/80 backdrop-blur-sm border-gray-700/50 shadow-2xl rounded-2xl">
              <CardHeader className="pb-4">
                <CardTitle className="text-white text-2xl">Starter</CardTitle>
                <div className="text-4xl font-bold text-[#E11900] mt-2">$99<span className="text-lg text-white/70">/mo</span></div>
              </CardHeader>
              <CardContent>
                <p className="text-white/80 mb-6 text-lg">Perfect for small dealerships</p>
                <ul className="space-y-3 text-white/80">
                  <li className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-[#E11900] flex-shrink-0" />
                    Up to 20 swaps/month
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-[#E11900] flex-shrink-0" />
                    Basic tracking
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-[#E11900] flex-shrink-0" />
                    Email support
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-[#E11900]/20 to-[#E11900]/10 backdrop-blur-sm border-[#E11900]/40 shadow-2xl rounded-2xl relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#E11900] text-white px-6 py-2 rounded-full text-sm font-bold">
                Most Popular
              </div>
              <CardHeader className="pb-4">
                <CardTitle className="text-white text-2xl">Professional</CardTitle>
                <div className="text-4xl font-bold text-[#E11900] mt-2">$249<span className="text-lg text-white/70">/mo</span></div>
              </CardHeader>
              <CardContent>
                <p className="text-white/80 mb-6 text-lg">For growing dealerships</p>
                <ul className="space-y-3 text-white/80">
                  <li className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-[#E11900] flex-shrink-0" />
                    Up to 100 swaps/month
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-[#E11900] flex-shrink-0" />
                    Advanced tracking & analytics
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-[#E11900] flex-shrink-0" />
                    Priority support
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-[#E11900] flex-shrink-0" />
                    API access
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-gray-900/80 backdrop-blur-sm border-gray-700/50 shadow-2xl rounded-2xl">
              <CardHeader className="pb-4">
                <CardTitle className="text-white text-2xl">Enterprise</CardTitle>
                <div className="text-4xl font-bold text-[#E11900] mt-2">Custom</div>
              </CardHeader>
              <CardContent>
                <p className="text-white/80 mb-6 text-lg">For dealership groups</p>
                <ul className="space-y-3 text-white/80">
                  <li className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-[#E11900] flex-shrink-0" />
                    Unlimited swaps
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-[#E11900] flex-shrink-0" />
                    Custom integrations
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-[#E11900] flex-shrink-0" />
                    Dedicated account manager
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-[#E11900] flex-shrink-0" />
                    SLA guarantee
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <Card className="bg-gradient-to-r from-[#E11900]/20 to-[#E11900]/10 backdrop-blur-sm border-[#E11900]/30 shadow-2xl rounded-2xl max-w-4xl mx-auto">
            <CardContent className="p-12">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                Ready to Transform Your <span className="text-[#E11900]">Logistics</span>?
              </h2>
              <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto leading-relaxed">
                Join hundreds of dealerships already saving time and money with SwapRunn's professional vehicle delivery platform.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/dealer/auth">
                  <Button size="lg" className="bg-[#E11900] hover:bg-[#E11900]/90 text-white font-bold py-4 px-8 rounded-xl text-lg shadow-lg hover:shadow-xl transition-all duration-300">
                    Get Started Now
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link to="/how-it-works">
                  <Button variant="outline" size="lg" className="border-white/40 text-white hover:bg-white/10 font-bold py-4 px-8 rounded-xl text-lg shadow-lg hover:shadow-xl transition-all duration-300">
                    Learn More
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Footer */}
        <footer className="relative z-10 py-12 mt-16 border-t border-white/10">
          <div className="container mx-auto px-6">
            <div className="flex flex-col md:flex-row justify-between items-center gap-6">
              <div className="text-center md:text-left">
                <span className="text-white/60 text-lg font-medium">© 2025 SwapRunn</span>
                <span className="text-white/30 text-sm ml-3">Professional Vehicle Delivery Platform</span>
              </div>
              
              <div className="flex gap-8">
                <Link to="/privacy" className="text-white/60 hover:text-white transition-colors font-medium">
                  Privacy Policy
                </Link>
                <Link to="/terms" className="text-white/60 hover:text-white transition-colors font-medium">
                  Terms of Service
                </Link>
                <Link to="/contact" className="text-white/60 hover:text-white transition-colors font-medium">
                  Contact Us
                </Link>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default DealersOverview;
