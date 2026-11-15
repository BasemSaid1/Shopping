import { proxyAuthed } from "@/lib/authProxy";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ reviewId: string }> },
) {
  const { reviewId } = await params;
  const body = await request.json();

  return proxyAuthed(
    {
      method: "PATCH",
      url: `/review/${reviewId}`,
      data: { rating: Number(body.rating), comment: body.comment },
    },
    () => ({ ok: true }),
  );
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ reviewId: string }> },
) {
  const { reviewId } = await params;

  return proxyAuthed({ method: "DELETE", url: `/review/${reviewId}` }, () => ({
    ok: true,
  }));
}
