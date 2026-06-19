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
      briefing_files: {
        Row: {
          briefing_id: string
          created_at: string
          field_key: string
          file_name: string
          file_path: string
          id: string
          mime_type: string | null
          size_bytes: number | null
        }
        Insert: {
          briefing_id: string
          created_at?: string
          field_key: string
          file_name: string
          file_path: string
          id?: string
          mime_type?: string | null
          size_bytes?: number | null
        }
        Update: {
          briefing_id?: string
          created_at?: string
          field_key?: string
          file_name?: string
          file_path?: string
          id?: string
          mime_type?: string | null
          size_bytes?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "briefing_files_briefing_id_fkey"
            columns: ["briefing_id"]
            isOneToOne: false
            referencedRelation: "briefings"
            referencedColumns: ["id"]
          },
        ]
      }
      briefings: {
        Row: {
          created_at: string
          data_briefing: string
          empresa: string
          id: string
          q1_nome_empresa: string | null
          q10_definicao_sucesso: string | null
          q11_quantas_paginas: string | null
          q12_paginas_desejadas: string | null
          q13_pagina_especifica: string | null
          q14_form_contato: string | null
          q15_catalogo: string | null
          q16_blog: string | null
          q17_loja_virtual: string | null
          q18_redes_sociais: string | null
          q19_whatsapp: string | null
          q2_o_que_faz: string | null
          q20_textos: string | null
          q21_fotos_videos: string | null
          q22_conteudo_destaque: string | null
          q23_sites_referencia: string | null
          q24_sites_evitar: string | null
          q25_dominio: string | null
          q26_site_atual: string | null
          q27_prazo: string | null
          q28_data_importante: string | null
          q29_investimento: string | null
          q3_publico_alvo: string | null
          q4_tempo_existencia: string | null
          q5_diferenciais: string | null
          q6_possui_identidade: string | null
          q7_observacoes_identidade: string | null
          q8_deseja_desenvolver_identidade: string | null
          q9_objetivo_site: string | null
          responsavel: string
          status: Database["public"]["Enums"]["briefing_status"]
          updated_at: string
        }
        Insert: {
          created_at?: string
          data_briefing?: string
          empresa: string
          id?: string
          q1_nome_empresa?: string | null
          q10_definicao_sucesso?: string | null
          q11_quantas_paginas?: string | null
          q12_paginas_desejadas?: string | null
          q13_pagina_especifica?: string | null
          q14_form_contato?: string | null
          q15_catalogo?: string | null
          q16_blog?: string | null
          q17_loja_virtual?: string | null
          q18_redes_sociais?: string | null
          q19_whatsapp?: string | null
          q2_o_que_faz?: string | null
          q20_textos?: string | null
          q21_fotos_videos?: string | null
          q22_conteudo_destaque?: string | null
          q23_sites_referencia?: string | null
          q24_sites_evitar?: string | null
          q25_dominio?: string | null
          q26_site_atual?: string | null
          q27_prazo?: string | null
          q28_data_importante?: string | null
          q29_investimento?: string | null
          q3_publico_alvo?: string | null
          q4_tempo_existencia?: string | null
          q5_diferenciais?: string | null
          q6_possui_identidade?: string | null
          q7_observacoes_identidade?: string | null
          q8_deseja_desenvolver_identidade?: string | null
          q9_objetivo_site?: string | null
          responsavel: string
          status?: Database["public"]["Enums"]["briefing_status"]
          updated_at?: string
        }
        Update: {
          created_at?: string
          data_briefing?: string
          empresa?: string
          id?: string
          q1_nome_empresa?: string | null
          q10_definicao_sucesso?: string | null
          q11_quantas_paginas?: string | null
          q12_paginas_desejadas?: string | null
          q13_pagina_especifica?: string | null
          q14_form_contato?: string | null
          q15_catalogo?: string | null
          q16_blog?: string | null
          q17_loja_virtual?: string | null
          q18_redes_sociais?: string | null
          q19_whatsapp?: string | null
          q2_o_que_faz?: string | null
          q20_textos?: string | null
          q21_fotos_videos?: string | null
          q22_conteudo_destaque?: string | null
          q23_sites_referencia?: string | null
          q24_sites_evitar?: string | null
          q25_dominio?: string | null
          q26_site_atual?: string | null
          q27_prazo?: string | null
          q28_data_importante?: string | null
          q29_investimento?: string | null
          q3_publico_alvo?: string | null
          q4_tempo_existencia?: string | null
          q5_diferenciais?: string | null
          q6_possui_identidade?: string | null
          q7_observacoes_identidade?: string | null
          q8_deseja_desenvolver_identidade?: string | null
          q9_objetivo_site?: string | null
          responsavel?: string
          status?: Database["public"]["Enums"]["briefing_status"]
          updated_at?: string
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
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin"
      briefing_status:
        | "novo"
        | "em_analise"
        | "proposta_enviada"
        | "em_desenvolvimento"
        | "concluido"
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
      app_role: ["admin"],
      briefing_status: [
        "novo",
        "em_analise",
        "proposta_enviada",
        "em_desenvolvimento",
        "concluido",
      ],
    },
  },
} as const
