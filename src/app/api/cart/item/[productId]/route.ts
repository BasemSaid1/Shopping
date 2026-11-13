import { NextResponse } from "next/server";
import { proxyAuthed } from "@/lib/authProxy";

const MONGO_ID = /^[a-f\d]{24}$/i;

type Context = { params: Promise<{ productId: string }> };

const invalidId = () =>
  NextResponse.json(
    { success: false, message: "معرّف المنتج غير صحيح" },
    { status: 400 },
  );

export async function PATCH(request: Request, { params }: Context) {
  const { productId } = await params;
  if (!MONGO_ID.test(productId)) return invalidId();

  const body = await request.json();

  return proxyAuthed({
    method: "PATCH",
    url: `/cart/item/${productId}`,
    data: { action: body.action },
  });
}

export async function DELETE(_request: Request, { params }: Context) {
  const { productId } = await params;
  if (!MONGO_ID.test(productId)) return invalidId();

  return proxyAuthed({
    method: "DELETE",
    url: `/cart/item/${productId}`,
  });
}
