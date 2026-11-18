import { NextResponse } from "next/server";
import { proxyAuthed } from "@/lib/authProxy";

const MONGO_ID = /^[a-f\d]{24}$/i;

type Context = { params: Promise<{ productId: string }> };

const invalidId = () =>
  NextResponse.json(
    { success: false, message: "معرّف المنتج غير صحيح" },
    { status: 400 },
  );

// ?variantId=... اختياري (للمنتجات اللي ليها خيارات)
function readVariantId(request: Request) {
  const variantId = new URL(request.url).searchParams.get("variantId");
  if (!variantId) return { variantId: undefined, valid: true };
  return { variantId, valid: MONGO_ID.test(variantId) };
}

export async function PATCH(request: Request, { params }: Context) {
  const { productId } = await params;
  const { variantId, valid } = readVariantId(request);
  if (!MONGO_ID.test(productId) || !valid) return invalidId();

  const body = await request.json().catch(() => null);
  if (body?.action !== "increase" && body?.action !== "decrease") {
    return NextResponse.json(
      { success: false, message: "بيانات غير صالحة" },
      { status: 400 },
    );
  }

  return proxyAuthed({
    method: "PATCH",
    url: `/cart/item/${productId}`,
    params: variantId ? { variantId } : undefined,
    data: { action: body.action },
  });
}

export async function DELETE(request: Request, { params }: Context) {
  const { productId } = await params;
  const { variantId, valid } = readVariantId(request);
  if (!MONGO_ID.test(productId) || !valid) return invalidId();

  return proxyAuthed({
    method: "DELETE",
    url: `/cart/item/${productId}`,
    params: variantId ? { variantId } : undefined,
  });
}
