"use client";

import {
  createContext,
  useContext,
  useRef,
  useState,
  type ReactNode,
  type RefObject,
} from "react";

import type { CartItem, Product } from "./types";

import NavBar from "../UI/NavBar";
import Footer from "./Footer";
import CartDrawer from "./CartDrawer";

type StoreContextType = {
  cart: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  searchInputRef: RefObject<HTMLInputElement | null>;
};

const StoreContext = createContext<StoreContextType | null>(null);

export function useStore() {
  const context = useContext(StoreContext);

  if (!context) {
    throw new Error("useStore must be used within StoreLayout");
  }

  return context;
}

export default function StoreLayout({
  children,
}: {
  children: ReactNode;
}) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);

  const searchInputRef = useRef<HTMLInputElement>(null);

  const cartCount = cart.reduce(
    (sum, item) => sum + item.quantity,
    0,
  );

  function addToCart(product: Product) {
    setCart((currentCart) => {
      const existing = currentCart.find(
        (item) => item.id === product.id,
      );

      if (existing) {
        return currentCart.map((item) =>
          item.id === product.id
            ? {
                ...item,
                quantity: item.quantity + 1,
              }
            : item,
        );
      }

      return [
        ...currentCart,
        {
          ...product,
          quantity: 1,
        },
      ];
    });

    setCartOpen(true);
  }

  function removeFromCart(productId: string) {
    setCart((currentCart) =>
      currentCart.filter(
        (item) => item.id !== productId,
      ),
    );
  }

  function focusSearch() {
    document
      .getElementById("shop")
      ?.scrollIntoView({
        behavior: "smooth",
      });

    window.setTimeout(() => {
      searchInputRef.current?.focus();
    }, 300);
  }

  return (
    <StoreContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        searchInputRef,
      }}
    >
      <div className="flex min-h-dvh flex-col bg-[#f3f5f7] font-sans text-[#1c242b] antialiased selection:bg-[#2f6fed] selection:text-white">
        <NavBar
          cartCount={cartCount}
          onSearch={focusSearch}
          onOpenCart={() => setCartOpen(true)}
        />

        <main id="top" className="w-full flex-1">
          {children}
        </main>

        <div className="mx-auto w-[calc(100%-20px)] max-w-[1440px] sm:w-[calc(100%-32px)]">
          <Footer />
        </div>

        <CartDrawer
          cart={cart}
          isOpen={cartOpen}
          onClose={() => setCartOpen(false)}
          onRemove={removeFromCart}
        />
      </div>
    </StoreContext.Provider>
  );
}