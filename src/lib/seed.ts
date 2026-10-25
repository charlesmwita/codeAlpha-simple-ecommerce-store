import { db } from "@/db";
import { products } from "@/db/schema";
import { eq } from "drizzle-orm";

const smartWatchImage = "/images/smart-watch.jpg";

const seedProducts = [
  {
    name: "Wireless Headphones",
    description: "Over-ear wireless headphones with active noise cancellation and 30-hour battery life.",
    priceCents: 12999,
    image: "/images/pexels-praise-panganayi-94536349-33548346.jpg",
    stock: 25,
    category: "electronics",
  },
  {
    name: "Smart Watch",
    description: "Fitness tracking smartwatch with heart rate monitor and GPS.",
    priceCents: 19999,
    image: "/images/pexels-deise-elen-2149983761-31406903.jpg",
    stock: 15,
    category: "electronics",
  },
  {
    name: "Running Shoes",
    description: "Lightweight breathable running shoes for everyday training.",
    priceCents: 8999,
    image: "/images/pexels-jari-lobo-456989711-15659357.jpg",
    stock: 40,
    category: "fashion",
  },
  {
    name: "Leather Backpack",
    description: "Durable leather backpack with laptop compartment.",
    priceCents: 7499,
    image: "/images/pexels-ebuuyildiz-17426948.jpg",
    stock: 20,
    category: "fashion",
  },
  {
    name: "Coffee Maker",
    description: "Programmable drip coffee maker with thermal carafe.",
    priceCents: 5999,
    image: "https://picsum.photos/seed/coffeemaker/600/600",
    stock: 12,
    category: "home",
  },
  {
    name: "Desk Lamp",
    description: "Adjustable LED desk lamp with multiple brightness levels.",
    priceCents: 3499,
    image: "/images/pexels-dziana-hasanbekava-7063741.jpg",
    stock: 30,
    category: "home",
  },
  {
    name: "Yoga Mat",
    description: "Non-slip eco-friendly yoga mat with carrying strap.",
    priceCents: 2999,
    image: "/images/pexels-polina-tankilevitch-8539048.jpg",
    stock: 50,
    category: "sports",
  },
  {
    name: "Water Bottle",
    description: "Insulated stainless steel water bottle, 32oz.",
    priceCents: 2499,
    image: "/images/pexels-cottonbro-3737800.jpg",
    stock: 60,
    category: "sports",
  },
];

export async function ensureSeedProducts() {
  const existing = await db
    .select({ id: products.id, name: products.name, image: products.image })
    .from(products);
  if (existing.length > 0) {
    for (const seedProduct of seedProducts) {
      if (seedProduct.name === "Coffee Maker") continue;
      const currentProduct = existing.find(
        (product) => product.name === seedProduct.name
      );
      if (currentProduct && currentProduct.image !== seedProduct.image) {
        await db
          .update(products)
          .set({ image: seedProduct.image })
          .where(eq(products.id, currentProduct.id));
      }
    }
    return;
  }
  await db.insert(products).values(seedProducts);
}

export async function seedIfEmpty() {
  await ensureSeedProducts();
}