'use client'

import axios from 'axios'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import { create } from 'zustand'

const API = 'https://instagram-api.softclub.tj/Post/get-posts'
const API_USERS = 'https://instagram-api.softclub.tj/User/get-users'
const API_FOLLOW =
	'https://instagram-api.softclub.tj/FollowingRelationShip/add-following-relation-ship'
const API_FAVORITE = 'https://instagram-api.softclub.tj/Post/add-post-favorite'

// 🔐 Хелпер для токена
const getToken = () => {
	if (typeof window !== 'undefined') {
		return localStorage.getItem('access_token')
	}
	return null
}

export const useDataExplore = create((set, get) => ({
	data: [],
	isLoading: false,
	comments: [],
	data_Users: [],

	GetExplore: async () => {
		set({ isLoading: true })
		try {
			const token = getToken()
			if (!token) return set({ isLoading: false })

			const response = await axios.get(`${API}?PageSize=1000`, {
				headers: { Authorization: `Bearer ${token}` },
			})

			set({ data: response.data.data, isLoading: false })
		} catch (error) {
			console.error(error)
			set({ isLoading: false })
		}
	},

	GetUsers: async () => {
		set({ isLoading: true })
		try {
			const token = getToken()
			if (!token) return set({ isLoading: false })

			const response = await axios.get(API_USERS, {
				headers: { Authorization: `Bearer ${token}` },
			})

			set({ data_Users: response.data.data, isLoading: false })
		} catch (error) {
			console.error(error)
			set({ isLoading: false })
		}
	},

	postLike: async postId => {
		set(state => {
			const updated = state.data.map(post =>
				post.postId === postId
					? {
							...post,
							postLike: !post.postLike,
							postLikeCount: post.postLike
								? post.postLikeCount - 1
								: post.postLikeCount + 1,
					  }
					: post
			)
			return { data: updated }
		})

		try {
			const token = getToken()
			if (!token) return

			await axios.post(
				`/Post/like-post?postId=${postId}`,
				{},
				{
					headers: { Authorization: `Bearer ${token}` },
				}
			)
		} catch (err) {
			console.error('Ошибка при лайке:', err)
		}
	},

	addComment: async (postId, commentText) => {
		try {
			const token = getToken()
			if (!token) return

			const response = await axios.post(
				'https://instagram-api.softclub.tj/Post/add-comment',
				{ postId, comment: commentText },
				{ headers: { Authorization: `Bearer ${token}` } }
			)

			set(state => {
				const updated = state.data.map(post =>
					post.postId === postId
						? {
								...post,
								comments: post.comments
									? [...post.comments, response.data.comment]
									: [response.data.comment],
						  }
						: post
				)
				return { data: updated }
			})
		} catch (err) {
			console.error('Ошибка при добавлении комментария:', err)
		}
	},

	followUser: async followingUserId => {
		try {
			const token = getToken()
			if (!token) return

			await axios.post(
				`${API_FOLLOW}?followingUserId=${followingUserId}`,
				{},
				{ headers: { Authorization: `Bearer ${token}` } }
			)

			console.log('Успешно подписались на пользователя:', followingUserId)
		} catch (err) {
			console.error('Ошибка при подписке:', err)
		}
	},

	toggleFavorite: async postId => {
		set(state => {
			const updated = state.data.map(post =>
				post.postId === postId
					? { ...post, postFavorite: !post.postFavorite }
					: post
			)
			return { data: updated }
		})

		try {
			const token = getToken()
			if (!token) return

			await axios.post(
				API_FAVORITE,
				{ postId },
				{ headers: { Authorization: `Bearer ${token}` } }
			)

			console.log('Пост сохранён в избранное:', postId)
		} catch (err) {
			console.error('Ошибка при добавлении в избранное:', err)

			// ❌ Откатываем изменения
			set(state => {
				const updated = state.data.map(post =>
					post.postId === postId
						? { ...post, postFavorite: !post.postFavorite }
						: post
				)
				return { data: updated }
			})
		}
	},
}))
