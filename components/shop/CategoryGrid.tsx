import { PRODUCTS } from "@/components/home/data";

import CategoryCard from "./CategoryCard";
import { SHOP_CATEGORIES } from "./categories";

export default function CategoryGrid() {
  return (
    <section
      aria-labelledby="categories-title"
      className="mx-auto w-[calc(100%-20px)] max-w-[1440px] sm:w-[calc(100%-32px)]"
    >
      {/* SECTION HEADER */}

      <div className="flex flex-wrap items-center justify-between gap-4 border-x-2 border-b-2 border-[#1c242b] bg-white px-6 py-5">
        <div>
          <span  className="font-mono text-[10px] uppercase tracking-[0.12em] text-[#2f6fed]">
            01 / DIRECTORY
          </span>

          <h2
            id="categories-title"
            className="mt-1 text-[clamp(24px,3vw,38px)] leading-[1.1] font-bold tracking-[-0.07em]"
          >
            SELECT A CATEGORY
          </h2>
        </div>

        <span  className="font-mono text-[10px] uppercase tracking-[0.1em] text-[#2f6fed]">
          {String(
            SHOP_CATEGORIES.length,
          ).padStart(2, "0")}{" "}
          COLLECTIONS
        </span>
      </div>

      {/* BENTO CATEGORY GRID */}

      <div
        className={[
          "grid grid-cols-1 gap-[2px]",
          "border-x-2 border-b-2 border-[#1c242b]",
          "bg-[#1c242b]",
          "sm:grid-cols-2",
          "lg:grid-cols-3",
          "lg:auto-rows-[minmax(420px,auto)]",
        ].join(" ")}
      >
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
    </section>
  );
}
