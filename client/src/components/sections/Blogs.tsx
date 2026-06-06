import { motion } from 'motion/react';
import { ArrowUpRight } from 'lucide-react';

const blogPosts = [
  {
    title: "The Future of PropTech in India: 2026 Outlook",
    excerpt: "How AI and blockchain are fundamentally changing property valuation and transparency in Indian metros.",
    date: "May 10, 2026",
    category: "PropTech"
  },
  {
    title: "Why Founders are the Best Teachers",
    excerpt: "Real estate is an industry built on relationships and street-smarts. Here's why Lotlite chose founder-led academics.",
    date: "April 28, 2026",
    category: "Education"
  },
  {
    title: "The Zero-CAC Playbook for Real Estate",
    excerpt: "Building a distribution engine that doesn't rely solely on paid ads. Lessons from our latest build sprint.",
    date: "April 15, 2026",
    category: "Growth"
  }
];

export default function Blogs() {
  return (
    <section className="py-16 md:py-24 bg-transparent relative overflow-hidden scroll-mt-20" id="blogs">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-8" data-aos="fade-up">
          <div>
            <span className="text-wine text-[10px] font-bold uppercase tracking-[0.4em] block mb-4">INSIGHTS & PERSPECTIVES</span>
            <h2 className="text-4xl md:text-5xl text-black font-serif leading-tight">Lotlite <span className="text-wine">Chronicles</span></h2>
          </div>
          <button className="text-wine font-bold text-sm uppercase tracking-widest flex items-center gap-2 hover:gap-3 transition-all border-b border-wine/20 pb-1">
            Browse All Posts <ArrowUpRight size={16} />
          </button>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {blogPosts.map((post, idx) => (
            <motion.div
              key={idx}
              whileHover={{ y: -5 }}
              className="group cursor-pointer"
              data-aos="fade-up"
              data-aos-delay={idx * 100}
            >
              <div className="relative aspect-[16/10] bg-offwhite rounded-2xl mb-6 overflow-hidden border border-border">
                <div className="absolute inset-0 bg-wine/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="absolute inset-0 flex items-center justify-center text-wine/20 font-serif text-6xl select-none group-hover:scale-110 transition-transform">
                  {post.title[0]}
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <span className="text-wine text-[10px] font-bold uppercase tracking-widest">{post.category}</span>
                  <span className="text-muted text-[10px] uppercase tracking-widest">{post.date}</span>
                </div>
                <h3 className="text-2xl font-bold text-black group-hover:text-wine transition-colors leading-tight">
                  {post.title}
                </h3>
                <p className="text-muted text-sm leading-relaxed line-clamp-2">
                  {post.excerpt}
                </p>
                <div className="pt-2">
                   <span className="text-black font-bold text-[10px] uppercase tracking-widest group-hover:text-wine transition-colors">Read More →</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
