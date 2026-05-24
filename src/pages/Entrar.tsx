import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "sonner";
import {
  ArrowLeft,
  ShieldCheck,
  KeyRound,
  Users,
  MessageCircle,
  CalendarHeart,
  HeartHandshake,
  Sparkles,
  Crown,
  LogOut,
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

const destaques = [
  { icon: Users, title: "Grupos de apoio", desc: "Conecte-se com outras famílias atípicas em rodas de conversa acolhedoras." },
  { icon: MessageCircle, title: "Fale com a Jennifer", desc: "Assistente virtual da Colo de Mãe pelo WhatsApp, 24h por dia." },
  { icon: CalendarHeart, title: "Eventos exclusivos", desc: "Agenda de palestras, oficinas e encontros presenciais e online." },
  { icon: HeartHandshake, title: "Rede de profissionais", desc: "Indicações de profissionais parceiros com olhar inclusivo." },
];

const Entrar = () => {
  const navigate = useNavigate();
  const { user, loading, roles, isSuperAdmin, isAdmin, signOut, refreshRoles } = useAuth();
  const [claimCode, setClaimCode] = useState("");
  const [claiming, setClaiming] = useState(false);

  const handleClaim = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      navigate("/auth");
      return;
    }
    setClaiming(true);
    const { data, error } = await supabase.rpc("claim_super_admin", {
      _code: claimCode.trim().toUpperCase(),
    });
    setClaiming(false);
    if (error) {
      toast.error("Erro ao reivindicar super admin", { description: error.message });
      return;
    }
    if (data === true) {
      toast.success("Super Admin concedido 👑", { description: "Privilégios totais ativados." });
      await refreshRoles();
    } else {
      toast.error("Código inválido ou super admin já existe");
    }
  };

  return (
    <div className="min-h-screen">
      <Header />
      <main className="container mx-auto px-4 pb-20 pt-28">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mx-auto flex max-w-6xl flex-col gap-10"
        >
          <Link
            to="/"
            className="inline-flex w-fit items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-tea-yellow"
          >
            <ArrowLeft size={16} /> Voltar ao início
          </Link>

          <div className="grid gap-10 lg:grid-cols-[1.05fr_1fr] lg:items-center">
            <div className="flex flex-col gap-6">
              <span className="inline-flex w-fit items-center gap-2 rounded-full bg-tea-yellow/15 px-4 py-1.5 text-sm font-semibold text-tea-yellow ring-1 ring-tea-yellow/40">
                <Sparkles size={16} /> Área exclusiva de membros
              </span>
              <h1 className="font-heading text-4xl font-extrabold leading-tight md:text-5xl">
                Comunidade <span className="text-tea-yellow">Colo de Mãe</span>
              </h1>
              <p className="max-w-xl text-lg text-muted-foreground">
                Um espaço seguro de apoio, escuta e troca para famílias atípicas.
                Faça login com sua conta para acessar a comunidade.
              </p>

              <ul className="grid gap-3 sm:grid-cols-2">
                {destaques.map((d) => (
                  <li key={d.title} className="flex items-start gap-3 rounded-2xl border border-border/60 bg-card/60 p-4 backdrop-blur">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-tea-yellow/15 text-tea-yellow">
                      <d.icon size={20} />
                    </span>
                    <div>
                      <p className="font-semibold text-foreground">{d.title}</p>
                      <p className="text-sm text-muted-foreground">{d.desc}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div className="relative">
              <div aria-hidden className="absolute inset-0 -z-10 rounded-[2rem] bg-gradient-to-br from-tea-yellow/20 via-transparent to-tea-blue/20 blur-2xl" />
              <div className="rounded-[2rem] border-2 border-border/70 bg-card/80 p-7 shadow-[0_24px_60px_-30px_hsl(var(--tea-yellow)/0.5)] backdrop-blur-xl sm:p-10">
                {loading ? (
                  <p className="text-center text-muted-foreground">Carregando...</p>
                ) : !user ? (
                  <>
                    <div className="flex flex-col items-center text-center">
                      <span className="inline-flex items-center gap-2 rounded-full bg-tea-blue/15 px-4 py-1.5 text-sm font-semibold text-tea-blue ring-1 ring-tea-blue/40">
                        <ShieldCheck size={16} /> Acesso restrito
                      </span>
                      <h2 className="mt-4 font-heading text-3xl font-extrabold md:text-4xl">
                        Entrar na Comunidade
                      </h2>
                      <p className="mt-2 max-w-sm text-sm text-muted-foreground">
                        Use sua conta para acessar. Se você ainda não tem cadastro, crie uma conta em segundos.
                      </p>
                    </div>

                    <Button
                      asChild
                      className="mt-8 w-full rounded-full bg-tea-yellow py-6 text-lg font-extrabold text-background shadow-[0_12px_32px_-10px_hsl(var(--tea-yellow)/0.7)] ring-2 ring-tea-yellow/40 ring-offset-2 ring-offset-background hover:bg-[#FFD700]"
                    >
                      <Link to="/auth">Entrar / Criar conta</Link>
                    </Button>

                    <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                      <Button asChild variant="outline" className="flex-1 rounded-full border-2 border-tea-yellow/60 bg-transparent py-5 font-bold text-tea-yellow hover:bg-tea-yellow/10 hover:text-tea-yellow">
                        <Link to="/cartao">Quero meu Cartão</Link>
                      </Button>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex flex-col items-center text-center">
                      <span className={`inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-semibold ring-1 ${isSuperAdmin ? "bg-tea-yellow/15 text-tea-yellow ring-tea-yellow/40" : "bg-tea-blue/15 text-tea-blue ring-tea-blue/40"}`}>
                        {isSuperAdmin ? <Crown size={16} /> : <ShieldCheck size={16} />}
                        {isSuperAdmin ? "Super Admin" : isAdmin ? "Admin" : "Membro"}
                      </span>
                      <h2 className="mt-4 font-heading text-3xl font-extrabold md:text-4xl">
                        Olá, {user.user_metadata?.display_name ?? user.email?.split("@")[0]}!
                      </h2>
                      <p className="mt-2 max-w-sm text-sm text-muted-foreground">
                        {isAdmin
                          ? "Você tem acesso ao painel da comunidade."
                          : "Sua conta está ativa. Aguarde a liberação de áreas exclusivas."}
                      </p>
                    </div>

                    {isAdmin && (
                      <Button
                        asChild
                        className="mt-8 w-full rounded-full bg-tea-yellow py-6 text-lg font-extrabold text-background shadow-[0_12px_32px_-10px_hsl(var(--tea-yellow)/0.7)] ring-2 ring-tea-yellow/40 ring-offset-2 ring-offset-background hover:bg-[#FFD700]"
                      >
                        <Link to="/respostas">Acessar painel</Link>
                      </Button>
                    )}

                    {!isSuperAdmin && (
                      <form onSubmit={handleClaim} className="mt-6 rounded-2xl border-2 border-dashed border-tea-yellow/40 bg-tea-yellow/5 p-4">
                        <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-tea-yellow">
                          <Crown size={16} /> Reivindicar Super Admin
                        </div>
                        <p className="mb-3 text-xs text-muted-foreground">
                          Informe o código de bootstrap. Funciona apenas se ainda não existir um super admin.
                        </p>
                        <div className="flex gap-2">
                          <div className="relative flex-1">
                            <KeyRound size={18} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-tea-yellow" />
                            <input
                              value={claimCode}
                              onChange={(e) => setClaimCode(e.target.value.toUpperCase().replace(/\s+/g, ""))}
                              placeholder="Código"
                              maxLength={8}
                              className="w-full rounded-xl border-2 border-border bg-background/70 py-3 pl-10 pr-3 text-center font-mono font-bold tracking-[0.3em] outline-none focus:border-tea-yellow"
                            />
                          </div>
                          <Button type="submit" disabled={claiming} className="rounded-xl bg-tea-yellow font-bold text-background hover:bg-[#FFD700]">
                            {claiming ? "..." : "Ativar"}
                          </Button>
                        </div>
                      </form>
                    )}

                    <Button
                      onClick={async () => { await signOut(); toast.success("Sessão encerrada"); }}
                      variant="ghost"
                      className="mt-5 w-full rounded-full py-5 font-semibold text-muted-foreground hover:bg-muted/40 hover:text-foreground"
                    >
                      <LogOut size={16} /> Sair
                    </Button>

                    <p className="mt-4 text-center text-xs text-muted-foreground">
                      Papéis atuais: {roles.length ? roles.join(", ") : "—"}
                    </p>
                  </>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </main>
      <Footer />
    </div>
  );
};

export default Entrar;
