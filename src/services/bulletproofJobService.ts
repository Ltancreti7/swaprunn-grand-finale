import { supabase } from '@/integrations/supabase/client';

interface JobCreationParams {
  type: 'delivery' | 'swap';
  pickup_address: string;
  delivery_address: string;
  year: number;
  make: string;
  model: string;
  vin?: string | null;
  customer_name: string;
  customer_phone: string;
  timeframe: string;
  notes?: string | null;
  requires_two?: boolean;
  distance_miles?: number;
  trade_year?: number | null;
  trade_make?: string | null;
  trade_model?: string | null;
  trade_vin?: string | null;
  trade_transmission?: string | null;
}

export const bulletproofJobCreation = async (params: JobCreationParams) => {
  try {
    console.log('🚀 BULLETPROOF JOB CREATION - Starting...');
    
    // First, get user profile to verify dealer status
    const { data: profiles, error: profileError } = await supabase
      .rpc('get_user_profile');
    
    if (profileError) {
      throw new Error(`Profile error: ${profileError.message}`);
    }
    
    if (!profiles || !Array.isArray(profiles) || profiles.length === 0) {
      throw new Error('No user profile found');
    }
    
    const profile = profiles[0];
    
    if (!profile || profile.user_type !== 'dealer') {
      throw new Error('Only dealers can create job requests');
    }
    
    if (!profile.dealer_id) {
      throw new Error('Dealer account not properly configured');
    }
    
    // Generate tracking token
    const trackingToken = 'SR-' + Math.random().toString(36).substring(2, 10).toUpperCase();
    
    // Create the job data with all required fields
    const jobData = {
      type: params.type,
      pickup_address: params.pickup_address,
      delivery_address: params.delivery_address,
      year: params.year,
      make: params.make,
      model: params.model,
      vin: params.vin,
      customer_name: params.customer_name,
      customer_phone: params.customer_phone,
      timeframe: params.timeframe,
      notes: params.notes,
      status: 'open',
      requires_two: params.requires_two || false,
      distance_miles: params.distance_miles || 25,
      dealer_id: profile.dealer_id,
      track_token: trackingToken,
      trade_year: params.trade_year,
      trade_make: params.trade_make,
      trade_model: params.trade_model,
      trade_vin: params.trade_vin,
      trade_transmission: params.trade_transmission
    };
    
    console.log('📝 Job data prepared:', jobData);
    
    // Insert with explicit error handling
    const { data, error } = await supabase
      .from('jobs')
      .insert(jobData)
      .select('*')
      .single();
    
    if (error) {
      console.error('❌ Database insertion failed:', error);
      throw new Error(`Database error: ${error.message}`);
    }
    
    console.log('✅ Job created successfully:', data);
    return data;
    
  } catch (error) {
    console.error('💥 BULLETPROOF JOB CREATION FAILED:', error);
    throw error;
  }
};