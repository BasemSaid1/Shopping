import { cookies } from "next/headers";

export async function getAuthHeader() {
  const store = await cookies();
  const token = store.get("token")?.value;
  const role = store.get("role")?.value;

  if (!token || !role) return null;

  return `${role} ${token}`;
}
