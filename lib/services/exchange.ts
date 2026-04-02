import { fetchRates } from '@/lib/currencyapi'

export const DASHBOARD_RATE_CODES = ["CAD", "EUR", "GBP", "CDF"] as const;

export type DashboardRateCode = (typeof DASHBOARD_RATE_CODES)[number];
export type DashboardRates = Record<DashboardRateCode, number | null>;

export async function getExchangeRates(): Promise<DashboardRates | null> {
  try {
    const data = await fetchRates({ base: 'USD', symbols: [...DASHBOARD_RATE_CODES] })
    return {
      CAD: data.data.CAD?.value ?? null,
      EUR: data.data.EUR?.value ?? null,
      GBP: data.data.GBP?.value ?? null,
      CDF: data.data.CDF?.value ?? null,
    }
  } catch (error) {
    console.error('Failed to fetch exchange rates:', error)
    return null
  }
}
