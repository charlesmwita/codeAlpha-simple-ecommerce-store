import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { products } from "@/db/schema";
import { asc } from "drizzle-orm";
import { ensureSeedProducts } from "@/lib/seed";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    await ensureSeedProducts();
    const { searchParams } = new URL(req.url);
    const q = searchParams.get("q")?.trim().toLowerCase() ?? "";
    const category = searchParams.get("category")?.trim() ?? "";

    const all = await db.select().from(products).orderBy(asc(products.id));
    let filtered = all;
    if (q) {
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q)
      );
    }
    if (category) {
      filtered = filtered.filter((p) => p.category === category);
    }
    return NextResponse.json({ products: filtered });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to load products." }, { status: 500 });
  }
}