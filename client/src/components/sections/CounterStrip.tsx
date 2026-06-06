import { useState, useEffect, useRef } from 'react';

function Counter({ end, suffix = "", duration = 2 }: { end: string, suffix?: string, duration?: number }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  // Parse numeric part
  const numericValue = parseFloat(end.replace(/[^0-9.]/g, '')) || 0;
  const nonNumeric = end.replace(/[0-9.]/g, '');

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true);
      },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return;
    let start = 0;
    const increment = numericValue / (duration * 60);
    const handleCount = () => {
      start += increment;
      if (start >= numericValue) {
        setCount(numericValue);
      } else {
        setCount(start);
        requestAnimationFrame(handleCount);
      }
    };
    handleCount();
  }, [isVisible, numericValue, duration]);

  return (
    <span ref={ref} className="text-2xl font-bold text-black">
      {count.toFixed(numericValue < 10 && numericValue % 1 !== 0 ? 1 : 0)}
      {nonNumeric}
      {suffix}
    </span>
  );
}

export default function CounterStrip() {
  const stats = [
    { value: "9L", label: "Average CTC" },
    { value: "62%", label: "In Deal-Facing Roles" },
    { value: "3.2X", label: "Avg CTC Jump" },
    { value: "40+", label: "Partner Firms" },
    { value: "14L", label: "Top 25% CTC" },
  ];

  return (
    <div className="bg-transparent border-y border-border py-8 md:py-10 relative z-20">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-5 gap-6 md:gap-8">
        {stats.map((stat, idx) => (
          <div key={idx} className="flex flex-col items-center text-center">
            <div className="mb-2">
              <Counter end={stat.value} />
            </div>
            <span className="text-muted text-[9px] uppercase font-bold tracking-[0.2em]">{stat.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
