import { NextResponse } from "next/server";
import { backend } from "@/lib/backend";
import { getAuthHeader } from "@/lib/authHeader";
import { proxyAuthed } from "@/lib/authProxy";
import { handleBackendError } from "@/lib/handleBackendError";
import type { Review } from "@/types";

const MONGO_ID = /^[a-f\d]{24}$/i;

interface BackendReview {
  _id: string;
  rating: number;
  comment: string;
  createdAt: string;
  user: { firstName: string; lastName: string; email: string } | null;
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ productId: string }> },
) {
  const { productId } = await params;
  if (!MONGO_ID.test(productId)) {
    return NextResponse.json(
      { success: false, message: "المنتج غير موجود" },
      { status: 404 },
    );
  }

  try {
    const { data } = await backend.get(`/review/product/${productId}`);
    const list: BackendReview[] = data.data ?? [];

    // لو المستخدم مسجّل، بنجيب إيميله عشان نعرف تقييمه
    let myEmail: string | null = null;
    const authorization = await getAuthHeader();
    if (authorization) {
      try {
        const profile = await backend.get("/auth/profile", {
          headers: { authorization },
        });
        myEmail = profile.data?.data?.results?.email ?? null;
      } catch {
        myEmail = null;
      }
    }

    const reviews: Review[] = list.map((r) => ({
      _id: r._id,
      rating: r.rating,
      comment: r.comment,
      createdAt: r.createdAt,
      authorName: r.user
        ? `${r.user.firstName} ${r.user.lastName}`.trim()
        : "مستخدم",
      mine: Boolean(myEmail && r.user?.email === myEmail),
    }));

    return NextResponse.json({ success: true, data: reviews });
  } catch (error) {
    return handleBackendError(error);
  }
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ productId: string }> },
) {
  const { productId } = await params;
  const body = await request.json();

  return proxyAuthed(
    {
      method: "POST",
      url: "/review",
      data: {
        product: productId,
        rating: Number(body.rating),
        comment: body.comment,
      },
    },
    () => ({ ok: true }),
  );
}
