"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type MouseEvent,
  type ReactNode,
} from "react";
import { usePathname, useRouter } from "next/navigation";

type PageTransitionContextValue = {
  navigate: (href: string, replace?: boolean) => void;
};

type TransitionPhase = "idle" | "covering" | "revealing";

const PageTransitionContext = createContext<PageTransitionContextValue | null>(
  null,
);

const COVER_DURATION = 480;
const PAGE_SWAP_DELAY = 360;
const REVEAL_DURATION = 680;

function TransitionVeil({ phase }: { phase: TransitionPhase }) {
  return (
    <div
      className="page-transition-veil"
      data-page-transition-veil={phase}
      aria-hidden="true"
    >
      <div className="page-transition-grid" />
      <div className="page-transition-brand">
        <span className="page-transition-brand__mark">P/</span>
        <span>PENTA LABS</span>
      </div>
    </div>
  );
}

export function PageTransitionProvider({
  children,
}: {
  children: ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [phase, setPhase] = useState<TransitionPhase>("idle");
  const navigatingRef = useRef(false);
  const previousPathnameRef = useRef(pathname);
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  const clearTimers = useCallback(() => {
    timersRef.current.forEach((timer) => clearTimeout(timer));
    timersRef.current = [];
  }, []);

  useEffect(() => {
    if (previousPathnameRef.current === pathname) return;

    previousPathnameRef.current = pathname;

    if (!navigatingRef.current) return;

    // The new route is now mounted underneath the white veil.
    clearTimers();
    setPhase("revealing");

    const revealTimer = setTimeout(() => {
      setPhase("idle");
      navigatingRef.current = false;
    }, REVEAL_DURATION);

    timersRef.current.push(revealTimer);
  }, [pathname, clearTimers]);

  useEffect(() => {
    return () => clearTimers();
  }, [clearTimers]);

  const navigate = useCallback(
    (href: string, replace = false) => {
      if (navigatingRef.current) return;

      const reducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      const changePage = () => {
        if (replace) router.replace(href);
        else router.push(href);
      };

      if (reducedMotion) {
        changePage();
        return;
      }

      clearTimers();
      navigatingRef.current = true;
      setPhase("covering");

      // The page is faded out by CSS while the veil becomes fully white.
      const swapTimer = setTimeout(changePage, PAGE_SWAP_DELAY);
      timersRef.current.push(swapTimer);

      // If a route takes unusually long, keep the veil from locking the UI.
      const safetyTimer = setTimeout(() => {
        if (navigatingRef.current) {
          setPhase("revealing");
          const unlockTimer = setTimeout(() => {
            setPhase("idle");
            navigatingRef.current = false;
          }, REVEAL_DURATION);
          timersRef.current.push(unlockTimer);
        }
      }, COVER_DURATION + 1800);

      timersRef.current.push(safetyTimer);
    },
    [clearTimers, router],
  );

  function handleClickCapture(event: MouseEvent<HTMLDivElement>) {
    if (
      event.defaultPrevented ||
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey
    ) {
      return;
    }

    const target = event.target;
    if (!(target instanceof Element)) return;

    const link = target.closest("a[href]") as HTMLAnchorElement | null;
    if (!link || link.hasAttribute("data-no-page-transition")) return;

    if (
      link.hasAttribute("download") ||
      (link.target && link.target !== "_self")
    ) {
      return;
    }

    const destination = new URL(link.href, window.location.href);

    if (
      destination.origin !== window.location.origin ||
      destination.pathname.startsWith("/api/")
    ) {
      return;
    }

    if (
      destination.pathname === window.location.pathname &&
      destination.search === window.location.search
    ) {
      return;
    }

    event.preventDefault();
    navigate(
      `${destination.pathname}${destination.search}${destination.hash}`,
    );
  }

  const contentPhase =
    phase === "covering"
      ? "leaving"
      : phase === "revealing"
        ? "entering"
        : "idle";

  return (
    <PageTransitionContext.Provider value={{ navigate }}>
      <div
        className="page-transition-shell"
        data-page-transition={phase}
        onClickCapture={handleClickCapture}
      >
        <div
          className="page-transition-content"
          data-page-transition-content={contentPhase}
        >
          {children}
        </div>
        <TransitionVeil phase={phase} />
      </div>
    </PageTransitionContext.Provider>
  );
}

export function usePageTransition() {
  const context = useContext(PageTransitionContext);

  if (!context) {
    throw new Error(
      "usePageTransition must be used inside PageTransitionProvider.",
    );
  }

  return context;
}

// Backwards-compatible aliases if the previous provider was already wired in.
export const TileTransitionProvider = PageTransitionProvider;
export const useTileTransition = usePageTransition;