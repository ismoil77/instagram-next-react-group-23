import axiosRequest from '@/lib/axiosRequest'
import { create } from 'zustand'

/** ----------------- PROFILES STORE ----------------- **/
export const useProfiles = create(set => ({
	data: null,
	getMyProfileLoading: false,
	getUserProfileLoading: false,

	getMyProfile: async () => {
		set({ getMyProfileLoading: true })
		try {
			const { data } = await axiosRequest.get('/UserProfile/get-my-profile')
			set({ data: data.data })
		} catch (err) {
			console.error('Ошибка получения моего профиля:', err)
		} finally {
			set({ getMyProfileLoading: false })
		}
	},

	getUserProfile: async id => {
		set({ getUserProfileLoading: true })
		try {
			const { data } = await axiosRequest.get(`/UserProfile/get-user-profile-by-id?id=${id}`)
			set({ data: data.data })
		} catch (err) {
			console.error('Ошибка получения профиля пользователя:', err)
		} finally {
			set({ getUserProfileLoading: false })
		}
	},
}))

/** ----------------- POSTS STORE ----------------- **/
export const usePosts = create(set => ({
	data: [],
	getMyPostsLoading: false,
	getOtherPostsLoading: false,
	getFollowingPostsLoading: false,
	addPostLoading: false,
	deletePostLoading: false,
	likePostLoading: false,
	viewPostLoading: false,
	addCommentLoading: false,
	deleteCommentLoading: false,
	addFavoriteLoading: false,

	// Получить мои посты
	get_my_Posts: async () => {
		set({ getMyPostsLoading: true })
		try {
			const { data } = await axiosRequest.get('/Post/get-my-posts')
			set({ data: data.data || [] })
		} catch (err) {
			console.error('Ошибка загрузки моих постов:', err)
		} finally {
			set({ getMyPostsLoading: false })
		}
	},

	// Получить чужие посты
	get_other_Posts: async id => {
		set({ getOtherPostsLoading: true })
		try {
			const { data } = await axiosRequest.get(`/Post/get-posts?UserId=${id}`)
			set({ data: data.data || [] })
		} catch (err) {
			console.error('Ошибка загрузки чужих постов:', err)
		} finally {
			set({ getOtherPostsLoading: false })
		}
	},

	// Получить посты подписок
	get_following_Posts: async ({ UserId, PageNumber = 1, PageSize = 10 } = {}) => {
		set({ getFollowingPostsLoading: true })
		try {
			const { data } = await axiosRequest.get(
				`/Post/get-following-post?UserId=${UserId}&PageNumber=${PageNumber}&PageSize=${PageSize}`,
				{
					headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` },
				}
			)
			set({ data: data.data || [] })
		} catch (err) {
			console.error('Ошибка загрузки постов подписок:', err)
		} finally {
			set({ getFollowingPostsLoading: false })
		}
	},

	add_post: async (payload, pathname) => {
		set({ addPostLoading: true })
		try {
			await axiosRequest.post('/Post/add-post', payload, {
				headers: {
					Authorization: `Bearer ${localStorage.getItem('access_token')}`,
					'Content-Type': 'multipart/form-data',
				},
			})
			if (['/profile', '/profile/posts', '/profile/saved'].includes(pathname)) {
				const { data } = await axiosRequest.get('/Post/get-my-posts')
				set({ data: data.data || [] })
			}
		} catch (err) {
			console.error('Ошибка добавления поста:', err)
		} finally {
			set({ addPostLoading: false })
		}
	},

	delete_post: async id => {
		set({ deletePostLoading: true })
		try {
			await axiosRequest.delete(`/Post/delete-post?id=${id}`)
			set(state => ({ data: state.data.filter(post => post.postId !== id) }))
		} catch (err) {
			console.error('Ошибка удаления поста:', err)
		} finally {
			set({ deletePostLoading: false })
		}
	},

	like_post: async postId => {
		set({ likePostLoading: true })
		try {
			// Локальное обновление
			set(state => ({
				data: state.data.map(post =>
					post.postId === postId
						? {
								...post,
								postLike: !post.postLike,
								postLikeCount: post.postLikeCount + (post.postLike ? -1 : 1),
						  }
						: post
				),
			}))
			await axiosRequest.post(`/Post/like-post?postId=${postId}`)
		} catch (err) {
			// Откат
			set(state => ({
				data: state.data.map(post =>
					post.postId === postId
						? {
								...post,
								postLike: !post.postLike,
								postLikeCount: post.postLikeCount + (post.postLike ? 1 : -1),
						  }
						: post
				),
			}))
			console.error('Ошибка лайка:', err)
		} finally {
			set({ likePostLoading: false })
		}
	},

	view_post: async postId => {
		set({ viewPostLoading: true })
		try {
			await axiosRequest.post(`/Post/view-post?postId=${postId}`)
		} catch (err) {
			console.error('Ошибка просмотра поста:', err)
		} finally {
			set({ viewPostLoading: false })
		}
	},

	add_comment: async ({ postId, comment }) => {
		const sid = JSON.parse(atob(localStorage.getItem('access_token')?.split('.')[1]))
		const tempComment = {
			postCommentId: Date.now() + Math.random(),
			userId: sid?.sid,
			userName: sid?.name,
			userImage: sid?.sub,
			dateCommented: new Date().toISOString(),
			comment,
		}
		set({ addCommentLoading: true })
		try {
			await axiosRequest.post('/Post/add-comment', { postId, comment })
			set(state => ({
				data: state.data.map(post =>
					post.postId === postId
						? { ...post, comments: [...post.comments, tempComment], commentCount: post.commentCount + 1 }
						: post
				),
			}))
		} catch (err) {
			console.error('Ошибка добавления комментария:', err)
		} finally {
			set({ addCommentLoading: false })
		}
	},

	delete_comment: async commentId => {
		set({ deleteCommentLoading: true })
		try {
			await axiosRequest.delete(`/Post/delete-comment?commentId=${commentId}`)
		} catch (err) {
			console.error('Ошибка удаления комментария:', err)
		} finally {
			set({ deleteCommentLoading: false })
		}
	},

	add_post_favorite: async postId => {
		set({ addFavoriteLoading: true })
		try {
			set(state => ({
				data: state.data.map(post =>
					post.postId === postId ? { ...post, postFavorite: !post.postFavorite } : post
				),
			}))
			await axiosRequest.post('/Post/add-post-favorite', { postId })
		} catch (err) {
			// откат
			set(state => ({
				data: state.data.map(post =>
					post.postId === postId ? { ...post, postFavorite: !post.postFavorite } : post
				),
			}))
			console.error('Ошибка добавления в избранное:', err)
		} finally {
			set({ addFavoriteLoading: false })
		}
	},
}))

/** ----------------- MY PROFILE STORE ----------------- **/
export const useMy_Profile = create(set => ({
	subscribers: [],
	subscribtions: [],
	MYsubscribtions: [],
	getSubscribtionsLoading: false,
	getSubscribersLoading: false,
	followUserLoading: {},
	dontFollowUserLoading: {},

	followUser: async id => {
		set(state => ({ followUserLoading: { ...state.followUserLoading, [id]: true } }))
		try {
			await axiosRequest.post(`/FollowingRelationShip/add-following-relation-ship?followingUserId=${id}`)
			const { data } = await axiosRequest.get(`/FollowingRelationShip/get-subscriptions?UserId=${localStorage.getItem('userID')}`)
			set({ MYsubscribtions: data.data })
		} catch (err) {
			console.error('Ошибка подписки:', err)
		} finally {
			set(state => {
				const loading = { ...state.followUserLoading }
				delete loading[id]
				return { followUserLoading: loading }
			})
		}
	},

	dontFollowUser: async id => {
		set(state => ({ dontFollowUserLoading: { ...state.dontFollowUserLoading, [id]: true } }))
		try {
			await axiosRequest.delete(`/FollowingRelationShip/delete-following-relation-ship?followingUserId=${id}`)
			const { data } = await axiosRequest.get(`/FollowingRelationShip/get-subscriptions?UserId=${localStorage.getItem('userID')}`)
			set({ MYsubscribtions: data.data })
		} catch (err) {
			console.error('Ошибка отписки:', err)
		} finally {
			set(state => {
				const loading = { ...state.dontFollowUserLoading }
				delete loading[id]
				return { dontFollowUserLoading: loading }
			})
		}
	},

	updateSubscriptionState: (userId, isFollow) =>
		set(state => ({
			MYsubscribtions: isFollow
				? [...state.MYsubscribtions, { userShortInfo: { userId } }]
				: state.MYsubscribtions.filter(u => u.userShortInfo.userId !== userId),
		})),

	getSubscribtions: async (pathname, id) => {
		set({ getSubscribtionsLoading: true })
		try {
			const { data } = await axiosRequest.get(
				`/FollowingRelationShip/get-subscriptions?UserId=${!['/profile/posts', '/profile/saved', '/profile/tagged'].includes(pathname) ? id : localStorage.getItem('userID')}`
			)
			set({ subscribtions: data.data })
		} catch (err) {
			console.error('Ошибка получения подписок:', err)
		} finally {
			set({ getSubscribtionsLoading: false })
		}
	},

	getMySubscribtions: async () => {
		set({ getSubscribtionsLoading: true })
		try {
			const { data } = await axiosRequest.get(`/FollowingRelationShip/get-subscriptions?UserId=${localStorage.getItem('userID')}`)
			set({ MYsubscribtions: data.data })
		} catch (err) {
			console.error('Ошибка получения моих подписок:', err)
		} finally {
			set({ getSubscribtionsLoading: false })
		}
	},

	getSubscribers: async (pathname, id) => {
		set({ getSubscribersLoading: true })
		try {
			const { data } = await axiosRequest.get(
				`/FollowingRelationShip/get-subscribers?UserId=${!['/profile/posts', '/profile/saved', '/profile/tagged'].includes(pathname) ? id : localStorage.getItem('userID')}`
			)
			set({ subscribers: data.data })
		} catch (err) {
			console.error('Ошибка получения подписчиков:', err)
		} finally {
			set({ getSubscribersLoading: false })
		}
	},

	updateSubscriptionStateSubs: (userId, isFollow) =>
		set(state => ({
			subscribtions: isFollow
				? [...state.subscribtions, { userId }]
				: state.subscribtions.filter(u => u.userId !== userId),
		})),
}))

/** ----------------- STORIES STORE ----------------- **/
export const useGet_Storyes = create(set => ({
	stories: [],
	getStoryesLoading: false,
	getOtherStoryesLoading: false,

	get_storyes: async () => {
		set({ getStoryesLoading: true })
		try {
			const { data } = await axiosRequest.get('/Story/get-stories')
			set({ stories: data || [] })
		} catch (err) {
			console.error('Ошибка получения сторис:', err)
		} finally {
			set({ getStoryesLoading: false })
		}
	},

	get_other_storyes: async id => {
		set({ getOtherStoryesLoading: true })
		try {
			const { data } = await axiosRequest.get(`/Story/get-user-stories/${id}`)
			set({ stories: data.data || [] })
		} catch (err) {
			console.error('Ошибка получения чужих сторис:', err)
		} finally {
			set({ getOtherStoryesLoading: false })
		}
	},
}))

/** ----------------- FAVORITES STORE ----------------- **/
export const useFav = create(set => ({
	favourite: [],
	getFavLoading: false,

	getFav: async () => {
		set({ getFavLoading: true })
		try {
			const { data } = await axiosRequest.get('/UserProfile/get-post-favorites?PageSize=1000')
			set({ favourite: data.data || [] })
		} catch (err) {
			console.error('Ошибка получения избранного:', err)
		} finally {
			set({ getFavLoading: false })
		}
	},

	like_post: async postId => {
		set(state => ({
			favourite: state.favourite.map(post =>
				post.postId === postId
					? { ...post, postLike: !post.postLike, postLikeCount: post.postLikeCount + (post.postLike ? -1 : 1) }
					: post
			),
		}))
		try {
			await axiosRequest.post(`/Post/like-post?postId=${postId}`)
		} catch (err) {
			// откат
			set(state => ({
				favourite: state.favourite.map(post =>
					post.postId === postId
						? { ...post, postLike: !post.postLike, postLikeCount: post.postLikeCount + (post.postLike ? 1 : -1) }
						: post
				),
			}))
			console.error('Ошибка лайка в избранном:', err)
		}
	},

	add_comment: async ({ comment, postId }) => {
		const sid = JSON.parse(atob(localStorage.getItem('access_token')?.split('.')[1]))
		const tempComment = {
			postCommentId: Date.now() + Math.random(),
			userId: sid?.sid,
			userName: sid?.name,
			userImage: sid?.sub,
			dateCommented: new Date().toISOString(),
			comment,
		}
		set(state => ({
			favourite: state.favourite.map(post =>
				post.postId === postId
					? { ...post, comments: [...(post.comments || []), tempComment], commentCount: (post.commentCount || 0) + 1 }
					: post
			),
		}))
		try {
			const { serverComment } = await axiosRequest.post('/Post/add-comment', { postId, comment })
			set(state => ({
				favourite: state.favourite.map(post =>
					post.postId === postId
						? { ...post, comments: post.comments.map(c => (c.postCommentId === tempComment.postCommentId ? serverComment : c)) }
						: post
				),
			}))
		} catch (err) {
			// откат
			set(state => ({
				favourite: state.favourite.map(post =>
					post.postId === postId
						? { ...post, comments: post.comments.filter(c => c.postCommentId !== tempComment.postCommentId), commentCount: (post.commentCount || 1) - 1 }
						: post
				),
			}))
			console.error('Ошибка добавления комментария в избранное:', err)
		}
	},

	add_post_favorite: async postId => {
		set(state => ({
			favourite: state.favourite.map(post =>
				post.postId === postId ? { ...post, postFavorite: !post.postFavorite } : post
			),
		}))
		try {
			await axiosRequest.post('/Post/add-post-favorite', { postId })
		} catch (err) {
			// откат
			set(state => ({
				favourite: state.favourite.map(post =>
					post.postId === postId ? { ...post, postFavorite: !post.postFavorite } : post
				),
			}))
			console.error('Ошибка добавления поста в избранное:', err)
		}
	},
}))
