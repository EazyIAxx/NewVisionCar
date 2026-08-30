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
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          extensions?: Json
          operationName?: string
          query?: string
          variables?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      agencies: {
        Row: {
          cnpj: string | null
          created_at: string
          id: string
          inscricao_estadual: string | null
          inscricao_municipal: string | null
          name: string
          plan_status: string
          regime_tributario: string | null
          slug: string | null
          stripe_customer_id: string | null
          stripe_subscription_id: string | null
          trial_ends_at: string | null
          vitrine_accent_color: string
          vitrine_whatsapp: string | null
        }
        Insert: {
          cnpj?: string | null
          created_at?: string
          id?: string
          inscricao_estadual?: string | null
          inscricao_municipal?: string | null
          name: string
          plan_status?: string
          regime_tributario?: string | null
          slug?: string | null
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          trial_ends_at?: string | null
          vitrine_accent_color?: string
          vitrine_whatsapp?: string | null
        }
        Update: {
          cnpj?: string | null
          created_at?: string
          id?: string
          inscricao_estadual?: string | null
          inscricao_municipal?: string | null
          name?: string
          plan_status?: string
          regime_tributario?: string | null
          slug?: string | null
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          trial_ends_at?: string | null
          vitrine_accent_color?: string
          vitrine_whatsapp?: string | null
        }
        Relationships: []
      }
      agency_invites: {
        Row: {
          agency_id: string
          code: string
          created_at: string
          created_by: string | null
          expires_at: string | null
          id: string
          role: string
          used_by: string | null
        }
        Insert: {
          agency_id: string
          code: string
          created_at?: string
          created_by?: string | null
          expires_at?: string | null
          id?: string
          role?: string
          used_by?: string | null
        }
        Update: {
          agency_id?: string
          code?: string
          created_at?: string
          created_by?: string | null
          expires_at?: string | null
          id?: string
          role?: string
          used_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "agency_invites_agency_id_fkey"
            columns: ["agency_id"]
            isOneToOne: false
            referencedRelation: "agencies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "agency_invites_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "agency_invites_used_by_fkey"
            columns: ["used_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      financing_requests: {
        Row: {
          agency_id: string
          created_at: string
          customer_email: string | null
          customer_name: string
          customer_phone: string
          down_payment: number
          id: string
          installment_estimate: number
          lead_id: string | null
          status: string
          term_months: number
          updated_at: string
          vehicle_id: string
        }
        Insert: {
          agency_id: string
          created_at?: string
          customer_email?: string | null
          customer_name: string
          customer_phone: string
          down_payment: number
          id?: string
          installment_estimate: number
          lead_id?: string | null
          status?: string
          term_months: number
          updated_at?: string
          vehicle_id: string
        }
        Update: {
          agency_id?: string
          created_at?: string
          customer_email?: string | null
          customer_name?: string
          customer_phone?: string
          down_payment?: number
          id?: string
          installment_estimate?: number
          lead_id?: string | null
          status?: string
          term_months?: number
          updated_at?: string
          vehicle_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "financing_requests_agency_id_fkey"
            columns: ["agency_id"]
            isOneToOne: false
            referencedRelation: "agencies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "financing_requests_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "financing_requests_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "financing_requests_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles_view"
            referencedColumns: ["id"]
          },
        ]
      }
      invoices: {
        Row: {
          agency_id: string
          chave_acesso: string | null
          created_at: string
          emitted_at: string | null
          id: string
          numero: string | null
          sale_id: string
          status: string
        }
        Insert: {
          agency_id: string
          chave_acesso?: string | null
          created_at?: string
          emitted_at?: string | null
          id?: string
          numero?: string | null
          sale_id: string
          status?: string
        }
        Update: {
          agency_id?: string
          chave_acesso?: string | null
          created_at?: string
          emitted_at?: string | null
          id?: string
          numero?: string | null
          sale_id?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "invoices_agency_id_fkey"
            columns: ["agency_id"]
            isOneToOne: false
            referencedRelation: "agencies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoices_sale_id_fkey"
            columns: ["sale_id"]
            isOneToOne: false
            referencedRelation: "sales"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoices_sale_id_fkey"
            columns: ["sale_id"]
            isOneToOne: false
            referencedRelation: "sales_view"
            referencedColumns: ["id"]
          },
        ]
      }
      lead_activities: {
        Row: {
          agency_id: string
          date: string
          description: string
          id: string
          lead_id: string
          type: string
        }
        Insert: {
          agency_id: string
          date?: string
          description: string
          id?: string
          lead_id: string
          type: string
        }
        Update: {
          agency_id?: string
          date?: string
          description?: string
          id?: string
          lead_id?: string
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "lead_activities_agency_id_fkey"
            columns: ["agency_id"]
            isOneToOne: false
            referencedRelation: "agencies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lead_activities_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
        ]
      }
      leads: {
        Row: {
          agency_id: string
          created_at: string
          created_by_ai: boolean
          email: string | null
          id: string
          name: string
          origin: string
          phone: string
          stage: string
          vehicle_interest: string | null
          vendedor_id: string | null
          visit_date: string | null
        }
        Insert: {
          agency_id: string
          created_at?: string
          created_by_ai?: boolean
          email?: string | null
          id?: string
          name: string
          origin: string
          phone: string
          stage?: string
          vehicle_interest?: string | null
          vendedor_id?: string | null
          visit_date?: string | null
        }
        Update: {
          agency_id?: string
          created_at?: string
          created_by_ai?: boolean
          email?: string | null
          id?: string
          name?: string
          origin?: string
          phone?: string
          stage?: string
          vehicle_interest?: string | null
          vendedor_id?: string | null
          visit_date?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "leads_agency_id_fkey"
            columns: ["agency_id"]
            isOneToOne: false
            referencedRelation: "agencies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "leads_vendedor_id_fkey"
            columns: ["vendedor_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      listings: {
        Row: {
          agency_id: string
          created_at: string
          external_id: string | null
          id: string
          portal: string
          published_at: string | null
          status: string
          vehicle_id: string
        }
        Insert: {
          agency_id: string
          created_at?: string
          external_id?: string | null
          id?: string
          portal: string
          published_at?: string | null
          status?: string
          vehicle_id: string
        }
        Update: {
          agency_id?: string
          created_at?: string
          external_id?: string | null
          id?: string
          portal?: string
          published_at?: string | null
          status?: string
          vehicle_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "listings_agency_id_fkey"
            columns: ["agency_id"]
            isOneToOne: false
            referencedRelation: "agencies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "listings_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "listings_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles_view"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          agency_id: string | null
          created_at: string
          email: string | null
          full_name: string | null
          id: string
          role: string | null
        }
        Insert: {
          agency_id?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id: string
          role?: string | null
        }
        Update: {
          agency_id?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          role?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_agency_id_fkey"
            columns: ["agency_id"]
            isOneToOne: false
            referencedRelation: "agencies"
            referencedColumns: ["id"]
          },
        ]
      }
      renave_transfers: {
        Row: {
          agency_id: string
          buyer_address: string
          buyer_document: string
          buyer_rg: string
          created_at: string
          id: string
          protocol: string | null
          sale_id: string
          status: string
          updated_at: string
        }
        Insert: {
          agency_id: string
          buyer_address: string
          buyer_document: string
          buyer_rg: string
          created_at?: string
          id?: string
          protocol?: string | null
          sale_id: string
          status?: string
          updated_at?: string
        }
        Update: {
          agency_id?: string
          buyer_address?: string
          buyer_document?: string
          buyer_rg?: string
          created_at?: string
          id?: string
          protocol?: string | null
          sale_id?: string
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "renave_transfers_agency_id_fkey"
            columns: ["agency_id"]
            isOneToOne: false
            referencedRelation: "agencies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "renave_transfers_sale_id_fkey"
            columns: ["sale_id"]
            isOneToOne: true
            referencedRelation: "sales"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "renave_transfers_sale_id_fkey"
            columns: ["sale_id"]
            isOneToOne: true
            referencedRelation: "sales_view"
            referencedColumns: ["id"]
          },
        ]
      }
      sales: {
        Row: {
          agency_id: string
          amount: number
          cost_price: number
          created_at: string
          customer_name: string
          id: string
          payment_method: string
          sale_date: string
          vehicle_brand: string
          vehicle_id: string | null
          vehicle_model: string
          vendedor_id: string
        }
        Insert: {
          agency_id: string
          amount: number
          cost_price?: number
          created_at?: string
          customer_name: string
          id?: string
          payment_method: string
          sale_date: string
          vehicle_brand: string
          vehicle_id?: string | null
          vehicle_model: string
          vendedor_id: string
        }
        Update: {
          agency_id?: string
          amount?: number
          cost_price?: number
          created_at?: string
          customer_name?: string
          id?: string
          payment_method?: string
          sale_date?: string
          vehicle_brand?: string
          vehicle_id?: string | null
          vehicle_model?: string
          vendedor_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "sales_agency_id_fkey"
            columns: ["agency_id"]
            isOneToOne: false
            referencedRelation: "agencies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sales_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sales_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sales_vendedor_id_fkey"
            columns: ["vendedor_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      service_orders: {
        Row: {
          agency_id: string
          amount: number
          created_at: string
          date: string
          id: string
          status: string
          supplier: string
          type: string
          vehicle_id: string
        }
        Insert: {
          agency_id: string
          amount: number
          created_at?: string
          date: string
          id?: string
          status?: string
          supplier: string
          type: string
          vehicle_id: string
        }
        Update: {
          agency_id?: string
          amount?: number
          created_at?: string
          date?: string
          id?: string
          status?: string
          supplier?: string
          type?: string
          vehicle_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "service_orders_agency_id_fkey"
            columns: ["agency_id"]
            isOneToOne: false
            referencedRelation: "agencies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "service_orders_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "service_orders_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles_view"
            referencedColumns: ["id"]
          },
        ]
      }
      vehicles: {
        Row: {
          agency_id: string
          brand: string
          color: string
          cost_price: number | null
          created_at: string
          description: string | null
          features: string[]
          fuel_type: string | null
          id: string
          km: number
          model: string
          photos: string[]
          plate: string
          price: number
          status: string
          transmission: string | null
          year: number
        }
        Insert: {
          agency_id: string
          brand: string
          color: string
          cost_price?: number | null
          created_at?: string
          description?: string | null
          features?: string[]
          fuel_type?: string | null
          id?: string
          km?: number
          model: string
          photos?: string[]
          plate: string
          price: number
          status?: string
          transmission?: string | null
          year: number
        }
        Update: {
          agency_id?: string
          brand?: string
          color?: string
          cost_price?: number | null
          created_at?: string
          description?: string | null
          features?: string[]
          fuel_type?: string | null
          id?: string
          km?: number
          model?: string
          photos?: string[]
          plate?: string
          price?: number
          status?: string
          transmission?: string | null
          year?: number
        }
        Relationships: [
          {
            foreignKeyName: "vehicles_agency_id_fkey"
            columns: ["agency_id"]
            isOneToOne: false
            referencedRelation: "agencies"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      sales_view: {
        Row: {
          agency_id: string | null
          amount: number | null
          cost_price: number | null
          created_at: string | null
          customer_name: string | null
          id: string | null
          payment_method: string | null
          sale_date: string | null
          vehicle_brand: string | null
          vehicle_id: string | null
          vehicle_model: string | null
          vendedor_id: string | null
          vendedor_name: string | null
        }
        Relationships: [
          {
            foreignKeyName: "sales_agency_id_fkey"
            columns: ["agency_id"]
            isOneToOne: false
            referencedRelation: "agencies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sales_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sales_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sales_vendedor_id_fkey"
            columns: ["vendedor_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      vehicles_view: {
        Row: {
          agency_id: string | null
          brand: string | null
          color: string | null
          cost_price: number | null
          created_at: string | null
          description: string | null
          features: string[] | null
          fuel_type: string | null
          id: string | null
          km: number | null
          model: string | null
          photos: string[] | null
          plate: string | null
          price: number | null
          status: string | null
          transmission: string | null
          year: number | null
        }
        Insert: {
          agency_id?: string | null
          brand?: string | null
          color?: string | null
          cost_price?: never
          created_at?: string | null
          description?: string | null
          features?: string[] | null
          fuel_type?: string | null
          id?: string | null
          km?: number | null
          model?: string | null
          photos?: string[] | null
          plate?: string | null
          price?: number | null
          status?: string | null
          transmission?: string | null
          year?: number | null
        }
        Update: {
          agency_id?: string | null
          brand?: string | null
          color?: string | null
          cost_price?: never
          created_at?: string | null
          description?: string | null
          features?: string[] | null
          fuel_type?: string | null
          id?: string | null
          km?: number | null
          model?: string | null
          photos?: string[] | null
          plate?: string | null
          price?: number | null
          status?: string | null
          transmission?: string | null
          year?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "vehicles_agency_id_fkey"
            columns: ["agency_id"]
            isOneToOne: false
            referencedRelation: "agencies"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Functions: {
      compute_vehicle_cost: { Args: { p_vehicle_id: string }; Returns: number }
      create_agency_and_set_gestor: {
        Args: { p_name: string }
        Returns: string
      }
      create_agency_invite: {
        Args: { p_role?: string }
        Returns: {
          agency_id: string
          code: string
          created_at: string
          created_by: string | null
          expires_at: string | null
          id: string
          role: string
          used_by: string | null
        }
        SetofOptions: {
          from: "*"
          to: "agency_invites"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      create_vitrine_lead: {
        Args: {
          p_email: string
          p_message: string
          p_name: string
          p_phone: string
          p_slug: string
          p_vehicle_interest: string
        }
        Returns: undefined
      }
      generate_unique_agency_slug: { Args: { p_name: string }; Returns: string }
      get_my_agency_id: { Args: never; Returns: string }
      get_my_role: { Args: never; Returns: string }
      get_vitrine_agency: {
        Args: { p_slug: string }
        Returns: {
          accent_color: string
          id: string
          name: string
          slug: string
          whatsapp: string
        }[]
      }
      get_vitrine_vehicles: {
        Args: { p_slug: string }
        Returns: {
          brand: string
          color: string
          description: string
          features: string[]
          fuel_type: string
          id: string
          km: number
          model: string
          photos: string[]
          price: number
          transmission: string
          year: number
        }[]
      }
      is_gestor: { Args: never; Returns: boolean }
      join_agency_with_invite: { Args: { p_code: string }; Returns: string }
      request_vitrine_financing: {
        Args: {
          p_down_payment: number
          p_email: string
          p_installment_estimate: number
          p_name: string
          p_phone: string
          p_slug: string
          p_term_months: number
          p_vehicle_id: string
        }
        Returns: undefined
      }
      slugify: { Args: { p_text: string }; Returns: string }
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
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {},
  },
} as const
