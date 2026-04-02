export type CurrencyApiLatestResponse = {
  data: Record<
    string,
    {
      code: string
      value: number
    }
  >
  meta?: Record<string, any>
}

type FetchRatesOptions = {
  base?: string
  symbols?: string[]
}

export async function fetchRates({ base = 'USD', symbols }: FetchRatesOptions = {}) {
  const key = process.env.CURRENCYAPI_KEY
  if (!key) {
    // Return mock/empty data to prevent app crash
    return { data: {} } as CurrencyApiLatestResponse
  }

  try {
    const params = new URLSearchParams({ base_currency: base })
    if (symbols && symbols.length) params.set('currencies', symbols.join(','))
    params.set('apikey', key)

    const url = `https://api.currencyapi.com/v3/latest?${params.toString()}`

    const res = await fetch(url)
    if (!res.ok) {
      // Return mock/empty data instead of throwing to prevent app crash
      return { data: {} } as CurrencyApiLatestResponse
    }

    const json = (await res.json()) as CurrencyApiLatestResponse
    return json
  } catch (error) {
    // Return mock/empty data on any error to prevent app crash
    console.warn('CurrencyAPI fetch failed, using empty data:', error)
    return { data: {} } as CurrencyApiLatestResponse
  }
}

export default fetchRates
