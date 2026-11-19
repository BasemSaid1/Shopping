import { backend } from "@/lib/backend";
import type { ApiResponse, Brand } from "@/types";

export async function getBrands() {
  const { data } = await backend.get<ApiResponse<Brand[]>>("/brand");
  return data.data;
}
