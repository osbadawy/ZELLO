"use client";

import Hero from "@/components/home/Hero";
import ShopSection from "@/components/home/ShopSection";

import { useStore } from "@/components/home/StoreLayout";

export default function HomePage() {
  const { addToCart, searchInputRef } = useStore();

  return (
    <>
      <Hero />
      <ShopSection
        onAdd={addToCart}
        searchInputRef={searchInputRef}
      />
    </>
  );
}