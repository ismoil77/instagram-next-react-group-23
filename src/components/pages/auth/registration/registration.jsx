'use client'

import phones from '@/assets/img/pages/auth/registration/phones.png'
import google_play from '@/assets/img/pages/auth/registration/google_play.png'
import microsoft from '@/assets/img/pages/auth/registration/microsoft.png'
import inst_logo_auth from '@/assets/img/pages/auth/registration/inst_logo_auth.png'
import Image from 'next/image'
import { useState } from 'react'
import Link from 'next/link'
import { useRegistration } from '@/store/pages/auth/registration/registrationStore'
import { useRouter } from 'next/navigation'
import axiosRequest from '@/lib/axiosRequest'

export default function RegisttrationComp() {
	const { registrate } = useRegistration()
	const [email, setEmail] = useState('')
	const [userName, setUserName] = useState('')
	const [fullName, setFullName] = useState('')
	const [password, setPassword] = useState('')
	const [confirmPassword, setConfirmPassword] = useState('')
	const router = useRouter()
	const [showPassword, setShowPassword] = useState(false)

	async function handleRegist(e) {
		e.preventDefault()
		const user = {
			userName: e.target.userName.value,
			fullName: e.target.fullName.value,
			email: e.target.email.value,
			password: e.target.password.value,
			confirmPassword: e.target.confirmPassword.value,
		}
		console.log(user)

		let result = await registrate(user)
		if (result.success) {
			router.push('/login')
		} else {
			console.log('something is go wrong')
		}
	}

	return (
		<>
			<section className='p-5 md:max-w-[1400px] md:m-auto flex justify-around md:items-center'>
				<aside className='hidden md:block'>
					<Image src={phones} alt='phones' />
					<div className='mt-[15px] flex flex-col items-center gap-5'>
						<p>Установите приложение</p>

						<div className='flex  items-center justify-center gap-8 '>
							<Link
								href={
									'https://play.google.com/store/apps/details?id=com.instagram.android&hl=ru'
								}
								target='_blank'
							>
								<Image
									src={google_play}
									alt='phones'
									className='hidden md:block'
								/>
							</Link>
							<Link
								target='_blank'
								href={
									'https://apps.microsoft.com/detail/9nblggh5l9xt?hl=ru-RU&gl=RU'
								}
							>
								<Image
									src={microsoft}
									alt='phones'
									className='hidden md:block'
								/>
							</Link>
						</div>
					</div>
				</aside>
				<aside className=''>
					<div className='min-h-screen flex items-center justify-center'>
						<div className='w-full max-w-sm border border-gray-200 rounded-xl p-6 bg-white'>
							<div className='flex justify-center mb-6'>
								<Image src={inst_logo_auth} alt='inst_logo_auth' />
							</div>

							<form className='space-y-3' onSubmit={(e) => handleRegist(e)}>
								<input
									type='email'
									placeholder='Email'
									className='w-full px-4 py-2 border rounded bg-gray-50 outline-none focus:border-gray-400'
									value={email}
									onChange={e => setEmail(e.target.value)}
									name='email'
								/>
								<input
									type='text'
									placeholder='Full name'
									className='w-full px-4 py-2 border rounded bg-gray-50 outline-none focus:border-gray-400'
									value={fullName}
									onChange={e => setFullName(e.target.value)}
									name='fullName'
								/>
								<input
									type='text'
									placeholder='Username'
									className='w-full px-4 py-2 border rounded bg-gray-50 outline-none focus:border-gray-400'
									value={userName}
									onChange={e => setUserName(e.target.value)}
									name='userName'
								/>
								<div className='relative'>
									<input
										type={showPassword ? 'text' : 'password'}
										placeholder='Password'
										className='w-full px-4 py-2 border rounded bg-gray-50 outline-none focus:border-gray-400'
										value={password}
										onChange={e => setPassword(e.target.value)}
										name='password'
									/>
									<span
										onClick={() => setShowPassword(!showPassword)}
										className='absolute right-3 top-2.5 cursor-pointer text-gray-500 text-sm'
									>
										👁
									</span>
								</div>
								<div className='relative'>
									<input
										type={showPassword ? 'text' : 'password'}
										placeholder='Confirm Password'
										className='w-full px-4 py-2 border rounded bg-gray-50 outline-none focus:border-gray-400'
										value={confirmPassword}
										onChange={e => setConfirmPassword(e.target.value)}
										name='confirmPassword'
									/>
									<span
										onClick={() => setShowPassword(!showPassword)}
										className='absolute right-3 top-2.5 cursor-pointer text-gray-500 text-sm'
									>
										👁
									</span>
								</div>

								<p className='text-xs text-gray-500 text-center leading-5'>
									By signing up, you agree to our{' '}
									<span className='text-gray-700 font-medium'>Terms</span>,{' '}
									<span className='text-gray-700 font-medium'>
										Privacy Policy
									</span>{' '}
									and{' '}
									<span className='text-gray-700 font-medium'>
										Cookies Policy
									</span>
									.
								</p>

								<button
									type='submit'
									className='w-full py-2 rounded-lg bg-blue-500 text-white font-semibold hover:bg-blue-600 transition'
								>
									Sign up
								</button>
							</form>

							<div className='border-t mt-6 pt-4 text-center text-sm'>
								Have an account?{' '}
								<Link
									href='/login'
									className='text-blue-600 font-medium hover:underline'
								>
									Log in
								</Link>
							</div>
						</div>
					</div>
				</aside>
			</section>
		</>
	)
}
