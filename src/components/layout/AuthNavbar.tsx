import { cookies } from "next/headers";
import { getCart } from "@/services/cart";
import Navbar from "./Navbar";

export default async function AuthNavbar() {
  const cookieStore = await cookies();
  const isLoggedIn = cookieStore.has("token");

  let cartCount = 0;

  if (isLoggedIn) {
    try {
      const cart = await getCart();
      cartCount =
        cart?.items.reduce((sum, item) => sum + item.quantity, 0) ?? 0;
    } catch {
      cartCount = 0;
    }
  }

  return <Navbar isLoggedIn={isLoggedIn} cartCount={cartCount} />;
}
