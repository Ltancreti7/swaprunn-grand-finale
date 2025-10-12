import React, { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Session, User } from "@supabase/supabase-js";

interface AuthContextValue {
  user: User | null;
  session: Session | null;
  userProfile: Record<string, unknown> | null;
  loading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [userProfile, setUserProfile] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const restore = async () => {
      try {
        const { data } = await supabase.auth.getSession();
        if (!mounted) return;
        const s = data?.session as Session | null;
        setSession(s ?? null);
        setUser(s?.user ?? null);

        const userId = s?.user?.id;
        if (userId) {
          try {
            const { data: profile } = await supabase
              .from("profiles")
              .select("*, dealers(*), drivers(*)")
              .eq("user_id", userId)
              .single();
            setUserProfile((profile ?? null) as Record<string, unknown> | null);
          } catch (e) {
            console.error("Failed to fetch profile", e);
          }
        }
      } catch (e) {
        // ignore
      } finally {
        if (mounted) setLoading(false);
      }
    };

    restore();

    const { data: listener } = supabase.auth.onAuthStateChange(async (_event, session) => {
      const s = session as Session | null;
      setSession(s ?? null);
      setUser(s?.user ?? null);

      const userId = s?.user?.id;
      if (userId) {
        try {
          const { data: profile } = await supabase
            .from("profiles")
            .select("*, dealers(*), drivers(*)")
            .eq("user_id", userId)
            .single();
          setUserProfile((profile ?? null) as Record<string, unknown> | null);
        } catch (e) {
          console.error("Failed to fetch profile", e);
        }
      } else {
        setUserProfile(null);
      }

      setLoading(false);
    });

    return () => {
      mounted = false;
      listener?.subscription?.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
    setUserProfile(null);
  };

  return (
    <AuthContext.Provider value={{ user, session, userProfile, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}