"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Check,
  ChevronDown,
  ChevronRight,
  LayoutGrid,
  LoaderCircle,
  Package,
  RefreshCw,
  Search,
  SlidersHorizontal,
  Sparkles,
  X,
} from "lucide-react";

import ProductCard from "@/components/home/ProductCard";
import { useStore } from "@/components/home/StoreLayout";

import type { ShopCategory, ShopProduct } from "@/components/home/ShopSection";

/* ============================================================
   TYPES
============================================================ */

type SortOption =
  | "newest"
  | "price-asc"
  | "price-desc"
  | "rating"
  | "name";

type RatingFilter = "all" | "8" | "9";

type CategoryDetails = ShopCategory & {
  description: string | null;
};

type Pagination = {
  page: number;
  pageSize: number;
  totalProducts: number;
  totalPages: number;
  hasMore: boolean;
};

type CategoryProductsResponse = {
  category: CategoryDetails;
  categories: ShopCategory[];
  products: ShopProduct[];
  pagination: Pagination;
};

type Props = {
  categoryName: string;
};

const SORT_OPTIONS: {
  value: SortOption;
  label: string;
}[] = [
  { value: "newest", label: "Newest arrivals" },
  { value: "rating", label: "Highest rated" },
  { value: "price-asc", label: "Price: low to high" },
  { value: "price-desc", label: "Price: high to low" },
  { value: "name", label: "Name: A to Z" },
];

const RATING_FILTERS: {
  value: RatingFilter;
  label: string;
}[] = [
  { value: "all", label: "All products" },
  { value: "8", label: "Rated 8+" },
  { value: "9", label: "Rated 9+" },
];

/* ============================================================
   COMPONENT
============================================================ */

