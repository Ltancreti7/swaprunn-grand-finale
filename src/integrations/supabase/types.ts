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
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      assignments: {
        Row: {
          accepted_at: string | null
          created_at: string | null
          driver_id: string | null
          ended_at: string | null
          id: string
          job_id: string | null
          started_at: string | null
        }
        Insert: {
          accepted_at?: string | null
          created_at?: string | null
          driver_id?: string | null
          ended_at?: string | null
          id?: string
          job_id?: string | null
          started_at?: string | null
        }
        Update: {
          accepted_at?: string | null
          created_at?: string | null
          driver_id?: string | null
          ended_at?: string | null
          id?: string
          job_id?: string | null
          started_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "assignments_driver_id_fkey"
            columns: ["driver_id"]
            isOneToOne: false
            referencedRelation: "drivers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "assignments_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "jobs"
            referencedColumns: ["id"]
          },
        ]
      }
      dealer_subscriptions: {
        Row: {
          billing_period_end: string | null
          billing_period_start: string | null
          created_at: string | null
          dealer_id: string | null
          id: string
          monthly_runs_limit: number
          plan_name: string
          price_cents: number
          runs_used_this_month: number | null
          status: string | null
          stripe_subscription_id: string | null
          updated_at: string | null
        }
        Insert: {
          billing_period_end?: string | null
          billing_period_start?: string | null
          created_at?: string | null
          dealer_id?: string | null
          id?: string
          monthly_runs_limit: number
          plan_name: string
          price_cents: number
          runs_used_this_month?: number | null
          status?: string | null
          stripe_subscription_id?: string | null
          updated_at?: string | null
        }
        Update: {
          billing_period_end?: string | null
          billing_period_start?: string | null
          created_at?: string | null
          dealer_id?: string | null
          id?: string
          monthly_runs_limit?: number
          plan_name?: string
          price_cents?: number
          runs_used_this_month?: number | null
          status?: string | null
          stripe_subscription_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "dealer_subscriptions_dealer_id_fkey"
            columns: ["dealer_id"]
            isOneToOne: false
            referencedRelation: "dealers"
            referencedColumns: ["id"]
          },
        ]
      }
      dealers: {
        Row: {
          created_at: string | null
          email: string | null
          id: string
          name: string
          plan: string | null
          position: string | null
          profile_photo_url: string | null
          status: string | null
          store: string | null
          stripe_customer_id: string | null
          stripe_subscription_id: string | null
        }
        Insert: {
          created_at?: string | null
          email?: string | null
          id?: string
          name: string
          plan?: string | null
          position?: string | null
          profile_photo_url?: string | null
          status?: string | null
          store?: string | null
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string | null
          id?: string
          name?: string
          plan?: string | null
          position?: string | null
          profile_photo_url?: string | null
          status?: string | null
          store?: string | null
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
        }
        Relationships: []
      }
      dealership_staff: {
        Row: {
          created_at: string | null
          dealer_id: string
          id: string
          invited_at: string | null
          invited_by: string | null
          is_active: boolean | null
          joined_at: string | null
          role: Database["public"]["Enums"]["dealership_role"]
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          dealer_id: string
          id?: string
          invited_at?: string | null
          invited_by?: string | null
          is_active?: boolean | null
          joined_at?: string | null
          role?: Database["public"]["Enums"]["dealership_role"]
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          dealer_id?: string
          id?: string
          invited_at?: string | null
          invited_by?: string | null
          is_active?: boolean | null
          joined_at?: string | null
          role?: Database["public"]["Enums"]["dealership_role"]
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "dealership_staff_dealer_id_fkey"
            columns: ["dealer_id"]
            isOneToOne: false
            referencedRelation: "dealers"
            referencedColumns: ["id"]
          },
        ]
      }
      drivers: {
        Row: {
          available: boolean | null
          checkr_candidate_id: string | null
          checkr_status: string | null
          city_ok: boolean | null
          created_at: string | null
          email: string | null
          id: string
          last_seen_jobs_at: string | null
          max_miles: number | null
          name: string
          phone: string | null
          profile_photo_url: string | null
          rating_avg: number | null
          rating_count: number | null
          stripe_connect_id: string | null
        }
        Insert: {
          available?: boolean | null
          checkr_candidate_id?: string | null
          checkr_status?: string | null
          city_ok?: boolean | null
          created_at?: string | null
          email?: string | null
          id?: string
          last_seen_jobs_at?: string | null
          max_miles?: number | null
          name: string
          phone?: string | null
          profile_photo_url?: string | null
          rating_avg?: number | null
          rating_count?: number | null
          stripe_connect_id?: string | null
        }
        Update: {
          available?: boolean | null
          checkr_candidate_id?: string | null
          checkr_status?: string | null
          city_ok?: boolean | null
          created_at?: string | null
          email?: string | null
          id?: string
          last_seen_jobs_at?: string | null
          max_miles?: number | null
          name?: string
          phone?: string | null
          profile_photo_url?: string | null
          rating_avg?: number | null
          rating_count?: number | null
          stripe_connect_id?: string | null
        }
        Relationships: []
      }
      job_messages: {
        Row: {
          assignment_id: string | null
          created_at: string | null
          id: string
          job_id: string | null
          message: string
          metadata: Json | null
          read_at: string | null
          sender_id: string
          sender_type: string
        }
        Insert: {
          assignment_id?: string | null
          created_at?: string | null
          id?: string
          job_id?: string | null
          message: string
          metadata?: Json | null
          read_at?: string | null
          sender_id: string
          sender_type: string
        }
        Update: {
          assignment_id?: string | null
          created_at?: string | null
          id?: string
          job_id?: string | null
          message?: string
          metadata?: Json | null
          read_at?: string | null
          sender_id?: string
          sender_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "job_messages_assignment_id_fkey"
            columns: ["assignment_id"]
            isOneToOne: false
            referencedRelation: "assignments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "job_messages_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "jobs"
            referencedColumns: ["id"]
          },
        ]
      }
      jobs: {
        Row: {
          created_at: string | null
          customer_address: string | null
          customer_name: string | null
          customer_phone: string | null
          dealer_id: string | null
          delivery_address: string | null
          distance_miles: number | null
          id: string
          make: string | null
          model: string | null
          notes: string | null
          pickup_address: string | null
          requires_two: boolean | null
          specific_date: string | null
          specific_time: string | null
          status: string | null
          timeframe: string | null
          track_token: string | null
          transmission: string | null
          type: Database["public"]["Enums"]["job_type"]
          vin: string | null
          year: number | null
        }
        Insert: {
          created_at?: string | null
          customer_address?: string | null
          customer_name?: string | null
          customer_phone?: string | null
          dealer_id?: string | null
          delivery_address?: string | null
          distance_miles?: number | null
          id?: string
          make?: string | null
          model?: string | null
          notes?: string | null
          pickup_address?: string | null
          requires_two?: boolean | null
          specific_date?: string | null
          specific_time?: string | null
          status?: string | null
          timeframe?: string | null
          track_token?: string | null
          transmission?: string | null
          type?: Database["public"]["Enums"]["job_type"]
          vin?: string | null
          year?: number | null
        }
        Update: {
          created_at?: string | null
          customer_address?: string | null
          customer_name?: string | null
          customer_phone?: string | null
          dealer_id?: string | null
          delivery_address?: string | null
          distance_miles?: number | null
          id?: string
          make?: string | null
          model?: string | null
          notes?: string | null
          pickup_address?: string | null
          requires_two?: boolean | null
          specific_date?: string | null
          specific_time?: string | null
          status?: string | null
          timeframe?: string | null
          track_token?: string | null
          transmission?: string | null
          type?: Database["public"]["Enums"]["job_type"]
          vin?: string | null
          year?: number | null
        }
        Relationships: []
      }
      notifications: {
        Row: {
          alert_sent_at: string
          created_at: string
          dealer_name: string
          id: string
          position: string | null
          store: string | null
        }
        Insert: {
          alert_sent_at?: string
          created_at?: string
          dealer_name: string
          id?: string
          position?: string | null
          store?: string | null
        }
        Update: {
          alert_sent_at?: string
          created_at?: string
          dealer_name?: string
          id?: string
          position?: string | null
          store?: string | null
        }
        Relationships: []
      }
      payouts: {
        Row: {
          amount_cents: number
          assignment_id: string | null
          created_at: string | null
          driver_id: string | null
          id: string
          status: string | null
          stripe_transfer_id: string | null
        }
        Insert: {
          amount_cents: number
          assignment_id?: string | null
          created_at?: string | null
          driver_id?: string | null
          id?: string
          status?: string | null
          stripe_transfer_id?: string | null
        }
        Update: {
          amount_cents?: number
          assignment_id?: string | null
          created_at?: string | null
          driver_id?: string | null
          id?: string
          status?: string | null
          stripe_transfer_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "payouts_assignment_id_fkey"
            columns: ["assignment_id"]
            isOneToOne: false
            referencedRelation: "assignments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payouts_driver_id_fkey"
            columns: ["driver_id"]
            isOneToOne: false
            referencedRelation: "drivers"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string | null
          dealer_id: string | null
          driver_id: string | null
          id: string
          updated_at: string | null
          user_id: string | null
          user_type: string
        }
        Insert: {
          created_at?: string | null
          dealer_id?: string | null
          driver_id?: string | null
          id?: string
          updated_at?: string | null
          user_id?: string | null
          user_type: string
        }
        Update: {
          created_at?: string | null
          dealer_id?: string | null
          driver_id?: string | null
          id?: string
          updated_at?: string | null
          user_id?: string | null
          user_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "profiles_dealer_id_fkey"
            columns: ["dealer_id"]
            isOneToOne: false
            referencedRelation: "dealers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "profiles_driver_id_fkey"
            columns: ["driver_id"]
            isOneToOne: false
            referencedRelation: "drivers"
            referencedColumns: ["id"]
          },
        ]
      }
      ratings: {
        Row: {
          assignment_id: string | null
          comment: string | null
          created_at: string | null
          id: string
          stars: number | null
        }
        Insert: {
          assignment_id?: string | null
          comment?: string | null
          created_at?: string | null
          id?: string
          stars?: number | null
        }
        Update: {
          assignment_id?: string | null
          comment?: string | null
          created_at?: string | null
          id?: string
          stars?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "ratings_assignment_id_fkey"
            columns: ["assignment_id"]
            isOneToOne: false
            referencedRelation: "assignments"
            referencedColumns: ["id"]
          },
        ]
      }
      staff_invitations: {
        Row: {
          accepted_at: string | null
          created_at: string | null
          dealer_id: string
          email: string
          expires_at: string | null
          id: string
          invite_token: string
          invited_by: string | null
          role: Database["public"]["Enums"]["dealership_role"]
        }
        Insert: {
          accepted_at?: string | null
          created_at?: string | null
          dealer_id: string
          email: string
          expires_at?: string | null
          id?: string
          invite_token?: string
          invited_by?: string | null
          role?: Database["public"]["Enums"]["dealership_role"]
        }
        Update: {
          accepted_at?: string | null
          created_at?: string | null
          dealer_id?: string
          email?: string
          expires_at?: string | null
          id?: string
          invite_token?: string
          invited_by?: string | null
          role?: Database["public"]["Enums"]["dealership_role"]
        }
        Relationships: [
          {
            foreignKeyName: "staff_invitations_dealer_id_fkey"
            columns: ["dealer_id"]
            isOneToOne: false
            referencedRelation: "dealers"
            referencedColumns: ["id"]
          },
        ]
      }
      timesheets: {
        Row: {
          assignment_id: string | null
          created_at: string | null
          driver_id: string | null
          ended_at: string | null
          id: string
          job_id: string | null
          pay_rate_cents: number | null
          started_at: string | null
          total_seconds: number | null
        }
        Insert: {
          assignment_id?: string | null
          created_at?: string | null
          driver_id?: string | null
          ended_at?: string | null
          id?: string
          job_id?: string | null
          pay_rate_cents?: number | null
          started_at?: string | null
          total_seconds?: number | null
        }
        Update: {
          assignment_id?: string | null
          created_at?: string | null
          driver_id?: string | null
          ended_at?: string | null
          id?: string
          job_id?: string | null
          pay_rate_cents?: number | null
          started_at?: string | null
          total_seconds?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "timesheets_assignment_id_fkey"
            columns: ["assignment_id"]
            isOneToOne: false
            referencedRelation: "assignments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "timesheets_driver_id_fkey"
            columns: ["driver_id"]
            isOneToOne: false
            referencedRelation: "drivers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "timesheets_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "jobs"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      accept_staff_invitation: {
        Args: { p_invite_token: string }
        Returns: Json
      }
      create_profile_for_current_user: {
        Args: {
          _company_name?: string
          _name?: string
          _phone?: string
          _user_type: string
        }
        Returns: {
          created_at: string | null
          dealer_id: string | null
          driver_id: string | null
          id: string
          updated_at: string | null
          user_id: string | null
          user_type: string
        }
      }
      get_job_by_tracking_token: {
        Args: { token: string }
        Returns: {
          created_at: string
          delivery_address: string
          id: string
          pickup_address: string
          status: string
          track_token: string
          type: Database["public"]["Enums"]["job_type"]
        }[]
      }
      get_open_jobs_for_drivers: {
        Args: Record<PropertyKey, never>
        Returns: {
          created_at: string
          customer_name: string
          customer_phone: string
          dealer_name: string
          dealer_store: string
          delivery_address: string
          distance_miles: number
          estimated_pay_cents: number
          id: string
          make: string
          model: string
          notes: string
          pickup_address: string
          requires_two: boolean
          status: string
          track_token: string
          type: Database["public"]["Enums"]["job_type"]
          vin: string
          year: number
        }[]
      }
      get_user_dealership_role: {
        Args: { p_dealer_id: string; p_user_id: string }
        Returns: Database["public"]["Enums"]["dealership_role"]
      }
      get_user_profile: {
        Args: Record<PropertyKey, never>
        Returns: {
          dealer_id: string
          driver_id: string
          user_type: string
        }[]
      }
      insert_driver_safely: {
        Args: { payload: Json }
        Returns: undefined
      }
      pay_rate_for_distance: {
        Args: { miles: number }
        Returns: number
      }
      reset_monthly_usage: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      switch_profile_user_type: {
        Args: {
          _company_name?: string
          _name?: string
          _new_type: string
          _phone?: string
        }
        Returns: {
          created_at: string | null
          dealer_id: string | null
          driver_id: string | null
          id: string
          updated_at: string | null
          user_id: string | null
          user_type: string
        }
      }
      user_has_dealership_permission: {
        Args: {
          p_dealer_id: string
          p_min_role: Database["public"]["Enums"]["dealership_role"]
          p_user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      dealership_role: "owner" | "manager" | "salesperson" | "staff"
      job_type: "delivery" | "swap"
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
      dealership_role: ["owner", "manager", "salesperson", "staff"],
      job_type: ["delivery", "swap"],
    },
  },
} as const
