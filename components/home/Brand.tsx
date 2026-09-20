type BrandProps = { href?: string };

export default function Brand({ href = "#top" }: BrandProps) {
  return (
    <a
      href={href}
      aria-label="Penta Labs home"
      className="inline-flex w-fit items-center gap-2.5 text-xl font-bold tracking-[-0.08em] md:text-[29px]"
    >
      <span className="grid size-7 place-items-center border-2 border-[#1c242b] bg-[#2f6fed] text-[15px] tracking-[-0.12em] shadow-[4px_4px_0_#1c242b]">
        P/
      </span>
      PENTA LABS
    </a>
  );
}
