"use client";

import { useEffect, useRef, useState } from "react";
import {
  getExchangeRates,
  type DashboardRateCode,
  type DashboardRates,
} from "@/lib/services/exchange";

type CurrencyCard = {
  code: DashboardRateCode;
  label: string;
  region: "Africa" | "Europe" | "Americas";
};

const CURRENCIES: CurrencyCard[] = [
  { code: "CAD", label: "CAD", region: "Americas" },
  { code: "EUR", label: "EUR", region: "Europe" },
  { code: "GBP", label: "GBP", region: "Europe" },
  { code: "CDF", label: "CDF", region: "Africa" },
];

const fallbackRates: Record<DashboardRateCode, number> = {
  CAD: 1.37,
  EUR: 0.86,
  GBP: 0.74,
  CDF: 2276.52,
};

interface CurrencyDashboardProps {
  initialRates: DashboardRates | null;
}

export default function CurrencyDashboard({
  initialRates,
}: CurrencyDashboardProps) {
  const [rates, setRates] = useState<DashboardRates | null>(initialRates);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState<"All" | "Africa" | "Europe" | "Americas">("All");
  const ratesRef = useRef<DashboardRates | null>(initialRates);

  useEffect(() => {
    ratesRef.current = rates;
  }, [rates]);

  const refreshRates = async (isActive?: () => boolean) => {
    if (isActive && !isActive()) return;
    if (ratesRef.current) {
      setRefreshing(true);
    }

    const liveRates = await getExchangeRates();
    if (isActive && !isActive()) return;
    if (liveRates !== null) {
      setRates(liveRates);
    }
    if (!isActive || isActive()) {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    let active = true;
    const isActive = () => active;
    const intervalId = setInterval(() => {
      void refreshRates(isActive);
    }, 60_000);
    return () => {
      active = false;
      clearInterval(intervalId);
    };
  }, []);

  const visibleCurrencies =
    filter === "All"
      ? CURRENCIES
      : CURRENCIES.filter((currency) => currency.region === filter);

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm min-h-64 flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="material-icons-outlined text-purple-600">currency_exchange</span>
          <h3 className="font-serif text-xl font-bold text-gray-900">Today&apos;s Rates</h3>
        </div>
        <div className="flex items-center gap-2">
          <span
            className={`w-2 h-2 rounded-full ${rates ? "bg-green-400 animate-pulse" : "bg-gray-400"}`}
          ></span>
          <span className="text-xs text-gray-500 font-medium">{rates ? "LIVE" : "Demo"}</span>
        </div>
      </div>

      <div className="flex items-center gap-2 mb-4 overflow-x-auto pb-1">
        {(["All", "Africa", "Europe", "Americas"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`shrink-0 px-4 py-1.5 rounded-full text-sm font-semibold transition-all ${
              filter === tab
                ? "bg-purple-600 text-white shadow-sm"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className={`flex gap-4 overflow-x-auto pb-2 ${rates ? "" : "opacity-80"}`}>
        {visibleCurrencies.map((currency) => {
          const value = rates?.[currency.code] ?? fallbackRates[currency.code];
          return (
            <div
              key={currency.code}
              className="shrink-0 w-[140px] p-4 rounded-xl border border-gray-200 bg-white shadow-sm flex flex-col items-center justify-center text-center"
            >
              <p className="text-sm text-gray-500 font-semibold tracking-wide">{currency.label}</p>
              <p className="text-2xl font-semibold text-purple-600 mt-3 leading-none">{value.toFixed(4)}</p>
              <p className="text-xs text-gray-400 mt-3 uppercase">Per USD</p>
            </div>
          );
        })}
      </div>

      <div className="mt-3 h-2 w-44 rounded-full bg-gray-300/80" />

      {refreshing && (
        <p className="text-xs text-gray-400 mt-3">Refreshing rates...</p>
      )}
    </div>
  );
}
