import toast from 'react-hot-toast'

const API_BASE_URL = 'https://serene-kelpie-d1e0aa.netlify.app/api'

export async function apiRequest(endpoint, options = {}, apiKey) {
  try {
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
      toast.error('Unauthorized - Please login again')
      throw new Error('Unauthorized')
    }
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Request failed' }))
      toast.error(error.message || `Error: ${response.status}`)
      throw new Error(error.message || 'Request failed')
    }
    
    return response.json()
  } catch (error) {
    if (error.message !== 'Unauthorized') {
      toast.error(error.message || 'Network error')
    }
    throw error
  }
}