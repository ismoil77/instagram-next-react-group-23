'use client'

import { useSubscribers } from '@/store/pages/notification/notification'
import { usePosts } from '@/store/pages/profile/profile/store-profile'
import { Avatar } from '@mui/material'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import ReactDOM from 'react-dom'

const SimpleNotificationsDrawer = ({ open, onClose }) => {
	const {
		data: subscribers,
		loading,
		error,
		getSubscribers,
		followToUser,
	} = useSubscribers()
	const { data: postsData, get_my_Posts } = usePosts()

	const [isMounted, setIsMounted] = useState(open)
	const [isVisible, setIsVisible] = useState(open)

	useEffect(() => {
		if (open) {
			setIsMounted(true)
			setTimeout(() => setIsVisible(true), 20)
			getSubscribers()
			get_my_Posts()
		} else {
			setIsVisible(false)
			const timeout = setTimeout(() => setIsMounted(false), 300)
			return () => clearTimeout(timeout)
		}
	}, [open])

	if (!isMounted) return null

	// Форматирование даты
	const formatDate = dateString => {
		const date = new Date(dateString)
		return date.toLocaleString()
	}

	return typeof window !== 'undefined'
		? ReactDOM.createPortal(
				<div
					className={`fixed top-0 left-0 sm:left-[65px] h-screen w-full sm:w-[400px] 
          bg-white dark:bg-[#121212] border-r border-gray-200 dark:border-gray-800 
          z-[9999] flex flex-col transition-transform duration-300 
          ${isVisible ? 'translate-x-0' : '-translate-x-full'}`}
				>
					{/* Заголовок */}
					<div className='flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800'>
						<h2 className='text-lg font-semibold text-gray-900 dark:text-gray-100'>
							Уведомления
						</h2>
						<button
							className='text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white transition'
							onClick={onClose}
						>
							✕
						</button>
					</div>

					{/* Контент */}
					<div className='flex-1 overflow-y-auto p-4'>
						{loading && (
							<div className='flex justify-center mt-8'>
								<div className='w-6 h-6 border-4 border-blue-500 border-t-transparent rounded-full animate-spin' />
							</div>
						)}

						{error && <p className='text-red-500 text-center mt-4'>{error}</p>}

						{/* Подписки */}
						{!loading && !error && subscribers.length > 0 && (
							<div className='space-y-4'>
								<h3 className='text-sm font-semibold text-gray-800 dark:text-gray-200'>
									На этой неделе
								</h3>

								{subscribers.map(({ id, userShortInfo }) => (
									<div
										key={id}
										className='flex items-center justify-between p-2 rounded-lg 
                    hover:bg-gray-100 dark:hover:bg-[#1f1f1f] transition'
									>
										<Link
											href={`/profile/${userShortInfo.userId}`}
											className='flex items-center gap-3'
											onClick={onClose}
										>
											<Avatar
												src={
													userShortInfo.userPhoto
														? `https://instagram-api.softclub.tj/images/${userShortInfo.userPhoto}`
														: '/default-avatar.png'
												}
												alt={userShortInfo.userName}
												width={44}
												height={44}
												className='rounded-full object-cover'
											/>
											<div>
												<p className='text-sm font-medium text-gray-900 dark:text-gray-100'>
													{userShortInfo.userName}
												</p>
												<p className='text-xs text-gray-500 dark:text-gray-400'>
													подписался(-ась) на вас
												</p>
											</div>
										</Link>

										<button
											onClick={() =>
												followToUser(
													userShortInfo.userId,
													userShortInfo.isSubscriber
												)
											}
											className={`px-3 py-1 text-sm rounded-md font-medium active:scale-95 transition 
                      ${
												userShortInfo.isSubscriber
													? 'bg-white dark:bg-[#2a2a2a] text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-[#333]'
													: 'bg-blue-500 text-white hover:bg-blue-600'
											}`}
										>
											{userShortInfo.isSubscriber ? 'Подписан' : 'Подписаться'}
										</button>
									</div>
								))}
							</div>
						)}

						{/* Комментарии */}
						{!loading && !error && postsData?.length > 0 && (
							<div className='space-y-4 mt-6'>
								<h3 className='text-sm font-semibold text-gray-800 dark:text-gray-200'>
									Комментарии к вашим постам
								</h3>

								{postsData.map(post =>
									post.comments?.length > 0
										? post.comments.map(comment => (
												<div
													key={comment.postCommentId}
													className='flex items-start justify-between p-2 rounded-lg 
                        hover:bg-gray-100 dark:hover:bg-[#1f1f1f] transition'
												>
													<Link
														href={`/profile/${comment.userId}`}
														className='flex items-start gap-3'
														onClick={onClose}
													>
														<Avatar
															src={
																comment.userImage
																	? `https://instagram-api.softclub.tj/images/${comment.userImage}`
																	: '/default-avatar.png'
															}
															alt={comment.userName}
															width={44}
															height={44}
															className='rounded-full object-cover'
														/>
														<div>
															<p className='text-sm font-medium text-gray-900 dark:text-gray-100'>
																{comment.userName}
															</p>
															<p className='text-xs text-gray-500 dark:text-gray-400 max-w-[220px] truncate'>
																{comment.comment}
															</p>
															<p className='text-[10px] text-gray-400 dark:text-gray-500 mt-1'>
																{formatDate(comment.dateCommented)}
															</p>
														</div>
													</Link>
												</div>
										  ))
										: null
								)}
							</div>
						)}

						{/* Пусто */}
						{!loading &&
							!error &&
							subscribers.length === 0 &&
							(!postsData ||
								postsData.every(
									p => !p.comments || p.comments.length === 0
								)) && (
								<p className='text-center text-gray-500 dark:text-gray-400 mt-6'>
									Пока уведомлений нет
								</p>
							)}
					</div>
				</div>,
				document.body
		  )
		: null
}

export default SimpleNotificationsDrawer
