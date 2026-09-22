"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type MouseEvent,
  type ReactNode,
} from "react";

import { usePathname, useRouter } from "next/navigation";

type PageTransitionContextValue = {
  navigate: (href: string, replace?: boolean) => void;
};

type TransitionPhase = "idle" | "leaving" | "waiting" | "entering";

const PageTransitionContext = createContext<PageTransitionContextValue | null>(null);

const FADE_OUT_DURATION = 750;
const FADE_IN_DURATION = 750;

const particles = Array.from({ length: 45 }, (_, index) => ({
  id: index,
  left: `${(index * 37 + 13) % 100}%`,
  top: `${(index * 53 + 19) % 100}%`,
  size: 1 + (index % 3),
  duration: 4 + (index % 5),
  delay: -(index % 7),
  opacity: 0.2 + (index % 5) * 0.08,
}));

/* =========================================================
   TRANSITION BACKGROUND
========================================================= */

function TransitionBackground() {
  return (
    <div aria-hidden="true" className="quickshipgo-transition-background">

      <div className="absolute inset-0 bg-[#080E18]" />

      {/* Ambient illumination */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[70vw] w-[70vw] max-h-[800px] max-w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#7197ff]/[0.06] blur-[120px]" />

      {/* Floating particles */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {particles.map((particle) => (
          <span
            key={particle.id}
            className="quickshipgo-transition-particle absolute rounded-full bg-[#dce8ff]"
            style={{
              left: particle.left,
              top: particle.top,
              width: particle.size,
              height: particle.size,
              opacity: particle.opacity,
              animationDuration: `${particle.duration}s`,
              animationDelay: `${particle.delay}s`,
            }}
          />
        ))}
      </div>

    </div>
  );
}

/* =========================================================
   PAGE TRANSITION PROVIDER
========================================================= */

export function PageTransitionProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  const [phase, setPhase] = useState<TransitionPhase>("idle");

  const navigatingRef = useRef(false);
  const previousPathnameRef = useRef(pathname);
  const requestedPathRef = useRef<string | null>(null);

  const routeReadyRef = useRef(false);
  const fadeOutFinishedRef = useRef(false);
  const fadeInStartedRef = useRef(false);

  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const framesRef = useRef<number[]>([]);

  /* =======================================================
     TIMER MANAGEMENT
  ======================================================= */

  const clearTimers = useCallback(() => {
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];

    framesRef.current.forEach(cancelAnimationFrame);
    framesRef.current = [];
  }, []);

  /* =======================================================
     SCROLL MANAGEMENT
  ======================================================= */

  const resetScrollPosition = useCallback(() => {
    const html = document.documentElement;
    const body = document.body;

    const previousHtmlBehavior = html.style.scrollBehavior;
    const previousBodyBehavior = body.style.scrollBehavior;

    html.style.scrollBehavior = "auto";
    body.style.scrollBehavior = "auto";

    window.scrollTo({ top: 0, left: 0, behavior: "instant" });

    html.style.scrollBehavior = previousHtmlBehavior;
    body.style.scrollBehavior = previousBodyBehavior;
  }, []);

  /* =======================================================
     RESET TRANSITION
  ======================================================= */

  const resetTransition = useCallback(() => {
    clearTimers();

    resetScrollPosition();

    navigatingRef.current = false;
    routeReadyRef.current = false;
    fadeOutFinishedRef.current = false;
    fadeInStartedRef.current = false;
    requestedPathRef.current = null;

    setPhase("idle");

    const frame = requestAnimationFrame(() => {
      resetScrollPosition();
    });

    framesRef.current.push(frame);
  }, [clearTimers, resetScrollPosition]);

  /* =======================================================
     FADE IN NEW PAGE
  ======================================================= */

  const attemptReveal = useCallback(() => {
    if (!navigatingRef.current) return;
    if (!routeReadyRef.current) return;
    if (!fadeOutFinishedRef.current) return;
    if (fadeInStartedRef.current) return;

    fadeInStartedRef.current = true;

    // Always reveal the destination from the top.
    resetScrollPosition();

    // Allow the browser to render the destination at
    // opacity 0 before starting the fade-in animation.
    const frame = requestAnimationFrame(() => {
      resetScrollPosition();

      setPhase("entering");

      const finishTimer = setTimeout(() => {
        resetTransition();
      }, FADE_IN_DURATION);

      timersRef.current.push(finishTimer);
    });

    framesRef.current.push(frame);
  }, [resetScrollPosition, resetTransition]);

  /* =======================================================
     DETECT DESTINATION PAGE
  ======================================================= */

  useLayoutEffect(() => {
    if (previousPathnameRef.current === pathname) return;

    previousPathnameRef.current = pathname;

    if (!navigatingRef.current) return;

    if (requestedPathRef.current !== pathname) return;

    routeReadyRef.current = true;

    resetScrollPosition();

    attemptReveal();
  }, [pathname, attemptReveal, resetScrollPosition]);

  /* =======================================================
     CLEANUP
  ======================================================= */

  useEffect(() => {
    return () => {
      clearTimers();
    };
  }, [clearTimers]);

  /* =======================================================
     NAVIGATION
  ======================================================= */

  const navigate = useCallback(
    (href: string, replace = false) => {
      if (navigatingRef.current) return;

      const destination = new URL(href, window.location.href);

      if (destination.origin !== window.location.origin) {
        window.location.assign(destination.href);
        return;
      }

      const nextHref = `${destination.pathname}${destination.search}${destination.hash}`;
      const currentHref = `${window.location.pathname}${window.location.search}${window.location.hash}`;

      if (nextHref === currentHref) return;

      // Same-page anchors should retain their normal behavior.
      if (
        destination.pathname === window.location.pathname &&
        destination.search === window.location.search
      ) {
        if (replace) {
          window.location.replace(nextHref);
        } else {
          window.location.assign(nextHref);
        }

        return;
      }

      // Remove the hash from cross-page navigation so that
      // every destination starts at the top.
      const routeHref = `${destination.pathname}${destination.search}`;

      const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      const changePage = () => {
        if (replace) {
          router.replace(routeHref, { scroll: false });
        } else {
          router.push(routeHref, { scroll: false });
        }
      };

      if (reducedMotion) {
        changePage();
        resetScrollPosition();
        return;
      }

      clearTimers();

      navigatingRef.current = true;
      fadeOutFinishedRef.current = false;
      fadeInStartedRef.current = false;

      requestedPathRef.current = destination.pathname;

      // Query-only navigation does not change usePathname.
      routeReadyRef.current = destination.pathname === window.location.pathname;

      /* -------------------------------------------------------
         PHASE 1: FADE OUT CURRENT PAGE
      ------------------------------------------------------- */

      setPhase("leaving");

      const exitTimer = setTimeout(() => {
        // Current page is now fully transparent.
        setPhase("waiting");

        fadeOutFinishedRef.current = true;

        // Reset scrolling while the page is invisible.
        resetScrollPosition();

        // Load the destination.
        changePage();

        // For routes that are already ready, start fading in.
        attemptReveal();
      }, FADE_OUT_DURATION);

      timersRef.current.push(exitTimer);

      /* -------------------------------------------------------
         SAFETY FALLBACK
      ------------------------------------------------------- */

      const safetyTimer = setTimeout(() => {
        if (navigatingRef.current && !fadeInStartedRef.current) {
          resetTransition();
        }
      }, 10000);

      timersRef.current.push(safetyTimer);
    },
    [router, clearTimers, resetScrollPosition, attemptReveal, resetTransition],
  );

  /* =======================================================
     INTERCEPT INTERNAL LINKS
  ======================================================= */

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

    if (link.hasAttribute("download") || (link.target && link.target !== "_self")) {
      return;
    }

    const destination = new URL(link.href, window.location.href);

    if (
      destination.origin !== window.location.origin ||
      destination.pathname.startsWith("/api/")
    ) {
      return;
    }

    // Allow normal same-page anchor navigation.
    if (
      destination.pathname === window.location.pathname &&
      destination.search === window.location.search
    ) {
      return;
    }

    event.preventDefault();

    navigate(`${destination.pathname}${destination.search}${destination.hash}`);
  }

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <PageTransitionContext.Provider value={{ navigate }}>
      <div
        className="quickshipgo-transition-shell"
        data-transition-phase={phase}
        onClickCapture={handleClickCapture}
        aria-busy={phase !== "idle"}
      >

        {/* PARTICLE BACKGROUND */}
        <TransitionBackground />

        {/* PAGE CONTENT */}
        <div className="quickshipgo-transition-content">
          {children}
        </div>

      </div>

      <style jsx global>{`
        /* =====================================================
           TRANSITION SHELL
        ===================================================== */

        .quickshipgo-transition-shell {
          position: relative;
          min-height: 100svh;
          background: #080e18;
        }

        /* =====================================================
           PARTICLE BACKGROUND
        ===================================================== */

        .quickshipgo-transition-background {
          position: fixed;
          inset: 0;
          z-index: 9998;
          overflow: hidden;
          background: #080e18;
          opacity: 0;
          visibility: hidden;
          pointer-events: none;
          transition: opacity 200ms ease, visibility 0s linear 200ms;
        }

        .quickshipgo-transition-shell:not([data-transition-phase="idle"]) .quickshipgo-transition-background {
          opacity: 1;
          visibility: visible;
          transition: opacity 200ms ease, visibility 0s;
        }

        /* =====================================================
           PAGE CONTENT
        ===================================================== */

        .quickshipgo-transition-content {
          position: relative;
          z-index: 9999;
          min-height: 100svh;
          opacity: 1;
        }

        /* Disable interactions while transitioning. */
        .quickshipgo-transition-shell:not([data-transition-phase="idle"]) .quickshipgo-transition-content {
          pointer-events: none;
        }

        /* =====================================================
           PHASE 1: FADE OUT
        ===================================================== */

        .quickshipgo-transition-shell[data-transition-phase="leaving"] .quickshipgo-transition-content {
          opacity: 0;
          transition: opacity ${FADE_OUT_DURATION}ms ease-in-out;
        }

        /* =====================================================
           PHASE 2: WAIT FOR DESTINATION
        ===================================================== */

        .quickshipgo-transition-shell[data-transition-phase="waiting"] .quickshipgo-transition-content {
          opacity: 0;
          transition: none;
        }

        /* =====================================================
           PHASE 3: FADE IN
        ===================================================== */

        .quickshipgo-transition-shell[data-transition-phase="entering"] .quickshipgo-transition-content {
          opacity: 1;
          transition: opacity ${FADE_IN_DURATION}ms ease-in-out;
        }

        /* =====================================================
           FLOATING PARTICLES
        ===================================================== */

        @keyframes quickshipgoParticleFloat {
          0%, 100% {
            transform: translate3d(0, 0, 0);
          }

          50% {
            transform: translate3d(12px, -24px, 0);
          }
        }

        .quickshipgo-transition-particle {
          animation-name: quickshipgoParticleFloat;
          animation-timing-function: ease-in-out;
          animation-iteration-count: infinite;
        }

        /* =====================================================
           REDUCED MOTION
        ===================================================== */

        @media (prefers-reduced-motion: reduce) {
          .quickshipgo-transition-particle {
            animation: none;
          }

          .quickshipgo-transition-background,
          .quickshipgo-transition-content {
            transition: none !important;
          }
        }
      `}</style>
    </PageTransitionContext.Provider>
  );
}

/* =========================================================
   TRANSITION HOOK
========================================================= */

export function usePageTransition() {
  const context = useContext(PageTransitionContext);

  if (!context) {
    throw new Error("usePageTransition must be used inside PageTransitionProvider.");
  }

  return context;
}

// Backwards compatibility with existing imports.
export const TileTransitionProvider = PageTransitionProvider;
export const useTileTransition = usePageTransition;