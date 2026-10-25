"use client";

import { useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { subscribeToCart, getCartSnapshot, getCartServerSnapshot, parseCartSnapshot, updateQty, removeFromCart, clearCart, cartTotalCents, formatPrice } from "@/lib/cart";

export default function CartPage() {
  const router = useRouter();
  const cartSnapshot = useSyncExternalStore(subscribeToCart, getCartSnapshot, getCartServerSnapshot);
  const items = parseCartSnapshot(cartSnapshot);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function checkout() {
    setError("");
    const me = await fetch("/api/auth/me").then((r) => r.json());
    if (!me.user) {
      router.push("/login?next=/cart");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((i) => ({ productId: i.productId, quantity: i.quantity })),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Checkout failed.");
        return;
      }
      clearCart();
      router.push("/orders");
    } catch {
      setError("Checkout failed.");
    } finally {
      setLoading(false);
    }
  }

  if (items.length === 0) {
    return (
      <div className="text-center">
        <h1 className="text-2xl font-bold">Your cart is empty</h1>
        <Link href="/" className="mt-4 inline-block text-indigo-600 hover:underline">
          Continue shopping
        </Link>
      </div>
    );
  }

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">Shopping Cart</h1>
      <div className="space-y-4">
        {items.map((item) => (
          <div
            key={item.productId}
            className="flex items-center gap-4 rounded-xl bg-white p-4 shadow-sm ring-1 ring-slate-200"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={item.image} alt={item.name} className="h-20 w-20 rounded object-cover" />
            <div className="flex-1">
              <div className="font-semibold">{item.name}</div>
              <div className="text-sm text-slate-500">{formatPrice(item.priceCents)} each</div>
            </div>
            <input
              type="number"
              min={1}
              value={item.quantity}
              onChange={(e) => updateQty(item.productId, Math.max(1, Number(e.target.value) || 1))}
              className="w-16 rounded-md border border-slate-300 px-2 py-1"
            />
            <div className="w-24 text-right font-semibold">
              {formatPrice(item.priceCents * item.quantity)}
            </div>
            <button
              onClick={() => removeFromCart(item.productId)}
              className="text-red-500 hover:text-red-700"
            >
              Remove
            </button>
          </div>
        ))}
      </div>

      <div className="mt-6 flex flex-col items-end gap-3">
        <div className="text-xl font-bold">Total: {formatPrice(cartTotalCents())}</div>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button
          onClick={checkout}
          disabled={loading}
          className="rounded-md bg-indigo-600 px-6 py-2 text-white hover:bg-indigo-500 disabled:opacity-50"
        >
          {loading ? "Processing..." : "Checkout"}
        </button>
      </div>
    </div>
  );
}