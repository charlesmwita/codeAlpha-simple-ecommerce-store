"use client";

export type CartItem = {
  productId: number;
  name: string;
  priceCents: number;
  image: string;
  quantity: number;
};

const KEY = "cart";

export function subscribeToCart(callback: () => void) {
  window.addEventListener("cart:updated", callback);
  return () => window.removeEventListener("cart:updated", callback);
}

export function getCartSnapshot() {
  return window.localStorage.getItem(KEY) ?? "[]";
}

export function getCartServerSnapshot() {
  return "[]";
}

export function parseCartSnapshot(snapshot: string): CartItem[] {
  try {
    const parsed: unknown = JSON.parse(snapshot);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function getCart(): CartItem[] {
  if (typeof window === "undefined") return [];
  return parseCartSnapshot(getCartSnapshot());
}

export function saveCart(items: CartItem[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(KEY, JSON.stringify(items));
  window.dispatchEvent(new CustomEvent("cart:updated"));
}

export function addToCart(item: Omit<CartItem, "quantity">, quantity = 1) {
  const cart = getCart();
  const existing = cart.find((c) => c.productId === item.productId);
  if (existing) {
    existing.quantity += quantity;
  } else {
    cart.push({ ...item, quantity });
  }
  saveCart(cart);
}

export function updateQty(productId: number, quantity: number) {
  const cart = getCart();
  const idx = cart.findIndex((c) => c.productId === productId);
  if (idx === -1) return;
  if (quantity <= 0) cart.splice(idx, 1);
  else cart[idx].quantity = quantity;
  saveCart(cart);
}

export function removeFromCart(productId: number) {
  saveCart(getCart().filter((c) => c.productId !== productId));
}

export function clearCart() {
  saveCart([]);
}

export function cartCount() {
  return getCart().reduce((s, c) => s + c.quantity, 0);
}

export function cartTotalCents() {
  return getCart().reduce((s, c) => s + c.priceCents * c.quantity, 0);
}

export function formatPrice(cents: number) {
  return `$${(cents / 100).toFixed(2)}`;
}