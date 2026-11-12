import { NextResponse } from "next/server";
import { backend } from "@/lib/backend";
import { handleBackendError } from "@/lib/handleBackendError";

export async function PATCH(request: Request) {
  const body = await request.json();

  try {
    await backend.patch("/auth/forget-password", { email: body.email });
    return NextResponse.json({ success: true });
  } catch (error) {
    return handleBackendError(error);
  }
}
