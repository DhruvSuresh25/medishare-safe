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
      audit_logs: {
        Row: {
          action: string
          created_at: string | null
          id: string
          ip_address: string | null
          new_data: Json | null
          old_data: Json | null
          record_id: string | null
          table_name: string | null
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string | null
          id?: string
          ip_address?: string | null
          new_data?: Json | null
          old_data?: Json | null
          record_id?: string | null
          table_name?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string | null
          id?: string
          ip_address?: string | null
          new_data?: Json | null
          old_data?: Json | null
          record_id?: string | null
          table_name?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      banned_substances: {
        Row: {
          added_by: string | null
          category: string | null
          created_at: string | null
          id: string
          reason: string | null
          substance_name: string
        }
        Insert: {
          added_by?: string | null
          category?: string | null
          created_at?: string | null
          id?: string
          reason?: string | null
          substance_name: string
        }
        Update: {
          added_by?: string | null
          category?: string | null
          created_at?: string | null
          id?: string
          reason?: string | null
          substance_name?: string
        }
        Relationships: []
      }
      claims: {
        Row: {
          created_at: string | null
          id: string
          medicine_id: string
          notes: string | null
          quantity_claimed: number
          recipient_id: string
          status: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          medicine_id: string
          notes?: string | null
          quantity_claimed: number
          recipient_id: string
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          medicine_id?: string
          notes?: string | null
          quantity_claimed?: number
          recipient_id?: string
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "claims_medicine_id_fkey"
            columns: ["medicine_id"]
            isOneToOne: false
            referencedRelation: "medicines"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "claims_recipient_id_fkey"
            columns: ["recipient_id"]
            isOneToOne: false
            referencedRelation: "recipients"
            referencedColumns: ["id"]
          },
        ]
      }
      disposal_records: {
        Row: {
          certificate_url: string | null
          created_at: string | null
          created_by: string | null
          disposal_method: string | null
          disposal_partner: string | null
          disposal_reason: string
          disposed_at: string | null
          id: string
          medicine_id: string | null
        }
        Insert: {
          certificate_url?: string | null
          created_at?: string | null
          created_by?: string | null
          disposal_method?: string | null
          disposal_partner?: string | null
          disposal_reason: string
          disposed_at?: string | null
          id?: string
          medicine_id?: string | null
        }
        Update: {
          certificate_url?: string | null
          created_at?: string | null
          created_by?: string | null
          disposal_method?: string | null
          disposal_partner?: string | null
          disposal_reason?: string
          disposed_at?: string | null
          id?: string
          medicine_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "disposal_records_medicine_id_fkey"
            columns: ["medicine_id"]
            isOneToOne: false
            referencedRelation: "medicines"
            referencedColumns: ["id"]
          },
        ]
      }
      donation_receipts: {
        Row: {
          amount_equivalent: number | null
          created_at: string | null
          donor_id: string | null
          id: string
          issued_at: string | null
          medicine_id: string | null
          receipt_number: string
        }
        Insert: {
          amount_equivalent?: number | null
          created_at?: string | null
          donor_id?: string | null
          id?: string
          issued_at?: string | null
          medicine_id?: string | null
          receipt_number: string
        }
        Update: {
          amount_equivalent?: number | null
          created_at?: string | null
          donor_id?: string | null
          id?: string
          issued_at?: string | null
          medicine_id?: string | null
          receipt_number?: string
        }
        Relationships: [
          {
            foreignKeyName: "donation_receipts_medicine_id_fkey"
            columns: ["medicine_id"]
            isOneToOne: false
            referencedRelation: "medicines"
            referencedColumns: ["id"]
          },
        ]
      }
      medicine_images: {
        Row: {
          created_at: string | null
          id: string
          image_type: string | null
          image_url: string
          is_primary: boolean | null
          medicine_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          image_type?: string | null
          image_url: string
          is_primary?: boolean | null
          medicine_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          image_type?: string | null
          image_url?: string
          is_primary?: boolean | null
          medicine_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "medicine_images_medicine_id_fkey"
            columns: ["medicine_id"]
            isOneToOne: false
            referencedRelation: "medicines"
            referencedColumns: ["id"]
          },
        ]
      }
      medicines: {
        Row: {
          batch_number: string | null
          created_at: string | null
          donor_id: string | null
          drug_name: string
          expiry_date: string | null
          generic_name: string | null
          id: string
          is_original_packaging: boolean | null
          is_sealed: boolean | null
          manufacturer: string | null
          mrp: number | null
          notes: string | null
          ocr_raw_data: Json | null
          quantity: number
          rejection_reason: string | null
          schedule: Database["public"]["Enums"]["medicine_schedule"] | null
          selling_price: number | null
          status: Database["public"]["Enums"]["medicine_status"] | null
          unit: string | null
          updated_at: string | null
        }
        Insert: {
          batch_number?: string | null
          created_at?: string | null
          donor_id?: string | null
          drug_name: string
          expiry_date?: string | null
          generic_name?: string | null
          id?: string
          is_original_packaging?: boolean | null
          is_sealed?: boolean | null
          manufacturer?: string | null
          mrp?: number | null
          notes?: string | null
          ocr_raw_data?: Json | null
          quantity?: number
          rejection_reason?: string | null
          schedule?: Database["public"]["Enums"]["medicine_schedule"] | null
          selling_price?: number | null
          status?: Database["public"]["Enums"]["medicine_status"] | null
          unit?: string | null
          updated_at?: string | null
        }
        Update: {
          batch_number?: string | null
          created_at?: string | null
          donor_id?: string | null
          drug_name?: string
          expiry_date?: string | null
          generic_name?: string | null
          id?: string
          is_original_packaging?: boolean | null
          is_sealed?: boolean | null
          manufacturer?: string | null
          mrp?: number | null
          notes?: string | null
          ocr_raw_data?: Json | null
          quantity?: number
          rejection_reason?: string | null
          schedule?: Database["public"]["Enums"]["medicine_schedule"] | null
          selling_price?: number | null
          status?: Database["public"]["Enums"]["medicine_status"] | null
          unit?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      notifications: {
        Row: {
          action_url: string | null
          created_at: string | null
          id: string
          is_read: boolean | null
          message: string
          title: string
          type: string | null
          user_id: string
        }
        Insert: {
          action_url?: string | null
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          message: string
          title: string
          type?: string | null
          user_id: string
        }
        Update: {
          action_url?: string | null
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          message?: string
          title?: string
          type?: string | null
          user_id?: string
        }
        Relationships: []
      }
      pharmacists: {
        Row: {
          created_at: string | null
          id: string
          is_verified: boolean | null
          license_document_url: string | null
          license_number: string
          pharmacy_address: string | null
          pharmacy_name: string | null
          updated_at: string | null
          user_id: string
          verified_at: string | null
          verified_by: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_verified?: boolean | null
          license_document_url?: string | null
          license_number: string
          pharmacy_address?: string | null
          pharmacy_name?: string | null
          updated_at?: string | null
          user_id: string
          verified_at?: string | null
          verified_by?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          is_verified?: boolean | null
          license_document_url?: string | null
          license_number?: string
          pharmacy_address?: string | null
          pharmacy_name?: string | null
          updated_at?: string | null
          user_id?: string
          verified_at?: string | null
          verified_by?: string | null
        }
        Relationships: []
      }
      pickup_requests: {
        Row: {
          contact_name: string
          contact_phone: string
          created_at: string | null
          donor_id: string | null
          id: string
          medicine_id: string | null
          notes: string | null
          pickup_address: string
          pickup_city: string
          pickup_pincode: string
          pickup_state: string
          preferred_date: string | null
          preferred_time_slot: string | null
          qr_code: string | null
          recipient_id: string | null
          status: Database["public"]["Enums"]["pickup_status"] | null
          updated_at: string | null
        }
        Insert: {
          contact_name: string
          contact_phone: string
          created_at?: string | null
          donor_id?: string | null
          id?: string
          medicine_id?: string | null
          notes?: string | null
          pickup_address: string
          pickup_city: string
          pickup_pincode: string
          pickup_state: string
          preferred_date?: string | null
          preferred_time_slot?: string | null
          qr_code?: string | null
          recipient_id?: string | null
          status?: Database["public"]["Enums"]["pickup_status"] | null
          updated_at?: string | null
        }
        Update: {
          contact_name?: string
          contact_phone?: string
          created_at?: string | null
          donor_id?: string | null
          id?: string
          medicine_id?: string | null
          notes?: string | null
          pickup_address?: string
          pickup_city?: string
          pickup_pincode?: string
          pickup_state?: string
          preferred_date?: string | null
          preferred_time_slot?: string | null
          qr_code?: string | null
          recipient_id?: string | null
          status?: Database["public"]["Enums"]["pickup_status"] | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "pickup_requests_medicine_id_fkey"
            columns: ["medicine_id"]
            isOneToOne: false
            referencedRelation: "medicines"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pickup_requests_recipient_id_fkey"
            columns: ["recipient_id"]
            isOneToOne: false
            referencedRelation: "recipients"
            referencedColumns: ["id"]
          },
        ]
      }
      pickup_tracking: {
        Row: {
          created_at: string | null
          event_description: string | null
          event_type: string
          id: string
          location: string | null
          pickup_request_id: string
          scanned_by: string | null
        }
        Insert: {
          created_at?: string | null
          event_description?: string | null
          event_type: string
          id?: string
          location?: string | null
          pickup_request_id: string
          scanned_by?: string | null
        }
        Update: {
          created_at?: string | null
          event_description?: string | null
          event_type?: string
          id?: string
          location?: string | null
          pickup_request_id?: string
          scanned_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "pickup_tracking_pickup_request_id_fkey"
            columns: ["pickup_request_id"]
            isOneToOne: false
            referencedRelation: "pickup_requests"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          address: string | null
          avatar_url: string | null
          city: string | null
          created_at: string | null
          email: string | null
          full_name: string | null
          id: string
          id_document_url: string | null
          id_number: string | null
          id_type: string | null
          kyc_verified: boolean | null
          phone: string | null
          pincode: string | null
          state: string | null
          updated_at: string | null
        }
        Insert: {
          address?: string | null
          avatar_url?: string | null
          city?: string | null
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id: string
          id_document_url?: string | null
          id_number?: string | null
          id_type?: string | null
          kyc_verified?: boolean | null
          phone?: string | null
          pincode?: string | null
          state?: string | null
          updated_at?: string | null
        }
        Update: {
          address?: string | null
          avatar_url?: string | null
          city?: string | null
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id?: string
          id_document_url?: string | null
          id_number?: string | null
          id_type?: string | null
          kyc_verified?: boolean | null
          phone?: string | null
          pincode?: string | null
          state?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      recipients: {
        Row: {
          address: string
          city: string
          contact_email: string
          contact_person: string
          contact_phone: string
          created_at: string | null
          id: string
          is_verified: boolean | null
          license_document_url: string | null
          license_number: string | null
          organization_name: string
          organization_type: Database["public"]["Enums"]["recipient_type"]
          pincode: string
          rejection_reason: string | null
          service_areas: string[] | null
          state: string
          updated_at: string | null
          user_id: string
          verified_at: string | null
          verified_by: string | null
        }
        Insert: {
          address: string
          city: string
          contact_email: string
          contact_person: string
          contact_phone: string
          created_at?: string | null
          id?: string
          is_verified?: boolean | null
          license_document_url?: string | null
          license_number?: string | null
          organization_name: string
          organization_type: Database["public"]["Enums"]["recipient_type"]
          pincode: string
          rejection_reason?: string | null
          service_areas?: string[] | null
          state: string
          updated_at?: string | null
          user_id: string
          verified_at?: string | null
          verified_by?: string | null
        }
        Update: {
          address?: string
          city?: string
          contact_email?: string
          contact_person?: string
          contact_phone?: string
          created_at?: string | null
          id?: string
          is_verified?: boolean | null
          license_document_url?: string | null
          license_number?: string | null
          organization_name?: string
          organization_type?: Database["public"]["Enums"]["recipient_type"]
          pincode?: string
          rejection_reason?: string | null
          service_areas?: string[] | null
          state?: string
          updated_at?: string | null
          user_id?: string
          verified_at?: string | null
          verified_by?: string | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          approved_at: string | null
          approved_by: string | null
          created_at: string | null
          id: string
          is_active: boolean | null
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          approved_at?: string | null
          approved_by?: string | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          approved_at?: string | null
          approved_by?: string | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      verifications: {
        Row: {
          additional_images_requested: boolean | null
          checklist: Json | null
          created_at: string | null
          id: string
          medicine_id: string
          notes: string | null
          pharmacist_id: string | null
          rejection_reason: string | null
          status: Database["public"]["Enums"]["verification_status"]
        }
        Insert: {
          additional_images_requested?: boolean | null
          checklist?: Json | null
          created_at?: string | null
          id?: string
          medicine_id: string
          notes?: string | null
          pharmacist_id?: string | null
          rejection_reason?: string | null
          status: Database["public"]["Enums"]["verification_status"]
        }
        Update: {
          additional_images_requested?: boolean | null
          checklist?: Json | null
          created_at?: string | null
          id?: string
          medicine_id?: string
          notes?: string | null
          pharmacist_id?: string | null
          rejection_reason?: string | null
          status?: Database["public"]["Enums"]["verification_status"]
        }
        Relationships: [
          {
            foreignKeyName: "verifications_medicine_id_fkey"
            columns: ["medicine_id"]
            isOneToOne: false
            referencedRelation: "medicines"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_user_roles: {
        Args: { _user_id: string }
        Returns: Database["public"]["Enums"]["app_role"][]
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "donor" | "pharmacist" | "recipient" | "admin"
      medicine_schedule:
        | "otc"
        | "schedule_h"
        | "schedule_h1"
        | "schedule_x"
        | "controlled"
      medicine_status:
        | "pending"
        | "verified"
        | "rejected"
        | "claimed"
        | "picked_up"
        | "delivered"
        | "disposed"
      pickup_status:
        | "scheduled"
        | "confirmed"
        | "in_transit"
        | "completed"
        | "cancelled"
      recipient_type:
        | "pharmacy"
        | "ngo"
        | "clinic"
        | "hospital"
        | "take_back_center"
      verification_status: "pending" | "approved" | "rejected" | "needs_info"
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
      app_role: ["donor", "pharmacist", "recipient", "admin"],
      medicine_schedule: [
        "otc",
        "schedule_h",
        "schedule_h1",
        "schedule_x",
        "controlled",
      ],
      medicine_status: [
        "pending",
        "verified",
        "rejected",
        "claimed",
        "picked_up",
        "delivered",
        "disposed",
      ],
      pickup_status: [
        "scheduled",
        "confirmed",
        "in_transit",
        "completed",
        "cancelled",
      ],
      recipient_type: [
        "pharmacy",
        "ngo",
        "clinic",
        "hospital",
        "take_back_center",
      ],
      verification_status: ["pending", "approved", "rejected", "needs_info"],
    },
  },
} as const
