import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

type AppRole = "super_admin" | "admin" | "membro";

type AuthContextType = {
  user: User | null;
  session: Session | null;
  roles: AppRole[];
  loading: boolean;
  isSuperAdmin: boolean;
  isAdmin: boolean;
  signOut: () => Promise<void>;
  refreshRoles: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [roles, setRoles] = useState<AppRole[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchRoles = async (uid: string | null) => {
    if (!uid) {
      setRoles([]);
      return;
    }
    const { data, error } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", uid);
    if (!error && data) {
      setRoles(data.map((r) => r.role as AppRole));
    }
  };

  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((_event, sess) => {
      setSession(sess);
      setUser(sess?.user ?? null);
      // Defer Supabase calls to avoid deadlock
      setTimeout(() => fetchRoles(sess?.user?.id ?? null), 0);
    });

    supabase.auth.getSession().then(({ data: { session: sess } }) => {
      setSession(sess);
      setUser(sess?.user ?? null);
      fetchRoles(sess?.user?.id ?? null).finally(() => setLoading(false));
    });

    return () => sub.subscription.unsubscribe();
  }, []);

  const refreshRoles = async () => {
    await fetchRoles(user?.id ?? null);
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setRoles([]);
  };

  const value: AuthContextType = {
    user,
    session,
    roles,
    loading,
    isSuperAdmin: roles.includes("super_admin"),
    isAdmin: roles.includes("super_admin") || roles.includes("admin"),
    signOut,
    refreshRoles,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth deve ser usado dentro de AuthProvider");
  return ctx;
};
