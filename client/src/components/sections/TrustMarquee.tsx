import geraLogo from '../../assets/Company Logos/Gera Developments.jpg';
import godrejLogo from '../../assets/Company Logos/Godrej Properties.png';
import kohinoorLogo from '../../assets/Company Logos/Kohinoor Group.png';
import krisalaLogo from '../../assets/Company Logos/Krisala Developers.png';
import lodhaLogo from '../../assets/Company Logos/Lodha Group.png';
import paranjapeLogo from '../../assets/Company Logos/Paranjape_Schemes_Logo1.jpg';
import saheelLogo from '../../assets/Company Logos/Saheel Properties.png';
import shapoorjiLogo from '../../assets/Company Logos/Shapoorji Pallonji Real Estate.png';
import vtpLogo from '../../assets/Company Logos/VTP Realty.jpg';

const companyLogos = [
  { src: godrejLogo, alt: 'Godrej Properties' },
  { src: vtpLogo, alt: 'VTP Realty' },
  { src: kohinoorLogo, alt: 'Kohinoor Group' },
  { src: lodhaLogo, alt: 'Lodha Group' },
  { src: geraLogo, alt: 'Gera Developments' },
  { src: paranjapeLogo, alt: 'Paranjape Schemes' },
  { src: shapoorjiLogo, alt: 'Shapoorji Pallonji Real Estate' },
  { src: saheelLogo, alt: 'Saheel Properties' },
  { src: krisalaLogo, alt: 'Krisala Developers' },
];

export default function TrustMarquee() {
  return (
    <section className="py-10 md:py-14 bg-white dark:bg-[#121212] overflow-hidden relative">
      <div className="max-w-7xl mx-auto px-6 text-center mb-8 relative z-10">
        <h2 className="text-wine font-semibold text-xs uppercase tracking-[0.3em]" data-aos="fade-up">
          Collabrated with the Best in Indian Real Estate
        </h2>
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10" data-aos="fade-up" data-aos-delay="100">
        <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 md:gap-8">
          {companyLogos.map((logo, idx) => (
            <div
              key={idx}
              className="bg-white dark:bg-white/95 p-3 rounded-xl border border-neutral-100 dark:border-neutral-200/20 shadow-xs flex items-center justify-center w-28 sm:w-32 md:w-36 h-14 sm:h-16 transition-all duration-300 hover:shadow-md hover:border-neutral-200 hover:-translate-y-0.5"
            >
              <img
                src={logo.src}
                alt={logo.alt}
                className="max-h-full max-w-full object-contain grayscale opacity-80 hover:grayscale-0 hover:opacity-100 transition-all duration-300"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

