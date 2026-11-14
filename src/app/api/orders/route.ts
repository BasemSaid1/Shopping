import { proxyAuthed } from "@/lib/authProxy";

export async function POST(request: Request) {
  const body = await request.json();

  return proxyAuthed<{
    _id: string;
    finalTotal: number;
    paymentMethod: string;
  }>(
    {
      method: "POST",
      url: "/order/checkout",
      data: {
        shippingAddress: body.shippingAddress,
        phone: body.phone,
        paymentMethod: body.paymentMethod,
        appliedCoupon: body.appliedCoupon || undefined,
      },
    },
    (order) => ({
      _id: order._id,
      finalTotal: order.finalTotal,
      paymentMethod: order.paymentMethod,
    }),
  );
}

export async function GET() {
  return proxyAuthed({ method: "GET", url: "/order" });
}
