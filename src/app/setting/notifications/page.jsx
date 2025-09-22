'use client'

import { useSubscribers } from '@/store/pages/notification/notification'
import { Avatar } from '@mui/material'
import { MoveLeft } from 'lucide-react'
import Link from 'next/link'
import { useEffect } from 'react'

const NotificationsPage = () => {
	const { data, loading, error, getSubscribers, followToUser } =
		useSubscribers()

	useEffect(() => {
		getSubscribers()
	}, [])

	return (
		<div className='md:max-w-2xl w-full absolute md:relative z-[20] bg-white px-4 py-6'>
			<div className='flex justify-start mb-6 gap-3 items-center'>
				<Link href='/setting' className='md:hidden block '>
					<button className='md:hidden block '>
						<MoveLeft />
					</button>
				</Link>
				<h1 className='text-2xl font-bold text-gray-900 dark:text-white'>
					Уведомления
				</h1>
			</div>

			{loading && (
				<div className='flex justify-center mt-8'>
					<div className='w-6 h-6 border-4 border-blue-500 border-t-transparent rounded-full animate-spin' />
				</div>
			)}

			{error && <p className='text-red-500 text-center mt-4'>{error}</p>}

			{!loading && !error && data.length > 0 && (
				<div className='space-y-4'>
					<h3 className='text-sm font-semibold text-gray-800 dark:text-gray-200'>
						На этой неделе
					</h3>

					{data.map(({ id, userShortInfo }) => (
						<div
							key={id}
							className='flex items-center justify-between p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-[#1f1f1f]'
						>
							<Link
								href={`/profile/${userShortInfo.userId}`}
								className='flex items-center gap-3'
							>
								<Avatar
									src={
										userShortInfo.userPhoto
											? `https://instagram-api.softclub.tj/images/${userShortInfo.userPhoto}`
											: '/default-avatar.png'
									}
									alt={userShortInfo.userName}
									className='w-11 h-11 rounded-full object-cover'
								/>
								<div>
									<p className='text-sm font-medium text-gray-900 dark:text-white'>
										{userShortInfo.userName}
									</p>
									<p className='text-xs text-gray-500 dark:text-gray-400'>
										подписался(-ась) на вас
									</p>
								</div>
							</Link>

							<button
								onClick={() =>
									followToUser(userShortInfo.userId, userShortInfo.isSubscriber)
								}
								className={`px-3 py-1 text-sm rounded-md font-medium active:scale-95 transition ${
									userShortInfo.isSubscriber
										? 'bg-white dark:bg-[#2a2a2a] text-gray-900 dark:text-white border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-[#333]'
										: 'bg-blue-500 text-white hover:bg-blue-600'
								}`}
							>
								{userShortInfo.isSubscriber ? 'Подписан' : 'Подписаться'}
							</button>
						</div>
					))}
				</div>
			)}

			{!loading && !error && data.length === 0 && (
				<p className='text-center text-gray-500 dark:text-gray-400 mt-6'>
					Пока уведомлений нет
				</p>
			)}
		</div>
	)
}

export default NotificationsPage
