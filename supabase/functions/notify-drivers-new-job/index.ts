import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.4";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface NewJobNotification {
  job_id: string;
  type: string;
  year?: number;
  make?: string;
  model?: string;
  pickup_address: string;
  delivery_address: string;
  distance_miles: number;
  requires_two: boolean;
  customer_name?: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const jobData: NewJobNotification = await req.json();
    console.log('Processing new job notification:', jobData);

    // Get the job details including dealer_id
    const { data: job, error: jobError } = await supabase
      .from('jobs')
      .select('dealer_id')
      .eq('id', jobData.job_id)
      .single();

    if (jobError || !job) {
      console.error('Error fetching job details:', jobError);
      return new Response(
        JSON.stringify({ success: false, error: 'Job not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get drivers from the same dealership that are available
    const { data: driverProfiles, error: profilesError } = await supabase
      .from('profiles')
      .select(`
        user_id,
        driver_id,
        drivers!inner(id, name, available)
      `)
      .eq('user_type', 'driver')
      .eq('dealer_id', job.dealer_id)
      .eq('drivers.available', true);

    if (profilesError) {
      console.error('Error fetching driver profiles:', profilesError);
      throw profilesError;
    }

    if (!driverProfiles || driverProfiles.length === 0) {
      console.log('No available drivers found for dealership:', job.dealer_id);
      return new Response(
        JSON.stringify({ success: true, sent: 0, message: 'No available drivers from this dealership' }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const drivers = driverProfiles.map(p => p.drivers).filter(Boolean);
    const userIds = driverProfiles.map(p => p.user_id);

    // Get push subscriptions for these drivers
    const { data: subscriptions, error: subsError } = await supabase
      .from('push_subscriptions')
      .select('*')
      .in('user_id', userIds);

    if (subsError) {
      console.error('Error fetching subscriptions:', subsError);
    }

    // Format notification message
    const vehicleInfo = jobData.year && jobData.make && jobData.model 
      ? `${jobData.year} ${jobData.make} ${jobData.model}` 
      : 'Vehicle';
    
    const title = `New Drive Available - ${vehicleInfo}`;
    const body = `${jobData.distance_miles} miles • ${jobData.pickup_address.substring(0, 40)}... → ${jobData.delivery_address.substring(0, 40)}...`;

    // Send push notifications to each subscription
    let successCount = 0;
    if (subscriptions && subscriptions.length > 0) {
      const pushPromises = subscriptions.map(async (sub) => {
        try {
          const subscription = typeof sub.subscription === 'string' 
            ? JSON.parse(sub.subscription) 
            : sub.subscription;
          
          const payload = JSON.stringify({
            title,
            body,
            data: {
              jobId: jobData.job_id,
              type: 'new_job',
              timestamp: new Date().toISOString()
            }
          });

          const response = await fetch(subscription.endpoint, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'TTL': '86400'
            },
            body: payload
          });

          if (!response.ok) {
            console.error(`Push failed for subscription ${sub.id}:`, response.status);
            
            // Remove invalid subscriptions (410 = Gone)
            if (response.status === 410) {
              await supabase
                .from('push_subscriptions')
                .delete()
                .eq('id', sub.id);
            }
            
            return false;
          }

          return true;
        } catch (error) {
          console.error(`Error sending push to subscription ${sub.id}:`, error);
          return false;
        }
      });

      const results = await Promise.all(pushPromises);
      successCount = results.filter(Boolean).length;
    }

    // Also send SMS notifications to drivers from the same dealership (if they have preferences enabled)
    let smsCount = 0;
    for (const driver of drivers) {
      // Get driver details including phone
      const { data: driverData } = await supabase
        .from('drivers')
        .select('phone')
        .eq('id', driver.id)
        .single();

      if (driverData?.phone) {
        try {
          const smsMessage = `SwapRunn: New drive available! ${vehicleInfo} - ${jobData.distance_miles} miles. Check the app for details.`;
          
          await supabase.functions.invoke('sms', {
            body: {
              to: driverData.phone,
              body: smsMessage
            }
          });
          smsCount++;
        } catch (smsError) {
          console.error('SMS notification error for driver:', driver.id, smsError);
        }
      }
    }

    // Log notification for analytics
    await supabase
      .from('notification_logs')
      .insert({
        title,
        body,
        user_type: 'driver',
        type: 'push',
        sent_count: successCount + smsCount,
        total_count: drivers.length,
        success: (successCount + smsCount) > 0
      });

    console.log(`Notifications sent to dealership drivers: ${successCount} push, ${smsCount} SMS to ${drivers.length} drivers from dealership ${job.dealer_id}`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        push_sent: successCount,
        sms_sent: smsCount,
        total_drivers: drivers.length
      }),
      { 
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );

  } catch (error: any) {
    console.error('Error in notify-drivers-new-job function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});