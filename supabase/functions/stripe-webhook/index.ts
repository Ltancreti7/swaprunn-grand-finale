import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET');

const supabase = createClient(supabaseUrl, supabaseServiceKey);

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Webhook received');
    
    if (!webhookSecret) {
      console.log('TEST MODE: No webhook secret configured');
      return new Response('TEST MODE: Webhook processed', { 
        status: 200, 
        headers: corsHeaders 
      });
    }

    const body = await req.text();
    const signature = req.headers.get('stripe-signature');
    
    if (!signature) {
      console.error('No stripe signature found');
      return new Response('No signature', { status: 400, headers: corsHeaders });
    }

    // In production, verify the webhook signature here
    const event = JSON.parse(body);
    console.log('Processing event:', event.type);
    
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object;
        console.log('Checkout completed:', session.id);
        
        const dealerId = session.metadata?.dealer_id;
        const planName = session.metadata?.plan_name;
        
        if (dealerId && planName) {
          // Update dealer subscription
          const { error } = await supabase
            .from('dealer_subscriptions')
            .upsert({
              dealer_id: dealerId,
              plan_name: planName,
              stripe_subscription_id: session.subscription,
              stripe_customer_id: session.customer,
              status: 'active',
              monthly_runs_limit: planName === 'starter' ? 20 : planName === 'growth' ? 100 : -1,
              price_cents: planName === 'starter' ? 19900 : planName === 'growth' ? 49900 : 99900
            });
            
          if (error) console.error('Error updating subscription:', error);
        }
        
        // Also update dealer with subscription info
        const { error: dealerError } = await supabase
          .from('dealers')
          .update({
            stripe_customer_id: session.customer,
            stripe_subscription_id: session.subscription,
            status: 'active'
          })
          .eq('id', dealerId);
          
        if (dealerError) console.error('Error updating dealer:', dealerError);
        break;
      }
      
      case 'invoice.paid': {
        const invoice = event.data.object;
        console.log('Invoice paid:', invoice.id);
        
        // Activate dealer subscription
        const { error } = await supabase
          .from('dealers')
          .update({ status: 'active' })
          .eq('stripe_customer_id', invoice.customer);
          
        if (error) console.error('Error activating subscription:', error);
        break;
      }
      
      default:
        console.log('Unhandled event type:', event.type);
    }

    return new Response('Webhook processed', { 
      status: 200, 
      headers: corsHeaders 
    });
    
  } catch (error) {
    console.error('Webhook error:', error);
    return new Response('Webhook error', { 
      status: 500, 
      headers: corsHeaders 
    });
  }
});