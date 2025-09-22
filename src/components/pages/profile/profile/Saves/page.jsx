'use client'
import image78 from '@/components/pages/profile/profile/Saves/images/image 78.png'
import { useFav } from '@/store/pages/profile/profile/store-profile'
import { Heart, Play } from 'lucide-react'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import Reels from '../Modal'
export default function SavedPage() {
	const { favourite, getFav, getFavLoading } = useFav()
	const [open, setOpen] = useState(false)
	const [start, setStart] = useState(0)

	useEffect(() => {
		getFav()
	}, [])

	const reversedFavourite = favourite?.slice().reverse()
	if (getFavLoading && !favourite) {
		return (
			<div className='flex justify-center items-center w-full h-full py-32'>
				<div className='animate-spin size-[100px] border-b-2 border-pink-500 rounded-full' />
			</div>
		)
	}

	return (
		<div className='flex flex-col items-center gap-5 w-full h-full'>
			{reversedFavourite?.length > 0 ? (
				<div className='grid grid-cols-3 gap-[1px] md:gap-3 w-full'>
					{reversedFavourite?.map((i, idx) => (
						<div key={idx}>
							{i?.images[0]?.endsWith('.mp4') ? (
								<div className='relative w-fit aspect-square'>
									<video
										onClick={() => {
											setStart(idx), setOpen(true)
										}}
										src={
											'https://instagram-api.softclub.tj/images/' + i?.images[0]
										}
										className='w-full h-full md:rounded-lg object-cover bg-black'
										muted
										loop
									/>
									<p className='text-white flex md:gap-2 gap-[3px] items-center absolute bottom-3 left-3'>
										<Heart className='md:size-[20px] lg:size-[30px] size-[15px]' />{' '}
										{i?.postLikeCount}
									</p>
									<p className='text-white flex md:gap-2 gap-[3px] items-center absolute bottom-3 right-3'>
										<Play className='md:size-[20px] lg:size-[30px] size-[15px]' />{' '}
										{i?.postView}
									</p>
								</div>
							) : (
								<div
									onClick={() => {
										setStart(idx), setOpen(true)
									}}
									className='w-full aspect-square relative md:rounded-lg bg-gray-800'
									style={{
										backgroundImage: `url("https://instagram-api.softclub.tj/images/${i?.images[0]}")`,
										backgroundSize: 'cover',
										backgroundPosition: 'center',
									}}
								>
									<p className='text-white flex md:gap-2 gap-[3px] items-center absolute bottom-3 left-3'>
										<Heart className='md:size-[20px] lg:size-[30px] size-[15px]' />{' '}
										{i?.postLikeCount}
									</p>
									<p className='text-white flex md:gap-2 gap-[3px] items-center absolute bottom-3 right-3'>
										<Play className='md:size-[20px] lg:size-[30px] size-[15px]' />{' '}
										{i?.postView}
									</p>
								</div>
							)}
						</div>
					))}
				</div>
			) : (
				<div className='flex items-center py-32 w-full flex-col'>
					<div className='relative w-[150px] h-[200px]'>
						<Image
							src={image78}
							fill
							className='object-cover'
							alt='empty'
						></Image>
					</div>
					<p>Your favourites is empty</p>
				</div>
			)}
			<Reels
				open={open}
				posts={reversedFavourite}
				startIndex={start}
				onClose={() => setOpen(false)}
			/>
		</div>
	)
}
