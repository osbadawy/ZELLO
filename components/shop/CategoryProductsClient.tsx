"use client";

import {
  useMemo,
  useState,
} from "react";

import Image from "next/image";
import Link from "next/link";

export type CategoryOption = {
  id: string;
  name: string;
  slug: string;
};

export type CategoryProduct = {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: string;
  currency: string;
  imageId: string | null;
};

type CategoryProductsClientProps = {
  category: CategoryOption;
  categories: CategoryOption[];
  products: CategoryProduct[];
};

export default function CategoryProductsClient({
  category,
  categories,
  products,
}: CategoryProductsClientProps) {
  const [searchQuery, setSearchQuery] =
    useState("");

  const filteredProducts = useMemo(() => {
    const query = searchQuery
      .trim()
      .toLowerCase();

    if (!query) return products;

    return products.filter((product) =>
      `${product.name} ${product.description}`
        .toLowerCase()
        .includes(query),
    );
  }, [products, searchQuery]);

  function formatPrice(
    price: string,
    currency: string,
  ) {
    try {
      return new Intl.NumberFormat("en", {
        style: "currency",
        currency,
      }).format(Number(price));
    } catch {
      return `${price} ${currency}`;
    }
  }

  return (
    <section
      id="products"
      aria-labelledby="products-title"
      className="mx-auto w-[calc(100%-20px)] max-w-[1440px] scroll-mt-28 border-x-2 border-b-2 border-[#1c242b] bg-white sm:w-[calc(100%-32px)]"
    >
      {/* RESULTS HEADER */}

      <div className="flex flex-col gap-6 border-b-2 border-[#1c242b] px-5 py-8 sm:flex-row sm:items-end sm:justify-between sm:px-8 sm:py-10">
        <div>
          <div className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.12em] text-[#66727d]">
            <span className="size-2 bg-[#2f6fed]" />

            01 / CURRENT INVENTORY
          </div>

          <h1
            id="products-title"
            className="mt-4 text-[clamp(40px,6vw,80px)] leading-[0.9] font-bold tracking-[-0.09em] uppercase"
          >
            {category.name}
            <span className="text-[#2f6fed]">
              .
            </span>
          </h1>

          <p className="mt-4 font-mono text-[12px] text-[#66727d]">
            {filteredProducts.length}{" "}
            {filteredProducts.length === 1
              ? "OBJECT"
              : "OBJECTS"}{" "}
            AVAILABLE
          </p>
        </div>

        <Link
          href="/shop"
          className="w-fit border-b-2 border-[#1c242b] pb-1 text-[11px] font-semibold uppercase tracking-[0.06em] transition-colors hover:border-[#2f6fed] hover:text-[#2f6fed]"
        >
          VIEW ALL CATEGORIES ↗
        </Link>
      </div>

      {/* CATEGORY FILTERS AND SEARCH */}

      <div className="flex flex-col gap-5 border-b-2 border-[#1c242b] bg-[#e5e9ed] px-5 py-5 lg:flex-row lg:items-center lg:justify-between">
        <div
          role="group"
          aria-label="Browse product categories"
          className="flex flex-wrap gap-2"
        >
          {categories.map((item) => {
            const isActive =
              item.id === category.id;

            return (
              <Link
                key={item.id}
                href={`/shop/${item.slug}`}
                aria-current={
                  isActive ? "page" : undefined
                }
                className={[
                  "border border-[#1c242b] px-3 py-2 font-mono text-[10px] uppercase tracking-[0.04em]",
                  "transition-colors hover:bg-[#1c242b] hover:text-white",
                  isActive
                    ? "bg-[#1c242b] text-white"
                    : "bg-transparent text-[#1c242b]",
                ].join(" ")}
              >
                {item.name}
              </Link>
            );
          })}
        </div>

        {/* SEARCH */}

        <label className="flex min-h-10 w-full items-center gap-3 border-b-2 border-[#1c242b] lg:max-w-[260px]">
          <span
            aria-hidden="true"
            className="font-mono text-lg"
          >
            ⌕
          </span>

          <span className="sr-only">
            Search products
          </span>

          <input
            type="search"
            value={searchQuery}
            onChange={(event) =>
              setSearchQuery(
                event.target.value,
              )
            }
            placeholder="SEARCH INVENTORY..."
            className="w-full bg-transparent py-2 font-mono text-[10px] outline-none placeholder:text-[#66727d]"
          />
        </label>
      </div>

      {/* PRODUCT GRID */}

      <div className="grid grid-cols-2 gap-px bg-[#1c242b] lg:grid-cols-4">
        {filteredProducts.map((product) => (
          <article
            key={product.id}
            className="group flex min-w-0 flex-col bg-white"
          >
            {/* PRODUCT IMAGE */}

            <Link
              href={`/products/${product.slug}`}
              aria-label={`View ${product.name}`}
              className="relative block aspect-square overflow-hidden bg-[#e5e9ed]"
            >
              {product.imageId ? (
                <Image
                  src={`/api/product-images/${product.imageId}`}
                  alt={product.name}
                  fill
                  unoptimized
                  sizes="(max-width: 1024px) 50vw, 25vw"
                  className="object-contain p-6 transition-transform duration-500 group-hover:scale-105"
                />
              ) : (
                <div className="flex h-full items-center justify-center bg-[radial-gradient(circle_at_65%_40%,#c8d8ff,#e5e9ed_65%)]">
                  <span className="font-mono text-[10px] tracking-[0.15em] text-[#66727d]">
                    NO IMAGE AVAILABLE
                  </span>
                </div>
              )}

              <span className="absolute top-3 left-3 border border-[#1c242b] bg-white px-2 py-1 font-mono text-[9px] uppercase tracking-[0.08em]">
                P/L — {category.slug}
              </span>
            </Link>

            {/* PRODUCT INFORMATION */}

            <div className="flex flex-1 flex-col p-4 sm:p-5">
              <div className="mb-3 font-mono text-[10px] uppercase tracking-[0.1em] text-[#66727d]">
                PENTA LABS / COLLECTION
              </div>

              <h2 className="text-[clamp(15px,1.5vw,21px)] font-bold tracking-[-0.05em]">
                {product.name}
              </h2>

              <p className="mt-2 line-clamp-2 text-[12px] leading-[1.6] text-[#66727d]">
                {product.description}
              </p>

              {/* PRICE AND PRODUCT LINK */}

              <div className="mt-auto flex flex-wrap items-center justify-between gap-3 pt-6">
                <span className="font-mono text-[13px] font-medium">
                  {formatPrice(
                    product.price,
                    product.currency,
                  )}
                </span>

                <Link
                  href={`/products/${product.slug}`}
                  className="inline-flex min-h-10 items-center justify-center border-2 border-[#1c242b] bg-[#2f6fed] px-3 text-[10px] font-bold text-white shadow-[3px_3px_0_#1c242b] transition-all hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[1px_1px_0_#1c242b]"
                >
                  VIEW ↗
                </Link>
              </div>
            </div>
          </article>
        ))}

        {/* EMPTY STATE */}

        {filteredProducts.length === 0 && (
          <div className="col-span-full flex min-h-[300px] flex-col items-center justify-center gap-4 bg-white px-6 text-center">
            <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-[#66727d]">
              NO MATCHES FOUND
            </span>

            <h3 className="text-3xl font-bold tracking-[-0.06em]">
              NOTHING HERE. YET.
            </h3>

            <button
              type="button"
              onClick={() =>
                setSearchQuery("")
              }
              className="border-2 border-[#1c242b] bg-[#2f6fed] px-5 py-3 text-[11px] font-semibold text-white transition-colors hover:bg-[#1c242b]"
            >
              CLEAR SEARCH ↗
            </button>
          </div>
        )}
      </div>
    </section>
  );
}