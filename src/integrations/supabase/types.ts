export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      cadastro_credenciais: {
        Row: {
          cadastro_id: string
          code: string
          created_at: string
          phrase: string
          word: string
        }
        Insert: {
          cadastro_id: string
          code: string
          created_at?: string
          phrase: string
          word: string
        }
        Update: {
          cadastro_id?: string
          code?: string
          created_at?: string
          phrase?: string
          word?: string
        }
        Relationships: [
          {
            foreignKeyName: "cadastro_credenciais_cadastro_id_fkey"
            columns: ["cadastro_id"]
            isOneToOne: true
            referencedRelation: "cadastros"
            referencedColumns: ["id"]
          },
        ]
      }
      cadastros: {
        Row: {
          aceite_lgpd: boolean
          aceite_termo: boolean
          answers: Json
          bairro: string | null
          bpc: string | null
          cidade: string | null
          cpf_pcd: string | null
          cpf_responsavel: string | null
          created_at: string
          data_nascimento: string | null
          descricao_ajuda: string | null
          diagnostico_outro: string | null
          diagnosticos: string[] | null
          dif_autonomia: string[] | null
          dif_motora: string[] | null
          dif_sensorial: string[] | null
          dif_social: string[] | null
          dificuldade_escolar: boolean | null
          dir_acessibilidade: string[] | null
          dir_assistencia: string[] | null
          dir_cultura: string[] | null
          dir_educacao: string[] | null
          dir_habitacao: string[] | null
          dir_previdencia: string[] | null
          dir_saude: string[] | null
          dir_trabalho: string[] | null
          dir_transporte: string[] | null
          dir_tributacao: string[] | null
          email: string | null
          endereco: string | null
          estado: string | null
          estuda: string | null
          fila_sus: boolean | null
          frequencia_reduzida: boolean | null
          gastos_terapia: boolean | null
          id: string
          idade: number | null
          is_urgente: boolean | null
          moradores: number | null
          necessidades: string[] | null
          nivel_suporte: string | null
          nome_pcd: string | null
          nome_responsavel: string | null
          porque_importante: string | null
          protocolo: string
          renda: string | null
          sem_escola: boolean | null
          share_token: string
          status: Database["public"]["Enums"]["cadastro_status"]
          telefone_principal: string | null
          telefone_secundario: string | null
          tem_at: boolean | null
          tem_carteira_pcd: boolean | null
          tem_ciptea: boolean | null
          tem_diagnostico: string | null
          tem_laudo: boolean | null
          tempo_espera: string | null
          terapias: string[] | null
          tipo_escola: string | null
          trabalha: string | null
          updated_at: string
          urgencia_situacao: string[] | null
          wants_card: boolean
          whatsapp: string | null
        }
        Insert: {
          aceite_lgpd?: boolean
          aceite_termo?: boolean
          answers?: Json
          bairro?: string | null
          bpc?: string | null
          cidade?: string | null
          cpf_pcd?: string | null
          cpf_responsavel?: string | null
          created_at?: string
          data_nascimento?: string | null
          descricao_ajuda?: string | null
          diagnostico_outro?: string | null
          diagnosticos?: string[] | null
          dif_autonomia?: string[] | null
          dif_motora?: string[] | null
          dif_sensorial?: string[] | null
          dif_social?: string[] | null
          dificuldade_escolar?: boolean | null
          dir_acessibilidade?: string[] | null
          dir_assistencia?: string[] | null
          dir_cultura?: string[] | null
          dir_educacao?: string[] | null
          dir_habitacao?: string[] | null
          dir_previdencia?: string[] | null
          dir_saude?: string[] | null
          dir_trabalho?: string[] | null
          dir_transporte?: string[] | null
          dir_tributacao?: string[] | null
          email?: string | null
          endereco?: string | null
          estado?: string | null
          estuda?: string | null
          fila_sus?: boolean | null
          frequencia_reduzida?: boolean | null
          gastos_terapia?: boolean | null
          id?: string
          idade?: number | null
          is_urgente?: boolean | null
          moradores?: number | null
          necessidades?: string[] | null
          nivel_suporte?: string | null
          nome_pcd?: string | null
          nome_responsavel?: string | null
          porque_importante?: string | null
          protocolo?: string
          renda?: string | null
          sem_escola?: boolean | null
          share_token?: string
          status?: Database["public"]["Enums"]["cadastro_status"]
          telefone_principal?: string | null
          telefone_secundario?: string | null
          tem_at?: boolean | null
          tem_carteira_pcd?: boolean | null
          tem_ciptea?: boolean | null
          tem_diagnostico?: string | null
          tem_laudo?: boolean | null
          tempo_espera?: string | null
          terapias?: string[] | null
          tipo_escola?: string | null
          trabalha?: string | null
          updated_at?: string
          urgencia_situacao?: string[] | null
          wants_card?: boolean
          whatsapp?: string | null
        }
        Update: {
          aceite_lgpd?: boolean
          aceite_termo?: boolean
          answers?: Json
          bairro?: string | null
          bpc?: string | null
          cidade?: string | null
          cpf_pcd?: string | null
          cpf_responsavel?: string | null
          created_at?: string
          data_nascimento?: string | null
          descricao_ajuda?: string | null
          diagnostico_outro?: string | null
          diagnosticos?: string[] | null
          dif_autonomia?: string[] | null
          dif_motora?: string[] | null
          dif_sensorial?: string[] | null
          dif_social?: string[] | null
          dificuldade_escolar?: boolean | null
          dir_acessibilidade?: string[] | null
          dir_assistencia?: string[] | null
          dir_cultura?: string[] | null
          dir_educacao?: string[] | null
          dir_habitacao?: string[] | null
          dir_previdencia?: string[] | null
          dir_saude?: string[] | null
          dir_trabalho?: string[] | null
          dir_transporte?: string[] | null
          dir_tributacao?: string[] | null
          email?: string | null
          endereco?: string | null
          estado?: string | null
          estuda?: string | null
          fila_sus?: boolean | null
          frequencia_reduzida?: boolean | null
          gastos_terapia?: boolean | null
          id?: string
          idade?: number | null
          is_urgente?: boolean | null
          moradores?: number | null
          necessidades?: string[] | null
          nivel_suporte?: string | null
          nome_pcd?: string | null
          nome_responsavel?: string | null
          porque_importante?: string | null
          protocolo?: string
          renda?: string | null
          sem_escola?: boolean | null
          share_token?: string
          status?: Database["public"]["Enums"]["cadastro_status"]
          telefone_principal?: string | null
          telefone_secundario?: string | null
          tem_at?: boolean | null
          tem_carteira_pcd?: boolean | null
          tem_ciptea?: boolean | null
          tem_diagnostico?: string | null
          tem_laudo?: boolean | null
          tempo_espera?: string | null
          terapias?: string[] | null
          tipo_escola?: string | null
          trabalha?: string | null
          updated_at?: string
          urgencia_situacao?: string[] | null
          wants_card?: boolean
          whatsapp?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          display_name: string | null
          id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          display_name?: string | null
          id?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          display_name?: string | null
          id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      claim_super_admin: { Args: { _code: string }; Returns: boolean }
      get_public_cartao: {
        Args: { _token: string }
        Returns: {
          cidade: string
          created_at: string
          diagnosticos: string[]
          estado: string
          necessidades: string[]
          nome_pcd: string
          nome_responsavel: string
          protocolo: string
          wants_card: boolean
        }[]
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      lookup_cadastro_by_code: {
        Args: { _code: string }
        Returns: {
          cidade: string
          nome_pcd: string
          protocolo: string
          share_token: string
        }[]
      }
    }
    Enums: {
      app_role: "super_admin" | "admin" | "membro"
      cadastro_status:
        | "novo"
        | "em_analise"
        | "em_atendimento"
        | "atendido"
        | "arquivado"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["super_admin", "admin", "membro"],
      cadastro_status: [
        "novo",
        "em_analise",
        "em_atendimento",
        "atendido",
        "arquivado",
      ],
    },
  },
} as const
