"use client"
import { usePosts } from '@/store/pages/profile/profile/store-profile'
import axios from 'axios'
import { Heart, Play } from 'lucide-react'
import { useParams, usePathname } from 'next/navigation'
import React, { useState } from 'react'
import Reels from '../Modal'

export default function PostsPage() {
	const pathname = usePathname()
	const { "profile-by-id": id } = useParams()
	const { data, get_my_Posts, get_other_Posts, getMyPostsLoading, getOtherPostsLoading } = usePosts()
	const [open, setOpen] = useState(false)
	const [click, setClick] = useState(false)
	const [start, setStart] = useState(0)


	React.useEffect(() => {
		if (pathname !== "/profile/posts" && pathname !== "/profile" && pathname !== "/profile/saved" && pathname !== "/profile/tagged") {
			get_other_Posts(id)
		}
		else {
			get_my_Posts()
		}
	}, [])

	const getLoading = getMyPostsLoading || getOtherPostsLoading

	if (getLoading && !data) {
		return (<div className='flex justify-center items-center w-full h-full py-32'>
			<div className='animate-spin size-[100px] border-b-2 border-pink-500 rounded-full' />
		</div>)
	}

	if (!getLoading && (data === null)) {
		return (<div className='flex justify-center items-center w-full h-full py-32'>
			<p>Проверьте подключение</p>
		</div>)
	}


	return (
		<div className="flex flex-col items-center gap-3 w-full h-full">
			<div className="grid grid-cols-3 md:gap-3 gap-[1px] w-full h-fit">
				{data?.reverse().map((i, idx) => (
					<div key={idx}>{i?.images[0]?.endsWith(".mp4") ? (<div className='relative w-fit aspect-square'>
						<video
							onClick={() => { setStart(idx), setClick(!click), setOpen(true) }}
							src={"http://37.27.29.18:8003/images/" + i?.images[0]}
							className="w-full h-full md:rounded-lg object-cover bg-black"
							muted
							loop
						/>
						<p className='text-white flex md:gap-2 gap-[3px] items-center absolute bottom-3 left-3'><Heart className='md:size-[20px] lg:size-[30px] size-[15px]' /> {i?.postLikeCount}</p>
						<p className='text-white flex md:gap-2 gap-[3px] items-center absolute bottom-3 right-3'><Play className='md:size-[20px] lg:size-[30px] size-[15px]' /> {i?.postView}</p>
					</div>) :
						(<div
							onClick={() => { setStart(idx), setClick(!click), setOpen(true) }}
							className="w-full aspect-square relative md:rounded-lg bg-gray-800"
							style={{
								backgroundImage: `url("http://37.27.29.18:8003/images/${i?.images[0]}")`,
								backgroundSize: 'cover',
								backgroundPosition: 'center',
							}}
						>
							<p className='text-white flex md:gap-2 gap-[3px] items-center absolute bottom-3 left-3'><Heart className='md:size-[20px] lg:size-[30px] size-[15px]' /> {i?.postLikeCount}</p>
							<p className='text-white flex md:gap-2 gap-[3px] items-center absolute bottom-3 right-3'><Play className='md:size-[20px] lg:size-[30px] size-[15px]' /> {i?.postView}</p>
						</div>)}</div>
				))}
			</div>
			<Reels onClose={() => setOpen(false)} open={open} startIndex={start} posts={data} />
		</div >
	)
}