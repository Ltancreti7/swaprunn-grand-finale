import { supabase } from "@/integrations/supabase/client";

export const repairUserProfile = async () => {
  try {
    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      throw new Error('User not authenticated');
    }

    // Get user metadata for profile creation
    const userType = user.user_metadata?.user_type;
    const name = user.user_metadata?.full_name || user.user_metadata?.company_name;
    const phone = user.user_metadata?.phone;
    const companyName = user.user_metadata?.company_name;

    if (!userType) {
      throw new Error('User type not found in metadata');
    }

    // Use the secure database function to create profile
    const { data, error } = await supabase.rpc('create_profile_for_current_user', {
      _user_type: userType,
      _name: name,
      _phone: phone,
      _company_name: companyName
    });

    if (error) {
      throw error;
    }

    console.log('Profile created successfully:', data);
    return data;
  } catch (error) {
    console.error('Profile repair failed:', error);
    throw error;
  }
};