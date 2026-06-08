export default function TrustMarquee() {
  const row1 = ["Hiranandani", "Lodha", "99acres", "CBRE", "JLL", "Knight Frank", "NoBroker", "Square Yards", "PropTiger", "Magicbricks"];
  const row2 = ["RICS", "NAREDCO", "IIM", "Kellogg", "MIT", "BCG", "Flipkart", "IIT Bombay", "IIT Kanpur", "Delhi School of Economics"];

  return (
    <section className="py-8 md:py-10 bg-white dark:bg-[#121212] overflow-hidden relative">
      <div className="max-w-7xl mx-auto px-6 text-center mb-6 relative z-10">
        <h2 className="text-wine font-bold text-xs uppercase tracking-[0.3em]" data-aos="fade-up">Backed by the People Who Built Indian Real Estate</h2>
      </div>

      <div className="flex flex-col gap-3 opacity-80 relative z-10">
        <div className="marquee-container">
          <div className="marquee-content">
            {[...row1, ...row1].map((item, idx) => (
              <span key={idx} className="bg-linear-to-br from-white to-neutral-50 dark:from-zinc-900 dark:to-zinc-800 text-muted dark:text-zinc-300 border border-border dark:border-white/10 px-5 py-2 font-semibold whitespace-nowrap text-xs rounded-lg shadow-sm">
                {item}
              </span>
            ))}
          </div>
        </div>

        <div className="marquee-container">
          <div className="marquee-content-reverse">
            {[...row2, ...row2].map((item, idx) => (
              <span key={idx} className="bg-linear-to-br from-white to-neutral-50 dark:from-zinc-900 dark:to-zinc-800 text-muted dark:text-zinc-300 border border-border dark:border-white/10 px-5 py-2 font-semibold whitespace-nowrap text-xs rounded-lg shadow-sm">
                {item}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
