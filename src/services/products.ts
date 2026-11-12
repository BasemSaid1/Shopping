import { backend } from "@/lib/backend";
import type { ApiResponse, ProductsResult } from "@/types";

export interface ProductsParams {
  search?: string;
  category?: string;
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
  sort?: "newest" | "oldest" | "price_asc" | "price_desc";
  page?: number;
  limit?: number;
}

export async function getProducts(params: ProductsParams) {
  const { data } = await backend.get<ApiResponse<ProductsResult>>("/product", {
    params,
  });
  return data.data;
}