export default function CategoryProductsClient({ categoryName }: Props) {
  const { addToCart } = useStore();

  const [category, setCategory] = useState<CategoryDetails | null>(null);
  const [categories, setCategories] = useState<ShopCategory[]>([]);
  const [products, setProducts] = useState<ShopProduct[]>([]);

  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");

  const [sort, setSort] = useState<SortOption>("newest");
  const [ratingFilter, setRatingFilter] = useState<RatingFilter>("all");

  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState<Pagination | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notFound, setNotFound] = useState(false);

  const [refreshKey, setRefreshKey] = useState(0);

  const searchInputRef = useRef<HTMLInputElement>(null);

  /* ============================================================
     DEBOUNCE SEARCH
  ============================================================ */

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      setDebouncedQuery(query.trim());
    }, 300);

    return () => window.clearTimeout(timeout);
  }, [query]);

  /* ============================================================
     FETCH PRODUCTS
  ============================================================ */

  useEffect(() => {
    const controller = new AbortController();

    async function loadProducts() {
      setLoading(true);
      setError(null);
      setNotFound(false);

      try {
        const params = new URLSearchParams({
          page: String(page),
          sort,
        });

        if (debouncedQuery) {
          params.set("q", debouncedQuery);
        }

        if (ratingFilter !== "all") {
          params.set("minRating", ratingFilter);
        }

        const response = await fetch(
          `/api/shop/categories/${encodeURIComponent(categoryName)}?${params.toString()}`,
          {
            signal: controller.signal,
            cache: "no-store",
          },
        );

        if (response.status === 404) {
          if (!controller.signal.aborted) {
            setNotFound(true);
          }

          return;
        }

        if (!response.ok) {
          throw new Error("Unable to load products. Please try again.");
        }

        const result: CategoryProductsResponse = await response.json();

        if (controller.signal.aborted) return;

        setCategory(result.category);
        setCategories(result.categories);
        setPagination(result.pagination);

        setProducts((current) => {
          if (page === 1) {
            return result.products;
          }

          const existingIds = new Set(current.map((product) => product.id));

          return [
            ...current,
            ...result.products.filter(
              (product) => !existingIds.has(product.id),
            ),
          ];
        });
      } catch (error) {
        if (controller.signal.aborted) return;

        setError(
          error instanceof Error
            ? error.message
            : "Unable to load category products.",
        );
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    loadProducts();

    return () => controller.abort();
  }, [
    categoryName,
    page,
    sort,
    ratingFilter,
    debouncedQuery,
    refreshKey,
  ]);

  /* ============================================================
     FILTER HANDLERS
  ============================================================ */

  function resetProductResults() {
    setPage(1);
    setProducts([]);
    setPagination(null);
  }

  function handleSearch(value: string) {
    setQuery(value);
    resetProductResults();
  }

  function handleSort(value: SortOption) {
    if (value === sort) return;

    setSort(value);
    resetProductResults();
  }

  function handleRatingFilter(value: RatingFilter) {
    if (value === ratingFilter) return;

    setRatingFilter(value);
    resetProductResults();
  }

  function clearFilters() {
    setQuery("");
    setDebouncedQuery("");
    setSort("newest");
    setRatingFilter("all");

    resetProductResults();
  }

  function loadMore() {
    if (loading || !pagination?.hasMore) return;

    setPage((current) => current + 1);
  }

  function refreshProducts() {
    resetProductResults();
    setRefreshKey((current) => current + 1);
  }

  /* ============================================================
     DERIVED VALUES
  ============================================================ */

  const hasActiveFilters =
    query.trim().length > 0 ||
    sort !== "newest" ||
    ratingFilter !== "all";

  const totalProducts = pagination?.totalProducts ?? 0;
  const hasMore = pagination?.hasMore ?? false;

  const isInitialLoading =
    loading && products.length === 0;

  const isLoadingMore =
    loading && products.length > 0 && page > 1;

  /* ============================================================
     CATEGORY NOT FOUND
  ============================================================ */

  if (notFound) {
    return (
      <main className="flex min-h-[75svh] flex-col items-center justify-center bg-[#080E18] px-5 py-20 text-center text-white">

        <div className="mb-6 flex size-16 items-center justify-center rounded-[22px] border border-white/10 bg-white/[0.05]">
          <Package
            size={27}
            strokeWidth={1.4}
            className="text-[#A9C5FF]"
          />
        </div>

        <h1 className="text-[32px] font-semibold tracking-[-0.055em]">
          Collection not found.
        </h1>

        <p className="mt-3 max-w-sm text-[13px] leading-relaxed text-white/45">
          This collection is currently unavailable.
        </p>

        <Link
          href="/#shop"
          className="mt-8 inline-flex min-h-11 items-center gap-2 rounded-full bg-white px-6 text-[12px] font-semibold text-[#080E18] transition-colors hover:bg-[#dce8ff]"
        >
          Explore the shop
          <ArrowRight size={15} />
        </Link>
      </main>
    );
  }

  /* ============================================================
     RENDER
  ============================================================ */

  return (
    <main className="relative isolate min-h-screen w-full overflow-hidden bg-[#080E18] text-white">

      {/* BACKGROUND */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
      >
        <div className="absolute -left-72 -top-72 size-[700px] rounded-full bg-[#5277ca]/[0.07] blur-[140px]" />
        <div className="absolute -right-72 top-[450px] size-[650px] rounded-full bg-[#7197ff]/[0.045] blur-[140px]" />
      </div>

      <div className="mx-auto w-full max-w-[1440px] px-5 pb-24 pt-10 sm:px-8 lg:px-12 lg:pt-14">

        {/* =====================================================
            BREADCRUMBS
        ===================================================== */}

        <nav
          aria-label="Breadcrumb"
          className="mb-9 flex items-center gap-2 text-[11px]"
        >
          <Link
            href="/"
            className="text-white/40 transition-colors hover:text-white"
          >
            Home
          </Link>

          <ChevronRight size={12} className="text-white/20" />

          <Link
            href="/#shop"
            className="text-white/40 transition-colors hover:text-white"
          >
            Shop
          </Link>

          <ChevronRight size={12} className="text-white/20" />

          <span className="max-w-[180px] truncate font-medium text-[#A9C5FF]">
            {category?.name ?? "Collection"}
          </span>
        </nav>

        {/* =====================================================
            CATEGORY HERO
        ===================================================== */}

        <header className="relative mb-12 overflow-hidden rounded-[30px] border border-white/[0.09] bg-white/[0.035] px-6 py-10 backdrop-blur-xl sm:px-10 sm:py-12 lg:px-14 lg:py-16">

          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-24 -top-52 size-[500px] rounded-full bg-[#A9C5FF]/[0.07] blur-[90px]"
          />

          <div className="relative flex flex-col justify-between gap-7 lg:flex-row lg:items-end">

            <div className="max-w-[700px]">

              <div className="mb-5 flex items-center gap-2">

                <span className="flex size-7 items-center justify-center rounded-lg border border-[#A9C5FF]/15 bg-[#A9C5FF]/10">
                  <LayoutGrid
                    size={14}
                    className="text-[#A9C5FF]"
                  />
                </span>

                <span className="text-[10px] font-medium uppercase tracking-[0.15em] text-[#A9C5FF]/75">
                  Quickshipgo / Collection
                </span>
              </div>

              {isInitialLoading && !category ? (
                <div className="h-14 w-64 animate-pulse rounded-xl bg-white/[0.08]" />
              ) : (
                <h1 className="text-[clamp(2.7rem,6vw,5.2rem)] font-semibold leading-[1.05] tracking-[-0.065em]">
                  {category?.name ?? "Collection"}
                  <span className="text-[#A9C5FF]">.</span>
                </h1>
              )}

              {category?.description && (
                <p className="mt-5 max-w-[580px] text-[13px] leading-[1.8] text-white/45 sm:text-[14px]">
                  {category.description}
                </p>
              )}
            </div>

            <div className="flex items-center gap-3 text-[11px] text-white/40">
              <span className="h-px w-8 bg-white/20" />

              <span>
                {pagination
                  ? `${totalProducts} ${
                      totalProducts === 1 ? "product" : "products"
                    }`
                  : "Curated products"}
              </span>

              <ArrowUpRight size={14} strokeWidth={1.5} />
            </div>
          </div>
        </header>

        {/* =====================================================
            CATEGORY SELECTOR
        ===================================================== */}

        <section
          aria-label="Browse categories"
          className="mb-12"
        >
          <div className="mb-4 flex items-center justify-between gap-4">

            <h2 className="text-[12px] font-medium text-white/50">
              Explore categories
            </h2>

            <Link
              href="/#shop"
              className="inline-flex items-center gap-1.5 text-[11px] text-white/40 transition-colors hover:text-white"
            >
              All products
              <ArrowUpRight size={13} />
            </Link>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">

            {categories.map((item) => {
              const active = item.slug === categoryName;

              return (
                <Link
                  key={item.id}
                  href={`/shop/${encodeURIComponent(item.slug)}`}
                  aria-current={active ? "page" : undefined}
                  className={`inline-flex min-h-10 shrink-0 items-center justify-center rounded-full border px-5 text-[12px] font-medium transition-all duration-300 ${
                    active
                      ? "border-white bg-white text-[#080E18]"
                      : "border-white/[0.12] bg-white/[0.045] text-white/55 hover:border-white/25 hover:bg-white/[0.09] hover:text-white"
                  }`}
                >
                  {item.name}
                </Link>
              );
            })}
          </div>
        </section>

        {/* =====================================================
            PRODUCTS
        ===================================================== */}

        <section aria-labelledby="category-products-title">

          {/* HEADER */}
          <div className="mb-7 flex flex-col justify-between gap-5 lg:flex-row lg:items-end">

            <div>
              <div className="mb-2 flex items-center gap-2">
                <Sparkles size={13} className="text-[#A9C5FF]" />

                <span className="text-[10px] font-medium uppercase tracking-[0.12em] text-[#A9C5FF]/75">
                  The collection
                </span>
              </div>

              <h2
                id="category-products-title"
                className="text-[26px] font-semibold tracking-[-0.05em] sm:text-[30px]"
              >
                Explore products
              </h2>

              <p
                aria-live="polite"
                className="mt-2 text-[11px] text-white/40"
              >
                {isInitialLoading
                  ? "Loading products..."
                  : pagination
                    ? `Showing ${products.length} of ${totalProducts} products`
                    : "Browse the collection"}
              </p>
            </div>

            {/* REFRESH */}
            <button
              type="button"
              onClick={refreshProducts}
              disabled={loading}
              aria-label="Refresh products"
              className="flex size-11 items-center justify-center self-start rounded-full border border-white/[0.12] bg-white/[0.045] text-white/55 transition-colors hover:bg-white/[0.09] hover:text-white disabled:opacity-30"
            >
              <RefreshCw
                size={16}
                className={loading ? "animate-spin" : ""}
              />
            </button>
          </div>

          {/* =====================================================
              SEARCH AND SORT
          ===================================================== */}

          <div className="mb-5 flex flex-col gap-3 sm:flex-row">

            {/* SEARCH */}
            <label className="group flex h-12 min-w-0 flex-1 items-center gap-3 rounded-full border border-white/[0.12] bg-white/[0.045] px-5 transition-colors hover:border-white/20 focus-within:border-[#A9C5FF]/50 focus-within:bg-white/[0.065]">

              <Search
                size={17}
                strokeWidth={1.7}
                className="shrink-0 text-white/40 group-focus-within:text-[#A9C5FF]"
              />

              <span className="sr-only">
                Search products in this category
              </span>

              <input
                ref={searchInputRef}
                type="search"
                value={query}
                onChange={(event) => handleSearch(event.target.value)}
                placeholder={`Search ${category?.name ?? "products"}...`}
                className="h-full min-w-0 flex-1 bg-transparent text-[12px] text-white outline-none placeholder:text-white/30 [&::-webkit-search-cancel-button]:hidden"
              />

              {query && (
                <button
                  type="button"
                  onClick={() => {
                    handleSearch("");
                    searchInputRef.current?.focus();
                  }}
                  aria-label="Clear search"
                  className="flex size-7 shrink-0 items-center justify-center rounded-full text-white/40 transition-colors hover:bg-white/10 hover:text-white"
                >
                  <X size={15} />
                </button>
              )}
            </label>

            {/* SORT */}
            <label className="relative flex h-12 w-full items-center gap-3 rounded-full border border-white/[0.12] bg-white/[0.045] px-5 transition-colors hover:border-white/20 focus-within:border-[#A9C5FF]/50 sm:w-[235px]">

              <SlidersHorizontal
                size={16}
                className="shrink-0 text-[#A9C5FF]/70"
              />

              <span className="sr-only">
                Sort products
              </span>

              <select
                value={sort}
                onChange={(event) =>
                  handleSort(event.target.value as SortOption)
                }
                className="h-full min-w-0 flex-1 cursor-pointer appearance-none bg-transparent pr-5 text-[12px] font-medium text-white outline-none"
              >
                {SORT_OPTIONS.map((option) => (
                  <option
                    key={option.value}
                    value={option.value}
                    className="bg-[#101827] text-white"
                  >
                    {option.label}
                  </option>
                ))}
              </select>

              <ChevronDown
                size={14}
                className="pointer-events-none absolute right-5 text-white/40"
              />
            </label>
          </div>

          {/* =====================================================
              RATING FILTERS
          ===================================================== */}

          <div className="mb-8 flex flex-wrap items-center justify-between gap-4 border-b border-white/[0.09] pb-7">

            <div
              role="group"
              aria-label="Filter by product rating"
              className="flex flex-wrap items-center gap-2"
            >
              <span className="mr-1 text-[11px] font-medium text-white/40">
                Filter
              </span>

              {RATING_FILTERS.map((filter) => {
                const active = ratingFilter === filter.value;

                return (
                  <button
                    key={filter.value}
                    type="button"
                    onClick={() => handleRatingFilter(filter.value)}
                    aria-pressed={active}
                    className={`inline-flex min-h-9 items-center gap-2 rounded-full border px-4 text-[11px] font-medium transition-all duration-300 ${
                      active
                        ? "border-[#A9C5FF]/30 bg-[#A9C5FF]/[0.13] text-[#A9C5FF]"
                        : "border-white/[0.12] bg-white/[0.045] text-white/50 hover:border-white/20 hover:bg-white/[0.08] hover:text-white"
                    }`}
                  >
                    {active && <Check size={12} />}
                    {filter.label}
                  </button>
                );
              })}
            </div>

            {hasActiveFilters && (
              <button
                type="button"
                onClick={clearFilters}
                className="inline-flex items-center gap-1.5 text-[11px] font-medium text-[#A9C5FF] transition-colors hover:text-white"
              >
                <X size={13} />
                Clear filters
              </button>
            )}
          </div>

          {/* =====================================================
              ERROR
          ===================================================== */}

          {error && (
            <div
              role="alert"
              className="mb-7 rounded-2xl border border-red-400/20 bg-red-400/[0.06] px-5 py-4 text-[12px] text-red-200"
            >
              <p>{error}</p>

              <button
                type="button"
                onClick={refreshProducts}
                className="mt-3 text-[11px] font-semibold text-white underline underline-offset-4"
              >
                Try again
              </button>
            </div>
          )}

          {/* =====================================================
              LOADING SKELETON
          ===================================================== */}

          {isInitialLoading && (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {Array.from({ length: 8 }, (_, index) => (
                <div
                  key={index}
                  className="h-[440px] animate-pulse rounded-[28px] border border-white/[0.09] bg-white/[0.045]"
                />
              ))}
            </div>
          )}

          {/* =====================================================
              PRODUCT GRID
          ===================================================== */}

          {!isInitialLoading && products.length > 0 && (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onAdd={addToCart}
                />
              ))}
            </div>
          )}

          {/* =====================================================
              EMPTY STATE
          ===================================================== */}

          {!loading && !error && products.length === 0 && (
            <div className="flex min-h-[340px] flex-col items-center justify-center rounded-[28px] border border-white/[0.10] bg-white/[0.035] px-6 py-14 text-center">

              <div className="mb-5 flex size-16 items-center justify-center rounded-[22px] border border-white/[0.10] bg-white/[0.055]">
                <Search
                  size={25}
                  strokeWidth={1.4}
                  className="text-white/50"
                />
              </div>

              <h3 className="text-[21px] font-semibold tracking-[-0.045em]">
                No products found.
              </h3>

              <p className="mt-3 max-w-[320px] text-[12px] leading-relaxed text-white/45">
                {hasActiveFilters
                  ? "No products match your current search or filters."
                  : "There are no products available in this category yet."}
              </p>

              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={clearFilters}
                  className="mt-7 inline-flex min-h-11 items-center gap-2 rounded-full bg-white px-6 text-[12px] font-semibold text-[#080E18] transition-colors hover:bg-[#dce8ff]"
                >
                  <X size={14} />
                  Clear filters
                </button>
              )}
            </div>
          )}

          {/* =====================================================
              LOAD MORE
          ===================================================== */}

          {products.length > 0 && !isInitialLoading && (
            <div className="mt-14 flex flex-col items-center border-t border-white/[0.09] pt-9">

              {/* COUNT */}
              <p
                aria-live="polite"
                className="mb-5 text-[11px] font-medium text-white/40"
              >
                Showing {products.length} of {totalProducts} products
              </p>

              {/* PROGRESS INDICATOR */}
              <div
                role="progressbar"
                aria-label="Products loaded"
                aria-valuemin={0}
                aria-valuemax={Math.max(totalProducts, 1)}
                aria-valuenow={products.length}
                className="mb-7 h-1 w-full max-w-[220px] overflow-hidden rounded-full bg-white/[0.10]"
              >
                <div
                  className="h-full rounded-full bg-[#A9C5FF] transition-[width] duration-500"
                  style={{
                    width: `${
                      totalProducts > 0
                        ? Math.min(100, (products.length / totalProducts) * 100)
                        : 0
                    }%`,
                  }}
                />
              </div>

              {hasMore ? (

                /* LOAD NEXT 20 */
                <button
                  type="button"
                  onClick={loadMore}
                  disabled={loading}
                  className="group inline-flex min-h-12 items-center justify-center gap-3 rounded-full border border-white/[0.15] bg-white px-7 text-[12px] font-semibold text-[#080E18] shadow-[0_8px_30px_rgba(255,255,255,0.05)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#dce8ff] hover:shadow-[0_12px_35px_rgba(255,255,255,0.10)] active:scale-[0.98] disabled:cursor-wait disabled:opacity-50"
                >
                  {isLoadingMore ? (
                    <>
                      <LoaderCircle size={16} className="animate-spin" />
                      Loading products...
                    </>
                  ) : (
                    <>
                      Load next {Math.min(20, totalProducts - products.length)}

                      <ArrowRight
                        size={16}
                        className="transition-transform group-hover:translate-x-1"
                      />
                    </>
                  )}
                </button>

              ) : (

                /* END OF COLLECTION */
                <div className="flex items-center gap-2 text-[11px] text-white/35">
                  <Check size={14} className="text-[#A9C5FF]" />
                  You&apos;ve explored the entire collection
                </div>
              )}
            </div>
          )}
        </section>

        {/* =====================================================
            BACK TO SHOP
        ===================================================== */}

        <div className="mt-16 flex items-center justify-center">
          <Link
            href="/#shop"
            className="group inline-flex items-center gap-2 text-[12px] font-medium text-white/45 transition-colors hover:text-white"
          >
            <ArrowLeft
              size={15}
              className="transition-transform group-hover:-translate-x-1"
            />

            Back to the shop
          </Link>
        </div>
      </div>
    </main>
  );
}