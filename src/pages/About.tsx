import SiteHeader from "@/components/SiteHeader";
import mapBackgroundImage from "@/assets/map-background.jpg";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, Clock, Users, TrendingUp, Star, Shield, Zap, HandHeart, ArrowRight, MapPin, Phone, Mail } from "lucide-react";
const About = () => {
  return <div className="min-h-screen relative" style={{
    backgroundImage: `url(${mapBackgroundImage})`,
    backgroundSize: '120%',
    backgroundPosition: 'center',
    backgroundAttachment: 'fixed'
  }}>
      {/* SEO Meta Tags */}
      <title>About SwapRunn - Auto Delivery Experts Since 2020</title>
      <meta name="description" content="Learn about SwapRunn's founding team, mission to revolutionize auto delivery, and our track record serving 500+ dealerships nationwide." />
      <link rel="canonical" href="https://swaprunn.com/about" />

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/70"></div>
      
      {/* Site Header */}
      <SiteHeader />
      
      <div className="relative z-10 py-0">
        <div className="max-w-6xl mx-auto space-y-16 py-0 px-[47px]">
          
          {/* Hero Section */}
          <div className="text-center mb-16">
            
          </div>

          {/* Mission Section - Enhanced */}
          <section className="space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-white mb-4">Our Mission</h2>
              <p className="text-lg text-white/80 max-w-2xl mx-auto">SwapRunn’s mission is to streamline vehicle deliveries for dealerships while empowering drivers with reliable work and instant payouts — building the trusted logistics network for the automotive industry.</p>
            </div>
            
            {/* Main Mission Statement */}
            <div className="bg-white/15 backdrop-blur-sm border border-white/30 rounded-3xl p-8">
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/20 rounded-full mb-4">
                  <Zap className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-2xl font-semibold text-white mb-4">
                  Deliver Faster. Swap Smarter.
                </h3>
                <p className="text-lg text-white/90 leading-relaxed max-w-3xl mx-auto">
                  SwapRunn exists to eliminate the chaos of vehicle deliveries and swaps, giving dealers back their time 
                  while providing customers with a seamless, professional experience from sale to delivery.
                </p>
              </div>

              {/* Why SwapRunn Grid */}
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center">
                        <TrendingUp className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h4 className="text-lg font-semibold text-white mb-3">The Problem We Solve</h4>
                        <p className="text-white/80 leading-relaxed">
                          Traditional auto delivery is broken. Dealers waste countless hours coordinating drivers, 
                          customers face unpredictable delays, and there's no visibility into the process.
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center">
                        <Shield className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h4 className="text-lg font-semibold text-white mb-3">Our Technology Edge</h4>
                        <p className="text-white/80 leading-relaxed">
                          AI-powered dispatch system matches jobs with qualified drivers in real-time, 
                          with live tracking and instant updates for complete transparency.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center">
                        <Users className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h4 className="text-lg font-semibold text-white mb-3">Dealer Benefits</h4>
                        <p className="text-white/80 leading-relaxed">
                          Reduce delivery coordination time by 80%, increase customer satisfaction with 
                          real-time updates, and accelerate inventory turns with same-day swaps.
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center">
                        <Star className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h4 className="text-lg font-semibold text-white mb-3">Customer Experience</h4>
                        <p className="text-white/80 leading-relaxed">
                          Professional, white-glove delivery with live tracking, photo documentation, 
                          and direct communication with drivers. No more waiting around all day.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Enhanced Company Stats */}
          <section className="space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-white mb-4">Impact by the Numbers</h2>
              <p className="text-lg text-white/80">Real results from real dealerships across America</p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center p-6 bg-white/15 backdrop-blur-sm border border-white/30 rounded-2xl hover:bg-white/20 transition-all duration-300">
                <div className="text-4xl font-bold text-primary mb-2">500+</div>
                <div className="text-white/90 font-medium mb-1">Active Dealerships</div>
                <div className="text-sm text-white/70">Nationwide coverage</div>
              </div>
              <div className="text-center p-6 bg-white/15 backdrop-blur-sm border border-white/30 rounded-2xl hover:bg-white/20 transition-all duration-300">
                <div className="text-4xl font-bold text-primary mb-2">15,000+</div>
                <div className="text-white/90 font-medium mb-1">Deliveries Completed</div>
                <div className="text-sm text-white/70">99.2% on-time rate</div>
              </div>
              <div className="text-center p-6 bg-white/15 backdrop-blur-sm border border-white/30 rounded-2xl hover:bg-white/20 transition-all duration-300">
                <div className="text-4xl font-bold text-primary mb-2">$2.3M</div>
                <div className="text-white/90 font-medium mb-1">Driver Earnings Paid</div>
                <div className="text-sm text-white/70">Supporting local drivers</div>
              </div>
              <div className="text-center p-6 bg-white/15 backdrop-blur-sm border border-white/30 rounded-2xl hover:bg-white/20 transition-all duration-300">
                <div className="text-4xl font-bold text-primary mb-2">80%</div>
                <div className="text-white/90 font-medium mb-1">Time Reduction</div>
                <div className="text-sm text-white/70">In delivery coordination</div>
              </div>
            </div>
          </section>

          {/* Enhanced Timeline */}
          <section className="space-y-8">
            <div className="text-center">
              
              
            </div>
            
            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary via-primary/50 to-primary"></div>
              
              <div className="space-y-8">
                

                

                

                
              </div>
            </div>
          </section>

          {/* Enhanced Values */}
          <section className="space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-white mb-4">Our Values</h2>
              <p className="text-lg text-white/80">The principles that drive everything we do</p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-white/15 backdrop-blur-sm border border-white/30 rounded-2xl p-8 text-center hover:bg-white/20 transition-all duration-300 group">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/20 rounded-full mb-6 group-hover:bg-primary/30 transition-all duration-300">
                  <Zap className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-4">Speed & Reliability</h3>
                <p className="text-white/80 leading-relaxed">
                  Every delivery matters. We're obsessed with fast, dependable service that 
                  dealers and customers can count on, every single time.
                </p>
              </div>

              <div className="bg-white/15 backdrop-blur-sm border border-white/30 rounded-2xl p-8 text-center hover:bg-white/20 transition-all duration-300 group">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/20 rounded-full mb-6 group-hover:bg-primary/30 transition-all duration-300">
                  <HandHeart className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-4">Partnership</h3>
                <p className="text-white/80 leading-relaxed">
                  We're not just a vendor—we're your delivery team. Your success is our success, 
                  and we're in it for the long haul with dedicated support.
                </p>
              </div>

              <div className="bg-white/15 backdrop-blur-sm border border-white/30 rounded-2xl p-8 text-center hover:bg-white/20 transition-all duration-300 group">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/20 rounded-full mb-6 group-hover:bg-primary/30 transition-all duration-300">
                  <Shield className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-4">Trust & Security</h3>
                <p className="text-white/80 leading-relaxed">
                  Every driver is vetted, insured, and tracked. Your vehicles and customers 
                  are in safe, professional hands with full accountability.
                </p>
              </div>
            </div>
          </section>

          {/* Enhanced Contact Section */}
          <section className="space-y-8">
            <div className="bg-white/15 backdrop-blur-sm border border-white/30 rounded-3xl p-8 lg:p-12">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-white mb-4">Ready to Transform Your Delivery Operations?</h3>
                <p className="text-lg text-white/80 max-w-2xl mx-auto">
                  We'd love to show you how SwapRunn can eliminate delivery headaches and delight your customers.
                </p>
              </div>
              
              <div className="grid md:grid-cols-2 gap-8 mb-8">
                <div className="space-y-6">
                  <div className="flex items-center gap-4 p-4 bg-white/10 rounded-2xl">
                    <div className="flex-shrink-0 w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center">
                      <Mail className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <div className="text-white font-medium">Email Us</div>
                      <div className="text-white/80">hello@swaprunn.com</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4 p-4 bg-white/10 rounded-2xl">
                    <div className="flex-shrink-0 w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center">
                      <Phone className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <div className="text-white font-medium">Call Us</div>
                      <div className="text-white/80">(555) 123-4567</div>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h4 className="text-lg font-semibold text-white">What happens next?</h4>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-primary flex-shrink-0" />
                      <span className="text-white/80">15-minute discovery call to understand your needs</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-primary flex-shrink-0" />
                      <span className="text-white/80">Custom demo with your dealership data</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-primary flex-shrink-0" />
                      <span className="text-white/80">Pilot program with 30-day free trial</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="bg-primary text-white hover:bg-primary/90 px-8 py-6 text-lg font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">
                  I'm a Dealer
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
                <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 px-8 py-6 text-lg font-semibold rounded-2xl">
                  I'm a Driver
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>;
};
export default About;