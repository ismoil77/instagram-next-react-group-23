'use client'

import Profile from '@/assets/icon/layout/instagramDefaultProfile.jpg'
import useDarkSide from '@/hook/useDarkSide'
import axiosRequest from '@/lib/axiosRequest'
import { useProfiles } from '@/store/pages/profile/profile/store-profile'
import Link from 'next/link'
import { useEffect, useState } from 'react'

const EditProfile = () => {
	const [name, setName] = useState('') // firstName + lastName
	const [username, setUsername] = useState('')
	const [bio, setBio] = useState('')
	const [gender, setGender] = useState(0) // 0 = not specified, 1 = male, 2 = female
	const [avatar, setAvatar] = useState(null) // локальный файл
	const [isSubmitting, setIsSubmitting] = useState(false)
	const [isUploading, setIsUploading] = useState(false)
	const { data, getMyProfile, getMyProfileLoading } = useProfiles()
	const [theme, setTheme] = useDarkSide()

	// Загружаем профиль при монтировании
	useEffect(() => {
		getMyProfile()
	}, [])

	// Когда данные пришли — заполняем форму
	useEffect(() => {
		if (data) {
			setName(
				`${data.firstName || ''} ${data.lastName || ''}`.trim() ||
					data.userName ||
					''
			)
			setUsername(data.userName || '')
			setBio(data.about || '')
			setGender(Number(data.gender) || 0) // преобразуем строку в число
		}
	}, [data])

	// Обновление профиля
	const handleSubmitProfile = async e => {
		e.preventDefault()
		setIsSubmitting(true)

		try {
			const response = await axiosRequest.put(
				'https://instagram-api.softclub.tj/UserProfile/update-user-profile',
				{
					about: bio,
					gender: gender,
				}
			)

			if (response.status === 200) {
				getMyProfile()
			}
		} catch (error) {
			console.error('Error updating profile:', error)
		} finally {
			setIsSubmitting(false)
		}
	}

	// Загрузка аватара
	const handleSubmitImage = async () => {
		if (!avatar) {
			alert('⚠️ Please select a file first.')
			return
		}

		const formData = new FormData()
		formData.append('imageFile', avatar)
		setIsUploading(true)
		try {
			const response = await axiosRequest.put(
				'https://instagram-api.softclub.tj/UserProfile/update-user-image-profile',
				formData,
				{
					headers: {
						'Content-Type': 'multipart/form-data',
					},
				}
			)

			if (response.status === 200) {
				setAvatar(null)
				getMyProfile()
			}
		} catch (error) {
			console.error('Error uploading image:', error)
		} finally {
			setIsUploading(false)
		}
	}

	const getAvatarUrl = () => {
		if (avatar) return URL.createObjectURL(avatar)
		if (data?.image)
			return `https://instagram-api.softclub.tj/images/${data.image}`
		return Profile
	}

	if (getMyProfileLoading && !data) {
		return (
			<div className='min-h-screen bg-gray-50 dark:bg-[#121212] p-6 flex items-center justify-center'>
				<div className='text-gray-500 dark:text-[#A8A8A8]'>
					Loading profile...
				</div>
			</div>
		)
	}

	return (
		<div className='min-h-screen bg-gray-50 dark:bg-[#121212] p-6'>
			<div className='max-w-3xl mx-auto'>
				{/* Breadcrumb */}
				<div className='flex items-center space-x-2 text-sm font-medium mb-6'>
					<Link
						href='/profile/posts'
						className='text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300'
					>
						Profile
					</Link>
					<span className='text-gray-400 dark:text-[#A8A8A8]'>{'>'}</span>
					<span className='text-gray-700 dark:text-white'>Edit profile</span>
				</div>

				{/* Profile Header */}
				<div className='bg-gray-100 dark:bg-[#262626] rounded-xl p-5 mb-6 flex items-center justify-between'>
					<div className='flex items-center space-x-4'>
						<img
							src={getAvatarUrl()}
							alt='Profile'
							className='w-16 h-16 rounded-full object-cover border-2 border-white dark:border-[#363636] shadow-sm'
							onError={e => {
								e.target.src = 'https://via.placeholder.com/64'
							}}
						/>
						<div>
							<p className='font-semibold text-gray-900 dark:text-white'>
								{username}
							</p>
							<p className='text-gray-600 dark:text-[#A8A8A8] text-sm'>
								{name}
							</p>
						</div>
					</div>
					<div className='flex gap-5'>
						<label
							htmlFor='upload'
							type='button'
							className='px-4 py-2 bg-white dark:bg-[#262626] border border-gray-300 dark:border-[#363636] rounded-lg text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-[#363636] transition-colors duration-200 text-sm font-medium cursor-pointer'
						>
							Change photo
						</label>
						<input
							type='file'
							name='imageFile'
							onChange={e => {
								setAvatar(e.target.files[0])
							}}
							className='hidden'
							id='upload'
						/>
						{avatar && (
							<button
								disabled={isSubmitting}
								className='px-4 py-2 bg-white dark:bg-[#262626] border border-gray-300 dark:border-[#363636] rounded-lg text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-[#363636] transition-colors duration-200 text-sm font-medium'
								onClick={handleSubmitImage}
							>
								{isUploading ? 'Uploading...' : 'Submit changes'}
							</button>
						)}
					</div>
				</div>

				{/* Form */}
				<form onSubmit={handleSubmitProfile} className='space-y-4'>
					{/* Name */}
					<div>
						<label className='block text-xs text-gray-500 dark:text-[#A8A8A8] font-medium mb-1'>
							Name
						</label>
						<input
							type='text'
							value={name}
							onChange={e => setName(e.target.value)}
							className='w-full px-4 py-3 border border-gray-300 dark:border-[#363636] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-[#181818] text-gray-900 dark:text-white text-base'
							placeholder='Enter your name'
						/>
					</div>

					{/* Username */}
					<div>
						<label className='block text-xs text-gray-500 dark:text-[#A8A8A8] font-medium mb-1'>
							User name
						</label>
						<input
							type='text'
							value={username}
							onChange={e => setUsername(e.target.value)}
							className='w-full px-4 py-3 border border-gray-300 dark:border-[#363636] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-[#181818] text-gray-900 dark:text-white text-base'
							placeholder='Enter username'
						/>
					</div>

					{/* Bio */}
					<div>
						<label className='block text-xs text-gray-500 dark:text-[#A8A8A8] font-medium mb-1'>
							Bio
						</label>
						<textarea
							value={bio}
							onChange={e => setBio(e.target.value)}
							rows={4}
							className='w-full px-4 py-3 border border-gray-300 dark:border-[#363636] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-[#181818] text-gray-900 dark:text-white text-base resize-none'
							placeholder='Tell us about yourself...'
						/>
					</div>

					{/* Gender */}
					<div>
						<label className='block text-xs text-gray-500 dark:text-[#A8A8A8] font-medium mb-1'>
							Gender
						</label>
						<select
							value={gender}
							onChange={e => setGender(Number(e.target.value))}
							className='w-full px-4 py-3 border border-gray-300 dark:border-[#363636] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-[#181818] text-gray-900 dark:text-white text-base'
						>
							<option value={0}>Not specified</option>
							<option value={1}>Male</option>
							<option value={2}>Female</option>
						</select>
					</div>

					<p className='text-xs text-gray-500 dark:text-[#A8A8A8]'>
						This won't be part of your public profile.
					</p>

					{/* Submit Button */}
					<button
						type='submit'
						disabled={isSubmitting}
						className={`w-full py-3 px-6 rounded-lg text-sm font-medium transition-colors duration-200 ${
							isSubmitting
								? 'bg-gray-300 dark:bg-[#363636] text-gray-500 dark:text-[#A8A8A8] cursor-not-allowed'
								: 'bg-gray-200 dark:bg-[#262626] text-gray-700 dark:text-white hover:bg-gray-300 dark:hover:bg-[#363636]'
						}`}
					>
						{isSubmitting ? 'Saving...' : 'Submit'}
					</button>
				</form>
			</div>
		</div>
	)
}

export default EditProfile
