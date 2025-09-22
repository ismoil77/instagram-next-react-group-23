'use client'
import usePostStore from '@/store/pages/home/home'
import { API_IMAGE } from '@/utils/config'

import { useEffect, useRef, useState } from 'react'

const StoriesViewer = ({ onClose, startUserId }) => {
	const { stories, fetchStories } = usePostStore()
	const [data, setData] = useState([])
	const [currentStoryIndex, setCurrentStoryIndex] = useState(0)
	const [currentMediaIndex, setCurrentMediaIndex] = useState(0)
	const [progress, setProgress] = useState(0)
	const [isPaused, setIsPaused] = useState(false)
	const timerRef = useRef(null)
	const { deleteStory } = usePostStore()

	useEffect(() => {
		fetchStories()
	}, [])


	useEffect(() => {
		const timeout = setTimeout(() => {

			if (!stories || !Array.isArray(stories) || stories.length === 0) {
				setCurrentStoryIndex(0)
				setCurrentMediaIndex(0)
				return
			}

			if (!startUserId) {
				setCurrentStoryIndex(0)
				setCurrentMediaIndex(0)
				return
			}

			const idx = stories.findIndex(
				user => String(user?.userId || '') === String(startUserId)
			)

			if (idx !== -1) {
				setCurrentStoryIndex(idx)
				setCurrentMediaIndex(0)
			} else {
			
				setCurrentStoryIndex(0)
				setCurrentMediaIndex(0)
			}
		}, 1000) 

		return () => clearTimeout(timeout)
	}, []) 
	useEffect(() => {
		setData(stories)
	}, [stories])

	useEffect(() => {
		const currentStory = data[currentStoryIndex]
		const currentMedia = currentStory?.stories?.[currentMediaIndex]

		if (!currentMedia || isPaused) {
			clearInterval(timerRef.current)
			return
		}

		setProgress(0)
		clearInterval(timerRef.current)

		timerRef.current = setInterval(() => {
			setProgress(prev => {
				if (prev >= 100) {
					nextMedia()
					return 0
				}
				return prev + 1
			})
		}, 50)

		return () => clearInterval(timerRef.current)
	}, [currentMediaIndex, currentStoryIndex, isPaused, data])

	const currentStory = data[currentStoryIndex]
	const currentMedia = currentStory?.stories?.[currentMediaIndex]

	const nextStory = () => {
		if (currentStoryIndex < data.length - 1) {
			setCurrentStoryIndex(currentStoryIndex + 1)
			setCurrentMediaIndex(0)
		} else {
			onClose?.()
		}
	}

	const prevStory = () => {
		if (currentStoryIndex > 0) {
			setCurrentStoryIndex(currentStoryIndex - 1)
			setCurrentMediaIndex(0)
		}
	}

	const nextMedia = () => {
		if (currentMediaIndex < currentStory.stories.length - 1) {
			setCurrentMediaIndex(currentMediaIndex + 1)
		} else {
			nextStory()
		}
	}

	const prevMedia = () => {
		if (currentMediaIndex > 0) {
			setCurrentMediaIndex(currentMediaIndex - 1)
		} else if (currentStoryIndex > 0) {
			const prev = data[currentStoryIndex - 1]
			setCurrentStoryIndex(currentStoryIndex - 1)
			setCurrentMediaIndex(prev.stories.length - 1)
		}
	}

	const renderMedia = fileName => {
		if (!fileName)
			return <p className='text-gray-400 dark:text-gray-300'>Нет медиа</p>
		if (fileName.endsWith('.mp4')) {
			return (
				<video
					src={`${API_IMAGE}/${fileName}`}
					autoPlay
					muted
					controls
					className='w-full h-full object-contain'
				/>
			)
		}
		return (
			<img
				src={`${API_IMAGE}/${fileName}`}
				alt='Story'
				className='w-full h-full object-contain'
			/>
		)
	}



	return (
		<div className='fixed inset-0 bg-black/90 dark:bg-gray-900 flex flex-col items-center justify-center z-50'>
			<button
				onClick={onClose}
				className='absolute top-4 right-4 text-white dark:text-gray-200 text-3xl z-50'
			>
				×
			</button>

			<div className='flex items-center justify-center gap-4 flex-1 w-full px-2 sm:px-6 max-sm:hidden'>
				{currentStoryIndex > 0 && (
					<div
						onClick={() => {
							setCurrentStoryIndex(currentStoryIndex - 1)
							setCurrentMediaIndex(0)
						}}
						className='w-[150px] sm:w-[200px] md:w-[250px] relative h-[250px] sm:h-[300px] md:h-[400px] bg-black/50 dark:bg-gray-800 rounded-xl overflow-hidden cursor-pointer opacity-70 hover:opacity-100 transition-all'
					>
						<div className='absolute top-[40%] right-[20%] flex items-center gap-2 px-2 py-1 bg-gradient-to-b z-20 rounded'>
							<div className='w-12 h-12 sm:w-14 sm:h-14 rounded-full overflow-hidden border border-white'>
								{renderMedia(data[currentStoryIndex - 1]?.stories[0]?.fileName)}
							</div>
							<span className='text-xs sm:text-sm font-medium text-white dark:text-gray-200 bg-black/60 dark:bg-gray-700 p-[2px] rounded'>
								{data[currentStoryIndex - 1]?.userName.slice(0, 4) + '...'}
							</span>
						</div>
					</div>
				)}

				<div className='relative w-[300px] sm:w-[350px] md:w-[400px] h-[450px] sm:h-[550px] md:h-[650px] bg-black/50 dark:bg-gray-800 rounded-xl overflow-hidden shadow-2xl flex flex-col'>
					<div
						className='absolute top-2 left-0 right-0 flex gap-1 px-3 z-30'
						onMouseEnter={() => setIsPaused(true)}
						onMouseLeave={() => setIsPaused(false)}
					>
						{currentStory?.stories.map((nj, idx) => (
							<div
								key={idx}
								className='flex-1 bg-gray-700 dark:bg-gray-600 rounded-full overflow-hidden cursor-pointer'
								onClick={() => setCurrentMediaIndex(idx)}
							>
								<button
									className='bg-red-500 absolute top-[30px] cursor-pointer right-[30px] rounded p-[5px]'
									onClick={() => deleteStory(nj.id)}
								>
									🗑️
								</button>
								<div
									className='h-1 bg-white dark:bg-gray-200 transition-all'
									style={{
										width:
											idx < currentMediaIndex
												? '100%'
												: idx === currentMediaIndex
												? `${progress}%`
												: '0%',
									}}
								/>
							</div>
						))}
					</div>

					<div className='absolute top-0 left-0 right-0 flex items-center gap-2 px-3 py-2 bg-gradient-to-b from-black/60 dark:from-gray-900/60 to-transparent z-20'>
						<div className='w-8 h-8 rounded-full overflow-hidden border border-white'>
							<img
								src={
									currentStory?.userImage == '' || currentStory?.userImage == null
										? 'https://cdn.pixabay.com/photo/2023/02/18/11/00/icon-7797704_640.png'
										: `${API_IMAGE}/${currentStory?.userImage}`
								}
								alt={currentStory?.userName}
								className='w-full h-full object-cover'
							/>
						</div>
						<span className='text-sm font-medium text-white dark:text-gray-200'>
							{currentStory?.userName}
						</span>
					</div>

					<div className='relative flex-1 flex items-center justify-center'>
						{renderMedia(currentMedia?.fileName)}
						<div
							className='absolute left-0 top-0 h-full w-1/2 cursor-pointer'
							onClick={prevMedia}
						/>
						<div
							className='absolute right-0 top-0 h-full w-1/2 cursor-pointer'
							onClick={nextMedia}
						/>
					</div>
				</div>

				{currentStoryIndex < data.length - 1 && (
					<div
						onClick={() => {
							setCurrentStoryIndex(currentStoryIndex + 1)
							setCurrentMediaIndex(0)
						}}
						className='w-[150px] sm:w-[200px] md:w-[250px] relative h-[250px] sm:h-[300px] md:h-[400px] bg-black/50 dark:bg-gray-800 rounded-xl overflow-hidden cursor-pointer opacity-70 hover:opacity-100 transition-all '
					>
						<div className='absolute top-[40%] right-[20%] flex items-center gap-2 px-2 py-1 bg-gradient-to-b z-20 rounded'>
							<div className='w-12 h-12 sm:w-14 sm:h-14 rounded-full overflow-hidden border border-white'>
								{renderMedia(data[currentStoryIndex + 1]?.stories[0]?.fileName)}
							</div>
							<span className='text-xs sm:text-sm font-medium text-white dark:text-gray-200 bg-black/60 dark:bg-gray-700 p-[2px] rounded'>
								{data[currentStoryIndex + 1]?.userName.slice(0, 4) + '...'}
							</span>
						</div>
					</div>
				)}
			</div>

			<div className='flex gap-2 sm:gap-4 mt-4 p-4 absolute bottom-0 w-full justify-center overflow-x-auto'>
				{data.map((user, idx) => (
					<div
						key={user.userId}
						onClick={() => {
							setCurrentStoryIndex(idx)
							setCurrentMediaIndex(0)
						}}
						className={`flex flex-col items-center cursor-pointer ${
							idx === currentStoryIndex ? 'opacity-100' : 'opacity-60'
						}`}
					>
						<div className='w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600 p-[2px]'>
							<img
								src={
									user.userImage == '' || user.userImage == null
										? 'https://cdn.pixabay.com/photo/2023/02/18/11/00/icon-7797704_640.png'
										: `${API_IMAGE}/${user.userImage}`
								}
								alt={user.userName}
								className='w-full h-full rounded-full object-cover border-2 border-black dark:border-gray-800'
							/>
						</div>
						<span className='mt-1 text-[10px] sm:text-xs text-white dark:text-gray-200'>
							{user.userName}
						</span>
					</div>
				))}
			</div>
		</div>
	)

}

export default StoriesViewer