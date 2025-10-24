import { supabase } from "@/integrations/supabase/client";

export const repairDealerProfile = async (): Promise<void> => {
  try {
    
    
    // Get current user
    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError || !userData.user) {
      throw new Error("User not authenticated");
    }

    // Get current profile
    const { data: profiles, error: profileError } = await supabase.rpc("get_user_profile");
    if (profileError) {
      throw new Error(`Failed to get profile: ${profileError.message}`);
    }

    if (!profiles || !Array.isArray(profiles) || profiles.length === 0) {
      throw new Error("No profile found");
    }

    const profile = profiles[0];
    

    // If not a dealer, nothing to fix
    if (profile.user_type !== 'dealer') {
      
      return;
    }

    // If dealer_id is already set, nothing to fix
    if (profile.dealer_id) {
      
      return;
    }

    

    // Create a dealer record for this user
    const { data: dealerData, error: dealerError } = await supabase
      .from("dealers")
      .insert({
        name: profile.full_name || "Dealer",
        email: userData.user.email,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single();

    if (dealerError) {
      // Dealer might already exist, try to find it
      
      const { data: existingDealer, error: findError } = await supabase
        .from("dealers")
        .select()
        .eq("email", userData.user.email)
        .single();

      if (findError || !existingDealer) {
        throw new Error(`Failed to create or find dealer: ${dealerError.message}`);
      }

      
      
      // Update profile with existing dealer_id
      const { error: updateError } = await supabase
        .from("profiles")
        .update({ 
          dealer_id: existingDealer.id,
          updated_at: new Date().toISOString()
        })
        .eq("user_id", userData.user.id);

      if (updateError) {
        throw new Error(`Failed to update profile: ${updateError.message}`);
      }

      
      return;
    }

    

    // Update profile with new dealer_id
    const { error: updateError } = await supabase
      .from("profiles")
      .update({ 
        dealer_id: dealerData.id,
        updated_at: new Date().toISOString()
      })
      .eq("user_id", userData.user.id);

    if (updateError) {
      throw new Error(`Failed to update profile: ${updateError.message}`);
    }

    
    

  } catch (error) {
    console.error("💥 Dealer profile repair failed:", error);
    throw error;
  }
};