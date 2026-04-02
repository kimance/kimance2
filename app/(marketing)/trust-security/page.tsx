"use client";

import { useRef, useEffect } from "react";
import Link from "next/link";
import { Shield, Lock, Fingerprint, Activity, BadgeCheck, ArrowRight, Zap } from "lucide-react";
import { useFadeIn } from "@/app/hooks/useFadeIn";
import { useStaggerReveal } from "@/app/hooks/useStaggerReveal";
import { useLang } from "@/app/providers/LanguageContext";

const trustIcons = [Shield, Lock, Fingerprint, Activity];

function TrustSecurityHero() {
  const headerRef = useFadeIn({ delay: 0.1, y: 30 });
  const gridRef = useStaggerReveal({ stagger: 0.12, duration: 0.7, selector: ".trust-item" });
  const { t } = useLang();
  const ts = t.about.trustSecurity;

  return (
    <section className="py-24 bg-gradient-to-br from-slate-50 via-violet-50/40 to-white relative overflow-hidden">
      <div className="absolute inset-0 opacity-[0.025] pointer-events-none" style={{ backgroundImage: "radial-gradient(circle, #7c3aed 1px, transparent 1px)", backgroundSize: "32px 32px" }} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div ref={headerRef} className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 bg-violet-50 border border-violet-200 text-violet-600 text-sm font-semibold px-4 py-1.5 rounded-full mb-6">
            <Shield className="w-4 h-4" />{ts.badge}
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 tracking-tight mb-4">
            {ts.heading} <span className="text-violet-600">{ts.headingHighlight}</span>
          </h1>
          <p className="text-xl text-gray-500 leading-relaxed">{ts.subheading}</p>
        </div>
        <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {ts.items.map((item, i) => {
            const Icon = trustIcons[i];
            return (
              <div key={i} className="trust-item flex items-start gap-5 bg-white rounded-2xl p-7 shadow-sm border border-gray-100 hover:shadow-md hover:border-violet-200 transition-all duration-300">
                <div className="w-14 h-14 bg-violet-500 rounded-xl flex items-center justify-center shrink-0 shadow-md shadow-violet-200">
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{item.title}</h3>
                  <p className="text-gray-500 leading-relaxed">{item.description}</p>
                </div>
              </div>
            );
          })}
        </div>
        <div className="text-center mt-12">
          <div className="inline-flex items-center gap-6 bg-white rounded-2xl px-8 py-4 shadow-sm border border-gray-100">
            <span className="flex items-center gap-2 text-sm font-semibold text-gray-600"><BadgeCheck className="w-5 h-5 text-violet-500" />{ts.badge1}</span>
            <div className="w-px h-5 bg-gray-200" />
            <span className="flex items-center gap-2 text-sm font-semibold text-gray-600"><BadgeCheck className="w-5 h-5 text-violet-500" />{ts.badge2}</span>
            <div className="w-px h-5 bg-gray-200" />
            <span className="flex items-center gap-2 text-sm font-semibold text-gray-600"><BadgeCheck className="w-5 h-5 text-violet-500" />{ts.badge3}</span>
          </div>
        </div>
      </div>
    </section>
  );
}

function TrustSecurityCTA() {
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

export default function TrustSecurityPage() {
  return (
    <div className="flex flex-col">
      <TrustSecurityHero />
      <TrustSecurityCTA />
    </div>
  );
}
