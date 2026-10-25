"use client";

import { useState } from "react";
import { addToCart } from "@/lib/cart";
import type { Product } from "@/db/schema";

export default function AddToCartButton({ product }: { product: Product }) {
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  function handleAdd() {
    addToCart(
      {
        productId: product.id,
        name: product.name,
        priceCents: product.priceCents,
        image: product.image,
      },
      qty
    );
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  }

  return (
    <div className="flex items-center gap-3">
      <input
        type="number"
        min={1}
        max={product.stock}
        value={qty}
        onChange={(e) => setQty(Math.max(1, Number(e.target.value) || 1))}
        className="w-20 rounded-md border border-slate-300 px-3 py-2"
      />
      <button
        onClick={handleAdd}
        disabled={product.stock <= 0}
        className="rounded-md bg-indigo-600 px-5 py-2 text-white hover:bg-indigo-500 disabled:cursor-not-allowed disabled:bg-slate-300"
      >
        {added ? "Added!" : "Add to cart"}
      </button>
    </div>
  );
}