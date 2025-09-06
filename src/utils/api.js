// const API_BASE_URL = 'http://localhost:3000/api'
const API_BASE_URL = 'https://serene-kelpie-d1e0aa.netlify.app/api'

export async function apiRequest(endpoint, options = {}, apiKey) {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      ...options.headers
    }
  })
  
  if (response.status === 401) {
    localStorage.removeItem('apiKey')
    throw new Error('Unauthorized')
  }
  
  return response.json()
}