'use client'
import {
	cancelIcon,
	commentIcon,
	emojiIcon,
	emptyLike,
	heartIcon,
	leftIcon,
	muteOff,
	muteOn,
	oneMoreImageIcon,
	savedIconn,
	solidSavedIcon,
	userIcon,
	videoIcon,
} from '@/assets/iconsExplore'
import { useDataExplore } from '@/store/pages/explore/explore'
import { UserIcon } from 'lucide-react'
import dynamic from 'next/dynamic'
import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import { Navigation, Pagination } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'
const EmojiPicker = dynamic(() => import('emoji-picker-react'), { ssr: false })

export default function Explore() {
	const [isClient, setIsClient] = useState(false)
	const commentsRef = useRef(null)
	const [commentPost, setCommentPost] = useState(null)
	const {
		data,
		GetExplore,
		postLike,
		addComment,
		GetUsers,
		toggleFavorite,
		followUser,
	} = useDataExplore(state => state)
	const [isFavorite, setIsFavorite] = useState(false)
	const [media, setMedia] = useState([])
	const [userName, setUserName] = useState('')
	const [infoModal, setInfoModal] = useState(false)
	const [likes, setLikes] = useState(0)
	const [liked, setLiked] = useState(false)
	const [ava, setAva] = useState(null)
	const [postId, setPostId] = useState(null)
	const [mute, setMute] = useState(false)
	const [showPicker, setShowPicker] = useState(false)
	const [pause, setPause] = useState(false)
	const videoRef = useRef(null)
	const [content, setContent] = useState('')
	const [published, setPublished] = useState(null)
	const [text, setText] = useState('')
	const [commentCountPost, setCommentCountPost] = useState(0)
	const [followingUserId, setFollowingUserId] = useState(null)
	const [isFollowing, setIsFollowing] = useState(false)
	const [commentModal, setCommentModal] = useState(false)

	const showInfoModal = async post => {
		setInfoModal(true)
		setCommentPost(post)
		const files = post.images.map(
			img => `https://instagram-api.softclub.tj/images/${img}`
		)
		setMedia(files)
		setUserName(post.userName)
		setLiked(post.postLike)
		setLikes(Number(post.postLikeCount))
		setPostId(post.postId)
		setPublished(new Date(post.datePublished))
		setAva(
			post.userImage
				? `https://instagram-api.softclub.tj/images/${post.userImage}`
				: userIcon
		)
		setCommentCountPost(post.commentCount)
		setContent(post.content)
		setFollowingUserId(post.userId)
		setIsFollowing(post.isFollowing || false)
		setIsFavorite(post.postFavorite || false)
	}

	const handleFavorite = async () => {
		if (!postId) return
		await toggleFavorite(postId)
		setIsFavorite(prev => !prev)
	}

	useEffect(() => setIsClient(true), [])

	useEffect(() => {
		if (infoModal || commentModal) {
			document.body.style.overflow = 'hidden'
		} else {
			document.body.style.overflow = 'auto'
		}

		return () => {
			document.body.style.overflow = 'auto'
		}
	}, [infoModal, commentModal])

	useEffect(() => {
		GetUsers()
	}, [])

	useEffect(() => {
		GetExplore()
	}, [])

	const handleFollow = async () => {
		if (followingUserId) {
			await followUser(followingUserId)
			setIsFollowing(prev => !prev)
		}
	}

	return (
		<div>
			{infoModal && (
				<div className='flex items-center justify-center fixed z-50 inset-0 bg-black/60'>
					<div className='flex flex-col gap-[20px] rounded w-full lg:w-[65%] mx-auto h-[100vh] overflow-y-auto lg:h-[90vh] bg-white'>
						<div className='flex flex-col lg:flex-row lg:items-start gap-4'>
							<div className='lg:w-[50%] w-full lg:h-[90vh]'>
								<div className='flex items-center w-[95%] m-auto pt-[20px] justify-between lg:hidden'>
									<button
										className='w-[10%]'
										onClick={() => setInfoModal(false)}
									>
										{leftIcon}
									</button>
									<span className='font-bold w-[60%] text-[12px]'>
										Интересное
									</span>
								</div>
								<div className='flex items-center w-[95%] m-auto py-[15px] justify-between lg:hidden'>
									<div className='flex items-center gap-[10px]'>
										<Image
											src={ava}
											width={30}
											height={30}
											className='rounded-full'
											alt={userName}
										/>
										<div className='flex flex-col'>
											<b className='text-[12px] font-semibold'>{userName}</b>
											<span className='text-[10px]'>Рекомендации для вас</span>
										</div>
									</div>
									<div className='flex items-center gap-[10px]'>
										<button
											className={`p-[5px] rounded-[5px] font-bold text-[10px] transition-colors ${
												isFollowing
													? 'bg-gray-200 text-gray-500'
													: 'bg-blue-500 text-white'
											}`}
											onClick={handleFollow}
										>
											{isFollowing ? 'Подписки' : 'Подписаться'}
										</button>
									</div>
								</div>
								<Swiper
									modules={[Navigation, Pagination]}
									navigation
									pagination={{ clickable: true }}
									spaceBetween={10}
									slidesPerView={1}
									className='lg:h-[90vh] h-[70vh] w-full'
								>
									{media.map((file, i) => (
										<SwiperSlide key={i} className='relative'>
											{file.endsWith('.mp4') ? (
												<div className='relative w-full lg:h-screen'>
													<video
														src={file}
														ref={videoRef}
														className='lg:rounded-l w-full lg:w-full h-[70vh] lg:h-screen object-cover'
														loop
														autoPlay
														onClick={() => {
															pause
																? videoRef.current.play()
																: videoRef.current.pause()
															setPause(!pause)
														}}
														muted={mute}
													/>
													<div
														className='absolute bottom-3 right-3 bg-black/50 text-white p-1 rounded-full cursor-pointer'
														onClick={() => setMute(prev => !prev)}
													>
														{mute ? muteOff : muteOn}
													</div>
													{pause && (
														<div
															className='absolute inset-0 flex items-center justify-center bg-black/50'
															onClick={() => {
																setPause(prev => !prev)
																videoRef.current.play()
																setPause(false)
															}}
														>
															<div className='bg-black/50 rounded-full p-3'>
																{videoIcon}
															</div>
														</div>
													)}
												</div>
											) : (
												<div className='lg:h-[70vh] h-[70vh]'>
													<Image
														src={file}
														alt={`image-${i}`}
														fill
														className='object-cover'
													/>
												</div>
											)}
										</SwiperSlide>
									))}
								</Swiper>
							</div>

							{/* правая колонка */}
							<div className='flex flex-col justify-between lg:h-[90vh] w-[95%] gap-2 m-auto lg:p-[20px] lg:w-[50%]'>
								<div className='lg:hidden flex items-center justify-between'>
									<div className='flex items-center gap-[20px]'>
										<span className='flex items-center gap-[10px]'>
											{emptyLike}
											{likes}
										</span>
										<span
											onClick={() => setCommentModal(true)}
											className='flex items-center gap-[10px] cursor-pointer'
										>
											{commentIcon}
											{commentCountPost}
										</span>
									</div>
									<button onClick={handleFavorite}>
										{isFavorite ? solidSavedIcon : savedIconn}
									</button>
								</div>
								<div className='lg:hidden flex items-start gap-[10px]'>
									<b>{userName}</b>
									<span>{content}</span>
								</div>
								{published && (
									<span className='text-[12px] lg:hidden flex text-gray-600'>
										{published.toLocaleDateString('ru-RU', {
											day: 'numeric',
											month: 'long',
										})}
									</span>
								)}
								<div className='lg:flex hidden items-center gap-[20px]'>
									<h1 className='text-xl font-semibold'>{userName}</h1>
									<span className='mt-[-20px] text-[40px]'>.</span>
									<button
										className={`cursor-pointer hover:opacity-50 font-bold transition-colors ${
											isFollowing ? 'text-gray-500' : 'text-blue-500'
										}`}
										onClick={handleFollow}
									>
										{isFollowing ? 'Подписки' : 'Подписаться'}
									</button>
								</div>
								<hr className='border-gray-300 lg:flex hidden lg:py-2' />

								{/* 🗨️ Комментарии */}
								<div
									ref={commentsRef}
									className='lg:flex hidden flex-col gap-5 overflow-y-auto lg:h-screen'
								>
									{commentPost?.comments?.length > 0 ? (
										commentPost.comments.map((com, idx) => (
											<div key={idx} className='flex flex-col gap-2'>
												<div className='flex items-start gap-2'>
													<div className='flex items-center gap-4'>
														<Image
															alt={com.userName}
															width={20}
															height={20}
															className='rounded-full w-7 h-7 object-cover'
															src={
																com.userImage
																	? `https://instagram-api.softclub.tj/images/${com.userImage}`
																	: userIcon
															}
														/>
														<span className='font-semibold'>
															{com.userName}
														</span>
													</div>
													<p className='break-words w-[45%]'>{com.comment}</p>
												</div>
												<div className='ml-[11%]'>
													{com.dateCommented && (
														<span className='text-[12px] text-gray-500'>
															{new Date(com.dateCommented).toLocaleDateString(
																'ru-RU',
																{
																	day: 'numeric',
																	month: 'long',
																}
															)}
														</span>
													)}
												</div>
											</div>
										))
									) : (
										<span className='text-gray-300'>Комментариев пока нет</span>
									)}
								</div>
								<hr className='hidden lg:flex border-gray-200 py-2' />

								{/* ❤️ Лайки */}
								<div className='flex flex-col gap-2'>
									<div className='lg:flex hidden items-center justify-between'>
										<div className='flex gap-4 font-semibold'>
											<h1
												onClick={() => {
													postLike(postId)
													setLiked(prev => !prev)
													setLikes(prev => prev + (liked ? -1 : 1))
												}}
											>
												{liked ? heartIcon : emptyLike}
											</h1>
										</div>
										<button onClick={handleFavorite}>
											{isFavorite ? solidSavedIcon : savedIconn}{' '}
											{/* переключение */}
										</button>
									</div>
									<div className='hidden lg:flex flex-col'>
										<h1>Отметки нравится: {likes}</h1>
										{published && (
											<span className='text-[12px] text-gray-600'>
												{published.toLocaleDateString('ru-RU', {
													day: 'numeric',
													month: 'long',
												})}
											</span>
										)}
									</div>
									<hr className='lg:flex hidden border-gray-300' />
									<div className='lg:flex hidden items-center w-full justify-between'>
										<div className='relative w-full flex items-center'>
											<span
												className='absolute cursor-pointer left-2'
												onClick={() => setShowPicker(prev => !prev)}
											>
												{emojiIcon}
											</span>
											<input
												type='text'
												value={text}
												onChange={e => setText(e.target.value)}
												className='w-full outline-none p-[10px] pl-[40px] rounded'
												placeholder='Добавьте комментарий'
											/>
											{showPicker && isClient && (
												<div className='absolute bottom-12 left-0 z-50'>
													<EmojiPicker
														onEmojiClick={emoji =>
															setText(prev => prev + emoji.emoji)
														}
													/>
												</div>
											)}
										</div>
										<button
											disabled={text.length === 0}
											className={`px-4 py-2 ${
												text.length > 0 ? 'text-blue-500' : 'text-blue-300'
											}`}
											onClick={async () => {
												if (!text.trim()) return
												await addComment(postId, text)
												setText('')
												setCommentPost(prev => ({
													...prev,
													comments: prev.comments
														? [
																...prev.comments,
																{
																	comment: text,
																	userName: 'Вы',
																	userImage: UserIcon,
																	dateCommented: new Date(),
																},
														  ]
														: [
																{
																	comment: text,
																	userName: 'Вы',
																	userImage: null,
																	dateCommented: new Date(),
																},
														  ],
												}))
												commentsRef.current?.scrollTo({
													top: commentsRef.current.scrollHeight,
													behavior: 'smooth',
												})
											}}
										>
											Опубликовать
										</button>
									</div>
								</div>
							</div>
						</div>
						<button
							className='absolute lg:flex hidden top-[20px] text-white right-[20px] z-50'
							onClick={() => setInfoModal(false)}
						>
							{cancelIcon}
						</button>
					</div>
				</div>
			)}

			{/* Модалка комментариев для мобильной версии */}
			{commentModal && (
				<div className='fixed inset-0 z-50 bg-white lg:hidden'>
					<div className='flex flex-col h-full'>
						{/* Хедер */}
						<div className='flex items-center justify-between p-4 border-b border-gray-200'>
							<button onClick={() => setCommentModal(false)}>{leftIcon}</button>
							<span className='font-semibold'>Комментарии</span>
							<div className='w-6' />
						</div>

						{/* Список комментариев */}
						<div className='flex-1 overflow-y-auto p-4'>
							{commentPost?.comments?.length > 0 ? (
								commentPost.comments.map((com, idx) => (
									<div key={idx} className='flex gap-3 mb-4'>
										<Image
											alt={com.userName}
											width={32}
											height={32}
											className='rounded-full w-8 h-8 object-cover flex-shrink-0'
											src={
												com.userImage
													? `https://instagram-api.softclub.tj/images/${com.userImage}`
													: userIcon
											}
										/>
										<div className='flex-1'>
											<div className='flex items-center gap-2 mb-1'>
												<span className='font-semibold text-sm'>
													{com.userName}
												</span>
												{com.dateCommented && (
													<span className='text-xs text-gray-500'>
														{new Date(com.dateCommented).toLocaleDateString(
															'ru-RU',
															{
																day: 'numeric',
																month: 'short',
															}
														)}
													</span>
												)}
											</div>
											<p className='text-sm break-words'>{com.comment}</p>
										</div>
									</div>
								))
							) : (
								<div className='text-center text-gray-500 mt-10'>
									Комментариев пока нет
								</div>
							)}
						</div>

						{/* Инпут для комментария */}
						<div className='p-4 border-t border-gray-200 bg-white'>
							<div className='flex items-center gap-2'>
								<input
									type='text'
									value={text}
									onChange={e => setText(e.target.value)}
									className='flex-1 bg-gray-100 rounded-full px-4 py-2 text-sm outline-none'
									placeholder='Добавьте комментарий...'
								/>
								<button
									disabled={!text.trim()}
									className={`text-sm font-semibold px-3 ${
										text.trim() ? 'text-blue-500' : 'text-blue-300'
									}`}
									onClick={async () => {
										if (!text.trim()) return
										await addComment(postId, text)
										setText('')
										setCommentPost(prev => ({
											...prev,
											comments: prev.comments
												? [
														...prev.comments,
														{
															comment: text,
															userName: 'Вы',
															userImage: null,
															dateCommented: new Date(),
														},
												  ]
												: [
														{
															comment: text,
															userName: 'Вы',
															userImage: null,
															dateCommented: new Date(),
														},
												  ],
										}))
									}}
								>
									Опубликовать
								</button>
							</div>
						</div>
					</div>
				</div>
			)}

			{/* Сетка постов */}
			<div className='grid grid-cols-3 gap-1 p-2'>
				{data?.map((post, index) => {
					const file = post.images?.[0]
					const fileUrl = `https://instagram-api.softclub.tj/images/${file}`
					return (
						<div
							key={index}
							onClick={() => showInfoModal(post)}
							className='relative aspect-square group cursor-pointer'
						>
							{/* иконки видео/мультифото */}
							{file?.endsWith('.mp4') && (
								<div className='absolute top-2 right-2 bg-black/30 p-1 rounded z-20 text-white'>
									{videoIcon}
								</div>
							)}
							{post.images.length > 1 && (
								<div className='absolute top-2 right-2 bg-black/30 p-1 rounded z-20 text-white'>
									{oneMoreImageIcon}
								</div>
							)}

							{file?.endsWith('.mp4') ? (
								<video
									src={fileUrl}
									className='w-full h-full object-cover'
									muted
									loop
								/>
							) : (
								<Image
									src={fileUrl}
									alt='post image'
									fill
									className='object-cover'
								/>
							)}

							<div className='absolute inset-0 hidden group-hover:flex items-center justify-center gap-4 z-10 text-white font-semibold'>
								<h1 className='flex items-center gap-[10px]'>
									{post.postLike ? heartIcon : emptyLike} {post.postLikeCount}
								</h1>
								<h1 className='flex items-center gap-[10px]'>
									{commentIcon} {post.commentCount}
								</h1>
							</div>
							<div className='absolute inset-0 bg-black/0 group-hover:bg-black/60 transition' />
						</div>
					)
				})}
			</div>
		</div>
	)
}
