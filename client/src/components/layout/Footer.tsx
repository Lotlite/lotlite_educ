import { Linkedin, Instagram, Twitter } from 'lucide-react';
import Logo from '../ui/Logo';

interface FooterProps {
  onOpenLogin: () => void;
  isAdminLoggedIn: boolean;
  onLogout: () => void;
  setActiveSection: (sec: string) => void;
  setActiveSubTab: (tab: string) => void;
}

export default function Footer({ 
  onOpenLogin, 
  isAdminLoggedIn, 
  onLogout,
  setActiveSection,
  setActiveSubTab
}: FooterProps) {
  const programLinks = [
    { label: "B.REM Undergraduate", section: "programs", subTab: "brem-overview" },
    { label: "PG AI & PropTech Specialization", section: "programs", subTab: "pg-overview" },
    { label: "Admission Channels", section: "programs", subTab: "brem-admission" },
    { label: "Fees Structure", section: "programs", subTab: "brem-fees" },
    { label: "Academic Board & Faculty", section: "faculty", subTab: "all" },
  ];

  const exploreLinks = [
    { label: "Why SSI & Legacy", section: "about", subTab: "why-ssi" },
    { label: "Founders & Advisory Board", section: "about", subTab: "founders" },
    { label: "Placements & CTC Stats", section: "outcomes", subTab: "stats" },
    { label: "Alumni Success Stories", section: "outcomes", subTab: "carousel" },
    { label: "Venture Incubator Labs", section: "incubation", subTab: "ventures" },
    { label: "Lotlite Sprint Chronicles", section: "blogs", subTab: "insights" },
  ];

  const navigateTo = (section: string, subTab: string) => {
    setActiveSection(section);
    setActiveSubTab(subTab);
    const element = document.getElementById('workspace-section');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="bg-white pt-16 pb-24 md:pb-12 text-black relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-px bg-black/5" />
      <div className="wine-glow -bottom-40 -left-40 w-[800px] h-[800px] blur-[150px] opacity-[0.03]" />
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-20">
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-8">
              <Logo className="h-10 sm:h-12 w-auto" />
            </div>
            <p className="text-black/40 text-sm leading-relaxed mb-8 font-medium">
              Building India's Next Generation of Real Estate Leaders
            </p>
            <div className="space-y-2 text-sm text-black/60 font-medium">
              <p>Bengaluru Urban, Karnataka — 560076</p>
              <p>Email: <a href="mailto:admissions@lotlite.co" className="text-wine transition-opacity hover:opacity-80">admissions@lotlite.co</a></p>
            </div>
          </div>

          <div>
             <h4 className="text-wine uppercase tracking-[0.2em] text-[10px] font-bold mb-8">Academic Programs</h4>
             <ul className="space-y-4 text-sm text-black/40 font-medium">
               {programLinks.map((link) => (
                 <li key={link.label}>
                   <button
                     onClick={() => navigateTo(link.section, link.subTab)}
                     className="hover:text-wine text-left transition-colors cursor-pointer text-black/40 hover:text-wine font-medium text-sm block"
                   >
                     {link.label}
                   </button>
                 </li>
               ))}
             </ul>
          </div>

          <div>
             <h4 className="text-wine uppercase tracking-[0.2em] text-[10px] font-bold mb-8">Explore Campus</h4>
             <ul className="space-y-4 text-sm text-black/40 font-medium">
               {exploreLinks.map((link) => (
                 <li key={link.label}>
                   <button
                     onClick={() => navigateTo(link.section, link.subTab)}
                     className="hover:text-wine text-left transition-colors cursor-pointer text-black/40 hover:text-wine font-medium text-sm block"
                   >
                     {link.label}
                   </button>
                 </li>
               ))}
             </ul>
          </div>

          <div>
             <h4 className="text-wine uppercase tracking-[0.2em] text-[10px] font-bold mb-8">Get In Touch</h4>
             <p className="text-black/40 text-sm mb-6 leading-relaxed mb-8 font-medium">
                Ready to transform your career? Connect with our team of specialists.
             </p>
             <div className="flex gap-4">
                {[
                  { icon: <Linkedin size={18} />, href: "#" },
                  { icon: <Instagram size={18} />, href: "#" },
                  { icon: <Twitter size={18} />, href: "#" }
                ].map((social, idx) => (
                  <a key={idx} href={social.href} className="w-10 h-10 rounded-lg border border-black/5 flex items-center justify-center text-black/40 hover:border-wine hover:text-wine transition-all shadow-sm hover:-translate-y-1 bg-white">
                    {social.icon}
                  </a>
                ))}
             </div>
          </div>
        </div>

        <div className="pt-10 md:pt-12 border-t border-black/5 flex flex-col md:flex-row justify-between items-center gap-4 md:gap-6">
           <p className="text-black/20 text-[8px] md:text-[10px] uppercase font-bold tracking-[0.2em] md:tracking-[0.3em] text-center">© 2025 Lotlite Education. All rights reserved.</p>
           <div className="flex flex-wrap gap-4 md:gap-8 items-center text-black/20 text-[8px] md:text-[10px] uppercase font-bold tracking-[0.2em] md:tracking-[0.3em]">
              <a href="#" className="hover:text-wine transition-colors">Terms of Use</a>
              <a href="#" className="hover:text-wine transition-colors">Privacy Policy</a>
              {isAdminLoggedIn ? (
                <button onClick={onLogout} className="hover:text-wine transition-colors font-bold uppercase cursor-pointer text-wine">Logout Session</button>
              ) : (
                <button onClick={onOpenLogin} className="hover:text-wine transition-colors font-bold uppercase cursor-pointer text-muted-foreground/60">Admin Access</button>
              )}
           </div>
        </div>
      </div>
    </footer>
  );
}
