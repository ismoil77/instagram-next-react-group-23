'use client'

import { create } from 'zustand'

export const useChatStore2 = create(set => ({
	chats: [],
	chatById: null,
	profile: null,
	loading: false,
	error: null,

	getChatById: async chatId => {
		set({ loading: true, error: null })
		try {
			const token =
				typeof window !== 'undefined'
					? localStorage.getItem('access_token')
					: null

			const res = await fetch(
				`https://instagram-api.softclub.tj/Chat/get-chat-by-id?chatId=${chatId}`,
				{
					method: 'GET',
					headers: {
						accept: '*/*',
						...(token ? { Authorization: `Bearer ${token}` } : {}),
					},
				}
			)

			if (!res.ok) throw new Error('Failed to fetch chat by id')

			const result = await res.json()
			set({ chatById: result.data, loading: false })
		} catch (err) {
			set({ error: err.message, loading: false })
		}
	},

	sendMessage: async ({ chatId, messageText, file }) => {
		set({ loading: true, error: null })
		try {
			const token =
				typeof window !== 'undefined'
					? localStorage.getItem('access_token')
					: null

			const formData = new FormData()
			formData.append('ChatId', chatId)
			formData.append('MessageText', messageText || '')
			if (file) {
				formData.append('File', file)
			}

			const res = await fetch(
				`https://instagram-api.softclub.tj/Chat/send-message`,
				{
					method: 'PUT',
					headers: {
						...(token ? { Authorization: `Bearer ${token}` } : {}),
					},
					body: formData,
				}
			)

			if (!res.ok) throw new Error('Failed to send message')

			const result = await res.json()
			set({ loading: false })

			return result.data
		} catch (err) {
			set({ error: err.message, loading: false })
			throw err
		}
	},

	getProfile: async () => {
		set({ loading: true, error: null })
		try {
			const token =
				typeof window !== 'undefined'
					? localStorage.getItem('access_token')
					: null

			const res = await fetch(
				'https://instagram-api.softclub.tj/UserProfile/get-my-profile',
				{
					method: 'GET',
					headers: {
						accept: '*/*',
						...(token ? { Authorization: `Bearer ${token}` } : {}),
					},
				}
			)

			if (!res.ok) throw new Error('Failed to fetch profile')

			const result = await res.json()
			set({ profile: result.data, loading: false })
		} catch (err) {
			set({ error: err.message, loading: false })
		}
	},

	deleteMessage: async messageId => {
		set({ loading: true, error: null })
		try {
			const token =
				typeof window !== 'undefined'
					? localStorage.getItem('access_token')
					: null

			const res = await fetch(
				`https://instagram-api.softclub.tj/Chat/delete-message?massageId=${messageId}`,
				{
					method: 'DELETE',
					headers: {
						accept: '*/*',
						...(token ? { Authorization: `Bearer ${token}` } : {}),
					},
				}
			)

			if (!res.ok) throw new Error('Failed to delete message')

			const result = await res.json()

			set(state => ({
				chatById: state.chatById?.filter(msg => msg.messageId !== messageId),
				loading: false,
			}))

			return result.data
		} catch (err) {
			set({ error: err.message, loading: false })
			throw err
		}
	},
}))
