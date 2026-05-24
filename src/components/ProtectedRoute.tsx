import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

type Props = {
  children: ReactNode;
  requireRole?: "super_admin" | "admin";
};

export const ProtectedRoute = ({ children, requireRole = "admin" }: Props) => {
  const { user, loading, isAdmin, isSuperAdmin } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center text-muted-foreground">
        Carregando...
      </div>
    );
  }

  if (!user) return <Navigate to="/auth" replace />;

  if (requireRole === "super_admin" && !isSuperAdmin) {
    return <Navigate to="/entrar" replace />;
  }
  if (requireRole === "admin" && !isAdmin) {
    return <Navigate to="/entrar" replace />;
  }

  return <>{children}</>;
};
