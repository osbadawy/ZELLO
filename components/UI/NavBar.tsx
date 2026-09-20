"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search, ShoppingBag, ArrowUpRight } from "lucide-react";

import Brand from "../home/Brand";

type NavBarProps = {
  cartCount: number;
  onSearch: () => void;
  onOpenCart: () => void;
};

export default function NavBar({ cartCount, onSearch, onOpenCart }: NavBarProps) {
  const pathname = usePathname();

  const navLinks = [
    {
      label: "Shop",
      href: "/shop",
      isActive: pathname.startsWith("/shop"),
    },
    {
      label: "System",
      href: "/system",
      isActive: pathname === "/system",
    },
    {
      label: "About",
      href: "/about",
      isActive: pathname === "/about",
    },
  ];

  return (
    <header
      id="penta-navbar"
      className="sticky top-0 z-50 w-full border-b border-white/[0.10] bg-[#080d18]/85 text-white shadow-[0_8px_32px_rgba(0,0,0,0.08)] backdrop-blur-2xl backdrop-saturate-150"
    >
      {/* SUBTLE TOP HIGHLIGHT */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

      <div className="mx-auto grid min-h-[68px] w-full max-w-[1440px] grid-cols-[1fr_auto] items-center gap-x-5 px-5 sm:px-8 lg:min-h-[76px] lg:grid-cols-[1fr_auto_1fr] lg:px-12">

        {/* BRAND */}
        <Brand href="/" />

        {/* DESKTOP NAVIGATION */}
        <nav
          aria-label="Primary navigation"
          className="hidden items-center justify-center gap-1 lg:flex"
        >
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              aria-current={link.isActive ? "page" : undefined}
              className={[
                "group relative inline-flex min-h-10 items-center justify-center rounded-full px-5 text-[13px] font-medium tracking-[-0.01em] transition-all duration-300",
                link.isActive
                  ? "bg-white/[0.10] text-white"
                  : "text-white/55 hover:bg-white/[0.06] hover:text-white",
              ].join(" ")}
            >
              {link.label}

              {/* ACTIVE INDICATOR */}
              {link.isActive && (
                <span className="absolute bottom-1.5 left-1/2 size-1 -translate-x-1/2 rounded-full bg-[#A9C5FF]" />
              )}
            </Link>
          ))}
        </nav>

        {/* ACTIONS */}
        <div className="flex items-center justify-end gap-2 sm:gap-3">

          {/* SEARCH */}
          <button
            type="button"
            onClick={onSearch}
            aria-label="Search products"
            className="group relative flex size-10 items-center justify-center rounded-full border border-white/[0.12] bg-white/[0.06] text-white/75 backdrop-blur-xl transition-all duration-300 hover:border-white/25 hover:bg-white/[0.12] hover:text-white active:scale-95 sm:size-11"
          >
            <Search
              size={18}
              strokeWidth={1.7}
              className="transition-transform duration-300 group-hover:scale-110"
            />
          </button>

          {/* SHOPPING BAG */}
          <button
            type="button"
            onClick={onOpenCart}
            aria-label={`Open shopping bag, ${cartCount} items`}
            className="group relative flex size-10 items-center justify-center rounded-full border border-white/[0.12] bg-white/[0.06] text-white/85 backdrop-blur-xl transition-all duration-300 hover:border-white/25 hover:bg-white/[0.12] hover:text-white active:scale-95 sm:size-11"
          >
            <ShoppingBag
              size={18}
              strokeWidth={1.7}
              className="transition-transform duration-300 group-hover:scale-110"
            />

            {/* CART COUNT */}
            {cartCount > 0 && (
              <span className="absolute -right-1 -top-1 flex min-w-[18px] h-[18px] items-center justify-center rounded-full border-2 border-[#080d18] bg-[#A9C5FF] px-1 text-[9px] font-semibold text-[#080d18]">
                {cartCount > 99 ? "99+" : cartCount}
              </span>
            )}
          </button>

          {/* DESKTOP SHOP BUTTON */}
          <Link
            href="/shop"
            className="group ml-2 hidden min-h-10 items-center justify-center gap-2 rounded-full bg-white px-5 text-[12px] font-semibold tracking-[-0.01em] text-[#080d18] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#edf2ff] active:scale-[0.98] xl:inline-flex"
          >
            Explore

            <ArrowUpRight
              size={15}
              strokeWidth={1.8}
              className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
          </Link>
        </div>

        {/* MOBILE NAVIGATION */}
        <nav
          aria-label="Mobile navigation"
          className="col-span-2 flex items-center justify-center gap-1 border-t border-white/[0.08] py-2 lg:hidden"
        >
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              aria-current={link.isActive ? "page" : undefined}
              className={[
                "relative flex min-h-9 flex-1 items-center justify-center rounded-full px-4 text-[12px] font-medium tracking-[-0.01em] transition-all duration-300 sm:flex-none sm:px-7",
                link.isActive
                  ? "bg-white/[0.12] text-white"
                  : "text-white/50 hover:bg-white/[0.06] hover:text-white",
              ].join(" ")}
            >
              {link.label}

              {link.isActive && (
                <span className="absolute bottom-1 left-1/2 size-[3px] -translate-x-1/2 rounded-full bg-[#A9C5FF]" />
              )}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}