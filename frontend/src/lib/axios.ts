import axios, { type AxiosInstance, type InternalAxiosRequestConfig, type AxiosResponse } from 'axios'

const apiClient: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  timeout: 12000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Bộ đánh chặn cho Request gửi đi
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('access_token')
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Bộ đánh chặn cho Response nhận về từ Spring Boot
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    // Un-wrap nhanh cấu trúc trả về, lấy trực tiếp phần thân dữ liệu
    return response.data
  },
  async (error) => {
    const originalRequest = error.config

    // Xử lý kịch bản Token hết hạn và cần gọi Refresh Token
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true
      try {
        // Ví dụ lệnh gọi API refresh lên Spring Boot endpoint chuyên dụng
        // const response = await axios.post('/api/v1/auth/refresh', { refresh_token: localStorage.getItem('refresh_token') })
        // const { accessToken } = response.data.data
        // localStorage.setItem('access_token', accessToken)
        // originalRequest.headers.Authorization = `Bearer ${accessToken}`
        // return apiClient(originalRequest)
        
        return Promise.reject(error) // Tạm thời ném ra lỗi nếu chưa cài đặt hệ thống refresh hoàn chỉnh
      } catch (refreshError) {
        localStorage.removeItem('access_token')
        window.location.href = '/login'
        return Promise.reject(refreshError)
      }
    }

    // Bóc tách cấu trúc ValidationError ném ra bởi CustomControllerAdvice trong Spring Boot
    const serverMessage = error.response?.data?.message || 'Đã có lỗi hệ thống từ Server Java!'
    return Promise.reject(new Error(serverMessage))
  }
)

export default apiClient