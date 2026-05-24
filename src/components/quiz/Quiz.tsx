import { useEffect, useState } from "react";
import { toast } from "sonner";
import { steps } from "./steps";
import { FieldRenderer } from "./Field";
import { supabase } from "@/integrations/supabase/client";
import { mapAnswersToCadastro } from "./mapAnswers";

const STORAGE_KEY = "colo-de-mae-quiz";

interface Props {
  wantsCard: boolean | null;
  contact?: { email: string; whatsapp: string } | null;
  credentials?: { word: string; phrase: string; code: string; shareUrl?: string } | null;
  onFinish: (info?: { shareUrl?: string; protocolo?: string }) => void;
}

export function Quiz({ wantsCard, contact, credentials, onFinish }: Props) {
  const [stepIndex, setStepIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setAnswers(parsed.answers || {});
        setStepIndex(parsed.stepIndex || 0);
      } catch {}
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ answers, stepIndex }));
  }, [answers, stepIndex]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [stepIndex]);

  const step = steps[stepIndex];
  const progress = Math.round(((stepIndex + 1) / steps.length) * 100);
  const isLast = stepIndex === steps.length - 1;

  const setValue = (id: string, v: any) => {
    setAnswers((a) => ({ ...a, [id]: v }));
    setError(null);
  };

  const next = async () => {
    for (const f of step.fields) {
      if (f.required) {
        const v = answers[f.id];
        if (!v || (typeof v === "string" && !v.trim())) {
          setError("Por favor, preencha os campos marcados com *");
          return;
        }
      }
    }
    if (isLast) {
      if (submitting) return;
      setSubmitting(true);
      try {
        const payload = mapAnswersToCadastro(answers, { wantsCard, contact });
        if (!payload.aceite_lgpd || !payload.aceite_termo) {
          setError("É necessário aceitar os termos para concluir.");
          setSubmitting(false);
          return;
        }
        const { data: inserted, error: insErr } = await supabase
          .from("cadastros")
          .insert(payload)
          .select("id, share_token, protocolo")
          .single();
        if (insErr || !inserted) throw insErr ?? new Error("Falha ao salvar cadastro");

        if (credentials?.code) {
          const { error: credErr } = await supabase
            .from("cadastro_credenciais")
            .insert({
              cadastro_id: inserted.id,
              word: credentials.word,
              phrase: credentials.phrase,
              code: credentials.code.toUpperCase(),
            });
          if (credErr) {
            console.error("Falha ao salvar credenciais", credErr);
          }
        }

        const shareUrl = `${window.location.origin}/cartao/${inserted.share_token}`;
        localStorage.removeItem(STORAGE_KEY);
        localStorage.removeItem(STORAGE_KEY + "-final");
        toast.success("Cadastro enviado com sucesso", {
          description: `Protocolo: ${inserted.protocolo}`,
        });
        onFinish({ shareUrl, protocolo: inserted.protocolo });
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : "Erro ao enviar cadastro";
        toast.error("Erro ao enviar", { description: msg });
        setError(msg);
      } finally {
        setSubmitting(false);
      }
    } else {
      setStepIndex((i) => i + 1);
    }
  };

  const back = () => setStepIndex((i) => Math.max(0, i - 1));


  return (
    <div className="min-h-dvh bg-gradient-warm py-6 sm:py-12 px-4">
      <div className="mx-auto max-w-3xl">
        {/* Progress */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-3 text-sm font-semibold text-muted-foreground">
            <span>
              Etapa {stepIndex + 1} de {steps.length}
            </span>
            <span>{progress}%</span>
          </div>
          <div className="h-4 w-full overflow-hidden rounded-full bg-card border-2 border-border">
            <div
              className="h-full bg-gradient-primary transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
              role="progressbar"
              aria-valuenow={progress}
              aria-valuemin={0}
              aria-valuemax={100}
            />
          </div>
        </div>

        {step.encouragement && (
          <p className="mb-4 rounded-2xl bg-card border-2 border-accent px-5 py-3 text-base text-foreground/80 animate-fade-in">
            {step.encouragement}
          </p>
        )}

        <div
          key={step.id}
          className="rounded-3xl bg-card border-2 border-border shadow-soft p-6 sm:p-10 animate-slide-up"
        >
          <div className="mb-8 text-center">
            <div className="text-5xl mb-3" aria-hidden>
              {step.emoji}
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold mb-2">{step.title}</h1>
            <p className="text-muted-foreground text-base sm:text-lg">{step.description}</p>
          </div>

          <div className="space-y-8">
            {step.fields.map((f) => (
              <FieldRenderer
                key={f.id}
                field={f}
                value={answers[f.id]}
                onChange={(v) => setValue(f.id, v)}
              />
            ))}
          </div>

          {error && (
            <p
              role="alert"
              className="mt-6 rounded-xl bg-destructive/10 border-2 border-destructive/30 px-4 py-3 text-destructive font-medium"
            >
              {error}
            </p>
          )}

          <div className="mt-10 flex flex-col-reverse sm:flex-row gap-3 sm:justify-between">
            <button
              type="button"
              onClick={back}
              disabled={stepIndex === 0}
              className="inline-flex items-center justify-center gap-2 rounded-2xl border-2 border-border bg-card px-6 py-4 text-lg font-semibold text-foreground transition-colors hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed min-h-14"
            >
              ← Voltar
            </button>
            <button
              type="button"
              onClick={next}
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-primary px-8 py-4 text-lg font-bold text-primary-foreground shadow-soft hover:opacity-95 active:scale-[0.98] transition-all min-h-14"
            >
              {isLast ? "Concluir cadastro 💙" : "Continuar →"}
            </button>
          </div>
        </div>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          🔒 Suas respostas são salvas automaticamente — você pode continuar depois.
        </p>
      </div>
    </div>
  );
}