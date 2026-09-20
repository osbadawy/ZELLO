"use client";

import ShopIntro from "./ShopIntro";
import CategoryGrid from "./CategoryGrid";
import ShopEditorialStrip from "./ShopEditorialStrip";

export default function ShopPageClient() {
  return (
    <div id="shop" className="w-full bg-[#f3f5f7] text-[#1c242b]">
      <ShopIntro />
      <CategoryGrid />
      <ShopEditorialStrip />
    </div>
  );
}
