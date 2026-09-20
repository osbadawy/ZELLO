"use client";

import { useMemo, useState, type RefObject } from "react";
import { Search, X, ArrowUpRight } from "lucide-react";

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
      const searchMatch =
        !normalizedQuery ||
        `${product.name} ${product.series} ${product.category}`.toLowerCase().includes(normalizedQuery);

      return categoryMatch && searchMatch;
    });
  }, [activeFilter, query]);

  function resetFilters() {
    setActiveFilter("all");
    setQuery("");
  }

  return (
    <section
      id="shop"
      aria-labelledby="shop-title"
      className="relative isolate w-full scroll-mt-36 overflow-hidden bg-[#080E18] py-20 text-white sm:py-24 lg:py-32"
    >
      {/* AMBIENT BACKGROUND */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-0 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-[#7197ff]/[0.035] blur-[120px]"
      />

      <div className="relative z-10 mx-auto w-full max-w-[1440px] px-5 sm:px-8 lg:px-12">

        {/* SECTION HEADER */}
        <div className="mb-12 flex flex-col gap-6 md:mb-16 md:flex-row md:items-end md:justify-between">

          <div className="max-w-[650px]">

            {/* HEADING */}
            <h2
              id="shop-title"
              className="text-[clamp(2.75rem,5.5vw,5rem)] font-semibold leading-[1.05] tracking-[-0.065em] text-white"
            >
              Discover what&apos;s
              <br />

              <span className="bg-gradient-to-b from-white/85 to-white/40 bg-clip-text text-transparent">
                worth keeping.
              </span>
            </h2>

            {/* DESCRIPTION */}
            <p className="mt-6 max-w-[420px] text-[14px] leading-[1.8] tracking-[-0.01em] text-white/45 sm:text-[15px]">
              Thoughtfully selected essentials for modern living. Simple, functional, and designed to make every day a little better.
            </p>
          </div>

          {/* COLLECTION COUNT */}
          <div className="flex items-center gap-3 md:pb-2">
            <span className="h-px w-8 bg-white/20" />

            <span className="text-[11px] font-medium tracking-[0.02em] text-white/40">
              {PRODUCTS.length} curated essentials
            </span>

            <ArrowUpRight size={14} strokeWidth={1.5} className="text-white/40" />
          </div>
        </div>

        {/* FILTER AND SEARCH TOOLBAR */}
        <div className="mb-10 flex flex-col gap-5 border-b border-white/[0.10] pb-8 lg:flex-row lg:items-center lg:justify-between">

          {/* CATEGORY FILTERS */}
          <div
            role="group"
            aria-label="Filter products"
            className="flex w-full items-center gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden lg:w-auto"
          >
            {CATEGORY_FILTERS.map((category) => {
              const isActive = activeFilter === category.id;

              return (
                <button
                  key={category.id}
                  type="button"
                  onClick={() => setActiveFilter(category.id)}
                  aria-pressed={isActive}
                  className={[
                    "inline-flex min-h-10 shrink-0 items-center justify-center rounded-full border px-5 text-[12px] font-medium tracking-[-0.01em] transition-all duration-300 active:scale-[0.97]",
                    isActive
                      ? "border-white bg-white text-[#080E18] shadow-[0_4px_20px_rgba(255,255,255,0.08)]"
                      : "border-white/[0.12] bg-white/[0.05] text-white/55 backdrop-blur-xl hover:border-white/25 hover:bg-white/[0.10] hover:text-white",
                  ].join(" ")}
                >
                  {category.label}
                </button>
              );
            })}
          </div>

          {/* SEARCH */}
          <div className="w-full lg:w-[280px]">
            <label className="group flex h-11 w-full items-center gap-3 rounded-full border border-white/[0.12] bg-white/[0.05] px-4 backdrop-blur-xl transition-all duration-300 hover:border-white/20 focus-within:border-[#A9C5FF]/50 focus-within:bg-white/[0.08]">

              <Search size={17} strokeWidth={1.7} className="shrink-0 text-white/40 transition-colors group-focus-within:text-[#A9C5FF]" />

              <span className="sr-only">Search products</span>

              <input
                ref={searchInputRef}
                type="search"
                placeholder="Search the collection"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                className="h-full min-w-0 flex-1 bg-transparent text-[12px] font-medium text-white outline-none placeholder:text-white/35 [&::-webkit-search-cancel-button]:hidden"
              />

              {query && (
                <button
                  type="button"
                  onClick={() => {
                    setQuery("");
                    searchInputRef.current?.focus();
                  }}
                  aria-label="Clear search"
                  className="flex size-6 shrink-0 items-center justify-center rounded-full text-white/40 transition-colors hover:bg-white/10 hover:text-white"
                >
                  <X size={14} strokeWidth={1.7} />
                </button>
              )}
            </label>
          </div>
        </div>

        {/* RESULTS INFORMATION */}
        <div className="mb-6 flex items-center justify-between gap-4">
          <span className="text-[11px] font-medium tracking-[0.01em] text-white/40">
            Showing {filteredProducts.length} {filteredProducts.length === 1 ? "product" : "products"}
          </span>

          {(activeFilter !== "all" || query) && (
            <button
              type="button"
              onClick={resetFilters}
              className="text-[11px] font-medium text-[#A9C5FF] transition-colors hover:text-white"
            >
              Clear filters
            </button>
          )}
        </div>

        {/* PRODUCT GRID */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3 xl:grid-cols-4">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} onAdd={onAdd} />
            ))}
          </div>
        ) : (

          /* EMPTY RESULTS */
          <div className="flex min-h-[350px] flex-col items-center justify-center rounded-[28px] border border-white/[0.10] bg-white/[0.035] px-6 py-16 text-center backdrop-blur-xl">

            <div className="mb-6 flex size-16 items-center justify-center rounded-[22px] border border-white/[0.12] bg-white/[0.06]">
              <Search size={24} strokeWidth={1.3} className="text-white/50" />
            </div>

            <h3 className="text-[21px] font-semibold tracking-[-0.04em] text-white">
              Nothing found.
            </h3>

            <p className="mt-3 max-w-[290px] text-[13px] leading-[1.7] text-white/45">
              We couldn&apos;t find anything matching your search. Try another category or search term.
            </p>

            <button
              type="button"
              onClick={resetFilters}
              className="mt-7 inline-flex min-h-11 items-center justify-center rounded-full bg-white px-6 text-[12px] font-semibold text-[#080E18] transition-all duration-300 hover:bg-[#edf2ff] active:scale-[0.98]"
            >
              View all products
            </button>
          </div>
        )}

        {/* BOTTOM DETAIL */}
        {filteredProducts.length > 0 && (
          <div className="mt-14 flex items-center justify-center gap-3 sm:mt-20">
            <span className="h-px w-6 bg-white/20" />

            <span className="text-center text-[10px] font-medium uppercase tracking-[0.12em] text-white/30">
              Thoughtfully selected. Made for everyday life.
            </span>

            <span className="h-px w-6 bg-white/20" />
          </div>
        )}
      </div>
    </section>
  );
}