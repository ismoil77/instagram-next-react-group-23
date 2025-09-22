'use client'

import Profile from '@/assets/icon/layout/instagramDefaultProfile.jpg'
import useDarkSide from '@/hook/useDarkSide'
import axiosRequest from '@/lib/axiosRequest'
import {
	useGet_Storyes,
	useMy_Profile,
	useProfiles,
} from '@/store/pages/profile/profile/store-profile'
import CloseIcon from '@mui/icons-material/Close'
import {
	Box,
	IconButton,
	Modal,
	Skeleton,
	Tooltip,
	Typography,
} from '@mui/material'
import { Bookmark, Camera, Menu, Plus, Settings, X } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useParams, usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import UserStoriesSlider, { StoriesViewer } from '../story/story'

function ProfileTabs() {
	const pathname = usePathname()
	const [theme, setTheme] = useDarkSide()
	const isActive = path => pathname === path

	const check = () =>
		pathname === '/profile/posts' ||
		pathname === '/profile' ||
		pathname === '/profile/saved'

	return (
		<>
			{check() && (
				<div className='flex flex-row justify-center items-start gap-5 w-full h-10 border-t border-gray-200 dark:border-[#363636]'>
					{[
						{
							label: 'Posts',
							icon: <Camera size={20} />,
							path:
								pathname.split('/').filter(i => i !== 'posts' && i !== 'saved')
									.length === 2
									? '/profile/posts'
									: pathname.split('/').slice(0, 3).join('/') + '/posts',
						},
						{
							label: 'Saved',
							icon: <Bookmark size={20} />,
							path:
								pathname.split('/').filter(i => i !== 'saved' && i !== 'posts')
									.length === 2
									? '/profile/saved'
									: pathname.split('/').slice(0, 3).join('/') + '/saved',
						},
					].map(tab => (
						<Link
							key={tab.path}
							href={tab.path}
							className={`flex flex-col justify-center items-center relative h-12 ${
								isActive(tab.path)
									? 'text-blue-600 dark:text-blue-400'
									: 'text-gray-500 dark:text-[#A8A8A8]'
							}`}
						>
							{isActive(tab.path) && (
								<div className='w-[calc(100%+20px)] h-[0.5px] absolute -top-[0.5px] bg-blue-600 dark:bg-blue-400'></div>
							)}
							<div className='flex flex-row items-center gap-2'>
								<span>{tab.icon}</span>
								<span className='font-medium text-base leading-6'>
									{tab.label}
								</span>
							</div>
						</Link>
					))}
				</div>
			)}
		</>
	)
}

