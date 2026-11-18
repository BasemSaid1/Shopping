import { proxyAuthed } from "@/lib/authProxy";

export async function POST(request: Request) {
  const body = await request.json();

  return proxyAuthed({
    method: "POST",
    url: "/cart/add",
    data: {
      productId: body.productId,
      quantity: body.quantity,
      // اختياري: بس للمنتجات اللي ليها خيارات
      ...(typeof body.variantId === "string" && body.variantId
        ? { variantId: body.variantId }
        : {}),
    },
  });
}
