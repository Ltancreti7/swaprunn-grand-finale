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
          add_ons: Json | null
          base_price_cents: number | null
          billing_period_end: string | null
          billing_period_start: string | null
          billing_status: string | null
          created_at: string | null
          dealer_id: string | null
          id: string
          last_billing_date: string | null
          monthly_runs_limit: number
          per_swap_price_cents: number | null
          plan_name: string
          price_cents: number
          runs_used_this_month: number | null
          status: string | null
          stripe_metered_price_id: string | null
          stripe_price_id: string | null
          stripe_subscription_id: string | null
          swaps_this_period: number | null
          updated_at: string | null
        }
        Insert: {
          add_ons?: Json | null
          base_price_cents?: number | null
          billing_period_end?: string | null
          billing_period_start?: string | null
          billing_status?: string | null
          created_at?: string | null
          dealer_id?: string | null
          id?: string
          last_billing_date?: string | null
          monthly_runs_limit: number
          per_swap_price_cents?: number | null
          plan_name: string
          price_cents: number
          runs_used_this_month?: number | null
          status?: string | null
          stripe_metered_price_id?: string | null
          stripe_price_id?: string | null
          stripe_subscription_id?: string | null
          swaps_this_period?: number | null
          updated_at?: string | null
        }
        Update: {
          add_ons?: Json | null
          base_price_cents?: number | null
          billing_period_end?: string | null
          billing_period_start?: string | null
          billing_status?: string | null
          created_at?: string | null
          dealer_id?: string | null
          id?: string
          last_billing_date?: string | null
          monthly_runs_limit?: number
          per_swap_price_cents?: number | null
          plan_name?: string
          price_cents?: number
          runs_used_this_month?: number | null
          status?: string | null
          stripe_metered_price_id?: string | null
          stripe_price_id?: string | null
          stripe_subscription_id?: string | null
          swaps_this_period?: number | null
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
          city: string | null
          created_at: string | null
          dealership_code: string | null
          dealership_type: string | null
          email: string | null
          id: string
          name: string
          phone: string | null
          plan: string | null
          position: string | null
          profile_photo_url: string | null
          state: string | null
          status: string | null
          store: string | null
          street: string | null
          stripe_customer_id: string | null
          stripe_subscription_id: string | null
          updated_at: string | null
          website: string | null
          zip: string | null
        }
        Insert: {
          city?: string | null
          created_at?: string | null
          dealership_code?: string | null
          dealership_type?: string | null
          email?: string | null
          id?: string
          name: string
          phone?: string | null
          plan?: string | null
          position?: string | null
          profile_photo_url?: string | null
          state?: string | null
          status?: string | null
          store?: string | null
          street?: string | null
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          updated_at?: string | null
          website?: string | null
          zip?: string | null
        }
        Update: {
          city?: string | null
          created_at?: string | null
          dealership_code?: string | null
          dealership_type?: string | null
          email?: string | null
          id?: string
          name?: string
          phone?: string | null
          plan?: string | null
          position?: string | null
          profile_photo_url?: string | null
          state?: string | null
          status?: string | null
          store?: string | null
          street?: string | null
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          updated_at?: string | null
          website?: string | null
          zip?: string | null
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
      driver_requests: {
        Row: {
          completion_time: string | null
          contact_email: string | null
          contact_name: string | null
          contact_phone: string | null
          created_at: string | null
          departure_time: string | null
          destination_address: string
          destination_dealer_name: string
          driver_id: string | null
          driver_name: string | null
          estimated_arrival_time: string | null
          fuel_level: string | null
          id: string
          incoming_make: string | null
          incoming_model: string | null
          incoming_stock_number: string | null
          incoming_vin: string
          incoming_year: number | null
          notes: string | null
          outgoing_make: string | null
          outgoing_model: string | null
          outgoing_stock_number: string | null
          outgoing_vin: string
          outgoing_year: number | null
          photo_urls: string[] | null
          reason_for_swap: string | null
          request_timestamp: string | null
          requester_id: string | null
          requester_name: string | null
          signature_url: string | null
          special_instructions: string | null
          status: string | null
          updated_at: string | null
          vehicle_condition: string | null
        }
        Insert: {
          completion_time?: string | null
          contact_email?: string | null
          contact_name?: string | null
          contact_phone?: string | null
          created_at?: string | null
          departure_time?: string | null
          destination_address: string
          destination_dealer_name: string
          driver_id?: string | null
          driver_name?: string | null
          estimated_arrival_time?: string | null
          fuel_level?: string | null
          id?: string
          incoming_make?: string | null
          incoming_model?: string | null
          incoming_stock_number?: string | null
          incoming_vin: string
          incoming_year?: number | null
          notes?: string | null
          outgoing_make?: string | null
          outgoing_model?: string | null
          outgoing_stock_number?: string | null
          outgoing_vin: string
          outgoing_year?: number | null
          photo_urls?: string[] | null
          reason_for_swap?: string | null
          request_timestamp?: string | null
          requester_id?: string | null
          requester_name?: string | null
          signature_url?: string | null
          special_instructions?: string | null
          status?: string | null
          updated_at?: string | null
          vehicle_condition?: string | null
        }
        Update: {
          completion_time?: string | null
          contact_email?: string | null
          contact_name?: string | null
          contact_phone?: string | null
          created_at?: string | null
          departure_time?: string | null
          destination_address?: string
          destination_dealer_name?: string
          driver_id?: string | null
          driver_name?: string | null
          estimated_arrival_time?: string | null
          fuel_level?: string | null
          id?: string
          incoming_make?: string | null
          incoming_model?: string | null
          incoming_stock_number?: string | null
          incoming_vin?: string
          incoming_year?: number | null
          notes?: string | null
          outgoing_make?: string | null
          outgoing_model?: string | null
          outgoing_stock_number?: string | null
          outgoing_vin?: string
          outgoing_year?: number | null
          photo_urls?: string[] | null
          reason_for_swap?: string | null
          request_timestamp?: string | null
          requester_id?: string | null
          requester_name?: string | null
          signature_url?: string | null
          special_instructions?: string | null
          status?: string | null
          updated_at?: string | null
          vehicle_condition?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "driver_requests_driver_id_fkey"
            columns: ["driver_id"]
            isOneToOne: false
            referencedRelation: "drivers"
            referencedColumns: ["id"]
          },
        ]
      }
      driver_verifications: {
        Row: {
          created_at: string | null
          driver_id: string | null
          expires_at: string | null
          id: string
          metadata: Json | null
          status: string | null
          updated_at: string | null
          verification_type: Database["public"]["Enums"]["verification_type"]
          verified_at: string | null
        }
        Insert: {
          created_at?: string | null
          driver_id?: string | null
          expires_at?: string | null
          id?: string
          metadata?: Json | null
          status?: string | null
          updated_at?: string | null
          verification_type: Database["public"]["Enums"]["verification_type"]
          verified_at?: string | null
        }
        Update: {
          created_at?: string | null
          driver_id?: string | null
          expires_at?: string | null
          id?: string
          metadata?: Json | null
          status?: string | null
          updated_at?: string | null
          verification_type?: Database["public"]["Enums"]["verification_type"]
          verified_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "driver_verifications_driver_id_fkey"
            columns: ["driver_id"]
            isOneToOne: false
            referencedRelation: "drivers"
            referencedColumns: ["id"]
          },
        ]
      }
      drivers: {
        Row: {
          available: boolean | null
          background_check_verified: boolean | null
          checkr_candidate_id: string | null
          checkr_status: string | null
          city_ok: boolean | null
          created_at: string | null
          day_off: string | null
          email: string | null
          email_verified: boolean | null
          id: string
          last_seen_jobs_at: string | null
          max_miles: number | null
          name: string
          phone: string | null
          phone_verified: boolean | null
          profile_completion_percentage: number | null
          profile_photo_url: string | null
          rating_avg: number | null
          rating_count: number | null
          stripe_connect_id: string | null
          trust_score: number | null
          updated_at: string | null
        }
        Insert: {
          available?: boolean | null
          background_check_verified?: boolean | null
          checkr_candidate_id?: string | null
          checkr_status?: string | null
          city_ok?: boolean | null
          created_at?: string | null
          day_off?: string | null
          email?: string | null
          email_verified?: boolean | null
          id?: string
          last_seen_jobs_at?: string | null
          max_miles?: number | null
          name: string
          phone?: string | null
          phone_verified?: boolean | null
          profile_completion_percentage?: number | null
          profile_photo_url?: string | null
          rating_avg?: number | null
          rating_count?: number | null
          stripe_connect_id?: string | null
          trust_score?: number | null
          updated_at?: string | null
        }
        Update: {
          available?: boolean | null
          background_check_verified?: boolean | null
          checkr_candidate_id?: string | null
          checkr_status?: string | null
          city_ok?: boolean | null
          created_at?: string | null
          day_off?: string | null
          email?: string | null
          email_verified?: boolean | null
          id?: string
          last_seen_jobs_at?: string | null
          max_miles?: number | null
          name?: string
          phone?: string | null
          phone_verified?: boolean | null
          profile_completion_percentage?: number | null
          profile_photo_url?: string | null
          rating_avg?: number | null
          rating_count?: number | null
          stripe_connect_id?: string | null
          trust_score?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      emergency_contacts: {
        Row: {
          contact_name: string
          contact_phone: string
          created_at: string | null
          driver_id: string | null
          id: string
          is_primary: boolean | null
          relationship: string | null
        }
        Insert: {
          contact_name: string
          contact_phone: string
          created_at?: string | null
          driver_id?: string | null
          id?: string
          is_primary?: boolean | null
          relationship?: string | null
        }
        Update: {
          contact_name?: string
          contact_phone?: string
          created_at?: string | null
          driver_id?: string | null
          id?: string
          is_primary?: boolean | null
          relationship?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "emergency_contacts_driver_id_fkey"
            columns: ["driver_id"]
            isOneToOne: false
            referencedRelation: "drivers"
            referencedColumns: ["id"]
          },
        ]
      }
      form_submissions: {
        Row: {
          created_at: string
          email: string
          error_message: string | null
          form_type: string
          id: string
          message: string | null
          metadata: Json | null
          name: string
          status: string
          timestamp: string
        }
        Insert: {
          created_at?: string
          email: string
          error_message?: string | null
          form_type: string
          id?: string
          message?: string | null
          metadata?: Json | null
          name: string
          status?: string
          timestamp?: string
        }
        Update: {
          created_at?: string
          email?: string
          error_message?: string | null
          form_type?: string
          id?: string
          message?: string | null
          metadata?: Json | null
          name?: string
          status?: string
          timestamp?: string
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
          created_by: string | null
          customer_address: string | null
          customer_name: string | null
          customer_phone: string | null
          dealer_id: string | null
          delivery_address: string | null
          delivery_lat: number | null
          delivery_lng: number | null
          distance_miles: number | null
          id: string
          make: string | null
          model: string | null
          notes: string | null
          pickup_address: string | null
          pickup_lat: number | null
          pickup_lng: number | null
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
          created_by?: string | null
          customer_address?: string | null
          customer_name?: string | null
          customer_phone?: string | null
          dealer_id?: string | null
          delivery_address?: string | null
          delivery_lat?: number | null
          delivery_lng?: number | null
          distance_miles?: number | null
          id?: string
          make?: string | null
          model?: string | null
          notes?: string | null
          pickup_address?: string | null
          pickup_lat?: number | null
          pickup_lng?: number | null
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
          created_by?: string | null
          customer_address?: string | null
          customer_name?: string | null
          customer_phone?: string | null
          dealer_id?: string | null
          delivery_address?: string | null
          delivery_lat?: number | null
          delivery_lng?: number | null
          distance_miles?: number | null
          id?: string
          make?: string | null
          model?: string | null
          notes?: string | null
          pickup_address?: string | null
          pickup_lat?: number | null
          pickup_lng?: number | null
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
      notification_logs: {
        Row: {
          body: string
          created_at: string | null
          id: string
          sent_count: number | null
          success: boolean | null
          title: string
          total_count: number | null
          type: string
          user_id: string | null
          user_type: string | null
        }
        Insert: {
          body: string
          created_at?: string | null
          id?: string
          sent_count?: number | null
          success?: boolean | null
          title: string
          total_count?: number | null
          type: string
          user_id?: string | null
          user_type?: string | null
        }
        Update: {
          body?: string
          created_at?: string | null
          id?: string
          sent_count?: number | null
          success?: boolean | null
          title?: string
          total_count?: number | null
          type?: string
          user_id?: string | null
          user_type?: string | null
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
          first_name: string | null
          full_name: string | null
          id: string
          last_name: string | null
          role: string | null
          swap_coordinator_id: string | null
          updated_at: string | null
          user_id: string | null
          user_type: string
        }
        Insert: {
          created_at?: string | null
          dealer_id?: string | null
          driver_id?: string | null
          first_name?: string | null
          full_name?: string | null
          id?: string
          last_name?: string | null
          role?: string | null
          swap_coordinator_id?: string | null
          updated_at?: string | null
          user_id?: string | null
          user_type: string
        }
        Update: {
          created_at?: string | null
          dealer_id?: string | null
          driver_id?: string | null
          first_name?: string | null
          full_name?: string | null
          id?: string
          last_name?: string | null
          role?: string | null
          swap_coordinator_id?: string | null
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
          {
            foreignKeyName: "profiles_swap_coordinator_id_fkey"
            columns: ["swap_coordinator_id"]
            isOneToOne: false
            referencedRelation: "swap_coordinators"
            referencedColumns: ["id"]
          },
        ]
      }
      push_subscriptions: {
        Row: {
          created_at: string | null
          id: string
          subscription: Json
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          subscription: Json
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          subscription?: Json
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
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
      reputation_metrics: {
        Row: {
          driver_id: string | null
          id: string
          job_id: string | null
          metric_type: string
          notes: string | null
          recorded_at: string | null
          score: number
        }
        Insert: {
          driver_id?: string | null
          id?: string
          job_id?: string | null
          metric_type: string
          notes?: string | null
          recorded_at?: string | null
          score: number
        }
        Update: {
          driver_id?: string | null
          id?: string
          job_id?: string | null
          metric_type?: string
          notes?: string | null
          recorded_at?: string | null
          score?: number
        }
        Relationships: [
          {
            foreignKeyName: "reputation_metrics_driver_id_fkey"
            columns: ["driver_id"]
            isOneToOne: false
            referencedRelation: "drivers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reputation_metrics_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "jobs"
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
      swap_coordinators: {
        Row: {
          created_at: string | null
          email: string | null
          id: string
          name: string
          phone: string | null
          profile_photo_url: string | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          email?: string | null
          id?: string
          name: string
          phone?: string | null
          profile_photo_url?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string | null
          id?: string
          name?: string
          phone?: string | null
          profile_photo_url?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      swap_usage_records: {
        Row: {
          assignment_id: string | null
          billed: boolean | null
          completed_at: string
          created_at: string | null
          dealer_id: string
          id: string
          job_id: string
          stripe_usage_record_id: string | null
        }
        Insert: {
          assignment_id?: string | null
          billed?: boolean | null
          completed_at?: string
          created_at?: string | null
          dealer_id: string
          id?: string
          job_id: string
          stripe_usage_record_id?: string | null
        }
        Update: {
          assignment_id?: string | null
          billed?: boolean | null
          completed_at?: string
          created_at?: string | null
          dealer_id?: string
          id?: string
          job_id?: string
          stripe_usage_record_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "swap_usage_records_assignment_id_fkey"
            columns: ["assignment_id"]
            isOneToOne: false
            referencedRelation: "assignments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "swap_usage_records_dealer_id_fkey"
            columns: ["dealer_id"]
            isOneToOne: false
            referencedRelation: "dealers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "swap_usage_records_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "jobs"
            referencedColumns: ["id"]
          },
        ]
      }
      swaps: {
        Row: {
          created_at: string | null
          delivery_address: string
          delivery_lat: number | null
          delivery_lng: number | null
          from_dealer: string
          id: string
          notes: string | null
          pickup_address: string
          pickup_lat: number | null
          pickup_lng: number | null
          status: string | null
          stock_number: string
          to_dealer: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          delivery_address: string
          delivery_lat?: number | null
          delivery_lng?: number | null
          from_dealer: string
          id?: string
          notes?: string | null
          pickup_address: string
          pickup_lat?: number | null
          pickup_lng?: number | null
          status?: string | null
          stock_number: string
          to_dealer: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          delivery_address?: string
          delivery_lat?: number | null
          delivery_lng?: number | null
          from_dealer?: string
          id?: string
          notes?: string | null
          pickup_address?: string
          pickup_lat?: number | null
          pickup_lng?: number | null
          status?: string | null
          stock_number?: string
          to_dealer?: string
          updated_at?: string | null
        }
        Relationships: []
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
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      vehicle_inspections: {
        Row: {
          assignment_id: string
          created_at: string
          id: string
          inspection_type: string
          job_id: string
          photo_urls: string[]
          updated_at: string
        }
        Insert: {
          assignment_id: string
          created_at?: string
          id?: string
          inspection_type?: string
          job_id: string
          photo_urls?: string[]
          updated_at?: string
        }
        Update: {
          assignment_id?: string
          created_at?: string
          id?: string
          inspection_type?: string
          job_id?: string
          photo_urls?: string[]
          updated_at?: string
        }
        Relationships: []
      }
      vehicle_masters: {
        Row: {
          created_at: string | null
          id: string
          make: string
          model: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          make: string
          model: string
        }
        Update: {
          created_at?: string | null
          id?: string
          make?: string
          model?: string
        }
        Relationships: []
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
          first_name: string | null
          full_name: string | null
          id: string
          last_name: string | null
          role: string | null
          swap_coordinator_id: string | null
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
          salesperson_name: string
          salesperson_phone: string
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
          swap_coordinator_id: string
          user_type: string
        }[]
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      insert_driver_safely: {
        Args: { payload: Json }
        Returns: undefined
      }
      pay_rate_for_distance: {
        Args: { miles: number }
        Returns: number
      }
      reset_billing_period: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      reset_monthly_usage: {
        Args: Record<PropertyKey, never>
        Returns: undefined
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
      app_role:
        | "admin"
        | "manager"
        | "staff"
        | "driver"
        | "dealer"
        | "swap_coordinator"
      dealership_role:
        | "owner"
        | "manager"
        | "salesperson"
        | "staff"
        | "sales"
        | "sales_manager"
        | "swap_manager"
        | "parts_manager"
        | "service_manager"
      job_type: "delivery" | "swap"
      verification_type:
        | "email"
        | "phone"
        | "background_check"
        | "photo_id"
        | "driver_license"
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
      app_role: [
        "admin",
        "manager",
        "staff",
        "driver",
        "dealer",
        "swap_coordinator",
      ],
      dealership_role: [
        "owner",
        "manager",
        "salesperson",
        "staff",
        "sales",
        "sales_manager",
        "swap_manager",
        "parts_manager",
        "service_manager",
      ],
      job_type: ["delivery", "swap"],
      verification_type: [
        "email",
        "phone",
        "background_check",
        "photo_id",
        "driver_license",
      ],
    },
  },
} as const
