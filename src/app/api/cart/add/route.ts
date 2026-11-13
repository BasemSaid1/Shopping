import { proxyAuthed } from "@/lib/authProxy";

export async function POST(request: Request) {
  const body = await request.json();

  return proxyAuthed({
    method: "POST",
    url: "/cart/add",
    data: { productId: body.productId, quantity: body.quantity },
  });
}
