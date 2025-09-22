import { create } from "zustand"
import axios from "axios"
import axiosRequest from "@/lib/axiosRequest"

export const useUserStore = create((set) => ({
  users: [],
  gethystory: [],
  Mobile: [],
  loading: false,
  error: null,

  searchUsers: async (search) => {
    if (!search) {
      set({ users: [] })
      return
    }

    set({ loading: true, error: null })
    try {
      const res = await axiosRequest.get(`http://37.27.29.18:8003/User/get-users?UserName=${search}`)
      set({ users: res.data.data, loading: false })
    } catch (err) {
      set({ loading: false, error: err.message })
    }
  },
  GetHystory: async () => {
    set({ loading: true, error: null })
    try {
      const res = await axiosRequest.get(`http://37.27.29.18:8003/User/get-user-search-histories`)
      set({ gethystory: res.data.data, loading: false })
    } catch (err) {
      set({ loading: false, error: err.message })
    }
  },
  GetHystoryMobile: async () => {
    set({ loading: true, error: null })
    try {
      const res = await axiosRequest.get(`http://37.27.29.18:8003/User/get-search-histories`)
      set({ Mobile: res.data.data, loading: false })
    } catch (err) {
      set({ loading: false, error: err.message })
    }
  },
  AddSearchHystory: async (id) => {
    set({ loading: true, error: null })
    try {
      await axiosRequest.post(`http://37.27.29.18:8003/User/add-user-search-history?UserSearchId=${id}`)
      await useUserStore.getState().GetHystory()
    } catch (error) {
      console.error(error);
    }
  },
  AddSearchMobile: async (name) => {
    set({ loading: true, error: null })
    try {
      await axiosRequest.post(`http://37.27.29.18:8003/User/add-search-history?Text=${name}`)
      await useUserStore.getState().GetHystoryMobile()
    } catch (error) {
      console.error(error);
    }
  },
  DeleteHystory: async (id) => {
    set({ loading: true, error: null })
    try {
      await axiosRequest.delete(`http://37.27.29.18:8003/User/delete-user-search-history?id=${id}`)
      await useUserStore.getState().GetHystory()
    } catch (error) {
      console.error(error);
    }
  },
  DeleteHystoryMobile: async (id) => {
    set({ loading: true, error: null })
    try {
      await axiosRequest.delete(`http://37.27.29.18:8003/User/delete-search-history?id=${id}`)
      await useUserStore.getState().GetHystoryMobile()
    } catch (error) {
      console.error(error);
    }
  },
  DeleteHystoryAll: async () => {
    set({ loading: true, error: null })
    try {
      await axiosRequest.delete(`http://37.27.29.18:8003/User/delete-user-search-histories`)
      await useUserStore.getState().GetHystory()
    } catch (error) {
      console.error(error);
    }
  },
  DeleteHystoryAllMobile: async () => {
    set({ loading: true, error: null })
    try {
      await axiosRequest.delete(`http://37.27.29.18:8003/User/delete-search-histories`)
      await useUserStore.getState().GetHystoryMobile()
    } catch (error) {
      console.error(error);
    }
  },
}))



