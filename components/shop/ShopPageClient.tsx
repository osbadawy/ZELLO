"use client";

import ShopIntro from "./ShopIntro";
import ShopEditorialStrip from "./ShopEditorialStrip";
import CategoryGrid from "./CategoryGrid";

export default function ShopPageClient() {
  return (
    <div id="shop" className="w-full bg-[#f3f5f7] text-[#1c242b]">
      <ShopIntro />
      <CategoryGrid/>
      <ShopEditorialStrip />
    </div>
  );
}
