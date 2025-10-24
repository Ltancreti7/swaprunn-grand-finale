import React, {
  useState,
  useEffect,
  createContext,
  useContext,
  useRef,
} from "react";
import type { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  userProfile: any | null;
  loading: boolean;
  profileLoading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [userProfile, setUserProfile] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [profileLoading, setProfileLoading] = useState(false);

  // Refs for deduplication and caching
  const fetchingProfileRef = useRef<string | null>(null);
  const profileCacheRef = useRef<{ userId: string; profile: any } | null>(null);

  const fetchUserProfile = async (userId: string, retryCount = 0) => {
    // Prevent duplicate fetches
    if (fetchingProfileRef.current === userId) {
      return;
    }

    // Check cache first
    if (profileCacheRef.current?.userId === userId) {
      setUserProfile(profileCacheRef.current.profile);
      setLoading(false);
      return;
    }

    fetchingProfileRef.current = userId;
    setProfileLoading(true);

    try {
      // Use RPC for stable, secure profile fetching
      const { data, error } = await supabase
        .rpc("get_user_profile")
        .maybeSingle();

      if (error) {
        console.error("Profile fetch error:", error);
        // Retry with exponential backoff on transient errors
        if (retryCount < 3 && error.code !== "PGRST116") {
          const delay = Math.pow(2, retryCount) * 1000;

          setTimeout(() => {
            fetchingProfileRef.current = null;
            fetchUserProfile(userId, retryCount + 1);
          }, delay);
          return;
        }
        setUserProfile(null);
        profileCacheRef.current = null;
      } else {
        setUserProfile(data);
        profileCacheRef.current = { userId, profile: data };
      }
    } catch (error) {
      console.error("Error fetching user profile:", error);
      setUserProfile(null);
      profileCacheRef.current = null;
    } finally {
      fetchingProfileRef.current = null;
      setProfileLoading(false);
      setLoading(false);
    }
  };

  useEffect(() => {
    // Set up auth state listener FIRST
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      setSession(session);
      setUser(session?.user ?? null);

      // Defer profile fetching with setTimeout to avoid deadlock
      if (session?.user) {
        setTimeout(() => {
          fetchUserProfile(session.user.id);
        }, 0);
      } else {
        setUserProfile(null);
        setProfileLoading(false);
        setLoading(false);
      }
    });

    // THEN check for existing session (but don't duplicate profile fetch)
    supabase.auth.getSession().then(({ data: { session } }) => {
      // Only set session/user here, onAuthStateChange will handle profile fetching
      if (!session) {
        setSession(null);
        setUser(null);
        setLoading(false);
      }
      // If session exists, onAuthStateChange will handle it
    });

    return () => subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    // Clear cache on signout
    fetchingProfileRef.current = null;
    profileCacheRef.current = null;

    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
    setUserProfile(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, session, userProfile, loading, profileLoading, signOut }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
