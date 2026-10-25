import { db } from "@/db";
import { products } from "@/db/schema";
import { eq } from "drizzle-orm";
import { ensureSeedProducts } from "@/lib/seed";
import Link from "next/link";
import { formatPrice } from "@/lib/cart";
import AddToCartButton from "@/components/AddToCartButton";

export const dynamic = "force-dynamic";

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await ensureSeedProducts();
  const { id } = await params;
  const pid = Number(id);
  const [product] = await db.select().from(products).where(eq(products.id, pid));

  if (!product) {
    return (
      <div>
        <p>Product not found.</p>
        <Link href="/" className="text-indigo-600">
          Back to products
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-8 md:grid-cols-2">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={product.image} alt={product.name} className="w-full rounded-xl object-cover" />
      <div>
        <h1 className="text-3xl font-bold">{product.name}</h1>
        <p className="mt-2 text-sm uppercase text-slate-500">{product.category}</p>
        <p className="mt-4 text-slate-700">{product.description}</p>
        <div className="mt-6 text-2xl font-bold">{formatPrice(product.priceCents)}</div>
        <p className="mt-2 text-sm text-slate-500">Stock: {product.stock}</p>
        <div className="mt-6">
          <AddToCartButton product={product} />
        </div>
        <Link href="/" className="mt-6 inline-block text-indigo-600 hover:underline">
          ← Back to products
        </Link>
      </div>
    </div>
  );
}