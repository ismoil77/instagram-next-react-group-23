'use client'

import Profile from '@/assets/icon/layout/instagramDefaultProfile.jpg'
import useDarkSide from '@/hook/useDarkSide'
import axiosRequest from '@/lib/axiosRequest'
import {
	useFav,
	useMy_Profile,
	usePosts,
} from '@/store/pages/profile/profile/store-profile'
import { Box, Button, IconButton, Modal, Typography } from '@mui/material'
import {
	ChevronLeft,
	Ellipsis,
	Heart,
	MessageCircle,
	Send,
	Trash2,
	Volume2,
	VolumeX,
	X,
} from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import 'swiper/css'
import { Mousewheel, Navigation, Pagination } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'

const Reels = ({ open, onClose, posts, startIndex }) => {
	const [currentIndex, setCurrentIndex] = useState(startIndex)
	const [comment, setComment] = useState('')
	const [muted, setMuted] = useState(true)
	const [isPlaying, setIsPlaying] = useState({})
	const [showPlayIcon, setShowPlayIcon] = useState({})
	const [animating, setAnimating] = useState(false)
	const videoRefs = useRef([])
	const currentPost = posts?.[currentIndex]
	const pathname = usePathname()
	const isFromSaved = pathname.includes('/profile/saved')
	const {
		MYsubscribtions,
		followUser,
		dontFollowUser,
		updateSubscriptionState,
	} = useMy_Profile()
	const isFollowing = MYsubscribtions?.some(
		s => s?.userShortInfo?.userId === currentPost?.userId
	)
	const postsStore = usePosts()
	const favStore = useFav()
	const swiperRef = useRef(null)
	const [focused, setFocused] = useState(false)
	const [commentaries, setCommentaries] = useState(false)
	const toggleLike = isFromSaved ? favStore.like_post : postsStore.like_post
	const toggleFavorite = isFromSaved
		? favStore.add_post_favorite
		: postsStore.add_post_favorite
	const addComment = isFromSaved ? favStore.add_comment : postsStore.add_comment

	const handleFollowToggle = async () => {
		if (!currentPost?.userId) return

		const currentlyFollowed = MYsubscribtions?.some(
			s => s?.userShortInfo?.userId === currentPost?.userId
		)

		try {
			if (currentlyFollowed) {
				updateSubscriptionState(currentPost?.userId, false)
				await dontFollowUser(currentPost?.userId)
			} else {
				updateSubscriptionState(currentPost?.userId, true)
				await followUser(currentPost?.userId)
			}
		} catch (err) {
			updateSubscriptionState(currentPost?.userId, currentlyFollowed)
			console.error('Ошибка при переключении подписки:', err)
		}
	}

	useEffect(() => {
		setCurrentIndex(startIndex)
	}, [startIndex])

	const togglePlay = idx => {
		const video = videoRefs.current[idx]
		if (!video) return

		if (video.paused) {
			video.play().catch(() => {})
			setIsPlaying(prev => ({ ...prev, [idx]: true }))
		} else {
			video.pause()
			setIsPlaying(prev => ({ ...prev, [idx]: false }))
		}

		setShowPlayIcon(prev => ({ ...prev, [idx]: true }))
		setTimeout(() => {
			setShowPlayIcon(prev => ({ ...prev, [idx]: false }))
		}, 800)
	}

	const toggleMuteAll = () => {
		setMuted(prev => !prev)
		videoRefs.current.forEach(video => {
			if (video) video.muted = !muted
		})
	}

	const handleLike = () => {
		if (!currentPost) return
		setAnimating(true)
		toggleLike(currentPost?.postId)
		setTimeout(() => setAnimating(false), 300)
	}

	const handleComment = () => {
		if (!comment.trim() || !currentPost) return
		addComment({ comment, postId: currentPost?.postId })
		setComment('')
	}

	const handleComment_2 = e => {
		e.preventDefault()
		if (!e.target.comment.value.trim() || !currentPost) return
		addComment({ comment: e.target.comment.value, postId: currentPost?.postId })
		e.target?.comment?.reset()
	}

	const handleSave = () => {
		if (!currentPost) return
		toggleFavorite(currentPost?.postId)
	}

	const handleVideoClick = idx => {
		setMuted(prev => !prev)
		videoRefs.current.forEach((video, i) => {
			if (video) video.muted = i !== idx ? true : !muted
		})
	}

	const formatDate = dateStr => {
		const d = new Date(dateStr)
		return d.toLocaleDateString('ru-RU', {
			day: '2-digit',
			month: '2-digit',
			year: 'numeric',
			hour: '2-digit',
			minute: '2-digit',
		})
	}

	useEffect(() => {
		if (swiperRef.current) {
			const swiper = swiperRef.current

			if (commentaries) {
				swiper.allowTouchMove = false
				swiper.mousewheel.disable()
			} else {
				swiper.allowTouchMove = true
				swiper.mousewheel.enable()
			}
		}
	}, [commentaries])

	const [user, setUser] = useState(null)

	useEffect(() => {
		handleUser()
	}, [currentPost])

	const handleUser = async () => {
		try {
			const {
				data: { data },
			} = await axiosRequest.get(
				`https://instagram-api.softclub.tj/UserProfile/get-user-profile-by-id?id=${currentPost?.userId}`
			)
			setUser(data)
		} catch (error) {}
	}

	const handleNext = () => {
		if (currentIndex < posts?.length - 1) setCurrentIndex(currentIndex + 1)
	}

	const handlePrev = () => {
		if (currentIndex > 0) setCurrentIndex(currentIndex - 1)
	}

	const [theme, setTheme] = useDarkSide()

	return (
		<>
			<Modal
				open={open}
				onClose={onClose}
				className='md:w-[80%] md:h-[80%] md:flex hidden items-center m-auto justify-center'
			>
				<Box className='md:flex hidden items-center justify-center h-full w-full bg-black/50'>
					<div className='relative md:block hidden md:min-w-1/2 w-full h-full bg-black items-center justify-center'>
						{currentPost ? (
							currentPost?.images?.length ? (
								<Swiper
									modules={[Navigation, Pagination]}
									navigation
									pagination={{ clickable: true }}
									spaceBetween={10}
									slidesPerView={1}
									className='h-full w-full'
								>
									{currentPost?.images?.map((i, idx) => (
										<SwiperSlide className='w-full h-full' key={idx}>
											{i.endsWith('.mp4') ? (
												<div className='w-full h-full relative'>
													<video
														ref={el => (videoRefs.current[idx] = el)}
														src={
															'https://instagram-api.softclub.tj/images/' + i
														}
														className='w-full h-full object-contain rounded-xl'
														loop
														playsInline
														autoPlay
														muted={muted}
														onClick={() => togglePlay(idx)}
													/>
													<button
														onClick={e => {
															e.stopPropagation()
															toggleMuteAll()
														}}
														className='absolute top-2 right-2 z-10 w-8 h-8 rounded-full bg-black/50 flex items-center justify-center text-white'
													>
														{muted ? (
															<VolumeX size={20} />
														) : (
															<Volume2 size={20} />
														)}
													</button>

													{showPlayIcon[idx] && (
														<div className='absolute inset-0 flex items-center justify-center bg-black/40'>
															<div className='animate-playIcon w-[50px] h-[50px] rounded-full flex items-center justify-center bg-black/40 text-white'>
																<svg
																	fill='currentColor'
																	height='20'
																	viewBox='0 0 24 24'
																	width='20'
																>
																	<path d='M5.888 22.5a3.46 3.46 0 0 1-1.721-.46l-.003-.002a3.451 3.451 0 0 1-1.72-2.982V4.943a3.445 3.445 0 0 1 5.163-2.987l12.226 7.059a3.444 3.444 0 0 1-.001 5.967l-12.22 7.056a3.462 3.462 0 0 1-1.724.462Z' />
																</svg>
																<style jsx>{`
																	@keyframes playIconAnim {
																		0% {
																			transform: scale(0.2);
																			opacity: 0;
																		}
																		50% {
																			transform: scale(1.2);
																			opacity: 1;
																		}
																		100% {
																			transform: scale(1);
																			opacity: 1;
																		}
																	}
																	.animate-playIcon {
																		animation: playIconAnim 0.5s ease-out
																			forwards;
																	}
																`}</style>
															</div>
														</div>
													)}
												</div>
											) : (
												<div className='w-full h-full relative rounded overflow-hidden'>
													<Image
														src={
															'https://instagram-api.softclub.tj/images/' + i
														}
														alt={`image-${idx}`}
														fill
														className='object-contain'
													/>
												</div>
											)}
										</SwiperSlide>
									))}
								</Swiper>
							) : (
								<Typography color='white'>Нет медиа</Typography>
							)
						) : (
							<Typography color='white'>Нет поста</Typography>
						)}

						{currentIndex > 0 && (
							<button
								onClick={handlePrev}
								className='absolute left-2 top-1/2 -translate-y-1/2 z-30 text-white'
							>
								⬅
							</button>
						)}
						{currentIndex < posts?.length - 1 && (
							<button
								onClick={handleNext}
								className='absolute right-2 top-1/2 -translate-y-1/2 z-30 text-white'
							>
								➡
							</button>
						)}
					</div>

					<div className='md:flex hidden h-full flex-col justify-between md:p-[20px] md:w-1/2 bg-white dark:bg-[#121212] text-black dark:text-white'>
						<div className='flex items-center gap-[20px]'>
							<Typography variant='h6' className='text-xl font-semibold'>
								{user?.userName || 'User'}
							</Typography>
							<span className='mt-[-20px] text-[40px]'>.</span>
							<Button
								onClick={handleFollowToggle}
								variant='text'
								className={`font-bold ${
									isFollowing
										? 'text-gray-500 dark:text-[#A8A8A8]'
										: 'text-blue-500 dark:text-white'
								}`}
								disabled={!currentPost?.userId}
							>
								{isFollowing ? 'Вы подписаны' : 'Подписаться'}
							</Button>
						</div>

						<hr className='border-gray-300 dark:border-[#363636] my-4' />

						<div
							style={{ scrollbarWidth: 'none' }}
							className='flex flex-col gap-5 overflow-y-auto h-[60vh]'
						>
							{currentPost?.comments?.length ? (
								currentPost?.comments.map(c => (
									<div key={c?.postCommentId} className='flex flex-col gap-1'>
										<div className='flex items-start flex-col gap-2'>
											<div className='flex items-center gap-3'>
												<Link
													href={`/profile/${c?.userId}/posts`}
													className='w-7 h-7 rounded-full relative'
												>
													<Image
														src={
															c?.userImage
																? `https://instagram-api.softclub.tj/images/${c?.userImage}`
																: Profile
														}
														alt={c?.userName}
														fill
														className='rounded-full w-7 h-7 object-cover'
													/>
												</Link>

												<div className='flex flex-col'>
													<Link
														href={`/profile/${c?.userId}/posts`}
														className='font-semibold leading-3 text-sm text-black dark:text-white'
													>
														{c?.userName}
													</Link>
													{c?.dateCommented && (
														<div>
															<span className='text-[10px] leading-0 text-gray-500 dark:text-[#A8A8A8]'>
																{new Date(c?.dateCommented).toLocaleDateString(
																	'ru-RU',
																	{
																		day: 'numeric',
																		month: 'long',
																	}
																)}
															</span>
														</div>
													)}
												</div>
											</div>
											<p
												className='text-sm break-words text-black dark:text-white'
												style={{ wordBreak: 'break-word' }}
											>
												{c?.comment}
											</p>
										</div>
									</div>
								))
							) : (
								<Typography
									variant='body2'
									className='text-gray-500 dark:text-[#A8A8A8]'
								>
									Комментариев пока нет
								</Typography>
							)}
						</div>

						<hr className='border-gray-200 dark:border-[#363636] my-4' />

						<div className='flex flex-col gap-3'>
							<div className='flex items-center justify-between'>
								<div className='flex gap-4'>
									<IconButton onClick={handleLike} className='p-0'>
										{currentPost?.postLike ? (
											<Heart
												className='text-red-500 w-6 h-6'
												fill='currentColor'
											/>
										) : (
											<Heart className='text-black dark:text-white w-6 h-6' />
										)}
									</IconButton>
									<IconButton className='p-0'>
										<MessageCircle className='text-black dark:text-white w-6 h-6' />
										<p className='text-base text-black dark:text-white'>
											{currentPost?.commentCount}
										</p>
									</IconButton>
									<IconButton className='p-0'>
										{pathname !== '/profile/posts' &&
										pathname !== '/profile' ? (
											<svg
												xmlns='http://www.w3.org/2000/svg'
												fill='none'
												stroke='currentColor'
												viewBox='0 0 24 24'
												className='w-6 h-6 text-black dark:text-white'
											>
												<path
													strokeLinecap='round'
													strokeLinejoin='round'
													strokeWidth={2}
													d='M12 19l9 2-9-18-9 18 9-2zm0 0v-8'
												/>
											</svg>
										) : (
											<Trash2
												onClick={() => {
													postsStore.delete_post(currentPost?.postId), onClose()
												}}
												className='text-red-500'
											/>
										)}
									</IconButton>
								</div>
								<IconButton onClick={handleSave} className='p-0'>
									{currentPost?.postFavorite ? (
										<svg
											xmlns='http://www.w3.org/2000/svg'
											fill='currentColor'
											viewBox='0 0 24 24'
											className='w-6 h-6 text-black dark:text-white'
										>
											<path d='M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z' />
										</svg>
									) : (
										<svg
											xmlns='http://www.w3.org/2000/svg'
											fill='none'
											stroke='currentColor'
											viewBox='0 0 24 24'
											className='w-6 h-6 text-black dark:text-white'
										>
											<path
												strokeLinecap='round'
												strokeLinejoin='round'
												strokeWidth={2}
												d='M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z'
											/>
										</svg>
									)}
								</IconButton>
							</div>

							<div className='flex flex-col'>
								<Typography
									variant='body2'
									className='font-medium text-black dark:text-white'
								>
									{currentPost?.postLikeCount || 0} отметок «Нравится»
								</Typography>
								{currentPost?.datePublished && (
									<span className='text-[12px] text-gray-600 dark:text-[#A8A8A8]'>
										{formatDate(currentPost?.datePublished)}
									</span>
								)}
							</div>

							<hr className='border-gray-300 dark:border-[#363636] my-2' />

							<div className='flex items-center w-full justify-between'>
								<div className='relative w-full flex items-center'>
									<span className='absolute left-3 text-gray-500 dark:text-[#A8A8A8] cursor-pointer'>
										😊
									</span>
									<input
										value={comment}
										onChange={e => setComment(e.target.value)}
										placeholder='Добавьте комментарий...'
										fullWidth
										variant='outlined'
										size='small'
										className='pl-10 dark:placeholder:text-gray-400 w-full py-2 dark:text-white'
									/>
								</div>
								<Button
									onClick={handleComment}
									disabled={!comment.trim()}
									className={`ml-3 font-medium`}
								>
									<Send
										className={`${
											comment.trim()
												? 'text-blue-500 dark:text-white'
												: 'text-blue-500 dark:text-white opacity-50'
										}`}
									/>
								</Button>
							</div>
						</div>
					</div>

					<button
						className='absolute top-2 right-2 z-50'
						onClick={() => {
							onClose(), favStore.getFav()
						}}
					>
						<X className='w-6 h-6 text-white md:text-black dark:md:text-white' />
					</button>
				</Box>
			</Modal>

			<Modal
				open={open}
				onClose={onClose}
				className='block w-full h-full md:hidden'
			>
				<div className='bg-black w-full h-full relative'>
					<IconButton
						onClick={onClose}
						className='absolute top-4 left-4 z-50 text-white'
					>
						<ChevronLeft size={24} className='text-white' />
					</IconButton>

					<Swiper
						modules={[Mousewheel]}
						direction='vertical'
						draggable={commentaries ? false : true}
						mousewheel={commentaries ? false : true}
						slidesPerView={1}
						spaceBetween={0}
						initialSlide={startIndex}
						onSwiper={swiper => {
							swiperRef.current = swiper
						}}
						onSlideChange={swiper => {
							setCurrentIndex(swiper.activeIndex)
							videoRefs.current.forEach((video, i) => {
								if (video && i !== swiper.activeIndex) {
									video.muted = true
									video.pause()
									video.currentTime = 0
								} else {
									video.play()
								}
							})
						}}
						className='h-full -translate-y-[40px] absolute top-0 w-full'
					>
						{posts?.map((post, idx) => (
							<SwiperSlide key={post.postId} className=''>
								<div className='w-full h-screen flex items-center justify-center bg-black'>
									{post?.images?.length > 1 ? (
										<Swiper
											modules={Pagination}
											pagination={{ clickable: true }}
											spaceBetween={0}
											slidesPerView={1}
										>
											{post.images.map((img, i) => (
												<SwiperSlide
													key={i}
													className='w-full h-screen flex items-center justify-center bg-black'
												>
													{img.endsWith('.mp4') ? (
														<video
															ref={el => (videoRefs.current[i] = el)}
															src={`https://instagram-api.softclub.tj/images/${img}`}
															className='w-full h-full object-contain z-40'
															loop
															playsInline
															autoPlay
															muted={i !== currentIndex || muted}
															onClick={() => handleVideoClick(i)}
														/>
													) : (
														<div
															className='w-full h-full bg-black flex items-center z-40 justify-center'
															style={{
																backgroundImage: `url(https://instagram-api.softclub.tj/images/${img})`,
																backgroundSize: 'contain',
																backgroundPosition: 'center',
																backgroundRepeat: 'no-repeat',
															}}
														/>
													)}
												</SwiperSlide>
											))}
										</Swiper>
									) : (
										<>
											{post.images[0].endsWith('.mp4') ? (
												<video
													ref={el => (videoRefs.current[idx] = el)}
													src={`https://instagram-api.softclub.tj/images/${post.images[0]}`}
													className='w-full h-full object-contain z-40'
													loop
													playsInline
													autoPlay
													muted={idx !== currentIndex || muted}
													onClick={() => handleVideoClick(idx)}
												/>
											) : (
												<div
													className='w-full h-full bg-black flex items-center z-40 justify-center'
													style={{
														backgroundImage: `url(https://instagram-api.softclub.tj/images/${post.images[0]})`,
														backgroundSize: 'contain',
														backgroundPosition: 'center',
														backgroundRepeat: 'no-repeat',
													}}
												/>
											)}
										</>
									)}

									<div className='absolute top-6 z-40 right-6'>
										<Ellipsis
											onClick={() => setFocused(!focused)}
											onFocus={() => setFocused(true)}
											onBlur={() => setFocused(false)}
											className='text-white'
										/>
										{focused && (
											<div className='absolute top-8 right-0 bg-white dark:bg-[#262626] text-black dark:text-white flex flex-col rounded shadow-lg'>
												{pathname === '/profile/posts' && (
													<p
														onClick={() => {
															postsStore?.delete_post(post.postId),
																onClose(),
																postsStore?.get_my_Posts()
														}}
														className='px-3 py-1 hover:bg-gray-100 dark:hover:bg-[#363636] rounded-lg flex gap-2'
													>
														{
															<>
																<Trash2
																	className='text-red-500 w-6 h-6'
																	fill='currentColor'
																/>{' '}
																<p className='text-red-500 dark:text-red-400'>
																	Удалить
																</p>
															</>
														}
													</p>
												)}
											</div>
										)}
									</div>
									<div className='absolute bottom-6 right-4 flex flex-col gap-4 z-40'>
										<IconButton
											onClick={handleLike}
											className='p-0 flex flex-col'
										>
											{currentPost?.postLike ? (
												<Heart
													className='text-red-500 w-6 h-6'
													fill='currentColor'
												/>
											) : (
												<Heart className='text-white w-6 h-6' />
											)}
											<p className='text-white text-sm'>
												{currentPost?.postLikeCount}
											</p>
										</IconButton>

										<IconButton
											onClick={() => {
												setCommentaries(true)
											}}
											className='p-0 flex flex-col'
										>
											<MessageCircle
												onClick={() => {
													setCommentaries(true)
												}}
												className='text-white w-6 h-6'
											/>
											<p className='text-base text-white'>
												{currentPost?.commentCount}
											</p>
										</IconButton>

										<IconButton
											onClick={handleSave}
											className='p-0 flex flex-col'
										>
											{currentPost?.postFavorite ? (
												<svg
													xmlns='http://www.w3.org/2000/svg'
													fill='currentColor'
													stroke='currentColor'
													viewBox='0 0 24 24'
													className='w-6 h-6 text-yellow-500'
												>
													<path
														strokeLinecap='round'
														strokeLinejoin='round'
														strokeWidth={2}
														d='M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z'
													/>
												</svg>
											) : (
												<svg
													xmlns='http://www.w3.org/2000/svg'
													fill='none'
													stroke='currentColor'
													viewBox='0 0 24 24'
													className='w-6 h-6 text-white'
												>
													<path
														strokeLinecap='round'
														strokeLinejoin='round'
														strokeWidth={2}
														d='M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z'
													/>
												</svg>
											)}
											<p className='text-white text-sm'>
												{currentPost?.userFavorite?.length}
											</p>
										</IconButton>

										{post.images[0].endsWith('.mp4') && (
											<IconButton
												className='p-0'
												onClick={() => {
													handleVideoClick(idx)
												}}
											>
												{muted ? (
													<VolumeX className='text-white' />
												) : (
													<Volume2 className='text-white' />
												)}
											</IconButton>
										)}
									</div>

									<div className='absolute bottom-6 left-4 w-[85%] text-white z-40'>
										<p className='font-bold wrap-break-word'>{post?.title}</p>
										<p className='text-sm wrap-break-word opacity-80'>
											{post?.content}
										</p>
									</div>

									<div
										onClick={() => {
											setCommentaries(false)
										}}
										className={`${
											commentaries
												? 'h-[40vh] top-0 bottom-0'
												: 'h-0 bottom-0 -left-72'
										} w-full bg-transparent absolute transition-all duration-200 z-[100]`}
									/>
									<div
										className={`${
											commentaries
												? 'h-[60vh] bottom-0 left-0'
												: 'h-0 bottom-0 -left-72'
										} w-full bg-white dark:bg-[#121212] rounded-t-lg absolute transition-all duration-200 z-[100]`}
									>
										<div
											className={`w-full ${
												!commentaries && 'hidden'
											} relative border-b border-gray-300 dark:border-[#363636] py-3 px-5 flex justify-end`}
										>
											<p className='absolute top-2 left-1/2 -translate-x-1/2 text-lg font-semibold text-black dark:text-white'>
												{commentaries && 'Comments'}{' '}
												{currentPost?.commentCount?.length > 0 &&
													currentPost?.commentCount}
											</p>
											<X
												onClick={() => setCommentaries(false)}
												className='text-black dark:text-white w-6 h-6 cursor-pointer'
											/>
										</div>
										<div
											className={`w-full ${
												!commentaries && 'hidden'
											} h-[46vh] overflow-y-scroll py-5 px-[5%]`}
										>
											{currentPost?.comments?.length > 0 ? (
												Array.from(currentPost?.comments || [])
													?.reverse()
													.map(c => (
														<div
															key={c?.postCommentId}
															className='flex flex-col gap-1'
														>
															<div className='flex items-start flex-col gap-2'>
																<div className='flex items-center gap-3'>
																	<Link
																		href={`/profile/${c?.userId}/posts`}
																		className='w-7 h-7 rounded-full relative'
																	>
																		<Image
																			src={
																				c?.userImage
																					? `https://instagram-api.softclub.tj/images/${c?.userImage}`
																					: Profile
																			}
																			alt={c?.userName}
																			fill
																			className='rounded-full w-7 h-7 object-cover'
																		/>
																	</Link>

																	<div className='flex flex-col'>
																		<Link
																			href={`/profile/${c?.userId}/posts`}
																			className='font-semibold leading-3 text-sm text-black dark:text-white'
																		>
																			{c?.userName}
																		</Link>
																		{c?.dateCommented && (
																			<div>
																				<span className='text-[10px] leading-0 text-gray-500 dark:text-[#A8A8A8]'>
																					{new Date(
																						c?.dateCommented
																					).toLocaleDateString('ru-RU', {
																						day: 'numeric',
																						month: 'long',
																					})}
																				</span>
																			</div>
																		)}
																	</div>
																</div>
																<p
																	className='text-sm break-words text-black dark:text-white'
																	style={{ wordBreak: 'break-word' }}
																>
																	{c?.comment}
																</p>
															</div>
														</div>
													))
											) : (
												<Typography
													variant='body2'
													className='text-gray-500 dark:text-[#A8A8A8] text-center'
												>
													Комментариев пока нет
												</Typography>
											)}
										</div>
										<form
											className={`w-full ${
												!commentaries && 'hidden'
											} h-[7vh] px-[5%] border-t border-gray-300 dark:border-[#363636] p-2 flex`}
											onSubmit={handleComment_2}
										>
											<input
												type='text'
												name='comment'
												placeholder='Comment...'
												className='py-3 px-3 w-full border border-gray-300 dark:border-[#363636] bg-white dark:bg-[#262626] text-black dark:text-white placeholder-gray-500 dark:placeholder-[#A8A8A8] rounded'
											/>
											<button
												type='submit'
												className='w-1/4 flex justify-center items-center'
											>
												<Send className='text-black dark:text-white w-6 h-6 cursor-pointer' />
											</button>
										</form>
									</div>
								</div>
							</SwiperSlide>
						))}
					</Swiper>
				</div>
			</Modal>
		</>
	)
}

export default Reels
