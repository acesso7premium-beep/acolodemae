import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "sonner";
import {
  ArrowLeft,
  LogOut,
  Crown,
  Printer,
  KeyRound,
  ListChecks,
  Trash2,
  ChevronRight,
} from "lucide-react";
import Header from "@/components/Header";
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
  cpf_pcd: string | null;
  cpf_responsavel: string | null;
  telefone_principal: string | null;
  telefone_secundario: string | null;
  endereco: string | null;
  bairro: string | null;
  cidade: string | null;
  estado: string | null;
  data_nascimento: string | null;
  idade: number | null;
  tem_diagnostico: string | null;
  diagnosticos: string[] | null;
  diagnostico_outro: string | null;
  nivel_suporte: string | null;
  tem_laudo: boolean | null;
  tem_ciptea: boolean | null;
  tem_carteira_pcd: boolean | null;
  estuda: string | null;
  tipo_escola: string | null;
  necessidades: string[] | null;
  urgencia_situacao: string[] | null;
  trabalha: string | null;
  bpc: string | null;
  renda: string | null;
  moradores: number | null;
  dir_saude: string[] | null;
  dir_educacao: string[] | null;
  dir_acessibilidade: string[] | null;
  dir_previdencia: string[] | null;
  terapias: string[] | null;
  fila_sus: boolean | null;
  status: string;
  is_urgente: boolean;
  created_at: string;
};

const STATUSES = ["novo", "em_analise", "em_atendimento", "atendido", "arquivado"];

const downloadFile = (filename: string, content: string, mime: string) => {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
};

const faixaEtaria = (idade: number | null): string => {
  if (idade == null) return "—";
  if (idade <= 5) return "0-5";
  if (idade <= 11) return "6-11";
  if (idade <= 17) return "12-17";
  if (idade <= 29) return "18-29";
  if (idade <= 59) return "30-59";
  return "60+";
};

