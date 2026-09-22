"use client";

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
  type RefObject,
} from "react";

import type { ShopProduct } from "./ShopSection";

import NavBar from "../UI/NavBar";
import Footer from "./Footer";
import CartDrawer from "./CartDrawer";

export type CartItem = ShopProduct & {
  quantity: number;
};

type StoreContextType = {
  cart: CartItem[];
  cartReady: boolean;
  addToCart: (product: ShopProduct) => void;
  removeFromCart: (productId: string) => void;
  searchInputRef: RefObject<HTMLInputElement | null>;
};

const CART_STORAGE_KEY = "quickshipgo:cart:v1";

const StoreContext = createContext<StoreContextType | null>(null);

export function useStore() {
  const context = useContext(StoreContext);

  if (!context) {
    throw new Error("useStore must be used within StoreLayout");
  }

  return context;
}

export default function StoreLayout({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartReady, setCartReady] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);

  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    try {
      const savedCart = sessionStorage.getItem(CART_STORAGE_KEY);

      if (savedCart) {
        const parsed: unknown = JSON.parse(savedCart);

        if (Array.isArray(parsed)) {
          const validItems = parsed.filter((item): item is CartItem => {
            if (!item || typeof item !== "object") return false;

            const product = item as Partial<CartItem>;

            return (
              typeof product.id === "string" &&
              typeof product.slug === "string" &&
              typeof product.name === "string" &&
              typeof product.price === "number" &&
              Number.isFinite(product.price) &&
              product.price >= 0 &&
              typeof product.currency === "string" &&
              typeof product.quantity === "number" &&
              Number.isSafeInteger(product.quantity) &&
              product.quantity > 0
            );
          });

          setCart(validItems);
        }
      }
    } catch {
      sessionStorage.removeItem(CART_STORAGE_KEY);
    } finally {
      setCartReady(true);
    }
  }, []);

  useEffect(() => {
    if (!cartReady) return;

    try {
      sessionStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    } catch {
      // The cart remains usable in memory if browser storage is unavailable.
    }
  }, [cart, cartReady]);

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  function addToCart(product: ShopProduct) {
    setCart((currentCart) => {
      const existing = currentCart.find((item) => item.id === product.id);

      if (existing) {
        return currentCart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        );
      }

      return [...currentCart, { ...product, quantity: 1 }];
    });

    setCartOpen(true);
  }

  function removeFromCart(productId: string) {
    setCart((currentCart) =>
      currentCart.filter((item) => item.id !== productId),
    );
  }

  function focusSearch() {
    document.getElementById("shop")?.scrollIntoView({
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
        cartReady,
        addToCart,
        removeFromCart,
        searchInputRef,
      }}
    >
      <div className="flex min-h-dvh w-full flex-col bg-[#080E18] font-sans text-white antialiased selection:bg-[#A9C5FF] selection:text-[#080E18]">
        <NavBar
          cartCount={cartCount}
          onSearch={focusSearch}
          onOpenCart={() => setCartOpen(true)}
        />

        <main id="top" className="w-full flex-1">
          {children}
        </main>

        <Footer />

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