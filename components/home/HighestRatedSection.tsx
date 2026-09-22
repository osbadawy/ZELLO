"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import Image from "next/image";
import {
  Check,
  ChevronLeft,
  ChevronRight,
  ImageIcon,
  Plus,
  Star,
} from "lucide-react";

import type { ShopProduct } from "./ShopSection";

type RatedProduct = ShopProduct & {
  dailyUseRating: number | null;
  reliabilityRating: number | null;
  qualityRating: number | null;
  recommendRating: number | null;
};

type HighestRatedResponse = {
  products: RatedProduct[];
};

type HighestRatedSectionProps = {
  onAdd: (product: ShopProduct) => void;
};

function formatPrice(price: number, currency: string) {
  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
      maximumFractionDigits: 2,
    }).format(price);
  } catch {
    return `${price.toFixed(2)} ${currency}`;
  }
}

function RatingBar({
  label,
  value,
}: {
  label: string;
  value: number | null;
}) {
  const percentage =
    value === null ? 0 : Math.max(0, Math.min(value, 10)) * 10;

  return (
    <div className="space-y-2.5">
      <div className="flex items-center justify-between gap-4">
        <span className="text-[12px] font-medium text-white/60">
          {label}
        </span>

        <span className="text-[12px] font-semibold tabular-nums text-white">
          {value === null ? (
            <span className="text-[11px] font-normal text-white/30">
              Not rated
            </span>
          ) : (
            <>
              {value.toFixed(1)}
              <span className="ml-1 font-normal text-white/30">/ 10</span>
            </>
          )}
        </span>
      </div>

      <div
        role="meter"
        aria-label={label}
        aria-valuemin={0}
        aria-valuemax={10}
        aria-valuenow={value === null ? undefined : value}
        aria-valuetext={value === null ? "Not rated" : `${value} out of 10`}
        className="relative h-[6px] w-full overflow-hidden rounded-full bg-white/[0.09]"
      >
        <div
          className="h-full rounded-full bg-gradient-to-r from-[#688DE0] to-[#A9C5FF] transition-[width] duration-500 ease-out"
          style={{ width: `${percentage}%` }}
        />
      </div>

      <div
        aria-hidden="true"
        className="flex justify-between text-[9px] font-medium text-white/25"
      >
        <span>0</span>
        <span>10</span>
      </div>
    </div>
  );
}

