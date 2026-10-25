import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { products, orders, orderItems } from "@/db/schema";
import { eq, inArray } from "drizzle-orm";
import { getCurrentUserId } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  const userId = await getCurrentUserId();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }
  try {
    const myOrders = await db
      .select()
      .from(orders)
      .where(eq(orders.userId, userId))
      .orderBy(orders.id);
    // fetch items
    const orderIds = myOrders.map((o) => o.id);
    const items =
      orderIds.length > 0
        ? await db.select().from(orderItems).where(inArray(orderItems.orderId, orderIds))
        : [];
    const productsList = await db.select().from(products);
    const productMap = new Map(productsList.map((p) => [p.id, p]));
    const enriched = myOrders.map((o) => ({
      ...o,
      items: items
        .filter((it) => it.orderId === o.id)
        .map((it) => ({
          ...it,
          product: productMap.get(it.productId) ?? null,
        })),
    }));
    return NextResponse.json({ orders: enriched });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to load orders." }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const userId = await getCurrentUserId();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }
  try {
    const body = await req.json();
    const items: { productId: number; quantity: number }[] = Array.isArray(body?.items)
      ? body.items
      : [];
    if (items.length === 0) {
      return NextResponse.json({ error: "Cart is empty." }, { status: 400 });
    }

    // validate
    const productIds = items.map((i) => Number(i.productId));
    const prods = await db.select().from(products).where(inArray(products.id, productIds));
    const prodMap = new Map(prods.map((p) => [p.id, p]));

    let totalCents = 0;
    const validated: { productId: number; quantity: number; priceCents: number }[] = [];
    for (const it of items) {
      const pid = Number(it.productId);
      const qty = Number(it.quantity);
      const p = prodMap.get(pid);
      if (!p) {
        return NextResponse.json({ error: `Product ${pid} not found.` }, { status: 400 });
      }
      if (!Number.isInteger(qty) || qty < 1) {
        return NextResponse.json({ error: "Invalid quantity." }, { status: 400 });
      }
      if (p.stock < qty) {
        return NextResponse.json(
          { error: `Insufficient stock for ${p.name}.` },
          { status: 400 }
        );
      }
      totalCents += p.priceCents * qty;
      validated.push({ productId: pid, quantity: qty, priceCents: p.priceCents });
    }

    // create order
    const [order] = await db
      .insert(orders)
      .values({ userId, totalCents, status: "placed" })
      .returning();

    await db.insert(orderItems).values(
      validated.map((v) => ({
        orderId: order.id,
        productId: v.productId,
        quantity: v.quantity,
        priceCents: v.priceCents,
      }))
    );

    // decrement stock
    for (const v of validated) {
      const p = prodMap.get(v.productId)!;
      await db
        .update(products)
        .set({ stock: p.stock - v.quantity })
        .where(eq(products.id, v.productId));
    }

    return NextResponse.json({ order });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Checkout failed." }, { status: 500 });
  }
}