"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import Brand from "../home/Brand";

type NavBarProps = {
  cartCount: number;
  onSearch: () => void;
  onOpenCart: () => void;
};

export default function NavBar({
  cartCount,
  onSearch,
  onOpenCart,
}: NavBarProps) {
  const pathname = usePathname();

  const navLinks = [
    {
      label: "SHOP",
      href: "/shop",
      isActive: pathname.startsWith("/shop"),
    },
    {
      label: "SYSTEM",
      href: "/system",
      isActive: pathname === "/system",
    },
    {
      label: "ABOUT",
      href: "/about",
      isActive: false,
    },
  ];

  return (
    <header
      id="penta-navbar"
      className="sticky top-0 z-50 w-full border-b-2 border-[#1c242b] bg-[#f3f5f7]/95 backdrop-blur-md"
    >
      <div className="mx-auto grid min-h-[62px] w-[calc(100%-20px)] max-w-[1440px] grid-cols-[1fr_auto] items-center gap-x-5 md:min-h-[76px] md:w-[calc(100%-32px)] lg:grid-cols-[1fr_auto_1fr]">

        {/* BRAND */}

        <Brand href="/" />

        {/* NAVIGATION */}

        <nav
          aria-label="Primary navigation"
          className="order-3 col-span-2 flex gap-5 overflow-x-auto border-t border-[#1c242b] py-3 text-xs font-semibold lg:order-none lg:col-span-1 lg:justify-center lg:gap-9 lg:border-0 lg:py-0"
        >
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              aria-current={
                link.isActive ? "page" : undefined
              }
              className={[
                "border-b-2 py-1 transition-colors duration-200",
                "hover:border-[#2f6fed] hover:text-[#2f6fed]",
                "focus-visible:border-[#2f6fed]",
                link.isActive
                  ? "border-[#2f6fed] text-[#2f6fed]"
                  : "border-transparent",
              ].join(" ")}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* ACTIONS */}

        <div className="flex justify-end gap-2">

          {/* SEARCH */}

          <button
            type="button"
            onClick={onSearch}
            className="hidden min-h-10 border-2 border-[#1c242b] bg-white px-3 text-[11px] font-semibold shadow-[3px_3px_0_#1c242b] transition-transform hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[1px_1px_0_#1c242b] sm:block"
          >
            SEARCH
          </button>

          {/* SHOPPING BAG */}

          <button
            type="button"
            onClick={onOpenCart}
            className="min-h-10 border-2 border-[#1c242b] bg-[#d8e4ff] px-3 text-[11px] font-semibold shadow-[3px_3px_0_#1c242b] transition-transform hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[1px_1px_0_#1c242b]"
          >
            BAG

            <span className="ml-1.5 inline-grid size-[18px] place-items-center bg-[#1c242b] text-[10px] text-[#d8e4ff]">
              {cartCount}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
}