export default function ClientProfile({ children }) {
	const {
		data,
		getMyProfile,
		getUserProfile,
		getMyProfileLoading,
		getUserProfileLoading,
	} = useProfiles()
	const {
		subscribers,
		subscribtions,
		followUserLoading,
		dontFollowUserLoading,
		getSubscribers: GetSubscribers,
		dontFollowUser,
		followUser,
		MYsubscribtions,
		getMySubscribtions,
		getSubscribtions,
		updateSubscriptionState,
		getSubscribersLoading,
		getSubscribtionsLoading,
	} = useMy_Profile()
	const {
		stories,
		get_storyes,
		get_other_storyes,
		getStoryesLoading,
		getOtherStoryesLoading,
	} = useGet_Storyes()
	const [closeShowStories, setCloseShowStories] = useState(false)
	const [storiesId, setToId] = useState()
	const [openSubscribers, setOpenSubscribers] = useState(false)
	const [openSubscribtions, setOpenSubscribtions] = useState(false)
	const [MyStoriesOpen, setMyStoriesOpen] = useState(false)
	const pathname = usePathname()
	const [openPost, setOpenPost] = useState(false)
	const [selImage, setSelImage] = useState(null)
	const { 'profile-by-id': id } = useParams()
	const [isUploading, setIsUploading] = useState(false)

	const [searchFollower, setSearchFollower] = useState('')
	const [searchFollowing, setSearchFollowing] = useState('')

	const check = () => {
		return (
			pathname === '/profile/posts' ||
			pathname === '/profile' ||
			pathname === '/profile/saved'
		)
	}

	const Update = () => {
		getMySubscribtions()
		GetSubscribers(pathname, id)
		getSubscribtions(pathname, id)
		if (check()) {
			getMyProfile()
			get_storyes()
		} else {
			getUserProfile(id)
			get_other_storyes(id)
		}
	}

	const follow = async id => {
		const currentlyFollowed = MYsubscribtions?.some(
			s => s?.userShortInfo?.userId === id
		)
		try {
			if (currentlyFollowed) {
				updateSubscriptionState(id, false)
				await dontFollowUser(id)
				Update()
			} else {
				updateSubscriptionState(id, true)
				await followUser(id)
				Update()
			}
		} catch (err) {
			updateSubscriptionState(id, currentlyFollowed)
			console.error('Ошибка при переключении подписки:', err)
		}
	}

	useEffect(() => {
		Update()
	}, [pathname])

	useEffect(() => {
		// Проверка на клиенте перед использованием localStorage
		if (typeof window !== 'undefined') {
			if (!localStorage.getItem('access_token')) {
				window.location.href = '/login'
			}
		}
	}, [])

	const profileLoading = getMyProfileLoading || getUserProfileLoading
	const storiesLoading = getStoryesLoading || getOtherStoryesLoading

	const [theme, setTheme] = useDarkSide()

	return (
		<div className='relative dark:bg-black w-full min-h-screen mx-auto overflow-hidden text-sm leading-5'>
			<div className='w-full h-full md:px-[10%] flex flex-col items-center md:gap-10 pt-16 pb-10'>
				<Link className='md:hidden absolute top-5 right-5' href={'/setting'}>
					<Settings className='text-black dark:text-white' />
				</Link>
				<div
					className={`flex flex-row items-center md:px-0 px-[5%] gap-6 ${
						!(profileLoading && !data) && 'hidden'
					} w-full h-[160px]`}
				>
					<div className='hidden md:block'>
						<Skeleton variant='circular' width={160} height={160} />
					</div>
					<div className='md:hidden'>
						<Skeleton variant='circular' width={100} height={100} />
					</div>
					<div className='md:flex flex-col hidden gap-4 w-[436px]'>
						<Skeleton variant='text' width={200} height={40} />
						<Skeleton variant='text' width={250} height={28} />
						<Skeleton variant='text' width={180} height={28} />
					</div>
					<div className='md:hidden grid grid-cols-3 items-center justify-items-center gap-x-2'>
						<Skeleton variant='text' width={36} height={38} />
						<Skeleton variant='text' width={36} height={38} />
						<Skeleton variant='text' width={38} height={38} />
						<Skeleton variant='text' width={56} height={28} />
						<Skeleton variant='text' width={56} height={28} />
						<Skeleton variant='text' width={58} height={28} />
					</div>
				</div>

				<Modal
					open={openPost}
					onClose={() => {
						setOpenPost(false)
						setSelImage(null)
					}}
					className='flex items-center justify-center'
				>
					<form
						className='flex justify-center flex-col px-[1%] items-center w-full max-w-[500px] relative m-auto h-full bg-white dark:bg-[#121212]'
						onSubmit={async e => {
							e.preventDefault()
							if (selImage === null) return
							setIsUploading(true)
							try {
								const formData = new FormData()
								selImage.length > 1
									? Array.from(selImage).forEach(file => {
											formData.append('Image', file)
									  })
									: formData.append('Image', selImage[0])

								// Безопасное получение postId с проверкой на клиенте
								let postId = 161 // fallback
								if (typeof window !== 'undefined') {
									postId = localStorage.getItem('postId') || 161
								}

								const response = await axiosRequest.post(
									`https://instagram-api.softclub.tj/Story/AddStories`,
									formData
								)

								if (response.status === 200) {
									setSelImage(null)
									setOpenPost(false)
									get_storyes()
								}
							} catch (error) {
								console.error('Ошибка при загрузке:', error)
							} finally {
								setIsUploading(false)
							}
						}}
					>
						<X
							onClick={() => {
								setOpenPost(false)
								setSelImage(null)
							}}
							className='absolute top-5 right-5 cursor-pointer text-black dark:text-white'
						/>

						{!selImage ? (
							<label
								htmlFor='upload'
								className='cursor-pointer max-w-full w-full h-full max-h-3/4 rounded-xl border-dashed border-2 border-black dark:border-white flex items-center justify-center flex-col'
							>
								<Camera className='text-gray-500 dark:text-[#A8A8A8]' />
							</label>
						) : (
							<label
								htmlFor='upload'
								className='max-w-full bg-black w-full h-full max-h-2/3 rounded-xl relative p-3 border-2'
							>
								{selImage?.[0]?.type?.includes('image') ? (
									<Image
										src={URL.createObjectURL(selImage[0])}
										alt='Preview'
										fill
										className='object-contain bg-black rounded-xl'
									/>
								) : (
									<video
										src={URL.createObjectURL(selImage[0])}
										autoPlay
										muted
										loop
										className='absolute bg-black size-full top-0 left-0 rounded-xl object-contain'
									/>
								)}
							</label>
						)}
						<input
							type='file'
							id='upload'
							name='image'
							required
							className='hidden'
							onChange={e => setSelImage(e.target.files || null)}
						/>

						<button
							type='submit'
							disabled={!selImage || isUploading}
							className='mt-4 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50'
						>
							{isUploading ? 'Uploading...' : 'Upload'}
						</button>
					</form>
				</Modal>

				{!(profileLoading && !data) && (
					<div className='w-full h-fit'>
						<div className='flex flex-row items-center md:px-0 px-[5%] gap-6 w-full h-[160px]'>
							<div
								onClick={() =>
									((stories && stories[0]?.stories) ||
										stories?.stories?.length > 0) &&
									setMyStoriesOpen(true)
								}
								className={`${
									((stories && stories[0]?.stories) ||
										stories?.stories?.length > 0) &&
									'p-1 relative cursor-pointer bg-gradient-to-tr'
								} from-purple-500 via-pink-500 to-blue-500 rounded-full`}
							>
								<div
									className={`rounded-full relative md:size-[160px] size-[100px] dark:border-black border-white object-cover ${
										(stories && stories[0]?.stories) ||
										stories?.stories?.length > 0
											? 'border-4'
											: ''
									}`}
								>
									<Image
										src={
											data?.image
												? 'https://instagram-api.softclub.tj/images/' +
												  data?.image
												: Profile
										}
										alt=''
										fill
										className='object-cover rounded-full'
									/>
								</div>
								{!pathname.includes(id) && (
									<div
										onClick={e => {
											e.stopPropagation(), setOpenPost(true)
										}}
										className='absolute bottom-0 right-0 md:w-14 md:h-14 bg-gray-900 border-2 border-white rounded-full w-8 h-8 flex items-center justify-center'
									>
										<Plus className='text-white md:size-10' />
									</div>
								)}
							</div>
							{MyStoriesOpen && stories && (
								<StoriesViewer
									data={check() ? [stories[0]] : [stories]}
									onClose={() => setMyStoriesOpen(false)}
									id={1}
								/>
							)}
							<div className='flex flex-col items-start justify-start gap-5 w-[436px] h-[132px]'>
								<div className='flex flex-row items-center justify-between w-full h-[40px]'>
									<h2 className='font-bold md:static absolute top-10 left-1/2 -translate-1/2 md:text-xl text-3xl leading-7 text-gray-900 dark:text-white'>
										{data?.userName}
									</h2>
								</div>
								<div className='flex flex-row items-start justify-between gap-2 min-w-full md:min-w-[269px] h-5'>
									<div className='flex md:flex-row flex-col items-center gap-0.5 cursor-pointer'>
										<span className='font-semibold md:text-sm text-lg leading-5 text-gray-900 dark:text-white'>
											{data?.postCount}
										</span>
										<span className='text-sm text-gray-600 dark:text-[#A8A8A8]'>
											posts
										</span>
									</div>
									<div
										className='flex md:flex-row flex-col items-center gap-0.5 cursor-pointer'
										onClick={() => setOpenSubscribers(true)}
									>
										<span className='font-semibold md:text-sm text-lg leading-5 text-gray-900 dark:text-white'>
											{data?.subscribersCount}
										</span>
										<span className='text-sm text-gray-600 dark:text-[#A8A8A8]'>
											followers
										</span>
									</div>
									<div
										className='flex md:flex-row flex-col items-center gap-0.5 cursor-pointer'
										onClick={() => setOpenSubscribtions(true)}
									>
										<span className='font-semibold md:text-sm text-lg leading-5 text-gray-900 dark:text-white'>
											{data?.subscriptionsCount}
										</span>
										<span className='text-sm text-gray-600 dark:text-[#A8A8A8]'>
											following
										</span>
									</div>
								</div>
								<div className='md:flex hidden flex-row items-center w-full h-[40px]'>
									<h2 className='font-bold text-xl leading-7 text-gray-900 dark:text-white'>
										{data?.firstName} {data?.lastName}
									</h2>
								</div>
							</div>

							<div className='ml-auto hidden md:block mb-auto mt-10'>
								{check() ? (
									<div className='flex gap-3'>
										<Link
											href='/setting/account'
											className='px-4 py-2 truncate rounded-lg bg-gray-300 dark:bg-[#262626] text-black dark:text-white'
										>
											Edit Profile
										</Link>
										<Tooltip
											className='bg-white dark:bg-[#262626]'
											title={
												<div className='flex scale-120 shadow-md rounded-lg w-[150px] bg-white dark:bg-[#262626] text-[13px] flex-col'>
													<Link
														href={'/setting'}
														className='py-2 text-start px-4 text-black dark:text-white hover:bg-gray-100 dark:hover:bg-[#363636]'
													>
														Settings and privacy
													</Link>
													<Link
														href={'/login'}
														onClick={() => {
															if (typeof window !== 'undefined') {
																localStorage.removeItem('access_token')
															}
														}}
														className='text-red-500 dark:text-red-400 py-2 text-start px-4 hover:bg-gray-100 dark:hover:bg-[#363636]'
													>
														Log out
													</Link>
												</div>
											}
											placement='bottom'
										>
											<Menu className='text-black dark:text-white' />
										</Tooltip>
									</div>
								) : MYsubscribtions?.some(
										s => s?.userShortInfo?.userId === id
								  ) ? (
									<button
										onClick={() => follow(id)}
										className='py-3 px-8 rounded-lg text-lg font-semibold bg-blue-50 dark:bg-[#262626] text-blue-300 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-[#363636]'
									>
										Following
									</button>
								) : (
									<button
										onClick={() => follow(id)}
										className='py-3 px-8 rounded-lg text-lg font-semibold bg-blue-50 dark:bg-[#262626] text-blue-500 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-[#363636]'
									>
										Follow
									</button>
								)}
							</div>
						</div>
						<div className='md:hidden px-[5%] mb-4'>
							{!pathname.includes(id) ? (
								<Link href={'/setting/account'}>
									<p className='py-1 w-full text-center rounded mb-2 bg-gray-200 dark:bg-[#262626] text-black dark:text-white'>
										Edit account
									</p>
								</Link>
							) : MYsubscribtions?.some(
									s => s?.userShortInfo?.userId === id
							  ) ? (
								<button
									onClick={() => follow(id)}
									className='py-1 w-full rounded text-center bg-blue-50 dark:bg-[#262626] text-blue-300 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-[#363636]'
								>
									Following
								</button>
							) : (
								<button
									onClick={() => follow(id)}
									className='py-1 w-full rounded text-center bg-blue-50 dark:bg-[#262626] text-blue-500 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-[#363636]'
								>
									Follow
								</button>
							)}
							<h2 className='font-bold text-lg text-gray-900 dark:text-white'>
								{data?.firstName} {data?.lastName}
							</h2>
							<h2 className='text-base text-gray-900 dark:text-white'>
								{data?.about}
							</h2>
						</div>
					</div>
				)}

				{storiesLoading && !stories ? (
					<div className='flex flex-row md:px-0 px-[5%] gap-4 w-full'>
						{Array.from({ length: 5 }).map((_, i) => (
							<div key={i} className='flex flex-col items-center gap-2'>
								<Skeleton variant='circular' width={64} height={64} />
								<Skeleton variant='text' width={40} height={20} />
							</div>
						))}
					</div>
				) : (
					stories?.length > 0 && (
						<UserStoriesSlider
							users={stories?.slice(1, stories.length)}
							onOpen={() => setCloseShowStories(true)}
							giveId={setToId}
						/>
					)
				)}

				{closeShowStories && (
					<StoriesViewer
						data={stories.slice(1, stories.length)}
						onClose={() => setCloseShowStories(false)}
						id={storiesId}
					/>
				)}

				<ProfileTabs />

				<div className='w-full px-[5%] mt-2 md:px-0'>{children}</div>
			</div>

			<Modal open={openSubscribers} onClose={() => setOpenSubscribers(false)}>
				<div
					style={{ scrollbarWidth: 'none' }}
					className='overflow-y-auto md:w-1/3 md:max-h-3/4 absolute top-1/2 left-1/2 outline-none h-full -translate-1/2 p-5 w-full md:rounded-lg bg-white dark:bg-[#121212]'
				>
					<Box className='flex justify-between items-center mb-2'>
						<Typography variant='h6' className='text-black dark:text-white'>
							Followers
						</Typography>
						<IconButton onClick={() => setOpenSubscribers(false)}>
							<CloseIcon className='text-black dark:text-white' />
						</IconButton>
					</Box>
					<input
						type='text'
						onInput={e => setSearchFollower(e.target.value)}
						className='py-2 px-4 bg-gray-100 dark:bg-[#262626] w-full mb-3 rounded-lg outline-none text-black dark:text-white placeholder-gray-500 dark:placeholder-[#A8A8A8]'
						placeholder='Search..'
					/>
					{getSubscribersLoading && !subscribers ? (
						<Typography className='text-gray-500 dark:text-[#A8A8A8]'>
							Loading...
						</Typography>
					) : subscribers?.length ? (
						subscribers
							?.filter(item =>
								item?.userShortInfo?.userName
									?.toLowerCase()
									.includes(searchFollower.toLowerCase().trim())
							)
							.map(({ userShortInfo: u }) => {
								const handleToggleFollow = async () => {
									const currentlyFollowed = MYsubscribtions?.some(
										s => s?.userShortInfo?.userId === u?.userId
									)

									try {
										if (currentlyFollowed) {
											updateSubscriptionState(u?.userId, false)
											await dontFollowUser(u?.userId)
											Update()
										} else {
											updateSubscriptionState(u?.userId, true)
											await followUser(u?.userId)
											Update()
										}
									} catch (err) {
										updateSubscriptionState(u?.userId, currentlyFollowed)
										console.error('Ошибка при переключении подписки:', err)
									}
								}

								return (
									<Box
										key={u?.userId}
										className='flex items-center justify-between mb-2'
									>
										<Link
											href={`/profile/${u?.userId}/posts`}
											className='flex items-center gap-2'
										>
											{u?.userPhoto ? (
												<div className='w-10 h-10 relative'>
													<Image
														src={
															u?.userPhoto
																? `https://instagram-api.softclub.tj/images/${u?.userPhoto}`
																: Profile
														}
														alt=''
														fill
														className='rounded-full object-cover'
													/>
												</div>
											) : (
												<div className='w-10 h-10 rounded-full flex items-center justify-center bg-gradient-to-tr from-pink-500 via-purple-500 to-blue-500 text-white'>
													{u?.userName?.charAt(0).toUpperCase()}
												</div>
											)}
											<Typography className='text-black dark:text-white'>
												{u?.userName}
											</Typography>
										</Link>

										<button
											onClick={handleToggleFollow}
											disabled={
												followUserLoading[u?.userId] ||
												dontFollowUserLoading[u?.userId]
											}
											className={`px-3 py-1 rounded-lg text-sm font-medium ${
												!MYsubscribtions?.some(
													s => s?.userShortInfo?.userId === u?.userId
												)
													? 'bg-blue-500 text-white'
													: 'bg-gray-200 text-gray-700 dark:bg-[#363636] dark:text-[#A8A8A8]'
											}`}
										>
											{MYsubscribtions?.some(
												s => s?.userShortInfo?.userId === u?.userId
											)
												? 'Following'
												: 'Follow'}
										</button>
									</Box>
								)
							})
					) : (
						<Typography className='text-gray-500 dark:text-[#A8A8A8]'>
							No followers
						</Typography>
					)}
				</div>
			</Modal>
			<Modal
				open={openSubscribtions}
				onClose={() => setOpenSubscribtions(false)}
			>
				<div
					style={{ scrollbarWidth: 'none' }}
					className='overflow-y-auto md:w-1/3 md:max-h-3/4 absolute top-1/2 left-1/2 outline-none h-full -translate-1/2 p-5 w-full md:rounded-lg bg-white dark:bg-[#121212]'
				>
					<Box className='flex justify-between items-center mb-2'>
						<Typography variant='h6' className='text-black dark:text-white'>
							Following
						</Typography>
						<IconButton onClick={() => setOpenSubscribtions(false)}>
							<CloseIcon className='text-black dark:text-white' />
						</IconButton>
					</Box>
					<input
						type='text'
						onInput={e => setSearchFollowing(e.target.value)}
						className='py-2 px-4 bg-gray-100 dark:bg-[#262626] w-full mb-3 rounded-lg outline-none text-black dark:text-white placeholder-gray-500 dark:placeholder-[#A8A8A8]'
						placeholder='Search..'
					/>

					{getSubscribtionsLoading && !subscribtions ? (
						<Typography className='text-gray-500 dark:text-[#A8A8A8]'>
							Loading...
						</Typography>
					) : subscribtions?.length ? (
						subscribtions
							?.filter(item =>
								item?.userShortInfo?.userName
									?.toLowerCase()
									.includes(searchFollowing.toLowerCase().trim())
							)
							.map(({ userShortInfo: u }) => {
								const handleToggleFollow = async () => {
									const currentlyFollowed = MYsubscribtions?.some(
										s => s?.userShortInfo?.userId === u?.userId
									)

									try {
										if (currentlyFollowed) {
											updateSubscriptionState(u?.userId, false)
											await dontFollowUser(u?.userId)
											Update()
										} else {
											updateSubscriptionState(u?.userId, true)
											await followUser(u?.userId)
											Update()
										}
									} catch (err) {
										updateSubscriptionState(u?.userId, currentlyFollowed)
										console.error('Ошибка при переключении подписки:', err)
									}
								}

								return (
									<Box
										key={u?.userId}
										className='flex items-center justify-between mb-2'
									>
										<Link
											href={`/profile/${u?.userId}/posts`}
											className='flex items-center gap-2'
										>
											{u?.userPhoto ? (
												<div className='w-10 h-10 relative'>
													<Image
														src={
															u?.userPhoto
																? `https://instagram-api.softclub.tj/images/${u?.userPhoto}`
																: Profile
														}
														alt=''
														fill
														className='rounded-full object-cover'
													/>
												</div>
											) : (
												<div className='w-10 h-10 rounded-full flex items-center justify-center bg-gradient-to-tr from-pink-500 via-purple-500 to-blue-500 text-white'>
													{u?.userName?.charAt(0).toUpperCase()}
												</div>
											)}
											<Typography className='text-black dark:text-white'>
												{u?.userName}
											</Typography>
										</Link>

										<button
											onClick={handleToggleFollow}
											disabled={
												followUserLoading[u?.userId] ||
												dontFollowUserLoading[u?.userId]
											}
											className={`px-3 py-1 rounded-lg text-sm font-medium ${
												!MYsubscribtions?.some(
													s => s?.userShortInfo?.userId === u?.userId
												)
													? 'bg-blue-500 text-white'
													: 'bg-gray-200 text-gray-700 dark:bg-[#363636] dark:text-[#A8A8A8]'
											}`}
										>
											{MYsubscribtions?.some(
												s => s?.userShortInfo?.userId === u?.userId
											)
												? 'Following'
												: 'Follow'}
										</button>
									</Box>
								)
							})
					) : (
						<Typography className='text-gray-500 dark:text-[#A8A8A8]'>
							No following
						</Typography>
					)}
				</div>
			</Modal>
		</div>
	)
}
