"use client"
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Menu, MenuItem, Tooltip, tooltipClasses } from '@mui/material'
import Profile from '@/assets/icon/layout/instagramDefaultProfile.jpg'
import { useTranslation } from 'react-i18next'
import styled from '@emotion/styled'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'

import {
	add,
	compas,
	compasActive,
	homeIcon,
	homeIconActive,
	instagramMiniLogo,
	like,
	likeActive,
	message,
	messageActive,
	searchIcon,
	searchIconActive,
	setting,
	settings,
	threads,
	video,
	videoActive,
} from '@/assets/icon/layout/svg'
import axios from 'axios'
import NotificationMini from '@/components/notification/Notification-mini'

const LightTooltip = styled(({ className, ...props }) => (
	<Tooltip {...props} classes={{ popper: className }} />
))(() => ({
	[`& .${tooltipClasses.tooltip}`]: {
		backgroundColor: 'white',
		color: 'black',
		boxShadow: '0 0 5px 1px rgba(0,0,0, .0975)',
		fontSize: 11,
		'.MuiTooltip-arrow': {
			color: 'white',
		},
	},
}))

const MiniSideBar = ({ children }) => {
	const router = useRouter()
	const pathname = usePathname()
	const { t } = useTranslation()

	const [data, setData] = useState(null)
	const [isClient, setIsClient] = useState(false)

	// Проверка клиентской стороны
	useEffect(() => {
		setIsClient(true)
	}, [])

	const GetProfil = async () => {
		if (!isClient) return
		try {
			const { data } = await axios.get(
				"http://37.27.29.18:8003/UserProfile/get-my-profile",
				{
					headers: {
						Authorization: `Bearer ${localStorage.getItem("access_token")}`,
					},
				}
			)
			setData(data.data)
		} catch (error) {}
	}

	useEffect(() => {
		GetProfil()
	}, [isClient])

	const renderIcon = (path, activeIcon, inactiveIcon) => {
		return pathname === path ? inactiveIcon : activeIcon
	}

	return (
		<div className='flex dark:bg-gray-900'>
			<section className='flex justify-center w-[50px] border-r-[2px] border-[#eee] dark:border-gray-700 h-[100vh] dark:bg-gray-900'>
				<div className='sideBar h-full pb-[100px]'>
					<div className='m-auto flex justify-center pb-[10px] mt-[20px]'>{instagramMiniLogo}</div>
					<div className='flex flex-col justify-between h-full'>
						<div className='flex flex-col gap-[0.5rem] mt-4'>
							<LightTooltip title={t('layout.home')} placement='right' arrow>
								<Link href='/' passHref>
									<div className='flex items-center super-svg gap-4 w-[90%] rounded-[8px] h-[52px] px-0 justify-center dark:hover:bg-gray-800'>
										{renderIcon('/', homeIconActive, homeIcon)}
									</div>
								</Link>
							</LightTooltip>

							<LightTooltip title={t('layout.explore')} placement='right' arrow>
								<Link href='/explore' passHref>
									<div className='flex items-center super-svg gap-4 w-[90%] rounded-[8px] h-[52px] px-0 justify-center dark:hover:bg-gray-800'>
										{renderIcon('/explore', compasActive, compas)}
									</div>
								</Link>
							</LightTooltip>

							<LightTooltip title={t('layout.reels')} placement='right' arrow>
								<Link href='/reels' passHref>
									<div className='flex items-center super-svg gap-4 w-[90%] rounded-[8px] h-[52px] px-0 justify-center dark:hover:bg-gray-800'>
										{renderIcon('/reels', videoActive, video)}
									</div>
								</Link>
							</LightTooltip>

							<LightTooltip title={t('layout.message')} placement='right' arrow>
								<Link href='/chats' passHref>
									<div className='flex items-center super-svg gap-4 w-[90%] rounded-[8px] h-[52px] px-0 justify-center dark:hover:bg-gray-800'>
										{renderIcon('/chats', messageActive, message)}
									</div>
								</Link>
							</LightTooltip>

							<NotificationMini />

							<LightTooltip title={t('layout.create')} placement='right' arrow>
								<div className='flex items-center super-svg gap-4 w-[90%] rounded-[8px] h-[52px] px-0 justify-center dark:hover:bg-gray-800'>
									{add}
								</div>
							</LightTooltip>

							<LightTooltip title={t('layout.profile')} placement='right' arrow>
								{isClient && data ? (
									<Link href='/profile' passHref>
										<div className='flex items-center super-svg gap-4 w-[90%] rounded-[8px] h-[52px] px-0 justify-center dark:hover:bg-gray-800'>
											<Image
												className={`${
													router.pathname === '/profile'
														? 'border-[2px] border-solid border-[black] dark:border-white rounded-[50%]'
														: ''
												} text-[16px] rounded-full object-cover block`}
												src={"http://37.27.29.18:8003/images/" + data?.image}
												width={25}
												height={25}
												alt='Profile'
											/>
										</div>
									</Link>
								) : (
									<Link href='/login' passHref>
										<div className='flex items-center super-svg gap-4 w-[90%] rounded-[8px] h-[52px] px-0 justify-center dark:hover:bg-gray-800'>
											<Image
												className={`${
													router.pathname === '/profile'
														? 'border-[2px] border-solid border-[black] dark:border-white rounded-[50%]'
														: ''
												} text-[16px] block w-[25px] h-[25px]`}
												src={Profile}
												width={25}
												height={25}
												alt='Profile'
											/>
										</div>
									</Link>
								)}
							</LightTooltip>
						</div>
					</div>
				</div>
			</section>

			<div className='ml-[0px] w-full dark:bg-gray-900 dark:text-white'>{children}</div>
		</div>
	)
}

export default MiniSideBar
