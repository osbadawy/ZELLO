"use client";

import { useEffect } from "react";
import type { CartItem } from "./types";
import { formatPrice } from "./utils";

type CartDrawerProps = {
  cart: CartItem[];
  isOpen: boolean;
  onClose: () => void;
  onRemove: (productId: string) => void;
};

export default function CartDrawer({ cart, isOpen, onClose, onRemove }: CartDrawerProps) {
  const count = cart.reduce((sum, item) => sum + item.quantity, 0);
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <>
      <button type="button" className="fixed inset-0 z-40 bg-[#1c242b]/45" onClick={onClose} aria-label="Close shopping bag" />
      <aside role="dialog" aria-modal="true" aria-label="Shopping bag" className="fixed inset-y-0 right-0 z-50 flex w-full max-w-[410px] flex-col border-l-2 border-[#1c242b] bg-white shadow-[-14px_0_30px_rgba(28,36,43,0.15)]">
        <div className="flex items-center justify-between border-b-2 border-[#1c242b] bg-[#d8e4ff] p-5">
          <h2 className="text-[22px] font-bold tracking-[-0.07em]">YOUR BAG <span className="font-mono text-[11px] font-medium tracking-[0.06em]">/ {String(count).padStart(2, "0")}</span></h2>
          <button type="button" onClick={onClose} aria-label="Close shopping bag" className="text-[22px] leading-none">×</button>
        </div>
        <div className="flex-1 overflow-auto p-5">
          {cart.length === 0 ? (
            <p className="text-[13px] leading-[1.5] text-[#66727d]">Your bag is currently empty.<br />Find something useful in the drop.</p>
          ) : cart.map((item) => (
            <div key={item.id} className="flex justify-between gap-4 border-b border-[#c3cdd5] py-[13px]">
              <div>
                <strong className="block text-[13px]">{item.name}</strong>
                <small className="font-mono text-[10px] text-[#66727d]">QTY {item.quantity} × {formatPrice(item.price)}</small>
              </div>
              <div className="text-right">
                <strong className="block text-[13px]">{formatPrice(item.price * item.quantity)}</strong>
                <button type="button" onClick={() => onRemove(item.id)} className="text-[11px] text-[#66727d] underline">remove</button>
              </div>
            </div>
          ))}
        </div>
        <div className="border-t-2 border-[#1c242b] p-5">
          <div className="mb-4 flex justify-between font-mono text-[13px]"><span>TOTAL</span><strong>{formatPrice(total)}</strong></div>
          <button type="button" disabled={cart.length === 0} onClick={() => window.alert("Demo checkout: connect this button to your checkout provider.")} className="inline-flex min-h-12 w-full items-center justify-center border-2 border-[#1c242b] bg-[#1c242b] px-[18px] text-xs font-semibold text-white shadow-[5px_5px_0_#2f6fed] hover:translate-x-[3px] hover:translate-y-[3px] hover:shadow-[2px_2px_0_#2f6fed] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-x-0 disabled:hover:translate-y-0">CHECKOUT ↗</button>
        </div>
      </aside>
    </>
  );
}
