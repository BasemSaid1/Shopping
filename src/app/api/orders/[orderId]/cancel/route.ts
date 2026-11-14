import { NextResponse } from "next/server";
import { proxyAuthed } from "@/lib/authProxy";

const MONGO_ID = /^[a-f\d]{24}$/i;

export async function PATCH(
  _request: Request,
  { params }: { params: Promise<{ orderId: string }> },
) {
  const { orderId } = await params;

  if (!MONGO_ID.test(orderId)) {
    return NextResponse.json(
      { success: false, message: "معرّف الطلب غير صحيح" },
      { status: 400 },
    );
  }

  return proxyAuthed({ method: "PATCH", url: `/order/${orderId}/cancel` });
}
