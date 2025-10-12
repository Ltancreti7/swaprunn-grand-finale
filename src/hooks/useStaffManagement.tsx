import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from '@/hooks/use-toast';

export interface StaffMember {
  id: string;
  user_id: string;
  role: 'owner' | 'manager' | 'salesperson' | 'staff';
  joined_at: string;
  is_active: boolean;
  user_email?: string;
  user_name?: string;
}

export interface StaffInvitation {
  id: string;
  email: string;
  role: 'owner' | 'manager' | 'salesperson' | 'staff';
  invite_token: string;
  expires_at: string;
  accepted_at?: string;
  invited_by: string;
}

export function useStaffManagement() {
  const { userProfile } = useAuth();
  const [staffMembers, setStaffMembers] = useState<StaffMember[]>([]);
  const [invitations, setInvitations] = useState<StaffInvitation[]>([]);
  const [loading, setLoading] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    if (userProfile?.dealer_id) {
      fetchStaffData();
      fetchUserRole();
    }
  }, [userProfile]);

  const fetchUserRole = async () => {
    if (!userProfile?.dealer_id) return;

    try {
      const { data } = await supabase
        .from('dealership_staff')
        .select('role')
        .eq('user_id', userProfile.user_id)
        .eq('dealer_id', userProfile.dealer_id)
        .eq('is_active', true)
        .single();
      
      setUserRole(data?.role || null);
    } catch (error) {
      console.error('Error fetching user role:', error);
    }
  };

  const fetchStaffData = async () => {
    if (!userProfile?.dealer_id) return;

    setLoading(true);
    try {
      // Fetch staff members
      const { data: staffData, error: staffError } = await supabase
        .from('dealership_staff')
        .select(`
          id,
          user_id,
          role,
          joined_at,
          is_active
        `)
        .eq('dealer_id', userProfile.dealer_id)
        .eq('is_active', true)
        .order('joined_at', { ascending: true });

      if (staffError) throw staffError;

      // Get user emails from auth.users through profiles
      const userIds = staffData?.map(s => s.user_id) || [];
      const { data: profilesData } = await supabase
        .from('profiles')
        .select('user_id')
        .in('user_id', userIds);

      // For now, we'll use the user_id as placeholder - you might want to store display names
      const enrichedStaffData = staffData?.map(staff => ({
        ...staff,
        user_email: `user-${staff.user_id.slice(0, 8)}`,
        user_name: staff.role === 'owner' ? 'Owner' : `${staff.role.charAt(0).toUpperCase()}${staff.role.slice(1)}`
      })) || [];

      setStaffMembers(enrichedStaffData);

      // Fetch pending invitations
      const { data: invitationData, error: invitationError } = await supabase
        .from('staff_invitations')
        .select('*')
        .eq('dealer_id', userProfile.dealer_id)
        .is('accepted_at', null)
        .gt('expires_at', new Date().toISOString())
        .order('created_at', { ascending: false });

      if (invitationError) throw invitationError;
      setInvitations(invitationData || []);

    } catch (error) {
      console.error('Error fetching staff data:', error);
      toast({
        title: "Error",
        description: "Failed to load staff data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const inviteStaffMember = async (email: string, role: 'manager' | 'salesperson' | 'staff') => {
    if (!userProfile?.dealer_id) return false;

    try {
      const { error } = await supabase
        .from('staff_invitations')
        .insert({
          dealer_id: userProfile.dealer_id,
          email: email.toLowerCase().trim(),
          role,
          invited_by: userProfile.user_id
        });

      if (error) throw error;

      toast({
        title: "Invitation sent",
        description: `Invitation sent to ${email}`,
      });

      await fetchStaffData();
      return true;
    } catch (error: any) {
      console.error('Error inviting staff member:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to send invitation",
        variant: "destructive"
      });
      return false;
    }
  };

  const updateStaffRole = async (staffId: string, newRole: 'manager' | 'salesperson' | 'staff') => {
    try {
      const { error } = await supabase
        .from('dealership_staff')
        .update({ role: newRole, updated_at: new Date().toISOString() })
        .eq('id', staffId);

      if (error) throw error;

      toast({
        title: "Role updated",
        description: "Staff member role has been updated",
      });

      await fetchStaffData();
      return true;
    } catch (error: any) {
      console.error('Error updating staff role:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to update role",
        variant: "destructive"
      });
      return false;
    }
  };

  const removeStaffMember = async (staffId: string) => {
    try {
      const { error } = await supabase
        .from('dealership_staff')
        .update({ is_active: false, updated_at: new Date().toISOString() })
        .eq('id', staffId);

      if (error) throw error;

      toast({
        title: "Staff member removed",
        description: "Staff member has been deactivated",
      });

      await fetchStaffData();
      return true;
    } catch (error: any) {
      console.error('Error removing staff member:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to remove staff member",
        variant: "destructive"
      });
      return false;
    }
  };

  const cancelInvitation = async (invitationId: string) => {
    try {
      const { error } = await supabase
        .from('staff_invitations')
        .delete()
        .eq('id', invitationId);

      if (error) throw error;

      toast({
        title: "Invitation canceled",
        description: "The invitation has been canceled",
      });

      await fetchStaffData();
      return true;
    } catch (error: any) {
      console.error('Error canceling invitation:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to cancel invitation",
        variant: "destructive"
      });
      return false;
    }
  };

  const canManageStaff = userRole === 'owner' || userRole === 'manager';

  return {
    staffMembers,
    invitations,
    loading,
    userRole,
    canManageStaff,
    inviteStaffMember,
    updateStaffRole,
    removeStaffMember,
    cancelInvitation,
    refreshData: fetchStaffData
  };
}