import { supabase } from "@/integrations/supabase/client";

export interface AuthResult {
  user?: unknown;
  error?: Error | null;
}

export async function signIn(email: string, password: string): Promise<AuthResult> {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  return { user: data?.user, error: error ?? null };
}

export async function signUp(email: string, password: string, role: string): Promise<AuthResult> {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { role } },
  });
  return { user: data?.user, error: error ?? null };
}
