"use client";

import ShopIntro from "./ShopIntro";
import ShopEditorialStrip from "./ShopEditorialStrip";
import BentoCategoryGrid from "./BentoCategoryGrid";

export default function ShopPageClient() {
  return (
    <div id="shop" className="w-full bg-[#f3f5f7] text-[#1c242b]">
      <BentoCategoryGrid/>
    </div>
  );
}
