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
    // Fail gracefully: return empty data
    return { data: {} }
  }

  const params = new URLSearchParams({ base_currency: base })
  if (symbols && symbols.length) params.set('currencies', symbols.join(','))
  params.set('apikey', key)

  const url = `https://api.currencyapi.com/v3/latest?${params.toString()}`

  try {
    const res = await fetch(url)
    if (!res.ok) {
      // Fail gracefully: return empty data
      return { data: {} }
    }

    const json = (await res.json()) as CurrencyApiLatestResponse
    return json
  } catch (error) {
    // Fail gracefully: return empty data
    return { data: {} }
  }
}

export default fetchRates
