import { useMemo, useState } from "react";
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
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";

type StoredResposta = {
  id?: string;
  credentials?: { code?: string; word?: string; phrase?: string };
  contact?: { email?: string; whatsapp?: string };
  answers?: Record<string, unknown>;
};

const loadCodes = (): StoredResposta[] => {
  try {
    const raw = localStorage.getItem("colo-de-mae-respostas");
    if (!raw) return [];
    const arr = JSON.parse(raw);
    return Array.isArray(arr) ? arr : [];
  } catch {
    return [];
  }
};

const Entrar = () => {
  const navigate = useNavigate();
  const [code, setCode] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const respostas = useMemo(loadCodes, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleaned = code.trim().toUpperCase();
    if (cleaned.length < 4) {
      toast.error("Informe seu código único", {
        description: "O código tem 5 caracteres recebidos no cadastro do cartão.",
      });
      return;
    }
    setSubmitting(true);

    const found = respostas.find(
      (r) => (r.credentials?.code ?? "").toUpperCase() === cleaned,
    );

    setTimeout(() => {
      setSubmitting(false);
      if (found) {
        localStorage.setItem("colo-de-mae-comunidade-sessao", cleaned);
        toast.success("Bem-vindo(a) à Comunidade Colo de Mãe 💛");
        navigate("/respostas");
      } else {
        toast.error("Código não reconhecido", {
          description:
            "Verifique o código recebido ao cadastrar seu Cartão Colo de Mãe.",
        });
      }
    }, 400);
  };

  const destaques = [
    {
      icon: Users,
      title: "Grupos de apoio",
      desc: "Conecte-se com outras famílias atípicas em rodas de conversa acolhedoras.",
    },
    {
      icon: MessageCircle,
      title: "Fale com a Jennifer",
      desc: "Assistente virtual da Colo de Mãe pelo WhatsApp, 24h por dia.",
    },
    {
      icon: CalendarHeart,
      title: "Eventos exclusivos",
      desc: "Agenda de palestras, oficinas e encontros presenciais e online.",
    },
    {
      icon: HeartHandshake,
      title: "Rede de profissionais",
      desc: "Indicações de profissionais parceiros com olhar inclusivo.",
    },
  ];

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
            {/* Lado esquerdo — boas-vindas */}
            <div className="flex flex-col gap-6">
              <span className="inline-flex w-fit items-center gap-2 rounded-full bg-tea-yellow/15 px-4 py-1.5 text-sm font-semibold text-tea-yellow ring-1 ring-tea-yellow/40">
                <Sparkles size={16} /> Área exclusiva de membros
              </span>
              <h1 className="font-heading text-4xl font-extrabold leading-tight md:text-5xl">
                Comunidade{" "}
                <span className="text-tea-yellow">Colo de Mãe</span>
              </h1>
              <p className="max-w-xl text-lg text-muted-foreground">
                Um espaço seguro de apoio, escuta e troca para famílias
                atípicas. O acesso é liberado com o{" "}
                <strong className="text-foreground">código único</strong>{" "}
                recebido no momento do cadastro do seu{" "}
                <strong className="text-foreground">Cartão Colo de Mãe</strong>.
              </p>

              <ul className="grid gap-3 sm:grid-cols-2">
                {destaques.map((d) => (
                  <li
                    key={d.title}
                    className="flex items-start gap-3 rounded-2xl border border-border/60 bg-card/60 p-4 backdrop-blur"
                  >
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

            {/* Card de acesso */}
            <div className="relative">
              <div
                aria-hidden
                className="absolute inset-0 -z-10 rounded-[2rem] bg-gradient-to-br from-tea-yellow/20 via-transparent to-tea-blue/20 blur-2xl"
              />
              <form
                onSubmit={handleSubmit}
                className="rounded-[2rem] border-2 border-border/70 bg-card/80 p-7 shadow-[0_24px_60px_-30px_hsl(var(--tea-yellow)/0.5)] backdrop-blur-xl sm:p-10"
              >
                <div className="flex flex-col items-center text-center">
                  <span className="inline-flex items-center gap-2 rounded-full bg-tea-blue/15 px-4 py-1.5 text-sm font-semibold text-tea-blue ring-1 ring-tea-blue/40">
                    <ShieldCheck size={16} /> Acesso restrito
                  </span>
                  <h2 className="mt-4 font-heading text-3xl font-extrabold md:text-4xl">
                    Entrar na Comunidade
                  </h2>
                  <p className="mt-2 max-w-sm text-sm text-muted-foreground">
                    Informe o código único que você recebeu ao cadastrar o
                    Cartão Colo de Mãe.
                  </p>
                </div>

                <div className="mt-8 flex flex-col gap-2">
                  <label
                    htmlFor="codigo"
                    className="text-sm font-semibold text-foreground"
                  >
                    Código único
                  </label>
                  <div className="relative">
                    <KeyRound
                      size={20}
                      className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-tea-yellow"
                    />
                    <input
                      id="codigo"
                      autoFocus
                      autoComplete="one-time-code"
                      inputMode="text"
                      maxLength={8}
                      placeholder="Ex.: A7K9P"
                      value={code}
                      onChange={(e) =>
                        setCode(e.target.value.toUpperCase().replace(/\s+/g, ""))
                      }
                      className="w-full rounded-2xl border-2 border-border bg-background/70 py-4 pl-12 pr-4 text-center font-mono text-2xl font-bold tracking-[0.4em] uppercase outline-none transition-colors focus:border-tea-yellow"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    5 caracteres (letras maiúsculas e números).
                  </p>
                </div>

                <Button
                  type="submit"
                  disabled={submitting}
                  className="mt-7 w-full rounded-full bg-tea-yellow py-6 text-lg font-extrabold text-background shadow-[0_12px_32px_-10px_hsl(var(--tea-yellow)/0.7)] ring-2 ring-tea-yellow/40 ring-offset-2 ring-offset-background transition-all hover:-translate-y-0.5 hover:bg-[#FFD700] disabled:opacity-60"
                >
                  {submitting ? "Verificando..." : "Entrar na Comunidade"}
                </Button>

                <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                  <Button
                    asChild
                    variant="outline"
                    className="flex-1 rounded-full border-2 border-tea-yellow/60 bg-transparent py-5 font-bold text-tea-yellow hover:bg-tea-yellow/10 hover:text-tea-yellow"
                  >
                    <Link to="/cartao">Quero meu Cartão</Link>
                  </Button>
                  <Button
                    asChild
                    variant="ghost"
                    className="flex-1 rounded-full py-5 font-semibold text-muted-foreground hover:bg-muted/40 hover:text-foreground"
                  >
                    <a
                      href="https://wa.me/5511999999999?text=Ol%C3%A1%2C%20preciso%20recuperar%20meu%20c%C3%B3digo%20da%20Comunidade%20Colo%20de%20M%C3%A3e"
                      target="_blank"
                      rel="noreferrer"
                    >
                      Perdi meu código
                    </a>
                  </Button>
                </div>

                <p className="mt-6 text-center text-xs text-muted-foreground">
                  Seu código é pessoal e intransferível. Nunca o compartilhe
                  com terceiros.
                </p>
              </form>
            </div>
          </div>
        </motion.div>
      </main>
      <Footer />
    </div>
  );
};

export default Entrar;
