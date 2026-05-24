
-- ENUMs de status
CREATE TYPE public.cadastro_status AS ENUM ('novo', 'em_analise', 'em_atendimento', 'atendido', 'arquivado');

-- Tabela principal
CREATE TABLE public.cadastros (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  protocolo TEXT UNIQUE NOT NULL DEFAULT (
    'CDM-' || to_char(now(), 'YYYYMM') || '-' ||
    lpad((floor(random() * 9000) + 1000)::int::text, 4, '0')
  ),
  share_token TEXT UNIQUE NOT NULL DEFAULT encode(gen_random_bytes(8), 'hex'),

  -- Cartão
  wants_card BOOLEAN NOT NULL DEFAULT false,

  -- Contato
  email TEXT,
  whatsapp TEXT,

  -- Identificação
  nome_pcd TEXT,
  cpf_pcd TEXT,
  nome_responsavel TEXT,
  cpf_responsavel TEXT,
  data_nascimento DATE,
  idade INTEGER,
  telefone_principal TEXT,
  telefone_secundario TEXT,
  endereco TEXT,
  bairro TEXT,
  cidade TEXT,
  estado TEXT,

  -- Diagnóstico
  tem_diagnostico TEXT,
  diagnosticos TEXT[] DEFAULT '{}',
  diagnostico_outro TEXT,

  -- Suporte
  nivel_suporte TEXT,
  tem_laudo BOOLEAN,
  tem_ciptea BOOLEAN,
  tem_carteira_pcd BOOLEAN,

  -- Educação
  estuda TEXT,
  tipo_escola TEXT,
  tem_at BOOLEAN,
  dificuldade_escolar BOOLEAN,
  sem_escola BOOLEAN,
  frequencia_reduzida BOOLEAN,

  -- Família
  moradores INTEGER,
  renda TEXT,
  trabalha TEXT,
  bpc TEXT,
  gastos_terapia BOOLEAN,

  -- Necessidades & urgência
  necessidades TEXT[] DEFAULT '{}',
  descricao_ajuda TEXT,
  porque_importante TEXT,
  urgencia_situacao TEXT[] DEFAULT '{}',

  -- Terapias / SUS
  terapias TEXT[] DEFAULT '{}',
  fila_sus BOOLEAN,
  tempo_espera TEXT,

  -- Dificuldades
  dif_motora TEXT[] DEFAULT '{}',
  dif_autonomia TEXT[] DEFAULT '{}',
  dif_sensorial TEXT[] DEFAULT '{}',
  dif_social TEXT[] DEFAULT '{}',

  -- Direitos
  dir_saude TEXT[] DEFAULT '{}',
  dir_educacao TEXT[] DEFAULT '{}',
  dir_trabalho TEXT[] DEFAULT '{}',
  dir_transporte TEXT[] DEFAULT '{}',
  dir_assistencia TEXT[] DEFAULT '{}',
  dir_previdencia TEXT[] DEFAULT '{}',
  dir_habitacao TEXT[] DEFAULT '{}',
  dir_cultura TEXT[] DEFAULT '{}',
  dir_tributacao TEXT[] DEFAULT '{}',
  dir_acessibilidade TEXT[] DEFAULT '{}',

  -- Status e flags
  status public.cadastro_status NOT NULL DEFAULT 'novo',
  is_urgente BOOLEAN GENERATED ALWAYS AS (
    COALESCE(array_length(urgencia_situacao, 1), 0) > 0
  ) STORED,

  -- Termos
  aceite_lgpd BOOLEAN NOT NULL DEFAULT false,
  aceite_termo BOOLEAN NOT NULL DEFAULT false,

  -- JSON bruto com todas as respostas (back-up de campos não estruturados)
  answers JSONB NOT NULL DEFAULT '{}'::jsonb,

  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.cadastros ENABLE ROW LEVEL SECURITY;

CREATE INDEX idx_cadastros_created_at ON public.cadastros (created_at DESC);
CREATE INDEX idx_cadastros_cidade ON public.cadastros (cidade);
CREATE INDEX idx_cadastros_status ON public.cadastros (status);
CREATE INDEX idx_cadastros_urgente ON public.cadastros (is_urgente);
CREATE INDEX idx_cadastros_share_token ON public.cadastros (share_token);
CREATE INDEX idx_cadastros_diagnosticos ON public.cadastros USING GIN (diagnosticos);
CREATE INDEX idx_cadastros_necessidades ON public.cadastros USING GIN (necessidades);

-- Credenciais (palavra, frase e código secretos)
CREATE TABLE public.cadastro_credenciais (
  cadastro_id UUID PRIMARY KEY REFERENCES public.cadastros(id) ON DELETE CASCADE,
  word TEXT NOT NULL,
  phrase TEXT NOT NULL,
  code TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.cadastro_credenciais ENABLE ROW LEVEL SECURITY;

-- Trigger de updated_at em cadastros (reusa a função existente)
CREATE TRIGGER update_cadastros_updated_at
BEFORE UPDATE ON public.cadastros
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- =============================================================
-- RLS: cadastros
-- =============================================================

-- Qualquer pessoa pode criar um cadastro (questionário público), exigindo LGPD/termo.
CREATE POLICY "Qualquer um cria cadastro com termos aceitos"
ON public.cadastros FOR INSERT
TO anon, authenticated
WITH CHECK (aceite_lgpd = true AND aceite_termo = true);

-- Apenas admins veem todos os cadastros.
CREATE POLICY "Admins veem todos os cadastros"
ON public.cadastros FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'super_admin'));

