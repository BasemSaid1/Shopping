import { NextResponse } from "next/server";
import { proxyAuthed } from "@/lib/authProxy";

const MONGO_ID = /^[a-f\d]{24}$/i;

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  if (!MONGO_ID.test(id)) {
    return NextResponse.json(
      { success: false, message: "الكوبون غير موجود" },
      { status: 404 },
    );
  }

  const body = await request.json().catch(() => null);
  if (!body || typeof body !== "object") {
    return NextResponse.json(
      { success: false, message: "بيانات غير صالحة" },
      { status: 400 },
    );
  }

  return proxyAuthed(
    {
      method: "PATCH",
      url: `/coupon/${id}`,
      data: {
        code: body.code,
        discountPercentage: body.discountPercentage,
        maxUsageCount: body.maxUsageCount,
        expiryDate: body.expiryDate,
      },
    },
    () => ({ ok: true }),
  );
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  if (!MONGO_ID.test(id)) {
    return NextResponse.json(
      { success: false, message: "الكوبون غير موجود" },
      { status: 404 },
    );
  }

  return proxyAuthed({ method: "DELETE", url: `/coupon/${id}` }, () => ({
    ok: true,
  }));
}
