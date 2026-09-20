import Brand from "./Brand";

export default function Footer() {
  return (
    <footer id="about" className="grid scroll-mt-36 grid-cols-2 gap-[30px] px-0 pt-[30px] pb-[45px] lg:grid-cols-[1.4fr_1fr_1fr]">
      <div className="col-span-2 max-w-[300px] lg:col-span-1">
        <Brand />
        <p className="mt-3 text-[11px] leading-[1.6] text-[#66727d]">Utility goods for modern living.<br />Independent, online, built with intention.</p>
      </div>
      <div>
        <h3 className="mb-3.5 font-mono text-base tracking-[-0.04em]">Explore</h3>
        <a href="#shop" className="block w-fit text-[11px] leading-[1.6] text-[#66727d] hover:underline hover:decoration-2 hover:decoration-[#2f6fed]">All products</a>
        <a href="#system" className="block w-fit text-[11px] leading-[1.6] text-[#66727d] hover:underline hover:decoration-2 hover:decoration-[#2f6fed]">Our system</a>
        <a href="mailto:hello@example.com" className="block w-fit text-[11px] leading-[1.6] text-[#66727d] hover:underline hover:decoration-2 hover:decoration-[#2f6fed]">Contact</a>
      </div>
      <div>
        <h3 className="mb-3.5 font-mono text-base tracking-[-0.04em]">Dispatch</h3>
        <p className="text-[11px] leading-[1.6] text-[#66727d]">Mon—Fri / 09:00—18:00<br />Worldwide delivery<br />Returns within 30 days</p>
      </div>
      <div className="col-span-full flex flex-wrap items-center justify-between gap-2 border-t-2 border-[#1c242b] pt-[18px] font-mono text-[10px] text-[#66727d]">
        <span>© 2026 PENTA LABS</span><span>BUILT FOR THE EVERYDAY / 001</span>
      </div>
    </footer>
  );
}
