"use client";

import { useEffect, useState, type RefObject } from "react";
import { ArrowUpRight, Search, X } from "lucide-react";

import ProductCard from "./ProductCard";

export type ShopCategory = {
  id: string;
  name: string;
  slug: string;
};

export type ShopProduct = {
  id: string;
  name: string;
  slug: string;
  description: string;
  shortDescription: string | null;
  price: number;
  currency: string;
  overallRating: number | null;
  categories: ShopCategory[];
  image: {
    id: string;
    altText: string | null;
    url: string;
  } | null;
};

type ShopResponse = {
  categories: ShopCategory[];
  totalProducts: number;
  products: ShopProduct[];
};

type ShopSectionProps = {
  onAdd: (product: ShopProduct) => void;
  searchInputRef: RefObject<HTMLInputElement | null>;
};

export default function ShopSection({ onAdd, searchInputRef }: ShopSectionProps) {
  const [categories, setCategories] = useState<ShopCategory[]>([]);
  const [products, setProducts] = useState<ShopProduct[]>([]);
  const [totalProducts, setTotalProducts] = useState(0);

  const [activeFilter, setActiveFilter] = useState("all");
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      setDebouncedQuery(query.trim());
    }, 250);

    return () => window.clearTimeout(timeout);
  }, [query]);

  useEffect(() => {
    const controller = new AbortController();

    async function loadProducts() {
      setLoading(true);
      setError(null);

      try {
        const params = new URLSearchParams();

        if (activeFilter !== "all") params.set("category", activeFilter);
        if (debouncedQuery) params.set("q", debouncedQuery);

        const url = `/api/shop${params.size ? `?${params.toString()}` : ""}`;

        const response = await fetch(url, {
          signal: controller.signal,
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error("Unable to load the collection.");
        }

        const result: ShopResponse = await response.json();

        if (controller.signal.aborted) return;

        setCategories(result.categories);
        setProducts(result.products);
        setTotalProducts(result.totalProducts);
      } catch (error) {
        if (controller.signal.aborted) return;

        setError(
          error instanceof Error ? error.message : "Unable to load the collection.",
        );
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }

    loadProducts();

    return () => controller.abort();
  }, [activeFilter, debouncedQuery]);

  function resetFilters() {
    setActiveFilter("all");
    setQuery("");
    setDebouncedQuery("");
  }

  return (
    <section
      id="shop"
      aria-labelledby="shop-title"
      className="relative isolate w-full scroll-mt-36 overflow-hidden bg-[#080E18] py-20 text-white sm:py-24 lg:py-32"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-0 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-[#7197ff]/[0.035] blur-[120px]"
      />

      <div className="relative z-10 mx-auto w-full max-w-[1440px] px-5 sm:px-8 lg:px-12">
        {/* HEADER */}
        <div className="mb-12 flex flex-col gap-6 md:mb-16 md:flex-row md:items-end md:justify-between">
          <div className="max-w-[650px]">
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

            <p className="mt-6 max-w-[420px] text-[14px] leading-[1.8] tracking-[-0.01em] text-white/45 sm:text-[15px]">
              Thoughtfully selected essentials for modern living. Simple, functional, and
              designed to make every day a little better.
            </p>
          </div>

          <div className="flex items-center gap-3 md:pb-2">
            <span className="h-px w-8 bg-white/20" />
            <span className="text-[11px] font-medium tracking-[0.02em] text-white/40">
              Curated essentials
            </span>
            <ArrowUpRight size={14} strokeWidth={1.5} className="text-white/40" />
          </div>
        </div>

        {/* CATEGORY FILTERS AND SEARCH */}
        <div className="mb-10 flex flex-col gap-5 border-b border-white/[0.10] pb-8 lg:flex-row lg:items-center lg:justify-between">
          <div
            role="group"
            aria-label="Filter products"
            className="flex w-full items-center gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden lg:w-auto"
          >
            {[
              { id: "all", name: "All products", slug: "all" },
              ...categories,
            ].map((category) => {
              const isActive = activeFilter === category.slug;

              return (
                <button
                  key={category.id}
                  type="button"
                  onClick={() => setActiveFilter(category.slug)}
                  aria-pressed={isActive}
                  className={[
                    "inline-flex min-h-10 shrink-0 items-center justify-center rounded-full border px-5 text-[12px] font-medium tracking-[-0.01em] transition-all duration-300 active:scale-[0.97]",
                    isActive
                      ? "border-white bg-white text-[#080E18] shadow-[0_4px_20px_rgba(255,255,255,0.08)]"
                      : "border-white/[0.12] bg-white/[0.05] text-white/55 backdrop-blur-xl hover:border-white/25 hover:bg-white/[0.10] hover:text-white",
                  ].join(" ")}
                >
                  {category.name}
                </button>
              );
            })}
          </div>

          <div className="w-full lg:w-[280px]">
            <label className="group flex h-11 w-full items-center gap-3 rounded-full border border-white/[0.12] bg-white/[0.05] px-4 backdrop-blur-xl transition-all duration-300 hover:border-white/20 focus-within:border-[#A9C5FF]/50 focus-within:bg-white/[0.08]">
              <Search
                size={17}
                strokeWidth={1.7}
                className="shrink-0 text-white/40 transition-colors group-focus-within:text-[#A9C5FF]"
              />

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

        {/* RESULTS */}
        <div className="mb-6 flex items-center justify-between gap-4">
          <span className="text-[11px] font-medium tracking-[0.01em] text-white/40">
            {loading
              ? "Loading collection..."
              : `Showing ${products.length} of ${totalProducts} ${
                  totalProducts === 1 ? "product" : "products"
                }`}
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

        {error && (
          <div
            role="alert"
            className="mb-6 rounded-2xl border border-red-400/20 bg-red-400/[0.06] px-5 py-4 text-[12px] text-red-200"
          >
            {error}
          </div>
        )}

        {/* PRODUCT GRID */}
        {loading ? (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 4 }, (_, index) => (
              <div
                key={index}
                className="h-[440px] animate-pulse rounded-[28px] border border-white/[0.10] bg-white/[0.045]"
              />
            ))}
          </div>
        ) : products.length > 0 ? (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3 xl:grid-cols-4">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} onAdd={onAdd} />
            ))}
          </div>
        ) : (
          <div className="flex min-h-[350px] flex-col items-center justify-center rounded-[28px] border border-white/[0.10] bg-white/[0.035] px-6 py-16 text-center backdrop-blur-xl">
            <div className="mb-6 flex size-16 items-center justify-center rounded-[22px] border border-white/[0.12] bg-white/[0.06]">
              <Search size={24} strokeWidth={1.3} className="text-white/50" />
            </div>

            <h3 className="text-[21px] font-semibold tracking-[-0.04em] text-white">
              Nothing found.
            </h3>

            <p className="mt-3 max-w-[290px] text-[13px] leading-[1.7] text-white/45">
              We couldn&apos;t find anything matching your search. Try another category
              or search term.
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

        {!loading && products.length > 0 && (
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