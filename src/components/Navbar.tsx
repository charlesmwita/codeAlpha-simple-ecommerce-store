"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { cartCount } from "@/lib/cart";

type User = { id: number; name: string; email: string } | null;

export default function Navbar() {
  const [user, setUser] = useState<User>(null);
  const [count, setCount] = useState(0);

  useEffect(() => {
    const updateCount = () => setCount(cartCount());
    updateCount();
    window.addEventListener("cart:updated", updateCount);
    window.addEventListener("storage", updateCount);
    return () => {
      window.removeEventListener("cart:updated", updateCount);
      window.removeEventListener("storage", updateCount);
    };
  }, []);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((d) => setUser(d.user ?? null))
      .catch(() => setUser(null));
  }, []);

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    setUser(null);
    window.location.href = "/";
  }

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link href="/" className="text-xl font-bold text-indigo-600">
          ShopEase
        </Link>
        <nav className="flex items-center gap-4 text-sm font-medium">
          <Link href="/products" className="hover:text-indigo-600">
            Products
          </Link>
          <Link href="/cart" className="relative hover:text-indigo-600">
            Cart
            {count > 0 && (
              <span className="ml-1 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-indigo-600 px-1 text-xs text-white">
                {count}
              </span>
            )}
          </Link>
          {user ? (
            <>
              <Link href="/orders" className="hover:text-indigo-600">
                Orders
              </Link>
              <span className="text-slate-500">{user.name}</span>
              <button
                onClick={logout}
                className="rounded-md bg-slate-900 px-3 py-1.5 text-white hover:bg-slate-700"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="rounded-md border border-slate-300 px-3 py-1.5 hover:bg-slate-100"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="rounded-md bg-indigo-600 px-3 py-1.5 text-white hover:bg-indigo-500"
              >
                Register
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}