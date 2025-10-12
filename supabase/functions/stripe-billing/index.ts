import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const stripeSecretKey = Deno.env.get('STRIPE_SECRET_KEY');

const supabase = createClient(supabaseUrl, supabaseServiceKey);

const plans = {
  starter: { priceId: 'price_starter', price: 19900, limit: 20 },
  growth: { priceId: 'price_growth', price: 49900, limit: 100 },
  enterprise: { priceId: 'price_enterprise', price: 99900, limit: -1 }
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { planId, dealerId } = await req.json();
    
    if (!stripeSecretKey) {
      console.log('TEST MODE: No Stripe key configured');
      
      // Create mock subscription record
      const plan = plans[planId as keyof typeof plans];
      if (plan) {
        const { error } = await supabase
          .from('dealer_subscriptions')
          .upsert({
            dealer_id: dealerId,
            plan_name: planId,
            monthly_runs_limit: plan.limit,
            price_cents: plan.price,
            status: 'active',
            stripe_subscription_id: `test_sub_${planId}_${Date.now()}`
          });
          
        if (error) {
          console.error('Error creating test subscription:', error);
          throw error;
        }
      }
      
      return new Response(JSON.stringify({ 
        success: true, 
        message: 'TEST MODE: Subscription activated',
        checkoutUrl: '/billing?success=true'
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      });
    }

    // Real Stripe integration
    const plan = plans[planId as keyof typeof plans];
    if (!plan) {
      throw new Error('Invalid plan selected');
    }

    // Create Stripe Checkout session
    const stripeResponse = await fetch('https://api.stripe.com/v1/checkout/sessions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${stripeSecretKey}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        'mode': 'subscription',
        'line_items[0][price]': plan.priceId,
        'line_items[0][quantity]': '1',
        'success_url': `${req.headers.get('origin')}/billing?success=true&session_id={CHECKOUT_SESSION_ID}`,
        'cancel_url': `${req.headers.get('origin')}/billing?canceled=true`,
        'metadata[dealer_id]': dealerId,
        'metadata[plan_name]': planId
      }),
    });

    if (!stripeResponse.ok) {
      throw new Error(`Stripe API error: ${stripeResponse.status}`);
    }

    const session = await stripeResponse.json();
    
    return new Response(JSON.stringify({ 
      success: true,
      checkoutUrl: session.url
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json', ...corsHeaders }
    });

  } catch (error: any) {
    console.error('Billing error:', error);
    return new Response(JSON.stringify({ 
      error: error.message 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', ...corsHeaders }
    });
  }
});