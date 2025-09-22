"use client"

import { API } from "@/utils/config"
import axios from "axios"

const axiosRequest = axios.create({
  baseURL: API,
})

// 🔐 Добавляем токен к каждому запросу
axiosRequest.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      try {
        const token = localStorage.getItem("access_token")
        if (token) {
          config.headers["Authorization"] = `Bearer ${token}`
        }
      } catch (e) {
        console.error("Ошибка при получении токена:", e)
      }
    }
    return config
  },
  (error) => Promise.reject(error)
)

// ❌ Если токен невалидный или 401 → logout + redirect
axiosRequest.interceptors.response.use(
  (response) => response,
  (error) => {
    if (typeof window !== "undefined" && error.response?.status === 401) {
      try {
        localStorage.removeItem("access_token")
      } catch (e) {
        console.error("Ошибка при очистке токена:", e)
      }
      window.location.href = "/login"
    }
    return Promise.reject(error)
  }
)

export default axiosRequest
