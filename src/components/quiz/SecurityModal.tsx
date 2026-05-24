import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

interface Props {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: { word: string; phrase: string; code: string; shareUrl: string }) => void;
}

const WORDS = [
  "carinho", "abraço", "ninho", "afeto", "colo", "ternura", "luz",
  "estrela", "girassol", "doçura", "esperança", "sorriso", "abrigo",
  "florescer", "primavera", "céu", "lua", "amor", "raiz", "mel",
];

const PHRASES = [
  "afeto que floresce em cada sorriso",
  "colo seguro para crescer com amor",
  "luz que acolhe pequenos passos",
  "ninho quente onde o coração descansa",
  "ternura que transforma o caminho",
  "abrigo de carinho em todo dia",
  "mãos que cuidam com paciência",
  "abraço que cura silêncios",
  "estrela guia da família inteira",
  "raiz forte de amor verdadeiro",
];

const CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
const STORAGE_KEY = "colo-de-mae-security-draft";

function pick<T>(arr: T[]) {
  return arr[Math.floor(Math.random() * arr.length)];
}
function genCode() {
  let s = "";
  for (let i = 0; i < 5; i++) s += CHARS[Math.floor(Math.random() * CHARS.length)];
  return s;
}

type Draft = {
  word: string;
  phrase: string;
  code: string;
  shareToken: string;
  saved: boolean;
  acknowledged: boolean;
};

function loadDraft(): Draft {
  try {
    const raw = typeof window !== "undefined" ? localStorage.getItem(STORAGE_KEY) : null;
    if (raw) {
      const d = JSON.parse(raw) as Partial<Draft>;
      if (d.word && d.phrase && d.code && d.shareToken) {
        return {
          word: d.word,
          phrase: d.phrase,
          code: d.code,
          shareToken: d.shareToken,
          saved: Boolean(d.saved),
          acknowledged: Boolean(d.acknowledged),
        };
      }
    }
  } catch {}
  return {
    word: pick(WORDS),
    phrase: pick(PHRASES),
    code: genCode(),
    shareToken: `${Math.random().toString(36).slice(2, 8)}${Math.random().toString(36).slice(2, 8)}`,
    saved: false,
    acknowledged: false,
  };
}

