"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import AddProductModal from "./AddProductModal";

import {
  Activity,
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Boxes,
  CalendarDays,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  CircleCheck,
  ExternalLink,
  ImageIcon,
  Layers3,
  LoaderCircle,
  Package,
  Plus,
  RefreshCw,
  Search,
  SlidersHorizontal,
  Sparkles,
  Star,
  Tag,
  X,
} from "lucide-react";

/* ============================================================
   TYPES
============================================================ */

type ProductRating = {
  dailyUse: number | null;
  reliability: number | null;
  quality: number | null;
  recommend: number | null;
  overall: number | null;
};

type ProductCategory = {
  id: string;
  name: string;
  slug: string;
};

type ProductImage = {
  id: string;
  fileName: string;
  altText: string | null;
  isPrimary: boolean;
  sortOrder: number;
};

type ProductSupplier = {
  id: string;
  name: string;
  stockQuantity: number;
  isAvailable: boolean;
};

type ProductVariant = {
  id: string;
  sku: string;
  name: string | null;
  size: string | null;
  color: string | null;
  price: number | null;
  isActive: boolean;
  availableStock: number;
  suppliers: ProductSupplier[];
};

type Product = {
  id: string;
  name: string;
  slug: string;

  description: string;
  shortDescription: string | null;

  price: number;
  currency: string;

  instagramVideoUrl: string | null;
  isActive: boolean;

  ratings: ProductRating;

  categories: ProductCategory[];
  images: ProductImage[];

  imageCount: number;
  variantCount: number;
  activeVariantCount: number;
  availableVariantCount: number;

  variants: ProductVariant[];

  createdAt: string;
  updatedAt: string;
};

type ProductsResponse = {
  products: Product[];

  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };

  summary: {
    totalProducts: number;
    activeProducts: number;
    inactiveProducts: number;
  };
};

type StatusFilter = "all" | "active" | "inactive";

type SortOption =
  | "newest"
  | "oldest"
  | "name"
  | "price-low"
  | "price-high"
  | "rating";

/* ============================================================
   HELPERS
============================================================ */

const formatNumber = (value: number) => {
  return new Intl.NumberFormat("en-US").format(value);
};

const formatPrice = (value: number, currency: string) => {
  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
      maximumFractionDigits: 2,
    }).format(value);
  } catch {
    return `${value.toFixed(2)} ${currency}`;
  }
};

