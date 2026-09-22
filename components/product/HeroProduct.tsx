"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  ImageIcon,
  ShoppingBag,
} from "lucide-react";

import type {
  ProductDetail,
  ProductDetailImage,
} from "./ProductDetailsClient";

type Props = {
  product: ProductDetail;
  onOrder: () => void;
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

export default function HeroProduct({ product, onOrder }: Props) {
  const [selectedImageId, setSelectedImageId] = useState<string | null>(
    product.images[0]?.id ?? null,
  );

  useEffect(() => {
    setSelectedImageId(product.images[0]?.id ?? null);
  }, [product.id, product.images]);

  const selectedIndex = Math.max(
    0,
    product.images.findIndex((image) => image.id === selectedImageId),
  );

  const selectedImage: ProductDetailImage | undefined =
    product.images[selectedIndex];

  function changeImage(direction: -1 | 1) {
    if (product.images.length < 2) return;

    const nextIndex =
      (selectedIndex + direction + product.images.length) %
      product.images.length;

    setSelectedImageId(product.images[nextIndex].id);
  }

  return (
    <section
      aria-labelledby="product-title"
      className="grid min-w-0 gap-10 lg:grid-cols-2 lg:items-start lg:gap-12 xl:gap-16"
    >
      {/* IMAGE GALLERY */}
      <div className="min-w-0">
        <div className="group relative aspect-square overflow-hidden rounded-[30px] border border-white/[0.12] bg-gradient-to-br from-[#dbe3eb] via-[#c2cedb] to-[#91a6bb] shadow-[0_25px_90px_rgba(0,0,0,0.12)]">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_35%,rgba(255,255,255,0.55),transparent_65%)]" />

          {selectedImage ? (
            <Image
              key={selectedImage.id}
              src={selectedImage.url}
              alt={selectedImage.altText || product.name}
              fill
              unoptimized
              priority={selectedIndex === 0}
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-contain p-6 sm:p-10"
            />
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-[#506d8a]">
              <ImageIcon size={48} strokeWidth={1.2} />

              <span className="text-[12px] font-medium">
                Image coming soon
              </span>
            </div>
          )}

          {product.images.length > 1 && (
            <>
              {/* IMAGE COUNT */}
              <div className="absolute left-5 top-5 rounded-full border border-white/50 bg-white/65 px-3 py-1.5 text-[11px] font-medium text-[#263544] backdrop-blur-xl">
                {selectedIndex + 1} / {product.images.length}
              </div>

              {/* PREVIOUS IMAGE */}
              <button
                type="button"
                onClick={() => changeImage(-1)}
                aria-label="Previous product image"
                className="absolute left-4 top-1/2 flex size-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/50 bg-white/65 text-[#263544] backdrop-blur-xl transition-all hover:bg-white"
              >
                <ChevronLeft size={18} strokeWidth={1.7} />
              </button>

              {/* NEXT IMAGE */}
              <button
                type="button"
                onClick={() => changeImage(1)}
                aria-label="Next product image"
                className="absolute right-4 top-1/2 flex size-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/50 bg-white/65 text-[#263544] backdrop-blur-xl transition-all hover:bg-white"
              >
                <ChevronRight size={18} strokeWidth={1.7} />
              </button>
            </>
          )}
        </div>

        {/* THUMBNAILS */}
        {product.images.length > 1 && (
          <div
            role="group"
            aria-label="Product image gallery"
            className="mt-4 flex gap-3 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {product.images.map((image, index) => {
              const selected = image.id === selectedImage?.id;

              return (
                <button
                  key={image.id}
                  type="button"
                  onClick={() => setSelectedImageId(image.id)}
                  aria-label={`View product image ${index + 1}`}
                  aria-pressed={selected}
                  className={`relative aspect-square w-[76px] shrink-0 overflow-hidden rounded-2xl border-2 bg-[#cbd6e0] transition-all duration-300 sm:w-[88px] ${
                    selected
                      ? "border-[#A9C5FF] shadow-[0_0_0_3px_rgba(169,197,255,0.08)]"
                      : "border-white/[0.10] opacity-65 hover:border-white/35 hover:opacity-100"
                  }`}
                >
                  <Image
                    src={image.url}
                    alt={image.altText || `${product.name} image ${index + 1}`}
                    fill
                    unoptimized
                    sizes="88px"
                    className="object-contain p-1.5"
                  />
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* PRODUCT DETAILS */}
      <div className="flex min-w-0 flex-col lg:pt-5">
        {/* CATEGORIES */}
        {product.categories.length > 0 && (
          <div className="mb-6 flex flex-wrap items-center gap-2">
            {product.categories.map((category) => (
              <Link
                key={category.id}
                href={`/shop/${encodeURIComponent(category.slug)}`}
                className="inline-flex min-h-8 items-center rounded-full border border-[#A9C5FF]/20 bg-[#A9C5FF]/[0.07] px-3 text-[10px] font-medium text-[#A9C5FF] transition-colors hover:border-[#A9C5FF]/40 hover:bg-[#A9C5FF]/[0.12]"
              >
                {category.name}
              </Link>
            ))}
          </div>
        )}

        {/* NAME */}
        <h1
          id="product-title"
          className="max-w-[650px] text-[clamp(2.6rem,4.5vw,4.7rem)] font-semibold leading-[1.06] tracking-[-0.065em] text-white"
        >
          {product.name}
        </h1>

        {/* SHORT DESCRIPTION */}
        {product.shortDescription && (
          <p className="mt-6 max-w-[540px] text-[14px] leading-[1.85] text-white/50 sm:text-[15px]">
            {product.shortDescription}
          </p>
        )}

        {/* PRICE */}
        <div className="mt-10 border-t border-white/[0.09] pt-8">
          <span className="block text-[11px] font-medium text-white/40">
            Price
          </span>

          <div className="mt-2 flex flex-wrap items-baseline gap-3">
            <span className="text-[clamp(2.4rem,3.5vw,3.5rem)] font-semibold leading-none tracking-[-0.065em] text-white">
              {formatPrice(product.price, product.currency)}
            </span>

            {product.variants.some(
              (variant) => variant.price !== null &&
                variant.price !== product.price,
            ) && (
              <span className="text-[11px] text-white/35">
                Base price · Options may vary
              </span>
            )}
          </div>
        </div>

        {/* ORDER BUTTON */}
        <div className="mt-9">
          <button
            type="button"
            onClick={onOrder}
            className="group flex min-h-[56px] w-full items-center justify-center gap-3 rounded-full bg-white px-7 text-[13px] font-semibold text-[#080E18] shadow-[0_8px_32px_rgba(255,255,255,0.06)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#dce8ff] hover:shadow-[0_12px_40px_rgba(255,255,255,0.12)] active:scale-[0.99]"
          >
            <ShoppingBag size={18} strokeWidth={1.7} />

            Order now

            <ArrowRight
              size={17}
              strokeWidth={1.7}
              className="transition-transform group-hover:translate-x-1"
            />
          </button>

          <p className="mt-3 text-center text-[11px] text-white/35">
            Review your order in your shopping bag.
          </p>
        </div>

        {/* QUICK INFO */}
        <div className="mt-10 grid grid-cols-2 gap-3 border-t border-white/[0.09] pt-7">
          <div className="rounded-2xl border border-white/[0.08] bg-white/[0.035] p-4">
            <span className="block text-[10px] text-white/35">
              Collection
            </span>

            <span className="mt-2 block truncate text-[12px] font-medium text-white/85">
              {product.categories[0]?.name || "quickshipgo"}
            </span>
          </div>

          <div className="rounded-2xl border border-white/[0.08] bg-white/[0.035] p-4">
            <span className="block text-[10px] text-white/35">
              Product options
            </span>

            <span className="mt-2 block text-[12px] font-medium text-white/85">
              {product.variants.length > 0
                ? `${product.variants.length} available`
                : "Standard product"}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}