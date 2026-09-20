import Link from "next/link";
import Brand from "./Brand";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const exploreLinks = [
    { label: "All products", href: "/shop" },
    { label: "Our system", href: "/system" },
    { label: "About ZELLO", href: "/about" },
  ];

  const supportLinks = [
    { label: "Contact us", href: "/contact" },
    { label: "Shipping & delivery", href: "/shipping" },
    { label: "Returns & refunds", href: "/returns" },
    { label: "Privacy policy", href: "/privacy" },
  ];

  return (
    <footer
      id="about"
      className="relative isolate w-full scroll-mt-36 overflow-hidden border-t border-white/[0.08] bg-[#080d18] text-white"
    >
      {/* SUBTLE BACKGROUND ILLUMINATION */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-[-250px] left-1/2 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-[#7197ff]/[0.04] blur-[120px]"
      />

      <div className="relative z-10 mx-auto max-w-[1440px] px-5 pb-8 pt-16 sm:px-8 sm:pt-20 lg:px-12 lg:pt-24">

        {/* MAIN FOOTER CONTENT */}
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1.2fr] lg:gap-10">

          {/* BRAND */}
          <div className="max-w-[340px]">
            <Brand href="/" />

            <p className="mt-6 max-w-[300px] text-[13px] leading-[1.8] tracking-[-0.01em] text-white/45">
              Thoughtfully curated essentials for modern living. Discover everyday
              objects where simplicity, function, and good design meet.
            </p>

            {/* BRAND DETAIL */}
            <div className="mt-7 inline-flex items-center gap-2 rounded-full border border-white/[0.10] bg-white/[0.04] px-4 py-2 backdrop-blur-xl">
              <span className="size-1.5 rounded-full bg-[#A9C5FF]" />

              <span className="text-[10px] font-medium tracking-[0.06em] text-white/60">
                Designed for everyday life
              </span>
            </div>
          </div>

          {/* EXPLORE */}
          <div>
            <h3 className="mb-6 text-[12px] font-semibold tracking-[-0.01em] text-white/90">
              Explore
            </h3>

            <nav aria-label="Explore ZELLO" className="flex flex-col items-start gap-4">
              {exploreLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="group inline-flex items-center gap-2 text-[12px] font-medium tracking-[-0.01em] text-white/45 transition-colors duration-300 hover:text-white"
                >
                  {link.label}

                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                    className="opacity-0 transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:opacity-100"
                  >
                    <path d="M7 17 17 7" />
                    <path d="M7 7h10v10" />
                  </svg>
                </Link>
              ))}
            </nav>
          </div>

          {/* SUPPORT */}
          <div>
            <h3 className="mb-6 text-[12px] font-semibold tracking-[-0.01em] text-white/90">
              Support
            </h3>

            <nav aria-label="Customer support" className="flex flex-col items-start gap-4">
              {supportLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="group inline-flex items-center gap-2 text-[12px] font-medium tracking-[-0.01em] text-white/45 transition-colors duration-300 hover:text-white"
                >
                  {link.label}

                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                    className="opacity-0 transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:opacity-100"
                  >
                    <path d="M7 17 17 7" />
                    <path d="M7 7h10v10" />
                  </svg>
                </Link>
              ))}
            </nav>
          </div>

          {/* NEWSLETTER */}
          <div>
            <h3 className="mb-6 text-[12px] font-semibold tracking-[-0.01em] text-white/90">
              Stay in the loop.
            </h3>

            <p className="mb-5 max-w-[280px] text-[12px] leading-[1.7] text-white/45">
              Discover new arrivals, curated collections, and the latest from ZELLO.
            </p>

            {/* NEWSLETTER CARD */}
            <div className="relative overflow-hidden rounded-[24px] border border-white/[0.12] bg-white/[0.05] p-2 shadow-[0_12px_40px_rgba(0,0,0,0.10)] backdrop-blur-xl">

              <div className="pointer-events-none absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />

              <form action="#" className="flex items-center gap-2">
                <input
                  type="email"
                  name="email"
                  placeholder="Your email address"
                  aria-label="Email address"
                  required
                  className="min-w-0 flex-1 bg-transparent px-3 py-2 text-[12px] text-white outline-none placeholder:text-white/30 focus-visible:ring-2 focus-visible:ring-[#A9C5FF]/50"
                />

                <button
                  type="submit"
                  aria-label="Subscribe to newsletter"
                  className="flex size-9 shrink-0 items-center justify-center rounded-full bg-white text-[#080d18] transition-all duration-300 hover:bg-[#edf2ff] active:scale-95"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M5 12h14" />
                    <path d="m12 5 7 7-7 7" />
                  </svg>
                </button>
              </form>
            </div>

            <p className="mt-3 text-[10px] leading-[1.6] text-white/30">
              Occasional updates. No unnecessary noise.
            </p>
          </div>
        </div>

        {/* BOTTOM DIVIDER */}
        <div className="mt-16 h-px w-full bg-gradient-to-r from-transparent via-white/[0.15] to-transparent lg:mt-20" />

        {/* BOTTOM BAR */}
        <div className="flex flex-col items-center justify-between gap-5 pt-7 sm:flex-row">

          <span className="text-[11px] font-medium tracking-[-0.01em] text-white/35">
            © {currentYear} ZELLO. All rights reserved.
          </span>

          <div className="flex items-center gap-2">
            <span className="size-1 rounded-full bg-[#A9C5FF]" />

            <span className="text-[10px] font-medium tracking-[0.08em] text-white/35">
              SIMPLICITY IN EVERY DETAIL
            </span>
          </div>

          <Link
            href="#top"
            className="inline-flex items-center gap-2 rounded-full border border-white/[0.12] bg-white/[0.05] px-4 py-2.5 text-[11px] font-medium text-white/65 backdrop-blur-xl transition-all duration-300 hover:border-white/25 hover:bg-white/[0.10] hover:text-white"
          >
            Back to top

            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="13"
              height="13"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="m5 12 7-7 7 7" />
              <path d="M12 19V5" />
            </svg>
          </Link>
        </div>
      </div>
    </footer>
  );
}