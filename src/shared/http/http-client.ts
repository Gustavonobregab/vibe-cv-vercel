import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'

/**
 * Configuration for the HTTP client
 */
export interface HttpClientConfig extends AxiosRequestConfig {
  baseURL?: string
  timeout?: number
  headers?: Record<string, string>
}

/**
 * HTTP client default configuration
 */
const defaultConfig: HttpClientConfig = {
  timeout: 30000, // 30 seconds
  headers: {
    'Content-Type': 'application/json',
  },
}

/**
 * Create an HTTP client with the specified configuration
 */
export const createHttpClient = (config: HttpClientConfig = {}): AxiosInstance => {
  const mergedConfig = { ...defaultConfig, ...config }
  const instance = axios.create(mergedConfig)

  // Add request interceptor for handling common cases
  instance.interceptors.request.use(
    (config) => {
      // Add custom headers if needed
      return config
    },
    (error) => {
      return Promise.reject(error)
    }
  )

  // Add response interceptor for handling errors
  instance.interceptors.response.use(
    (response) => {
      return response
    },
    (error) => {
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.error('API error:', error.response.status, error.response.data)
      } else if (error.request) {
        // The request was made but no response was received
        console.error('Network error:', error.request)
      } else {
        // Something happened in setting up the request
        console.error('Request error:', error.message)
      }
      return Promise.reject(error)
    }
  )

  return instance
}

/**
 * Default HTTP client instance
 */
export const httpClient = createHttpClient()

/**
 * Type-safe methods for making HTTP requests
 */
export const http = {
  /**
   * Make a GET request to the specified URL
   */
  get: async <T>(url: string, config?: AxiosRequestConfig): Promise<T> => {
    const response: AxiosResponse<T> = await httpClient.get(url, config)
    return response.data
  },

  /**
   * Make a POST request to the specified URL
   */
  post: async <T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> => {
    const response: AxiosResponse<T> = await httpClient.post(url, data, config)
    return response.data
  },

  /**
   * Make a PUT request to the specified URL
   */
  put: async <T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> => {
    const response: AxiosResponse<T> = await httpClient.put(url, data, config)
    return response.data
  },

  /**
   * Make a PATCH request to the specified URL
   */
  patch: async <T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> => {
    const response: AxiosResponse<T> = await httpClient.patch(url, data, config)
    return response.data
  },

  /**
   * Make a DELETE request to the specified URL
   */
  delete: async <T>(url: string, config?: AxiosRequestConfig): Promise<T> => {
    const response: AxiosResponse<T> = await httpClient.delete(url, config)
    return response.data
  }
}

/**
 * Utilities for working with HTTP requests
 */
export const httpUtils = {
  /**
   * Download a file from the specified URL
   */
  downloadFile: async (url: string): Promise<Buffer> => {
    const response = await httpClient.get(url, {
      responseType: 'arraybuffer',
    })
    return Buffer.from(response.data)
  },

  /**
   * Create a custom HTTP client with a specific base URL and optional auth token
   */
  createClient: (baseURL: string, authToken?: string): AxiosInstance => {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    }

    if (authToken) {
      headers['Authorization'] = `Bearer ${authToken}`
    }

    return createHttpClient({
      baseURL,
      headers,
    })
  },

  /**
   * Upload a file as form data
   */
  uploadFile: async <T>(url: string, file: Buffer, filename: string, fieldName: string = 'file', extraFields?: Record<string, string>): Promise<T> => {
    // Create form data
    const formData = new FormData()

    // Add the file to form data
    const blob = new Blob([file])
    formData.append(fieldName, blob, filename)

    // Add any extra fields
    if (extraFields) {
      Object.entries(extraFields).forEach(([key, value]) => {
        formData.append(key, value)
      })
    }

    // Send the request
    const response = await httpClient.post<T>(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })

    return response.data
  },

  /**
   * Retry a request if it fails
   */
  retry: async <T>(fn: () => Promise<T>, retries: number = 3, delay: number = 1000): Promise<T> => {
    try {
      return await fn()
    } catch (error) {
      if (retries <= 1) {
        throw error
      }

      await new Promise(resolve => setTimeout(resolve, delay))
      return httpUtils.retry(fn, retries - 1, delay * 2)
    }
  }
} 