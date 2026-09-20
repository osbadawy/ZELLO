export default function ShopIntro() {
  return (
    <section  className="mx-auto w-[calc(100%-20px)] max-w-[1440px] border-x-2 border-b-2 border-[#1c242b] sm:w-[calc(100%-32px)]">
      <div  className="grid min-h-[300px] grid-cols-1 lg:grid-cols-[1.5fr_0.5fr]">
        <div className="flex flex-col justify-between p-6 sm:p-10 lg:p-14">
          <div className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.12em] text-[#2f6fed]">
            <span className="size-2 bg-[#1c242b]" />

            PENTA LABS / COLLECTIONS
          </div>

          <div className="mt-14">
            <h1 className="text-[clamp(64px,9vw,140px)] leading-[0.9] font-bold tracking-[-0.105em]">
              THE
              <br />

              <span className="text-[#2f6fed]">
                SHOP.
              </span>
            </h1>
          </div>
        </div>

        <div className="flex flex-col justify-end border-t-2 border-[#1c242b] bg-[#e5e9ed] p-6 sm:p-10 lg:border-t-0 lg:border-l-2">
          <div className="mb-8 font-mono text-[10px] uppercase tracking-[0.12em] text-[#2f6fed]">
            001 — 007 / THE COLLECTION
          </div>

          <p className="max-w-[300px] text-[14px] leading-[1.6]">
            Objects for modern living.
            <br />
            Curated for everyday use.
            <br />
            Designed to feel different.
          </p>

          <div className="mt-8 flex items-center justify-between border-t border-[#1c242b] pt-4 font-mono text-[10px] uppercase tracking-[0.08em]">
            <span>
              EXPLORE CATEGORIES
            </span>

            <span>↓</span>
          </div>
        </div>
      </div>
    </section>
  );
}
