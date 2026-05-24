import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { ArrowLeft, Mail, Lock, User as UserIcon, Sparkles } from "lucide-react";
import { z } from "zod";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { useAuth } from "@/hooks/useAuth";

const emailSchema = z.string().trim().email("E-mail inválido").max(255);
const passwordSchema = z.string().min(8, "Mínimo de 8 caracteres").max(72);
const nameSchema = z.string().trim().min(1, "Informe seu nome").max(100);

type Mode = "login" | "signup";

const Auth = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [mode, setMode] = useState<Mode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!loading && user) navigate("/entrar", { replace: true });
  }, [user, loading, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const parsedEmail = emailSchema.safeParse(email);
      const parsedPwd = passwordSchema.safeParse(password);
      if (!parsedEmail.success) throw new Error(parsedEmail.error.issues[0].message);
      if (!parsedPwd.success) throw new Error(parsedPwd.error.issues[0].message);

      if (mode === "signup") {
        const parsedName = nameSchema.safeParse(name);
        if (!parsedName.success) throw new Error(parsedName.error.issues[0].message);
        const { error } = await supabase.auth.signUp({
          email: parsedEmail.data,
          password: parsedPwd.data,
          options: {
            emailRedirectTo: `${window.location.origin}/entrar`,
            data: { display_name: parsedName.data },
          },
        });
        if (error) throw error;
        toast.success("Conta criada", { description: "Bem-vindo(a) à Comunidade Colo de Mãe 💛" });
        navigate("/entrar", { replace: true });
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email: parsedEmail.data,
          password: parsedPwd.data,
        });
        if (error) throw error;
        toast.success("Login realizado");
        navigate("/entrar", { replace: true });
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Erro ao processar";
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoogle = async () => {
    const result = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: `${window.location.origin}/entrar`,
    });
    if (result.error) {
      toast.error("Não foi possível entrar com Google");
      return;
    }
    if (result.redirected) return;
    navigate("/entrar", { replace: true });
  };

  return (
    <div className="min-h-screen">
      <Header />
      <main className="container mx-auto px-4 pb-20 pt-28">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mx-auto flex max-w-md flex-col gap-6"
        >
          <Link
            to="/"
            className="inline-flex w-fit items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-tea-yellow"
          >
            <ArrowLeft size={16} /> Voltar ao início
          </Link>

          <div className="rounded-[2rem] border-2 border-border/70 bg-card/80 p-7 backdrop-blur-xl sm:p-10">
            <div className="flex flex-col items-center text-center">
              <span className="inline-flex items-center gap-2 rounded-full bg-tea-yellow/15 px-4 py-1.5 text-sm font-semibold text-tea-yellow ring-1 ring-tea-yellow/40">
                <Sparkles size={16} /> {mode === "login" ? "Acessar conta" : "Criar conta"}
              </span>
              <h1 className="mt-4 font-heading text-3xl font-extrabold">
                {mode === "login" ? "Entrar" : "Cadastrar"}
              </h1>
              <p className="mt-2 text-sm text-muted-foreground">
                {mode === "login"
                  ? "Acesse sua conta para entrar na Comunidade Colo de Mãe."
                  : "Crie sua conta para participar da Comunidade Colo de Mãe."}
              </p>
            </div>

            <Button
              type="button"
              onClick={handleGoogle}
              variant="outline"
              className="mt-6 w-full rounded-full border-2 border-border bg-background/70 py-6 font-semibold hover:border-tea-yellow"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24" aria-hidden>
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.99.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.1A6.5 6.5 0 0 1 5.5 12c0-.73.13-1.43.34-2.1V7.07H2.18A11 11 0 0 0 1 12c0 1.78.43 3.46 1.18 4.93l3.66-2.84z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38z"/>
              </svg>
              Continuar com Google
            </Button>

            <div className="my-5 flex items-center gap-3 text-xs uppercase text-muted-foreground">
              <span className="h-px flex-1 bg-border" />
              ou
              <span className="h-px flex-1 bg-border" />
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              {mode === "signup" && (
                <div>
                  <label className="text-sm font-semibold" htmlFor="name">Nome</label>
                  <div className="relative mt-1">
                    <UserIcon size={18} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <input
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full rounded-xl border-2 border-border bg-background/70 py-3 pl-10 pr-3 outline-none focus:border-tea-yellow"
                      placeholder="Seu nome"
                      required
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="text-sm font-semibold" htmlFor="email">E-mail</label>
                <div className="relative mt-1">
                  <Mail size={18} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-xl border-2 border-border bg-background/70 py-3 pl-10 pr-3 outline-none focus:border-tea-yellow"
                    placeholder="voce@email.com"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-semibold" htmlFor="password">Senha</label>
                <div className="relative mt-1">
                  <Lock size={18} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full rounded-xl border-2 border-border bg-background/70 py-3 pl-10 pr-3 outline-none focus:border-tea-yellow"
                    placeholder="Mínimo de 8 caracteres"
                    required
                    minLength={8}
                  />
                </div>
              </div>

              <Button
                type="submit"
                disabled={submitting}
                className="mt-2 w-full rounded-full bg-tea-yellow py-6 text-base font-extrabold text-background ring-2 ring-tea-yellow/40 ring-offset-2 ring-offset-background hover:bg-[#FFD700] disabled:opacity-60"
              >
                {submitting ? "Aguarde..." : mode === "login" ? "Entrar" : "Criar conta"}
              </Button>
            </form>

            <p className="mt-5 text-center text-sm text-muted-foreground">
              {mode === "login" ? "Ainda não tem conta?" : "Já tem conta?"}{" "}
              <button
                type="button"
                onClick={() => setMode(mode === "login" ? "signup" : "login")}
                className="font-semibold text-tea-yellow hover:underline"
              >
                {mode === "login" ? "Cadastre-se" : "Faça login"}
              </button>
            </p>
          </div>
        </motion.div>
      </main>
      <Footer />
    </div>
  );
};

export default Auth;
