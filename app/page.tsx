"use client";

import Hero from "@/components/home/Hero";
import ShopSection from "@/components/home/ShopSection";
import SystemSection from "@/components/home/SystemSection";

import { useStore } from "@/components/home/StoreLayout";

export default function HomePage() {
  const { addToCart, searchInputRef } = useStore();

  return (
    <>
      <Hero />

      <div className="mx-auto w-[calc(100%-20px)] max-w-[1440px] sm:w-[calc(100%-32px)]">
        <ShopSection
          onAdd={addToCart}
          searchInputRef={searchInputRef}
        />

        <SystemSection />
      </div>
    </>
  );
}