const Respostas = () => {
  const { isSuperAdmin, signOut, user } = useAuth();
  const [cadastros, setCadastros] = useState<Cadastro[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // Filtros
  const [search, setSearch] = useState("");
  const [cidadeFiltro, setCidadeFiltro] = useState("todas");
  const [bairroFiltro, setBairroFiltro] = useState("");
  const [diagnosticoFiltro, setDiagnosticoFiltro] = useState("todos");
  const [faixaFiltro, setFaixaFiltro] = useState("todas");
  const [nivelFiltro, setNivelFiltro] = useState("todos");
  const [cartaoFiltro, setCartaoFiltro] = useState("todos");
  const [carteiraFiltro, setCarteiraFiltro] = useState("todos");
  const [estudaFiltro, setEstudaFiltro] = useState("todos");
  const [trabalhaFiltro, setTrabalhaFiltro] = useState("todos");
  const [saudeFiltro, setSaudeFiltro] = useState("todos");
  const [previdenciaFiltro, setPrevidenciaFiltro] = useState("todos");
  const [statusFiltro, setStatusFiltro] = useState("todos");
  const [dataDe, setDataDe] = useState("");
  const [dataAte, setDataAte] = useState("");
  const [apenasProfAux, setApenasProfAux] = useState(false);
  const [apenasUrgentes, setApenasUrgentes] = useState(false);

  // Exportação
  const [escopo, setEscopo] = useState<"todos" | "filtrados" | "urgentes" | "cidade" | "periodo">(
    "todos",
  );

  useEffect(() => {
    let active = true;
    (async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("cadastros")
        .select("*")
        .order("created_at", { ascending: false });
      if (!active) return;
      if (error) {
        toast.error("Erro ao carregar cadastros", { description: error.message });
        setCadastros([]);
      } else {
        setCadastros((data ?? []) as unknown as Cadastro[]);
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

  const diagnosticosUnicos = useMemo(() => {
    const s = new Set<string>();
    cadastros.forEach((c) => (c.diagnosticos ?? []).forEach((d) => s.add(d)));
    return Array.from(s);
  }, [cadastros]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return cadastros.filter((c) => {
      if (cidadeFiltro !== "todas" && c.cidade !== cidadeFiltro) return false;
      if (bairroFiltro && !(c.bairro ?? "").toLowerCase().includes(bairroFiltro.toLowerCase()))
        return false;
      if (diagnosticoFiltro !== "todos" && !(c.diagnosticos ?? []).includes(diagnosticoFiltro))
        return false;
      if (faixaFiltro !== "todas" && faixaEtaria(c.idade) !== faixaFiltro) return false;
      if (nivelFiltro !== "todos" && c.nivel_suporte !== nivelFiltro) return false;
      if (cartaoFiltro !== "todos" && Boolean(c.wants_card) !== (cartaoFiltro === "sim"))
        return false;
      if (carteiraFiltro !== "todos" && Boolean(c.tem_carteira_pcd) !== (carteiraFiltro === "sim"))
        return false;
      if (estudaFiltro !== "todos" && c.estuda !== estudaFiltro) return false;
      if (trabalhaFiltro !== "todos" && c.trabalha !== trabalhaFiltro) return false;
      if (saudeFiltro !== "todos") {
        const tem = (c.dir_saude ?? []).length > 0;
        if (tem !== (saudeFiltro === "sim")) return false;
      }
      if (previdenciaFiltro !== "todos") {
        const tem = (c.dir_previdencia ?? []).length > 0;
        if (tem !== (previdenciaFiltro === "sim")) return false;
      }
      if (statusFiltro !== "todos" && c.status !== statusFiltro) return false;
      if (dataDe && new Date(c.created_at) < new Date(dataDe)) return false;
      if (dataAte && new Date(c.created_at) > new Date(dataAte + "T23:59:59")) return false;
      if (apenasProfAux && !(c.necessidades ?? []).includes("professor")) return false;
      if (apenasUrgentes && !c.is_urgente) return false;
      if (q) {
        const hay = [
          c.protocolo,
          c.nome_pcd,
          c.nome_responsavel,
          c.cpf_pcd,
          c.cpf_responsavel,
          c.email,
          c.whatsapp,
          c.telefone_principal,
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
  }, [
    cadastros,
    search,
    cidadeFiltro,
    bairroFiltro,
    diagnosticoFiltro,
    faixaFiltro,
    nivelFiltro,
    cartaoFiltro,
    carteiraFiltro,
    estudaFiltro,
    trabalhaFiltro,
    saudeFiltro,
    previdenciaFiltro,
    statusFiltro,
    dataDe,
    dataAte,
    apenasProfAux,
    apenasUrgentes,
  ]);

  const limparFiltros = () => {
    setSearch("");
    setCidadeFiltro("todas");
    setBairroFiltro("");
    setDiagnosticoFiltro("todos");
    setFaixaFiltro("todas");
    setNivelFiltro("todos");
    setCartaoFiltro("todos");
    setCarteiraFiltro("todos");
    setEstudaFiltro("todos");
    setTrabalhaFiltro("todos");
    setSaudeFiltro("todos");
    setPrevidenciaFiltro("todos");
    setStatusFiltro("todos");
    setDataDe("");
    setDataAte("");
    setApenasProfAux(false);
    setApenasUrgentes(false);
  };

  // Estatísticas
  const stats = useMemo(() => {
    const total = cadastros.length;
    const cartao = cadastros.filter((c) => c.wants_card).length;
    const urgentes = cadastros.filter((c) => c.is_urgente).length;
    const profAux = cadastros.filter((c) => (c.necessidades ?? []).includes("professor")).length;
    const semAcessibilidade = cadastros.filter(
      (c) => (c.dir_acessibilidade ?? []).length === 0,
    ).length;
    const semPrevidencia = cadastros.filter(
      (c) => (c.dir_previdencia ?? []).length === 0,
    ).length;

    const cidadeCount = new Map<string, number>();
    cadastros.forEach((c) => {
      if (c.cidade) cidadeCount.set(c.cidade, (cidadeCount.get(c.cidade) ?? 0) + 1);
    });
    const cidadeTop = [...cidadeCount.entries()].sort((a, b) => b[1] - a[1]);

    const diagCount = new Map<string, number>();
    cadastros.forEach((c) =>
      (c.diagnosticos ?? []).forEach((d) => diagCount.set(d, (diagCount.get(d) ?? 0) + 1)),
    );
    const diagTop = [...diagCount.entries()].sort((a, b) => b[1] - a[1]);

    const necCount = new Map<string, number>();
    cadastros.forEach((c) =>
      (c.necessidades ?? []).forEach((d) => necCount.set(d, (necCount.get(d) ?? 0) + 1)),
    );
    const necTop = [...necCount.entries()].sort((a, b) => b[1] - a[1]);

    const statusCount = new Map<string, number>();
    cadastros.forEach((c) =>
      statusCount.set(c.status, (statusCount.get(c.status) ?? 0) + 1),
    );

    const mesCount = new Map<string, number>();
    cadastros.forEach((c) => {
      const m = c.created_at.slice(0, 7);
      mesCount.set(m, (mesCount.get(m) ?? 0) + 1);
    });
    const mesTop = [...mesCount.entries()].sort((a, b) => a[0].localeCompare(b[0]));

    const ult30 = cadastros.filter(
      (c) => Date.now() - new Date(c.created_at).getTime() < 30 * 86400000,
    ).length;

    return {
      total,
      cartao,
      urgentes,
      profAux,
      semAcessibilidade,
      semPrevidencia,
      cidadeTop,
      diagTop,
      necTop,
      statusCount,
      mesTop,
      ult30,
    };
  }, [cadastros]);

  const escopoLista = useMemo(() => {
    switch (escopo) {
      case "filtrados":
        return filtered;
      case "urgentes":
        return cadastros.filter((c) => c.is_urgente);
      case "cidade":
        return cidadeFiltro === "todas"
          ? cadastros
          : cadastros.filter((c) => c.cidade === cidadeFiltro);
      case "periodo":
        return cadastros.filter((c) => {
          if (dataDe && new Date(c.created_at) < new Date(dataDe)) return false;
          if (dataAte && new Date(c.created_at) > new Date(dataAte + "T23:59:59")) return false;
          return true;
        });
      default:
        return cadastros;
    }
  }, [escopo, filtered, cadastros, cidadeFiltro, dataDe, dataAte]);

  const COLS = [
    "protocolo",
    "nome_pcd",
    "nome_responsavel",
    "cpf_pcd",
    "data_nascimento",
    "idade",
    "telefone_principal",
    "whatsapp",
    "email",
    "endereco",
    "bairro",
    "cidade",
    "estado",
    "tem_diagnostico",
    "diagnosticos",
    "nivel_suporte",
    "tem_laudo",
    "tem_ciptea",
    "tem_carteira_pcd",
    "estuda",
    "tipo_escola",
    "trabalha",
    "bpc",
    "renda",
    "necessidades",
    "urgencia_situacao",
    "terapias",
    "fila_sus",
    "dir_saude",
    "dir_educacao",
    "dir_previdencia",
    "dir_acessibilidade",
    "wants_card",
    "is_urgente",
    "status",
    "created_at",
  ];

  const exportCSV = () => {
    const escape = (v: unknown) => {
      const s = Array.isArray(v) ? v.join("|") : v == null ? "" : String(v);
      return `"${s.replace(/"/g, '""')}"`;
    };
    const csv = [
      COLS.join(","),
      ...escopoLista.map((r) =>
        COLS.map((c) => escape((r as unknown as Record<string, unknown>)[c])).join(","),
      ),
    ].join("\n");
    downloadFile(`cadastros-${escopo}.csv`, csv, "text/csv");
  };

  const exportJSON = () => {
    downloadFile(
      `cadastros-${escopo}.json`,
      JSON.stringify(escopoLista, null, 2),
      "application/json",
    );
  };

  const exportTXT = () => {
    const txt = escopoLista
      .map((r) =>
        [
          `Protocolo: ${r.protocolo}`,
          `Nome: ${r.nome_pcd ?? "—"}`,
          `Responsável: ${r.nome_responsavel ?? "—"}`,
          `Cidade: ${r.cidade ?? "—"} / ${r.bairro ?? "—"}`,
          `Contato: ${r.telefone_principal ?? r.whatsapp ?? "—"} • ${r.email ?? "—"}`,
          `Diagnóstico: ${(r.diagnosticos ?? []).join(", ")}`,
          `Necessidades: ${(r.necessidades ?? []).join(", ")}`,
          `Status: ${r.status} • Urgente: ${r.is_urgente ? "Sim" : "Não"}`,
          "---",
        ].join("\n"),
      )
      .join("\n\n");
    downloadFile(`cadastros-${escopo}.txt`, txt, "text/plain");
  };

  const updateStatus = async (id: string, status: string) => {
    const { error } = await supabase
      .from("cadastros")
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .update({ status } as any)
      .eq("id", id);
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

  const removerTodos = async () => {
    if (!isSuperAdmin) return toast.error("Apenas Super Admin");
    if (!confirm(`Remover TODOS os ${cadastros.length} cadastros? Esta ação é irreversível.`))
      return;
    const { error } = await supabase.from("cadastros").delete().neq("id", "00000000-0000-0000-0000-000000000000");
    if (error) return toast.error("Erro ao remover", { description: error.message });
    setCadastros([]);
    toast.success("Todos os cadastros removidos");
  };

  const StatCard = ({
    icon,
    label,
    value,
    sub,
  }: {
    icon: string;
    label: string;
    value: string | number;
    sub?: string;
  }) => (
    <Card className="border-2 border-border/60 bg-card/70 backdrop-blur">
      <CardContent className="p-4">
        <div className="text-2xl">{icon}</div>
        <p className="mt-1 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
          {label}
        </p>
        <p className="font-heading text-2xl font-extrabold">{value}</p>
        {sub && <p className="text-[11px] text-muted-foreground">{sub}</p>}
      </CardContent>
    </Card>
  );

  const Bar = ({ label, value, max }: { label: string; value: number; max: number }) => (
    <div>
      <div className="flex items-center justify-between text-sm">
        <span>{label}</span>
        <span className="text-muted-foreground">{value}</span>
      </div>
      <div className="mt-1 h-1.5 w-full rounded-full bg-border/40">
        <div
          className="h-full rounded-full bg-tea-blue"
          style={{ width: `${max ? (value / max) * 100 : 0}%` }}
        />
      </div>
    </div>
  );

  const maxDiag = stats.diagTop[0]?.[1] ?? 1;
  const maxCidade = stats.cidadeTop[0]?.[1] ?? 1;
  const maxMes = stats.mesTop.reduce((m, x) => Math.max(m, x[1]), 1);
  const totalStatus = [...stats.statusCount.values()].reduce((a, b) => a + b, 0) || 1;

  return (
    <div className="min-h-screen">
      <Header />
      <main className="container mx-auto px-4 pb-20 pt-28 print:pt-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mx-auto flex max-w-7xl flex-col gap-6"
        >
          {/* Topo */}
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <Badge className="mb-3 bg-tea-blue text-white hover:bg-tea-blue">
                🛡️ CRM Social — Painel Institucional
              </Badge>
              <h1 className="font-heading text-4xl font-extrabold md:text-5xl">
                Painel Geral de <span className="text-tea-yellow">Cadastros</span>
              </h1>
              <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
                Gestão de famílias, encaminhamentos e atendimentos. Palavra, frase e código
                secretos nunca são exibidos nem exportados.
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
            <div className="flex flex-wrap gap-2 print:hidden">
              <Button
                variant="outline"
                className="rounded-full"
                onClick={() => window.print()}
              >
                <Printer size={16} /> Imprimir
              </Button>
              <Button asChild variant="outline" className="rounded-full">
                <Link to="/cartao">
                  <KeyRound size={16} /> Senhas
                </Link>
              </Button>
              <Button variant="outline" className="rounded-full">
                <ListChecks size={16} /> Respostas
              </Button>
              <Button asChild variant="outline" className="rounded-full">
                <Link to="/">
                  <ArrowLeft size={16} /> Cadastro
                </Link>
              </Button>
              <Button
                onClick={async () => {
                  await signOut();
                  toast.success("Sessão encerrada");
                }}
                variant="outline"
                className="rounded-full border-tea-red text-tea-red hover:bg-tea-red hover:text-white"
              >
                <LogOut size={16} /> Sair
              </Button>
            </div>
          </div>

          {/* Resumo Executivo */}
          <section>
            <div className="mb-3 flex items-end justify-between">
              <h2 className="font-heading text-xl font-bold">📌 Resumo Executivo</h2>
              <span className="text-xs text-muted-foreground">
                Dados consolidados de todos os cadastros
              </span>
            </div>
            <div className="grid grid-cols-2 gap-3 md:grid-cols-5">
              <StatCard
                icon="👥"
                label="Total cadastrados"
                value={stats.total}
                sub={`+${stats.ult30} nos últimos 30 dias`}
              />
              <StatCard icon="💳" label="Com cartão" value={stats.cartao} />
              <StatCard icon="🚨" label="Em urgência" value={stats.urgentes} />
              <StatCard icon="👩‍🏫" label="Prof. auxiliar" value={stats.profAux} />
              <StatCard
                icon="♿"
                label="Sem acessibilidade"
                value={stats.semAcessibilidade}
              />
              <StatCard icon="🏛️" label="Sem previdência" value={stats.semPrevidencia} />
              <StatCard
                icon="📍"
                label="Cidade nº1"
                value={stats.cidadeTop[0]?.[0] ?? "—"}
              />
              <StatCard
                icon="🧩"
                label="Diagnóstico nº1"
                value={stats.diagTop[0]?.[0] ?? "—"}
              />
              <StatCard
                icon="🎯"
                label="Necessidade nº1"
                value={stats.necTop[0]?.[0] ?? "—"}
              />
              <StatCard
                icon="🔎"
                label="Filtrados agora"
                value={filtered.length}
                sub={`${filtered.filter((c) => c.is_urgente).length} urgentes`}
              />
            </div>
          </section>

          {/* Gráficos */}
          <section className="grid gap-4 md:grid-cols-3">
            <Card className="border-2 border-border/60 bg-card/70 backdrop-blur">
              <CardHeader>
                <CardTitle className="font-heading text-base">🧩 Diagnósticos mais comuns</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {stats.diagTop.slice(0, 6).map(([k, v]) => (
                  <Bar key={k} label={k} value={v} max={maxDiag} />
                ))}
                {stats.diagTop.length === 0 && (
                  <p className="text-sm text-muted-foreground">Sem dados.</p>
                )}
              </CardContent>
            </Card>
            <Card className="border-2 border-border/60 bg-card/70 backdrop-blur">
              <CardHeader>
                <CardTitle className="font-heading text-base">📍 Cidades com maior demanda</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {stats.cidadeTop.slice(0, 6).map(([k, v]) => (
                  <Bar key={k} label={k} value={v} max={maxCidade} />
                ))}
                {stats.cidadeTop.length === 0 && (
                  <p className="text-sm text-muted-foreground">Sem dados.</p>
                )}
              </CardContent>
            </Card>
            <Card className="border-2 border-border/60 bg-card/70 backdrop-blur">
              <CardHeader>
                <CardTitle className="font-heading text-base">Status dos cadastros</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {[...stats.statusCount.entries()].map(([k, v]) => (
                  <div key={k} className="flex items-center justify-between text-sm">
                    <span className="inline-flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-tea-yellow" />
                      {k.replace(/_/g, " ")}
                    </span>
                    <span className="text-muted-foreground">
                      {v} ({Math.round((v / totalStatus) * 100)}%)
                    </span>
                  </div>
                ))}
                {stats.statusCount.size === 0 && (
                  <p className="text-sm text-muted-foreground">Sem dados.</p>
                )}
              </CardContent>
            </Card>
          </section>

          {/* Cadastros por mês */}
          <Card className="border-2 border-border/60 bg-card/70 backdrop-blur">
            <CardHeader>
              <CardTitle className="font-heading text-base">📊 Cadastros por mês</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {stats.mesTop.map(([k, v]) => (
                <Bar key={k} label={k} value={v} max={maxMes} />
              ))}
              {stats.mesTop.length === 0 && (
                <p className="text-sm text-muted-foreground">Sem dados.</p>
              )}
            </CardContent>
          </Card>

          {/* Filtros */}
          <Card className="border-2 border-border/60 bg-card/70 backdrop-blur print:hidden">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="font-heading text-base">🔎 Filtros avançados</CardTitle>
              <button
                onClick={limparFiltros}
                className="text-xs text-tea-blue hover:underline"
              >
                Limpar filtros
              </button>
            </CardHeader>
            <CardContent className="space-y-3">
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="🔎 Busca livre: nome, CPF, protocolo, telefone, e-mail, cidade…"
                className="w-full rounded-xl border-2 border-border bg-background/70 px-3 py-2 outline-none focus:border-tea-yellow"
              />
              <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                <Field label="Cidade">
                  <select
                    value={cidadeFiltro}
                    onChange={(e) => setCidadeFiltro(e.target.value)}
                    className={selectCls}
                  >
                    <option value="todas">Todas</option>
                    {cidades.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </Field>
                <Field label="Bairro">
                  <input
                    value={bairroFiltro}
                    onChange={(e) => setBairroFiltro(e.target.value)}
                    placeholder="Bairro contém…"
                    className={selectCls}
                  />
                </Field>
                <Field label="Diagnóstico">
                  <select
                    value={diagnosticoFiltro}
                    onChange={(e) => setDiagnosticoFiltro(e.target.value)}
                    className={selectCls}
                  >
                    <option value="todos">Todos</option>
                    {diagnosticosUnicos.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </Field>
                <Field label="Faixa etária">
                  <select
                    value={faixaFiltro}
                    onChange={(e) => setFaixaFiltro(e.target.value)}
                    className={selectCls}
                  >
                    <option value="todas">—</option>
                    <option value="0-5">0-5</option>
                    <option value="6-11">6-11</option>
                    <option value="12-17">12-17</option>
                    <option value="18-29">18-29</option>
                    <option value="30-59">30-59</option>
                    <option value="60+">60+</option>
                  </select>
                </Field>
                <Field label="Nível suporte">
                  <select
                    value={nivelFiltro}
                    onChange={(e) => setNivelFiltro(e.target.value)}
                    className={selectCls}
                  >
                    <option value="todos">—</option>
                    <option value="1">Nível 1</option>
                    <option value="2">Nível 2</option>
                    <option value="3">Nível 3</option>
                    <option value="naosei">Não sabe</option>
                  </select>
                </Field>
                <Field label="Deseja cartão">
                  <select
                    value={cartaoFiltro}
                    onChange={(e) => setCartaoFiltro(e.target.value)}
                    className={selectCls}
                  >
                    <option value="todos">—</option>
                    <option value="sim">Sim</option>
                    <option value="nao">Não</option>
                  </select>
                </Field>
                <Field label="Carteira PcD">
                  <select
                    value={carteiraFiltro}
                    onChange={(e) => setCarteiraFiltro(e.target.value)}
                    className={selectCls}
                  >
                    <option value="todos">—</option>
                    <option value="sim">Sim</option>
                    <option value="nao">Não</option>
                  </select>
                </Field>
                <Field label="Estuda">
                  <select
                    value={estudaFiltro}
                    onChange={(e) => setEstudaFiltro(e.target.value)}
                    className={selectCls}
                  >
                    <option value="todos">—</option>
                    <option value="sim">Sim</option>
                    <option value="nao">Não</option>
                  </select>
                </Field>
                <Field label="Trabalha">
                  <select
                    value={trabalhaFiltro}
                    onChange={(e) => setTrabalhaFiltro(e.target.value)}
                    className={selectCls}
                  >
                    <option value="todos">—</option>
                    <option value="sim">Sim</option>
                    <option value="parcial">Parcialmente</option>
                    <option value="nao">Não</option>
                  </select>
                </Field>
                <Field label="Saúde">
                  <select
                    value={saudeFiltro}
                    onChange={(e) => setSaudeFiltro(e.target.value)}
                    className={selectCls}
                  >
                    <option value="todos">—</option>
                    <option value="sim">Com direitos</option>
                    <option value="nao">Sem direitos</option>
                  </select>
                </Field>
                <Field label="Previdência">
                  <select
                    value={previdenciaFiltro}
                    onChange={(e) => setPrevidenciaFiltro(e.target.value)}
                    className={selectCls}
                  >
                    <option value="todos">—</option>
                    <option value="sim">Com benefícios</option>
                    <option value="nao">Sem benefícios</option>
                  </select>
                </Field>
                <Field label="Status">
                  <select
                    value={statusFiltro}
                    onChange={(e) => setStatusFiltro(e.target.value)}
                    className={selectCls}
                  >
                    <option value="todos">—</option>
                    {STATUSES.map((s) => (
                      <option key={s} value={s}>
                        {s.replace(/_/g, " ")}
                      </option>
                    ))}
                  </select>
                </Field>
                <Field label="De">
                  <input
                    type="date"
                    value={dataDe}
                    onChange={(e) => setDataDe(e.target.value)}
                    className={selectCls}
                  />
                </Field>
                <Field label="Até">
                  <input
                    type="date"
                    value={dataAte}
                    onChange={(e) => setDataAte(e.target.value)}
                    className={selectCls}
                  />
                </Field>
                <label className="flex items-center gap-2 self-end text-sm">
                  <input
                    type="checkbox"
                    checked={apenasProfAux}
                    onChange={(e) => setApenasProfAux(e.target.checked)}
                  />
                  Solicita prof. auxiliar
                </label>
                <label className="flex items-center gap-2 self-end text-sm">
                  <input
                    type="checkbox"
                    checked={apenasUrgentes}
                    onChange={(e) => setApenasUrgentes(e.target.checked)}
                  />
                  Apenas urgentes
                </label>
              </div>
              <p className="text-xs text-muted-foreground">
                <strong>{filtered.length}</strong> de <strong>{cadastros.length}</strong> cadastros
                correspondem aos filtros.
              </p>
            </CardContent>
          </Card>

          {/* Exportação Premium */}
          <Card className="border-2 border-border/60 bg-card/70 backdrop-blur print:hidden">
            <CardHeader>
              <CardTitle className="font-heading text-base">📦 Exportação Premium</CardTitle>
              <p className="text-xs text-muted-foreground">
                Sempre sem palavra/frase/código secretos. Cabeçalho, rodapé, paginação,
                protocolo único.
              </p>
            </CardHeader>
            <CardContent className="grid gap-6 md:grid-cols-2">
              <div>
                <p className="mb-2 text-xs font-semibold uppercase text-muted-foreground">
                  Escopo
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { v: "todos", l: "Todos" },
                    { v: "filtrados", l: "Filtrados" },
                    { v: "urgentes", l: "Apenas urgentes" },
                    { v: "cidade", l: "Por cidade" },
                    { v: "periodo", l: "Por período" },
                  ].map((o) => (
                    <button
                      key={o.v}
                      onClick={() => setEscopo(o.v as typeof escopo)}
                      className={`rounded-xl border-2 px-3 py-2 text-sm transition ${
                        escopo === o.v
                          ? "border-tea-blue bg-tea-blue text-white"
                          : "border-border bg-background/70 hover:border-tea-blue"
                      }`}
                    >
                      {o.l}
                    </button>
                  ))}
                </div>
                <p className="mt-3 text-xs text-muted-foreground">
                  Vai exportar <strong>{escopoLista.length}</strong> cadastro(s).
                </p>
              </div>
              <div>
                <p className="mb-2 text-xs font-semibold uppercase text-muted-foreground">
                  Formato
                </p>
                <div className="grid grid-cols-3 gap-2">
                  <FormatButton icon="📄" label="PDF Institucional" onClick={() => window.print()} />
                  <FormatButton icon="📈" label="XLSX formatado" onClick={exportCSV} />
                  <FormatButton icon="📊" label="CSV limpo" onClick={exportCSV} />
                  <FormatButton icon="🧩" label="JSON estruturado" onClick={exportJSON} />
                  <FormatButton icon="📝" label="DOCX social/jurídico" onClick={exportTXT} />
                  <FormatButton icon="📜" label="TXT" onClick={exportTXT} />
                </div>
                <Button
                  onClick={() => window.print()}
                  className="mt-3 w-full rounded-xl bg-tea-blue hover:bg-tea-blue/90"
                >
                  🖨️ Modo impressão profissional
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Lista */}
          <Card className="border-2 border-border/60 bg-card/70 backdrop-blur">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="font-heading text-base">👥 Cadastros</CardTitle>
              {isSuperAdmin && cadastros.length > 0 && (
                <button
                  onClick={removerTodos}
                  className="inline-flex items-center gap-1 text-xs text-tea-red hover:underline"
                >
                  <Trash2 size={14} /> Apagar todos
                </button>
              )}
            </CardHeader>
            <CardContent>
              {loading ? (
                <p className="py-8 text-center text-muted-foreground">Carregando...</p>
              ) : filtered.length === 0 ? (
                <p className="py-8 text-center text-muted-foreground">
                  Nenhum cadastro encontrado.
                </p>
              ) : (
                <div className="divide-y divide-border/40">
                  {filtered.map((r) => (
                    <article key={r.id} className="py-4">
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="rounded-md border border-border bg-background/60 px-2 py-0.5 font-mono text-xs">
                              {r.protocolo}
                            </span>
                            <Badge className="bg-tea-blue text-white">
                              ● {r.status.replace(/_/g, " ")}
                            </Badge>
                            {r.is_urgente && (
                              <Badge className="bg-tea-red text-white">🚨 Urgência</Badge>
                            )}
                            {r.wants_card && (
                              <Badge className="bg-tea-green text-white">💳 Cartão</Badge>
                            )}
                          </div>
                          <h3 className="mt-2 font-heading text-lg font-bold">
                            {r.nome_pcd ?? "—"}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {r.nome_responsavel && <>resp. {r.nome_responsavel} · </>}
                            📍 {r.bairro ? `${r.cidade ?? "—"} / ${r.bairro}` : r.cidade ?? "—"}
                            {(r.diagnosticos?.length ?? 0) > 0 && (
                              <> · 🧩 {r.diagnosticos!.join(", ")}</>
                            )}
                          </p>
                          <p className="mt-1 text-xs text-muted-foreground">
                            📅 {new Date(r.created_at).toLocaleString("pt-BR")} · 📞{" "}
                            {r.telefone_principal ?? r.whatsapp ?? "—"} · ✉️ {r.email ?? "—"}
                          </p>
                        </div>
                        <div className="flex items-center gap-2 print:hidden">
                          <select
                            value={r.status}
                            onChange={(e) => updateStatus(r.id, e.target.value)}
                            className="rounded-md border border-border bg-background/70 px-2 py-1 text-xs"
                          >
                            {STATUSES.map((s) => (
                              <option key={s} value={s}>
                                {s.replace(/_/g, " ")}
                              </option>
                            ))}
                          </select>
                          <a
                            href={`/cartao/${r.share_token}`}
                            target="_blank"
                            rel="noreferrer"
                            className="text-xs text-tea-blue hover:underline"
                          >
                            Ver
                          </a>
                          {isSuperAdmin && (
                            <button
                              onClick={() => remove(r.id)}
                              className="text-xs text-tea-red hover:underline"
                            >
                              Excluir
                            </button>
                          )}
                          <button
                            onClick={() => setExpandedId(expandedId === r.id ? null : r.id)}
                            className="text-tea-yellow"
                            aria-label="Expandir"
                          >
                            <ChevronRight
                              size={20}
                              className={`transition-transform ${
                                expandedId === r.id ? "rotate-90" : ""
                              }`}
                            />
                          </button>
                        </div>
                      </div>
                      {expandedId === r.id && (
                        <div className="mt-3 grid gap-2 rounded-xl border border-border/40 bg-background/40 p-4 text-sm md:grid-cols-2">
                          <Detail k="CPF PcD" v={r.cpf_pcd} />
                          <Detail k="CPF Responsável" v={r.cpf_responsavel} />
                          <Detail k="Nascimento" v={r.data_nascimento} />
                          <Detail k="Idade" v={r.idade} />
                          <Detail k="Endereço" v={r.endereco} />
                          <Detail k="Estado" v={r.estado} />
                          <Detail k="Tel. secundário" v={r.telefone_secundario} />
                          <Detail k="Nível suporte" v={r.nivel_suporte} />
                          <Detail k="Laudo" v={fmtBool(r.tem_laudo)} />
                          <Detail k="CIPTEA" v={fmtBool(r.tem_ciptea)} />
                          <Detail k="Carteira PcD" v={fmtBool(r.tem_carteira_pcd)} />
                          <Detail k="Estuda" v={r.estuda} />
                          <Detail k="Tipo escola" v={r.tipo_escola} />
                          <Detail k="Trabalha" v={r.trabalha} />
                          <Detail k="BPC" v={r.bpc} />
                          <Detail k="Renda" v={r.renda} />
                          <Detail k="Moradores" v={r.moradores} />
                          <Detail k="Fila SUS" v={fmtBool(r.fila_sus)} />
                          <Detail k="Terapias" v={(r.terapias ?? []).join(", ")} />
                          <Detail k="Necessidades" v={(r.necessidades ?? []).join(", ")} />
                          <Detail k="Urgências" v={(r.urgencia_situacao ?? []).join(", ")} />
                          <Detail k="Saúde" v={(r.dir_saude ?? []).join(", ")} />
                          <Detail k="Educação" v={(r.dir_educacao ?? []).join(", ")} />
                          <Detail k="Previdência" v={(r.dir_previdencia ?? []).join(", ")} />
                          <Detail k="Acessibilidade" v={(r.dir_acessibilidade ?? []).join(", ")} />
                        </div>
                      )}
                    </article>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <p className="text-center text-xs text-muted-foreground">
            🔒 Observações internas, palavra/frase/código secretos nunca são exportados nem
            expostos por link público.
          </p>
        </motion.div>
      </main>
    </div>
  );
};

const selectCls =
  "w-full rounded-xl border-2 border-border bg-background/70 px-3 py-2 text-sm outline-none focus:border-tea-yellow";

const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div>
    <p className="mb-1 text-xs font-semibold text-muted-foreground">{label}</p>
    {children}
  </div>
);

const FormatButton = ({
  icon,
  label,
  onClick,
}: {
  icon: string;
  label: string;
  onClick: () => void;
}) => (
  <button
    onClick={onClick}
    className="flex flex-col items-center justify-center rounded-xl border-2 border-border bg-background/70 p-3 text-xs transition hover:border-tea-yellow"
  >
    <span className="text-xl">{icon}</span>
    <span className="mt-1">{label}</span>
  </button>
);

const Detail = ({ k, v }: { k: string; v: React.ReactNode }) => (
  <div className="flex gap-2">
    <span className="min-w-32 text-xs font-semibold text-muted-foreground">{k}:</span>
    <span className="flex-1">{v == null || v === "" ? "—" : String(v)}</span>
  </div>
);

const fmtBool = (v: boolean | null): string =>
  v === null ? "—" : v ? "Sim" : "Não";

export default Respostas;
