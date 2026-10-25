import { db } from "@/db";
import { products } from "@/db/schema";
import { asc } from "drizzle-orm";
import { ensureSeedProducts } from "@/lib/seed";
import ProductCard from "@/components/ProductCard";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; category?: string }>;
}) {
  await ensureSeedProducts();
  const sp = await searchParams;
  const q = (sp.q ?? "").trim().toLowerCase();
  const category = (sp.category ?? "").trim();

  const all = await db.select().from(products).orderBy(asc(products.id));
  let filtered = all;
  if (q) filtered = filtered.filter((p) => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q));
  if (category) filtered = filtered.filter((p) => p.category === category);

  const categories = Array.from(new Set(all.map((p) => p.category)));

  return (
    <div>
      <section className="mb-6 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 p-8 text-white">
        <h1 className="text-3xl font-bold">Welcome to ShopEase</h1>
        <p className="mt-2 text-indigo-100">Discover great products at great prices.</p>
      </section>

      <form method="get" className="mb-6 flex flex-wrap gap-2">
        <input
          name="q"
          defaultValue={sp.q ?? ""}
          placeholder="Search products..."
          className="flex-1 rounded-md border border-slate-300 px-3 py-2"
        />
        {category && <input type="hidden" name="category" value={category} />}
        <button className="rounded-md bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-500">
          Search
        </button>
      </form>

      <div className="mb-6 flex flex-wrap gap-2">
        <Link
          href="/"
          className={`rounded-full px-3 py-1 text-sm ${!category ? "bg-indigo-600 text-white" : "bg-white text-slate-700 ring-1 ring-slate-200"}`}
        >
          All
        </Link>
        {categories.map((c) => (
          <Link
            key={c}
            href={`/?category=${encodeURIComponent(c)}${q ? `&q=${encodeURIComponent(q)}` : ""}`}
            className={`rounded-full px-3 py-1 text-sm capitalize ${category === c ? "bg-indigo-600 text-white" : "bg-white text-slate-700 ring-1 ring-slate-200"}`}
          >
            {c}
          </Link>
        ))}
      </div>

      {filtered.length === 0 ? (
        <p className="text-slate-500">No products found.</p>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {filtered.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}