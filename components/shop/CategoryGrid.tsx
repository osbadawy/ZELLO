import { ArrowUpRight } from "lucide-react";

import { PRODUCTS } from "@/components/home/data";

import CategoryCard from "./CategoryCard";
import { SHOP_CATEGORIES } from "./categories";

export default function CategoryGrid() {
  return (
    <section
      aria-labelledby="categories-title"
      className="relative isolate w-full overflow-hidden bg-[#080E18] py-20 text-white sm:py-24 lg:py-28"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-0 h-[520px] w-[920px] -translate-x-1/2 rounded-full bg-[#6f8dff]/[0.07] blur-[130px]"
      />

      <div className="relative z-10 mx-auto w-full max-w-[1440px] px-5 sm:px-8 lg:px-12">
        <div className="mb-12 flex flex-col gap-6 lg:mb-14 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-[760px]">
            <div className="mb-5 inline-flex items-center gap-2.5 rounded-full border border-white/[0.12] bg-white/[0.05] px-4 py-2 backdrop-blur-xl">
              <span className="size-1.5 rounded-full bg-[#A9C5FF]" />
              <span className="text-[11px] font-medium tracking-[0.03em] text-white/65">
                Browse by category
              </span>
            </div>

            <h2
              id="categories-title"
              className="text-[clamp(2.75rem,5.5vw,5rem)] font-semibold leading-[1.04] tracking-[-0.065em] text-white"
            >
              A cleaner way
              <br />
              <span className="bg-gradient-to-b from-white/88 to-white/42 bg-clip-text text-transparent">
                to explore.
              </span>
            </h2>

            <p className="mt-5 max-w-[480px] text-[14px] leading-[1.8] tracking-[-0.01em] text-white/45 sm:text-[15px]">
              Discover ZELLO through thoughtfully curated collections. Clean,
              simple, and easy to navigate.
            </p>
          </div>

          <div className="flex items-center gap-3 lg:pb-2">
            <span className="h-px w-8 bg-white/20" />
            <span className="text-[11px] font-medium tracking-[0.02em] text-white/40">
              {String(SHOP_CATEGORIES.length).padStart(2, "0")} collections
            </span>
            <ArrowUpRight size={14} strokeWidth={1.5} className="text-white/40" />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-12 lg:auto-rows-[220px] lg:gap-5">
          {SHOP_CATEGORIES.map((category) => {
            const productCount =
              category.productIds === null
                ? PRODUCTS.length
                : category.productIds.length;

            return (
              <CategoryCard
                key={category.id}
                category={category}
                productCount={productCount}
              />
            );
          })}
        </div>

        <div className="mt-14 flex items-center justify-center gap-3 sm:mt-18">
          <span className="h-px w-6 bg-white/20" />
          <span className="text-center text-[10px] font-medium uppercase tracking-[0.12em] text-white/30">
            Curated by ZELLO
          </span>
          <span className="h-px w-6 bg-white/20" />
        </div>
      </div>
    </section>
  );
}