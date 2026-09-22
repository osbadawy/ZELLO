"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";

import {
  Activity,
  ArrowLeft,
  ArrowUpRight,
  Boxes,
  CheckCircle2,
  ChevronRight,
  Folder,
  FolderOpen,
  Layers3,
  LoaderCircle,
  Package,
  Plus,
  RefreshCw,
  Search,
  Sparkles,
  X,
} from "lucide-react";

import AddCategoryModal from "./AddCategoryModal";

/* ============================================================
   TYPES
============================================================ */

type Category = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  isActive: boolean;

  productCount: number;

  createdAt: string;
  updatedAt: string;
};

type CategoriesResponse = {
  categories: Category[];

  summary: {
    totalCategories: number;
    activeCategories: number;
    inactiveCategories: number;
    categoriesWithProducts: number;
  };
};

type StatusFilter = "all" | "active" | "inactive";

/* ============================================================
   HELPERS
============================================================ */

const numberFormatter = new Intl.NumberFormat("en-US");

function formatNumber(value: number) {
  return numberFormatter.format(value);
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

/* ============================================================
   STATUS BADGE
============================================================ */

function CategoryStatus({ active }: { active: boolean }) {
  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-[10px] font-medium ${
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

/* ============================================================
   STATISTICS CARD
============================================================ */

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
    <div className="group relative overflow-hidden rounded-[24px] border border-white/[0.09] bg-white/[0.045] p-5 backdrop-blur-2xl transition-all duration-300 hover:border-white/[0.15] hover:bg-white/[0.06] sm:p-6">

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
   CATEGORY CARD
============================================================ */

function CategoryCard({ category }: { category: Category }) {
  return (
    <article className="group relative isolate flex h-full min-w-0 flex-col overflow-hidden rounded-[26px] border border-white/[0.10] bg-white/[0.045] p-6 shadow-[0_12px_50px_rgba(0,0,0,0.10)] backdrop-blur-2xl transition-all duration-300 hover:-translate-y-1 hover:border-[#A9C5FF]/25 hover:bg-white/[0.065]">

      {/* AMBIENT ACCENT */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-20 -top-20 -z-10 size-[220px] rounded-full bg-[#608bff]/[0.08] blur-[70px]"
      />

      {/* HEADER */}
      <div className="mb-6 flex items-start justify-between gap-4">

        {/* CATEGORY ICON */}
        <div className="flex size-12 shrink-0 items-center justify-center rounded-[17px] border border-[#A9C5FF]/15 bg-[#A9C5FF]/10">
          <FolderOpen size={21} strokeWidth={1.5} className="text-[#A9C5FF]" />
        </div>

        <CategoryStatus active={category.isActive} />
      </div>

      {/* CATEGORY INFORMATION */}
      <div className="min-w-0 flex-1">

        <h3 className="truncate text-[18px] font-semibold tracking-[-0.04em] text-white">
          {category.name}
        </h3>

        <p className="mt-1.5 truncate text-[11px] text-[#A9C5FF]/65">
          /{category.slug}
        </p>

        <p className="mt-5 line-clamp-3 min-h-[57px] text-[12px] leading-[1.7] text-white/45">
          {category.description || "No description has been added to this category yet."}
        </p>
      </div>

      {/* PRODUCT COUNT */}
      <div className="mt-6 flex items-center justify-between gap-4 rounded-[17px] border border-white/[0.07] bg-white/[0.035] p-4">

        <div className="flex items-center gap-3">
          <div className="flex size-9 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.05]">
            <Package size={16} strokeWidth={1.6} className="text-white/55" />
          </div>

          <div>
            <p className="text-[10px] text-white/35">
              Assigned products
            </p>

            <p className="mt-1 text-[16px] font-semibold tabular-nums text-white">
              {formatNumber(category.productCount)}
            </p>
          </div>
        </div>

        <span className="text-[10px] text-white/30">
          {category.productCount === 1 ? "1 product" : `${category.productCount} products`}
        </span>
      </div>

      {/* FOOTER */}
      <div className="mt-5 flex items-center justify-between gap-3 border-t border-white/[0.08] pt-5">

        <div>
          <p className="text-[10px] text-white/35">
            Created
          </p>

          <p className="mt-1 text-[11px] text-white/55">
            {formatDate(category.createdAt)}
          </p>
        </div>

        <div className="text-right">
          <p className="text-[10px] text-white/35">
            Last updated
          </p>

          <p className="mt-1 text-[11px] text-white/55">
            {formatDate(category.updatedAt)}
          </p>
        </div>
      </div>
    </article>
  );
}

/* ============================================================
   MAIN COMPONENT
============================================================ */

export default function CategoriesPageClient() {
  const [data, setData] = useState<CategoriesResponse | null>(null);

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<StatusFilter>("all");

  const [isAddCategoryOpen, setIsAddCategoryOpen] = useState(false);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [refreshKey, setRefreshKey] = useState(0);

  /* ============================================================
     FETCH CATEGORIES
  ============================================================ */

  const fetchCategories = useCallback(async (signal: AbortSignal) => {
    const response = await fetch("/api/admin/dashboard/categories", {
      signal,
      cache: "no-store",
    });

    if (!response.ok) {
      const message =
        response.status === 401
          ? "Your session has expired. Please sign in again."
          : response.status === 403
            ? "Administrator access is required."
            : "Unable to retrieve categories.";

      throw new Error(message);
    }

    return (await response.json()) as CategoriesResponse;
  }, []);

  useEffect(() => {
    const controller = new AbortController();

    async function loadCategories() {
      setLoading(true);
      setError(null);

      try {
        const result = await fetchCategories(controller.signal);

        if (controller.signal.aborted) return;

        setData(result);
      } catch (error) {
        if (controller.signal.aborted) return;

        setError(
          error instanceof Error
            ? error.message
            : "Unable to load categories.",
        );
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    loadCategories();

    return () => controller.abort();
  }, [fetchCategories, refreshKey]);

  /* ============================================================
     FILTER CATEGORIES
  ============================================================ */

  const categories = useMemo(() => {
    const allCategories = data?.categories ?? [];

    const normalizedSearch = search.trim().toLowerCase();

    return allCategories.filter((category) => {
      const matchesSearch =
        !normalizedSearch ||
        category.name.toLowerCase().includes(normalizedSearch) ||
        category.slug.toLowerCase().includes(normalizedSearch) ||
        category.description?.toLowerCase().includes(normalizedSearch);

      const matchesStatus =
        status === "all" ||
        (status === "active" && category.isActive) ||
        (status === "inactive" && !category.isActive);

      return matchesSearch && matchesStatus;
    });
  }, [data, search, status]);

  /* ============================================================
     HANDLERS
  ============================================================ */

  function handleRefresh() {
    setRefreshKey((current) => current + 1);
  }

  function handleCategoryCreated() {
    setSearch("");
    setStatus("all");
    handleRefresh();
  }

  /* ============================================================
     RENDER
  ============================================================ */

  return (
    <main className="relative isolate min-h-screen w-full min-w-0 overflow-hidden bg-[#080d18] text-white">

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
              Categories
            </span>
          </div>

          {/* PAGE HEADING */}
          <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">

            <div>
              <div className="mb-4 flex items-center gap-2">

                <span className="flex size-8 items-center justify-center rounded-xl border border-[#A9C5FF]/15 bg-[#A9C5FF]/10">
                  <Layers3 size={15} className="text-[#A9C5FF]" />
                </span>

                <span className="text-[10px] font-medium uppercase tracking-[0.12em] text-[#A9C5FF]/75">
                  Quickshipgo / Catalog management
                </span>
              </div>

              <h1 className="text-[clamp(2.6rem,4vw,4.5rem)] font-semibold leading-[1.05] tracking-[-0.065em] text-white">
                Your categories<span className="text-[#A9C5FF]">.</span>
              </h1>

              <p className="mt-4 max-w-xl text-[13px] leading-relaxed text-white/45 sm:text-[14px]">
                Organize your collection, explore product categories, and
                create new ways for customers to discover your products.
              </p>
            </div>

            {/* ACTIONS */}
            <div className="flex flex-wrap items-center gap-3">

              <button
                type="button"
                onClick={handleRefresh}
                disabled={loading}
                aria-label="Refresh categories"
                className="flex size-11 items-center justify-center rounded-full border border-white/10 bg-white/[0.05] text-white/60 transition-all hover:border-white/20 hover:bg-white/[0.09] hover:text-white disabled:opacity-40"
              >
                <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
              </button>

              <button
                type="button"
                onClick={() => setIsAddCategoryOpen(true)}
                className="group inline-flex min-h-11 items-center justify-center gap-2.5 rounded-full border border-white/20 bg-white px-6 text-[12px] font-semibold text-[#080d18] shadow-[0_8px_30px_rgba(255,255,255,0.08)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#dce8ff] hover:shadow-[0_12px_35px_rgba(255,255,255,0.15)] active:scale-[0.98]"
              >
                <Plus size={17} strokeWidth={2} />

                Add category

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

        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">

          <StatCard
            label="Total categories"
            value={data?.summary.totalCategories ?? null}
            icon={Layers3}
            accent="#A9C5FF"
          />

          <StatCard
            label="Active categories"
            value={data?.summary.activeCategories ?? null}
            icon={Activity}
            accent="#86E0C1"
          />

          <StatCard
            label="Inactive categories"
            value={data?.summary.inactiveCategories ?? null}
            icon={Folder}
            accent="#E8C59B"
          />

          <StatCard
            label="Categories with products"
            value={data?.summary.categoriesWithProducts ?? null}
            icon={Boxes}
            accent="#C3ADFF"
          />
        </div>

        {/* =====================================================
            CATEGORY CATALOG
        ===================================================== */}

        <section aria-labelledby="categories-list-title">

          {/* SECTION HEADER */}
          <div className="mb-6 flex flex-col justify-between gap-5 sm:flex-row sm:items-center">

            <div>
              <div className="mb-2 flex items-center gap-2">
                <Sparkles size={14} className="text-[#A9C5FF]" />

                <span className="text-[10px] font-medium uppercase tracking-[0.1em] text-[#A9C5FF]/70">
                  Your collection
                </span>
              </div>

              <h2
                id="categories-list-title"
                className="text-[21px] font-semibold tracking-[-0.045em] text-white"
              >
                Category catalog
              </h2>

              <p className="mt-1.5 text-[11px] text-white/40">
                {loading
                  ? "Loading categories..."
                  : `${formatNumber(categories.length)} categories found`}
              </p>
            </div>

            {/* SEARCH AND FILTERS */}
            <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center">

              {/* SEARCH */}
              <div className="relative w-full sm:w-[280px] xl:w-[340px]">

                <Search
                  size={16}
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-white/35"
                />

                <input
                  type="search"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search categories..."
                  aria-label="Search categories"
                  className="h-11 w-full rounded-full border border-white/[0.10] bg-white/[0.045] pl-11 pr-10 text-[12px] text-white outline-none transition-all placeholder:text-white/30 hover:border-white/20 focus:border-[#A9C5FF]/40 focus:bg-white/[0.07] focus:ring-4 focus:ring-[#A9C5FF]/[0.05]"
                />

                {search && (
                  <button
                    type="button"
                    onClick={() => setSearch("")}
                    aria-label="Clear search"
                    className="absolute right-3 top-1/2 flex size-6 -translate-y-1/2 items-center justify-center rounded-full text-white/35 transition-colors hover:bg-white/10 hover:text-white"
                  >
                    <X size={13} />
                  </button>
                )}
              </div>

              {/* STATUS FILTER */}
              <div className="flex h-11 items-center gap-1 self-start rounded-full border border-white/[0.10] bg-white/[0.035] p-1">
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
                    onClick={() => setStatus(option.value)}
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
            </div>
          </div>

          {/* =====================================================
              ERROR
          ===================================================== */}

          {error && (
            <div
              role="alert"
              className="mb-6 rounded-2xl border border-red-400/20 bg-red-400/[0.06] px-5 py-4 text-[12px] text-red-200"
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
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 2xl:grid-cols-3">
              {Array.from({ length: 6 }, (_, index) => (
                <div
                  key={index}
                  className="h-[330px] animate-pulse rounded-[26px] border border-white/[0.08] bg-white/[0.045]"
                />
              ))}
            </div>
          )}

          {/* =====================================================
              EMPTY STATE
          ===================================================== */}

          {!loading && !error && categories.length === 0 && (
            <div className="flex min-h-[350px] flex-col items-center justify-center rounded-[28px] border border-dashed border-white/[0.10] bg-white/[0.025] px-6 text-center">

              <div className="mb-5 flex size-16 items-center justify-center rounded-[22px] border border-[#A9C5FF]/15 bg-[#A9C5FF]/[0.06]">
                <FolderOpen
                  size={27}
                  strokeWidth={1.4}
                  className="text-[#A9C5FF]"
                />
              </div>

              <h3 className="text-[20px] font-semibold tracking-[-0.04em] text-white">
                No categories found
              </h3>

              <p className="mt-3 max-w-[350px] text-[12px] leading-relaxed text-white/40">
                {search || status !== "all"
                  ? "No categories match your current filters. Try adjusting your search or selecting a different status."
                  : "Your collection is currently empty. Create your first category to start organizing your products."}
              </p>

              {search || status !== "all" ? (
                <button
                  type="button"
                  onClick={() => {
                    setSearch("");
                    setStatus("all");
                  }}
                  className="mt-6 rounded-full border border-white/15 bg-white/[0.07] px-5 py-2.5 text-[11px] font-medium text-white transition-colors hover:bg-white/[0.12]"
                >
                  Clear filters
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setIsAddCategoryOpen(true)}
                  className="mt-6 inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-[11px] font-semibold text-[#080d18] transition-colors hover:bg-[#dce8ff]"
                >
                  <Plus size={14} />
                  Create category
                </button>
              )}
            </div>
          )}

          {/* =====================================================
              CATEGORY GRID
          ===================================================== */}

          {!loading && !error && categories.length > 0 && (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 2xl:grid-cols-3">
              {categories.map((category) => (
                <CategoryCard
                  key={category.id}
                  category={category}
                />
              ))}
            </div>
          )}
        </section>

        {/* =====================================================
            FOOTER
        ===================================================== */}

        <footer className="mt-12 flex flex-wrap items-center justify-between gap-4 border-t border-white/[0.08] pt-6">

          <span className="text-[11px] font-medium tracking-[-0.03em] text-white/35">
            quickshipgo<span className="text-[#A9C5FF]">.</span>
          </span>

          <div className="flex items-center gap-2 text-[10px] text-white/30">
            <CheckCircle2 size={12} className="text-[#86E0C1]/60" />
            Your collection, organized.
          </div>
        </footer>
      </div>

      {/* =====================================================
          ADD CATEGORY MODAL
      ===================================================== */}

      <AddCategoryModal
        open={isAddCategoryOpen}
        onClose={() => setIsAddCategoryOpen(false)}
        onCreated={handleCategoryCreated}
      />
    </main>
  );
}