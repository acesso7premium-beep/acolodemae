import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Copy,
  Heart,
  KeyRound,
  Lock,
  Mail,
  Phone,
  Shield,
  Sparkles,
  X,

} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

// ──────────────────────────────────────────────────────────────
// Tipos & Etapas
// ──────────────────────────────────────────────────────────────

type FieldType = "text" | "textarea" | "radio" | "checkbox" | "email" | "tel";

type FieldDef = {
  id: string;
  label: string;
  type: FieldType;
  required?: boolean;
  options?: string[];
  placeholder?: string;
};

type QuizStep = {
  id: string;
  title: string;
  emoji: string;
  encouragement?: string;
  fields: FieldDef[];
};

const STEPS: QuizStep[] = [
  {
    id: "ajuda",
    title: "Como podemos ajudar?",
    emoji: "💛",
    encouragement: "Estamos aqui para acolher você e sua família.",
    fields: [
      {
        id: "necessidades",
        label: "Quais necessidades a família tem hoje?",
        type: "checkbox",
        options: [
          "Terapias (psico, fono, TO)",
          "Material escolar adaptado",
          "Cesta básica / alimentos",
          "Óculos até 2 graus",
          "Apoio emocional",
          "Orientação sobre direitos",
          "Outros",
        ],
      },
      {
        id: "relato",
        label: "Conte um pouco da sua história (opcional)",
        type: "textarea",
        placeholder: "Pode escrever livremente, do seu jeito.",
      },
    ],
  },
  {
    id: "pessoa",
    title: "Sobre a Pessoa",
    emoji: "🧒",
    fields: [
      { id: "nomePcD", label: "Nome da pessoa PcD/TEA", type: "text", required: true },
      { id: "cpfPcD", label: "CPF da pessoa PcD/TEA", type: "text" },
      { id: "nomeResp", label: "Nome do responsável", type: "text", required: true },
      { id: "cpfResp", label: "CPF do responsável", type: "text" },
      { id: "endereco", label: "Endereço completo", type: "textarea", required: true },
    ],
  },
  {
    id: "diagnostico",
    title: "Diagnóstico",
    emoji: "🩺",
    encouragement: "Cada história é única — responda no seu ritmo.",
    fields: [
      {
        id: "temDiagnostico",
        label: "Possui diagnóstico?",
        type: "radio",
        options: ["Sim", "Não", "Em investigação"],
        required: true,
      },
      {
        id: "quaisDiagnosticos",
        label: "Quais diagnósticos?",
        type: "checkbox",
        options: ["TEA", "TDAH", "TOD", "Síndrome de Down", "Deficiência intelectual", "Outro"],
      },
    ],
  },
  {
    id: "suporte",
    title: "Nível de Suporte",
    emoji: "🤝",
    fields: [
      {
        id: "nivel",
        label: "Nível de suporte (TEA)",
        type: "radio",
        options: ["Nível 1", "Nível 2", "Nível 3", "Não sei / Não se aplica"],
      },
      { id: "temLaudo", label: "Possui laudo?", type: "radio", options: ["Sim", "Não"] },
      { id: "temCIPTEA", label: "Possui CIPTEA?", type: "radio", options: ["Sim", "Não"] },
      { id: "carteiraPcD", label: "Possui Carteira PcD?", type: "radio", options: ["Sim", "Não"] },
    ],
  },
  {
    id: "beneficios",
    title: "Benefícios sociais",
    emoji: "📋",
    fields: [
      {
        id: "bpcLoas",
        label: "Recebe BPC/LOAS?",
        type: "radio",
        options: ["Sim", "Não", "Tentei e foi negado"],
      },
    ],
  },
];

// ──────────────────────────────────────────────────────────────
// Persistência
// ──────────────────────────────────────────────────────────────

const QUIZ_KEY = "colo-de-mae-quiz";
const RESPOSTAS_KEY = "colo-de-mae-respostas";

type Contact = { email: string; whatsapp: string };
type Security = { palavra: string; frase: string; codigo: string };
type Answers = Record<string, string | string[]>;

