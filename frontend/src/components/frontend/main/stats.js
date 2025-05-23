import { useState, useEffect, useRef } from "react";
import { Music2, Calendar, Star, Users } from "lucide-react";

const CountUp = ({ end, suffix = "" }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const target = parseInt(end.replace(/,|\+/g, ""), 10);
    let current = 0;
    const step = Math.ceil(target / 50); // Increment in 50 steps
    const interval = setInterval(() => {
      current += step;
      if (current >= target) {
        setCount(target);
        clearInterval(interval);
      } else {
        setCount(current);
      }
    }, 40); // 40ms per step for smooth animation
    return () => clearInterval(interval);
  }, [end]);

  return (
    <>
      {count.toLocaleString()}
      {suffix}
    </>
  );
};

const Stats = () => {
  const [startCounting, setStartCounting] = useState(false);
  const statsRef = useRef(null);

  const stats = [
    { value: "100,000", label: "Artist", suffix: "+", icon: <Music2 className="w-6 h-6 text-primary" /> },
    { value: "25,000", label: "Events Booked", suffix: "+", icon: <Calendar className="w-6 h-6 text-primary" /> },
    { value: "98", label: "Satisfaction Rate", suffix: "%", icon: <Star className="w-6 h-6 text-primary" /> },
    { value: "50", label: "Countries", suffix: "+", icon: <Users className="w-6 h-6 text-primary" /> },
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStartCounting(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );

    if (statsRef.current) observer.observe(statsRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={statsRef} className="py-16 bg-muted/30">
      <div className="container mx-auto max-w-screen-xl px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div
              key={index}
              className={`text-center transition-all duration-700 delay-${index * 100} ${
                startCounting ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
              }`}
            >
              <div className="flex justify-center mb-4">{stat.icon}</div>
              <div className="text-3xl md:text-4xl font-bold text-primary">
                {startCounting ? <CountUp end={stat.value} suffix={stat.suffix} /> : "0" + stat.suffix}
              </div>
              <div className="text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Stats;