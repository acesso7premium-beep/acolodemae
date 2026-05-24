import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

type PublicCartao = {
  protocolo: string;
  nome_pcd: string | null;
  nome_responsavel: string | null;
  cidade: string | null;
  estado: string | null;
  diagnosticos: string[] | null;
  necessidades: string[] | null;
  wants_card: boolean;
  created_at: string;
};

export default function CartaoPublico() {
  const { token } = useParams<{ token: string }>();
  const [cartao, setCartao] = useState<PublicCartao | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let active = true;
    (async () => {
      if (!token) {
        setLoading(false);
        return;
      }
      const { data, error } = await supabase.rpc("get_public_cartao", { _token: token });
      if (!active) return;
      if (error) {
        console.error(error);
        setCartao(null);
      } else if (Array.isArray(data) && data.length > 0) {
        setCartao(data[0] as PublicCartao);
      } else {
        setCartao(null);
      }
      setLoading(false);
    })();
    return () => {
      active = false;
    };
  }, [token]);

  const shareUrl = useMemo(
    () => (typeof window !== "undefined" ? `${window.location.origin}/cartao/${token}` : `/cartao/${token}`),
    [token],
  );

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  return (
    <main className="min-h-dvh bg-gradient-warm px-4 py-12">
      <article className="mx-auto max-w-2xl rounded-3xl bg-card border-2 border-border shadow-soft p-8 sm:p-10 animate-slide-up">
        <header className="text-center mb-6">
          <div className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-1.5 text-sm font-bold text-primary-foreground mb-3">
            💙 Cartão Colo de Mãe
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold">Resumo público do cartão</h1>
          <p className="text-muted-foreground mt-2">
            Esta página exibe apenas informações públicas. Palavra, frase e código secretos
            <strong> nunca</strong> aparecem aqui.
          </p>
        </header>

        {loading ? (
          <p className="text-center text-muted-foreground py-10" aria-live="polite">Carregando…</p>
        ) : !cartao ? (
          <div className="rounded-2xl bg-accent/30 border-2 border-accent p-6 text-center">
            <div className="text-4xl mb-2" aria-hidden>🔎</div>
            <h2 className="text-xl font-bold mb-2">Cartão não encontrado</h2>
            <p className="text-muted-foreground">Verifique se o link está correto.</p>
            <Link
              to="/cartao"
              className="mt-5 inline-flex rounded-2xl bg-gradient-primary px-6 py-3 font-bold text-primary-foreground shadow-soft"
            >
              Fazer meu cadastro
            </Link>
          </div>
        ) : (
          <>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-muted/60 px-3 py-1 text-xs font-mono">
              {cartao.protocolo}
            </div>

            <dl className="grid sm:grid-cols-2 gap-x-6 gap-y-3 mb-6">
              <div className="rounded-xl bg-muted/40 p-3">
                <dt className="text-xs font-semibold text-muted-foreground uppercase">Cadastrado em</dt>
                <dd className="font-medium">{new Date(cartao.created_at).toLocaleString("pt-BR")}</dd>
              </div>
              <div className="rounded-xl bg-muted/40 p-3">
                <dt className="text-xs font-semibold text-muted-foreground uppercase">Cartão solicitado</dt>
                <dd className="font-medium">{cartao.wants_card ? "Sim 💙" : "Não"}</dd>
              </div>
              {cartao.nome_pcd && (
                <div className="rounded-xl bg-muted/40 p-3 sm:col-span-2">
                  <dt className="text-xs font-semibold text-muted-foreground uppercase">Beneficiário(a)</dt>
                  <dd className="font-medium">{cartao.nome_pcd}</dd>
                </div>
              )}
              {cartao.nome_responsavel && (
                <div className="rounded-xl bg-muted/40 p-3 sm:col-span-2">
                  <dt className="text-xs font-semibold text-muted-foreground uppercase">Responsável</dt>
                  <dd className="font-medium">{cartao.nome_responsavel}</dd>
                </div>
              )}
              {(cartao.cidade || cartao.estado) && (
                <div className="rounded-xl bg-muted/40 p-3 sm:col-span-2">
                  <dt className="text-xs font-semibold text-muted-foreground uppercase">Localização</dt>
                  <dd className="font-medium">{[cartao.cidade, cartao.estado].filter(Boolean).join(" / ")}</dd>
                </div>
              )}
              {cartao.diagnosticos && cartao.diagnosticos.length > 0 && (
                <div className="rounded-xl bg-muted/40 p-3 sm:col-span-2">
                  <dt className="text-xs font-semibold text-muted-foreground uppercase">Diagnósticos</dt>
                  <dd className="font-medium">{cartao.diagnosticos.join(", ")}</dd>
                </div>
              )}
              {cartao.necessidades && cartao.necessidades.length > 0 && (
                <div className="rounded-xl bg-muted/40 p-3 sm:col-span-2">
                  <dt className="text-xs font-semibold text-muted-foreground uppercase">Necessidades</dt>
                  <dd className="font-medium">{cartao.necessidades.join(", ")}</dd>
                </div>
              )}
            </dl>

            <div className="rounded-2xl bg-primary/5 border-2 border-primary/30 p-4">
              <div className="text-sm font-semibold mb-2">🔗 Link exclusivo</div>
              <div className="flex gap-2">
                <input
                  readOnly
                  value={shareUrl}
                  aria-label="Link exclusivo do cartão"
                  className="flex-1 rounded-xl border-2 border-border bg-card px-3 py-2 text-sm font-mono"
                  onFocus={(e) => e.currentTarget.select()}
                />
                <button
                  type="button"
                  onClick={copyLink}
                  className="rounded-xl bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90"
                >
                  {copied ? "✓ Copiado" : "📋 Copiar"}
                </button>
              </div>
            </div>

            <p className="mt-6 text-xs text-center text-muted-foreground">
              🛡️ Palavra, frase e código secretos nunca são exibidos nesta página pública.
            </p>
          </>
        )}
      </article>
    </main>
  );
}
