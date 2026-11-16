import { NextResponse } from "next/server";
import { proxyAuthed } from "@/lib/authProxy";

interface BackendCoupon {
  _id: string;
  code: string;
  discountPercentage: number;
  maxUsageCount: number;
  usedCount: number;
  expiryDate: string;
  createdAt?: string;
}

const pickCoupon = (c: BackendCoupon) => ({
  _id: c._id,
  code: c.code,
  discountPercentage: c.discountPercentage,
  maxUsageCount: c.maxUsageCount,
  usedCount: c.usedCount,
  expiryDate: c.expiryDate,
});

export async function GET() {
  return proxyAuthed<BackendCoupon[]>(
    { method: "GET", url: "/coupon" },
    (coupons) =>
      [...coupons]
        .sort((a, b) => (b.createdAt ?? "").localeCompare(a.createdAt ?? ""))
        .map(pickCoupon),
  );
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  if (!body || typeof body !== "object") {
    return NextResponse.json(
      { success: false, message: "بيانات غير صالحة" },
      { status: 400 },
    );
  }

  return proxyAuthed<BackendCoupon>(
    {
      method: "POST",
      url: "/coupon",
      data: {
        code: body.code,
        discountPercentage: body.discountPercentage,
        maxUsageCount: body.maxUsageCount,
        expiryDate: body.expiryDate,
      },
    },
    pickCoupon,
  );
}
