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
      book_items: {
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
            foreignKeyName: "book_items_book_id_fkey"
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
          quantity: number | null
          title: string
        }
        Insert: {
          cover_image?: string | null
          created_at?: string
          description?: string | null
          id?: number
          quantity?: number | null
          title: string
        }
        Update: {
          cover_image?: string | null
          created_at?: string
          description?: string | null
          id?: number
          quantity?: number | null
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
          reader_id?: string
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
            foreignKeyName: "carts_reader_id_fkey"
            columns: ["reader_id"]
            isOneToOne: false
            referencedRelation: "readers"
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
      messages: {
        Row: {
          content: string
          created_at: string
          id: number
          is_read: boolean
          receiver_id: string
          sender_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: number
          is_read?: boolean
          receiver_id?: string
          sender_id?: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: number
          is_read?: boolean
          receiver_id?: string
          sender_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "messages_receiver_id_fkey"
            columns: ["receiver_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          created_at: string
          id: number
          is_read: boolean | null
          message: string | null
          notifiable_id: number | null
          notifiable_type: string | null
          reader_id: string | null
          type: string | null
        }
        Insert: {
          created_at?: string
          id?: number
          is_read?: boolean | null
          message?: string | null
          notifiable_id?: number | null
          notifiable_type?: string | null
          reader_id?: string | null
          type?: string | null
        }
        Update: {
          created_at?: string
          id?: number
          is_read?: boolean | null
          message?: string | null
          notifiable_id?: number | null
          notifiable_type?: string | null
          reader_id?: string | null
          type?: string | null
        }
        Relationships: []
      }
      order_items: {
        Row: {
          book_id: number
          book_item_id: number | null
          comment: string | null
          created_at: string
          deleted_at: string | null
          id: number
          order_id: number
          status: string | null
          updated_at: string
        }
        Insert: {
          book_id: number
          book_item_id?: number | null
          comment?: string | null
          created_at?: string
          deleted_at?: string | null
          id?: number
          order_id: number
          status?: string | null
          updated_at?: string
        }
        Update: {
          book_id?: number
          book_item_id?: number | null
          comment?: string | null
          created_at?: string
          deleted_at?: string | null
          id?: number
          order_id?: number
          status?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "order_items_book_id_fkey"
            columns: ["book_id"]
            isOneToOne: false
            referencedRelation: "books"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      order_renews: {
        Row: {
          approved_by: string | null
          comment: string | null
          created_at: string
          id: number
          new_due_date: string | null
          order_id: number
          reader_id: string
          request_note: string | null
        }
        Insert: {
          approved_by?: string | null
          comment?: string | null
          created_at?: string
          id?: number
          new_due_date?: string | null
          order_id: number
          reader_id: string
          request_note?: string | null
        }
        Update: {
          approved_by?: string | null
          comment?: string | null
          created_at?: string
          id?: number
          new_due_date?: string | null
          order_id?: number
          reader_id?: string
          request_note?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "order_renew_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_renew_reader_id_fkey"
            columns: ["reader_id"]
            isOneToOne: false
            referencedRelation: "readers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_renews_approved_by_fkey"
            columns: ["approved_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          approved_by: string | null
          comment: string | null
          created_at: string
          due_date: string | null
          id: number
          reader_id: string
          returned_at: string | null
          status: string | null
          updated_at: string
        }
        Insert: {
          approved_by?: string | null
          comment?: string | null
          created_at?: string
          due_date?: string | null
          id?: number
          reader_id?: string
          returned_at?: string | null
          status?: string | null
          updated_at?: string
        }
        Update: {
          approved_by?: string | null
          comment?: string | null
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
            foreignKeyName: "orders_approved_by_fkey"
            columns: ["approved_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_reader_id_fkey"
            columns: ["reader_id"]
            isOneToOne: false
            referencedRelation: "readers"
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
      readers: {
        Row: {
          address: string | null
          birthday: string | null
          created_at: string
          email: string
          full_name: string
          id: string
          photo: string | null
        }
        Insert: {
          address?: string | null
          birthday?: string | null
          created_at?: string
          email: string
          full_name: string
          id?: string
          photo?: string | null
        }
        Update: {
          address?: string | null
          birthday?: string | null
          created_at?: string
          email?: string
          full_name?: string
          id?: string
          photo?: string | null
        }
        Relationships: []
      }
      reviews: {
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
          reader_id?: string
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
            foreignKeyName: "reviews_book_id_fkey"
            columns: ["book_id"]
            isOneToOne: false
            referencedRelation: "books"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_reader_id_fkey"
            columns: ["reader_id"]
            isOneToOne: false
            referencedRelation: "readers"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          created_at: string
          email: string | null
          full_name: string
          id: string
          photo: string | null
        }
        Insert: {
          created_at?: string
          email?: string | null
          full_name: string
          id?: string
          photo?: string | null
        }
        Update: {
          created_at?: string
          email?: string | null
          full_name?: string
          id?: string
          photo?: string | null
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
          reader_id?: string
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
            foreignKeyName: "wishlists_reader_id_fkey"
            columns: ["reader_id"]
            isOneToOne: false
            referencedRelation: "readers"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
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
        Args: Record<PropertyKey, never>
        Returns: {
          book_id: number
          book_title: string
          book_image: string
          average_rating: number
          rating_count: number
        }[]
      }
      get_due_orders: {
        Args: { currentdate: string }
        Returns: {
          approved_by: string | null
          comment: string | null
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
