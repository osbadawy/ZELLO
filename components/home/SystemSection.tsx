const SPECS = [
  ["01", "01—04", "Only four objects in the opening drop. Fewer choices, better ones."],
  ["02", "48H", "Fast dispatch from our network of independent makers."],
  ["03", "LOW-FI", "Thoughtful design without the luxury markup or the theater."],
  ["04", "REPEAT", "Built for everyday use, not a one-post wonder."],
] as const;

export default function SystemSection() {
  return (
    <section id="system" aria-labelledby="system-title" className="grid scroll-mt-36 border-x-2 border-b-2 border-[#1c242b] lg:grid-cols-2">
      <div className="border-b-2 border-[#1c242b] bg-[#e5e9ed] p-7 sm:p-12 lg:border-r-2 lg:border-b-0 lg:p-[clamp(28px,6vw,76px)]">
        <div className="font-mono text-[11px] uppercase tracking-[0.06em]">02 / Operating principles</div>
        <h2 id="system-title" className="mt-5 max-w-[520px] text-[clamp(36px,6vw,72px)] leading-[0.9] font-bold tracking-[-0.09em]">LESS NOISE.<br />MORE SIGNAL.</h2>
        <p className="mt-[26px] max-w-[450px] text-sm leading-[1.5]">Penta Labs makes the useful feel considered. No endless catalog, no disposable clutter — just a tight edit of objects that earn their place in your orbit.</p>
      </div>
      <div className="grid grid-cols-2 bg-[#1c242b] text-white">
        {SPECS.map(([index, title, description]) => (
          <div key={index} className="border-r border-b border-[#66727d] px-[13px] py-[17px] even:border-r-0 sm:p-[25px]">
            <div className="font-mono text-[11px] uppercase tracking-[0.06em]">{index}</div>
            <strong className="mt-[18px] mb-[9px] block text-lg tracking-[-0.05em] text-[#b8c4ce] sm:mt-[25px] sm:text-2xl">{title}</strong>
            <p className="text-[11px] leading-[1.45] text-[#c8d1d8]">{description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