const genCodigo = () => {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let out = "";
  for (let i = 0; i < 5; i++) out += chars[Math.floor(Math.random() * chars.length)];
  return out;
};


// ──────────────────────────────────────────────────────────────
// Página
// ──────────────────────────────────────────────────────────────

type Stage = "hero" | "quiz" | "done";

const Cartao = () => {
  const [stage, setStage] = useState<Stage>("hero");
  const [showContact, setShowContact] = useState(false);
  const [showSecurity, setShowSecurity] = useState(false);
  const [wantsCard, setWantsCard] = useState<boolean | null>(null);
  const [contact, setContact] = useState<Contact>({ email: "", whatsapp: "" });
  const [security, setSecurity] = useState<Security>({ palavra: "", frase: "", codigo: "" });
  const [codigoConfirmado, setCodigoConfirmado] = useState(false);
  const [answers, setAnswers] = useState<Answers>({});
  const [stepIdx, setStepIdx] = useState(0);

  // Restaurar progresso
  useEffect(() => {
    try {
      const raw = localStorage.getItem(QUIZ_KEY);
      if (raw) {
        const saved = JSON.parse(raw);
        if (saved.answers) setAnswers(saved.answers);
        if (saved.contact) setContact(saved.contact);
        if (saved.security) setSecurity(saved.security);
        if (typeof saved.wantsCard === "boolean") setWantsCard(saved.wantsCard);
        if (saved.stage) setStage(saved.stage);
        if (typeof saved.stepIdx === "number") setStepIdx(saved.stepIdx);
      }
    } catch {
      /* noop */
    }
    document.title = "Cartão Colo de Mãe — Cadastro acolhedor PcD/TEA";
  }, []);

  // Salvar progresso
  useEffect(() => {
    try {
      localStorage.setItem(
        QUIZ_KEY,
        JSON.stringify({ answers, contact, security, wantsCard, stage, stepIdx })
      );
    } catch {
      /* noop */
    }
  }, [answers, contact, security, wantsCard, stage, stepIdx]);

  const step = STEPS[stepIdx];
  const progress = useMemo(
    () => Math.round(((stepIdx + (stage === "done" ? 1 : 0)) / STEPS.length) * 100),
    [stepIdx, stage]
  );

  const handleStartYes = () => {
    setWantsCard(true);
    setShowContact(true);
  };
  const handleStartNo = () => {
    setWantsCard(false);
    setStage("quiz");
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contact.email || !contact.whatsapp) {
      toast.error("Preencha e-mail e WhatsApp para continuar.");
      return;
    }
    setShowContact(false);
    // Gera código único e abre etapa de segurança
    setSecurity((s) => ({ ...s, codigo: s.codigo || genCodigo() }));
    setCodigoConfirmado(false);
    setShowSecurity(true);
  };

  const handleSecuritySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!security.palavra.trim() || security.palavra.trim().length < 3) {
      toast.error("Escolha uma palavra secreta (mín. 3 caracteres).");
      return;
    }
    if (!security.frase.trim() || security.frase.trim().length < 6) {
      toast.error("Escolha uma frase secreta (mín. 6 caracteres).");
      return;
    }
    if (!codigoConfirmado) {
      toast.error("Confirme que anotou seu código único de segurança.");
      return;
    }
    setShowSecurity(false);
    toast.success("Dados de segurança salvos com carinho. 💛");
    setStage("quiz");
  };

  const copiarCodigo = async () => {
    try {
      await navigator.clipboard.writeText(security.codigo);
      toast.success("Código copiado!");
    } catch {
      toast.error("Não foi possível copiar.");
    }
  };


  const validateStep = (): boolean => {
    for (const f of step.fields) {
      if (!f.required) continue;
      const v = answers[f.id];
      if (!v || (Array.isArray(v) && v.length === 0) || (typeof v === "string" && !v.trim())) {
        toast.error(`Por favor, preencha: ${f.label}`);
        return false;
      }
    }
    return true;
  };

  const next = () => {
    if (!validateStep()) return;
    if (stepIdx < STEPS.length - 1) {
      setStepIdx(stepIdx + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      finalize();
    }
  };
  const prev = () => {
    if (stepIdx > 0) setStepIdx(stepIdx - 1);
  };

  const finalize = () => {
    const resposta = {
      id: `r-${Date.now()}`,
      wantsCard: wantsCard ?? false,
      contact,
      security,
      answers,
      submittedAt: new Date().toISOString(),
    };

    try {
      const raw = localStorage.getItem(RESPOSTAS_KEY);
      const list = raw ? JSON.parse(raw) : [];
      list.push(resposta);
      localStorage.setItem(RESPOSTAS_KEY, JSON.stringify(list));
      localStorage.removeItem(QUIZ_KEY);
    } catch {
      /* noop */
    }
    setStage("done");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const updateField = (id: string, value: string | string[]) =>
    setAnswers((a) => ({ ...a, [id]: value }));

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Bolhas ambiente */}
      <div className="tea-bubble left-[5%] top-[10%] h-72 w-72 bg-tea-blue/40 animate-float" />
      <div
        className="tea-bubble right-[8%] top-[40%] h-80 w-80 bg-tea-yellow/15 animate-float"
        style={{ animationDelay: "2s" }}
      />
      <div
        className="tea-bubble left-[40%] bottom-[5%] h-64 w-64 bg-tea-cyan/30 animate-float"
        style={{ animationDelay: "1.2s" }}
      />

      <main className="container relative z-10 mx-auto max-w-4xl px-4 py-12 md:py-20">
        {/* Voltar */}
        <a
          href="/"
          className="mb-8 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-tea-yellow"
        >
          <ArrowLeft size={16} /> Voltar ao site
        </a>

        <AnimatePresence mode="wait">
          {stage === "hero" && (
            <motion.section
              key="hero"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex flex-col items-center gap-8 text-center"
            >
              <Badge className="bg-tea-yellow text-background hover:bg-tea-yellow">
                Movimento TEA/PcD · Cadastro Oficial
              </Badge>

              <h1 className="font-heading text-5xl font-extrabold leading-[0.95] tracking-tight md:text-7xl">
                <span className="text-tea-red">Cartão</span>{" "}
                <span className="text-tea-yellow">Colo</span>{" "}
                <span className="text-foreground">·</span>{" "}
                <span className="text-tea-green">de</span>{" "}
                <span className="text-foreground">·</span>{" "}
                <span className="text-tea-cyan">Mãe</span>
              </h1>

              <p className="max-w-2xl text-lg text-muted-foreground md:text-xl">
                Um cartão gratuito de identificação e benefícios para famílias
                PcD e TEA da Associação Colo de Mãe. Acolhimento, respeito e
                inclusão em primeiro lugar.
              </p>

              <Card className="w-full max-w-2xl border-2 border-tea-yellow/40 bg-card/70 shadow-2xl backdrop-blur">
                <CardContent className="flex flex-col gap-6 p-8">
                  <p className="font-heading text-2xl font-bold md:text-3xl">
                    Você aceita receber gratuitamente <br />
                    <span className="text-tea-yellow">o Cartão Colo de Mãe?</span>
                  </p>
                  <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
                    <Button
                      onClick={handleStartYes}
                      size="lg"
                      className="min-h-14 rounded-full bg-tea-green px-8 font-bold text-white shadow-[0_10px_30px_-10px_#2A9D8F] transition-all hover:-translate-y-0.5 hover:bg-tea-green/90"
                    >
                      ✅ Sim, quero meu cartão
                    </Button>
                    <Button
                      onClick={handleStartNo}
                      variant="outline"
                      size="lg"
                      className="min-h-14 rounded-full border-2 border-foreground/20 bg-foreground/5 px-8 font-bold backdrop-blur transition-all hover:-translate-y-0.5 hover:border-tea-yellow hover:text-tea-yellow"
                    >
                      ❌ Agora não
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <p className="text-sm text-muted-foreground">
                💙 Feito com carinho para famílias PcD e TEA
              </p>
            </motion.section>
          )}

          {stage === "quiz" && (
            <motion.section
              key="quiz"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex flex-col gap-8"
            >
              {/* Progresso */}
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-semibold text-tea-yellow">
                    Etapa {stepIdx + 1} de {STEPS.length}
                  </span>
                  <span className="text-muted-foreground">{progress}% concluído</span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>

              <Card className="border-2 border-border/60 bg-card/70 shadow-2xl backdrop-blur">
                <CardContent className="flex flex-col gap-7 p-6 md:p-10">
                  <div className="flex flex-col gap-2 text-center">
                    <div className="text-5xl">{step.emoji}</div>
                    <h2 className="font-heading text-3xl font-extrabold md:text-4xl">
                      {step.title}
                    </h2>
                    {step.encouragement && (
                      <p className="text-muted-foreground">
                        <Sparkles className="mr-1 inline" size={14} />
                        {step.encouragement}
                      </p>
                    )}
                  </div>

                  <div className="flex flex-col gap-6">
                    {step.fields.map((f) => (
                      <FieldRenderer
                        key={f.id}
                        field={f}
                        value={answers[f.id]}
                        onChange={(v) => updateField(f.id, v)}
                      />
                    ))}
                  </div>

                  <div className="mt-2 flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
                    <Button
                      onClick={prev}
                      variant="outline"
                      disabled={stepIdx === 0}
                      className="min-h-12 rounded-full border-2"
                    >
                      <ArrowLeft size={16} /> Voltar
                    </Button>
                    <Button
                      onClick={next}
                      className="min-h-12 rounded-full bg-tea-yellow px-8 font-bold text-background hover:bg-tea-yellow/90"
                    >
                      {stepIdx === STEPS.length - 1 ? "Concluir cadastro" : "Próxima etapa"}
                      <ArrowRight size={16} />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.section>
          )}

          {stage === "done" && (
            <motion.section
              key="done"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center gap-6 text-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", delay: 0.15 }}
                className="rounded-full bg-tea-green/20 p-6"
              >
                <CheckCircle2 className="text-tea-green" size={72} />
              </motion.div>
              <h2 className="font-heading text-4xl font-extrabold md:text-5xl">
                Cadastro <span className="text-tea-yellow">enviado</span> com{" "}
                <Heart className="inline text-tea-red" size={40} />
              </h2>
              <p className="max-w-xl text-lg text-muted-foreground">
                Obrigada por confiar na Associação Colo de Mãe. Em breve nossa
                equipe entrará em contato pelos canais informados.
              </p>
              <a
                href="/"
                className="mt-2 inline-flex items-center gap-2 rounded-full bg-tea-yellow px-8 py-3 font-bold text-background transition-all hover:-translate-y-0.5 hover:bg-tea-yellow/90"
              >
                Voltar ao site
              </a>
            </motion.section>
          )}
        </AnimatePresence>
      </main>

      {/* Modal de contato */}
      <AnimatePresence>
        {showContact && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 p-4 backdrop-blur"
            onClick={() => setShowContact(false)}
          >
            <motion.form
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              onSubmit={handleContactSubmit}
              className="relative w-full max-w-md rounded-2xl border-2 border-tea-yellow/40 bg-card p-8 shadow-2xl"
            >
              <button
                type="button"
                onClick={() => setShowContact(false)}
                className="absolute right-4 top-4 text-muted-foreground hover:text-foreground"
                aria-label="Fechar"
              >
                <X size={20} />
              </button>
              <h3 className="mb-2 font-heading text-2xl font-extrabold">
                Que bom ter você com a gente! 💛
              </h3>
              <p className="mb-6 text-sm text-muted-foreground">
                Precisamos só de dois contatos para enviar seu cartão.
              </p>
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="ct-email" className="flex items-center gap-1.5 font-semibold">
                    <Mail size={14} /> Melhor e-mail
                  </Label>
                  <Input
                    id="ct-email"
                    type="email"
                    required
                    value={contact.email}
                    onChange={(e) => setContact({ ...contact, email: e.target.value })}
                    placeholder="seunome@email.com"
                    className="min-h-12"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="ct-wa" className="flex items-center gap-1.5 font-semibold">
                    <Phone size={14} /> Melhor WhatsApp
                  </Label>
                  <Input
                    id="ct-wa"
                    type="tel"
                    required
                    value={contact.whatsapp}
                    onChange={(e) => setContact({ ...contact, whatsapp: e.target.value })}
                    placeholder="(00) 00000-0000"
                    className="min-h-12"
                  />
                </div>
                <Button
                  type="submit"
                  className="mt-2 min-h-12 rounded-full bg-tea-yellow font-bold text-background hover:bg-tea-yellow/90"
                >
                  Continuar para o cadastro
                  <ArrowRight size={16} />
                </Button>
              </div>
            </motion.form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// ──────────────────────────────────────────────────────────────
// Field renderer
// ──────────────────────────────────────────────────────────────

const FieldRenderer = ({
  field,
  value,
  onChange,
}: {
  field: FieldDef;
  value: string | string[] | undefined;
  onChange: (v: string | string[]) => void;
}) => {
  const id = `f-${field.id}`;
  if (field.type === "textarea") {
    return (
      <div className="flex flex-col gap-2">
        <Label htmlFor={id} className="font-semibold">
          {field.label}
          {field.required && <span className="text-tea-red"> *</span>}
        </Label>
        <Textarea
          id={id}
          rows={4}
          placeholder={field.placeholder}
          value={(value as string) ?? ""}
          onChange={(e) => onChange(e.target.value)}
          className="bg-background/50"
        />
      </div>
    );
  }
  if (field.type === "radio") {
    return (
      <div className="flex flex-col gap-3">
        <Label className="font-semibold">
          {field.label}
          {field.required && <span className="text-tea-red"> *</span>}
        </Label>
        <RadioGroup
          value={(value as string) ?? ""}
          onValueChange={(v) => onChange(v)}
          className="grid gap-2 sm:grid-cols-2"
        >
          {field.options?.map((opt) => (
            <label
              key={opt}
              htmlFor={`${id}-${opt}`}
              className="flex cursor-pointer items-center gap-3 rounded-xl border-2 border-border/60 bg-background/40 p-3 transition-all hover:border-tea-yellow/60"
            >
              <RadioGroupItem value={opt} id={`${id}-${opt}`} />
              <span>{opt}</span>
            </label>
          ))}
        </RadioGroup>
      </div>
    );
  }
  if (field.type === "checkbox") {
    const arr = Array.isArray(value) ? value : [];
    const toggle = (opt: string) =>
      onChange(arr.includes(opt) ? arr.filter((x) => x !== opt) : [...arr, opt]);
    return (
      <div className="flex flex-col gap-3">
        <Label className="font-semibold">
          {field.label}
          {field.required && <span className="text-tea-red"> *</span>}
        </Label>
        <div className="grid gap-2 sm:grid-cols-2">
          {field.options?.map((opt) => (
            <label
              key={opt}
              className="flex cursor-pointer items-center gap-3 rounded-xl border-2 border-border/60 bg-background/40 p-3 transition-all hover:border-tea-yellow/60"
            >
              <Checkbox checked={arr.includes(opt)} onCheckedChange={() => toggle(opt)} />
              <span>{opt}</span>
            </label>
          ))}
        </div>
      </div>
    );
  }
  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor={id} className="font-semibold">
        {field.label}
        {field.required && <span className="text-tea-red"> *</span>}
      </Label>
      <Input
        id={id}
        type={field.type}
        placeholder={field.placeholder}
        value={(value as string) ?? ""}
        onChange={(e) => onChange(e.target.value)}
        className="min-h-12 bg-background/50"
      />
    </div>
  );
};

export default Cartao;
