// lib/api.ts - API client for connecting to backend

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

interface ApiResponse<T> {
  data?: T
  error?: string
  message?: string
}

class ApiClient {
  private baseURL: string
  private token: string | null = null

  constructor(baseURL: string = API_BASE_URL) {
    this.baseURL = baseURL
    // Get token from localStorage if available
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('access_token')
    }
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`
    
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    }

    if (this.token) {
      (headers as Record<string, string>)['Authorization'] = `Bearer ${this.token}`
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      })

      const data = await response.json()

      if (!response.ok) {
        return { error: data.detail || data.message || 'An error occurred' }
      }

      return { data }
    } catch (error) {
      console.error('API request failed:', error)
      return { error: 'Network error occurred' }
    }
  }

  // Authentication methods
  async login(email_or_phone: string, password: string) {
    const formData = new FormData()
    formData.append('username', email_or_phone)
    formData.append('password', password)

    const response = await fetch(`${this.baseURL}/api/v1/auth/login`, {
      method: 'POST',
      body: formData,
    })

    const data = await response.json()

    if (response.ok && data.access_token) {
      this.token = data.access_token
      if (typeof window !== 'undefined') {
        localStorage.setItem('access_token', data.access_token)
        localStorage.setItem('refresh_token', data.refresh_token)
        localStorage.setItem('user', JSON.stringify(data.user))
      }
    }

    return data
  }

  async register(userData: {
    email: string
    password: string
    first_name: string
    last_name: string
    phone: string
  }) {
    return this.request('/api/v1/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    })
  }

  async logout() {
    this.token = null
    if (typeof window !== 'undefined') {
      localStorage.removeItem('access_token')
      localStorage.removeItem('refresh_token')
      localStorage.removeItem('user')
    }
  }

  async getCurrentUser() {
    return this.request('/api/v1/auth/me', {
      method: 'GET',
    })
  }

  // Transaction methods
  async getTransactions(page: number = 1, limit: number = 10) {
    return this.request(`/api/v1/transactions?page=${page}&limit=${limit}`, {
      method: 'GET',
    })
  }

  async createTransfer(transferData: {
    to_account_id?: string
    to_phone?: string
    to_email?: string
    amount: number
    description?: string
  }) {
    return this.request('/api/v1/transactions/transfer', {
      method: 'POST',
      body: JSON.stringify(transferData),
    })
  }

  async getTransactionById(id: string) {
    return this.request(`/api/v1/transactions/${id}`, {
      method: 'GET',
    })
  }

  // Account methods
  async getAccounts() {
    return this.request('/api/v1/accounts', {
      method: 'GET',
    })
  }

  async getAccountBalance(accountId: string) {
    return this.request(`/api/v1/accounts/${accountId}/balance`, {
      method: 'GET',
    })
  }

  // Notification methods
  async getNotifications() {
    return this.request('/api/v1/notifications', {
      method: 'GET',
    })
  }

  async markNotificationAsRead(notificationId: string) {
    return this.request(`/api/v1/notifications/${notificationId}/read`, {
      method: 'PUT',
    })
  }

  // AI methods
  async chatWithBot(message: string, sessionId?: string) {
    return this.request('/api/v1/ai/chat', {
      method: 'POST',
      body: JSON.stringify({
        message,
        session_id: sessionId,
      }),
    })
  }

  async getAIInsights() {
    return this.request('/api/v1/ai/insights', {
      method: 'GET',
    })
  }

  // Legacy chatbot endpoint
  async askChatbot(message: string) {
    return this.request('/ask', {
      method: 'POST',
      body: JSON.stringify({ message }),
    })
  }

  // Health check
  async healthCheck() {
    return this.request('/health', {
      method: 'GET',
    })
  }

  // Set token manually (for testing)
  setToken(token: string) {
    this.token = token
    if (typeof window !== 'undefined') {
      localStorage.setItem('access_token', token)
    }
  }

  // Get current token
  getToken(): string | null {
    return this.token
  }
}

// Create and export a singleton instance
export const apiClient = new ApiClient()

// Export types for use in components
export type { ApiResponse }

// Helper function to check if user is authenticated
export const isAuthenticated = (): boolean => {
  if (typeof window === 'undefined') return false
  return !!localStorage.getItem('access_token')
}

// Helper function to get user from localStorage
export const getCurrentUser = () => {
  if (typeof window === 'undefined') return null
  const userStr = localStorage.getItem('user')
  return userStr ? JSON.parse(userStr) : null
}

// Helper function to format currency
export const formatCurrency = (amount: number, currency: string = 'DZD'): string => {
  return new Intl.NumberFormat('fr-DZ', {
    style: 'currency',
    currency: currency,
  }).format(amount)
}

// Helper function to format date
export const formatDate = (date: string | Date): string => {
  const d = new Date(date)
  return new Intl.DateTimeFormat('fr-DZ', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(d)
}

