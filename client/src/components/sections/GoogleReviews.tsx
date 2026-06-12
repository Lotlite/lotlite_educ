import { Star } from 'lucide-react';
import { motion } from 'motion/react';

const reviews = [
  { name: "Dr. Suruchi Dedgaonkar", text: "All the trainers are knowledgeable and experts. They are keen to teach." },
  { name: "Gitanjali yadav", text: "Nice session delivered by Naga Sir, we get lots of insights of swift. Enjoyed the sessions, learnt lots of things in Apple app development." },
  { name: "gopal deshmukh", text: "Naga Murli is a best trainer, the learning experience is good." },
  { name: "_Ojas_Deshpande", text: "Great experience working with IOS Dev hands on. It was great." },
  { name: "Dr. Fatima M Inamdar", text: "It's very interesting session." },
  { name: "_Anwesha Damle", text: "As this was hands on training it was really informative. We got to know about the upcoming technologies." },
  { name: "Vedant Lodha", text: "Love the way all the topics were explained." },
  { name: "Juie Pachupate", text: "The explaination of topics, relating to real life situations and hands on made it interesting." },
  { name: "_AYUSHI CHOUGULE", text: "Very interactive session and was very much informative." },
  { name: "prachi gade", text: "Experience good." },
  { name: "Harshada Khenat", text: "Very good Technical knowledge which you share with us n very friendly behaviour... Slove all the doubts." },
  { name: "Avdhut Lohakare", text: "Thank you for sharing your experience with us....." },
  { name: "Snehal Chavan", text: "Very good teaching." },
  { name: "Pravin Kondhalkar", text: "Awesome great learn from many things good knowledge got." },
  { name: "Raj Mahesh Thapa", text: "I had a outstanding experience." },
];

export default function GoogleReviews() {
  return (
    <section className="py-20 md:py-28 bg-offwhite relative overflow-hidden" id="reviews">
      <div className="max-w-7xl mx-auto px-6 mb-12 text-center" data-aos="fade-up">
        <span className="text-wine text-[10px] font-bold uppercase tracking-[0.4em] block mb-4">Student Testimonials</span>
        <h2 className="text-3xl md:text-5xl font-serif text-black leading-tight mb-4">
          Rated 5 Stars by Our Community
        </h2>
        <div className="flex items-center justify-center gap-1 mb-4">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star key={star} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-6 relative z-10 w-full overflow-hidden">
        {/* Single Marquee Row */}
        <div className="marquee-container flex">
          <div className="marquee-content flex gap-6 px-3">
            {[...reviews, ...reviews].map((review, idx) => (
              <div key={idx} className="bg-white border border-black/5 rounded-2xl p-6 w-[320px] md:w-[380px] flex-shrink-0 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="flex gap-1 mb-3">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-muted text-sm leading-relaxed mb-6 font-medium italic">"{review.text}"</p>
                </div>
                <div className="flex items-center gap-3 border-t border-black/5 pt-4">
                  <div className="w-8 h-8 rounded-full bg-wine/10 flex items-center justify-center text-wine font-bold text-xs">
                    {review.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="text-black font-bold text-xs tracking-tight">{review.name}</h4>
                    <p className="text-black/30 text-[9px] uppercase tracking-widest font-bold">Verified Student</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
