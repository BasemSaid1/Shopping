import { NextResponse } from "next/server";
import { backend } from "@/lib/backend";
import { handleBackendError } from "@/lib/handleBackendError";

export async function PATCH(request: Request) {
  const body = await request.json();

  try {
    await backend.patch("/auth/verify-email", {
      email: body.email,
      confirmEmailOTP: body.confirmEmailOTP,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return handleBackendError(error);
  }
}
