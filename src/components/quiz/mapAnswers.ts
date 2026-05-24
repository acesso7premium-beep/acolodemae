// Mapeia as respostas do quiz (Record<string, any>) para as colunas da tabela `cadastros`.
// Mantém tudo em `answers` (JSONB) como backup e popula colunas estruturadas usadas no painel.

const boolFromSimNao = (v: unknown): boolean | null => {
  if (v === "sim") return true;
  if (v === "nao") return false;
  return null;
};

const toIntOrNull = (v: unknown): number | null => {
  if (v === null || v === undefined || v === "") return null;
  const n = Number(v);
  return Number.isFinite(n) ? Math.trunc(n) : null;
};

const toDateOrNull = (v: unknown): string | null => {
  if (!v || typeof v !== "string") return null;
  // já vem em yyyy-mm-dd dos inputs date
  return v;
};

const arr = (v: unknown): string[] =>
  Array.isArray(v) ? v.map((x) => String(x)) : [];

export type CadastroInsert = {
  wants_card: boolean;
  email: string | null;
  whatsapp: string | null;

  nome_pcd: string | null;
  cpf_pcd: string | null;
  nome_responsavel: string | null;
  cpf_responsavel: string | null;
  data_nascimento: string | null;
  idade: number | null;
  telefone_principal: string | null;
  telefone_secundario: string | null;
  endereco: string | null;
  bairro: string | null;
  cidade: string | null;
  estado: string | null;

  tem_diagnostico: string | null;
  diagnosticos: string[];
  diagnostico_outro: string | null;

  nivel_suporte: string | null;
  tem_laudo: boolean | null;
  tem_ciptea: boolean | null;
  tem_carteira_pcd: boolean | null;

  estuda: string | null;
  tipo_escola: string | null;
  tem_at: boolean | null;
  dificuldade_escolar: boolean | null;
  sem_escola: boolean | null;
  frequencia_reduzida: boolean | null;

  moradores: number | null;
  renda: string | null;
  trabalha: string | null;
  bpc: string | null;
  gastos_terapia: boolean | null;

  necessidades: string[];
  descricao_ajuda: string | null;
  porque_importante: string | null;
  urgencia_situacao: string[];

  terapias: string[];
  fila_sus: boolean | null;
  tempo_espera: string | null;

  dif_motora: string[];
  dif_autonomia: string[];
  dif_sensorial: string[];
  dif_social: string[];

  dir_saude: string[];
  dir_educacao: string[];
  dir_trabalho: string[];
  dir_transporte: string[];
  dir_assistencia: string[];
  dir_previdencia: string[];
  dir_habitacao: string[];
  dir_cultura: string[];
  dir_tributacao: string[];
  dir_acessibilidade: string[];

  aceite_lgpd: boolean;
  aceite_termo: boolean;

  answers: Record<string, unknown>;
};

const str = (v: unknown): string | null => {
  if (v === null || v === undefined) return null;
  const s = String(v).trim();
  return s ? s : null;
};

export function mapAnswersToCadastro(
  answers: Record<string, unknown>,
  opts: { wantsCard: boolean | null; contact?: { email?: string; whatsapp?: string } | null },
): CadastroInsert {
  return {
    wants_card: Boolean(opts.wantsCard),
    email: str(opts.contact?.email ?? answers.email),
    whatsapp: str(opts.contact?.whatsapp ?? answers.telefone1),

    nome_pcd: str(answers.nomePaciente),
    cpf_pcd: str(answers.cpfPaciente),
    nome_responsavel: str(answers.nomeResponsavel),
    cpf_responsavel: str(answers.cpfResponsavel),
    data_nascimento: toDateOrNull(answers.nascimento),
    idade: toIntOrNull(answers.idade),
    telefone_principal: str(answers.telefone1),
    telefone_secundario: str(answers.telefone2),
    endereco: str(answers.endereco),
    bairro: str(answers.bairro),
    cidade: str(answers.cidade),
    estado: str(answers.estado),

    tem_diagnostico: str(answers.temDiagnostico),
    diagnosticos: arr(answers.diagnosticos),
    diagnostico_outro: str(answers.diagnosticoOutro),

    nivel_suporte: str(answers.nivelSuporte),
    tem_laudo: boolFromSimNao(answers.laudo),
    tem_ciptea: boolFromSimNao(answers.ciptea),
    tem_carteira_pcd: boolFromSimNao(answers.carteirinha),

    estuda: str(answers.estuda),
    tipo_escola: str(answers.tipoEscola),
    tem_at: boolFromSimNao(answers.at),
    dificuldade_escolar: boolFromSimNao(answers.dificuldadeEscolar),
    sem_escola: boolFromSimNao(answers.semEscola),
    frequencia_reduzida: boolFromSimNao(answers.frequencia),

    moradores: toIntOrNull(answers.moradores),
    renda: str(answers.renda),
    trabalha: str(answers.trabalha),
    bpc: str(answers.bpc),
    gastos_terapia: boolFromSimNao(answers.gastosTerapia),

    necessidades: arr(answers.necessidades),
    descricao_ajuda: str(answers.descricaoAjuda),
    porque_importante: str(answers.porqueImportante),
    urgencia_situacao: arr(answers.urgenciaSituacao),

    terapias: arr(answers.terapias),
    fila_sus: boolFromSimNao(answers.filaSus),
    tempo_espera: str(answers.tempoEspera),

    dif_motora: arr(answers.motora),
    dif_autonomia: arr(answers.autonomia),
    dif_sensorial: arr(answers.sensorial),
    dif_social: arr(answers.social),

    dir_saude: arr(answers.saude),
    dir_educacao: arr(answers.educacaoDir),
    dir_trabalho: arr(answers.trabalho),
    dir_transporte: arr(answers.transporteDir),
    dir_assistencia: arr(answers.assistencia),
    dir_previdencia: arr(answers.previdencia),
    dir_habitacao: arr(answers.habitacao),
    dir_cultura: arr(answers.cultura),
    dir_tributacao: arr(answers.tributacao),
    dir_acessibilidade: arr(answers.acessibilidade),

    aceite_lgpd: Boolean(answers.aceiteLgpd),
    aceite_termo: Boolean(answers.aceiteTermo),

    answers,
  };
}
