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
      activities: {
        Row: {
          company_id: string | null
          created_at: string
          description: string | null
          entity_id: string | null
          entity_type: string | null
          id: string
          metadata: Json
          priority: Database["public"]["Enums"]["activity_priority"]
          title: string
          type: string
          user_id: string | null
        }
        Insert: {
          company_id?: string | null
          created_at?: string
          description?: string | null
          entity_id?: string | null
          entity_type?: string | null
          id?: string
          metadata?: Json
          priority?: Database["public"]["Enums"]["activity_priority"]
          title: string
          type: string
          user_id?: string | null
        }
        Update: {
          company_id?: string | null
          created_at?: string
          description?: string | null
          entity_id?: string | null
          entity_type?: string | null
          id?: string
          metadata?: Json
          priority?: Database["public"]["Enums"]["activity_priority"]
          title?: string
          type?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "activities_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      ai_agents: {
        Row: {
          archived: boolean
          channels: string[]
          company_id: string
          config: Json
          created_at: string
          created_by: string | null
          description: string | null
          id: string
          kind: Database["public"]["Enums"]["ai_agent_kind"]
          language: string
          model: string | null
          name: string
          status: Database["public"]["Enums"]["ai_agent_status"]
          system_prompt: string | null
          updated_at: string
        }
        Insert: {
          archived?: boolean
          channels?: string[]
          company_id: string
          config?: Json
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          kind?: Database["public"]["Enums"]["ai_agent_kind"]
          language?: string
          model?: string | null
          name: string
          status?: Database["public"]["Enums"]["ai_agent_status"]
          system_prompt?: string | null
          updated_at?: string
        }
        Update: {
          archived?: boolean
          channels?: string[]
          company_id?: string
          config?: Json
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          kind?: Database["public"]["Enums"]["ai_agent_kind"]
          language?: string
          model?: string | null
          name?: string
          status?: Database["public"]["Enums"]["ai_agent_status"]
          system_prompt?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "ai_agents_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      ai_chat_messages: {
        Row: {
          created_at: string
          id: string
          locale: string | null
          message: string
          sender: string
          session_id: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          locale?: string | null
          message: string
          sender: string
          session_id: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          locale?: string | null
          message?: string
          sender?: string
          session_id?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      companies: {
        Row: {
          created_at: string
          id: string
          industry: string | null
          locale: string
          logo_url: string | null
          name: string
          owner_id: string
          slug: string | null
          updated_at: string
          website: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          industry?: string | null
          locale?: string
          logo_url?: string | null
          name: string
          owner_id: string
          slug?: string | null
          updated_at?: string
          website?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          industry?: string | null
          locale?: string
          logo_url?: string | null
          name?: string
          owner_id?: string
          slug?: string | null
          updated_at?: string
          website?: string | null
        }
        Relationships: []
      }
      company_members: {
        Row: {
          company_id: string
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          updated_at: string
          user_id: string
        }
        Insert: {
          company_id: string
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          updated_at?: string
          user_id: string
        }
        Update: {
          company_id?: string
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "company_members_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      contact_submissions: {
        Row: {
          company: string | null
          created_at: string
          email: string
          id: string
          locale: string | null
          message: string
          name: string
          phone: string | null
          subject: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          company?: string | null
          created_at?: string
          email: string
          id?: string
          locale?: string | null
          message: string
          name: string
          phone?: string | null
          subject?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          company?: string | null
          created_at?: string
          email?: string
          id?: string
          locale?: string | null
          message?: string
          name?: string
          phone?: string | null
          subject?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      crm_lead_activities: {
        Row: {
          company_id: string | null
          created_at: string
          id: string
          lead_id: string
          title: string
          user_id: string
        }
        Insert: {
          company_id?: string | null
          created_at?: string
          id?: string
          lead_id: string
          title: string
          user_id: string
        }
        Update: {
          company_id?: string | null
          created_at?: string
          id?: string
          lead_id?: string
          title?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "crm_lead_activities_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "crm_lead_activities_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "crm_leads"
            referencedColumns: ["id"]
          },
        ]
      }
      crm_leads: {
        Row: {
          agent: string | null
          archived: boolean
          company: string | null
          company_id: string | null
          created_at: string
          email: string | null
          id: string
          last_activity_at: string
          name: string
          notes: string | null
          phone: string | null
          status: string
          tags: string[]
          updated_at: string
          user_id: string
          value: number
        }
        Insert: {
          agent?: string | null
          archived?: boolean
          company?: string | null
          company_id?: string | null
          created_at?: string
          email?: string | null
          id?: string
          last_activity_at?: string
          name: string
          notes?: string | null
          phone?: string | null
          status?: string
          tags?: string[]
          updated_at?: string
          user_id: string
          value?: number
        }
        Update: {
          agent?: string | null
          archived?: boolean
          company?: string | null
          company_id?: string | null
          created_at?: string
          email?: string | null
          id?: string
          last_activity_at?: string
          name?: string
          notes?: string | null
          phone?: string | null
          status?: string
          tags?: string[]
          updated_at?: string
          user_id?: string
          value?: number
        }
        Relationships: [
          {
            foreignKeyName: "crm_leads_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      demo_bookings: {
        Row: {
          company: string | null
          created_at: string
          email: string
          id: string
          locale: string | null
          message: string | null
          name: string
          phone: string | null
          service: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          company?: string | null
          created_at?: string
          email: string
          id?: string
          locale?: string | null
          message?: string | null
          name: string
          phone?: string | null
          service?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          company?: string | null
          created_at?: string
          email?: string
          id?: string
          locale?: string | null
          message?: string | null
          name?: string
          phone?: string | null
          service?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      file_objects: {
        Row: {
          bucket: string
          company_id: string | null
          created_at: string
          entity_id: string | null
          entity_type: string | null
          id: string
          kind: Database["public"]["Enums"]["file_kind"]
          metadata: Json
          mime_type: string | null
          name: string
          path: string
          size_bytes: number | null
          user_id: string
        }
        Insert: {
          bucket: string
          company_id?: string | null
          created_at?: string
          entity_id?: string | null
          entity_type?: string | null
          id?: string
          kind?: Database["public"]["Enums"]["file_kind"]
          metadata?: Json
          mime_type?: string | null
          name: string
          path: string
          size_bytes?: number | null
          user_id: string
        }
        Update: {
          bucket?: string
          company_id?: string | null
          created_at?: string
          entity_id?: string | null
          entity_type?: string | null
          id?: string
          kind?: Database["public"]["Enums"]["file_kind"]
          metadata?: Json
          mime_type?: string | null
          name?: string
          path?: string
          size_bytes?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "file_objects_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      newsletter_subscribers: {
        Row: {
          created_at: string
          email: string
          id: string
          locale: string | null
          source: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          locale?: string | null
          source?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          locale?: string | null
          source?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      notifications: {
        Row: {
          body: string | null
          category: string
          company_id: string | null
          created_at: string
          entity_id: string | null
          entity_type: string | null
          id: string
          link: string | null
          metadata: Json
          priority: Database["public"]["Enums"]["activity_priority"]
          read_at: string | null
          status: Database["public"]["Enums"]["notification_status"]
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          body?: string | null
          category: string
          company_id?: string | null
          created_at?: string
          entity_id?: string | null
          entity_type?: string | null
          id?: string
          link?: string | null
          metadata?: Json
          priority?: Database["public"]["Enums"]["activity_priority"]
          read_at?: string | null
          status?: Database["public"]["Enums"]["notification_status"]
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          body?: string | null
          category?: string
          company_id?: string | null
          created_at?: string
          entity_id?: string | null
          entity_type?: string | null
          id?: string
          link?: string | null
          metadata?: Json
          priority?: Database["public"]["Enums"]["activity_priority"]
          read_at?: string | null
          status?: Database["public"]["Enums"]["notification_status"]
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          company: string | null
          created_at: string
          full_name: string | null
          id: string
          phone: string | null
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          company?: string | null
          created_at?: string
          full_name?: string | null
          id: string
          phone?: string | null
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          company?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          phone?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      workflow_run_steps: {
        Row: {
          created_at: string
          error: string | null
          finished_at: string | null
          id: string
          label: string | null
          order_index: number
          output: Json
          run_id: string
          started_at: string | null
          status: Database["public"]["Enums"]["workflow_status"]
          step_key: string
        }
        Insert: {
          created_at?: string
          error?: string | null
          finished_at?: string | null
          id?: string
          label?: string | null
          order_index?: number
          output?: Json
          run_id: string
          started_at?: string | null
          status?: Database["public"]["Enums"]["workflow_status"]
          step_key: string
        }
        Update: {
          created_at?: string
          error?: string | null
          finished_at?: string | null
          id?: string
          label?: string | null
          order_index?: number
          output?: Json
          run_id?: string
          started_at?: string | null
          status?: Database["public"]["Enums"]["workflow_status"]
          step_key?: string
        }
        Relationships: [
          {
            foreignKeyName: "workflow_run_steps_run_id_fkey"
            columns: ["run_id"]
            isOneToOne: false
            referencedRelation: "workflow_runs"
            referencedColumns: ["id"]
          },
        ]
      }
      workflow_runs: {
        Row: {
          company_id: string | null
          created_at: string
          error: string | null
          finished_at: string | null
          id: string
          input: Json
          output: Json
          started_at: string
          status: Database["public"]["Enums"]["workflow_status"]
          trigger_source: string | null
          updated_at: string
          user_id: string | null
          workflow_key: string
        }
        Insert: {
          company_id?: string | null
          created_at?: string
          error?: string | null
          finished_at?: string | null
          id?: string
          input?: Json
          output?: Json
          started_at?: string
          status?: Database["public"]["Enums"]["workflow_status"]
          trigger_source?: string | null
          updated_at?: string
          user_id?: string | null
          workflow_key: string
        }
        Update: {
          company_id?: string | null
          created_at?: string
          error?: string | null
          finished_at?: string | null
          id?: string
          input?: Json
          output?: Json
          started_at?: string
          status?: Database["public"]["Enums"]["workflow_status"]
          trigger_source?: string | null
          updated_at?: string
          user_id?: string | null
          workflow_key?: string
        }
        Relationships: [
          {
            foreignKeyName: "workflow_runs_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_company_role: {
        Args: {
          _company_id: string
          _roles: Database["public"]["Enums"]["app_role"][]
          _user_id: string
        }
        Returns: boolean
      }
      is_company_member: {
        Args: { _company_id: string; _user_id: string }
        Returns: boolean
      }
      storage_company_id: { Args: { _name: string }; Returns: string }
    }
    Enums: {
      activity_priority: "low" | "normal" | "high" | "critical"
      ai_agent_kind:
        | "chat"
        | "voice"
        | "whatsapp"
        | "instagram"
        | "email"
        | "document"
        | "scheduling"
      ai_agent_status: "draft" | "training" | "active" | "paused" | "error"
      app_role: "owner" | "admin" | "manager" | "employee"
      file_kind:
        | "company_logo"
        | "crm_attachment"
        | "document"
        | "image"
        | "ai_file"
        | "avatar"
      notification_status: "unread" | "read" | "archived"
      workflow_status:
        | "pending"
        | "running"
        | "completed"
        | "failed"
        | "cancelled"
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
      activity_priority: ["low", "normal", "high", "critical"],
      ai_agent_kind: [
        "chat",
        "voice",
        "whatsapp",
        "instagram",
        "email",
        "document",
        "scheduling",
      ],
      ai_agent_status: ["draft", "training", "active", "paused", "error"],
      app_role: ["owner", "admin", "manager", "employee"],
      file_kind: [
        "company_logo",
        "crm_attachment",
        "document",
        "image",
        "ai_file",
        "avatar",
      ],
      notification_status: ["unread", "read", "archived"],
      workflow_status: [
        "pending",
        "running",
        "completed",
        "failed",
        "cancelled",
      ],
    },
  },
} as const
