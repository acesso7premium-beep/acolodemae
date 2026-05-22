import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "sonner";
import {
  ArrowLeft,
  Download,
  FileArchive,
  FileJson,
  FileSpreadsheet,
  FileText,
  FileType,
  Presentation,
  Shield,
  Cloud,
  CheckCircle2,
  AlertCircle,
  Clock,
  Database,
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";

type Resposta = {
  id: string;
  nome: string;
  email: string;
  whatsapp: string;
  wantsCard: boolean;
  diagnostico: string;
  submittedAt: string;
};

const respostas: Resposta[] = [
  {
    id: "r-demo-001",
    nome: "Maria Silva (exemplo)",
    email: "maria@email.com",
    whatsapp: "(11) 91234-5678",
    wantsCard: true,
    diagnostico: "TEA Nível 2",
    submittedAt: "2026-05-20T14:30:00Z",
  },
];

// Normaliza respostas reais salvas pelo quiz em /cartao
const loadRespostas = (): Resposta[] => {
  try {
    const raw = localStorage.getItem("colo-de-mae-respostas");
    if (!raw) return respostas;
    const arr = JSON.parse(raw) as Array<Record<string, unknown>>;
    if (!Array.isArray(arr) || arr.length === 0) return respostas;
    return arr.map((r, i) => {
      const answers = (r.answers as Record<string, unknown>) ?? {};
      const contact = (r.contact as Record<string, unknown>) ?? {};
      const diags = answers.quaisDiagnosticos;
      return {
        id: (r.id as string) ?? `r-${i}`,
        nome: (answers.nomePcD as string) ?? (answers.nomeResp as string) ?? "—",
        email: (contact.email as string) ?? "—",
        whatsapp: (contact.whatsapp as string) ?? "—",
        wantsCard: Boolean(r.wantsCard),
        diagnostico: Array.isArray(diags) ? diags.join(", ") : ((diags as string) ?? "—"),
        submittedAt: (r.submittedAt as string) ?? new Date().toISOString(),
      };
    });
  } catch {
    return respostas;
  }
};

const formats = [
  { id: "csv", label: "CSV", icon: FileSpreadsheet, color: "text-tea-green" },
  { id: "xlsx", label: "XLSX", icon: FileSpreadsheet, color: "text-tea-green" },
  { id: "pdf", label: "PDF", icon: FileType, color: "text-tea-red" },
  { id: "pptx", label: "PPTX", icon: Presentation, color: "text-tea-orange" },
  { id: "md", label: "Markdown", icon: FileText, color: "text-tea-cyan" },
  { id: "txt", label: "TXT", icon: FileText, color: "text-muted-foreground" },
  { id: "json", label: "JSON", icon: FileJson, color: "text-tea-yellow" },
] as const;

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
  const [autoBackup, setAutoBackup] = useState(true);
  const [encryptBackup, setEncryptBackup] = useState(true);
  const [confirmDelete, setConfirmDelete] = useState(true);
  const [respostas, setRespostas] = useState<Resposta[]>([]);

  useEffect(() => {
    setRespostas(loadRespostas());
  }, []);

  const stats = useMemo(
    () => ({
      total: respostas.length,
      cartao: respostas.filter((r) => r.wantsCard).length,
      hoje: respostas.filter(
        (r) => new Date(r.submittedAt).toDateString() === new Date().toDateString()
      ).length,
    }),
    [respostas]
  );


  const handleExport = (id: string) => {
    if (id === "csv") {
      const header = "id,nome,email,whatsapp,wantsCard,diagnostico,submittedAt\n";
      const rows = respostas
        .map((r) =>
          [r.id, r.nome, r.email, r.whatsapp, r.wantsCard, r.diagnostico, r.submittedAt].join(",")
        )
        .join("\n");
      downloadFile("respostas.csv", header + rows, "text/csv");
    } else if (id === "json") {
      downloadFile("respostas.json", JSON.stringify(respostas, null, 2), "application/json");
    } else if (id === "md") {
      const md =
        "# Respostas — Cartão Colo de Mãe\n\n" +
        respostas
          .map(
            (r) =>
              `## ${r.nome}\n- Email: ${r.email}\n- WhatsApp: ${r.whatsapp}\n- Cartão: ${r.wantsCard ? "Sim" : "Não"}\n- Diagnóstico: ${r.diagnostico}\n- Data: ${r.submittedAt}\n`
          )
          .join("\n");
      downloadFile("respostas.md", md, "text/markdown");
    } else if (id === "txt") {
      const txt = respostas
        .map((r) => `${r.nome} | ${r.email} | ${r.whatsapp} | ${r.diagnostico}`)
        .join("\n");
      downloadFile("respostas.txt", txt, "text/plain");
    } else {
      toast.info(`Exportação ${id.toUpperCase()} disponível em breve`, {
        description: "Será habilitada quando o Cloud for ativado.",
      });
    }
  };

  const handleZip = () => {
    toast.success("Pacote ZIP em preparação", {
      description: "Disponível ao ativar Lovable Cloud (todos os formatos juntos).",
    });
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
                  Painel administrativo
                </Badge>
                <h1 className="font-heading text-4xl font-extrabold md:text-5xl">
                  Respostas & <span className="text-tea-yellow">Relatórios</span>
                </h1>
                <p className="mt-2 max-w-2xl text-muted-foreground">
                  Visualize todas as respostas do Cartão Colo de Mãe e exporte em
                  múltiplos formatos. Backup e proteção de dados configuráveis.
                </p>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid gap-4 md:grid-cols-3">
            {[
              { label: "Total de respostas", value: stats.total, icon: Database, color: "tea-blue" },
              { label: "Solicitaram o Cartão", value: stats.cartao, icon: CheckCircle2, color: "tea-green" },
              { label: "Recebidas hoje", value: stats.hoje, icon: Clock, color: "tea-yellow" },
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

          {/* Export */}
          <Card className="border-2 border-border/60 bg-card/70 backdrop-blur">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 font-heading text-2xl">
                <Download className="text-tea-yellow" /> Exportar respostas
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-6">
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                {formats.map((f) => (
                  <Button
                    key={f.id}
                    onClick={() => handleExport(f.id)}
                    variant="outline"
                    className="h-auto min-h-16 flex-col gap-2 rounded-2xl border-2 border-border/60 bg-background/50 py-4 hover:border-tea-yellow hover:bg-background"
                  >
                    <f.icon className={f.color} size={24} />
                    <span className="font-bold">{f.label}</span>
                  </Button>
                ))}
                <Button
                  onClick={handleZip}
                  className="col-span-2 h-auto min-h-16 flex-col gap-2 rounded-2xl bg-tea-yellow py-4 font-bold text-background hover:bg-tea-yellow/90 sm:col-span-3 lg:col-span-1"
                >
                  <FileArchive size={24} />
                  <span>ZIP (Tudo)</span>
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                💡 Dica: CSV, JSON, Markdown e TXT já funcionam com dados de demonstração.
                XLSX, PDF, PPTX e ZIP serão ativados junto com o Lovable Cloud.
              </p>
            </CardContent>
          </Card>

          {/* Lista de respostas */}
          <Card className="border-2 border-border/60 bg-card/70 backdrop-blur">
            <CardHeader>
              <CardTitle className="font-heading text-2xl">Últimas respostas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="border-b border-border/60 text-muted-foreground">
                    <tr>
                      <th className="pb-3 pr-4 font-semibold">Nome</th>
                      <th className="pb-3 pr-4 font-semibold">Contato</th>
                      <th className="pb-3 pr-4 font-semibold">Diagnóstico</th>
                      <th className="pb-3 pr-4 font-semibold">Cartão</th>
                      <th className="pb-3 font-semibold">Data</th>
                    </tr>
                  </thead>
                  <tbody>
                    {respostas.map((r) => (
                      <tr key={r.id} className="border-b border-border/40 last:border-0">
                        <td className="py-3 pr-4 font-medium">{r.nome}</td>
                        <td className="py-3 pr-4 text-muted-foreground">
                          {r.email}
                          <br />
                          <span className="text-xs">{r.whatsapp}</span>
                        </td>
                        <td className="py-3 pr-4">{r.diagnostico}</td>
                        <td className="py-3 pr-4">
                          {r.wantsCard ? (
                            <Badge className="bg-tea-green text-white hover:bg-tea-green">Sim</Badge>
                          ) : (
                            <Badge variant="outline" className="border-muted-foreground/40">Não</Badge>
                          )}
                        </td>
                        <td className="py-3 text-muted-foreground">
                          {new Date(r.submittedAt).toLocaleDateString("pt-BR")}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Backup */}
          <div className="grid gap-6 lg:grid-cols-2">
            <Card className="border-2 border-border/60 bg-card/70 backdrop-blur">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 font-heading text-2xl">
                  <Cloud className="text-tea-cyan" /> Backup automático
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-5">
                <div className="flex items-center justify-between gap-4 rounded-xl border border-border/60 bg-background/40 p-4">
                  <div>
                    <p className="font-semibold">Backup diário do site</p>
                    <p className="text-xs text-muted-foreground">Snapshot completo a cada 24h</p>
                  </div>
                  <Switch checked={autoBackup} onCheckedChange={setAutoBackup} />
                </div>
                <div className="flex items-center justify-between gap-4 rounded-xl border border-border/60 bg-background/40 p-4">
                  <div>
                    <p className="font-semibold">Criptografia dos backups</p>
                    <p className="text-xs text-muted-foreground">AES-256 em repouso</p>
                  </div>
                  <Switch checked={encryptBackup} onCheckedChange={setEncryptBackup} />
                </div>
                <div className="rounded-xl border border-tea-green/30 bg-tea-green/10 p-4 text-sm">
                  <p className="flex items-center gap-2 font-semibold text-tea-green">
                    <CheckCircle2 size={18} /> Último backup: hoje, 03:00
                  </p>
                  <p className="mt-1 text-muted-foreground">
                    Mock visual — será conectado ao ativar Lovable Cloud.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 border-border/60 bg-card/70 backdrop-blur">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 font-heading text-2xl">
                  <Shield className="text-tea-yellow" /> Proteção de dados
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-5">
                <div className="flex items-center justify-between gap-4 rounded-xl border border-border/60 bg-background/40 p-4">
                  <div>
                    <p className="font-semibold">Confirmar antes de excluir</p>
                    <p className="text-xs text-muted-foreground">Evita exclusão acidental</p>
                  </div>
                  <Switch checked={confirmDelete} onCheckedChange={setConfirmDelete} />
                </div>
                <div className="rounded-xl border border-border/60 bg-background/40 p-4">
                  <p className="font-semibold">Retenção de versões</p>
                  <p className="text-xs text-muted-foreground">
                    Mantém 30 dias de histórico de cada resposta.
                  </p>
                </div>
                <div className="rounded-xl border border-tea-yellow/30 bg-tea-yellow/10 p-4 text-sm">
                  <p className="flex items-center gap-2 font-semibold text-tea-yellow">
                    <AlertCircle size={18} /> Lovable Cloud não está ativo
                  </p>
                  <p className="mt-1 text-muted-foreground">
                    Os dados estão somente em memória/local. Ative o Cloud para
                    persistência real, backup automático e exportações pesadas.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </motion.div>
      </main>
      <Footer />
    </div>
  );
};

export default Respostas;
