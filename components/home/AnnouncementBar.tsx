const ANNOUNCEMENTS = [
  "FREE SHIPPING OVER $75",
  "DESIGNED FOR DAILY USE",
  "NEW DROP / 09.19.26",
  "FREE SHIPPING OVER $75",
  "DESIGNED FOR DAILY USE",
];

export default function AnnouncementBar() {
  return (
    <div className="overflow-hidden border-b-2 border-[#1c242b] bg-[#2f6fed]" aria-label="Store announcement">
      <div className="flex min-w-max justify-around gap-14 px-5 py-2.5 text-[10px] font-semibold whitespace-nowrap md:min-w-full">
        {ANNOUNCEMENTS.map((item, index) => (
          <span key={`${index}-${item}`}>{item}</span>
        ))}
      </div>
    </div>
  );
}
