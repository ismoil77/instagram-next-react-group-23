import axiosRequest from '@/lib/axiosRequest'
import { create } from 'zustand'

export const useLogin = create((set) => ({
  loading: false,
  error: null,

  login: async (form) => {
    try {
      set({ loading: true, error: null })
      const { data } = await axiosRequest.post(`/Account/login`, form)
      console.log(data)

      if (data?.data && typeof window !== "undefined") {
        try {
          localStorage.setItem("access_token", data.data)
        } catch (e) {
          console.error("Ошибка при сохранении токена:", e)
        }
      }

      return { success: true, data }
    } catch (error) {
      console.error(error)
      set({ error: error?.response?.data?.message || "Login failed" })
      return { success: false, error }
    } finally {
      set({ loading: false })
    }
  },
}))
