import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles: string[];
}

export default function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const [userRole, setUserRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getUserRole = async () => {
      const { data } = await supabase.auth.getUser();
      const role = data?.user?.user_metadata?.role || null;
      setUserRole(role);
      setLoading(false);
    };
    getUserRole();
  }, []);

  if (loading) return <div className="text-center text-white mt-20">Loading...</div>;

  if (!userRole) return <Navigate to="/dealer/auth" />;

  if (!allowedRoles.includes(userRole)) {
    return <Navigate to={`/${userRole}-dashboard`} />;
  }

  return <>{children}</>;
}
