"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, ChevronRight, Package, RefreshCw } from "lucide-react";

import { useStore } from "../home/StoreLayout";
import type { ShopProduct } from "../home/ShopSection";

import HeroProduct from "./HeroProduct";
import VideoProduct from "./VideoProduct";
import RatingsProduct from "./RatingsProduct";
import DescriptionSection from "./DescriptionSection";

export type ProductDetailImage = {
  id: string;
  altText: string | null;
  isPrimary: boolean;
  url: string;
};

export type ProductDetailVariant = {
  id: string;
  sku: string;
  name: string | null;
  size: string | null;
  color: string | null;
  price: number | null;
};

export type ProductDetail = ShopProduct & {
  instagramVideoUrl: string | null;
  dailyUseRating: number | null;
  reliabilityRating: number | null;
  qualityRating: number | null;
  recommendRating: number | null;
  images: ProductDetailImage[];
  variants: ProductDetailVariant[];
  createdAt: string;
};

type ProductDetailsResponse = {
  product: ProductDetail;
};

type Props = {
  slug: string;
};

export default function ProductDetailsClient({ slug }: Props) {
  const { addToCart } = useStore();

  const [product, setProduct] = useState<ProductDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    const controller = new AbortController();

    async function loadProduct() {
      setLoading(true);
      setError(null);
      setNotFound(false);
      setProduct(null);

      try {
        const response = await fetch(
          `/api/shop/products/${encodeURIComponent(slug)}`,
          {
            signal: controller.signal,
            cache: "no-store",
          },
        );

        if (response.status === 404) {
          if (!controller.signal.aborted) setNotFound(true);
          return;
        }

        if (!response.ok) {
          throw new Error("Unable to load this product. Please try again.");
        }

        const result: ProductDetailsResponse = await response.json();

        if (!controller.signal.aborted) {
          setProduct(result.product);
        }
      } catch (error) {
        if (controller.signal.aborted) return;

        setError(
          error instanceof Error
            ? error.message
            : "Unable to load this product.",
        );
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }

    loadProduct();

    return () => controller.abort();
  }, [slug, refreshKey]);

  if (notFound) {
    return (
      <main className="flex min-h-[75svh] flex-col items-center justify-center bg-[#080E18] px-5 py-20 text-center text-white">
        <div className="mb-6 flex size-16 items-center justify-center rounded-[22px] border border-white/10 bg-white/[0.05]">
          <Package size={27} strokeWidth={1.4} className="text-[#A9C5FF]" />
        </div>

        <h1 className="text-[32px] font-semibold tracking-[-0.055em]">
          Product not found.
        </h1>

        <p className="mt-3 max-w-sm text-[13px] leading-relaxed text-white/45">
          This product is currently unavailable.
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

  return (
    <main className="relative isolate min-h-screen w-full overflow-hidden bg-[#080E18] text-white">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
      >
        <div className="absolute -left-[350px] -top-[350px] size-[850px] rounded-full bg-[#5277ca]/[0.06] blur-[150px]" />
        <div className="absolute -right-[300px] top-[650px] size-[700px] rounded-full bg-[#7197ff]/[0.04] blur-[150px]" />
      </div>

      <div className="mx-auto w-full max-w-[1440px] px-5 pb-24 pt-10 sm:px-8 lg:px-12 lg:pt-14">
        {/* BREADCRUMBS */}
        <nav
          aria-label="Breadcrumb"
          className="mb-10 flex min-w-0 items-center gap-2 text-[11px]"
        >
          <Link
            href="/"
            className="shrink-0 text-white/40 transition-colors hover:text-white"
          >
            Home
          </Link>

          <ChevronRight size={12} className="shrink-0 text-white/20" />

          <Link
            href="/#shop"
            className="shrink-0 text-white/40 transition-colors hover:text-white"
          >
            Shop
          </Link>

          {product?.categories[0] && (
            <>
              <ChevronRight size={12} className="shrink-0 text-white/20" />

              <Link
                href={`/shop/${encodeURIComponent(product.categories[0].slug)}`}
                className="shrink-0 text-white/40 transition-colors hover:text-white"
              >
                {product.categories[0].name}
              </Link>
            </>
          )}

          <ChevronRight size={12} className="shrink-0 text-white/20" />

          <span className="min-w-0 truncate font-medium text-[#A9C5FF]">
            {product?.name ?? "Product"}
          </span>
        </nav>

        {/* LOADING */}
        {loading && (
          <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
            <div className="aspect-square animate-pulse rounded-[30px] border border-white/[0.09] bg-white/[0.05]" />

            <div className="space-y-6 pt-4">
              <div className="h-5 w-24 animate-pulse rounded-full bg-white/[0.08]" />
              <div className="h-16 w-4/5 animate-pulse rounded-xl bg-white/[0.08]" />
              <div className="h-5 w-3/5 animate-pulse rounded-lg bg-white/[0.06]" />
              <div className="h-12 w-40 animate-pulse rounded-lg bg-white/[0.08]" />
              <div className="h-14 w-full animate-pulse rounded-full bg-white/[0.08]" />
            </div>
          </div>
        )}

        {/* ERROR */}
        {!loading && error && (
          <div
            role="alert"
            className="flex min-h-[360px] flex-col items-center justify-center rounded-[28px] border border-red-400/20 bg-red-400/[0.04] px-6 py-12 text-center"
          >
            <Package size={30} strokeWidth={1.4} className="text-red-200/70" />

            <p className="mt-5 text-[14px] text-red-200">
              {error}
            </p>

            <button
              type="button"
              onClick={() => setRefreshKey((current) => current + 1)}
              className="mt-6 inline-flex min-h-11 items-center gap-2 rounded-full border border-white/15 bg-white/[0.07] px-5 text-[12px] font-medium text-white transition-colors hover:bg-white/[0.12]"
            >
              <RefreshCw size={14} />
              Try again
            </button>
          </div>
        )}

        {/* PRODUCT CONTENT */}
        {!loading && !error && product && (
          <>
            <HeroProduct
              product={product}
              onOrder={() => addToCart(product)}
            />

            <div className="mt-20 space-y-20 sm:mt-24 sm:space-y-24">
              <VideoProduct
                instagramVideoUrl={product.instagramVideoUrl}
                productName={product.name}
              />

              <RatingsProduct product={product} />

              <DescriptionSection product={product} />
            </div>

            <div className="mt-20 flex items-center justify-center border-t border-white/[0.08] pt-8">
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
          </>
        )}
      </div>
    </main>
  );
}