export function SecurityModal({ open, onClose, onSubmit }: Props) {
  const [draft, setDraft] = useState<Draft>(() => loadDraft());
  const { word, phrase, code, shareToken, saved, acknowledged } = draft;
  const [err, setErr] = useState<string | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(draft)); } catch {}
  }, [draft]);

  const shareUrl = useMemo(() => {
    const origin =
      typeof window !== "undefined" ? window.location.origin : "https://cartao-colo-de-mae.lovable.app";
    return `${origin}/cartao/${shareToken}`;
  }, [shareToken]);

  const fileContent = useMemo(
    () =>
      `Cartão Colo de Mãe — Credenciais de Segurança\n` +
      `Gerado em: ${new Date().toLocaleString("pt-BR")}\n\n` +
      `Palavra secreta: ${word}\n` +
      `Frase secreta: ${phrase}\n` +
      `Código único: ${code}\n\n` +
      `Link exclusivo do seu cartão:\n${shareUrl}\n\n` +
      `⚠️ Guarde estas informações em local seguro. Elas servirão para recuperar e proteger o acesso ao seu Cartão Colo de Mãe.\n`,
    [word, phrase, code, shareUrl]
  );

  if (!open) return null;

  const regen = (field: "word" | "phrase" | "code") => {
    setDraft((d) => ({
      ...d,
      saved: false,
      ...(field === "word" ? { word: pick(WORDS) } : {}),
      ...(field === "phrase" ? { phrase: pick(PHRASES) } : {}),
      ...(field === "code" ? { code: genCode() } : {}),
    }));
    const label = field === "word" ? "Nova palavra gerada" : field === "phrase" ? "Nova frase gerada" : "Novo código gerado";
    toast.success(label, {
      description: "Salve novamente as credenciais para habilitar Continuar.",
    });
  };

  const handleSave = () => {
    const blob = new Blob([fileContent], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `colo-de-mae-credenciais-${code}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setDraft((d) => ({ ...d, saved: true }));
    setErr(null);
    toast.success("Arquivo .txt baixado", { description: "Guarde-o em local seguro." });
  };

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(code);
      toast.success("Código copiado");
    } catch {
      toast.error("Não foi possível copiar");
    }
  };

  const copyAll = async () => {
    const text = `Palavra: ${word}\nFrase: ${phrase}\nCódigo: ${code}\nLink: ${shareUrl}`;
    try {
      await navigator.clipboard.writeText(text);
      toast.success("Credenciais copiadas", {
        description: "Palavra, frase, código e link foram para a área de transferência.",
      });
    } catch {
      toast.error("Não foi possível copiar as credenciais");
    }
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    } catch {}
  };

  const shareLink = async () => {
    const shareData = {
      title: "Meu Cartão Colo de Mãe",
      text: "Esse é o meu link exclusivo do Cartão Colo de Mãe 💙",
      url: shareUrl,
    };
    if (typeof navigator !== "undefined" && (navigator as any).share) {
      try {
        await (navigator as any).share(shareData);
        return;
      } catch {}
    }
    copyLink();
  };

  const submit = () => {
    if (!saved) {
      setErr("Você precisa salvar suas credenciais antes de continuar.");
      return;
    }
    if (!acknowledged) {
      setErr("Marque que você anotou seu código em um lugar seguro.");
      return;
    }
    try { localStorage.removeItem(STORAGE_KEY); } catch {}
    onSubmit({ word, phrase, code, shareUrl });
  };

  const canContinue = saved && acknowledged;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="sec-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/50 backdrop-blur-sm px-4 py-6 overflow-y-auto animate-fade-in"
    >
      <div className="w-full max-w-5xl rounded-3xl bg-card border-2 border-border shadow-soft p-6 sm:p-8 animate-slide-up my-auto">
        <div className="text-center mb-5">
          <div className="mx-auto mb-3 inline-flex h-12 w-12 items-center justify-center rounded-full border-2 border-accent text-2xl" aria-hidden>
            🛡️
          </div>
          <h2 id="sec-title" className="text-2xl sm:text-3xl font-bold mb-2">
            Proteja seu cadastro 🔐
          </h2>
          <p className="text-muted-foreground">
            Crie suas chaves secretas. Elas servirão para recuperar e proteger o acesso ao seu Cartão Colo de Mãe.
          </p>
        </div>

        <p className="mb-5 rounded-2xl border-2 border-accent/50 bg-accent/10 px-4 py-3 text-center text-sm text-foreground/80">
          Geramos credenciais aleatórias para você. Você pode gerar novas quantas vezes quiser e depois{" "}
          <strong>salvar</strong> em local seguro. Tudo fica guardado neste navegador até você concluir.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 lg:gap-6 items-start">
          <div className="space-y-5">
          <div className="space-y-2">
            <label htmlFor="sec-word" className="flex items-center gap-2 text-base font-semibold">
              🔑 Palavra secreta
            </label>
            <div className="flex gap-2">
              <input
                id="sec-word"
                readOnly
                value={word}
                className="flex-1 rounded-2xl border-2 border-border bg-muted/30 px-5 py-3 text-lg font-mono"
              />
              <button
                type="button"
                onClick={() => regen("word")}
                aria-label="Gerar nova palavra"
                className="rounded-2xl border-2 border-border bg-card px-4 hover:bg-muted transition-colors"
              >
                🔄
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="sec-phrase" className="flex items-center gap-2 text-base font-semibold">
              🔒 Frase secreta
            </label>
            <div className="flex gap-2">
              <input
                id="sec-phrase"
                readOnly
                value={phrase}
                className="flex-1 rounded-2xl border-2 border-border bg-muted/30 px-5 py-3 text-base font-mono"
              />
              <button
                type="button"
                onClick={() => regen("phrase")}
                aria-label="Gerar nova frase"
                className="rounded-2xl border-2 border-border bg-card px-4 hover:bg-muted transition-colors"
              >
                🔄
              </button>
            </div>
          </div>

          <div className="rounded-2xl border-2 border-dashed border-accent/60 bg-accent/5 p-4 space-y-3">
            <div className="flex items-center gap-2 text-base font-semibold">
              🛡️ Código único de segurança
            </div>
            <p className="text-sm text-muted-foreground">
              Anote este código em local seguro. Ele tem 5 caracteres (letras maiúsculas e números) e não poderá ser recuperado depois.
            </p>
            <div className="flex items-center justify-between gap-3">
              <div className="flex-1 text-center text-2xl sm:text-3xl font-bold tracking-[0.4em] text-accent font-mono">
                {code.split("").join(" ")}
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={copyCode}
                  aria-label="Copiar código"
                  className="rounded-xl border-2 border-border bg-card px-3 py-2 hover:bg-muted transition-colors"
                >
                  📋
                </button>
                <button
                  type="button"
                  onClick={() => regen("code")}
                  aria-label="Gerar novo código"
                  className="rounded-xl border-2 border-border bg-card px-3 py-2 hover:bg-muted transition-colors"
                >
                  🔄
                </button>
              </div>
            </div>
            <label className="flex items-center gap-2 cursor-pointer select-none text-sm">
              <input
                type="checkbox"
                checked={acknowledged}
                onChange={(e) => { setDraft((d) => ({ ...d, acknowledged: e.target.checked })); setErr(null); }}
                className="h-5 w-5 rounded border-2 border-border accent-accent"
              />
              Já anotei meu código em um lugar seguro.
            </label>
          </div>
          </div>

          <div className="space-y-5">
          <div className="rounded-2xl border-2 border-primary/40 bg-primary/5 p-4 space-y-3">
            <div className="flex items-center gap-2 text-base font-semibold">
              🔗 Seu link exclusivo do Cartão
            </div>
            <p className="text-sm text-muted-foreground">
              Use este link para acessar e compartilhar seu Cartão Colo de Mãe. Ele é único e pessoal — guarde com carinho.
            </p>
            <div className="flex gap-2">
              <input
                readOnly
                value={shareUrl}
                onFocus={(e) => e.currentTarget.select()}
                className="flex-1 rounded-2xl border-2 border-border bg-muted/30 px-4 py-3 text-sm font-mono truncate"
                aria-label="Link exclusivo do cartão"
              />
              <button
                type="button"
                onClick={copyLink}
                aria-label="Copiar link"
                className="rounded-2xl border-2 border-border bg-card px-4 hover:bg-muted transition-colors"
              >
                {copiedLink ? "✅" : "📋"}
              </button>
            </div>
            <button
              type="button"
              onClick={shareLink}
              className="w-full inline-flex items-center justify-center gap-2 rounded-2xl border-2 border-primary/50 bg-card px-6 py-3 text-base font-bold text-foreground hover:bg-primary/10 transition-colors min-h-12"
            >
              📤 Compartilhar meu cartão
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              type="button"
              onClick={handleSave}
              className={`inline-flex items-center justify-center gap-2 rounded-2xl border-2 px-6 py-4 text-base font-bold transition-all min-h-14 ${
                saved
                  ? "border-accent bg-accent/15 text-accent"
                  : "border-border bg-card hover:bg-muted text-foreground"
              }`}
            >
              {saved ? "✅ Credenciais salvas" : "⬇️ Salvar credenciais (.txt)"}
            </button>
            <button
              type="button"
              onClick={copyAll}
              className="inline-flex items-center justify-center gap-2 rounded-2xl border-2 border-border bg-card px-6 py-4 text-base font-bold hover:bg-muted transition-all min-h-14"
            >
              📋 Copiar credenciais
            </button>
          </div>

          {/* Checklist — por que Continuar está desabilitado */}
          <div className="rounded-2xl border-2 border-border bg-muted/20 p-4 space-y-2">
            <p className="text-sm font-semibold mb-1">Para liberar “Continuar”:</p>
            <div className="flex items-center gap-2 text-sm">
              <span className={`inline-flex h-5 w-5 items-center justify-center rounded-full border-2 ${saved ? "border-accent bg-accent text-accent-foreground" : "border-border bg-card"}`}>
                {saved ? "✓" : ""}
              </span>
              <span className={saved ? "text-foreground" : "text-muted-foreground"}>
                Salvar credenciais (.txt)
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <span className={`inline-flex h-5 w-5 items-center justify-center rounded-full border-2 ${acknowledged ? "border-accent bg-accent text-accent-foreground" : "border-border bg-card"}`}>
                {acknowledged ? "✓" : ""}
              </span>
              <span className={acknowledged ? "text-foreground" : "text-muted-foreground"}>
                Confirmar que anotei o código
              </span>
            </div>
          </div>

          {err && (
            <p role="alert" className="rounded-xl bg-destructive/10 border-2 border-destructive/30 px-4 py-3 text-destructive font-medium">
              {err}
            </p>
          )}
          </div>
        </div>

        <div className="mt-7 flex flex-col-reverse sm:flex-row gap-3 sm:justify-between">
          <button
            type="button"
            onClick={onClose}
            className="rounded-2xl border-2 border-border bg-card px-6 py-4 text-lg font-semibold hover:bg-muted transition-colors min-h-14"
          >
            Voltar
          </button>
          <button
            type="button"
            onClick={submit}
            disabled={!canContinue}
            title={!canContinue ? "Salve as credenciais e confirme o código para continuar" : undefined}
            className="rounded-2xl bg-gradient-primary px-8 py-4 text-lg font-bold text-primary-foreground shadow-soft hover:opacity-95 active:scale-[0.98] transition-all min-h-14 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Continuar para o cadastro →
          </button>
        </div>
      </div>
    </div>
  );
}