function FeaturedRatings({
  product,
}: {
  product: RatedProduct;
}) {
  const ratings = [
    { label: "Daily use", value: product.dailyUseRating },
    { label: "Reliability", value: product.reliabilityRating },
    { label: "Quality", value: product.qualityRating },
    { label: "Recommendation", value: product.recommendRating },
  ];

  return (
    <div className="relative mb-8 overflow-hidden rounded-[28px] border border-white/[0.10] bg-white/[0.045] p-6 backdrop-blur-xl sm:p-8 lg:p-10">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-20 -top-28 size-[360px] rounded-full bg-[#7197ff]/[0.07] blur-[100px]"
      />

      <div className="relative grid gap-8 lg:grid-cols-[0.75fr_1.25fr] lg:gap-12">
        {/* SELECTED PRODUCT */}
        <div className="flex min-w-0 flex-col justify-center">
          <div className="mb-5 flex items-center gap-2">
            <span className="flex size-7 items-center justify-center rounded-full border border-[#A9C5FF]/20 bg-[#A9C5FF]/10">
              <Star
                size={12}
                strokeWidth={1.7}
                className="text-[#A9C5FF]"
              />
            </span>

            <span className="text-[10px] font-medium uppercase tracking-[0.12em] text-[#A9C5FF]/80">
              Product ratings
            </span>
          </div>

          <h3
            key={product.id}
            className="max-w-[420px] text-[clamp(1.8rem,3vw,2.8rem)] font-semibold leading-[1.12] tracking-[-0.055em] text-white"
          >
            {product.name}
          </h3>

          <p className="mt-4 text-[12px] text-white/40">
            {product.categories[0]?.name || "Curated collection"}
          </p>

          <div className="mt-8 flex items-center gap-2 text-[11px] text-white/35">
            <Check size={13} className="text-[#A9C5FF]" />
            Select a product below to explore its ratings
          </div>
        </div>

        {/* INDIVIDUAL RATINGS */}
        <div className="grid gap-x-10 gap-y-7 sm:grid-cols-2">
          {ratings.map((rating) => (
            <RatingBar
              key={`${product.id}-${rating.label}`}
              label={rating.label}
              value={rating.value}
            />
          ))}
        </div>
      </div>

      <div className="pointer-events-none absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />
    </div>
  );
}

function RatedProductCard({
  product,
  selected,
  onSelect,
  onAdd,
}: {
  product: RatedProduct;
  selected: boolean;
  onSelect: () => void;
  onAdd: (product: ShopProduct) => void;
}) {
  return (
    <article
      className={`group flex h-full min-w-0 flex-col overflow-hidden rounded-[26px] border backdrop-blur-xl transition-all duration-300 ${
        selected
          ? "border-[#A9C5FF]/45 bg-[#A9C5FF]/[0.07] shadow-[0_0_0_1px_rgba(169,197,255,0.08)]"
          : "border-white/[0.10] bg-white/[0.045] hover:border-white/[0.20] hover:bg-white/[0.065]"
      }`}
    >
      {/* SELECT PRODUCT */}
      <button
        type="button"
        onClick={onSelect}
        aria-pressed={selected}
        aria-label={`Show ratings for ${product.name}`}
        className="flex min-w-0 flex-1 flex-col text-left focus-visible:outline-2 focus-visible:outline-offset-[-3px] focus-visible:outline-[#A9C5FF]"
      >
        {/* PRODUCT IMAGE */}
        <div className="relative aspect-[1.08/1] w-full overflow-hidden bg-gradient-to-br from-[#dbe3eb] via-[#c2cedb] to-[#91a6bb]">
          {product.image ? (
            <Image
              src={product.image.url}
              alt={product.image.altText || product.name}
              fill
              unoptimized
              sizes="(max-width: 640px) 82vw, (max-width: 1024px) 42vw, 320px"
              className="object-contain p-5 transition-transform duration-700 group-hover:scale-[1.06]"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-[#506d8a]">
              <ImageIcon size={40} strokeWidth={1.2} />
            </div>
          )}

          {selected && (
            <span className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full border border-white/60 bg-white/85 px-3 py-1.5 text-[10px] font-semibold text-[#172437] backdrop-blur-xl">
              <Check size={12} />
              Selected
            </span>
          )}

          {!selected && product.categories[0] && (
            <span className="absolute left-4 top-4 max-w-[calc(100%-2rem)] truncate rounded-full border border-white/50 bg-white/65 px-3 py-1.5 text-[10px] font-medium text-[#263544] backdrop-blur-xl">
              {product.categories[0].name}
            </span>
          )}
        </div>

        {/* PRODUCT INFORMATION */}
        <div className="w-full min-w-0 px-5 pt-5 sm:px-6">
          <h3 className="line-clamp-2 min-h-[48px] text-[18px] font-semibold leading-[1.3] tracking-[-0.045em] text-white">
            {product.name}
          </h3>

          <p
            className={`mt-2 text-[11px] font-medium transition-colors ${
              selected
                ? "text-[#A9C5FF]"
                : "text-white/35 group-hover:text-white/65"
            }`}
          >
            {selected ? "Viewing ratings" : "View individual ratings"}
          </p>
        </div>
      </button>

      {/* PRICE AND CART ACTION */}
      <div className="mt-auto flex items-end justify-between gap-3 px-5 pb-5 pt-6 sm:px-6 sm:pb-6">
        <div className="min-w-0">
          <span className="block text-[10px] text-white/35">
            Price
          </span>

          <span className="mt-1 block text-[19px] font-semibold tracking-[-0.045em] text-white">
            {formatPrice(product.price, product.currency)}
          </span>
        </div>

        <button
          type="button"
          onClick={() => onAdd(product)}
          aria-label={`Add ${product.name} to bag`}
          className="flex size-11 shrink-0 items-center justify-center rounded-full bg-white text-[#080E18] transition-all duration-300 hover:scale-105 hover:bg-[#dce8ff] active:scale-95"
        >
          <Plus size={19} strokeWidth={1.8} />
        </button>
      </div>
    </article>
  );
}

export default function HighestRatedSection({
  onAdd,
}: HighestRatedSectionProps) {
  const [products, setProducts] = useState<RatedProduct[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const carouselRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const controller = new AbortController();

    async function loadProducts() {
      try {
        const response = await fetch("/api/shop/highest-rated", {
          signal: controller.signal,
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error("Unable to load highest rated products.");
        }

        const result: HighestRatedResponse = await response.json();

        if (controller.signal.aborted) return;

        setProducts(result.products);
        setSelectedId(result.products[0]?.id ?? null);
      } catch (error) {
        if (controller.signal.aborted) return;

        setError(
          error instanceof Error
            ? error.message
            : "Unable to load highest rated products.",
        );
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }

    loadProducts();

    return () => controller.abort();
  }, []);

  const updateScrollState = useCallback(() => {
    const element = carouselRef.current;
    if (!element) return;

    setCanScrollLeft(element.scrollLeft > 2);
    setCanScrollRight(
      element.scrollLeft + element.clientWidth < element.scrollWidth - 2,
    );
  }, []);

  useEffect(() => {
    const element = carouselRef.current;
    if (!element) return;

    const observer = new ResizeObserver(updateScrollState);
    observer.observe(element);
    updateScrollState();

    return () => observer.disconnect();
  }, [products, loading, updateScrollState]);

  function scroll(direction: "left" | "right") {
    const element = carouselRef.current;
    if (!element) return;

    const card = element.querySelector<HTMLElement>("[data-rated-card]");
    const distance = card
      ? card.getBoundingClientRect().width + 20
      : 320;

    element.scrollBy({
      left: direction === "right" ? distance : -distance,
      behavior: "smooth",
    });
  }

  const selectedProduct =
    products.find((product) => product.id === selectedId) ?? products[0];

  if (!loading && !error && products.length === 0) {
    return null;
  }

  return (
    <section
      aria-labelledby="highest-rated-title"
      className="relative isolate w-full overflow-hidden bg-[#080E18] py-20 text-white sm:py-24 lg:py-28"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-0 top-0 h-[420px] w-[650px] rounded-full bg-[#7197ff]/[0.035] blur-[120px]"
      />

      <div className="relative mx-auto w-full max-w-[1440px] px-5 sm:px-8 lg:px-12">
        {/* HEADER */}
        <div className="mb-9 flex items-end justify-between gap-5 sm:mb-11">
          <div>
            <div className="mb-4 flex items-center gap-2">
              <Star
                size={13}
                className="fill-[#A9C5FF] text-[#A9C5FF]"
              />

              <span className="text-[10px] font-medium uppercase tracking-[0.14em] text-[#A9C5FF]/75">
                Customer favorites
              </span>
            </div>

            <h2
              id="highest-rated-title"
              className="text-[clamp(2.2rem,4.5vw,4rem)] font-semibold leading-[1.08] tracking-[-0.06em] text-white"
            >
              Highest rated<span className="text-[#A9C5FF]">.</span>
            </h2>
          </div>

          {/* CAROUSEL CONTROLS */}
          <div className="flex shrink-0 items-center gap-2">
            <button
              type="button"
              onClick={() => scroll("left")}
              disabled={loading || !canScrollLeft}
              aria-label="Scroll to previous products"
              aria-controls="highest-rated-carousel"
              className="flex size-11 items-center justify-center rounded-full border border-white/[0.12] bg-white/[0.05] text-white transition-all hover:border-white/25 hover:bg-white/[0.10] disabled:cursor-not-allowed disabled:opacity-25"
            >
              <ChevronLeft size={19} strokeWidth={1.7} />
            </button>

            <button
              type="button"
              onClick={() => scroll("right")}
              disabled={loading || !canScrollRight}
              aria-label="Scroll to next products"
              aria-controls="highest-rated-carousel"
              className="flex size-11 items-center justify-center rounded-full border border-white/[0.12] bg-white/[0.05] text-white transition-all hover:border-white/25 hover:bg-white/[0.10] disabled:cursor-not-allowed disabled:opacity-25"
            >
              <ChevronRight size={19} strokeWidth={1.7} />
            </button>
          </div>
        </div>

        {error && (
          <div
            role="alert"
            className="rounded-2xl border border-red-400/20 bg-red-400/[0.06] px-5 py-4 text-[12px] text-red-200"
          >
            {error}
          </div>
        )}

        {/* SELECTED PRODUCT RATINGS */}
        {!error && selectedProduct && (
          <FeaturedRatings product={selectedProduct} />
        )}

        {/* RATINGS PANEL SKELETON */}
        {!error && loading && (
          <div className="mb-8 h-[290px] animate-pulse rounded-[28px] border border-white/[0.10] bg-white/[0.045] sm:h-[240px]" />
        )}

        {/* CAROUSEL */}
        {!error && (
          <div
            id="highest-rated-carousel"
            ref={carouselRef}
            onScroll={updateScrollState}
            aria-label="Highest rated products"
            className="flex snap-x snap-mandatory gap-5 overflow-x-auto overscroll-x-contain scroll-smooth pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {loading
              ? Array.from({ length: 4 }, (_, index) => (
                  <div
                    key={index}
                    className="h-[390px] w-[82%] shrink-0 animate-pulse rounded-[26px] border border-white/[0.10] bg-white/[0.045] sm:w-[calc((100%-20px)/2)] lg:w-[calc((100%-40px)/3)] xl:w-[calc((100%-60px)/4)]"
                  />
                ))
              : products.map((product) => (
                  <div
                    key={product.id}
                    data-rated-card
                    className="w-[82%] shrink-0 snap-start sm:w-[calc((100%-20px)/2)] lg:w-[calc((100%-40px)/3)] xl:w-[calc((100%-60px)/4)]"
                  >
                    <RatedProductCard
                      product={product}
                      selected={selectedProduct?.id === product.id}
                      onSelect={() => setSelectedId(product.id)}
                      onAdd={onAdd}
                    />
                  </div>
                ))}
          </div>
        )}

        {!loading && !error && (
          <p className="mt-5 text-[11px] text-white/35">
            Select a product to compare its individual ratings.
          </p>
        )}
      </div>
    </section>
  );
}