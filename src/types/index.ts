export type Role = "USER" | "ADMIN";

export interface ApiResponse<T> {
  success: boolean;
  statusCode: number;
  data: T;
}

export interface LoginResult {
  message: string;
  token: string;
  role: Role;
}

export interface NamedRef {
  _id: string;
  name: string;
  logo?: string;
}

export interface Product {
  _id: string;
  title: string;
  description?: string;
  price: number;
  stock: number;
  image: string;
  gallery: string[];
  category: NamedRef | null;
  brand: NamedRef | null;
  createdAt: string;
}

export interface Pagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface ProductsResult {
  products: Product[];
  pagination: Pagination;
}

export interface CartItem {
  product: Product | null;
  quantity: number;
  pricePerUnit: number;
  subTotal: number;
}

export interface Cart {
  _id: string;
  items: CartItem[];
  totalPrice: number;
}

export type OrderStatus =
  | "PENDING"
  | "PAID"
  | "CONFIRMED"
  | "SHIPPED"
  | "DELIVERED"
  | "CANCELLED";

export type PaymentMethod = "CARD" | "CASH";

export interface OrderItem {
  product: Pick<Product, "_id" | "title" | "image" | "price"> | null;
  quantity: number;
  priceSnapShot: number;
}

export interface Order {
  _id: string;
  items: OrderItem[];
  subTotal: number;
  discountAmount: number;
  finalTotal: number;
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  shippingAddress: string;
  phone: string;
  appliedCoupon: { code: string; discountPercentage: number } | null;
  createdAt: string;
  refundedAt?: string;
}
