// store/postStore.js
import axiosRequest from '@/lib/axiosRequest'
import { create } from 'zustand'

const usePostStore = create((set, get) => ({
	posts: [],
	loading: false,
	error: null,
	users: [],
	stories: [],

	currentlyPlayingPostId: null,

	setCurrentlyPlayingPostId: postId => {
		set({ currentlyPlayingPostId: postId })
	},

	getCurrentlyPlayingPostId: () => get().currentlyPlayingPostId,

	toggleLike: async postId => {
		set(state => {
			const updatedPosts = state.posts.map(post =>
				post.postId === postId
					? {
							...post,
							postLike: !post.postLike,
							postLikeCount: post.postLikeCount + (post.postLike ? -1 : 1),
					  }
					: post
			)
			return { posts: updatedPosts }
		})
		try {
			await axiosRequest.post(`/Post/like-post?postId=${postId}`)
		} catch (err) {
			console.error('Ошибка при изменении избранного:', err)
			set(state => ({
				posts: state.posts.map(post =>
					post.postId === postId ? { ...post, postLike: !post.postLike } : post
				),
			}))
		}
	},

	toggleFavorite: async postId => {
		set(state => ({
			posts: state.posts.map(post =>
				post.postId === postId
					? {
							...post,
							postFavorite: !post.postFavorite,
					  }
					: post
			),
		}))
		try {
			await axiosRequest.post(`/Post/add-post-favorite`, { postId })
		} catch (err) {
			console.error('Ошибка при добавлении в избранное:', err)
		}
	},

	fetchPosts: async () => {
		set({ loading: true, error: null })
		try {
			const response2 = await axiosRequest.get(`/Post/get-posts`)
			set({ posts: response2.data.data, loading: false })
		} catch (err) {
			set({ error: 'Ошибка загрузки постов', loading: false })
		}
	},

	fetchStories: async () => {
		try {
			const response = await axiosRequest.get(`/Story/get-stories?PageSize=9999`)
			const filtered = response.data.map(el => ({
				...el,
				localUrl: '',
			}))
			set({ stories: filtered, loading: false })
		} catch (err) {
			set({ error: 'Ошибка загрузки постов', loading: false })
		}
	},

	fetchUsers: async (user = 10) => {
		try {
			const response = await axiosRequest.get(`/User/get-users?PageSize=${user}`)
			const usersData = response.data.data

			if (!Array.isArray(usersData)) {
				throw new Error('Response data is not an array')
			}

			const followedCheckData = await Promise.all(
				usersData.map(async element => {
					const resFollow = await axiosRequest.get(
						`/UserProfile/get-is-follow-user-profile-by-id?followingUserId=${element.id}`
					)
					return {
						...element,
						isSubscriber: !!resFollow.data.data.isSubscriber,
					}
				})
			)

			set({ users: followedCheckData })
		} catch (err) {
			console.error(err)
			set({ error: 'Ошибка загрузки постов' })
		}
	},

	addComment: async comment => {
		let sid = null
		let name = null

		if (typeof window !== 'undefined') {
			const token = localStorage.getItem('access_token')
			if (token) {
				try {
					const payload = JSON.parse(atob(token.split('.')[1]))
					sid = payload?.sid
					name = payload?.name
				} catch (e) {
					console.error('Ошибка при парсинге токена:', e)
				}
			}
		}

		const newComment = {
			postCommentId: Date.now(),
			userId: sid,
			userName: name,
			userImage: 'bfc78865-5de7-449c-8f06-a030a721dc3b.png',
			dateCommented: new Date().toISOString(),
			comment: comment.comment,
		}

		set(state => ({
			posts: state.posts.map(post =>
				post.postId === comment.postId
					? {
							...post,
							comments: [newComment, ...(post.comments || [])],
							commentCount: post.commentCount + 1,
					  }
					: post
			),
		}))

		try {
			await axiosRequest.post('/Post/add-comment', comment)
		} catch (err) {
			set({ error: 'Ошибка добавления комментария', loading: false })
		}
	},

	followToUser: async (userId, isSubscriber) => {
		set(state => ({
			users: state.users.map(user =>
				user.id === userId ? { ...user, isSubscriber: !isSubscriber } : user
			),
		}))

		try {
			if (isSubscriber) {
				await axiosRequest.delete(
					`/FollowingRelationShip/delete-following-relation-ship?followingUserId=${userId}`
				)
			} else {
				await axiosRequest.post(
					`/FollowingRelationShip/add-following-relation-ship?followingUserId=${userId}`
				)
			}
		} catch (err) {
			console.error(err)
			set({ error: 'Ошибка обновления подписки', loading: false })
			set(state => ({
				users: state.users.map(user =>
					user.id === userId ? { ...user, isSubscriber } : user
				),
			}))
		}
	},

	addStory: async stories => {
		try {
			await axiosRequest.post(`/Story/AddStories`, stories)
			get().fetchStories()
		} catch (error) {
			console.error(error)
		}
	},

	deleteStory: async id => {
		try {
			await axiosRequest.delete(`/Story/DeleteStory?id=${id}`)
			get().fetchStories()
		} catch (error) {
			console.error(error)
		}
	},
}))

export default usePostStore
