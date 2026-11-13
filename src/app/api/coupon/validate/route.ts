import { proxyAuthed } from "@/lib/authProxy";

export async function POST(request: Request) {
  const body = await request.json();

  return proxyAuthed<{ code: string; discountPercentage: number }>(
    { method: "POST", url: "/coupon/validate", data: { code: body.code } },
    (coupon) => ({
      code: coupon.code,
      discountPercentage: coupon.discountPercentage,
    }),
  );
}
