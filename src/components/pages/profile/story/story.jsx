import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'

export function StoriesViewer({ data, onClose, id }) {
	const [currentStoryIndex, setCurrentStoryIndex] = useState(0)
	const [currentMediaIndex, setCurrentMediaIndex] = useState(0)
	const [progress, setProgress] = useState(0)
	const timerRef = useRef(null)

	useEffect(() => {
		if (id) {
			const startIndex = data.findIndex(user => user.userId === id)
			if (startIndex !== -1) setCurrentStoryIndex(startIndex)
		}
	}, [id, data])

	const currentStory = data[currentStoryIndex]
	const currentMedia = currentStory?.stories[currentMediaIndex]

	useEffect(() => {
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
	}, [currentMediaIndex, currentStoryIndex])

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
			prevStory()
			const prev = data[currentStoryIndex - 1]
			setCurrentMediaIndex(prev.stories.length - 1)
		}
	}

	return (
		<div className='fixed inset-0 bg-black/70 flex flex-col items-center justify-center z-50'>
			<button
				onClick={onClose}
				className='absolute top-4 right-4 text-white dark:text-gray-200 text-3xl z-50'
			>
				×
			</button>

			<div className='flex items-center justify-center gap-4 flex-1 w-full'>
				{currentStoryIndex > 0 && (
					<div
						onClick={prevStory}
						className='w-[150px] hidden dark:border border-gray-200 md:block md:w-[250px] relative h-[250px] sm:h-[300px] md:h-[400px] bg-black/50 dark:bg-gray-800 rounded-xl overflow-hidden cursor-pointer opacity-70 hover:opacity-100 transition-all'
					>
						<div className='absolute top-[40%] right-[20%] flex items-center gap-2 px-2 py-1 bg-gradient-to-b z-20 rounded'>
							<div className='w-12 relative h-12 sm:w-14 sm:h-14 rounded-full overflow-hidden border border-white'>
								<Image
									src={`https://instagram-api.softclub.tj/images/${
										data[currentStoryIndex - 1]?.stories[0].fileName
									}`}
									alt={data[currentStoryIndex - 1]?.userName}
									fill
									className='object-cover border-2 border-red-500'
								/>
							</div>
							<span className='text-xs sm:text-sm font-medium text-white dark:text-gray-200 bg-black/60 dark:bg-gray-700 p-[2px] rounded'>
								{data[currentStoryIndex - 1]?.userName.slice(0, 4) + '...'}
							</span>
						</div>
						<Image
							src={`https://instagram-api.softclub.tj/images/${
								data[currentStoryIndex - 1].stories[0].fileName
							}`}
							alt={data[currentStoryIndex - 1].userName}
							fill
							className='object-cover'
						/>
					</div>
				)}

				<div className='relative w-full md:w-[400px] h-full dark:border border-gray-200 md:h-[650px] bg-black md:rounded-xl overflow-hidden shadow-2xl flex flex-col'>
					<div className='absolute top-2 left-0 right-0 flex gap-1 px-3 z-30'>
						{currentStory?.stories.map((_, idx) => (
							<div
								key={idx}
								className='flex-1 bg-gray-700 dark:bg-gray-600 rounded-full overflow-hidden'
							>
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
						<div className='w-8 h-8 rounded-full relative overflow-hidden border border-white'>
							<Image
								src={`https://instagram-api.softclub.tj/images/${currentStory?.userImage}`}
								alt={currentStory?.userName}
								fill
								className='object-cover'
							/>
						</div>
						<span className='text-sm font-medium text-white dark:text-gray-200'>
							{currentStory?.userName}
						</span>
					</div>

					<div className='relative flex-1 flex items-center justify-center'>
						{currentMedia ? (
							<Image
								src={`https://instagram-api.softclub.tj/images/${currentMedia.fileName}`}
								alt='Story'
								fill
								className='object-contain'
							/>
						) : (
							<p className='text-gray-400 dark:text-gray-300'>Нет медиа</p>
						)}

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
						onClick={nextStory}
						className='w-[150px] dark:border border-gray-200 hidden md:flex md:w-[250px] relative h-[250px] md:h-[400px] bg-black/50 dark:bg-gray-800 rounded-xl overflow-hidden cursor-pointer opacity-70 hover:opacity-100 transition-all'
					>
						<div className='absolute top-[40%] right-[20%] flex items-center gap-2 px-2 py-1 bg-gradient-to-b z-20 rounded'>
							<div className='w-12 h-12 relative rounded-full overflow-hidden border border-white'>
								<Image
									src={`https://instagram-api.softclub.tj/images/${
										data[currentStoryIndex + 1]?.stories[0].fileName
									}`}
									alt={data[currentStoryIndex + 1]?.userName}
									fill
									className='object-cover border-2 border-red-500'
								/>
							</div>
							<span className='text-xs font-medium text-white dark:text-gray-200 bg-black/60 dark:bg-gray-700 p-[2px] rounded'>
								{data[currentStoryIndex + 1]?.userName.slice(0, 4) + '...'}
							</span>
						</div>
						<Image
							src={`https://instagram-api.softclub.tj/images/${
								data[currentStoryIndex + 1].stories[0].fileName
							}`}
							alt={data[currentStoryIndex + 1].userName}
							fill
							className='object-cover'
						/>
					</div>
				)}
			</div>

			<div className='flex gap-2 mt-4 p-4 absolute bottom-0 w-full justify-center overflow-x-auto'>
				{data?.map((user, idx) => (
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
						<div className='w-10 h-10 relative  flex items-center justify-center rounded-full bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600 p-[2px]'>
							{user.userImage ? (
								<Image
									src={`https://instagram-api.softclub.tj/images/${user.userImage}`}
									alt={user.userName}
									fill
									className='rounded-full object-cover border-2 border-black dark:border-gray-800'
								/>
							) : (
								<p>{user.userName?.charAt(0).toUpperCase()}</p>
							)}
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

export default function UserStoriesSlider({ users, onOpen, giveId }) {
	return (
		<div className='flex items-center justify-center gap-4 p-4 max-sm:p-0 bg-white dark:bg-black rounded-xl relative w-full max-sm:w-full'>
			<div className='w-full'>
				<div
					style={{ scrollbarWidth: 'none' }}
					className='flex gap-4 overflow-x-auto px-2'
				>
					{users.map((user, index) => (
						<div
							key={user.userId}
							onClick={() => {
								onOpen()
								giveId(user.userId)
							}}
							className='flex flex-col items-center text-center min-w-[60px] max-w-[60px] cursor-pointer'
						>
							<div className='rounded-full p-[2px] bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600 shadow-md'>
								{user.userImage ? (
									<div className='relative w-[60px] h-[60px] rounded-full'>
										<Image
											src={`https://instagram-api.softclub.tj/images/${user.userImage}`}
											alt={user.userName}
											fill
											className='rounded-full object-cover'
										/>
									</div>
								) : (
									<div className='w-[60px] h-[60px] flex items-center justify-center bg-blue-500 text-white font-bold text-lg rounded-full'>
										{user.userName.charAt(0).toUpperCase()}
									</div>
								)}
							</div>
							<p className='mt-2 text-xs text-gray-700 dark:text-gray-300 truncate w-full'>
								{user.userName}
							</p>
						</div>
					))}
				</div>
			</div>
		</div>
	)
}
