import { proxyAuthed } from "@/lib/authProxy";
import type { Profile } from "@/types";

interface BackendProfile {
  message: string;
  results: Profile;
}

export async function GET() {
  return proxyAuthed<BackendProfile>(
    { method: "GET", url: "/auth/profile" },
    ({ results: u }) => ({
      _id: u._id,
      firstName: u.firstName,
      lastName: u.lastName,
      userName: u.userName,
      email: u.email,
      role: u.role,
      gender: u.gender,
      provider: u.provider,
      profilePic: u.profilePic,
      createdAt: u.createdAt,
    }),
  );
}
