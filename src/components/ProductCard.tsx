"use client";

import Link from "next/link";
import { addToCart, formatPrice } from "@/lib/cart";
import type { Product } from "@/db/schema";

export default function ProductCard({ product }: { product: Product }) {
  function handleAdd() {
    addToCart({
      productId: product.id,
      name: product.name,
      priceCents: product.priceCents,
      image: product.image,
    });
  }

  return (
    <div className="flex flex-col overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-slate-200 transition hover:shadow-md">
      <Link href={`/products/${product.id}`} className="block">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={product.image}
          alt={product.name}
          className="h-48 w-full object-cover"
        />
      </Link>
      <div className="flex flex-1 flex-col p-4">
        <Link href={`/products/${product.id}`} className="font-semibold hover:text-indigo-600">
          {product.name}
        </Link>
        <p className="mt-1 line-clamp-2 text-sm text-slate-500">{product.description}</p>
        <div className="mt-auto flex items-center justify-between pt-3">
          <span className="text-lg font-bold">{formatPrice(product.priceCents)}</span>
          <button
            onClick={handleAdd}
            className="rounded-md bg-indigo-600 px-3 py-1.5 text-sm text-white hover:bg-indigo-500"
          >
            Add to cart
          </button>
        </div>
        <span className="mt-1 text-xs text-slate-400">Stock: {product.stock}</span>
      </div>
    </div>
  );
}