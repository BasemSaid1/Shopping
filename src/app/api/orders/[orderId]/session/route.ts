import { NextResponse } from "next/server";
import { proxyAuthed } from "@/lib/authProxy";

const MONGO_ID = /^[a-f\d]{24}$/i;

export async function POST(
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

  return proxyAuthed<{ url: string | null }>(
    { method: "POST", url: `/order/checkout/${orderId}` },
    (session) => ({ url: session.url }),
  );
}
