"use client";

import ProductObject from "./ProductObject";
import type { Product } from "./types";
import { formatPrice } from "./utils";

type ProductCardProps = {
  product: Product;
  onAdd: (product: Product) => void;
};

const VISUAL_BACKGROUNDS: Record<Product["tone"], string> = {
  "visual-one": "bg-[#dfe5ea]",
  "visual-two": "bg-[#e8ecef]",
  "visual-three": "bg-[#d9e2ea]",
  "visual-four": "bg-[#e3e8e6]",
};

export default function ProductCard({ product, onAdd }: ProductCardProps) {
  return (
    <article className="flex min-w-0 flex-col border-[#1c242b] bg-white max-md:border-b-2 max-md:even:border-r-0 md:border-r-2 md:[&:nth-child(2n)]:border-r-0 lg:[&:nth-child(2n)]:border-r-2 lg:[&:nth-child(4n)]:border-r-0">
      <div className={`relative aspect-[1/1.06] overflow-hidden border-b-2 border-[#1c242b] ${VISUAL_BACKGROUNDS[product.tone] ?? "bg-[#dfe5ea]"}`}>
        <span className="absolute top-[13px] left-[13px] z-10 border-2 border-[#1c242b] bg-[#d8e4ff] px-[7px] py-[5px] font-mono text-[9px]">{product.label}</span>
        <ProductObject type={product.visual} />
      </div>
      <div className="flex flex-1 flex-col p-[11px] md:p-[15px]">
        <div className="flex justify-between gap-2.5 font-mono text-[9px] text-[#66727d]">
          <span>{product.series}</span>
          <span>{product.status}</span>
        </div>
        <h3 className="my-2 text-sm font-semibold tracking-[-0.045em] md:text-[17px]">{product.name}</h3>
        <p className="mb-4 flex-1 text-[10px] leading-[1.4] text-[#66727d] md:text-[11px]">{product.description}</p>
        <div className="flex items-center justify-between gap-2.5">
          <span className="font-mono text-[11px] font-medium md:text-[13px]">{formatPrice(product.price)}</span>
          <button type="button" onClick={() => onAdd(product)} aria-label={`Add ${product.name} to bag`} className="border-2 border-[#1c242b] bg-[#2f6fed] px-2 py-2 text-[9px] font-bold shadow-[3px_3px_0_#1c242b] transition-transform hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[1px_1px_0_#1c242b] md:px-2.5 md:text-[10px]">ADD +</button>
        </div>
      </div>
    </article>
  );
}
