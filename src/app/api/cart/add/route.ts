import { NextResponse } from "next/server";
import { backend } from "@/lib/backend";
import { getAuthHeader } from "@/lib/authHeader";
import { handleBackendError } from "@/lib/handleBackendError";

export async function POST(request: Request) {
  const authorization = await getAuthHeader();

  if (!authorization) {
    return NextResponse.json(
      { success: false, message: "سجّل الدخول أولاً" },
      { status: 401 },
    );
  }

  const body = await request.json();

  try {
    await backend.post(
      "/cart/add",
      { productId: body.productId, quantity: body.quantity },
      { headers: { authorization } },
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    return handleBackendError(error);
  }
}
