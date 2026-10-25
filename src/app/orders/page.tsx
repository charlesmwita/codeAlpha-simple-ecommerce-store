"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { formatPrice } from "@/lib/cart";

type OrderItem = {
  id: number;
  productId: number;
  quantity: number;
  priceCents: number;
  product: { name: string; image: string } | null;
};

type Order = {
  id: number;
  totalCents: number;
  status: string;
  createdAt: string;
  items: OrderItem[];
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/orders")
      .then(async (r) => {
        const data = await r.json();
        if (!r.ok) throw new Error(data.error || "Failed");
        setOrders(data.orders ?? []);
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Loading orders...</p>;
  if (error) {
    return (
      <div>
        <p className="text-red-600">{error}</p>
        <Link href="/login" className="text-indigo-600">
          Login
        </Link>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="text-center">
        <h1 className="text-2xl font-bold">No orders yet</h1>
        <Link href="/" className="mt-4 inline-block text-indigo-600 hover:underline">
          Start shopping
        </Link>
      </div>
    );
  }

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">My Orders</h1>
      <div className="space-y-6">
        {orders.map((order) => (
          <div key={order.id} className="rounded-xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <span className="font-semibold">Order #{order.id}</span>
                <span className="ml-3 text-sm text-slate-500">
                  {new Date(order.createdAt).toLocaleString()}
                </span>
              </div>
              <span className="rounded-full bg-green-100 px-3 py-1 text-sm text-green-700">
                {order.status}
              </span>
            </div>
            <div className="mt-4 space-y-2">
              {order.items.map((it) => (
                <div key={it.id} className="flex items-center gap-3">
                  {it.product?.image && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={it.product.image} alt={it.product.name} className="h-12 w-12 rounded object-cover" />
                  )}
                  <div className="flex-1">
                    <div className="text-sm font-medium">{it.product?.name ?? `Product ${it.productId}`}</div>
                    <div className="text-xs text-slate-500">
                      {it.quantity} × {formatPrice(it.priceCents)}
                    </div>
                  </div>
                  <div className="text-sm font-semibold">{formatPrice(it.priceCents * it.quantity)}</div>
                </div>
              ))}
            </div>
            <div className="mt-4 border-t pt-3 text-right font-bold">
              Total: {formatPrice(order.totalCents)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}