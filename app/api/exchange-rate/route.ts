import { NextResponse } from "next/server";

const USD_FALLBACK_RATES: Record<string, number> = {
  USD: 1,
  CAD: 1.37,
  EUR: 0.92,
  GBP: 0.78,
  CDF: 2800,
  NGN: 1540,
  KES: 129,
  GHS: 15.2,
};

function buildFallbackRates(base: string): Record<string, number> {
  const baseCode = base.toUpperCase();
  const baseRate = USD_FALLBACK_RATES[baseCode];
  if (!baseRate) {
    return { [baseCode]: 1, USD: 1 };
  }

  const normalized: Record<string, number> = {};
  for (const [code, usdRate] of Object.entries(USD_FALLBACK_RATES)) {
    normalized[code] = usdRate / baseRate;
  }
  normalized[baseCode] = 1;
  return normalized;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const from = searchParams.get("from") || "USD";
  const base = from.toUpperCase();

  try {
    const res = await fetch(
      `https://api.exchangerate.host/latest?base=${encodeURIComponent(base)}`,
      { cache: "no-store" }
    );

    if (!res.ok) {
      throw new Error(`Failed to fetch rates: ${res.status}`);
    }

    const data = (await res.json()) as {
      rates?: Record<string, number>;
    } | null;

    if (!data || !data.rates) {
      throw new Error("Invalid exchange API response");
    }

    return NextResponse.json({
      result: "success",
      conversion_rates: data.rates,
    });
  } catch (error) {
    console.error("Exchange-rate route failed, using fallback:", error);
    return NextResponse.json({
      result: "success",
      conversion_rates: buildFallbackRates(base),
      fallback: true,
    });
  }
}
