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
      announcement_reads: {
        Row: {
          announcement_id: string
          read_at: string
          user_id: string
        }
        Insert: {
          announcement_id: string
          read_at?: string
          user_id: string
        }
        Update: {
          announcement_id?: string
          read_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "announcement_reads_announcement_id_fkey"
            columns: ["announcement_id"]
            isOneToOne: false
            referencedRelation: "announcements"
            referencedColumns: ["id"]
          },
        ]
      }
      announcements: {
        Row: {
          body: string
          created_at: string
          id: string
          title: string
        }
        Insert: {
          body: string
          created_at?: string
          id?: string
          title: string
        }
        Update: {
          body?: string
          created_at?: string
          id?: string
          title?: string
        }
        Relationships: []
      }
      badge_levels: {
        Row: {
          badge_id: string
          level: number
          xp_required: number
        }
        Insert: {
          badge_id: string
          level: number
          xp_required: number
        }
        Update: {
          badge_id?: string
          level?: number
          xp_required?: number
        }
        Relationships: []
      }
      enrollments: {
        Row: {
          enrolled_at: string
          id: string
          status: string
          track: string
          user_id: string
        }
        Insert: {
          enrolled_at?: string
          id?: string
          status?: string
          track: string
          user_id: string
        }
        Update: {
          enrolled_at?: string
          id?: string
          status?: string
          track?: string
          user_id?: string
        }
        Relationships: []
      }
      lesson_registry: {
        Row: {
          id: string
        }
        Insert: {
          id: string
        }
        Update: {
          id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          badges: string[] | null
          completed_lessons: string[] | null
          completed_tests: string[] | null
          created_at: string
          daily_xp: number
          daily_xp_date: string
          dark_mode: boolean | null
          dob: string | null
          experience_level: string | null
          goal: string | null
          has_job: string | null
          has_seen_tour: boolean | null
          id: string
          last_active_date: string | null
          level: number | null
          name: string | null
          promo_codes: string[] | null
          sage_coins: number | null
          streak_count: number | null
          streak_freeze_until: string | null
          student_id: string | null
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
          daily_xp?: number
          daily_xp_date?: string
          dark_mode?: boolean | null
          dob?: string | null
          experience_level?: string | null
          goal?: string | null
          has_job?: string | null
          has_seen_tour?: boolean | null
          id: string
          last_active_date?: string | null
          level?: number | null
          name?: string | null
          promo_codes?: string[] | null
          sage_coins?: number | null
          streak_count?: number | null
          streak_freeze_until?: string | null
          student_id?: string | null
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
          daily_xp?: number
          daily_xp_date?: string
          dark_mode?: boolean | null
          dob?: string | null
          experience_level?: string | null
          goal?: string | null
          has_job?: string | null
          has_seen_tour?: boolean | null
          id?: string
          last_active_date?: string | null
          level?: number | null
          name?: string | null
          promo_codes?: string[] | null
          sage_coins?: number | null
          streak_count?: number | null
          streak_freeze_until?: string | null
          student_id?: string | null
          studying?: string | null
          unlocked_sections?: string[] | null
          updated_at?: string
          username?: string | null
          xp?: number | null
        }
        Relationships: []
      }
      promo_codes: {
        Row: {
          code: string
          created_at: string
          sections: string[]
        }
        Insert: {
          code: string
          created_at?: string
          sections: string[]
        }
        Update: {
          code?: string
          created_at?: string
          sections?: string[]
        }
        Relationships: []
      }
      suggestion_reads: {
        Row: {
          last_seen_at: string
          user_id: string
        }
        Insert: {
          last_seen_at?: string
          user_id: string
        }
        Update: {
          last_seen_at?: string
          user_id?: string
        }
        Relationships: []
      }
      suggestion_votes: {
        Row: {
          created_at: string
          suggestion_id: string
          updated_at: string
          user_id: string
          vote_type: string
        }
        Insert: {
          created_at?: string
          suggestion_id: string
          updated_at?: string
          user_id: string
          vote_type?: string
        }
        Update: {
          created_at?: string
          suggestion_id?: string
          updated_at?: string
          user_id?: string
          vote_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "suggestion_votes_suggestion_id_fkey"
            columns: ["suggestion_id"]
            isOneToOne: false
            referencedRelation: "suggestions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "suggestion_votes_suggestion_id_fkey"
            columns: ["suggestion_id"]
            isOneToOne: false
            referencedRelation: "suggestions_public"
            referencedColumns: ["id"]
          },
        ]
      }
      suggestions: {
        Row: {
          created_at: string
          downvotes: number
          id: string
          reply: string | null
          reply_at: string | null
          text: string
          updated_at: string
          upvotes: number
          user_id: string
          username: string
        }
        Insert: {
          created_at?: string
          downvotes?: number
          id?: string
          reply?: string | null
          reply_at?: string | null
          text: string
          updated_at?: string
          upvotes?: number
          user_id: string
          username?: string
        }
        Update: {
          created_at?: string
          downvotes?: number
          id?: string
          reply?: string | null
          reply_at?: string | null
          text?: string
          updated_at?: string
          upvotes?: number
          user_id?: string
          username?: string
        }
        Relationships: []
      }
      test_registry: {
        Row: {
          id: string
        }
        Insert: {
          id: string
        }
        Update: {
          id?: string
        }
        Relationships: []
      }
      track_stats: {
        Row: {
          enrolled_count: number
          track: string
          updated_at: string
        }
        Insert: {
          enrolled_count?: number
          track: string
          updated_at?: string
        }
        Update: {
          enrolled_count?: number
          track?: string
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
      suggestions_public: {
        Row: {
          created_at: string | null
          downvotes: number | null
          id: string | null
          is_mine: boolean | null
          reply: string | null
          reply_at: string | null
          text: string | null
          updated_at: string | null
          upvotes: number | null
          username: string | null
        }
        Insert: {
          created_at?: string | null
          downvotes?: number | null
          id?: string | null
          is_mine?: never
          reply?: string | null
          reply_at?: string | null
          text?: string | null
          updated_at?: string | null
          upvotes?: number | null
          username?: string | null
        }
        Update: {
          created_at?: string | null
          downvotes?: number | null
          id?: string | null
          is_mine?: never
          reply?: string | null
          reply_at?: string | null
          text?: string | null
          updated_at?: string | null
          upvotes?: number | null
          username?: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      admin_delete_suggestion: { Args: { _id: string }; Returns: boolean }
      admin_delete_user: { Args: { _user_id: string }; Returns: undefined }
      admin_edit_suggestion: {
        Args: { _id: string; _text: string }
        Returns: {
          created_at: string
          downvotes: number
          id: string
          reply: string | null
          reply_at: string | null
          text: string
          updated_at: string
          upvotes: number
          user_id: string
          username: string
        }
        SetofOptions: {
          from: "*"
          to: "suggestions"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      admin_list_users: { Args: never; Returns: Json }
      award_lesson: {
        Args: { _lesson_id: string }
        Returns: {
          badges: string[] | null
          completed_lessons: string[] | null
          completed_tests: string[] | null
          created_at: string
          daily_xp: number
          daily_xp_date: string
          dark_mode: boolean | null
          dob: string | null
          experience_level: string | null
          goal: string | null
          has_job: string | null
          has_seen_tour: boolean | null
          id: string
          last_active_date: string | null
          level: number | null
          name: string | null
          promo_codes: string[] | null
          sage_coins: number | null
          streak_count: number | null
          streak_freeze_until: string | null
          student_id: string | null
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
      award_lesson_v2:
        | {
            Args: { _lesson_id: string }
            Returns: {
              badges: string[] | null
              completed_lessons: string[] | null
              completed_tests: string[] | null
              created_at: string
              daily_xp: number
              daily_xp_date: string
              dark_mode: boolean | null
              dob: string | null
              experience_level: string | null
              goal: string | null
              has_job: string | null
              has_seen_tour: boolean | null
              id: string
              last_active_date: string | null
              level: number | null
              name: string | null
              promo_codes: string[] | null
              sage_coins: number | null
              streak_count: number | null
              streak_freeze_until: string | null
              student_id: string | null
              studying: string | null
              unlocked_sections: string[] | null
              updated_at: string
              username: string | null
              xp: number | null
            }[]
            SetofOptions: {
              from: "*"
              to: "profiles"
              isOneToOne: false
              isSetofReturn: true
            }
          }
        | {
            Args: { _coin_reward?: number; _lesson_id: string }
            Returns: {
              badges: string[] | null
              completed_lessons: string[] | null
              completed_tests: string[] | null
              created_at: string
              daily_xp: number
              daily_xp_date: string
              dark_mode: boolean | null
              dob: string | null
              experience_level: string | null
              goal: string | null
              has_job: string | null
              has_seen_tour: boolean | null
              id: string
              last_active_date: string | null
              level: number | null
              name: string | null
              promo_codes: string[] | null
              sage_coins: number | null
              streak_count: number | null
              streak_freeze_until: string | null
              student_id: string | null
              studying: string | null
              unlocked_sections: string[] | null
              updated_at: string
              username: string | null
              xp: number | null
            }[]
            SetofOptions: {
              from: "*"
              to: "profiles"
              isOneToOne: false
              isSetofReturn: true
            }
          }
      buy_freeze_streak: {
        Args: never
        Returns: {
          badges: string[] | null
          completed_lessons: string[] | null
          completed_tests: string[] | null
          created_at: string
          daily_xp: number
          daily_xp_date: string
          dark_mode: boolean | null
          dob: string | null
          experience_level: string | null
          goal: string | null
          has_job: string | null
          has_seen_tour: boolean | null
          id: string
          last_active_date: string | null
          level: number | null
          name: string | null
          promo_codes: string[] | null
          sage_coins: number | null
          streak_count: number | null
          streak_freeze_until: string | null
          student_id: string | null
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
      complete_test:
        | {
            Args: { _test_id: string }
            Returns: {
              badges: string[] | null
              completed_lessons: string[] | null
              completed_tests: string[] | null
              created_at: string
              daily_xp: number
              daily_xp_date: string
              dark_mode: boolean | null
              dob: string | null
              experience_level: string | null
              goal: string | null
              has_job: string | null
              has_seen_tour: boolean | null
              id: string
              last_active_date: string | null
              level: number | null
              name: string | null
              promo_codes: string[] | null
              sage_coins: number | null
              streak_count: number | null
              streak_freeze_until: string | null
              student_id: string | null
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
        | {
            Args: { _coin_reward?: number; _test_id: string }
            Returns: {
              badges: string[] | null
              completed_lessons: string[] | null
              completed_tests: string[] | null
              created_at: string
              daily_xp: number
              daily_xp_date: string
              dark_mode: boolean | null
              dob: string | null
              experience_level: string | null
              goal: string | null
              has_job: string | null
              has_seen_tour: boolean | null
              id: string
              last_active_date: string | null
              level: number | null
              name: string | null
              promo_codes: string[] | null
              sage_coins: number | null
              streak_count: number | null
              streak_freeze_until: string | null
              student_id: string | null
              studying: string | null
              unlocked_sections: string[] | null
              updated_at: string
              username: string | null
              xp: number | null
            }[]
            SetofOptions: {
              from: "*"
              to: "profiles"
              isOneToOne: false
              isSetofReturn: true
            }
          }
      enroll_track: {
        Args: { _track: string }
        Returns: {
          enrolled_at: string
          id: string
          status: string
          track: string
          user_id: string
        }
        SetofOptions: {
          from: "*"
          to: "enrollments"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_admin: { Args: never; Returns: boolean }
      level_for_lessons: { Args: { _lessons: number }; Returns: number }
      mark_announcement_read: { Args: { _id: string }; Returns: undefined }
      mark_suggestions_read: { Args: never; Returns: undefined }
      post_announcement: {
        Args: { _body: string; _title: string }
        Returns: {
          body: string
          created_at: string
          id: string
          title: string
        }
        SetofOptions: {
          from: "*"
          to: "announcements"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      purchase_extra_lesson: {
        Args: { _lesson_id: string }
        Returns: {
          badges: string[] | null
          completed_lessons: string[] | null
          completed_tests: string[] | null
          created_at: string
          daily_xp: number
          daily_xp_date: string
          dark_mode: boolean | null
          dob: string | null
          experience_level: string | null
          goal: string | null
          has_job: string | null
          has_seen_tour: boolean | null
          id: string
          last_active_date: string | null
          level: number | null
          name: string | null
          promo_codes: string[] | null
          sage_coins: number | null
          streak_count: number | null
          streak_freeze_until: string | null
          student_id: string | null
          studying: string | null
          unlocked_sections: string[] | null
          updated_at: string
          username: string | null
          xp: number | null
        }[]
        SetofOptions: {
          from: "*"
          to: "profiles"
          isOneToOne: false
          isSetofReturn: true
        }
      }
      redeem_promo: {
        Args: { _code: string }
        Returns: {
          badges: string[] | null
          completed_lessons: string[] | null
          completed_tests: string[] | null
          created_at: string
          daily_xp: number
          daily_xp_date: string
          dark_mode: boolean | null
          dob: string | null
          experience_level: string | null
          goal: string | null
          has_job: string | null
          has_seen_tour: boolean | null
          id: string
          last_active_date: string | null
          level: number | null
          name: string | null
          promo_codes: string[] | null
          sage_coins: number | null
          streak_count: number | null
          streak_freeze_until: string | null
          student_id: string | null
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
      refresh_daily_xp: {
        Args: never
        Returns: {
          badges: string[] | null
          completed_lessons: string[] | null
          completed_tests: string[] | null
          created_at: string
          daily_xp: number
          daily_xp_date: string
          dark_mode: boolean | null
          dob: string | null
          experience_level: string | null
          goal: string | null
          has_job: string | null
          has_seen_tour: boolean | null
          id: string
          last_active_date: string | null
          level: number | null
          name: string | null
          promo_codes: string[] | null
          sage_coins: number | null
          streak_count: number | null
          streak_freeze_until: string | null
          student_id: string | null
          studying: string | null
          unlocked_sections: string[] | null
          updated_at: string
          username: string | null
          xp: number | null
        }[]
        SetofOptions: {
          from: "*"
          to: "profiles"
          isOneToOne: false
          isSetofReturn: true
        }
      }
      reply_suggestion: {
        Args: { _id: string; _reply: string }
        Returns: {
          created_at: string
          downvotes: number
          id: string
          reply: string | null
          reply_at: string | null
          text: string
          updated_at: string
          upvotes: number
          user_id: string
          username: string
        }
        SetofOptions: {
          from: "*"
          to: "suggestions"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      spend_coins: {
        Args: { _amount: number; _reason?: string }
        Returns: {
          badges: string[] | null
          completed_lessons: string[] | null
          completed_tests: string[] | null
          created_at: string
          daily_xp: number
          daily_xp_date: string
          dark_mode: boolean | null
          dob: string | null
          experience_level: string | null
          goal: string | null
          has_job: string | null
          has_seen_tour: boolean | null
          id: string
          last_active_date: string | null
          level: number | null
          name: string | null
          promo_codes: string[] | null
          sage_coins: number | null
          streak_count: number | null
          streak_freeze_until: string | null
          student_id: string | null
          studying: string | null
          unlocked_sections: string[] | null
          updated_at: string
          username: string | null
          xp: number | null
        }[]
        SetofOptions: {
          from: "*"
          to: "profiles"
          isOneToOne: false
          isSetofReturn: true
        }
      }
      suggestion_is_mine: { Args: { _id: string }; Returns: boolean }
      update_enrollment_status: {
        Args: { _status: string; _track: string }
        Returns: {
          enrolled_at: string
          id: string
          status: string
          track: string
          user_id: string
        }
        SetofOptions: {
          from: "*"
          to: "enrollments"
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
          daily_xp: number
          daily_xp_date: string
          dark_mode: boolean | null
          dob: string | null
          experience_level: string | null
          goal: string | null
          has_job: string | null
          has_seen_tour: boolean | null
          id: string
          last_active_date: string | null
          level: number | null
          name: string | null
          promo_codes: string[] | null
          sage_coins: number | null
          streak_count: number | null
          streak_freeze_until: string | null
          student_id: string | null
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
      app_role: "admin" | "moderator" | "user"
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
      app_role: ["admin", "moderator", "user"],
    },
  },
} as const
