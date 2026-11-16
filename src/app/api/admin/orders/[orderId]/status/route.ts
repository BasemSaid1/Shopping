import { NextResponse } from "next/server";
import { proxyAuthed } from "@/lib/authProxy";

const MONGO_ID = /^[a-f\d]{24}$/i;
const ALLOWED = ["CONFIRMED", "SHIPPED", "DELIVERED", "CANCELLED"];

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ orderId: string }> },
) {
  const { orderId } = await params;
  if (!MONGO_ID.test(orderId)) {
    return NextResponse.json(
      { success: false, message: "الطلب غير موجود" },
      { status: 404 },
    );
  }

  const body = await request.json().catch(() => null);
  if (!body || !ALLOWED.includes(body.status)) {
    return NextResponse.json(
      { success: false, message: "حالة الطلب غير صالحة" },
      { status: 400 },
    );
  }

  return proxyAuthed(
    {
      method: "PATCH",
      url: `/order/admin/${orderId}/status`,
      data: { status: body.status },
    },
    () => ({ ok: true }),
  );
}
