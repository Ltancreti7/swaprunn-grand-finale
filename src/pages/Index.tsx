import { Link } from "react-router-dom";
import SiteHeader from "@/components/SiteHeader";
import mapBackgroundImage from "@/assets/map-background.jpg";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Truck, CheckCircle, ArrowRight, Users, Clock, MapPin, Zap, Eye, Settings, Headphones, Play, Handshake } from "lucide-react";
const Index = () => {
  return <div className="min-h-screen relative bg-black" style={{
    backgroundImage: `url(${mapBackgroundImage})`,
    backgroundSize: '120%',
    backgroundPosition: 'center top',
    backgroundRepeat: 'no-repeat',
    backgroundAttachment: 'fixed'
  }}>
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/80 z-0"></div>
      
      <SiteHeader />

      {/* Hero Section - Center Focused */}
      <section className="relative z-10 py-10 lg:py-16">
        <div className="container mx-auto px-6 text-center">
          {/* Hero Content */}
          <div className="max-w-4xl mx-auto mb-12">
            <h1 className="text-5xl lg:text-7xl font-bold tracking-tight mb-6 text-white my-0">
              Deliver Faster. <span className="text-primary">Swap Smarter.</span>
            </h1>
            <p className="text-xl lg:text-2xl text-white/80 mb-10 max-w-2xl mx-auto my-[33px] italic">
              Streamline delivery, accelerate sales.
            </p>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12 my-0">
              <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-white border-none h-12 px-8 rounded-2xl">
                <Link to="/dealer/auth" className="my-0">
                  <Users className="mr-2 h-5 w-5" />
                  I'm a Dealer
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="bg-white/10 text-white border-white/20 hover:bg-white/20 h-12 px-8 rounded-2xl">
                <Link to="/driver/auth" className="my-0">
                  <Truck className="mr-2 h-5 w-5" />
                  I'm a Driver
                </Link>
              </Button>
            </div>

            {/* How It Works Section */}
            <div className="mb-16">
              {/* 3-Step Process */}
              <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-16 my-[26px]">
                <div className="text-center p-6">
                  <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Handshake className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-3">A Deal is Reached</h3>
                  <p className="text-white/70 text-sm">Dealer requests driver for vehicle delivery to customer</p>
                </div>

                <div className="text-center p-6">
                  <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Users className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-3">Driver Accepts</h3>
                  <p className="text-white/70 text-sm">Drivers get instant notifications and accept the delivery job</p>
                </div>

                <div className="text-center p-6">
                  <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Truck className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-3">Vehicle Delivered</h3>
                  <p className="text-white/70 text-sm">Driver delivers vehicle directly to customer with tracking & proof</p>
                </div>
              </div>
            </div>

            {/* Why Dealers Choose SwapRunn */}
            <div className="mb-12">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
                <Card className="bg-white/10 backdrop-blur-sm border-white/20 shadow-lg rounded-2xl text-center">
                  <CardContent className="p-4">
                    <div className="w-10 h-10 bg-primary/20 rounded-xl flex items-center justify-center mx-auto mb-3">
                      <Zap className="h-5 w-5 text-primary" />
                    </div>
                    <h3 className="text-sm font-semibold text-white mb-1">Close faster</h3>
                    <p className="text-xs text-white/70">Post-sale delivery in minutes</p>
                  </CardContent>
                </Card>

                <Card className="bg-white/10 backdrop-blur-sm border-white/20 shadow-lg rounded-2xl text-center">
                  <CardContent className="p-4">
                    <div className="w-10 h-10 bg-primary/20 rounded-xl flex items-center justify-center mx-auto mb-3">
                      <ArrowRight className="h-5 w-5 text-primary" />
                    </div>
                    <h3 className="text-sm font-semibold text-white mb-1">Accept trades faster</h3>
                    <p className="text-xs text-white/70">Turn over inventory quicker with instant delivery</p>
                  </CardContent>
                </Card>

                <Card className="bg-white/10 backdrop-blur-sm border-white/20 shadow-lg rounded-2xl text-center">
                  <CardContent className="p-4">
                    <div className="w-10 h-10 bg-primary/20 rounded-xl flex items-center justify-center mx-auto mb-3">
                      <Eye className="h-5 w-5 text-primary" />
                    </div>
                    <h3 className="text-sm font-semibold text-white mb-1">Live GPS tracking</h3>
                    <p className="text-xs text-white/70">Dealer & customer tracking links</p>
                  </CardContent>
                </Card>

                <Card className="bg-white/10 backdrop-blur-sm border-white/20 shadow-lg rounded-2xl text-center">
                  <CardContent className="p-4">
                    <div className="w-10 h-10 bg-primary/20 rounded-xl flex items-center justify-center mx-auto mb-3">
                      <Users className="h-5 w-5 text-primary" />
                    </div>
                    <h3 className="text-sm font-semibold text-white mb-1">First-available drivers</h3>
                    <p className="text-xs text-white/70">Accepts in seconds</p>
                  </CardContent>
                </Card>

                <Card className="bg-white/10 backdrop-blur-sm border-white/20 shadow-lg rounded-2xl text-center">
                  <CardContent className="p-4">
                    <div className="w-10 h-10 bg-primary/20 rounded-xl flex items-center justify-center mx-auto mb-3">
                      <Settings className="h-5 w-5 text-primary" />
                    </div>
                    <h3 className="text-sm font-semibold text-white mb-1">Dealer controls</h3>
                    <p className="text-xs text-white/70">Job details, notes, proof of delivery</p>
                  </CardContent>
                </Card>

                <Card className="bg-white/10 backdrop-blur-sm border-white/20 shadow-lg rounded-2xl text-center">
                  <CardContent className="p-4">
                    <div className="w-10 h-10 bg-primary/20 rounded-xl flex items-center justify-center mx-auto mb-3">
                      <Headphones className="h-5 w-5 text-primary" />
                    </div>
                    <h3 className="text-sm font-semibold text-white mb-1">Support that shows up</h3>
                    <p className="text-xs text-white/70">Real humans, fast answers</p>
                  </CardContent>
                </Card>
              </div>
            </div>

          </div>
        </div>
      </section>


      {/* About Us Section */}
      <section className="relative z-10 py-[15px]">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold mb-6 text-white">
              About SwapRunn
            </h2>
            <p className="text-xl text-white/80 mb-8 max-w-3xl mx-auto">
              We're revolutionizing auto dealership delivery with smart technology that connects dealers to professional drivers, 
              making vehicle delivery faster, more reliable, and completely transparent.
            </p>
            
            <div className="grid md:grid-cols-3 gap-8 mb-10">
              
              <div className="text-center">
                
                
              </div>
              
            </div>
            
            <Button asChild variant="outline" size="lg" className="bg-white/10 text-white border-white/20 hover:bg-white/20 h-12 px-8 rounded-2xl">
              <Link to="/about">
                Learn More About Us
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Learn More Section */}
      <section className="relative z-10 py-[13px]">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center max-w-6xl mx-auto">
            <div>
              <h2 className="text-4xl lg:text-5xl font-bold mb-6 text-white">
                Learn More
              </h2>
              
              <div className="space-y-6 mb-8">
                <div className="flex items-start gap-4">
                  <CheckCircle className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold text-white mb-1">Real-time tracking & notifications</h3>
                    <p className="text-white/70">Live GPS tracking with instant updates on job progress</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <CheckCircle className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold text-white mb-1">Automated dispatch</h3>
                    <p className="text-white/70">Smart matching to verified drivers in your area</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <CheckCircle className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold text-white mb-1">Analytics & reporting</h3>
                    <p className="text-white/70">Comprehensive insights into delivery performance</p>
                  </div>
                </div>
              </div>
              
              <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-white h-12 px-8 rounded-2xl">
                <Link to="/get-started">
                  Get Started Today
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
            
            <div className="relative">
              <Card className="bg-white/10 backdrop-blur-sm border-white/20 shadow-2xl overflow-hidden rounded-3xl">
                <CardContent className="p-0">
                  <img src="/dashboard-preview.png" alt="SwapRunn Dashboard Preview" className="w-full h-auto object-cover" />
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 py-12 border-t border-white/10">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-4">
              <img src="/swaprunn-logo-2025.png" alt="SwapRunn" className="h-8 w-auto" />
              <span className="text-white/70">© SwapRunn</span>
            </div>
            
            <div className="flex gap-6">
              <Link to="/privacy" className="text-white/70 hover:text-white transition-colors">
                Privacy
              </Link>
              <Link to="/terms" className="text-white/70 hover:text-white transition-colors">
                Terms
              </Link>
              <Link to="/about" className="text-white/70 hover:text-white transition-colors">
                Contact
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>;
};
export default Index;