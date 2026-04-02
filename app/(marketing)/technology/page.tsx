"use client";

import { useRef, useEffect } from "react";
import Link from "next/link";
import { Brain, Shield, Activity, Cloud, Cpu, ArrowRight, Zap } from "lucide-react";
import { useFadeIn } from "@/app/hooks/useFadeIn";
import { useStaggerReveal } from "@/app/hooks/useStaggerReveal";
import { useLang } from "@/app/providers/LanguageContext";

const techIcons = [Brain, Shield, Activity, Cloud, Cpu];

function TechnologyHero() {
  const headerRef = useFadeIn({ delay: 0.1, y: 30 });
  const { t } = useLang();
  const tech = t.about.technology;

  return (
    <section className="py-24 bg-gradient-to-b from-slate-50 via-violet-50/40 to-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div ref={headerRef} className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 bg-violet-50 border border-violet-200 text-violet-600 text-sm font-semibold px-4 py-1.5 rounded-full mb-6">
            <Cpu className="w-4 h-4" />{tech.badge}
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 tracking-tight mb-4">
            {tech.heading} <span className="text-violet-600">{tech.headingHighlight}</span>
          </h1>
          <p className="text-xl text-gray-500 leading-relaxed">{tech.subheading}</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {tech.items.map((item, i) => {
            const Icon = techIcons[i];
            return (
              <div key={i} className="tech-item flex items-start gap-4 bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md hover:border-violet-200 transition-all duration-300">
                <div className="w-12 h-12 bg-violet-500 rounded-xl flex items-center justify-center shrink-0 shadow-md shadow-violet-200">
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">{item.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{item.description}</p>
                </div>
              </div>
            );
          })}
        </div>
        <p className="text-center text-gray-500 mt-10 max-w-2xl mx-auto text-base leading-relaxed">{tech.footer}</p>
      </div>
    </section>
  );
}

function TechnologyCTA() {
  const [isVisible, setIsVisible] = require("react").useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const { t } = useLang();
  const c = t.about.cta;

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) { setIsVisible(true); observer.disconnect(); } }, { threshold: 0.1 });
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="py-24 bg-slate-900 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-10">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-violet-400 rounded-full blur-[100px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-teal-400 rounded-full blur-[100px]" />
      </div>
      <div className={`max-w-3xl mx-auto px-4 text-center text-white relative z-10 transition-all duration-1000 ease-out ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
        <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">{c.heading}</h2>
        <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto leading-relaxed">{c.subheading}</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/register" className="inline-block bg-violet-500 text-white px-10 py-4 rounded-full text-lg font-bold hover:bg-violet-400 hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl">{c.cta}</Link>
          <Link href="/contact" className="inline-block border border-white/30 hover:border-white text-white px-10 py-4 rounded-full text-lg font-medium hover:bg-white/10 transition-all duration-300">{c.secondary}</Link>
        </div>
      </div>
    </section>
  );
}

export default function TechnologyPage() {
  return (
    <div className="flex flex-col">
      <TechnologyHero />
      <TechnologyCTA />
    </div>
  );
}
