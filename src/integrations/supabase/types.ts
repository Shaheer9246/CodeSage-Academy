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
      profiles: {
        Row: {
          badges: string[] | null
          completed_lessons: string[] | null
          completed_tests: string[] | null
          created_at: string
          dark_mode: boolean | null
          dob: string | null
          experience_level: string | null
          goal: string | null
          has_job: string | null
          id: string
          last_active_date: string | null
          level: number | null
          name: string | null
          promo_codes: string[] | null
          sage_coins: number | null
          streak_count: number | null
          studying: string | null
          unlocked_sections: string[] | null
          updated_at: string
          username: string | null
          xp: number | null
        }
        Insert: {
          badges?: string[] | null
          completed_lessons?: string[] | null
          completed_tests?: string[] | null
          created_at?: string
          dark_mode?: boolean | null
          dob?: string | null
          experience_level?: string | null
          goal?: string | null
          has_job?: string | null
          id: string
          last_active_date?: string | null
          level?: number | null
          name?: string | null
          promo_codes?: string[] | null
          sage_coins?: number | null
          streak_count?: number | null
          studying?: string | null
          unlocked_sections?: string[] | null
          updated_at?: string
          username?: string | null
          xp?: number | null
        }
        Update: {
          badges?: string[] | null
          completed_lessons?: string[] | null
          completed_tests?: string[] | null
          created_at?: string
          dark_mode?: boolean | null
          dob?: string | null
          experience_level?: string | null
          goal?: string | null
          has_job?: string | null
          id?: string
          last_active_date?: string | null
          level?: number | null
          name?: string | null
          promo_codes?: string[] | null
          sage_coins?: number | null
          streak_count?: number | null
          studying?: string | null
          unlocked_sections?: string[] | null
          updated_at?: string
          username?: string | null
          xp?: number | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      award_lesson: {
        Args: { _lesson_id: string }
        Returns: {
          badges: string[] | null
          completed_lessons: string[] | null
          completed_tests: string[] | null
          created_at: string
          dark_mode: boolean | null
          dob: string | null
          experience_level: string | null
          goal: string | null
          has_job: string | null
          id: string
          last_active_date: string | null
          level: number | null
          name: string | null
          promo_codes: string[] | null
          sage_coins: number | null
          streak_count: number | null
          studying: string | null
          unlocked_sections: string[] | null
          updated_at: string
          username: string | null
          xp: number | null
        }
        SetofOptions: {
          from: "*"
          to: "profiles"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      complete_test: {
        Args: { _test_id: string }
        Returns: {
          badges: string[] | null
          completed_lessons: string[] | null
          completed_tests: string[] | null
          created_at: string
          dark_mode: boolean | null
          dob: string | null
          experience_level: string | null
          goal: string | null
          has_job: string | null
          id: string
          last_active_date: string | null
          level: number | null
          name: string | null
          promo_codes: string[] | null
          sage_coins: number | null
          streak_count: number | null
          studying: string | null
          unlocked_sections: string[] | null
          updated_at: string
          username: string | null
          xp: number | null
        }
        SetofOptions: {
          from: "*"
          to: "profiles"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      redeem_promo: {
        Args: { _code: string }
        Returns: {
          badges: string[] | null
          completed_lessons: string[] | null
          completed_tests: string[] | null
          created_at: string
          dark_mode: boolean | null
          dob: string | null
          experience_level: string | null
          goal: string | null
          has_job: string | null
          id: string
          last_active_date: string | null
          level: number | null
          name: string | null
          promo_codes: string[] | null
          sage_coins: number | null
          streak_count: number | null
          studying: string | null
          unlocked_sections: string[] | null
          updated_at: string
          username: string | null
          xp: number | null
        }
        SetofOptions: {
          from: "*"
          to: "profiles"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      update_streak: {
        Args: never
        Returns: {
          badges: string[] | null
          completed_lessons: string[] | null
          completed_tests: string[] | null
          created_at: string
          dark_mode: boolean | null
          dob: string | null
          experience_level: string | null
          goal: string | null
          has_job: string | null
          id: string
          last_active_date: string | null
          level: number | null
          name: string | null
          promo_codes: string[] | null
          sage_coins: number | null
          streak_count: number | null
          studying: string | null
          unlocked_sections: string[] | null
          updated_at: string
          username: string | null
          xp: number | null
        }
        SetofOptions: {
          from: "*"
          to: "profiles"
          isOneToOne: true
          isSetofReturn: false
        }
      }
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
