import { Metadata } from "next";
import Hero from "@/app/sections/Hero";
import Features from "@/app/sections/Features";
import GlobalReach from "@/app/sections/GlobalReach";
import CTA from "@/app/sections/CTA";
import RateTicker from "@/app/components/RateTicker";
import MarketingLayout from "@/app/(marketing)/layout";

export const metadata: Metadata = {
  title: "Kimance - Global Financial Platform | Send, Store, Exchange",
  description: "Send. Store. Exchange. Protect. Grow. Money without borders. Kimance is the AI-powered global fintech platform for seamless international transactions.",
  keywords: ["fintech", "money transfer", "global payments", "crypto", "multi-currency", "remittance"],
  openGraph: {
    title: "Kimance - Money Without Borders",
    description: "Global financial platform for seamless international transactions",
    type: "website",
  },
};

export default function MarketingPage() {
  return (
    <MarketingLayout>
      <div className="flex flex-col">
        <Hero />
        <RateTicker />
        <GlobalReach />
        <Features />
        <CTA />
      </div>
    </MarketingLayout>
  );
}
