'use client'
import Image from 'next/image'
import { useEffect, useState } from 'react'

import googleIcon from '../../../assets/img/pages/auth/registration/google_play.png'
import instagramIcon from '../../../assets/img/pages/auth/registration/inst_logo_auth.png'
import microsoftIcon from '../../../assets/img/pages/auth/registration/microsoft.png'
import mockPhones from '../../../assets/img/pages/auth/registration/phones.png'

import { useLogin } from '@/store/pages/auth/login/loginStore'
import axios from 'axios'
import { useRouter } from 'next/navigation' // ✅ правильно для App Router

export default function Login() {
	const { login, loading, error } = useLogin()
	const router = useRouter()
	const [form, setForm] = useState({
		username: 'terrylucas',
		password: 'password',
	})

	const [isClient, setIsClient] = useState(false)

	useEffect(() => {
		setIsClient(true) // флаг, что мы на клиенте
	}, [])

	const getUsers = async name => {
		if (!isClient) return false
		try {
			const token = localStorage.getItem('access_token')
			const { data } = await axios.get(
				`https://instagram-api.softclub.tj/User/get-users?UserName=${name}&PageSize=1000`,
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			)
			const find = data.data.find(
				i => i.userName.toLowerCase() === name.toLowerCase()
			)
			if (find) {
				localStorage.setItem('userID', find.id)
				return true
			}
			return false
		} catch (error) {
			return false
		}
	}

	const handleSubmit = async e => {
		e.preventDefault()
		const res = await login(form)
		if (res.success) {
			if (!isClient) return
			const result = await getUsers(form.username)
			if (result) router.push('/')
		}
	}

	return (
		<div className='min-h-screen bg-white flex items-center justify-center mx-auto'>
			<div className='w-full p-6 bg-white '>
				<div className='flex flex-col lg:flex-row gap-8 '>
					{/* Левая часть с изображением */}
					<div className='flex-1 flex items-center justify-center max-sm:hidden'>
						<div className='w-full max-w-md flex flex-col items-center'>
							<img
								src={mockPhones}
								alt='phones'
								className='mx-auto max-h-[420px] object-contain'
							/>
							<div className='mt-4 flex flex-col items-center'>
								<p className='text-sm text-gray-500 mb-2'>Get the app</p>
								<div className='flex gap-3'>
									<img src={googleIcon} alt='Google Play' />
									<img src={microsoftIcon} alt='Microsoft' />
								</div>
							</div>
						</div>
					</div>

					{/* Правая часть с формой */}
					<div className='flex-1 flex items-center justify-center'>
						<div className='w-full max-w-sm'>
							<div className='p-8 rounded-md bg-white'>
								<div className='flex flex-col items-center'>
									<img src={instagramIcon} alt='Instagram' className='mb-4' />

									<form className='w-full' onSubmit={handleSubmit}>
										<input
											className='w-full px-3 py-2 mb-3 border rounded-md text-sm'
											placeholder='Phone number, username or email'
											value={form.username}
											onChange={e =>
												setForm({ ...form, username: e.target.value })
											}
										/>
										<input
											type='password'
											className='w-full px-3 py-2 mb-4 border rounded-md text-sm'
											placeholder='Password'
											value={form.password}
											onChange={e =>
												setForm({ ...form, password: e.target.value })
											}
										/>

										<button
											type='submit'
											disabled={loading || !isClient}
											className='w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-md mb-3'
										>
											{loading ? 'Logging in...' : 'Log in'}
										</button>

										{error && (
											<p className='text-red-500 text-sm mb-3'>{error}</p>
										)}
									</form>
								</div>
							</div>
							<div className='mt-6 text-center text-xs text-gray-400'>
								© 2024 Instagram from Meta
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}
