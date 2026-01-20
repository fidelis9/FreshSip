export interface Product {
  id: string;
  name: string;
  price: number;
  image_url: string | null;
  created_at: string;
}

export interface Branch {
  id: string;
  name: 'nairobi' | 'kisumu' | 'mombasa' | 'nakuru' | 'eldoret';
  display_name: string;
  is_headquarter: boolean;
  created_at: string;
}

export interface Stock {
  id: string;
  branch_id: string;
  product_id: string;
  quantity: number;
  updated_at: string;
}

export interface StockWithDetails extends Stock {
  branch: Branch;
  product: Product;
}

export interface Order {
  id: string;
  customer_id: string | null;
  branch_id: string;
  total_amount: number;
  payment_status: string;
  mpesa_reference: string | null;
  created_at: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  quantity: number;
  unit_price: number;
  subtotal: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface UserRole {
  id: string;
  user_id: string;
  role: 'admin' | 'customer';
}

export interface Profile {
  id: string;
  user_id: string;
  email: string;
  full_name: string | null;
  created_at: string;
  updated_at: string;
}

export interface SalesReport {
  productName: string;
  totalQuantity: number;
  totalIncome: number;
}
