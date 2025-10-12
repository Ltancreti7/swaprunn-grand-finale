import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/hooks/use-toast';
import SiteHeader from '@/components/SiteHeader';
import { Mail, Check, X, Users } from 'lucide-react';
import mapBackgroundImage from '@/assets/map-background.jpg';

function AcceptInvitation() {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [invitation, setInvitation] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [accepting, setAccepting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (token) {
      fetchInvitation();
    }
  }, [token]);

  const fetchInvitation = async () => {
    if (!token) return;

    try {
      const { data, error } = await supabase
        .from('staff_invitations')
        .select(`
          *,
          dealers!inner(name, store)
        `)
        .eq('invite_token', token)
        .is('accepted_at', null)
        .gt('expires_at', new Date().toISOString())
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          setError('This invitation is invalid, expired, or has already been used.');
        } else {
          setError('Failed to load invitation details.');
        }
      } else {
        setInvitation(data);
      }
    } catch (error) {
      console.error('Error fetching invitation:', error);
      setError('Failed to load invitation details.');
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptInvitation = async () => {
    if (!token || !user) return;

    setAccepting(true);
    try {
      const { data, error } = await supabase.rpc('accept_staff_invitation', {
        p_invite_token: token
      });

      if (error) throw error;

      if ((data as any)?.success) {
        toast({
          title: "Invitation accepted!",
          description: "Welcome to the team. Redirecting to dashboard...",
        });
        
        // Redirect to dealer dashboard after a short delay
        setTimeout(() => {
          navigate('/dealer/dashboard');
        }, 2000);
      } else {
        setError((data as any)?.error || 'Failed to accept invitation');
      }
    } catch (error: any) {
      console.error('Error accepting invitation:', error);
      setError(error.message || 'Failed to accept invitation');
    } finally {
      setAccepting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen relative" style={{
        backgroundImage: `url(${mapBackgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}>
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/38 to-black/65"></div>
        
        <div className="relative z-10 flex items-center justify-center min-h-screen px-4 pt-24">
          <div className="max-w-sm mx-auto p-8 bg-black/20 backdrop-blur-sm border border-white/10 rounded-2xl shadow-2xl">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#DC2626] mx-auto"></div>
              <p className="mt-4 text-white/70">Loading invitation...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative" style={{
      backgroundImage: `url(${mapBackgroundImage})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center'
    }}>
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/38 to-black/65"></div>
      
      <div className="relative z-10 flex items-center justify-center min-h-screen px-4 pt-24">
        <div className="max-w-sm mx-auto p-8 bg-black/20 backdrop-blur-sm border border-white/10 rounded-2xl shadow-2xl">
          {error ? (
            <>
              <div className="text-center mb-6">
                <div className="mx-auto h-12 w-12 bg-red-500/20 rounded-full flex items-center justify-center mb-4">
                  <X className="h-6 w-6 text-red-400" />
                </div>
                <h1 className="text-lg font-semibold text-white">Invalid Invitation</h1>
              </div>
              <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                <p className="text-red-200 text-sm">{error}</p>
              </div>
              <div className="text-center">
                <button 
                  onClick={() => navigate('/')}
                  className="w-full border-2 border-white/20 text-white bg-white/10 backdrop-blur-sm py-3 rounded-full font-semibold transition hover:bg-white/20 active:scale-95 shadow-lg"
                >
                  Return Home
                </button>
              </div>
            </>
          ) : invitation ? (
            <>
              <div className="text-center mb-6">
                <div className="mx-auto h-12 w-12 bg-[#DC2626]/20 rounded-full flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-[#DC2626]" />
                </div>
                <h1 className="text-lg font-semibold text-white">Join {invitation.dealers.name}</h1>
                <p className="text-sm text-white/70 mt-2">You've been invited to join the team</p>
              </div>

              <div className="space-y-3 mb-6 text-sm">
                <div className="flex justify-between">
                  <span className="text-white/70">Dealership:</span>
                  <span className="text-white font-medium">{invitation.dealers.name}</span>
                </div>
                {invitation.dealers.store && (
                  <div className="flex justify-between">
                    <span className="text-white/70">Location:</span>
                    <span className="text-white font-medium">{invitation.dealers.store}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-white/70">Role:</span>
                  <span className="text-white font-medium capitalize">{invitation.role}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/70">Email:</span>
                  <span className="text-white font-medium">{invitation.email}</span>
                </div>
              </div>

              {!user ? (
                <div className="mb-6 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                  <div className="flex items-start gap-3">
                    <Mail className="h-4 w-4 text-blue-400 mt-0.5 flex-shrink-0" />
                    <p className="text-blue-200 text-sm">
                      Please sign in or create an account to accept this invitation.
                    </p>
                  </div>
                </div>
              ) : user.email !== invitation.email ? (
                <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                  <div className="flex items-start gap-3">
                    <X className="h-4 w-4 text-red-400 mt-0.5 flex-shrink-0" />
                    <p className="text-red-200 text-sm">
                      You must be signed in with the email address {invitation.email} to accept this invitation.
                    </p>
                  </div>
                </div>
              ) : null}

              <div className="space-y-3">
                {user && user.email === invitation.email ? (
                  <button 
                    onClick={handleAcceptInvitation} 
                    disabled={accepting}
                    className="w-full bg-[#DC2626] text-white py-3 rounded-full font-semibold transition hover:bg-[#b91c1c] active:scale-95 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    <Check className="h-4 w-4" />
                    {accepting ? 'Accepting...' : 'Accept Invitation'}
                  </button>
                ) : (
                  <button 
                    onClick={() => navigate('/dealer/auth')}
                    className="w-full bg-[#DC2626] text-white py-3 rounded-full font-semibold transition hover:bg-[#b91c1c] active:scale-95 shadow-lg"
                  >
                    Sign In to Accept
                  </button>
                )}
                
                <button 
                  onClick={() => navigate('/')} 
                  className="w-full border-2 border-white/20 text-white bg-white/10 backdrop-blur-sm py-3 rounded-full font-semibold transition hover:bg-white/20 active:scale-95 shadow-lg"
                >
                  Decline
                </button>
              </div>
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export default AcceptInvitation;