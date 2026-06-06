import axios from 'axios'

const apiBaseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000'

const marketApi = axios.create({
  baseURL: apiBaseUrl
})

export async function getMarketOutlook(symbol) {
  const response = await marketApi.get(`/market/outlook/${symbol}`)
  return response.data
}
