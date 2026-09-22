"use client";

import Link from "next/link";
import {
  ArrowUpRight,
  Box,
  Layers3,
  Package,
  Tag,
} from "lucide-react";

import type { ProductDetail } from "./ProductDetailsClient";

type Props = {
  product: ProductDetail;
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

export default function DescriptionSection({ product }: Props) {
  return (
    <section aria-labelledby="product-description-title">
      {/* HEADER */}
      <div className="mb-8">
        <div className="mb-4 flex items-center gap-2">
          <Box size={13} className="text-[#A9C5FF]" />

          <span className="text-[10px] font-medium uppercase tracking-[0.14em] text-[#A9C5FF]/75">
            Product information
          </span>
        </div>

        <h2
          id="product-description-title"
          className="text-[clamp(2rem,4vw,3.6rem)] font-semibold leading-[1.1] tracking-[-0.06em] text-white"
        >
          Everything you need to know
          <span className="text-[#A9C5FF]">.</span>
        </h2>
      </div>

      <div className="grid gap-5 lg:grid-cols-[1.3fr_0.7fr]">
        {/* DESCRIPTION */}
        <div className="rounded-[28px] border border-white/[0.10] bg-white/[0.045] p-6 backdrop-blur-xl sm:p-8 lg:p-10">
          <div className="mb-7 flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-2xl border border-[#A9C5FF]/15 bg-[#A9C5FF]/10">
              <Package size={18} strokeWidth={1.6} className="text-[#A9C5FF]" />
            </div>

            <h3 className="text-[18px] font-semibold tracking-[-0.04em] text-white">
              About this product
            </h3>
          </div>

          <div className="space-y-5 text-[13px] leading-[1.9] text-white/55 sm:text-[14px]">
            {product.description
              .split(/\n{2,}/)
              .map((paragraph) => paragraph.trim())
              .filter(Boolean)
              .map((paragraph, index) => (
                <p key={index} className="whitespace-pre-line">
                  {paragraph}
                </p>
              ))}
          </div>
        </div>

        {/* PRODUCT DETAILS */}
        <div className="flex flex-col gap-5">
          {/* CATEGORIES */}
          <div className="rounded-[28px] border border-white/[0.10] bg-white/[0.045] p-6 backdrop-blur-xl sm:p-8">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-2xl border border-[#A9C5FF]/15 bg-[#A9C5FF]/10">
                <Layers3 size={18} strokeWidth={1.6} className="text-[#A9C5FF]" />
              </div>

              <h3 className="text-[17px] font-semibold tracking-[-0.04em] text-white">
                Categories
              </h3>
            </div>

            {product.categories.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {product.categories.map((category) => (
                  <Link
                    key={category.id}
                    href={`/shop/${encodeURIComponent(category.slug)}`}
                    className="group inline-flex min-h-10 items-center gap-2 rounded-full border border-white/[0.12] bg-white/[0.05] px-4 text-[11px] font-medium text-white/65 transition-colors hover:border-[#A9C5FF]/35 hover:bg-[#A9C5FF]/[0.08] hover:text-white"
                  >
                    {category.name}

                    <ArrowUpRight
                      size={13}
                      className="text-white/35 transition-colors group-hover:text-[#A9C5FF]"
                    />
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-[12px] text-white/40">
                Part of the quickshipgo collection.
              </p>
            )}
          </div>

          {/* PRODUCT OPTIONS */}
          <div className="rounded-[28px] border border-white/[0.10] bg-white/[0.045] p-6 backdrop-blur-xl sm:p-8">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-2xl border border-[#C3ADFF]/15 bg-[#C3ADFF]/10">
                <Tag size={18} strokeWidth={1.6} className="text-[#C3ADFF]" />
              </div>

              <h3 className="text-[17px] font-semibold tracking-[-0.04em] text-white">
                Available options
              </h3>
            </div>

            {product.variants.length > 0 ? (
              <div className="space-y-3">
                {product.variants.map((variant) => {
                  const optionName =
                    variant.name ||
                    [variant.size, variant.color].filter(Boolean).join(" · ") ||
                    "Standard option";

                  return (
                    <div
                      key={variant.id}
                      className="rounded-2xl border border-white/[0.08] bg-white/[0.035] p-4"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="min-w-0">
                          <p className="text-[12px] font-medium text-white/85">
                            {optionName}
                          </p>

                          {(variant.size || variant.color) && (
                            <p className="mt-1.5 text-[11px] text-white/40">
                              {[variant.size, variant.color]
                                .filter(Boolean)
                                .join(" · ")}
                            </p>
                          )}

                          <p className="mt-2 text-[10px] text-white/30">
                            SKU: {variant.sku}
                          </p>
                        </div>

                        {variant.price !== null &&
                          variant.price !== product.price && (
                            <span className="shrink-0 text-[12px] font-semibold text-white">
                              {formatPrice(variant.price, product.currency)}
                            </span>
                          )}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-[12px] text-white/40">
                Standard product. No additional options are listed.
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}