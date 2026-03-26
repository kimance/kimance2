export const DASHBOARD_RATE_CODES = ["CAD", "EUR", "GBP", "CDF"] as const;

export type DashboardRateCode = (typeof DASHBOARD_RATE_CODES)[number];
export type DashboardRates = Record<DashboardRateCode, number | null>;

export async function getExchangeRates(): Promise<DashboardRates | null> {
  return {
    CAD: 1.37,
    EUR: 0.86,
    GBP: 0.74,
    CDF: 2270,
  };
}
