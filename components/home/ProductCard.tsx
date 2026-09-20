"use client";

import { Plus, ArrowUpRight } from "lucide-react";

import ProductObject from "./ProductObject";
import type { Product } from "./types";
import { formatPrice } from "./utils";

type ProductCardProps = {
  product: Product;
  onAdd: (product: Product) => void;
};

const VISUAL_BACKGROUNDS: Record<Product["tone"], string> = {
  "visual-one": "from-[#dbe3eb] via-[#c2cedb] to-[#91a6bb]",
  "visual-two": "from-[#e4eaf0] via-[#cbd6e0] to-[#a0b2c4]",
  "visual-three": "from-[#d4dfe9] via-[#aebfce] to-[#778fa5]",
  "visual-four": "from-[#e5e9e7] via-[#cbd6d1] to-[#a5b9b0]",
};

export default function ProductCard({ product, onAdd }: ProductCardProps) {
  const visualBackground = VISUAL_BACKGROUNDS[product.tone] ?? VISUAL_BACKGROUNDS["visual-one"];

  return (
    <article className="group relative flex min-w-0 flex-col overflow-hidden rounded-[28px] border border-white/[0.10] bg-white/[0.045] shadow-[0_12px_40px_rgba(0,0,0,0.08)] backdrop-blur-xl transition-all duration-500 hover:-translate-y-1 hover:border-white/[0.20] hover:bg-white/[0.07] hover:shadow-[0_24px_70px_rgba(0,0,0,0.18)]">

      {/* PRODUCT VISUAL */}
      <div className={`relative aspect-[1/1.08] overflow-hidden bg-gradient-to-br ${visualBackground}`}>

        {/* BACKGROUND ILLUMINATION */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_35%,rgba(255,255,255,0.65),transparent_65%)]" />

        {/* SOFT TEXTURE */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/20 via-transparent to-[#080E18]/10" />

        {/* PRODUCT LABEL */}
        <div className="absolute left-4 top-4 z-10">
          <span className="inline-flex min-h-7 items-center rounded-full border border-white/50 bg-white/40 px-3 text-[10px] font-semibold tracking-[-0.01em] text-[#263544] shadow-[0_4px_15px_rgba(0,0,0,0.04)] backdrop-blur-xl">
            {product.label}
          </span>
        </div>

        {/* PRODUCT OBJECT */}
        <div className="absolute inset-0 transition-transform duration-700 ease-out group-hover:scale-[1.06]">
          <ProductObject type={product.visual} />
        </div>

        {/* BOTTOM GLASS OVERLAY */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-[#080E18]/10 to-transparent" />

        {/* SERIES INDICATOR */}
        <div className="absolute bottom-4 left-4 z-10">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-white/30 bg-white/25 px-3 py-1.5 text-[9px] font-medium tracking-[0.02em] text-[#263544] backdrop-blur-xl">
            <span className="size-1 rounded-full bg-[#506d8a]" />
            {product.series}
          </span>
        </div>
      </div>

      {/* PRODUCT INFORMATION */}
      <div className="flex flex-1 flex-col px-5 pb-5 pt-6 sm:px-6 sm:pb-6">

        {/* STATUS */}
        <div className="mb-3 flex items-center gap-2">
          <span className="size-1.5 rounded-full bg-[#A9C5FF]" />

          <span className="text-[10px] font-medium tracking-[0.03em] text-white/45">
            {product.status}
          </span>
        </div>

        {/* PRODUCT NAME */}
        <h3 className="text-[19px] font-semibold leading-[1.2] tracking-[-0.045em] text-white sm:text-[20px]">
          {product.name}
        </h3>

        {/* DESCRIPTION */}
        <p className="mt-3 line-clamp-2 min-h-[42px] flex-1 text-[12px] leading-[1.7] tracking-[-0.01em] text-white/45">
          {product.description}
        </p>

        {/* BOTTOM DIVIDER */}
        <div className="my-5 h-px w-full bg-white/[0.08]" />

        {/* PRICE AND ACTION */}
        <div className="flex items-center justify-between gap-3">

          <div>
            <span className="mb-1 block text-[10px] font-medium text-white/35">
              Price
            </span>

            <span className="text-[19px] font-semibold tracking-[-0.045em] text-white">
              {formatPrice(product.price)}
            </span>
          </div>

          {/* ADD TO BAG */}
          <button
            type="button"
            onClick={() => onAdd(product)}
            aria-label={`Add ${product.name} to bag`}
            className="flex size-11 shrink-0 items-center justify-center rounded-full bg-white text-[#080E18] shadow-[0_6px_20px_rgba(255,255,255,0.08)] transition-all duration-300 hover:scale-105 hover:bg-[#edf2ff] hover:shadow-[0_10px_30px_rgba(255,255,255,0.15)] active:scale-95"
          >
            <Plus size={20} strokeWidth={1.7} />
          </button>
        </div>
      </div>

      {/* SUBTLE GLASS HIGHLIGHT */}
      <div className="pointer-events-none absolute inset-x-10 top-0 z-20 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent" />
    </article>
  );
}