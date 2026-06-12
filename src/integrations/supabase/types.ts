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
      actions: {
        Row: {
          created_at: string
          id: number
          kind: string
          numen_id: string
          payload: Json
          pnl: number | null
          tx_sig: string | null
        }
        Insert: {
          created_at?: string
          id?: number
          kind: string
          numen_id: string
          payload?: Json
          pnl?: number | null
          tx_sig?: string | null
        }
        Update: {
          created_at?: string
          id?: number
          kind?: string
          numen_id?: string
          payload?: Json
          pnl?: number | null
          tx_sig?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "actions_numen_id_fkey"
            columns: ["numen_id"]
            isOneToOne: false
            referencedRelation: "numina"
            referencedColumns: ["id"]
          },
        ]
      }
      activity: {
        Row: {
          created_at: string
          id: number
          kind: string
          numen: string
          text: string
        }
        Insert: {
          created_at?: string
          id?: number
          kind: string
          numen: string
          text: string
        }
        Update: {
          created_at?: string
          id?: number
          kind?: string
          numen?: string
          text?: string
        }
        Relationships: []
      }
      numina: {
        Row: {
          config: Json
          created_at: string
          id: string
          name: string
          nft_mint: string | null
          owner_wallet: string
          program_account: string | null
          purpose: string
          sigil_seed: string
          status: string
          updated_at: string
        }
        Insert: {
          config?: Json
          created_at?: string
          id?: string
          name: string
          nft_mint?: string | null
          owner_wallet: string
          program_account?: string | null
          purpose?: string
          sigil_seed: string
          status?: string
          updated_at?: string
        }
        Update: {
          config?: Json
          created_at?: string
          id?: string
          name?: string
          nft_mint?: string | null
          owner_wallet?: string
          program_account?: string | null
          purpose?: string
          sigil_seed?: string
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "numina_owner_wallet_fkey"
            columns: ["owner_wallet"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["wallet"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          handle: string | null
          id: string
          updated_at: string
          wallet: string
        }
        Insert: {
          created_at?: string
          handle?: string | null
          id?: string
          updated_at?: string
          wallet: string
        }
        Update: {
          created_at?: string
          handle?: string | null
          id?: string
          updated_at?: string
          wallet?: string
        }
        Relationships: []
      }
      strategies: {
        Row: {
          author_wallet: string | null
          clones: number
          created_at: string
          description: string | null
          id: string
          is_public: boolean
          risk_level: string
          roi: number | null
          rules: Json
          title: string
          updated_at: string
        }
        Insert: {
          author_wallet?: string | null
          clones?: number
          created_at?: string
          description?: string | null
          id?: string
          is_public?: boolean
          risk_level?: string
          roi?: number | null
          rules?: Json
          title: string
          updated_at?: string
        }
        Update: {
          author_wallet?: string | null
          clones?: number
          created_at?: string
          description?: string | null
          id?: string
          is_public?: boolean
          risk_level?: string
          roi?: number | null
          rules?: Json
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "strategies_author_wallet_fkey"
            columns: ["author_wallet"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["wallet"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
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
    Enums: {},
  },
} as const