const formatDate = (date: string) => {
  return new Intl.DateTimeFormat("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(date));
};

const ratingCategories = [
  { key: "dailyUse", label: "Daily use", color: "#A9C5FF" },
  { key: "reliability", label: "Reliability", color: "#86E0C1" },
  { key: "quality", label: "Quality", color: "#C3ADFF" },
  { key: "recommend", label: "Recommendation", color: "#E8C59B" },
  { key: "overall", label: "Overall", color: "#FFFFFF" },
] as const;

/* ============================================================
   SMALL COMPONENTS
============================================================ */

function ProductStatus({ active }: { active: boolean }) {
  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-[11px] font-medium ${
        active
          ? "border-[#86E0C1]/20 bg-[#86E0C1]/[0.08] text-[#86E0C1]"
          : "border-white/10 bg-white/[0.05] text-white/45"
      }`}
    >
      <span
        className={`size-1.5 rounded-full ${
          active ? "bg-[#86E0C1]" : "bg-white/35"
        }`}
      />

      {active ? "Active" : "Inactive"}
    </span>
  );
}

function RatingBadge({ rating }: { rating: number | null }) {
  if (rating === null) {
    return (
      <span className="text-[11px] text-white/30">
        Unrated
      </span>
    );
  }

  return (
    <div className="inline-flex items-center gap-1.5 rounded-full border border-[#A9C5FF]/15 bg-[#A9C5FF]/[0.07] px-3 py-1.5">
      <Star size={12} fill="#A9C5FF" className="text-[#A9C5FF]" />

      <span className="text-[12px] font-semibold tabular-nums text-white">
        {rating.toFixed(1)}
      </span>

      <span className="text-[10px] text-white/35">
        /10
      </span>
    </div>
  );
}

function StatCard({
  label,
  value,
  icon: Icon,
  accent,
}: {
  label: string;
  value: number | null;
  icon: typeof Package;
  accent: string;
}) {
  return (
    <div className="relative overflow-hidden rounded-[24px] border border-white/[0.09] bg-white/[0.045] p-5 backdrop-blur-2xl sm:p-6">
      <div className="mb-7 flex items-center justify-between">
        <div
          className="flex size-10 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.05]"
          style={{ color: accent }}
        >
          <Icon size={18} strokeWidth={1.7} />
        </div>

        <ArrowUpRight size={15} className="text-white/20" />
      </div>

      <p className="text-[12px] text-white/45">
        {label}
      </p>

      <p className="mt-2 text-[clamp(2rem,3vw,2.7rem)] font-semibold leading-none tracking-[-0.065em] text-white">
        {value === null ? "—" : formatNumber(value)}
      </p>
    </div>
  );
}

/* ============================================================
   PRODUCT DETAILS
============================================================ */

function ProductDetails({ product }: { product: Product }) {
  return (
    <div className="border-t border-white/[0.08] bg-[#0c1526]/80 px-5 py-6 sm:px-7">

      <div className="grid gap-7 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">

        {/* PRODUCT INFORMATION */}
        <div>
          <h3 className="mb-5 text-[12px] font-semibold text-white/80">
            Product information
          </h3>

          <div className="space-y-5">
            <div>
              <p className="mb-2 text-[10px] text-white/35">
                Description
              </p>

              <p className="max-w-2xl whitespace-pre-wrap text-[12px] leading-[1.8] text-white/65">
                {product.description}
              </p>
            </div>

            {product.shortDescription && (
              <div>
                <p className="mb-2 text-[10px] text-white/35">
                  Short description
                </p>

                <p className="text-[12px] leading-relaxed text-white/65">
                  {product.shortDescription}
                </p>
              </div>
            )}

            <div>
              <p className="mb-2 text-[10px] text-white/35">
                Categories
              </p>

              <div className="flex flex-wrap gap-2">
                {product.categories.length > 0 ? (
                  product.categories.map((category) => (
                    <span
                      key={category.id}
                      className="rounded-full border border-white/10 bg-white/[0.05] px-3 py-1.5 text-[11px] text-white/65"
                    >
                      {category.name}
                    </span>
                  ))
                ) : (
                  <span className="text-[11px] text-white/30">
                    No categories assigned
                  </span>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 rounded-2xl border border-white/[0.07] bg-white/[0.025] p-4 sm:grid-cols-3">
              <div>
                <p className="text-[10px] text-white/35">Images</p>
                <p className="mt-2 text-[14px] font-semibold text-white">
                  {product.imageCount}
                </p>
              </div>

              <div>
                <p className="text-[10px] text-white/35">Variants</p>
                <p className="mt-2 text-[14px] font-semibold text-white">
                  {product.variantCount}
                </p>
              </div>

              <div>
                <p className="text-[10px] text-white/35">Available variants</p>
                <p className="mt-2 text-[14px] font-semibold text-white">
                  {product.availableVariantCount}
                </p>
              </div>
            </div>

            {/* INSTAGRAM VIDEO */}
            {product.instagramVideoUrl && (
              <a
                href={product.instagramVideoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-[12px] font-medium text-[#A9C5FF] transition-colors hover:text-white"
              >
                View Instagram product video
                <ExternalLink size={13} />
              </a>
            )}
          </div>
        </div>

        {/* PRODUCT RATINGS */}
        <div>
          <div className="mb-5 flex items-center gap-2">
            <Star size={15} className="text-[#A9C5FF]" />

            <h3 className="text-[12px] font-semibold text-white/80">
              Product ratings
            </h3>
          </div>

          <div className="rounded-[22px] border border-white/[0.07] bg-white/[0.025] p-5">
            <div className="space-y-5">
              {ratingCategories.map((category) => {
                const value = product.ratings[category.key];

                return (
                  <div key={category.key}>
                    <div className="mb-2.5 flex items-center justify-between">
                      <span className="text-[11px] text-white/50">
                        {category.label}
                      </span>

                      <span className="text-[12px] font-semibold tabular-nums text-white/85">
                        {value === null ? "—" : value.toFixed(1)}

                        <span className="ml-1 text-[10px] font-normal text-white/30">
                          / 10
                        </span>
                      </span>
                    </div>

                    <div className="h-1.5 overflow-hidden rounded-full bg-white/[0.07]">
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${Math.max(0, Math.min(100, (value ?? 0) * 10))}%`,
                          backgroundColor: category.color,
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* VARIANTS */}
      <div className="mt-8 border-t border-white/[0.08] pt-7">

        <div className="mb-5 flex items-center justify-between gap-4">
          <h3 className="text-[12px] font-semibold text-white/80">
            Product variants
          </h3>

          <span className="text-[11px] text-white/35">
            {product.variantCount} total
          </span>
        </div>

        {product.variants.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-white/10 px-5 py-8 text-center">
            <Layers3 size={22} className="mx-auto mb-3 text-white/25" />

            <p className="text-[12px] text-white/45">
              No variants have been created for this product.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-2xl border border-white/[0.08]">
            <table className="w-full min-w-[650px] border-collapse text-left">
              <thead className="bg-white/[0.035]">
                <tr className="text-[10px] text-white/40">
                  <th className="px-4 py-3 font-medium">Variant</th>
                  <th className="px-4 py-3 font-medium">SKU</th>
                  <th className="px-4 py-3 font-medium">Price</th>
                  <th className="px-4 py-3 font-medium">Stock</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                </tr>
              </thead>

              <tbody>
                {product.variants.map((variant) => (
                  <tr
                    key={variant.id}
                    className="border-t border-white/[0.06] text-[11px] text-white/65"
                  >
                    <td className="px-4 py-4">
                      <p className="font-medium text-white/85">
                        {variant.name || "Default variant"}
                      </p>

                      {(variant.size || variant.color) && (
                        <p className="mt-1 text-[10px] text-white/35">
                          {[variant.size, variant.color].filter(Boolean).join(" · ")}
                        </p>
                      )}
                    </td>

                    <td className="px-4 py-4 font-mono text-[10px] text-white/45">
                      {variant.sku}
                    </td>

                    <td className="px-4 py-4 font-medium text-white/80">
                      {formatPrice(variant.price ?? product.price, product.currency)}
                    </td>

                    <td className="px-4 py-4">
                      <span className={variant.isActive && variant.availableStock > 0 ? "text-[#86E0C1]" : "text-white/40"}>
                        {formatNumber(variant.availableStock)}
                      </span>

                      <p className="mt-1 text-[9px] text-white/30">
                        Across suppliers
                      </p>
                    </td>

                    <td className="px-4 py-4">
                      <ProductStatus active={variant.isActive} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* METADATA */}
      <div className="mt-7 flex flex-wrap items-center justify-between gap-4 border-t border-white/[0.08] pt-5">
        <div className="flex flex-wrap gap-x-6 gap-y-2 text-[10px] text-white/35">
          <span>Created {formatDate(product.createdAt)}</span>
          <span>Updated {formatDate(product.updatedAt)}</span>
        </div>

        <span className="font-mono text-[10px] text-white/25">
          ID: {product.id}
        </span>
      </div>
    </div>
  );
}

/* ============================================================
   MAIN COMPONENT
============================================================ */

export default function ProductsPageClient() {
  const [data, setData] = useState<ProductsResponse | null>(null);
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);

  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");

  const [status, setStatus] = useState<StatusFilter>("all");
  const [sort, setSort] = useState<SortOption>("newest");

  const [page, setPage] = useState(1);
  const [refreshKey, setRefreshKey] = useState(0);

  const [expandedProductId, setExpandedProductId] = useState<string | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /* ============================================================
     SEARCH DEBOUNCE
  ============================================================ */

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setSearch(searchInput.trim());
      setPage(1);
    }, 350);

    return () => window.clearTimeout(timer);
  }, [searchInput]);

  /* ============================================================
     FETCH PRODUCTS
  ============================================================ */

  const fetchProducts = useCallback(async (signal: AbortSignal) => {
    const params = new URLSearchParams({
      page: String(page),
      search,
      status,
      sort,
    });

    const response = await fetch(
      `/api/admin/dashboard/products?${params.toString()}`,
      {
        signal,
        cache: "no-store",
      },
    );

    if (!response.ok) {
      const message =
        response.status === 401
          ? "Your session has expired. Please sign in again."
          : response.status === 403
            ? "Administrator access is required."
            : "Unable to retrieve products.";

      throw new Error(message);
    }

    return (await response.json()) as ProductsResponse;
  }, [page, search, status, sort]);

  useEffect(() => {
    const controller = new AbortController();

    async function loadProducts() {
      setLoading(true);
      setError(null);

      try {
        const result = await fetchProducts(controller.signal);

        if (controller.signal.aborted) return;

        setData(result);
      } catch (error) {
        if (controller.signal.aborted) return;

        setError(
          error instanceof Error
            ? error.message
            : "Unable to load products.",
        );
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    loadProducts();

    return () => controller.abort();
  }, [fetchProducts, refreshKey]);

  const products = data?.products ?? [];
  const pagination = data?.pagination;

  const handleRefresh = () => {
    setRefreshKey((current) => current + 1);
  };

  const handleStatusChange = (value: StatusFilter) => {
    setStatus(value);
    setPage(1);
    setExpandedProductId(null);
  };

  const handleSortChange = (value: SortOption) => {
    setSort(value);
    setPage(1);
    setExpandedProductId(null);
  };

  const handlePageChange = (value: number) => {
    setPage(value);
    setExpandedProductId(null);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <main className="relative isolate min-h-[calc(100svh-76px)] overflow-hidden bg-[#080d18] text-white">

      {/* BACKGROUND ATMOSPHERE */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
      >
        <div className="absolute -left-[25%] -top-[400px] size-[850px] rounded-full bg-[#315aa8]/[0.12] blur-[150px]" />
        <div className="absolute -right-[20%] top-[20%] size-[650px] rounded-full bg-[#608bff]/[0.07] blur-[150px]" />
      </div>

      <div className="mx-auto w-full max-w-[1600px] px-5 py-9 sm:px-8 lg:px-12 lg:py-12">

        {/* =====================================================
            HEADER
        ===================================================== */}

        <header className="mb-10">

          {/* BREADCRUMBS */}
          <div className="mb-7 flex items-center gap-2 text-[11px]">
            <Link
              href="/dashboard"
              className="flex items-center gap-2 text-white/40 transition-colors hover:text-white"
            >
              <ArrowLeft size={13} />
              Dashboard
            </Link>

            <ChevronRight size={12} className="text-white/20" />

            <span className="font-medium text-[#A9C5FF]">
              Products
            </span>
          </div>

          <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">

            <div>
              <div className="mb-4 flex items-center gap-2">
                <span className="flex size-8 items-center justify-center rounded-xl border border-[#A9C5FF]/15 bg-[#A9C5FF]/10">
                  <Boxes size={15} className="text-[#A9C5FF]" />
                </span>

                <span className="text-[10px] font-medium uppercase tracking-[0.12em] text-[#A9C5FF]/75">
                  Quickshipgo / Product management
                </span>
              </div>

              <h1 className="text-[clamp(2.6rem,4vw,4.5rem)] font-semibold leading-[1.05] tracking-[-0.065em] text-white">
                Your products<span className="text-[#A9C5FF]">.</span>
              </h1>

              <p className="mt-4 max-w-xl text-[13px] leading-relaxed text-white/45 sm:text-[14px]">
                Manage your collection, monitor availability, and keep every
                product ready for your customers.
              </p>
            </div>

            {/* ACTIONS */}
            <div className="flex flex-wrap items-center gap-3">

              <button
                type="button"
                onClick={handleRefresh}
                disabled={loading}
                aria-label="Refresh products"
                className="flex size-11 items-center justify-center rounded-full border border-white/10 bg-white/[0.05] text-white/60 transition-all hover:border-white/20 hover:bg-white/[0.09] hover:text-white disabled:opacity-40"
              >
                <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
              </button>

              {/* ADD PRODUCT — NO ACTION YET */}
              <button
                type="button"
                onClick={() => setIsAddProductOpen(true)}
                className="group inline-flex min-h-11 items-center justify-center gap-2.5 rounded-full border border-white/20 bg-white px-6 text-[12px] font-semibold text-[#080d18] shadow-[0_8px_30px_rgba(255,255,255,0.08)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#dce8ff] hover:shadow-[0_12px_35px_rgba(255,255,255,0.15)] active:scale-[0.98]"
              >
                <Plus size={17} strokeWidth={2} />

                Add product

                <ArrowUpRight
                  size={14}
                  className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                />
              </button>
            </div>
          </div>
        </header>

        {/* =====================================================
            STATISTICS
        ===================================================== */}

        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <StatCard
            label="Total products"
            value={data?.summary.totalProducts ?? null}
            icon={Boxes}
            accent="#A9C5FF"
          />

          <StatCard
            label="Active products"
            value={data?.summary.activeProducts ?? null}
            icon={Activity}
            accent="#86E0C1"
          />

          <StatCard
            label="Inactive products"
            value={data?.summary.inactiveProducts ?? null}
            icon={Package}
            accent="#E8C59B"
          />
        </div>

        {/* =====================================================
            PRODUCT CATALOG
        ===================================================== */}

        <section
          aria-labelledby="products-list-title"
          className="overflow-hidden rounded-[30px] border border-white/[0.10] bg-white/[0.035] shadow-[0_20px_70px_rgba(0,0,0,0.12)] backdrop-blur-2xl"
        >

          {/* SECTION HEADER */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/[0.08] px-5 py-6 sm:px-7">

            <div>
              <div className="mb-2 flex items-center gap-2">
                <Sparkles size={14} className="text-[#A9C5FF]" />

                <span className="text-[10px] font-medium uppercase tracking-[0.1em] text-[#A9C5FF]/70">
                  Your collection
                </span>
              </div>

              <h2
                id="products-list-title"
                className="text-[20px] font-semibold tracking-[-0.045em] text-white"
              >
                Product catalog
              </h2>

              <p className="mt-1 text-[11px] text-white/40">
                {pagination
                  ? `${formatNumber(pagination.total)} products found`
                  : "Browse your products"}
              </p>
            </div>

            <div className="flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.035] px-3 py-2">
              <span className="size-1.5 rounded-full bg-[#86E0C1]" />

              <span className="text-[10px] font-medium text-white/45">
                Catalog management
              </span>
            </div>
          </div>

          {/* =====================================================
              FILTERS
          ===================================================== */}

          <div className="flex flex-col gap-4 border-b border-white/[0.08] px-5 py-5 sm:px-7 xl:flex-row xl:items-center xl:justify-between">

            {/* SEARCH */}
            <div className="relative w-full xl:max-w-[390px]">
              <Search
                size={16}
                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-white/35"
              />

              <input
                type="search"
                value={searchInput}
                onChange={(event) => setSearchInput(event.target.value)}
                placeholder="Search products, SKU, categories..."
                aria-label="Search products"
                className="h-11 w-full rounded-full border border-white/[0.10] bg-white/[0.045] pl-11 pr-10 text-[12px] text-white outline-none transition-all placeholder:text-white/30 hover:border-white/20 focus:border-[#A9C5FF]/40 focus:bg-white/[0.07] focus:ring-4 focus:ring-[#A9C5FF]/[0.05]"
              />

              {searchInput && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchInput("");
                    setSearch("");
                    setPage(1);
                  }}
                  aria-label="Clear search"
                  className="absolute right-3 top-1/2 flex size-6 -translate-y-1/2 items-center justify-center rounded-full text-white/35 transition-colors hover:bg-white/10 hover:text-white"
                >
                  <X size={13} />
                </button>
              )}
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">

              {/* STATUS FILTER */}
              <div className="flex h-11 items-center gap-1 rounded-full border border-white/[0.10] bg-white/[0.035] p-1">
                {(
                  [
                    { value: "all", label: "All" },
                    { value: "active", label: "Active" },
                    { value: "inactive", label: "Inactive" },
                  ] as const
                ).map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => handleStatusChange(option.value)}
                    className={`h-full rounded-full px-4 text-[11px] font-medium transition-all ${
                      status === option.value
                        ? "bg-white text-[#080d18] shadow-sm"
                        : "text-white/45 hover:bg-white/[0.06] hover:text-white"
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>

              {/* SORT */}
              <div className="relative flex h-11 min-w-[175px] items-center rounded-full border border-white/[0.10] bg-white/[0.035] transition-colors hover:border-white/20">
                <SlidersHorizontal size={14} className="pointer-events-none absolute left-4 text-white/45" />

                <select
                  value={sort}
                  onChange={(event) => handleSortChange(event.target.value as SortOption)}
                  aria-label="Sort products"
                  className="h-full w-full cursor-pointer appearance-none rounded-full bg-transparent pl-10 pr-9 text-[11px] font-medium text-white/70 outline-none"
                >
                  <option value="newest" className="bg-[#101829]">Newest first</option>
                  <option value="oldest" className="bg-[#101829]">Oldest first</option>
                  <option value="name" className="bg-[#101829]">Name A–Z</option>
                  <option value="price-low" className="bg-[#101829]">Price: Low to high</option>
                  <option value="price-high" className="bg-[#101829]">Price: High to low</option>
                  <option value="rating" className="bg-[#101829]">Highest rated</option>
                </select>

                <ChevronDown
                  size={14}
                  className="pointer-events-none absolute right-4 text-white/40"
                />
              </div>
            </div>
          </div>

          {/* =====================================================
              ERROR
          ===================================================== */}

          {error && (
            <div
              role="alert"
              className="mx-5 mt-5 rounded-2xl border border-red-400/20 bg-red-400/[0.06] px-5 py-4 text-[12px] text-red-200 sm:mx-7"
            >
              <p>{error}</p>

              <button
                type="button"
                onClick={handleRefresh}
                className="mt-3 text-[11px] font-semibold text-white underline underline-offset-4"
              >
                Try again
              </button>
            </div>
          )}

          {/* =====================================================
              LOADING
          ===================================================== */}

          {loading && (
            <div className="flex min-h-[340px] flex-col items-center justify-center gap-4">
              <LoaderCircle
                size={24}
                className="animate-spin text-[#A9C5FF]"
              />

              <p className="text-[12px] text-white/40">
                Loading your products...
              </p>
            </div>
          )}

          {/* =====================================================
              EMPTY STATE
          ===================================================== */}

          {!loading && !error && products.length === 0 && (
            <div className="flex min-h-[350px] flex-col items-center justify-center px-6 text-center">

              <div className="mb-5 flex size-16 items-center justify-center rounded-[22px] border border-[#A9C5FF]/15 bg-[#A9C5FF]/[0.06]">
                <Package
                  size={27}
                  strokeWidth={1.4}
                  className="text-[#A9C5FF]"
                />
              </div>

              <h3 className="text-[20px] font-semibold tracking-[-0.04em] text-white">
                No products found
              </h3>

              <p className="mt-3 max-w-[350px] text-[12px] leading-relaxed text-white/40">
                {search || status !== "all"
                  ? "No products match your current filters. Try adjusting your search or selecting a different status."
                  : "Your collection is currently empty. Add your first product to start building your store."}
              </p>

              {(search || status !== "all") && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchInput("");
                    setSearch("");
                    setStatus("all");
                    setPage(1);
                  }}
                  className="mt-6 rounded-full border border-white/15 bg-white/[0.07] px-5 py-2.5 text-[11px] font-medium text-white transition-colors hover:bg-white/[0.12]"
                >
                  Clear filters
                </button>
              )}
            </div>
          )}

          {/* =====================================================
              PRODUCT LIST
          ===================================================== */}

          {!loading && !error && products.length > 0 && (
            <div>

              {/* DESKTOP TABLE HEADER */}
              <div className="hidden grid-cols-[minmax(0,2.1fr)_minmax(95px,0.7fr)_minmax(105px,0.8fr)_minmax(95px,0.75fr)_minmax(85px,0.65fr)_minmax(90px,0.7fr)_32px] items-center gap-4 border-b border-white/[0.08] bg-white/[0.015] px-7 py-4 lg:grid">

                {[
                  "Product",
                  "Price",
                  "Status",
                  "Inventory",
                  "Rating",
                  "Updated",
                  "",
                ].map((label, index) => (
                  <span
                    key={`${label}-${index}`}
                    className="text-[10px] font-medium uppercase tracking-[0.06em] text-white/35"
                  >
                    {label}
                  </span>
                ))}
              </div>

              {/* PRODUCT ROWS */}
              <div className="divide-y divide-white/[0.06]">
                {products.map((product) => {
                  const expanded = expandedProductId === product.id;

                  return (
                    <div key={product.id}>

                      {/* ROW */}
                      <button
                        type="button"
                        aria-expanded={expanded}
                        onClick={() =>
                          setExpandedProductId(expanded ? null : product.id)
                        }
                        className={`group flex w-full flex-col gap-5 px-5 py-5 text-left transition-colors hover:bg-white/[0.035] sm:px-7 lg:grid lg:grid-cols-[minmax(0,2.1fr)_minmax(95px,0.7fr)_minmax(105px,0.8fr)_minmax(95px,0.75fr)_minmax(85px,0.65fr)_minmax(90px,0.7fr)_32px] lg:items-center lg:gap-4 ${
                          expanded ? "bg-white/[0.035]" : ""
                        }`}
                      >

                        {/* PRODUCT */}
                        <div className="flex min-w-0 items-center gap-4">

                          {/* IMAGE PLACEHOLDER */}
                          <div className="relative flex size-[66px] shrink-0 items-center justify-center overflow-hidden rounded-[17px] border border-white/[0.10] bg-gradient-to-br from-[#243755] via-[#15233a] to-[#10192a] sm:size-[72px]">

                            <ImageIcon
                              size={23}
                              strokeWidth={1.3}
                              className="text-[#A9C5FF]/50"
                            />

                            {product.imageCount > 0 && (
                              <span className="absolute bottom-1.5 right-1.5 rounded-full border border-white/10 bg-[#080d18]/80 px-1.5 py-0.5 text-[9px] text-white/70">
                                {product.imageCount}
                              </span>
                            )}
                          </div>

                          <div className="min-w-0 flex-1">
                            <p className="truncate text-[13px] font-semibold tracking-[-0.02em] text-white/90 transition-colors group-hover:text-white">
                              {product.name}
                            </p>

                            <p className="mt-1.5 truncate text-[11px] text-white/35">
                              {product.shortDescription || product.slug}
                            </p>

                            <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
                              {product.categories.slice(0, 2).map((category) => (
                                <span
                                  key={category.id}
                                  className="rounded-full border border-white/[0.08] bg-white/[0.035] px-2 py-1 text-[9px] text-white/45"
                                >
                                  {category.name}
                                </span>
                              ))}

                              {product.categories.length > 2 && (
                                <span className="text-[9px] text-white/30">
                                  +{product.categories.length - 2}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* MOBILE INFORMATION */}
                        <div className="grid grid-cols-2 gap-5 sm:grid-cols-4 lg:contents">

                          {/* PRICE */}
                          <div>
                            <p className="mb-2 text-[10px] text-white/35 lg:hidden">
                              Price
                            </p>

                            <span className="text-[12px] font-semibold tabular-nums text-white/85">
                              {formatPrice(product.price, product.currency)}
                            </span>
                          </div>

                          {/* STATUS */}
                          <div>
                            <p className="mb-2 text-[10px] text-white/35 lg:hidden">
                              Status
                            </p>

                            <ProductStatus active={product.isActive} />
                          </div>

                          {/* INVENTORY */}
                          <div>
                            <p className="mb-2 text-[10px] text-white/35 lg:hidden">
                              Inventory
                            </p>

                            <div className="flex items-center gap-2">
                              <span
                                className={`size-1.5 rounded-full ${
                                  product.availableVariantCount > 0
                                    ? "bg-[#86E0C1]"
                                    : "bg-[#E8C59B]"
                                }`}
                              />

                              <span className="text-[12px] font-medium tabular-nums text-white/75">
                                {product.availableVariantCount}/{product.variantCount}
                              </span>
                            </div>

                            <p className="mt-1 text-[9px] text-white/30">
                              Available variants
                            </p>
                          </div>

                          {/* RATING */}
                          <div>
                            <p className="mb-2 text-[10px] text-white/35 lg:hidden">
                              Rating
                            </p>

                            <RatingBadge rating={product.ratings.overall} />
                          </div>
                        </div>

                        {/* UPDATED */}
                        <div className="hidden lg:block">
                          <span className="text-[11px] text-white/45">
                            {formatDate(product.updatedAt)}
                          </span>
                        </div>

                        {/* EXPAND */}
                        <div className="hidden items-center justify-end lg:flex">
                          <span className="flex size-8 items-center justify-center rounded-full border border-white/[0.08] bg-white/[0.035] text-white/40 transition-all group-hover:border-white/20 group-hover:text-white">
                            {expanded ? (
                              <ChevronUp size={15} />
                            ) : (
                              <ChevronDown size={15} />
                            )}
                          </span>
                        </div>

                        {/* MOBILE EXPAND LABEL */}
                        <div className="flex items-center justify-between border-t border-white/[0.06] pt-3 lg:hidden">
                          <span className="text-[10px] font-medium text-[#A9C5FF]">
                            {expanded ? "Hide product details" : "View product details"}
                          </span>

                          {expanded ? (
                            <ChevronUp size={15} className="text-[#A9C5FF]" />
                          ) : (
                            <ChevronDown size={15} className="text-[#A9C5FF]" />
                          )}
                        </div>
                      </button>

                      {/* EXPANDED PRODUCT DETAILS */}
                      {expanded && <ProductDetails product={product} />}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* =====================================================
              PAGINATION
          ===================================================== */}

          {!loading && !error && pagination && pagination.total > 0 && (
            <div className="flex flex-col justify-between gap-4 border-t border-white/[0.08] px-5 py-5 sm:flex-row sm:items-center sm:px-7">

              <p className="text-[11px] text-white/40">
                Showing{" "}
                <span className="font-medium text-white/65">
                  {(pagination.page - 1) * pagination.pageSize + 1}
                </span>
                {" – "}
                <span className="font-medium text-white/65">
                  {Math.min(
                    pagination.page * pagination.pageSize,
                    pagination.total,
                  )}
                </span>
                {" of "}
                <span className="font-medium text-white/65">
                  {formatNumber(pagination.total)}
                </span>
                {" products"}
              </p>

              <div className="flex items-center gap-2">

                <button
                  type="button"
                  onClick={() => handlePageChange(page - 1)}
                  disabled={page <= 1}
                  aria-label="Previous page"
                  className="flex size-9 items-center justify-center rounded-full border border-white/[0.10] bg-white/[0.035] text-white/60 transition-all hover:bg-white/[0.08] hover:text-white disabled:cursor-not-allowed disabled:opacity-25"
                >
                  <ChevronLeft size={16} />
                </button>

                <span className="px-3 text-[11px] font-medium tabular-nums text-white/60">
                  {pagination.page} / {pagination.totalPages}
                </span>

                <button
                  type="button"
                  onClick={() => handlePageChange(page + 1)}
                  disabled={page >= pagination.totalPages}
                  aria-label="Next page"
                  className="flex size-9 items-center justify-center rounded-full border border-white/[0.10] bg-white/[0.035] text-white/60 transition-all hover:bg-white/[0.08] hover:text-white disabled:cursor-not-allowed disabled:opacity-25"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}
        </section>

        {/* =====================================================
            FOOTER
        ===================================================== */}

        <footer className="mt-10 flex flex-wrap items-center justify-between gap-4 border-t border-white/[0.08] pt-6">

          <span className="text-[11px] font-medium tracking-[-0.03em] text-white/35">
            quickshipgo<span className="text-[#A9C5FF]">.</span>
          </span>

          <div className="flex items-center gap-2 text-[10px] text-white/30">
            <CircleCheck size={12} className="text-[#86E0C1]/60" />
            Your collection, all in one place.
          </div>
        </footer>
      </div>
          <AddProductModal
            open={isAddProductOpen}
            onClose={() => setIsAddProductOpen(false)}
            onCreated={() => {
              setPage(1);
              setSearchInput("");
              setSearch("");
              setStatus("all");
              setSort("newest");
              setExpandedProductId(null);
              setRefreshKey((current) => current + 1);
            }}
          />
    </main>
  );
}