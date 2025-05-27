export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      authors: {
        Row: {
          birth_year: number | null
          created_at: string
          death_year: number | null
          full_name: string
          id: number
          photo: string | null
        }
        Insert: {
          birth_year?: number | null
          created_at?: string
          death_year?: number | null
          full_name: string
          id?: number
          photo?: string | null
        }
        Update: {
          birth_year?: number | null
          created_at?: string
          death_year?: number | null
          full_name?: string
          id?: number
          photo?: string | null
        }
        Relationships: []
      }
      book_copies: {
        Row: {
          book_id: number | null
          created_at: string
          id: number
          status: string | null
          updated_at: string | null
        }
        Insert: {
          book_id?: number | null
          created_at?: string
          id?: number
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          book_id?: number | null
          created_at?: string
          id?: number
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "book_copies_book_id_fkey"
            columns: ["book_id"]
            isOneToOne: false
            referencedRelation: "books"
            referencedColumns: ["id"]
          },
        ]
      }
      books: {
        Row: {
          cover_image: string | null
          created_at: string
          description: string | null
          id: number
          title: string
        }
        Insert: {
          cover_image?: string | null
          created_at?: string
          description?: string | null
          id?: number
          title: string
        }
        Update: {
          cover_image?: string | null
          created_at?: string
          description?: string | null
          id?: number
          title?: string
        }
        Relationships: []
      }
      books_authors: {
        Row: {
          author_id: number
          book_id: number
          created_at: string
        }
        Insert: {
          author_id: number
          book_id: number
          created_at?: string
        }
        Update: {
          author_id?: number
          book_id?: number
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "books_authors_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "authors"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "books_authors_book_id_fkey"
            columns: ["book_id"]
            isOneToOne: false
            referencedRelation: "books"
            referencedColumns: ["id"]
          },
        ]
      }
      books_categories: {
        Row: {
          book_id: number
          category_id: number
          created_at: string
        }
        Insert: {
          book_id: number
          category_id: number
          created_at?: string
        }
        Update: {
          book_id?: number
          category_id?: number
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "books_categories_book_id_fkey"
            columns: ["book_id"]
            isOneToOne: false
            referencedRelation: "books"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "books_categories_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      books_publishers: {
        Row: {
          book_id: number
          created_at: string
          publisher_id: number
        }
        Insert: {
          book_id: number
          created_at?: string
          publisher_id: number
        }
        Update: {
          book_id?: number
          created_at?: string
          publisher_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "books_publishers_book_id_fkey"
            columns: ["book_id"]
            isOneToOne: false
            referencedRelation: "books"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "books_publishers_publisher_id_fkey"
            columns: ["publisher_id"]
            isOneToOne: false
            referencedRelation: "publishers"
            referencedColumns: ["id"]
          },
        ]
      }
      books_reviews: {
        Row: {
          book_id: number
          content: string
          created_at: string
          id: number
          rating: number
          reader_id: string
          updated_at: string | null
        }
        Insert: {
          book_id: number
          content: string
          created_at?: string
          id?: number
          rating: number
          reader_id: string
          updated_at?: string | null
        }
        Update: {
          book_id?: number
          content?: string
          created_at?: string
          id?: number
          rating?: number
          reader_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "books_reviews_book_id_fkey"
            columns: ["book_id"]
            isOneToOne: false
            referencedRelation: "books"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "books_reviews_reader_id_fkey"
            columns: ["reader_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      carts: {
        Row: {
          created_at: string
          id: number
          items: number[] | null
          reader_id: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string
          id?: number
          items?: number[] | null
          reader_id: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string
          id?: number
          items?: number[] | null
          reader_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "carts_reader_id_fkey1"
            columns: ["reader_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      categories: {
        Row: {
          created_at: string
          id: number
          name: string
        }
        Insert: {
          created_at?: string
          id?: number
          name: string
        }
        Update: {
          created_at?: string
          id?: number
          name?: string
        }
        Relationships: []
      }
      notifications: {
        Row: {
          created_at: string
          id: number
          is_read: boolean | null
          message: string | null
          notifiable_id: number | null
          notifiable_type: string | null
          type: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: number
          is_read?: boolean | null
          message?: string | null
          notifiable_id?: number | null
          notifiable_type?: string | null
          type?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: number
          is_read?: boolean | null
          message?: string | null
          notifiable_id?: number | null
          notifiable_type?: string | null
          type?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "notifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      order_renews: {
        Row: {
          comment: string | null
          created_at: string
          id: number
          new_due_date: string | null
          old_due_date: string | null
          order_id: number
          request_note: string | null
          status: string | null
        }
        Insert: {
          comment?: string | null
          created_at?: string
          id?: number
          new_due_date?: string | null
          old_due_date?: string | null
          order_id: number
          request_note?: string | null
          status?: string | null
        }
        Update: {
          comment?: string | null
          created_at?: string
          id?: number
          new_due_date?: string | null
          old_due_date?: string | null
          order_id?: number
          request_note?: string | null
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "order_renew_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      order_timeline: {
        Row: {
          action: string
          comment: string | null
          created_at: string
          id: number
          order_id: number
          user_id: string
        }
        Insert: {
          action: string
          comment?: string | null
          created_at?: string
          id?: number
          order_id: number
          user_id: string
        }
        Update: {
          action?: string
          comment?: string | null
          created_at?: string
          id?: number
          order_id?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "order_timeline_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_timeline_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          book_copy_id: number | null
          book_id: number
          created_at: string
          due_date: string | null
          id: number
          reader_id: string
          returned_at: string | null
          status: string | null
          updated_at: string
        }
        Insert: {
          book_copy_id?: number | null
          book_id: number
          created_at?: string
          due_date?: string | null
          id?: number
          reader_id: string
          returned_at?: string | null
          status?: string | null
          updated_at?: string
        }
        Update: {
          book_copy_id?: number | null
          book_id?: number
          created_at?: string
          due_date?: string | null
          id?: number
          reader_id?: string
          returned_at?: string | null
          status?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "orders_book_copy_id_fkey"
            columns: ["book_copy_id"]
            isOneToOne: false
            referencedRelation: "book_copies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_book_id_fkey"
            columns: ["book_id"]
            isOneToOne: false
            referencedRelation: "books"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_reader_id_fkey1"
            columns: ["reader_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      publishers: {
        Row: {
          created_at: string
          id: number
          logo: string | null
          name: string
        }
        Insert: {
          created_at?: string
          id?: number
          logo?: string | null
          name: string
        }
        Update: {
          created_at?: string
          id?: number
          logo?: string | null
          name?: string
        }
        Relationships: []
      }
      users: {
        Row: {
          created_at: string
          email: string | null
          id: string
          name: string
          phone: string | null
          photo: string | null
          role: string | null
        }
        Insert: {
          created_at?: string
          email?: string | null
          id?: string
          name: string
          phone?: string | null
          photo?: string | null
          role?: string | null
        }
        Update: {
          created_at?: string
          email?: string | null
          id?: string
          name?: string
          phone?: string | null
          photo?: string | null
          role?: string | null
        }
        Relationships: []
      }
      wishlists: {
        Row: {
          book_id: number
          created_at: string
          id: number
          reader_id: string
        }
        Insert: {
          book_id: number
          created_at?: string
          id?: number
          reader_id: string
        }
        Update: {
          book_id?: number
          created_at?: string
          id?: number
          reader_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "wishlists_book_id_fkey"
            columns: ["book_id"]
            isOneToOne: false
            referencedRelation: "books"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "wishlists_reader_id_fkey1"
            columns: ["reader_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      execute_sql: {
        Args: { sql: string }
        Returns: undefined
      }
      get_admin_dashboard_counts: {
        Args: Record<PropertyKey, never>
        Returns: Json
      }
      get_average_rating_by_book: {
        Args: { p_book_id: number }
        Returns: {
          book_id: number
          average_rating: number
          review_count: number
        }[]
      }
      get_average_ratings: {
        Args: { bookid?: number }
        Returns: {
          book_id: number
          average_rating: number
          review_count: number
        }[]
      }
      get_average_ratings_with_book_details: {
        Args: { limit_count?: number }
        Returns: {
          book_id: number
          book_title: string
          book_image: string
          average_rating: number
          rating_count: number
        }[]
      }
      get_book_stats: {
        Args: Record<PropertyKey, never>
        Returns: {
          status: string
          status_count: number
        }[]
      }
      get_books_by_copy_status: {
        Args:
          | { p_status: string }
          | { p_status: string; p_offset?: number; p_limit?: number }
        Returns: {
          book_id: number
          title: string
          quantity: number
          cover_image: string
        }[]
      }
      get_books_by_copy_status_count: {
        Args: { p_status: string }
        Returns: number
      }
      get_categories_with_top_rated_book: {
        Args: Record<PropertyKey, never>
        Returns: {
          id: number
          name: string
          photo: string
        }[]
      }
      get_daily_order_counts: {
        Args: Record<PropertyKey, never> | { period: number }
        Returns: {
          order_date: string
          order_count: number
        }[]
      }
      get_due_orders: {
        Args: { currentdate: string }
        Returns: {
          book_copy_id: number | null
          book_id: number
          created_at: string
          due_date: string | null
          id: number
          reader_id: string
          returned_at: string | null
          status: string | null
          updated_at: string
        }[]
      }
      get_friends_with_last_message: {
        Args: Record<PropertyKey, never> | { target_user_id: string }
        Returns: {
          friend_id: string
          friend_full_name: string
          friend_photo: string
          last_message: string
          created_at: string
          is_read: boolean
        }[]
      }
      get_last_message_with_user_info: {
        Args: Record<PropertyKey, never>
        Returns: {
          user_id: string
          full_name: string
          photo: string
          last_message: string
          message_created_at: string
        }[]
      }
      get_order_status_stats: {
        Args: { period: number }
        Returns: {
          status: string
          status_count: number
        }[]
      }
      get_receiver_with_last_message: {
        Args: Record<PropertyKey, never>
        Returns: {
          friend_id: string
          friend_full_name: string
          friend_photo: string
          last_message: string
          created_at: string
          is_read: boolean
        }[]
      }
      get_specific_friend_with_last_message: {
        Args: { target_user_id: string }
        Returns: {
          friend_id: string
          friend_full_name: string
          friend_photo: string
          last_message: string
          created_at: string
          is_read: boolean
        }[]
      }
      get_top_books_by_author: {
        Args: { p_author_id: number; p_offset?: number; p_limit?: number }
        Returns: {
          book_id: number
          title: string
          cover_image: string
          author_name: string
          order_count: number
        }[]
      }
      get_top_books_by_author_count: {
        Args: { p_author_id: number }
        Returns: number
      }
      get_top_books_by_category: {
        Args:
          | { p_category_id: number; p_offset?: number; p_limit?: number }
          | { p_category_name: string; p_offset?: number; p_limit?: number }
          | { p_offset?: number; p_limit?: number }
        Returns: {
          book_id: number
          title: string
          cover_image: string
          category_name: string
          order_count: number
        }[]
      }
      get_top_books_by_category_count: {
        Args: { p_category_id: number }
        Returns: number
      }
      get_top_borrowed_books: {
        Args:
          | { p_offset?: number; p_limit?: number }
          | { p_status: string; p_offset?: number; p_limit?: number }
        Returns: {
          book_id: number
          title: string
          cover_image: string
          borrowed_count: number
        }[]
      }
      get_top_borrowed_books_by_categories: {
        Args: { p_category_ids: number[]; p_offset?: number; p_limit?: number }
        Returns: {
          book_id: number
          title: string
          cover_image: string
          category_name: string
          borrow_count: number
        }[]
      }
      get_top_borrowed_books_by_category: {
        Args: { p_category_ids: number[]; p_offset?: number; p_limit?: number }
        Returns: {
          book_id: number
          title: string
          cover_image: string
          category_name: string
          borrow_count: number
        }[]
      }
      get_top_borrowed_books_count: {
        Args: { p_status: string }
        Returns: number
      }
      get_top_borrowed_readers: {
        Args:
          | { p_offset?: number; p_limit?: number }
          | { p_status: string; p_offset?: number; p_limit?: number }
        Returns: {
          reader_id: string
          name: string
          email: string
          borrow_count: number
        }[]
      }
      get_top_borrowed_readers_count: {
        Args: { p_status: string }
        Returns: number
      }
      get_top_ordered_books: {
        Args: { limit_count?: number }
        Returns: {
          book_id: number
          book_title: string
          total_orders: number
          book_image: string
        }[]
      }
      get_top_rated_books: {
        Args:
          | { p_offset?: number; p_limit?: number }
          | { p_sort_by?: string; p_offset?: number; p_limit?: number }
        Returns: {
          book_id: number
          title: string
          cover_image: string
          average_rating: number
          review_count: number
        }[]
      }
      get_top_rated_books_count: {
        Args: Record<PropertyKey, never>
        Returns: number
      }
      notify_wishlist_availability: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      process_overdue_orders: {
        Args: Record<PropertyKey, never>
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
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
