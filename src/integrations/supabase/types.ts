export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      attribute_values: {
        Row: {
          attribute_id: string
          created_at: string
          hex_color: string | null
          id: string
          sort_order: number | null
          value: string
        }
        Insert: {
          attribute_id: string
          created_at?: string
          hex_color?: string | null
          id?: string
          sort_order?: number | null
          value: string
        }
        Update: {
          attribute_id?: string
          created_at?: string
          hex_color?: string | null
          id?: string
          sort_order?: number | null
          value?: string
        }
        Relationships: [
          {
            foreignKeyName: "attribute_values_attribute_id_fkey"
            columns: ["attribute_id"]
            isOneToOne: false
            referencedRelation: "product_attributes"
            referencedColumns: ["id"]
          },
        ]
      }
      cart_sessions: {
        Row: {
          created_at: string
          customer_info: Json | null
          expires_at: string
          id: string
          items: Json
          session_id: string
          store_id: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          customer_info?: Json | null
          expires_at?: string
          id?: string
          items?: Json
          session_id: string
          store_id?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          customer_info?: Json | null
          expires_at?: string
          id?: string
          items?: Json
          session_id?: string
          store_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "cart_sessions_store_id_fkey"
            columns: ["store_id"]
            isOneToOne: false
            referencedRelation: "stores"
            referencedColumns: ["id"]
          },
        ]
      }
      categories: {
        Row: {
          created_at: string
          description: string | null
          id: string
          name: string
          parent_id: string | null
          store_id: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          name: string
          parent_id?: string | null
          store_id: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          parent_id?: string | null
          store_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "categories_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "categories_store_id_fkey"
            columns: ["store_id"]
            isOneToOne: false
            referencedRelation: "stores"
            referencedColumns: ["id"]
          },
        ]
      }
      custom_domains: {
        Row: {
          cloudflare_record_id: string | null
          cloudflare_zone_id: string | null
          created_at: string
          custom_domain: string
          id: string
          ssl_enabled: boolean
          store_id: string
          updated_at: string
          user_id: string
          verification_token: string
          verified: boolean
        }
        Insert: {
          cloudflare_record_id?: string | null
          cloudflare_zone_id?: string | null
          created_at?: string
          custom_domain: string
          id?: string
          ssl_enabled?: boolean
          store_id: string
          updated_at?: string
          user_id: string
          verification_token: string
          verified?: boolean
        }
        Update: {
          cloudflare_record_id?: string | null
          cloudflare_zone_id?: string | null
          created_at?: string
          custom_domain?: string
          id?: string
          ssl_enabled?: boolean
          store_id?: string
          updated_at?: string
          user_id?: string
          verification_token?: string
          verified?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "custom_domains_store_id_fkey"
            columns: ["store_id"]
            isOneToOne: false
            referencedRelation: "stores"
            referencedColumns: ["id"]
          },
        ]
      }
      customers: {
        Row: {
          address: Json | null
          created_at: string
          email: string
          first_name: string | null
          id: string
          last_name: string | null
          phone: string | null
          store_id: string
          updated_at: string
        }
        Insert: {
          address?: Json | null
          created_at?: string
          email: string
          first_name?: string | null
          id?: string
          last_name?: string | null
          phone?: string | null
          store_id: string
          updated_at?: string
        }
        Update: {
          address?: Json | null
          created_at?: string
          email?: string
          first_name?: string | null
          id?: string
          last_name?: string | null
          phone?: string | null
          store_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "customers_store_id_fkey"
            columns: ["store_id"]
            isOneToOne: false
            referencedRelation: "stores"
            referencedColumns: ["id"]
          },
        ]
      }
      dns_records: {
        Row: {
          cloudflare_record_id: string | null
          created_at: string | null
          domain_id: string
          id: string
          name: string
          priority: number | null
          proxied: boolean | null
          record_type: string
          status: string
          ttl: number | null
          updated_at: string | null
          value: string
        }
        Insert: {
          cloudflare_record_id?: string | null
          created_at?: string | null
          domain_id: string
          id?: string
          name: string
          priority?: number | null
          proxied?: boolean | null
          record_type: string
          status?: string
          ttl?: number | null
          updated_at?: string | null
          value: string
        }
        Update: {
          cloudflare_record_id?: string | null
          created_at?: string | null
          domain_id?: string
          id?: string
          name?: string
          priority?: number | null
          proxied?: boolean | null
          record_type?: string
          status?: string
          ttl?: number | null
          updated_at?: string | null
          value?: string
        }
        Relationships: [
          {
            foreignKeyName: "dns_records_domain_id_fkey"
            columns: ["domain_id"]
            isOneToOne: false
            referencedRelation: "domains"
            referencedColumns: ["id"]
          },
        ]
      }
      domains: {
        Row: {
          aws_amplify_app_id: string | null
          aws_deployment_url: string | null
          aws_domain_name: string | null
          cname_target: string | null
          created_at: string | null
          domain_name: string
          error_message: string | null
          id: string
          is_verified: boolean | null
          last_verified_at: string | null
          ssl_status: string
          status: string
          store_id: string
          updated_at: string | null
          vercel_domain_id: string | null
          verification_token: string | null
        }
        Insert: {
          aws_amplify_app_id?: string | null
          aws_deployment_url?: string | null
          aws_domain_name?: string | null
          cname_target?: string | null
          created_at?: string | null
          domain_name: string
          error_message?: string | null
          id?: string
          is_verified?: boolean | null
          last_verified_at?: string | null
          ssl_status?: string
          status?: string
          store_id: string
          updated_at?: string | null
          vercel_domain_id?: string | null
          verification_token?: string | null
        }
        Update: {
          aws_amplify_app_id?: string | null
          aws_deployment_url?: string | null
          aws_domain_name?: string | null
          cname_target?: string | null
          created_at?: string | null
          domain_name?: string
          error_message?: string | null
          id?: string
          is_verified?: boolean | null
          last_verified_at?: string | null
          ssl_status?: string
          status?: string
          store_id?: string
          updated_at?: string | null
          vercel_domain_id?: string | null
          verification_token?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "domains_store_id_fkey"
            columns: ["store_id"]
            isOneToOne: false
            referencedRelation: "stores"
            referencedColumns: ["id"]
          },
        ]
      }
      order_items: {
        Row: {
          created_at: string
          id: string
          order_id: string
          price: number
          product_id: string
          quantity: number
          total: number
        }
        Insert: {
          created_at?: string
          id?: string
          order_id: string
          price: number
          product_id: string
          quantity?: number
          total: number
        }
        Update: {
          created_at?: string
          id?: string
          order_id?: string
          price?: number
          product_id?: string
          quantity?: number
          total?: number
        }
        Relationships: [
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          billing_address: Json | null
          created_at: string
          currency: string
          customer_id: string | null
          id: string
          notes: string | null
          order_number: string
          shipping_address: Json | null
          shipping_amount: number
          status: Database["public"]["Enums"]["order_status"]
          store_id: string
          subtotal: number
          tax_amount: number
          total_amount: number
          updated_at: string
        }
        Insert: {
          billing_address?: Json | null
          created_at?: string
          currency?: string
          customer_id?: string | null
          id?: string
          notes?: string | null
          order_number: string
          shipping_address?: Json | null
          shipping_amount?: number
          status?: Database["public"]["Enums"]["order_status"]
          store_id: string
          subtotal?: number
          tax_amount?: number
          total_amount?: number
          updated_at?: string
        }
        Update: {
          billing_address?: Json | null
          created_at?: string
          currency?: string
          customer_id?: string | null
          id?: string
          notes?: string | null
          order_number?: string
          shipping_address?: Json | null
          shipping_amount?: number
          status?: Database["public"]["Enums"]["order_status"]
          store_id?: string
          subtotal?: number
          tax_amount?: number
          total_amount?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "orders_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_store_id_fkey"
            columns: ["store_id"]
            isOneToOne: false
            referencedRelation: "stores"
            referencedColumns: ["id"]
          },
        ]
      }
      product_attributes: {
        Row: {
          created_at: string
          id: string
          name: string
          type: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          type: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          type?: string
          updated_at?: string
        }
        Relationships: []
      }
      product_variants: {
        Row: {
          compare_price: number | null
          cost_price: number | null
          created_at: string
          id: string
          images: string[] | null
          inventory_quantity: number | null
          is_default: boolean | null
          price: number | null
          product_id: string
          sku: string | null
          updated_at: string
          weight: number | null
        }
        Insert: {
          compare_price?: number | null
          cost_price?: number | null
          created_at?: string
          id?: string
          images?: string[] | null
          inventory_quantity?: number | null
          is_default?: boolean | null
          price?: number | null
          product_id: string
          sku?: string | null
          updated_at?: string
          weight?: number | null
        }
        Update: {
          compare_price?: number | null
          cost_price?: number | null
          created_at?: string
          id?: string
          images?: string[] | null
          inventory_quantity?: number | null
          is_default?: boolean | null
          price?: number | null
          product_id?: string
          sku?: string | null
          updated_at?: string
          weight?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "product_variants_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          category_id: string | null
          compare_price: number | null
          cost_price: number | null
          created_at: string
          description: string | null
          dimensions: Json | null
          id: string
          images: string[] | null
          inventory_quantity: number | null
          name: string
          price: number
          sku: string | null
          status: Database["public"]["Enums"]["product_status"]
          store_id: string
          tags: string[] | null
          track_inventory: boolean | null
          updated_at: string
          weight: number | null
        }
        Insert: {
          category_id?: string | null
          compare_price?: number | null
          cost_price?: number | null
          created_at?: string
          description?: string | null
          dimensions?: Json | null
          id?: string
          images?: string[] | null
          inventory_quantity?: number | null
          name: string
          price: number
          sku?: string | null
          status?: Database["public"]["Enums"]["product_status"]
          store_id: string
          tags?: string[] | null
          track_inventory?: boolean | null
          updated_at?: string
          weight?: number | null
        }
        Update: {
          category_id?: string | null
          compare_price?: number | null
          cost_price?: number | null
          created_at?: string
          description?: string | null
          dimensions?: Json | null
          id?: string
          images?: string[] | null
          inventory_quantity?: number | null
          name?: string
          price?: number
          sku?: string | null
          status?: Database["public"]["Enums"]["product_status"]
          store_id?: string
          tags?: string[] | null
          track_inventory?: boolean | null
          updated_at?: string
          weight?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "products_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "products_store_id_fkey"
            columns: ["store_id"]
            isOneToOne: false
            referencedRelation: "stores"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          email: string | null
          first_name: string | null
          id: string
          last_name: string | null
          phone: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          email?: string | null
          first_name?: string | null
          id?: string
          last_name?: string | null
          phone?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          email?: string | null
          first_name?: string | null
          id?: string
          last_name?: string | null
          phone?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      public_orders: {
        Row: {
          billing_address: Json | null
          created_at: string
          currency: string
          customer_email: string
          customer_name: string | null
          customer_phone: string | null
          id: string
          items: Json
          order_number: string
          shipping_address: Json | null
          status: string
          store_id: string | null
          total_amount: number
          updated_at: string
        }
        Insert: {
          billing_address?: Json | null
          created_at?: string
          currency?: string
          customer_email: string
          customer_name?: string | null
          customer_phone?: string | null
          id?: string
          items?: Json
          order_number: string
          shipping_address?: Json | null
          status?: string
          store_id?: string | null
          total_amount?: number
          updated_at?: string
        }
        Update: {
          billing_address?: Json | null
          created_at?: string
          currency?: string
          customer_email?: string
          customer_name?: string | null
          customer_phone?: string | null
          id?: string
          items?: Json
          order_number?: string
          shipping_address?: Json | null
          status?: string
          store_id?: string | null
          total_amount?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "public_orders_store_id_fkey"
            columns: ["store_id"]
            isOneToOne: false
            referencedRelation: "stores"
            referencedColumns: ["id"]
          },
        ]
      }
      site_templates: {
        Row: {
          created_at: string
          id: string
          is_published: boolean | null
          store_id: string
          template_data: Json
          template_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_published?: boolean | null
          store_id: string
          template_data: Json
          template_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          is_published?: boolean | null
          store_id?: string
          template_data?: Json
          template_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "site_templates_store_id_fkey"
            columns: ["store_id"]
            isOneToOne: false
            referencedRelation: "stores"
            referencedColumns: ["id"]
          },
        ]
      }
      ssl_certificates: {
        Row: {
          auto_renew: boolean | null
          cloudflare_cert_id: string | null
          created_at: string | null
          domain_id: string
          expires_at: string | null
          id: string
          issued_at: string | null
          status: string
          updated_at: string | null
        }
        Insert: {
          auto_renew?: boolean | null
          cloudflare_cert_id?: string | null
          created_at?: string | null
          domain_id: string
          expires_at?: string | null
          id?: string
          issued_at?: string | null
          status?: string
          updated_at?: string | null
        }
        Update: {
          auto_renew?: boolean | null
          cloudflare_cert_id?: string | null
          created_at?: string | null
          domain_id?: string
          expires_at?: string | null
          id?: string
          issued_at?: string | null
          status?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ssl_certificates_domain_id_fkey"
            columns: ["domain_id"]
            isOneToOne: false
            referencedRelation: "domains"
            referencedColumns: ["id"]
          },
        ]
      }
      stores: {
        Row: {
          created_at: string
          description: string | null
          domain: string | null
          id: string
          logo_url: string | null
          merchant_id: string
          name: string
          settings: Json | null
          slug: string | null
          status: Database["public"]["Enums"]["store_status"]
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          domain?: string | null
          id?: string
          logo_url?: string | null
          merchant_id: string
          name: string
          settings?: Json | null
          slug?: string | null
          status?: Database["public"]["Enums"]["store_status"]
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          domain?: string | null
          id?: string
          logo_url?: string | null
          merchant_id?: string
          name?: string
          settings?: Json | null
          slug?: string | null
          status?: Database["public"]["Enums"]["store_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "stores_merchant_id_fkey"
            columns: ["merchant_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      testimonials: {
        Row: {
          content: string
          created_at: string
          customer_email: string
          customer_name: string
          id: string
          is_approved: boolean | null
          product_id: string | null
          rating: number
          store_id: string
          updated_at: string
        }
        Insert: {
          content: string
          created_at?: string
          customer_email: string
          customer_name: string
          id?: string
          is_approved?: boolean | null
          product_id?: string | null
          rating: number
          store_id: string
          updated_at?: string
        }
        Update: {
          content?: string
          created_at?: string
          customer_email?: string
          customer_name?: string
          id?: string
          is_approved?: boolean | null
          product_id?: string | null
          rating?: number
          store_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "testimonials_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      variant_attribute_values: {
        Row: {
          attribute_value_id: string
          created_at: string
          id: string
          variant_id: string
        }
        Insert: {
          attribute_value_id: string
          created_at?: string
          id?: string
          variant_id: string
        }
        Update: {
          attribute_value_id?: string
          created_at?: string
          id?: string
          variant_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "variant_attribute_values_attribute_value_id_fkey"
            columns: ["attribute_value_id"]
            isOneToOne: false
            referencedRelation: "attribute_values"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "variant_attribute_values_variant_id_fkey"
            columns: ["variant_id"]
            isOneToOne: false
            referencedRelation: "product_variants"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      generate_order_number: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      generate_variant_sku: {
        Args: { product_name: string; variant_attributes: string[] }
        Returns: string
      }
    }
    Enums: {
      order_status:
        | "pending"
        | "confirmed"
        | "processing"
        | "shipped"
        | "delivered"
        | "cancelled"
      product_status: "draft" | "active" | "inactive"
      store_status: "draft" | "active" | "suspended"
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
      order_status: [
        "pending",
        "confirmed",
        "processing",
        "shipped",
        "delivered",
        "cancelled",
      ],
      product_status: ["draft", "active", "inactive"],
      store_status: ["draft", "active", "suspended"],
    },
  },
} as const
