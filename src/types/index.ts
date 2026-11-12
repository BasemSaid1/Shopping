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
