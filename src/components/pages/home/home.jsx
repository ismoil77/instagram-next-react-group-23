'use client'

import usePostStore from '@/store/pages/home/home'
import { API_IMAGE } from '@/utils/config'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import MoreMenuModal from './moreInfoButton'
import ShareModal from './shareModal'

const PostCardHomePage = ({ post, giveId, onOpen }) => {
	const videoRef = useRef(null)
	const containerRef = useRef(null)
	const isManuallyPaused = useRef(false)
	const [expanded, setExpanded] = useState(false)

	const [commentOpenAll, setCommentOpenAll] = useState(false)
	const {
		currentlyPlayingPostId,
		setCurrentlyPlayingPostId,
		toggleLike,
		toggleFavorite,
		addComment,
		stories,
	} = usePostStore()

	const [isClient, setIsClient] = useState(false)
	const [currentMediaIndex, setCurrentMediaIndex] = useState(0)
	const [descFull, setDescFull] = useState('')
	const [commentText, setCommentText] = useState('')
	const [shareModalOpenClose, setShareModalOpenClose] = useState(false)
	const [moreModalOpen, setMoreModalOpen] = useState(false)

	const images = post?.images ?? []
	const currentMedia = images[currentMediaIndex]
	const isVideo =
		!!currentMedia && currentMedia.endsWith && currentMedia.endsWith('.mp4')

	const timeAgo = (dateString = '2025-08-20T13:39:40.836478Z') => {
		const date = new Date(dateString)
		const now = new Date()
		const diffMs = now - date

		const seconds = Math.floor(diffMs / 1000)
		const minutes = Math.floor(seconds / 60)
		const hours = Math.floor(minutes / 60)
		const days = Math.floor(hours / 24)

		if (days > 0) return `${days} дн. назад`
		if (hours > 0) return `${hours} ч. назад`
		if (minutes > 0) return `${minutes} мин. назад`
		return `${seconds} сек. назад`
	}

	useEffect(() => {
		if (post?.content) {
			setDescFull(
				post.content.length > 20
					? post.content.slice(0, 20) + '...ещё'
					: post.content
			)
		}

		// ✅ Проверяем, что код на клиенте
		if (typeof window !== 'undefined' && post?.postId) {
			try {
				localStorage.setItem('postId', post.postId)
			} catch (e) {}
		}
	}, [post])

	const textFull = text => setDescFull(text)
	const isPlaying = currentlyPlayingPostId === post.postId

	useEffect(() => setIsClient(true), [])

	useEffect(() => {
		if ((images || []).length > 1) {
			const interval = setInterval(
				() => setCurrentMediaIndex(prev => (prev + 1) % images.length),
				5000
			)
			return () => clearInterval(interval)
		}
	}, [images])

	useEffect(() => {
		return () => {
			if (videoRef.current && isPlaying) {
				try {
					videoRef.current.pause()
				} catch (e) {}
				setCurrentlyPlayingPostId(null)
			}
		}
	}, [isPlaying, setCurrentlyPlayingPostId])

	useEffect(() => {
		const el = containerRef.current
		if (!el) return

		const observer = new IntersectionObserver(
			entries => {
				entries.forEach(entry => {
					const ratio = entry.intersectionRatio
					const video = videoRef.current

					if (ratio >= 0.7) {
						if (isVideo && video && !isManuallyPaused.current) {
							setCurrentlyPlayingPostId(post.postId)
							video.play().catch(() => {})
						}
					} else {
						if (isVideo && video && currentlyPlayingPostId === post.postId) {
							try {
								video.pause()
							} catch (e) {}
							setCurrentlyPlayingPostId(null)
						}
						isManuallyPaused.current = false
					}
				})
			},
			{ threshold: [0, 0.25, 0.5, 0.7, 1] }
		)

		observer.observe(el)
		return () => observer.disconnect()
	}, [post.postId, isVideo, currentlyPlayingPostId, setCurrentlyPlayingPostId])

	const handlePlayPause = () => {
		const video = videoRef.current
		if (!video) return

		if (isPlaying) {
			try {
				video.pause()
			} catch (e) {}
			setCurrentlyPlayingPostId(null)
			isManuallyPaused.current = true
		} else {
			video
				.play()
				.then(() => {
					setCurrentlyPlayingPostId(post.postId)
					isManuallyPaused.current = false
				})
				.catch(() => setCurrentlyPlayingPostId(null))
		}
	}

	const [isMutedVoice, setIsMutedVoice] = useState(false)
	const handleMuted = () => {
		const video = videoRef.current
		if (!video) return
		video.muted = !video.muted
		setIsMutedVoice(video.muted)
	}

	const handleLikeClick = () => toggleLike(post.postId)
	const handleFavoriteClick = () => toggleFavorite(post.postId)
	const handleNextMedia = () => {
		if (images.length <= 1) return
		setCurrentMediaIndex(prev => (prev + 1) % images.length)
		isManuallyPaused.current = false
	}
	const handlePrevMedia = () => {
		if (images.length <= 1) return
		setCurrentMediaIndex(prev => (prev - 1 + images.length) % images.length)
		isManuallyPaused.current = false
	}

	return (
		<div
			ref={containerRef}
			className='border-b border-gray-200 dark:border-gray-700 p-4 max-sm:p-1 bg-white dark:bg-gray-900 dark:border text-gray-800 dark:text-gray-200'
		>
			{shareModalOpenClose && <ShareModal postid={post.images} />}
			{moreModalOpen && (
				<MoreMenuModal
					isOpen={moreModalOpen}
					onClose={() => setMoreModalOpen(false)}
				/>
			)}

			<div className='flex items-center mb-3'>
				{stories.some(el => el.userId === post.userId) ? (
					<div className='w-11.5 h-11.5 bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600 rounded-full flex justify-center items-center'>
						<img
							src={
								post?.userImage == '' || post?.userImage == null
									? 'https://cdn.pixabay.com/photo/2023/02/18/11/00/icon-7797704_640.png  '
									: `${API_IMAGE}/${post?.userImage}`
							}
							alt={post.userName}
							width={40}
							height={40}
							className='rounded-full w-10 h-10 object-cover bg-amber-50 dark:bg-gray-800 border'
							onClick={() => {
								onOpen()
								giveId(post.userId)
							}}
						/>
					</div>
				) : (
					<div className='w-11.5 h-11.5 rounded-full flex justify-center items-center '>
						<img
							src={
								post.userImage == '' || post.userImage == null
									? 'https://cdn.pixabay.com/photo/2023/02/18/11/00/icon-7797704_640.png  '
									: `${API_IMAGE}/${post.userImage}`
							}
							alt={post.userName}
							width={40}
							height={40}
							className='rounded-full w-10 h-10 object-cover bg-amber-50 dark:bg-gray-800 border'
						/>
					</div>
				)}

				<div className='ml-3 flex-1'>
					<Link href={`/profile/${post.userId}`}>
						<p className='font-semibold text-sm'>{post.userName}</p>
					</Link>
					<p className='text-xs text-gray-500 dark:text-gray-400'>
						{post.datePublished
							? new Date(post.datePublished).toLocaleDateString('ru-RU')
							: ''}{' '}
						{post.country || 'Таджикистан'}
					</p>
				</div>

				<button
					onClick={() => setMoreModalOpen(true)}
					className='text-gray-400 dark:text-gray-300 hover:text-gray-600 dark:hover:text-gray-100'
				>
					<svg
						xmlns='http://www.w3.org/2000/svg'
						fill='none'
						viewBox='0 0 24 24'
						stroke='currentColor'
						className='w-5 h-5'
					>
						<path
							strokeLinecap='round'
							strokeLinejoin='round'
							strokeWidth={2}
							d='M12 5v.01M12 12v.01M12 19v.01'
						/>
					</svg>
				</button>
			</div>

			<div className='relative h-[600px] w-[520px] max-sm:w-full aspect-video mb-3 bg-black rounded-lg border border-slate-300 dark:border-gray-600'>
				{isVideo ? (
					<video
						ref={videoRef}
						src={`${API_IMAGE}/${currentMedia}`}
						className='w-full h-full object-cover shadow-2xl rounded'
						loop
						playsInline
						onClick={handlePlayPause}
					>
						<track kind='captions' srcLang='en' label='English' />
					</video>
				) : (
					<Image
						src={`${API_IMAGE}/${currentMedia}`}
						alt='Post image'
						fill
						className='object-cover'
					/>
				)}

				{isVideo && (
					<>
						<button
							className='absolute top-[93%] left-[10px] w-[30px] h-[30px] rounded-full opacity-80 bg-white/40 hover:bg-white flex justify-center items-center '
							onClick={handleMuted}
						>
							<img
								src={
									isMutedVoice
										? 'https://www.svgrepo.com/show/74628/speaker-sound-muted.svg  '
										: 'https://images.icon-icons.com/2645/PNG/512/volume_up_icon_159763.png  '
								}
								alt='звук'
								className='w-5 h-5'
							/>
						</button>

						<button
							onClick={handlePlayPause}
							className='absolute top-[45%] left-[45%] w-[50px] h-[50px] rounded-full flex items-center justify-center opacity-80'
						>
							{isPlaying ? (
								<svg
									xmlns='http://www.w3.org/2000/svg'
									fill='white'
									viewBox='0 0 24 24'
									className='w-8 h-8'
								>
									<path d='M6 4h4v16H6V4zm8 0h4v16h-4V4z' />
								</svg>
							) : (
								<svg
									xmlns='http://www.w3.org/2000/svg'
									fill='white'
									viewBox='0 0 24 24'
									className='w-8 h-8'
								>
									<path d='M8 5v14l11-7z' />
								</svg>
							)}
						</button>
					</>
				)}

				{images.length > 1 && (
					<>
						<button
							onClick={handlePrevMedia}
							className='absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full'
						>
							←
						</button>
						<button
							onClick={handleNextMedia}
							className='absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full'
						>
							→
						</button>
						<div className='absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-1'>
							{images.map((_, index) => (
								<button
									key={index}
									onClick={() => setCurrentMediaIndex(index)}
									className={`w-2 h-2 rounded-full ${
										index === currentMediaIndex
											? 'bg-white'
											: 'bg-gray-500 dark:bg-gray-400'
									}`}
								/>
							))}
						</div>
					</>
				)}
			</div>

			<div className='mb-2'>
				<p className='font-semibold text-sm'>{post.title}</p>
				{post.content && (
					<p
						className='text-sm text-gray-700 dark:text-gray-300 mt-1 cursor-pointer'
						onClick={() => textFull(post.content)}
					>
						{descFull}
					</p>
				)}
			</div>

			<div className='flex items-center justify-between mb-2'>
				<div className='flex items-center space-x-4'>
					<button
						onClick={handleLikeClick}
						className='text-gray-500 dark:text-gray-300 hover:text-red-500 transition-colors'
					>
						<svg
							xmlns='http://www.w3.org/2000/svg'
							fill={post.postLike ? 'red' : 'none'}
							stroke='currentColor'
							viewBox='0 0 24 24'
							className='w-6 h-6'
						>
							<path
								strokeLinecap='round'
								strokeLinejoin='round'
								strokeWidth={2}
								d='M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z'
							/>
						</svg>
					</button>

					<button
						onClick={() => setCommentOpenAll(!commentOpenAll)}
						className='text-gray-500 dark:text-gray-300 hover:text-blue-500 transition-colors'
					>
						<svg
							xmlns='http://www.w3.org/2000/svg'
							fill='none'
							stroke='currentColor'
							viewBox='0 0 24 24'
							className='w-6 h-6'
						>
							<path
								strokeLinecap='round'
								strokeLinejoin='round'
								strokeWidth={2}
								d='M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.338-3.127A7.5 7.5 0 013 12c0-4.418 4.03-8 9-8s9 3.582 9 8z'
							/>
						</svg>
					</button>

					<button
						className='text-gray-500 dark:text-gray-300 hover:text-green-500 transition-colors'
						onClick={() => setShareModalOpenClose(!shareModalOpenClose)}
					>
						<svg
							xmlns='http://www.w3.org/2000/svg'
							fill='none'
							stroke='currentColor'
							viewBox='0 0 24 24'
							className='w-6 h-6'
						>
							<path
								strokeLinecap='round'
								strokeLinejoin='round'
								strokeWidth={2}
								d='M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z'
							/>
						</svg>
					</button>
				</div>

				<button
					onClick={handleFavoriteClick}
					className='text-gray-800 dark:text-gray-200 hover:text-black dark:hover:text-white transition-colors'
				>
					<svg
						xmlns='http://www.w3.org/2000/svg'
						fill={post.postFavorite ? 'black' : 'none'}
						stroke='currentColor'
						viewBox='0 0 24 24'
						className='w-6 h-6'
					>
						<path
							strokeLinecap='round'
							strokeLinejoin='round'
							strokeWidth={2}
							d='M5 5a2 2 0 012-2h10a2 2 0 012 2v14l-5-2.5L5 19V5z'
						/>
					</svg>
				</button>
			</div>

			<div className='text-sm text-gray-600 dark:text-gray-400 mb-2'>
				<span className='font-semibold'>{post.postLikeCount} лайков</span>
				{post.commentCount > 1 && (
					<span className='mx-1'>
						• {post.commentCount} комментарий
						{post.commentCount !== 1 ? 'ев' : ''}
					</span>
				)}
			</div>

			{post.commentCount > 0 && (
				<>
					<p
						className='mb-[10px] text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition cursor-pointer'
						onClick={() => setCommentOpenAll(!commentOpenAll)}
					>
						{commentOpenAll
							? 'Скрыть комментарии'
							: `Посмотреть все ${post.commentCount} комментариев`}
					</p>

					{commentOpenAll && (
						<div className='text-sm text-gray-700 dark:text-gray-300 mb-2'>
							{post.comments?.map(comment => (
								<div
									key={comment.postCommentId}
									className='flex items-start mb-1'
								>
									<img
										src={
											comment.userImage == '' || comment.userImage == null
												? 'https://cdn.pixabay.com/photo/2023/02/18/11/00/icon-7797704_640.png  '
												: `${API_IMAGE}/${comment.userImage}`
										}
										alt={comment.userName}
										width={20}
										height={20}
										className='rounded-full w-5 h-5 object-cover'
									/>
									<div className='ml-2'>
										<span className='font-semibold'>{comment.userName}</span>
										<p
											className='text-gray-600 dark:text-gray-400 max-w-[480px] break-words cursor-pointer'
											onClick={() => setExpanded(!expanded)}
										>
											{expanded
												? comment.comment
												: comment.comment.length > 10
												? `${comment.comment.slice(0, 10)}...`
												: comment.comment}
										</p>
										<p>{timeAgo(comment.dateCommented)}</p>
									</div>
								</div>
							))}
						</div>
					)}
				</>
			)}

			{!commentOpenAll && post.comments?.length > 0 && (
				<div className='text-sm text-gray-700 dark:text-gray-300 mb-2'>
					{post.comments.slice(0, 1).map(comment => (
						<div key={comment.postCommentId} className='flex items-start mb-1'>
							<img
								src={
									comment.userImage == '' || comment.userImage == null
										? 'https://cdn.pixabay.com/photo/2023/02/18/11/00/icon-7797704_640.png  '
										: `${API_IMAGE}/${comment.userImage}`
								}
								alt={comment.userName}
								width={20}
								height={20}
								className='rounded-full w-5 h-5 object-cover'
							/>
							<div className='ml-2'>
								<span className='font-semibold'>{comment.userName}</span>
								<p
									className='text-gray-600 dark:text-gray-400 max-w-[480px] break-words cursor-pointer'
									onClick={() => setExpanded(!expanded)}
								>
									{expanded
										? comment.comment
										: comment.comment.length > 10
										? `${comment.comment.slice(0, 10)}...`
										: comment.comment}
								</p>
								<p>{timeAgo(comment.dateCommented)}</p>
							</div>
						</div>
					))}
				</div>
			)}

			<div className='flex items-center space-x-2 mb-[10px]'>
				<input
					type='text'
					value={commentText}
					onChange={e => setCommentText(e.target.value)}
					placeholder='Добавьте комментарий...'
					className='flex-1 bg-gray-100 dark:bg-gray-800 px-3 py-2 rounded-full text-sm text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-500'
				/>
				<button
					className='text-blue-500 font-semibold text-sm'
					onClick={() => {
						addComment({ comment: commentText, postId: post.postId })
						setCommentText('')
					}}
				>
					Отправить
				</button>
			</div>

			<p className='text-xs text-gray-500 dark:text-gray-400 mt-2'>
				{timeAgo(post.datePublished)}
			</p>
		</div>
	)
}

export default PostCardHomePage
