"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";

import {
  ArrowLeft,
  ArrowRight,
  Check,
  CreditCard,
  LockKeyhole,
  Mail,
  MapPin,
  PackageCheck,
  ShieldCheck,
  ShoppingBag,
  Truck,
  User,
} from "lucide-react";

import type { CartItem } from "../home/StoreLayout";

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

const inputClass =
  "h-12 w-full rounded-2xl border border-white/[0.10] bg-white/[0.045] px-4 text-[13px] text-white outline-none transition-all placeholder:text-white/25 hover:border-white/20 focus:border-[#A9C5FF]/50 focus:bg-white/[0.065] focus:ring-4 focus:ring-[#A9C5FF]/[0.05]";

export default function CheckoutClient() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const stored = sessionStorage.getItem("quickshipgo:checkout");

      if (stored) {
        const parsed = JSON.parse(stored) as CartItem[];

        if (Array.isArray(parsed)) {
          setCart(parsed);
        }
      }
    } catch {
      setCart([]);
    } finally {
      setReady(true);
    }
  }, []);

  const count = useMemo(
    () => cart.reduce((sum, item) => sum + item.quantity, 0),
    [cart],
  );

  const subtotal = useMemo(
    () =>
      cart.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0,
      ),
    [cart],
  );

  const currency = cart[0]?.currency ?? "USD";

  if (!ready) {
    return (
      <main className="min-h-screen bg-[#080E18] px-5 py-20 text-white">
        <div className="mx-auto max-w-[1400px]">
          <div className="h-[600px] animate-pulse rounded-[30px] border border-white/[0.08] bg-white/[0.035]" />
        </div>
      </main>
    );
  }

  if (cart.length === 0) {
    return (
      <main className="flex min-h-[75svh] flex-col items-center justify-center bg-[#080E18] px-5 text-center text-white">
        <div className="flex size-20 items-center justify-center rounded-[26px] border border-white/[0.10] bg-white/[0.05]">
          <ShoppingBag
            size={30}
            strokeWidth={1.4}
            className="text-[#A9C5FF]"
          />
        </div>

        <h1 className="mt-7 text-[34px] font-semibold tracking-[-0.055em]">
          Your checkout is empty.
        </h1>

        <p className="mt-3 max-w-sm text-[13px] leading-relaxed text-white/40">
          Add something to your bag before continuing to checkout.
        </p>

        <Link
          href="/#shop"
          className="group mt-8 inline-flex min-h-12 items-center gap-2 rounded-full bg-white px-6 text-[12px] font-semibold text-[#080E18] transition-colors hover:bg-[#dce8ff]"
        >
          Continue shopping
          <ArrowRight
            size={15}
            className="transition-transform group-hover:translate-x-1"
          />
        </Link>
      </main>
    );
  }

  return (
    <main className="relative isolate min-h-screen overflow-hidden bg-[#080E18] text-white">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10"
      >
        <div className="absolute -left-[300px] -top-[350px] size-[800px] rounded-full bg-[#5277ca]/[0.08] blur-[150px]" />
        <div className="absolute -right-[300px] top-[300px] size-[700px] rounded-full bg-[#7197ff]/[0.045] blur-[150px]" />
      </div>

      <div className="mx-auto w-full max-w-[1400px] px-5 pb-24 pt-10 sm:px-8 lg:px-12 lg:pt-14">
        {/* TOP */}
        <div className="mb-10 flex items-center justify-between gap-4">
          <Link
            href="/#shop"
            className="group inline-flex items-center gap-2 text-[11px] text-white/45 transition-colors hover:text-white"
          >
            <ArrowLeft
              size={14}
              className="transition-transform group-hover:-translate-x-1"
            />
            Continue shopping
          </Link>

          <div className="flex items-center gap-2 text-[10px] text-white/35">
            <LockKeyhole size={12} />
            Secure checkout
          </div>
        </div>

        {/* HEADING */}
        <header className="mb-12">
          <div className="mb-4 flex items-center gap-2">
            <ShoppingBag
              size={13}
              className="text-[#A9C5FF]"
            />

            <span className="text-[10px] font-medium uppercase tracking-[0.14em] text-[#A9C5FF]/75">
              Quickshipgo / Checkout
            </span>
          </div>

          <h1 className="text-[clamp(2.8rem,6vw,5rem)] font-semibold leading-none tracking-[-0.065em]">
            Checkout<span className="text-[#A9C5FF]">.</span>
          </h1>

          <p className="mt-4 text-[13px] text-white/40">
            {count} {count === 1 ? "item" : "items"} ready to order.
          </p>
        </header>

        <div className="grid gap-8 lg:grid-cols-[1fr_430px] xl:gap-12">
          {/* CUSTOMER INFORMATION */}
          <div className="space-y-6">
            {/* CONTACT */}
            <section className="rounded-[28px] border border-white/[0.10] bg-white/[0.04] p-6 backdrop-blur-xl sm:p-8">
              <div className="mb-7 flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-2xl border border-[#A9C5FF]/15 bg-[#A9C5FF]/10">
                  <User size={17} className="text-[#A9C5FF]" />
                </div>

                <div>
                  <span className="text-[10px] text-white/35">
                    Step 01
                  </span>

                  <h2 className="text-[18px] font-semibold tracking-[-0.04em]">
                    Contact details
                  </h2>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-[11px] text-white/50">
                    First name
                  </label>

                  <input
                    type="text"
                    placeholder="First name"
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className="mb-2 block text-[11px] text-white/50">
                    Last name
                  </label>

                  <input
                    type="text"
                    placeholder="Last name"
                    className={inputClass}
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="mb-2 block text-[11px] text-white/50">
                    Email
                  </label>

                  <div className="relative">
                    <Mail
                      size={15}
                      className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-white/30"
                    />

                    <input
                      type="email"
                      placeholder="you@example.com"
                      className={`${inputClass} pl-11`}
                    />
                  </div>
                </div>
              </div>
            </section>

            {/* SHIPPING */}
            <section className="rounded-[28px] border border-white/[0.10] bg-white/[0.04] p-6 backdrop-blur-xl sm:p-8">
              <div className="mb-7 flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-2xl border border-[#86E0C1]/15 bg-[#86E0C1]/10">
                  <MapPin size={17} className="text-[#86E0C1]" />
                </div>

                <div>
                  <span className="text-[10px] text-white/35">
                    Step 02
                  </span>

                  <h2 className="text-[18px] font-semibold tracking-[-0.04em]">
                    Shipping address
                  </h2>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label className="mb-2 block text-[11px] text-white/50">
                    Address
                  </label>

                  <input
                    type="text"
                    placeholder="Street address"
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className="mb-2 block text-[11px] text-white/50">
                    City
                  </label>

                  <input
                    type="text"
                    placeholder="City"
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className="mb-2 block text-[11px] text-white/50">
                    Postal code
                  </label>

                  <input
                    type="text"
                    placeholder="Postal code"
                    className={inputClass}
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="mb-2 block text-[11px] text-white/50">
                    Country
                  </label>

                  <input
                    type="text"
                    placeholder="Country"
                    className={inputClass}
                  />
                </div>
              </div>
            </section>

            {/* PAYMENT */}
            <section className="rounded-[28px] border border-white/[0.10] bg-white/[0.04] p-6 backdrop-blur-xl sm:p-8">
              <div className="mb-7 flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-2xl border border-[#C3ADFF]/15 bg-[#C3ADFF]/10">
                  <CreditCard size={17} className="text-[#C3ADFF]" />
                </div>

                <div>
                  <span className="text-[10px] text-white/35">
                    Step 03
                  </span>

                  <h2 className="text-[18px] font-semibold tracking-[-0.04em]">
                    Payment
                  </h2>
                </div>
              </div>

              <div className="flex min-h-[110px] items-center justify-center rounded-[20px] border border-dashed border-white/[0.10] bg-white/[0.025] px-6 text-center">
                <div>
                  <CreditCard
                    size={22}
                    className="mx-auto text-white/30"
                  />

                  <p className="mt-3 text-[12px] text-white/45">
                    Payment provider will connect here.
                  </p>
                </div>
              </div>
            </section>
          </div>

          {/* ORDER SUMMARY */}
          <aside className="lg:sticky lg:top-28 lg:self-start">
            <div className="overflow-hidden rounded-[28px] border border-white/[0.10] bg-white/[0.045] backdrop-blur-2xl">
              <div className="border-b border-white/[0.08] px-6 py-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-[18px] font-semibold tracking-[-0.04em]">
                    Order summary
                  </h2>

                  <span className="text-[11px] text-white/35">
                    {count} {count === 1 ? "item" : "items"}
                  </span>
                </div>
              </div>

              <div className="max-h-[430px] space-y-4 overflow-y-auto px-6 py-6 [scrollbar-width:thin]">
                {cart.map((item) => (
                  <div
                    key={item.id}
                    className="flex gap-4"
                  >
                    <div className="relative size-20 shrink-0 overflow-hidden rounded-[18px] border border-white/[0.10] bg-gradient-to-br from-[#dbe3eb] via-[#c2cedb] to-[#91a6bb]">
                      {item.image ? (
                        <Image
                          src={item.image.url}
                          alt={item.image.altText || item.name}
                          fill
                          unoptimized
                          sizes="80px"
                          className="object-contain p-2"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center">
                          <PackageCheck
                            size={20}
                            className="text-[#506d8a]"
                          />
                        </div>
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <h3 className="line-clamp-2 text-[13px] font-semibold leading-[1.4]">
                        {item.name}
                      </h3>

                      <span className="mt-1 block text-[10px] text-white/35">
                        Quantity {item.quantity}
                      </span>

                      <span className="mt-2 block text-[12px] font-semibold">
                        {formatPrice(
                          item.price * item.quantity,
                          item.currency,
                        )}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-white/[0.08] px-6 py-6">
                <div className="space-y-3">
                  <div className="flex justify-between text-[12px]">
                    <span className="text-white/40">
                      Subtotal
                    </span>

                    <span>
                      {formatPrice(subtotal, currency)}
                    </span>
                  </div>

                  <div className="flex justify-between text-[12px]">
                    <span className="text-white/40">
                      Shipping
                    </span>

                    <span className="text-white/60">
                      Calculated next
                    </span>
                  </div>
                </div>

                <div className="my-5 h-px bg-white/[0.08]" />

                <div className="flex items-end justify-between">
                  <span className="text-[13px] font-medium">
                    Total
                  </span>

                  <span className="text-[27px] font-semibold tracking-[-0.055em]">
                    {formatPrice(subtotal, currency)}
                  </span>
                </div>

                <button
                  type="button"
                  className="group mt-6 flex min-h-[54px] w-full items-center justify-center gap-3 rounded-full bg-white px-6 text-[13px] font-semibold text-[#080E18] transition-all hover:bg-[#dce8ff] active:scale-[0.99]"
                >
                  Continue to payment

                  <ArrowRight
                    size={16}
                    className="transition-transform group-hover:translate-x-1"
                  />
                </button>

                <div className="mt-5 grid grid-cols-2 gap-2">
                  <div className="flex items-center gap-2 text-[10px] text-white/35">
                    <ShieldCheck
                      size={13}
                      className="text-[#86E0C1]"
                    />
                    Secure checkout
                  </div>

                  <div className="flex items-center justify-end gap-2 text-[10px] text-white/35">
                    <Truck
                      size={13}
                      className="text-[#A9C5FF]"
                    />
                    Tracked delivery
                  </div>
                </div>
              </div>
            </div>
          </aside>
        </div>

        <div className="mt-12 flex items-center justify-center gap-2 text-[10px] text-white/30">
          <Check size={12} className="text-[#86E0C1]" />
          Your order information is transferred securely.
        </div>
      </div>
    </main>
  );
}