-- Admins atualizam (status, anotações etc).
CREATE POLICY "Admins atualizam cadastros"
ON public.cadastros FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'super_admin'));

-- Apenas super admin deleta.
CREATE POLICY "Super admin remove cadastros"
ON public.cadastros FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'super_admin'));

-- =============================================================
-- RLS: cadastro_credenciais
-- Nunca exposto via SELECT. Inserção só junto da criação do cadastro.
-- =============================================================

CREATE POLICY "Inserir credenciais ao criar cadastro"
ON public.cadastro_credenciais FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- Nenhuma policy de SELECT — leitura é bloqueada por padrão.
-- Super admin pode remover quando remove cadastro (cascade), mas também explicitamente:
CREATE POLICY "Super admin remove credenciais"
ON public.cadastro_credenciais FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'super_admin'));

-- =============================================================
-- Funções públicas (SECURITY DEFINER) — controlam o que vaza
-- =============================================================

-- Resumo público do cartão (sem palavra/frase/código).
CREATE OR REPLACE FUNCTION public.get_public_cartao(_token TEXT)
RETURNS TABLE (
  protocolo TEXT,
  nome_pcd TEXT,
  nome_responsavel TEXT,
  cidade TEXT,
  estado TEXT,
  diagnosticos TEXT[],
  necessidades TEXT[],
  wants_card BOOLEAN,
  created_at TIMESTAMPTZ
)
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT
    protocolo,
    nome_pcd,
    nome_responsavel,
    cidade,
    estado,
    diagnosticos,
    necessidades,
    wants_card,
    created_at
  FROM public.cadastros
  WHERE share_token = _token
  LIMIT 1;
$$;

-- Lookup pelo código único (devolve apenas o protocolo e token; sem palavra/frase).
CREATE OR REPLACE FUNCTION public.lookup_cadastro_by_code(_code TEXT)
RETURNS TABLE (
  protocolo TEXT,
  share_token TEXT,
  nome_pcd TEXT,
  cidade TEXT
)
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT c.protocolo, c.share_token, c.nome_pcd, c.cidade
  FROM public.cadastro_credenciais cc
  JOIN public.cadastros c ON c.id = cc.cadastro_id
  WHERE cc.code = upper(_code)
  LIMIT 1;
$$;

-- Revogar / liberar execução
REVOKE EXECUTE ON FUNCTION public.get_public_cartao(TEXT) FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.lookup_cadastro_by_code(TEXT) FROM PUBLIC;

GRANT EXECUTE ON FUNCTION public.get_public_cartao(TEXT) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.lookup_cadastro_by_code(TEXT) TO anon, authenticated;
