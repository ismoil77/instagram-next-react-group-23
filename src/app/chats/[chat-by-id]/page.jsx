'use client'
import InstaAudio from '@/components/pages/chats/audio'
import InstagramImage from '@/components/pages/chats/InstagramImage'
import InstagramVideo from '@/components/pages/chats/InstagramVideo'
import { useChatStore } from '@/store/pages/chat/pages/chat-by-id/chatbyid'
import { Skeleton } from '@mui/material'
import EmojiPicker from 'emoji-picker-react'
import {
	ArrowLeft,
	EllipsisVertical,
	Image as ImageIcon,
	Mic,
	Phone,
	Send,
	Smile,
	Trash2,
} from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'

function isSingleEmoji(text) {
	if (!text) return false
	const emojiRegex = /^\p{Extended_Pictographic}$/u
	return emojiRegex.test(text.trim())
}

export default function ChatById({ params }) {
	const {
		chatById,
		getChatById,
		sendMessage,
		deleteMessage,
		loading,
		error,
		profile,
		getProfile,
	} = useChatStore()

	const chatId = params['chat-by-id']
	const [showEmojiPicker, setShowEmojiPicker] = useState(false)
	const chatContainerRef = useRef(null)
	const [message, setMessage] = useState('')
	const [file, setFile] = useState(null)
	const [isRecording, setIsRecording] = useState(false)
	const [mediaRecorder, setMediaRecorder] = useState(null)
	const [hoveredMessage, setHoveredMessage] = useState(null)
	const [modalOpen, setModalOpen] = useState(false)
	const [call, setCall] = useState(false)

	const startRecording = async () => {
		try {
			const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
			const recorder = new MediaRecorder(stream)
			const chunks = []
			recorder.ondataavailable = e => e.data.size && chunks.push(e.data)
			recorder.onstop = () => {
				const blob = new Blob(chunks, { type: 'audio/webm' })
				setFile(new File([blob], 'voice-message.webm', { type: 'audio/webm' }))
			}
			recorder.start()
			setMediaRecorder(recorder)
			setIsRecording(true)
		} catch (err) {
			alert('Не удалось получить доступ к микрофону.')
		}
	}
	const stopRecording = () => {
		if (mediaRecorder && isRecording) {
			mediaRecorder.stop()
			mediaRecorder.stream.getTracks().forEach(t => t.stop())
			setIsRecording(false)
		}
	}
	const handleMicClick = () =>
		isRecording ? stopRecording() : startRecording()

	function renderMessage(el) {
		const baseUrl = 'https://instagram-api.softclub.tj/images/'
		const fileName = el.file || el.messageText
		if (!fileName) return null
		const lower = fileName.toLowerCase()
		if (/\.(jpg|png|webp|svg)$/i.test(lower))
			return <InstagramImage src={baseUrl + fileName} />
		if (/\.(mp4)$/i.test(lower))
			return <InstagramVideo src={baseUrl + fileName} />
		if (/\.(mp3|wav|webm)$/i.test(lower))
			return <InstaAudio src={baseUrl + fileName} />
		return <span className='w-auto '>{fileName}</span>
	}

	useEffect(() => {
		if (chatId) {
			getChatById(chatId)
			getProfile()
		}
	}, [chatId, getChatById, getProfile])

	useEffect(() => {
		if (chatContainerRef.current) {
			chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight
		}
	}, [chatById])

	const handleSend = async () => {
		if (!message && !file) return
		await sendMessage({ chatId, messageText: message, file })
		setMessage('')
		setFile(null)
		getChatById(chatId)
	}

	const handleDelete = async id => {
		await deleteMessage(id)
		setModalOpen(false)
		getChatById(chatId)
	}

	if (loading)
		return (
			<div className='md:relative absolute h-full bg-white w-full'>
				{Array(5)
					.fill()
					.map((_, i) => (
						<div key={i} className='flex items-center p-[8px]'>
							<div className='flex flex-col '>
								<Skeleton variant='text' height={100} width={200} />
							</div>
						</div>
					))}
			</div>
		)
	if (error) return <p>Error: {error}</p>

	return (
		<div className='w-full absolute md:relative h-screen flex flex-col bg-white'>
			<div className='flex justify-between items-center px-4 py-3 border-b shadow-sm sticky top-0 bg-white z-20'>
				<div className='flex items-center gap-3'>
					<Link href={`/chats`}>
						<button className='md:hidden p-2 rounded-full hover:bg-gray-100 transition'>
							<ArrowLeft className='w-5 h-5 text-gray-700' />
						</button>
					</Link>

					{chatById &&
					chatById.filter(el => el.userName !== profile?.userName).at(0)
						?.userImage ? (
						<Image
							src={`https://instagram-api.softclub.tj/images/${
								chatById.filter(el => el.userName !== profile?.userName).at(0)
									?.userImage
							}`}
							alt='Avatar'
							className='w-12 h-12 rounded-full object-cover border border-gray-200'
						/>
					) : (
						<div className='w-12 h-12 rounded-full bg-gray-400 flex items-center justify-center text-white font-bold text-lg border border-gray-200'>
							{chatById
								? chatById
										.filter(el => el.userName !== profile?.userName)
										.at(0)
										?.userName?.[0]?.toUpperCase() || '?'
								: '?'}
						</div>
					)}

					<h1 className='font-semibold text-gray-800 text-lg truncate'>
						{chatById
							? chatById.filter(el => el.userName !== profile?.userName).at(0)
									?.userName
							: 'Besohib'}
					</h1>
				</div>

				<div className='flex gap-2'>
					<button
						onClick={() => {
							setCall(!call)
						}}
						className='p-2 hover:bg-gray-100 rounded-full transition'
					>
						<Phone />
					</button>
					{call && (
						<div className='fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-[100]'>
							<div className='bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-6 w-80 shadow-2xl flex flex-col items-center animate-fade-in'>
								<div className='relative'>
									<div className='absolute inset-0 rounded-full bg-pink-500/30 animate-ping'></div>
									<Image
										src={
											chatById
												?.filter(el => el.userName !== profile?.userName)
												.at(0)?.userImage
												? `https://instagram-api.softclub.tj/images/${
														chatById
															.filter(el => el.userName !== profile?.userName)
															.at(0)?.userImage
												  }`
												: '/imgdef.jpg'
										}
										alt='User Avatar'
										className='w-28 h-28 rounded-full object-cover border-4 border-white shadow-xl relative z-10'
									/>
								</div>

								<h2 className='mt-5 text-2xl font-bold text-white drop-shadow-md'>
									{
										chatById
											?.filter(el => el.userName !== profile?.userName)
											.at(0)?.userName
									}
								</h2>
								<p className='text-gray-200 text-sm mt-1 tracking-wide'>
									Calling...
								</p>

								<div className='flex gap-8 mt-[10px]'>
									<button
										onClick={() => setCall(false)}
										className='bg-red-500 hover:bg-red-600 text-white w-16 h-16 rounded-full flex items-center justify-center shadow-lg active:scale-90 transition'
									>
										<Phone className='rotate-135' size={28} />
									</button>
								</div>

								<audio autoPlay loop>
									<source src='/phonee.mp3' type='audio/mp3' />
								</audio>
							</div>
						</div>
					)}
				</div>
			</div>
			<div
				ref={chatContainerRef}
				className='flex-1 overflow-y-auto px-4 py-3 bg-gray-50 space-y-4'
			>
				{chatById ? (
					chatById
						.slice()
						.reverse()
						.map((el, i) => {
							const isMe = el.userName === profile?.userName
							const text = el.messageText || ''
							const bubbleBase = isMe
								? 'bg-blue-500 text-white rounded-br-sm'
								: 'bg-white text-gray-800 rounded-bl-sm border'
							const bubbleExtra =
								isSingleEmoji(text) || text.length === 1
									? 'min-w-[70px] min-h-[70px] flex items-center justify-center text-4xl'
									: 'px-3 py-2 text-sm'

							return (
								<div
									key={i}
									className={`flex items-end gap-2 ${
										isMe ? 'justify-end' : 'justify-start'
									}`}
									onMouseEnter={() => setHoveredMessage(el.messageId)}
									onMouseLeave={() => setHoveredMessage(null)}
								>
									{!isMe &&
										(el.userImage ? (
											<Image
												src={`https://instagram-api.softclub.tj/images/${el.userImage}`}
												className='w-7 h-7 rounded-full object-cover'
											/>
										) : (
											<div className='w-12 h-12 rounded-full bg-gray-400 flex items-center justify-center text-white font-bold text-lg border border-gray-200'>
												{chatById
													? chatById
															.filter(el => el.userName !== profile?.userName)
															.at(0)
															?.userName?.[0]?.toUpperCase() || '?'
													: '?'}
											</div>
										))}
									<div className='relative'>
										<div
											className={`rounded-2xl shadow-sm ${bubbleBase} ${bubbleExtra}`}
										>
											{renderMessage(el)}

											{!isSingleEmoji(text) && text.length > 1 && (
												<span className='block text-[10px] text-gray-400 text-right mt-1'>
													{el.sendMassageDate
														? (() => {
																const date = new Date(el.sendMassageDate)
																date.setHours(date.getHours() + 2)
																return date.toLocaleTimeString([], {
																	hour: '2-digit',
																	minute: '2-digit',
																})
														  })()
														: ''}
												</span>
											)}

											{hoveredMessage === el.messageId && (
												<button
													onClick={() => setModalOpen(true)}
													className='absolute top-1 right-1 text-gray-400 hover:text-gray-700 transition'
												>
													<EllipsisVertical size={18} />
												</button>
											)}
										</div>

										{modalOpen && hoveredMessage === el.messageId && (
											<div className='fixed inset-0 bg-opacity-40 flex items-center justify-center z-50'>
												<div className='bg-white rounded-xl p-5 w-64 shadow-lg animate-scale-up'>
													<h2 className='text-gray-800 font-semibold mb-4 text-center'>
														Message Options
													</h2>
													<button
														onClick={() => handleDelete(el.messageId)}
														className='flex items-center gap-2 text-red-600 hover:bg-red-50 px-3 py-2 rounded w-full transition'
													>
														<Trash2 size={16} /> Delete
													</button>
													<button
														onClick={() => setModalOpen(false)}
														className='mt-3 px-3 py-2 w-full bg-gray-200 rounded hover:bg-gray-300 transition'
													>
														Cancel
													</button>
												</div>
											</div>
										)}
									</div>
								</div>
							)
						})
				) : (
					<p className='text-center text-gray-500'>You Don't have any chat</p>
				)}
			</div>
			<div
				className={`flex items-center gap-2 border-t px-3 py-2 bg-white sticky bottom-0 ${
					call ? 'z-0' : 'z-20'
				}`}
			>
				<button
					onClick={() => setShowEmojiPicker(!showEmojiPicker)}
					className='text-gray-500 hover:text-gray-700'
				>
					<Smile size={22} />
				</button>
				{showEmojiPicker && (
					<div className='fixed bottom-20 z-50'>
						<EmojiPicker
							onEmojiClick={emoji => setMessage(prev => prev + emoji.emoji)}
						/>
					</div>
				)}
				<input
					type='text'
					placeholder='Message...'
					value={message}
					onChange={e => setMessage(e.target.value)}
					className='flex-1 min-w-0 px-3 py-2 bg-gray-100 rounded-full outline-none text-sm'
				/>
				<input
					type='file'
					id='fileInput'
					className='hidden'
					onChange={e => setFile(e.target.files[0])}
				/>
				<button
					onClick={handleMicClick}
					className={`cursor-pointer ${
						isRecording
							? 'text-red-500 animate-pulse'
							: 'text-gray-500 hover:text-gray-700'
					}`}
				>
					<Mic size={22} />
				</button>
				<label
					htmlFor='fileInput'
					className='cursor-pointer text-gray-500 hover:text-gray-700'
				>
					<ImageIcon size={22} />
				</label>
				<button
					onClick={handleSend}
					className='text-blue-600 hover:text-blue-800'
				>
					<Send size={22} />
				</button>
			</div>
		</div>
	)
}
