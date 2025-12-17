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
      blog_posts: {
        Row: {
          author_id: string
          content: string
          created_at: string | null
          id: string
          published: boolean | null
          title: string
          updated_at: string | null
        }
        Insert: {
          author_id: string
          content: string
          created_at?: string | null
          id?: string
          published?: boolean | null
          title: string
          updated_at?: string | null
        }
        Update: {
          author_id?: string
          content?: string
          created_at?: string | null
          id?: string
          published?: boolean | null
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      body_metrics: {
        Row: {
          created_at: string
          date: string
          id: string
          user_id: string
          vo2_max: number | null
          weight: number | null
        }
        Insert: {
          created_at?: string
          date?: string
          id?: string
          user_id?: string
          vo2_max?: number | null
          weight?: number | null
        }
        Update: {
          created_at?: string
          date?: string
          id?: string
          user_id?: string
          vo2_max?: number | null
          weight?: number | null
        }
        Relationships: []
      }
      brotherhood_activities: {
        Row: {
          activity_description: string
          activity_type: string
          challenge_name: string | null
          created_at: string
          id: string
          is_public: boolean
          notes: string | null
          user_id: string
        }
        Insert: {
          activity_description: string
          activity_type: string
          challenge_name?: string | null
          created_at?: string
          id?: string
          is_public?: boolean
          notes?: string | null
          user_id: string
        }
        Update: {
          activity_description?: string
          activity_type?: string
          challenge_name?: string | null
          created_at?: string
          id?: string
          is_public?: boolean
          notes?: string | null
          user_id?: string
        }
        Relationships: []
      }
      brotherhood_activity_likes: {
        Row: {
          activity_id: string
          created_at: string
          id: string
          user_id: string
        }
        Insert: {
          activity_id: string
          created_at?: string
          id?: string
          user_id: string
        }
        Update: {
          activity_id?: string
          created_at?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "brotherhood_activity_likes_activity_id_fkey"
            columns: ["activity_id"]
            isOneToOne: false
            referencedRelation: "brotherhood_activities"
            referencedColumns: ["id"]
          },
        ]
      }
      hero_call_completions: {
        Row: {
          completed_at: string
          created_at: string
          difficulty: string
          id: string
          user_id: string
          workout_name: string
        }
        Insert: {
          completed_at?: string
          created_at?: string
          difficulty: string
          id?: string
          user_id: string
          workout_name: string
        }
        Update: {
          completed_at?: string
          created_at?: string
          difficulty?: string
          id?: string
          user_id?: string
          workout_name?: string
        }
        Relationships: []
      }
      muscle_group_volume_goals: {
        Row: {
          created_at: string
          id: string
          muscle_group: string
          updated_at: string
          user_id: string
          weekly_target_sets: number
        }
        Insert: {
          created_at?: string
          id?: string
          muscle_group: string
          updated_at?: string
          user_id: string
          weekly_target_sets: number
        }
        Update: {
          created_at?: string
          id?: string
          muscle_group?: string
          updated_at?: string
          user_id?: string
          weekly_target_sets?: number
        }
        Relationships: []
      }
      personal_records: {
        Row: {
          created_at: string
          date: string
          exercise_name: string
          id: string
          one_rep_max: number
          user_id: string
        }
        Insert: {
          created_at?: string
          date: string
          exercise_name: string
          id?: string
          one_rep_max: number
          user_id?: string
        }
        Update: {
          created_at?: string
          date?: string
          exercise_name?: string
          id?: string
          one_rep_max?: number
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          banner_name: string | null
          created_at: string
          id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          banner_name?: string | null
          created_at?: string
          id?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          banner_name?: string | null
          created_at?: string
          id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      runs: {
        Row: {
          avg_hr: number | null
          created_at: string
          date: string
          distance: number
          duration: number
          elevation: number | null
          id: string
          notes: string | null
          run_type: string
          user_id: string
        }
        Insert: {
          avg_hr?: number | null
          created_at?: string
          date: string
          distance: number
          duration: number
          elevation?: number | null
          id?: string
          notes?: string | null
          run_type: string
          user_id?: string
        }
        Update: {
          avg_hr?: number | null
          created_at?: string
          date?: string
          distance?: number
          duration?: number
          elevation?: number | null
          id?: string
          notes?: string | null
          run_type?: string
          user_id?: string
        }
        Relationships: []
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
      valhalla_challenges: {
        Row: {
          challenge_name: string
          completed_at: string
          completion_time_minutes: number
          created_at: string
          id: string
          notes: string | null
          quarter_date: string
          quarter_year: number
          tier: string
          user_id: string
        }
        Insert: {
          challenge_name: string
          completed_at?: string
          completion_time_minutes: number
          created_at?: string
          id?: string
          notes?: string | null
          quarter_date?: string
          quarter_year?: number
          tier: string
          user_id?: string
        }
        Update: {
          challenge_name?: string
          completed_at?: string
          completion_time_minutes?: number
          created_at?: string
          id?: string
          notes?: string | null
          quarter_date?: string
          quarter_year?: number
          tier?: string
          user_id?: string
        }
        Relationships: []
      }
      valhalla_runes: {
        Row: {
          challenge_name: string
          first_earned_at: string
          highest_tier: string
          id: string
          last_updated_at: string
          rune_name: string
          user_id: string
        }
        Insert: {
          challenge_name: string
          first_earned_at?: string
          highest_tier: string
          id?: string
          last_updated_at?: string
          rune_name: string
          user_id?: string
        }
        Update: {
          challenge_name?: string
          first_earned_at?: string
          highest_tier?: string
          id?: string
          last_updated_at?: string
          rune_name?: string
          user_id?: string
        }
        Relationships: []
      }
      weekly_distance_goals: {
        Row: {
          created_at: string
          id: string
          target_distance: number
          updated_at: string
          user_id: string
          week_start: string
        }
        Insert: {
          created_at?: string
          id?: string
          target_distance: number
          updated_at?: string
          user_id?: string
          week_start?: string
        }
        Update: {
          created_at?: string
          id?: string
          target_distance?: number
          updated_at?: string
          user_id?: string
          week_start?: string
        }
        Relationships: []
      }
      workout_exercises: {
        Row: {
          id: string
          name: string
          order: number
          workout_id: string
        }
        Insert: {
          id?: string
          name: string
          order: number
          workout_id: string
        }
        Update: {
          id?: string
          name?: string
          order?: number
          workout_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "workout_exercises_workout_id_fkey"
            columns: ["workout_id"]
            isOneToOne: false
            referencedRelation: "workouts"
            referencedColumns: ["id"]
          },
        ]
      }
      workout_generation_requests: {
        Row: {
          created_at: string
          id: string
          ip_address: string | null
          success: boolean
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          ip_address?: string | null
          success?: boolean
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          ip_address?: string | null
          success?: boolean
          user_id?: string
        }
        Relationships: []
      }
      workout_sets: {
        Row: {
          completed: boolean
          distance: number | null
          duration: number | null
          id: string
          order: number
          reps: number
          weight: number
          workout_exercise_id: string
        }
        Insert: {
          completed?: boolean
          distance?: number | null
          duration?: number | null
          id?: string
          order: number
          reps: number
          weight: number
          workout_exercise_id: string
        }
        Update: {
          completed?: boolean
          distance?: number | null
          duration?: number | null
          id?: string
          order?: number
          reps?: number
          weight?: number
          workout_exercise_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "workout_sets_workout_exercise_id_fkey"
            columns: ["workout_exercise_id"]
            isOneToOne: false
            referencedRelation: "workout_exercises"
            referencedColumns: ["id"]
          },
        ]
      }
      workout_template_exercises: {
        Row: {
          exercise_name: string
          id: string
          order: number
          sets: number
          workout_template_id: string
        }
        Insert: {
          exercise_name: string
          id?: string
          order: number
          sets: number
          workout_template_id: string
        }
        Update: {
          exercise_name?: string
          id?: string
          order?: number
          sets?: number
          workout_template_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "workout_template_exercises_workout_template_id_fkey"
            columns: ["workout_template_id"]
            isOneToOne: false
            referencedRelation: "workout_templates"
            referencedColumns: ["id"]
          },
        ]
      }
      workout_templates: {
        Row: {
          created_at: string
          id: string
          is_public: boolean
          name: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_public?: boolean
          name: string
          user_id?: string
        }
        Update: {
          created_at?: string
          id?: string
          is_public?: boolean
          name?: string
          user_id?: string
        }
        Relationships: []
      }
      workouts: {
        Row: {
          created_at: string
          end_time: string | null
          id: string
          name: string | null
          notes: string | null
          start_time: string
          user_id: string
        }
        Insert: {
          created_at?: string
          end_time?: string | null
          id?: string
          name?: string | null
          notes?: string | null
          start_time?: string
          user_id?: string
        }
        Update: {
          created_at?: string
          end_time?: string | null
          id?: string
          name?: string | null
          notes?: string | null
          start_time?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      add_activity_like: { Args: { p_activity_id: string }; Returns: undefined }
      calculate_valhalla_tier: {
        Args: { challenge_name: string; completion_time_minutes: number }
        Returns: string
      }
      can_view_template: { Args: { template_id: string }; Returns: boolean }
      check_workout_generation_rate_limit: {
        Args: { p_user_id: string }
        Returns: Json
      }
      get_activity_likes: {
        Args: { activity_ids: string[] }
        Returns: {
          activity_id: string
          created_at: string
          id: string
          user_id: string
        }[]
      }
      get_hero_call_streak: { Args: { p_user_id: string }; Returns: number }
      get_hero_call_weekly_count: {
        Args: { p_user_id: string }
        Returns: number
      }
      get_last_exercise_data: {
        Args: { p_exercise_name: string }
        Returns: {
          last_distance: number
          last_duration: number
          last_reps: number
          last_used: string
          last_weight: number
        }[]
      }
      get_last_exercise_weight: {
        Args: { p_exercise_name: string }
        Returns: number
      }
      get_user_workouts: { Args: never; Returns: Json }
      get_users_forge_titles: {
        Args: { p_user_ids: string[] }
        Returns: {
          current_tier: number
          current_title: string
          forged_weeks: number
          user_id: string
        }[]
      }
      get_valhalla_progress: { Args: never; Returns: Json }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      hero_call_completed_today: {
        Args: { p_user_id: string }
        Returns: boolean
      }
      is_template_owner: { Args: { template_id: string }; Returns: boolean }
      record_valhalla_challenge: {
        Args: {
          p_challenge_name: string
          p_completion_time_minutes: number
          p_notes?: string
        }
        Returns: Json
      }
      remove_activity_like: {
        Args: { p_activity_id: string }
        Returns: undefined
      }
      upsert_personal_record: {
        Args: { p_exercise_name: string; p_one_rep_max: number }
        Returns: string
      }
    }
    Enums: {
      app_role: "admin" | "user"
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
      app_role: ["admin", "user"],
    },
  },
} as const
