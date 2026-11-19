import { backend } from "@/lib/backend";
import type { ApiResponse, Category } from "@/types";

export async function getCategories() {
  const { data } = await backend.get<ApiResponse<Category[]>>("/category");
  return data.data;
}
