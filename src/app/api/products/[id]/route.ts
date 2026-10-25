import { NextResponse } from "next/server";
import { db } from "@/db";
import { products } from "@/db/schema";
import { eq } from "drizzle-orm";

export const dynamic = "force-dynamic";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const pid = Number(id);
    if (!Number.isInteger(pid)) {
      return NextResponse.json({ error: "Invalid id." }, { status: 400 });
    }
    const [product] = await db.select().from(products).where(eq(products.id, pid));
    if (!product) {
      return NextResponse.json({ error: "Product not found." }, { status: 404 });
    }
    return NextResponse.json({ product });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to load product." }, { status: 500 });
  }
}