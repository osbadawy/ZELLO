"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, ShoppingBag, Trash2, X } from "lucide-react";

import type { CartItem } from "./StoreLayout";

type CartDrawerProps = {
  cart: CartItem[];
  isOpen: boolean;
  onClose: () => void;
  onRemove: (productId: string) => void;
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

export default function CartDrawer({
  cart,
  isOpen,
  onClose,
  onRemove,
}: CartDrawerProps) {
  const router = useRouter();

  const drawerRef = useRef<HTMLElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  const count = cart.reduce((sum, item) => sum + item.quantity, 0);
  const total = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  const currency = cart[0]?.currency ?? "USD";

  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;

    previousFocusRef.current =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;

    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }

      if (event.key !== "Tab") return;

      const drawer = drawerRef.current;
      if (!drawer) return;

      const focusable = Array.from(
        drawer.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
        ),
      );

      if (focusable.length === 0) {
        event.preventDefault();
        return;
      }

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
      previousFocusRef.current?.focus();
    };
  }, [isOpen, onClose]);

  function handleCheckout() {
    if (cart.length === 0) return;

    sessionStorage.setItem(
      "quickshipgo:checkout",
      JSON.stringify(cart),
    );

    onClose();
    router.push("/checkout");
  }

  return (
    <>
      <button
        type="button"
        onClick={onClose}
        aria-label="Close shopping bag"
        aria-hidden={!isOpen}
        tabIndex={isOpen ? 0 : -1}
        className={`fixed inset-0 z-[100] bg-[#080E18]/65 backdrop-blur-[6px] transition-[opacity,visibility] duration-500 ease-out ${
          isOpen
            ? "visible pointer-events-auto opacity-100"
            : "invisible pointer-events-none opacity-0"
        }`}
      />

      <aside
        ref={drawerRef}
        role="dialog"
        aria-modal={isOpen ? true : undefined}
        aria-hidden={!isOpen}
        aria-labelledby="cart-drawer-title"
        tabIndex={-1}
        className={`fixed inset-y-0 right-0 z-[101] flex h-[100dvh] w-full max-w-[460px] flex-col overflow-hidden border-l border-white/[0.12] bg-[#080E18]/95 text-white shadow-[-24px_0_100px_rgba(0,0,0,0.35)] backdrop-blur-3xl backdrop-saturate-150 transition-[transform,visibility] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          isOpen
            ? "visible translate-x-0"
            : "invisible translate-x-full"
        }`}
      >
        <div className="pointer-events-none absolute inset-y-0 left-0 w-px bg-gradient-to-b from-white/30 via-white/10 to-transparent" />

        <div className="relative flex shrink-0 items-center justify-between border-b border-white/[0.08] px-6 py-6 sm:px-8 sm:py-7">
          <div className="flex items-center gap-3">
            <div className="flex size-11 items-center justify-center rounded-2xl border border-white/[0.12] bg-white/[0.07] backdrop-blur-xl">
              <ShoppingBag size={19} strokeWidth={1.6} className="text-white/85" />
            </div>

            <div>
              <h2
                id="cart-drawer-title"
                className="text-[19px] font-semibold leading-tight tracking-[-0.04em] text-white"
              >
                Your bag
              </h2>

              <p className="mt-1 text-[11px] font-medium text-white/40">
                {count === 0
                  ? "No items yet"
                  : `${count} ${count === 1 ? "item" : "items"} in your bag`}
              </p>
            </div>
          </div>

          <button
            ref={closeButtonRef}
            type="button"
            onClick={onClose}
            aria-label="Close shopping bag"
            tabIndex={isOpen ? 0 : -1}
            className="flex size-10 items-center justify-center rounded-full border border-white/[0.12] bg-white/[0.06] text-white/60 backdrop-blur-xl transition-all duration-300 hover:border-white/25 hover:bg-white/[0.12] hover:text-white active:scale-95"
          >
            <X size={18} strokeWidth={1.7} />
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-6 py-7 [scrollbar-color:#ffffff20_transparent] [scrollbar-width:thin] sm:px-8">
          {cart.length === 0 ? (
            <div className="flex h-full min-h-[320px] flex-col items-center justify-center text-center">
              <div className="relative mb-7 flex size-24 items-center justify-center rounded-[30px] border border-white/[0.12] bg-white/[0.05] shadow-[0_20px_60px_rgba(0,0,0,0.12)] backdrop-blur-xl">
                <ShoppingBag size={34} strokeWidth={1.2} className="text-white/55" />

                <span className="absolute -right-1 -top-1 flex size-7 items-center justify-center rounded-full border border-white/[0.12] bg-[#111d30] text-[11px] font-semibold text-[#A9C5FF]">
                  0
                </span>
              </div>

              <h3 className="text-[22px] font-semibold tracking-[-0.045em] text-white">
                Your bag is empty.
              </h3>

              <p className="mt-3 max-w-[250px] text-[13px] leading-[1.7] text-white/45">
                Discover something worth keeping. Your next favorite find is just a click away.
              </p>

              <button
                type="button"
                onClick={onClose}
                tabIndex={isOpen ? 0 : -1}
                className="group mt-8 inline-flex min-h-11 items-center justify-center gap-2.5 rounded-full border border-white/[0.15] bg-white/[0.08] px-6 text-[12px] font-medium text-white backdrop-blur-xl transition-all duration-300 hover:border-white/25 hover:bg-white/[0.13] active:scale-[0.98]"
              >
                Continue shopping

                <ArrowRight
                  size={15}
                  strokeWidth={1.7}
                  className="transition-transform duration-300 group-hover:translate-x-1"
                />
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {cart.map((item) => (
                <div
                  key={item.id}
                  className="group relative overflow-hidden rounded-[24px] border border-white/[0.10] bg-white/[0.045] p-5 shadow-[0_8px_30px_rgba(0,0,0,0.06)] backdrop-blur-xl transition-all duration-300 hover:border-white/[0.18] hover:bg-white/[0.07]"
                >
                  <div className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0 flex-1">
                      <span className="mb-2 block text-[10px] font-medium uppercase tracking-[0.12em] text-[#A9C5FF]/80">
                        quickshipgo Selection
                      </span>

                      <h3 className="text-[14px] font-semibold leading-[1.4] tracking-[-0.02em] text-white">
                        {item.name}
                      </h3>

                      <p className="mt-2 text-[12px] text-white/45">
                        {formatPrice(item.price, item.currency)} each
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => onRemove(item.id)}
                      aria-label={`Remove ${item.name} from bag`}
                      tabIndex={isOpen ? 0 : -1}
                      className="flex size-9 shrink-0 items-center justify-center rounded-full border border-white/[0.10] bg-white/[0.05] text-white/40 transition-all duration-300 hover:border-red-400/20 hover:bg-red-400/10 hover:text-red-300 active:scale-95"
                    >
                      <Trash2 size={15} strokeWidth={1.6} />
                    </button>
                  </div>

                  <div className="mt-5 flex items-center justify-between border-t border-white/[0.08] pt-4">
                    <div className="inline-flex items-center gap-2 rounded-full border border-white/[0.10] bg-white/[0.05] px-3 py-1.5">
                      <span className="text-[10px] font-medium text-white/40">
                        Qty
                      </span>

                      <span className="text-[12px] font-semibold text-white">
                        {item.quantity}
                      </span>
                    </div>

                    <span className="text-[15px] font-semibold tracking-[-0.03em] text-white">
                      {formatPrice(
                        item.price * item.quantity,
                        item.currency,
                      )}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="relative shrink-0 border-t border-white/[0.10] bg-white/[0.035] px-6 pb-[max(24px,env(safe-area-inset-bottom))] pt-6 backdrop-blur-2xl sm:px-8 sm:pt-7">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-[12px] font-medium text-white/45">
              Subtotal
            </span>

            <span className="text-[15px] font-semibold tracking-[-0.025em] text-white">
              {formatPrice(total, currency)}
            </span>
          </div>

          <div className="mb-6 flex items-center justify-between">
            <span className="text-[12px] text-white/45">
              Shipping
            </span>

            <span className="text-[11px] font-medium text-white/55">
              Calculated at checkout
            </span>
          </div>

          <div className="mb-5 h-px bg-gradient-to-r from-transparent via-white/[0.15] to-transparent" />

          <div className="mb-6 flex items-center justify-between">
            <span className="text-[14px] font-medium text-white">
              Total
            </span>

            <span className="text-[25px] font-semibold tracking-[-0.055em] text-white">
              {formatPrice(total, currency)}
            </span>
          </div>

          <button
            type="button"
            disabled={cart.length === 0}
            tabIndex={isOpen ? 0 : -1}
            onClick={handleCheckout}
            className="group flex min-h-[54px] w-full items-center justify-center gap-3 rounded-full bg-white px-6 text-[13px] font-semibold tracking-[-0.01em] text-[#080E18] shadow-[0_8px_32px_rgba(255,255,255,0.08)] transition-all duration-300 hover:bg-[#edf2ff] hover:shadow-[0_12px_40px_rgba(255,255,255,0.14)] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-35 disabled:hover:bg-white disabled:hover:shadow-none"
          >
            Continue to checkout

            <ArrowRight
              size={17}
              strokeWidth={1.8}
              className="transition-transform duration-300 group-hover:translate-x-1 group-disabled:translate-x-0"
            />
          </button>

          <div className="mt-5 flex items-center justify-center gap-2">
            <span className="size-1 rounded-full bg-[#A9C5FF]" />

            <p className="text-center text-[10px] font-medium tracking-[0.01em] text-white/35">
              Thoughtfully selected. Made for everyday life.
            </p>
          </div>
        </div>
      </aside>
    </>
  );
}