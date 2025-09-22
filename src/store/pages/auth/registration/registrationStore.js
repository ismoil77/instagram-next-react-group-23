import axiosRequest from '@/lib/axiosRequest'
import { create } from 'zustand'

export const useRegistration = create((set, get) => ({
	registrate: async form => {
		try {
			axiosRequest.post(`/Account/register`, form)
			return { success: true}
		} catch (error) {
			console.log(error)
		}
	},
}))
