import type { Metadata } from "next";

import ShopPageClient from "@/components/shop/ShopPageClient";

export const metadata: Metadata = {
  title: "Shop | Penta Labs",
  description:
    "Explore the Penta Labs collection. Curated objects for modern living, including technology, carry essentials, and home accessories.",
};

export default function ShopPage() {
  return <ShopPageClient />;
}