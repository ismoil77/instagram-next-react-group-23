'use client'
import { useChatStore } from '@/store/pages/chat/chat'
import Box from '@mui/material/Box'
import Modal from '@mui/material/Modal'
import Skeleton from '@mui/material/Skeleton'
import Typography from '@mui/material/Typography'
import { MessageCircleMore } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState } from 'react'

const style = {
	position: 'absolute',
	top: '50%',
	left: '50%',
	transform: 'translate(-50%, -50%)',
	width: { xs: '90%', sm: 450 },
	maxWidth: '90vw',
	bgcolor: 'background.paper',
	borderRadius: 2,
	boxShadow: 24,
	p: { xs: 3, sm: 4 },
	outline: 'none',
	'&:focus': { outline: 'none' },
}

export default function DefaultChat() {
	const {
		chats,
		loading,
		error,
		getChats,
		profile,
		getProfile,
		deleteChat,
		users,
		getUsers,
		createChat,
	} = useChatStore()

	useEffect(() => {
		getChats()
		getProfile()
		getUsers()
	}, [])

	const [idx, setIdx] = useState(null)
	const [openDelete, setOpenDelete] = useState(false)
	const [openUsers, setOpenUsers] = useState(false)

	const handleOpenDelete = () => setOpenDelete(true)
	const handleCloseDelete = () => setOpenDelete(false)

	const handleOpenUsers = () => setOpenUsers(true)
	const handleCloseUsers = () => setOpenUsers(false)
	const [search, setSearch] = useState('')

	if (loading)
		return (
			<div className='md:block hidden '>
				{Array.from({ length: 8 }).map((_, i) => (
					<div key={i} className='flex items-center p-[8px]'>
						<Skeleton variant='circular' width={55} height={55} />
						<div className='flex flex-col'>
							<Skeleton variant='text' width={200} />
							<Skeleton variant='text' height={20} width={100} />
						</div>
					</div>
				))}
			</div>
		)

	if (error)
		return <p className='text-center mt-10 text-red-500'>Error: {error}</p>

	return (
		<div className='min-h-screen w-[600px] p-4'>
			<Modal open={openDelete} onClose={handleCloseDelete}>
				<Box sx={style}>
					<Typography
						variant='h6'
						component='h2'
						fontWeight='bold'
						textAlign='center'
					>
						Delete Chat?
					</Typography>
					<Typography
						sx={{ mt: 2, mb: 4, textAlign: 'center', color: 'text.secondary' }}
					>
						Are you sure you want to delete this chat? This action cannot be
						undone.
					</Typography>
					<div className='flex justify-center gap-4'>
						<button
							onClick={handleCloseDelete}
							className='px-6 py-2.5 rounded-lg bg-gray-200 text-gray-800 font-medium hover:bg-gray-300'
						>
							Cancel
						</button>
						<Link href={`/chats`}>
							<button
								onClick={() => {
									deleteChat(idx)
									getChats()
									handleCloseDelete()
								}}
								className='px-6 py-2.5 rounded-lg bg-red-600 text-white font-medium hover:bg-red-700'
							>
								Yes, Delete
							</button>
						</Link>
					</div>
				</Box>
			</Modal>

			<Modal
				open={openUsers}
				onClose={() => {
					handleCloseUsers()
					setSearch('')
				}}
			>
				<Box sx={style}>
					<Typography
						variant='h6'
						component='h2'
						fontWeight='bold'
						textAlign='center'
					>
						All Users
					</Typography>
					<input
						type='text'
						value={search}
						onChange={e => setSearch(e.target.value)}
						placeholder='Search...'
						className='w-full max-w-sm px-4 py-2 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none shadow-sm transition-all duration-200'
					/>

					<ul className='mt-4 max-h-[60vh] overflow-y-auto space-y-3'>
						{users && users.length > 0 ? (
							users
								?.filter(el => el.userName != profile?.userName)
								?.filter(
									el =>
										el.userName
											.toLowerCase()
											.trim()
											.includes(search.toLowerCase().trim()) ||
										el.fullName
											.toLowerCase()
											.trim()
											.includes(search.toLowerCase().trim())
								)
								.map((user, i) => (
									<li
										key={user.id}
										className='flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 cursor-pointer'
									>
										<div className='flex justify-between w-full items-center '>
											<div className='flex items-center gap-3 '>
												{user.avatar ? (
													<img
														src={`https://instagram-api.softclub.tj/images/${user.avatar}`}
														alt={user.userName}
														className='w-12 h-12 rounded-full object-cover'
													/>
												) : (
													<div className='w-12 h-12 rounded-full bg-gray-400 flex items-center justify-center text-white font-bold'>
														{user.userName?.[0]?.toUpperCase() || '?'}
													</div>
												)}
												<div className='flex flex-col '>
													<Link href={`/profile/${user.id}`}>
														<span className='font-medium text-[16px]'>
															{user.userName}
														</span>
													</Link>
													<span className='font-medium text-[12px]'>
														{user.fullName}
													</span>
												</div>
											</div>
											<MessageCircleMore
												onClick={() => {
													createChat(user.id)
													handleCloseUsers()
												}}
												className='text-[#94A3B8] '
											/>
										</div>
									</li>
								))
						) : (
							<p className='text-center text-gray-500'>No users found</p>
						)}
					</ul>
				</Box>
			</Modal>

			<div className='mb-6 flex justify-between border-b border-gray-200 pb-4'>
				<h1 className='text-2xl font-bold text-gray-900'>
					{profile?.userName}
				</h1>
				<button
					onClick={handleOpenUsers}
					className='text-blue-600 hover:text-blue-700'
				>
					<svg
						xmlns='http://www.w3.org/2000/svg'
						fill='none'
						viewBox='0 0 24 24'
						strokeWidth={1.5}
						stroke='currentColor'
						className='size-6'
					>
						<path
							strokeLinecap='round'
							strokeLinejoin='round'
							d='m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10'
						/>
					</svg>
				</button>
			</div>

			{chats.length === 0 ? (
				<p className='text-center text-gray-500'>No chats found.</p>
			) : (
				<ul className='space-y-2 max-h-[80vh] w-full overflow-y-auto'>
					{chats.map(chat => (
						<Link key={chat.chatId} href={`/chats/${chat.chatId}`}>
							<li
								onDoubleClick={e => {
									e.preventDefault()
									setIdx(chat.chatId)
									handleOpenDelete()
								}}
								className='flex items-center gap-4 p-3 rounded-xl hover:bg-gray-200 transition cursor-pointer'
							>
								{chat.receiveUserName === profile?.userName ? (
									chat.sendUserImage ? (
										<img
											src={`https://instagram-api.softclub.tj/images/${chat.sendUserImage}`}
											alt={chat.sendUserName}
											className='w-14 h-14 rounded-full object-cover'
										/>
									) : (
										<div className='w-14 h-14 rounded-full bg-gray-400 flex items-center justify-center text-white text-xl font-bold'>
											{chat.sendUserName?.[0].toUpperCase() || '?'}
										</div>
									)
								) : chat.receiveUserImage ? (
									<img
										src={`https://instagram-api.softclub.tj/images/${chat.receiveUserImage}`}
										alt={chat.receiveUserName}
										className='w-14 h-14 rounded-full object-cover'
									/>
								) : (
									<div className='w-14 h-14 rounded-full bg-gray-400 flex items-center justify-center text-white text-xl font-bold'>
										{chat.receiveUserName?.[0].toUpperCase() || '?'}
									</div>
								)}
								<div className='flex-1'>
									<div className='flex justify-between items-center'>
										<Link
											href={`/profile/${
												chat.sendUserName === profile?.userName
													? chat.receiveUserId
													: chat.sendUserId
											}`}
										>
											<h2 className='font-semibold text-gray-900'>
												{chat.receiveUserName != profile?.userName
													? chat.receiveUserName
													: chat.sendUserName}
											</h2>
										</Link>
										<span className='text-xs text-gray-500 '>14 ч.</span>
									</div>
									<p className='text-gray-500 text-sm truncate'>
										{chat.receiveUserName}
									</p>
								</div>
							</li>
						</Link>
					))}
				</ul>
			)}
		</div>
	)
}
