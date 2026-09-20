"use client";

import { useMemo, useState, type RefObject } from "react";
import { CATEGORY_FILTERS, PRODUCTS } from "./data";
import ProductCard from "./ProductCard";
import type { CategoryFilter, Product } from "./types";

type ShopSectionProps = {
  onAdd: (product: Product) => void;
  searchInputRef: RefObject<HTMLInputElement | null>;
};

export default function ShopSection({ onAdd, searchInputRef }: ShopSectionProps) {
  const [activeFilter, setActiveFilter] = useState<CategoryFilter["id"]>("all");
  const [query, setQuery] = useState("");

  const filteredProducts = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return PRODUCTS.filter((product) => {
      const categoryMatch = activeFilter === "all" || product.category === activeFilter;
      const searchMatch = !normalizedQuery ||
        `${product.name} ${product.series} ${product.category}`.toLowerCase().includes(normalizedQuery);
      return categoryMatch && searchMatch;
    });
  }, [activeFilter, query]);

  return (
    <section id="shop" aria-labelledby="shop-title" className="scroll-mt-36 border-x-2 border-b-2 border-[#1c242b]">
      <div className="border-b-2 border-[#1c242b] bg-white p-5 sm:flex sm:items-end sm:justify-between sm:gap-5 sm:p-6">
        <div>
          <div className="font-mono text-[11px] font-medium uppercase tracking-[0.06em]">01 / Current inventory</div>
          <h2 id="shop-title" className="mt-1 text-[clamp(27px,4vw,46px)] leading-[0.95] font-bold tracking-[-0.07em]">THE DROP</h2>
        </div>
        <p className="mt-3 max-w-[290px] text-xs leading-[1.45] text-[#66727d] sm:mt-0 sm:text-right">Small-batch essentials, shipped from Penta Labs to your door.</p>
      </div>
      <div className="flex flex-wrap justify-between gap-3 border-b-2 border-[#1c242b] bg-[#e5e9ed] px-3.5 py-3.5 sm:px-6">
        <div role="group" aria-label="Filter products" className="flex flex-wrap gap-[7px]">
          {CATEGORY_FILTERS.map((category) => (
            <button key={category.id} type="button" onClick={() => setActiveFilter(category.id)} aria-pressed={activeFilter === category.id} className={`border border-[#1c242b] px-[11px] py-2 text-[10px] font-semibold uppercase transition-colors hover:bg-[#1c242b] hover:text-white ${activeFilter === category.id ? "bg-[#1c242b] text-white" : "bg-transparent text-[#1c242b]"}`}>
              {category.label}
            </button>
          ))}
        </div>
        <label className="flex min-w-full items-center gap-2 border-b-2 border-[#1c242b] sm:min-w-[200px]">
          <span aria-hidden="true" className="font-mono text-xs">⌕</span>
          <span className="sr-only">Search products</span>
          <input ref={searchInputRef} type="search" placeholder="Search inventory..." value={query} onChange={(event) => setQuery(event.target.value)} className="w-full border-0 bg-transparent py-2 text-[11px] outline-none placeholder:text-[#66727d]" />
        </label>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4">
        {filteredProducts.map((product) => <ProductCard key={product.id} product={product} onAdd={onAdd} />)}
        {filteredProducts.length === 0 && (
          <div className="col-span-full bg-white px-6 py-16 text-center text-[#66727d]">
            NO MATCHES IN CURRENT INVENTORY.<br />
            <span className="font-mono text-xs">Try another signal.</span>
          </div>
        )}
      </div>
    </section>
  );
}
