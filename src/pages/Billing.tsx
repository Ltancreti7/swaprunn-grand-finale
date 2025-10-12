import { DollarSign, Calendar, Package, TrendingUp, Check, Crown, Zap } from "lucide-react";
import { useState } from "react";
import { mockStore } from "@/store/mockStore";
import SiteHeader from "@/components/SiteHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import mapBackgroundImage from "@/assets/map-background.jpg";

const Billing = () => {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const completedJobs = mockStore.getCompletedJobs();
  
  const plans = [
    {
      id: 'starter',
      name: 'Starter',
      price: 199,
      limit: 20,
      icon: Package,
      description: 'Perfect for small dealerships',
      features: [
        'Up to 20 runs per month',
        'Real-time GPS tracking',
        'Driver ratings & reviews',
        'Email notifications',
        'Basic support'
      ]
    },
    {
      id: 'growth',
      name: 'Growth',
      price: 499,
      limit: 100,
      icon: TrendingUp,
      description: 'Most popular for growing dealers',
      features: [
        'Up to 100 runs per month',
        'Real-time GPS tracking',
        'Driver ratings & reviews',
        'SMS & email notifications',
        'Background check integration',
        'Priority support',
        'Analytics dashboard'
      ],
      popular: true
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      price: 999,
      limit: -1,
      icon: Crown,
      description: 'Unlimited scale for large operations',
      features: [
        'Unlimited runs per month',
        'Real-time GPS tracking',
        'Driver ratings & reviews',
        'SMS & email notifications',
        'Background check integration',
        'Dedicated account manager',
        'Advanced analytics',
        'Custom integrations',
        'White-label options'
      ]
    }
  ];

  const handleSubscribe = async (planId: string) => {
    setSelectedPlan(planId);
    
    try {
      const response = await fetch('https://qnxtxiqedohlqmgtsdnu.supabase.co/functions/v1/stripe-billing', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          planId,
          dealerId: 'demo-dealer-id' // In real app, get from auth
        }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        window.location.href = data.checkoutUrl;
      } else {
        throw new Error(data.error || 'Failed to create checkout session');
      }
    } catch (error) {
      console.error('Subscription error:', error);
      setSelectedPlan(null);
    }
  };

  return (
    <div className="min-h-screen relative" style={{
      backgroundImage: `url(${mapBackgroundImage})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center'
    }}>
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/38 to-black/65"></div>
      <div className="relative z-10 max-w-7xl mx-auto py-24 px-4 sm:px-6 lg:px-8">
        <div className="space-y-8">
          {/* Header */}
          <div className="text-center">
            <h1 className="text-4xl font-bold text-white mb-4">Choose Your Plan</h1>
            <p className="text-xl text-white/70 max-w-2xl mx-auto">
              Scale your delivery operations with flexible pricing that grows with your business
            </p>
          </div>

          {/* Pricing Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {plans.map((plan) => {
              const Icon = plan.icon;
              return (
                <Card key={plan.id} className={`bg-white/10 backdrop-blur-sm border-white/20 relative transition-all duration-300 hover:scale-105 hover:shadow-lg ${plan.popular ? 'border-[#DC2626] shadow-lg scale-105' : 'hover:border-[#DC2626]/50'}`}>
                  {plan.popular && (
                    <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-[#DC2626] text-white px-4 py-1">
                      <span className="font-semibold">Most Popular</span>
                    </Badge>
                  )}
                  <CardHeader className="text-center pb-4">
                    <div className={`w-16 h-16 rounded-lg flex items-center justify-center mx-auto mb-4 ${plan.popular ? 'bg-[#DC2626] text-white' : 'bg-[#DC2626]/10'}`}>
                      <Icon className={`h-8 w-8 ${plan.popular ? 'text-white' : 'text-[#DC2626]'}`} />
                    </div>
                    <CardTitle className="text-2xl font-bold text-white">{plan.name}</CardTitle>
                    <p className="text-white/70">{plan.description}</p>
                    <div className="mt-4">
                      <div className={`text-4xl font-bold ${plan.popular ? 'text-[#DC2626]' : 'text-white'}`}>
                        ${plan.price}
                        <span className="text-lg text-white/70 font-normal">/mo</span>
                      </div>
                      <p className="text-sm text-white/70 mt-1">
                        {plan.limit === -1 ? 'Unlimited runs' : `Up to ${plan.limit} runs/month`}
                      </p>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3 mb-6">
                      {plan.features.map((feature, index) => (
                        <li key={index} className="flex items-start space-x-3">
                          <Check className="h-4 w-4 text-[#DC2626] mt-1 flex-shrink-0" />
                          <span className="text-sm text-white">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <Button 
                      className={`w-full transition-all duration-200 ${plan.popular ? 'bg-[#DC2626] hover:bg-[#b91c1c] text-white' : 'border-2 border-[#DC2626] text-[#DC2626] bg-white/10 backdrop-blur-sm hover:bg-[#DC2626] hover:text-white'}`}
                      onClick={() => handleSubscribe(plan.id)}
                      disabled={selectedPlan === plan.id}
                      size="lg"
                    >
                      {selectedPlan === plan.id ? (
                        <div className="flex items-center space-x-2">
                          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                          <span>Processing...</span>
                        </div>
                      ) : (
                        `Subscribe to ${plan.name}`
                      )}
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Features Section */}
          <div className="bg-white/10 backdrop-blur-sm border-white/20 rounded-lg p-8 mb-8">
            <h2 className="text-2xl font-bold text-center mb-6 text-white">What's Included in All Plans</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center">
                <Zap className="h-8 w-8 text-[#DC2626] mx-auto mb-3" />
                <h3 className="font-semibold mb-2 text-white">Instant Payouts</h3>
                <p className="text-sm text-white/70">Drivers paid via Stripe Connect</p>
              </div>
              <div className="text-center">
                <Package className="h-8 w-8 text-[#DC2626] mx-auto mb-3" />
                <h3 className="font-semibold mb-2 text-white">Live Tracking</h3>
                <p className="text-sm text-white/70">Real-time GPS tracking</p>
              </div>
              <div className="text-center">
                <DollarSign className="h-8 w-8 text-[#DC2626] mx-auto mb-3" />
                <h3 className="font-semibold mb-2 text-white">Background Checks</h3>
                <p className="text-sm text-white/70">Checkr integration</p>
              </div>
              <div className="text-center">
                <TrendingUp className="h-8 w-8 text-[#DC2626] mx-auto mb-3" />
                <h3 className="font-semibold mb-2 text-white">Analytics</h3>
                <p className="text-sm text-white/70">Performance insights</p>
              </div>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold text-center mb-8 text-white">Frequently Asked Questions</h2>
            <div className="space-y-6">
              <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                <CardContent className="pt-6">
                  <h3 className="font-semibold mb-2 text-white">What happens if I exceed my plan limit?</h3>
                  <p className="text-white/70">
                    You'll receive notifications as you approach your limit. Additional runs can be purchased 
                    or you can upgrade to a higher tier at any time.
                  </p>
                </CardContent>
              </Card>
              
              <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                <CardContent className="pt-6">
                  <h3 className="font-semibold mb-2 text-white">Can I change my plan at any time?</h3>
                  <p className="text-white/70">
                    Yes! You can upgrade or downgrade your plan at any time. Changes take effect at your next billing cycle.
                  </p>
                </CardContent>
              </Card>
              
              <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                <CardContent className="pt-6">
                  <h3 className="font-semibold mb-2 text-white">Is there a setup fee?</h3>
                  <p className="text-white/70">
                    No setup fees! You only pay the monthly subscription for your chosen plan.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Billing;