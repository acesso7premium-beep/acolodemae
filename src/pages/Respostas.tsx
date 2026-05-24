import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "sonner";
import {
  ArrowLeft,
  Download,
  FileSpreadsheet,
  FileJson,
  FileText,
  CheckCircle2,
  Clock,
  Database,
  LogOut,
  Crown,
  Search,
  AlertTriangle,
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

type Cadastro = {
  id: string;
  protocolo: string;
  share_token: string;
  wants_card: boolean;
  email: string | null;
  whatsapp: string | null;
  nome_pcd: string | null;
  nome_responsavel: string | null;
  cidade: string | null;
  bairro: string | null;
  idade: number | null;
  diagnosticos: string[] | null;
  necessidades: string[] | null;
  nivel_suporte: string | null;
  status: string;
  is_urgente: boolean;
  created_at: string;
};

const STATUSES = ["todos", "novo", "em_analise", "em_atendimento", "atendido", "arquivado"];

const downloadFile = (filename: string, content: string, mime: string) => {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
};

const Respostas = () => {
  const { isSuperAdmin, signOut, user } = useAuth();
  const [cadastros, setCadastros] = useState<Cadastro[]>([]);
  const [loading, setLoading] = useState(true);

  // Filtros
  const [search, setSearch] = useState("");
  const [cidadeFiltro, setCidadeFiltro] = useState("todas");
  const [statusFiltro, setStatusFiltro] = useState("todos");
  const [apenasUrgentes, setApenasUrgentes] = useState(false);
  const [apenasCartao, setApenasCartao] = useState(false);

  useEffect(() => {
    let active = true;
    (async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("cadastros")
        .select(
          "id, protocolo, share_token, wants_card, email, whatsapp, nome_pcd, nome_responsavel, cidade, bairro, idade, diagnosticos, necessidades, nivel_suporte, status, is_urgente, created_at",
        )
        .order("created_at", { ascending: false });
      if (!active) return;
      if (error) {
        toast.error("Erro ao carregar cadastros", { description: error.message });
        setCadastros([]);
      } else {
        setCadastros((data ?? []) as Cadastro[]);
      }
      setLoading(false);
    })();
    return () => {
      active = false;
    };
  }, []);

  const cidades = useMemo(
    () => Array.from(new Set(cadastros.map((c) => c.cidade).filter(Boolean))) as string[],
    [cadastros],
  );

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return cadastros.filter((c) => {
      if (cidadeFiltro !== "todas" && c.cidade !== cidadeFiltro) return false;
      if (statusFiltro !== "todos" && c.status !== statusFiltro) return false;
      if (apenasUrgentes && !c.is_urgente) return false;
      if (apenasCartao && !c.wants_card) return false;
      if (q) {
        const hay = [
          c.protocolo,
          c.nome_pcd,
          c.nome_responsavel,
          c.email,
          c.whatsapp,
          c.cidade,
          c.bairro,
          ...(c.diagnosticos ?? []),
          ...(c.necessidades ?? []),
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [cadastros, search, cidadeFiltro, statusFiltro, apenasUrgentes, apenasCartao]);

  const stats = useMemo(
    () => ({
      total: cadastros.length,
      cartao: cadastros.filter((c) => c.wants_card).length,
      urgentes: cadastros.filter((c) => c.is_urgente).length,
      hoje: cadastros.filter(
        (c) => new Date(c.created_at).toDateString() === new Date().toDateString(),
      ).length,
    }),
    [cadastros],
  );

  const exportCSV = () => {
    const cols = [
      "protocolo",
      "nome_pcd",
      "nome_responsavel",
      "email",
      "whatsapp",
      "cidade",
      "bairro",
      "idade",
      "diagnosticos",
      "necessidades",
      "nivel_suporte",
      "wants_card",
      "is_urgente",
      "status",
      "created_at",
    ];
    const escape = (v: unknown) => {
      const s = Array.isArray(v) ? v.join("|") : v == null ? "" : String(v);
      return `"${s.replace(/"/g, '""')}"`;
    };
    const csv = [
      cols.join(","),
      ...filtered.map((r) => cols.map((c) => escape((r as Record<string, unknown>)[c])).join(",")),
    ].join("\n");
    downloadFile("cadastros.csv", csv, "text/csv");
  };

  const exportJSON = () => {
    downloadFile("cadastros.json", JSON.stringify(filtered, null, 2), "application/json");
  };

  const exportTXT = () => {
    const txt = filtered
      .map(
        (r) =>
          `${r.protocolo} — ${r.nome_pcd ?? "—"} | ${r.email ?? "—"} | ${r.whatsapp ?? "—"} | ${r.cidade ?? "—"}`,
      )
      .join("\n");
    downloadFile("cadastros.txt", txt, "text/plain");
  };

  const updateStatus = async (id: string, status: string) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await supabase.from("cadastros").update({ status } as any).eq("id", id);
    if (error) {
      toast.error("Erro ao atualizar status");
      return;
    }
    setCadastros((prev) => prev.map((c) => (c.id === id ? { ...c, status } : c)));
    toast.success("Status atualizado");
  };

  const remove = async (id: string) => {
    if (!isSuperAdmin) {
      toast.error("Apenas Super Admin pode remover");
      return;
    }
    if (!confirm("Remover este cadastro? Esta ação não pode ser desfeita.")) return;
    const { error } = await supabase.from("cadastros").delete().eq("id", id);
    if (error) {
      toast.error("Erro ao remover", { description: error.message });
      return;
    }
    setCadastros((prev) => prev.filter((c) => c.id !== id));
    toast.success("Cadastro removido");
  };

  return (
    <div className="min-h-screen">
      <Header />
      <main className="container mx-auto px-4 pb-20 pt-28">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mx-auto flex max-w-6xl flex-col gap-8"
        >
          <div className="flex flex-col gap-4">
            <Link
              to="/"
              className="inline-flex w-fit items-center gap-2 text-sm text-muted-foreground hover:text-tea-yellow"
            >
              <ArrowLeft size={16} /> Voltar ao site
            </Link>
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <Badge className="mb-3 bg-tea-yellow text-background hover:bg-tea-yellow">
                  CRM Social — Painel Institucional
                </Badge>
                <h1 className="font-heading text-4xl font-extrabold md:text-5xl">
                  Painel Geral de <span className="text-tea-yellow">Cadastros</span>
                </h1>
                <p className="mt-2 max-w-2xl text-muted-foreground">
                  Conectado ao Lovable Cloud. Palavra, frase e código secretos
                  nunca são exibidos nem exportados.
                </p>
                {user && (
                  <p className="mt-2 text-xs text-muted-foreground">
                    Sessão: {user.email}{" "}
                    {isSuperAdmin && (
                      <span className="ml-2 inline-flex items-center gap-1 rounded-full bg-tea-yellow/15 px-2 py-0.5 text-tea-yellow">
                        <Crown size={12} /> Super Admin
                      </span>
                    )}
                  </p>
                )}
              </div>
              <Button
                onClick={async () => {
                  await signOut();
                  toast.success("Sessão encerrada");
                }}
                variant="outline"
                className="rounded-full"
              >
                <LogOut size={16} /> Sair
              </Button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid gap-4 md:grid-cols-4">
            {[
              { label: "Total", value: stats.total, icon: Database, color: "tea-blue" },
              { label: "Com cartão", value: stats.cartao, icon: CheckCircle2, color: "tea-green" },
              { label: "Urgentes", value: stats.urgentes, icon: AlertTriangle, color: "tea-red" },
              { label: "Hoje", value: stats.hoje, icon: Clock, color: "tea-yellow" },
            ].map((s) => (
              <Card key={s.label} className="border-2 border-border/60 bg-card/70 backdrop-blur">
                <CardContent className="flex items-center justify-between p-6">
                  <div>
                    <p className="text-sm text-muted-foreground">{s.label}</p>
                    <p className="font-heading text-3xl font-extrabold">{s.value}</p>
                  </div>
                  <s.icon className={`text-${s.color}`} size={36} />
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Filtros */}
          <Card className="border-2 border-border/60 bg-card/70 backdrop-blur">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 font-heading text-xl">
                <Search size={20} /> Filtros
              </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Busca livre: nome, protocolo, telefone..."
                className="md:col-span-2 rounded-xl border-2 border-border bg-background/70 px-3 py-2 outline-none focus:border-tea-yellow"
              />
              <select
                value={cidadeFiltro}
                onChange={(e) => setCidadeFiltro(e.target.value)}
                className="rounded-xl border-2 border-border bg-background/70 px-3 py-2 outline-none focus:border-tea-yellow"
              >
                <option value="todas">Todas as cidades</option>
                {cidades.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
              <select
                value={statusFiltro}
                onChange={(e) => setStatusFiltro(e.target.value)}
                className="rounded-xl border-2 border-border bg-background/70 px-3 py-2 outline-none focus:border-tea-yellow"
              >
                {STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {s.replace(/_/g, " ")}
                  </option>
                ))}
              </select>
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={apenasUrgentes}
                  onChange={(e) => setApenasUrgentes(e.target.checked)}
                />
                Apenas urgentes
              </label>
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={apenasCartao}
                  onChange={(e) => setApenasCartao(e.target.checked)}
                />
                Solicitou cartão
              </label>
              <p className="md:col-span-2 self-center text-xs text-muted-foreground">
                <strong>{filtered.length}</strong> de <strong>{cadastros.length}</strong> cadastros
              </p>
            </CardContent>
          </Card>

          {/* Export */}
          <Card className="border-2 border-border/60 bg-card/70 backdrop-blur">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 font-heading text-xl">
                <Download size={20} /> Exportar (apenas filtrados)
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-3">
              <Button onClick={exportCSV} variant="outline" className="gap-2 rounded-xl">
                <FileSpreadsheet size={16} /> CSV
              </Button>
              <Button onClick={exportJSON} variant="outline" className="gap-2 rounded-xl">
                <FileJson size={16} /> JSON
              </Button>
              <Button onClick={exportTXT} variant="outline" className="gap-2 rounded-xl">
                <FileText size={16} /> TXT
              </Button>
            </CardContent>
          </Card>

          {/* Lista */}
          <Card className="border-2 border-border/60 bg-card/70 backdrop-blur">
            <CardHeader>
              <CardTitle className="font-heading text-xl">Cadastros</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <p className="py-8 text-center text-muted-foreground">Carregando...</p>
              ) : filtered.length === 0 ? (
                <p className="py-8 text-center text-muted-foreground">
                  Nenhum cadastro encontrado.
                </p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead className="border-b border-border/60 text-muted-foreground">
                      <tr>
                        <th className="pb-3 pr-4 font-semibold">Protocolo</th>
                        <th className="pb-3 pr-4 font-semibold">Nome</th>
                        <th className="pb-3 pr-4 font-semibold">Cidade</th>
                        <th className="pb-3 pr-4 font-semibold">Contato</th>
                        <th className="pb-3 pr-4 font-semibold">Cartão</th>
                        <th className="pb-3 pr-4 font-semibold">Status</th>
                        <th className="pb-3 pr-4 font-semibold">Data</th>
                        <th className="pb-3 font-semibold">Ações</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filtered.map((r) => (
                        <tr key={r.id} className="border-b border-border/40 last:border-0 align-top">
                          <td className="py-3 pr-4 font-mono text-xs">{r.protocolo}</td>
                          <td className="py-3 pr-4">
                            <div className="font-medium">{r.nome_pcd ?? "—"}</div>
                            {r.nome_responsavel && (
                              <div className="text-xs text-muted-foreground">
                                resp. {r.nome_responsavel}
                              </div>
                            )}
                            {r.is_urgente && (
                              <Badge className="mt-1 bg-tea-red text-white">Urgente</Badge>
                            )}
                          </td>
                          <td className="py-3 pr-4">
                            {r.cidade ?? "—"}
                            {r.bairro && (
                              <div className="text-xs text-muted-foreground">{r.bairro}</div>
                            )}
                          </td>
                          <td className="py-3 pr-4 text-muted-foreground">
                            <div>{r.email ?? "—"}</div>
                            <div className="text-xs">{r.whatsapp ?? "—"}</div>
                          </td>
                          <td className="py-3 pr-4">
                            {r.wants_card ? (
                              <Badge className="bg-tea-green text-white">Sim</Badge>
                            ) : (
                              <Badge variant="outline">Não</Badge>
                            )}
                          </td>
                          <td className="py-3 pr-4">
                            <select
                              value={r.status}
                              onChange={(e) => updateStatus(r.id, e.target.value)}
                              className="rounded-md border border-border bg-background/70 px-2 py-1 text-xs"
                            >
                              {STATUSES.filter((s) => s !== "todos").map((s) => (
                                <option key={s} value={s}>
                                  {s.replace(/_/g, " ")}
                                </option>
                              ))}
                            </select>
                          </td>
                          <td className="py-3 pr-4 text-muted-foreground">
                            {new Date(r.created_at).toLocaleDateString("pt-BR")}
                          </td>
                          <td className="py-3 flex gap-2">
                            <a
                              href={`/cartao/${r.share_token}`}
                              target="_blank"
                              rel="noreferrer"
                              className="text-tea-blue hover:underline text-xs"
                            >
                              Ver
                            </a>
                            {isSuperAdmin && (
                              <button
                                onClick={() => remove(r.id)}
                                className="text-tea-red hover:underline text-xs"
                              >
                                Excluir
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </main>
      <Footer />
    </div>
  );
};

export default Respostas;
