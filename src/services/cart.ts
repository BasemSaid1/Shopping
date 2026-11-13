import { backend } from "@/lib/backend";
import { getAuthHeader } from "@/lib/authHeader";
import type { ApiResponse, Cart } from "@/types";

export async function getCart() {
  const authorization = await getAuthHeader();
  if (!authorization) return null;

  const { data } = await backend.get<ApiResponse<Cart>>("/cart", {
    headers: { authorization },
  });

  return data.data;
}
