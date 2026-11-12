import { cookies } from "next/headers";
import Navbar from "./Navbar";

export default async function AuthNavbar() {
  const cookieStore = await cookies();
  const isLoggedIn = cookieStore.has("token");

  return <Navbar isLoggedIn={isLoggedIn} />;
}
