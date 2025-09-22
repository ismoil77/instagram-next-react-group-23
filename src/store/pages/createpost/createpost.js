import axiosRequest from '@/lib/axiosRequest'
import axios from 'axios'
import { create } from 'zustand'
export const api = 'http://37.27.29.18:8003/Post/add-post	'
export const addUser = async formdata => {
	try {
		const response = await axiosRequest.post(api, formdata)
		return response.data
	} catch (error) {
		console.error('Error adding user:', error)
		throw error
	}
}