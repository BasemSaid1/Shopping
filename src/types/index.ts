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
  options?: ProductOption[];
  variants?: ProductVariant[];
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
  variantId?: string;
  variantLabel?: string;
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
  variantId?: string;
  variantLabel?: string;
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

export interface Category {
  _id: string;
  name: string;
  logo?: string;
}

export interface Brand {
  _id: string;
  name: string;
  logo?: string;
  categories: NamedRef[];
}

export interface Profile {
  _id: string;
  firstName: string;
  lastName: string;
  userName: string;
  email: string;
  role: Role;
  gender: string;
  provider: string;
  profilePic?: string;
  createdAt: string;
}

export interface Review {
  _id: string;
  rating: number;
  comment: string;
  authorName: string;
  mine: boolean;
  createdAt: string;
}

export interface Coupon {
  _id: string;
  code: string;
  discountPercentage: number;
  maxUsageCount: number;
  usedCount: number;
  expiryDate: string;
}

export interface AdminOrder extends Order {
  user: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
  } | null;
}

export interface AdminOrdersResult {
  orders: AdminOrder[];
  pagination: Pagination;
}

export interface AdminStats {
  totalOrders: number;
  orders: Partial<Record<OrderStatus, number>>;
  revenue: number;
  lowStock: number;
  outOfStock: number;
}

export interface ProductOption {
  name: string;
  values: string[];
}

export interface ProductVariant {
  _id: string;
  attributes: { name: string; value: string }[];
  price: number;
  stock: number;
}
