export interface Product {
  id: string;
  creator_id: string;
  title: string;
  slug: string;
  description: string;
  agent_type: string;
  model_compatibility: string[];
  personality_tags: string[];
  price: number;
  currency: string;
  status: string;
  rating?: number;
  reviews_count?: number;
  created_at: string;
  updated_at: string;
}

export interface Version {
  id: string;
  product_id: string;
  version: string;
  file_content: string;
  is_latest: boolean;
  created_at: string;
}

export interface User {
  id: string;
  email: string;
  phone?: string;
  role: 'buyer' | 'creator' | 'admin';
  real_name?: string;
  openclaw_workspace_id?: string;
  status: string;
}

export interface SearchParams {
  query?: string;
  agent_type?: string;
  model?: string;
  tags?: string[];
  price_min?: number;
  price_max?: number;
  sort?: string;
  page?: number;
  limit?: number;
}

export interface CartItem {
  product: Product;
  version?: Version;
  quantity: number;
}

export interface Order {
  id: string;
  buyer_id: string;
  product_id: string;
  version_id: string;
  price: number;
  currency: string;
  payment_status: string;
  payment_method: string;
  authorization_type: string;
  created_at: string;
  completed_at?: string;
}

export interface Review {
  id: string;
  product_id: string;
  buyer_id: string;
  rating: number;
  comment?: string;
  images?: string[];
  created_at: string;
}
