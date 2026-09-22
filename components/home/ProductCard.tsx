"use client";

import Image from "next/image";
import Link from "next/link";
import { ImageIcon, Plus, Star } from "lucide-react";

import type { ShopProduct } from "./ShopSection";

type ProductCardProps = {
  product: ShopProduct;
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

export default function ProductCard({ product, onAdd }: ProductCardProps) {
  const primaryCategory = product.categories[0];

  return (
    <article className="group relative flex min-w-0 flex-col overflow-hidden rounded-[28px] border border-white/[0.10] bg-white/[0.045] shadow-[0_12px_40px_rgba(0,0,0,0.08)] backdrop-blur-xl transition-all duration-500 hover:-translate-y-1 hover:border-white/[0.20] hover:bg-white/[0.07] hover:shadow-[0_24px_70px_rgba(0,0,0,0.18)]">

      {/* PRODUCT DETAILS LINK */}
      <Link
        href={`/products/${encodeURIComponent(product.slug)}`}
        aria-label={`View ${product.name}`}
        className="absolute inset-0 z-10 rounded-[28px] focus-visible:outline-2 focus-visible:outline-offset-[-3px] focus-visible:outline-[#A9C5FF]"
      >
        <span className="sr-only">View {product.name}</span>
      </Link>

      {/* PRODUCT IMAGE */}
      <div className="relative aspect-[1/1.08] overflow-hidden bg-gradient-to-br from-[#dbe3eb] via-[#c2cedb] to-[#91a6bb]">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_35%,rgba(255,255,255,0.5),transparent_65%)]" />

        {product.image ? (
          <Image
            src={product.image.url}
            alt={product.image.altText || product.name}
            fill
            unoptimized
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
            className="object-contain p-5 transition-transform duration-700 ease-out group-hover:scale-[1.06]"
          />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-[#506d8a]">
            <ImageIcon size={42} strokeWidth={1.2} />
            <span className="text-[11px] font-medium">Image coming soon</span>
          </div>
        )}

        {primaryCategory && (
          <div className="absolute left-4 top-4 z-10">
            <span className="inline-flex min-h-7 items-center rounded-full border border-white/50 bg-white/50 px-3 text-[10px] font-semibold tracking-[-0.01em] text-[#263544] shadow-[0_4px_15px_rgba(0,0,0,0.04)] backdrop-blur-xl">
              {primaryCategory.name}
            </span>
          </div>
        )}

        {product.overallRating !== null && (
          <div className="absolute bottom-4 left-4 z-10">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-white/30 bg-white/55 px-3 py-1.5 text-[10px] font-semibold text-[#263544] backdrop-blur-xl">
              <Star size={11} className="fill-[#506d8a] text-[#506d8a]" />
              {product.overallRating.toFixed(1)}/10
            </span>
          </div>
        )}

        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[#080E18]/10 to-transparent" />
      </div>

      {/* PRODUCT INFORMATION */}
      <div className="flex flex-1 flex-col px-5 pb-5 pt-6 sm:px-6 sm:pb-6">
        <div className="mb-3 flex items-center gap-2">
          <span className="size-1.5 rounded-full bg-[#A9C5FF]" />

          <span className="text-[10px] font-medium tracking-[0.03em] text-white/45">
            {primaryCategory?.name || "Curated collection"}
          </span>
        </div>

        <h3 className="text-[19px] font-semibold leading-[1.2] tracking-[-0.045em] text-white sm:text-[20px]">
          {product.name}
        </h3>

        <p className="mt-3 line-clamp-2 min-h-[42px] flex-1 text-[12px] leading-[1.7] tracking-[-0.01em] text-white/45">
          {product.shortDescription || product.description}
        </p>

        <div className="my-5 h-px w-full bg-white/[0.08]" />

        {/* PRICE AND ACTION */}
        <div className="flex items-center justify-between gap-3">
          <div>
            <span className="mb-1 block text-[10px] font-medium text-white/35">
              Price
            </span>

            <span className="text-[19px] font-semibold tracking-[-0.045em] text-white">
              {formatPrice(product.price, product.currency)}
            </span>
          </div>

          {/* ADD TO BAG — DOES NOT NAVIGATE */}
          <button
            type="button"
            onClick={() => onAdd(product)}
            aria-label={`Add ${product.name} to bag`}
            className="relative z-20 flex size-11 shrink-0 items-center justify-center rounded-full bg-white text-[#080E18] shadow-[0_6px_20px_rgba(255,255,255,0.08)] transition-all duration-300 hover:scale-105 hover:bg-[#edf2ff] hover:shadow-[0_10px_30px_rgba(255,255,255,0.15)] active:scale-95"
          >
            <Plus size={20} strokeWidth={1.7} />
          </button>
        </div>
      </div>

      <div className="pointer-events-none absolute inset-x-10 top-0 z-20 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent" />
    </article>
  );
}