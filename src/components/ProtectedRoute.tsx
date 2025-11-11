import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles: string[];
}

const ProtectedRoute = ({ children, allowedRoles }: ProtectedRouteProps) => {
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          setAuthorized(false);
          setLoading(false);
          return;
        }

        const { data: roleData, error } = await supabase
          .from("user_roles")
          .select("role")
          .eq("user_id", user.id)
          .single();

        if (error || !roleData) {
          setAuthorized(false);
        } else {
          setUserRole(roleData.role);
          setAuthorized(allowedRoles.includes(roleData.role));
        }
      } catch (error) {
        console.error("Auth check error:", error);
        setAuthorized(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [allowedRoles]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!authorized) {
    toast({
      title: "Access Denied",
      description: "You don't have permission to access this page.",
      variant: "destructive",
    });
    
    // Redirect based on user role or to login
    if (userRole === "student") return <Navigate to="/dashboard/student" replace />;
    if (userRole === "staff") return <Navigate to="/dashboard/staff" replace />;
    if (userRole === "admin") return <Navigate to="/dashboard/admin" replace />;
    return <Navigate to="/login/student" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
