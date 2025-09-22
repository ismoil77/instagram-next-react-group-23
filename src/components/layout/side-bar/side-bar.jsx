'use client'
import {
	action,
	compas,
	compasActive,
	homeIcon,
	homeIconActive,
	message,
	messageActive,
	threads,
	video,
	videoActive,
} from '@/assets/icon/layout/svg'
import Notification from '@/components/notification/Notification'
import DarkMode from '@/components/settings/darkmode'
import { useUserStore } from '@/hook/GetUser'
import usePostStore from '@/store/pages/home/home'
import { BookmarkBorder, Logout, Settings } from '@mui/icons-material'
import CloseIcon from '@mui/icons-material/Close'
import MenuIcon from '@mui/icons-material/Menu'
import {
	Avatar,
	Box,
	Divider,
	Drawer,
	IconButton,
	InputBase,
	Menu,
	MenuItem,
	Modal,
	Typography,
} from '@mui/material'
import axios from 'axios'
import debounce from 'lodash.debounce'
import { SearchIcon } from 'lucide-react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import CreatePost from '../../createPost/createpost'

const NavLink = ({ href, icon, activeIcon, label, isActive }) => (
	<Link
		href={href}
		className={`flex items-center gap-4 w-[90%] m-auto rounded-md h-[52px] px-4 hover:bg-gray-100 dark:hover:bg-gray-800 dark:text-gray-200 ${isActive(
			href
		)}`}
	>
		{isActive(href) ? activeIcon : icon}
		<p className='text-lg'>{label}</p>
	</Link>
)

export default function SideBar({ children }) {
	const router = useRouter()
	const pathname = usePathname()
	const { t } = useTranslation()
	const { stories, fetchStories } = usePostStore()
	const { users, loading, searchUsers, GetHystory, AddSearchHystory } =
		useUserStore()

	const [anchorEl, setAnchorEl] = useState(null)
	const [dialogOpen, setDialogOpen] = useState(false)
	const [openDrawer, setOpenDrawer] = useState(false)
	const [showDropdown, setShowDropdown] = useState(false)
	const [query, setQuery] = useState('')
	const [data, setData] = useState(null)
	const [isClient, setIsClient] = useState(false)
	const [modalOpen, setModalOpen] = useState(false)

	useEffect(() => {
		setIsClient(true)
		fetchStories()
		GetHystory()
	}, [fetchStories, GetHystory])

	// Получение профиля только на клиенте
	useEffect(() => {
		if (!isClient) return
		const getProfil = async () => {
			try {
				const { data } = await axios.get(
					'https://instagram-api.softclub.tj/UserProfile/get-my-profile',
					{
						headers: {
							Authorization: `Bearer ${localStorage.getItem('access_token')}`,
						},
					}
				)
				setData(data.data)
			} catch {}
		}
		getProfil()
	}, [isClient])

	const isActive = path => (pathname === path ? 'font-bold' : 'font-normal')

	const toggleDrawer = state => () => setOpenDrawer(state)

	const debouncedSearch = useCallback(
		debounce(value => searchUsers(value), 400),
		[searchUsers]
	)

	useEffect(() => {
		debouncedSearch(query)
		return () => debouncedSearch.cancel()
	}, [query, debouncedSearch])

	const handleClick = event => setAnchorEl(event.currentTarget)
	const handleCloseMenu = () => setAnchorEl(null)
	const handleDialogOpen = () => setDialogOpen(true)
	const handleDialogClose = () => setDialogOpen(false)
	const handleModalOpen = () => setModalOpen(true)
	const handleModalClose = () => setModalOpen(false)

	const logOut = () => {
		if (!isClient) return
		localStorage.removeItem('access_token')
		router.push('/login')
	}

	const DrawerList = (
		<Box
			className='p-4 dark:bg-gray-900 dark:text-gray-200'
			role='presentation'
		>
			<div>
				<article className='flex justify-between items-center mb-4'>
					<h1 className='text-[32px] font-medium'>{t('layout.search')}</h1>
					<IconButton onClick={() => setQuery('')}>
						<CloseIcon onClick={toggleDrawer(false)} />
					</IconButton>
				</article>
				<hr className='mb-4 dark:border-gray-700' />
				<div className='relative w-full'>
					<div className='flex items-center border rounded-md overflow-hidden dark:border-gray-700'>
						<div className='px-3'>
							<SearchIcon className='text-gray-500 dark:text-gray-300' />
						</div>
						<InputBase
							value={query}
							placeholder={t('layout.search')}
							className='flex-1 px-2 py-2 dark:text-gray-200'
							onFocus={() => setShowDropdown(true)}
							onChange={e => setQuery(e.target.value)}
						/>
					</div>

					{showDropdown && query && (
						<div className='absolute top-full mt-2 w-full bg-white dark:bg-gray-900 border dark:border-gray-700 rounded-md shadow-lg max-h-60 overflow-y-auto z-50'>
							{loading && (
								<p className='p-2 text-gray-500 dark:text-gray-400'>
									{t('layout.loading')}
								</p>
							)}
							{!loading && users.length === 0 && (
								<p className='p-2 text-gray-500 dark:text-gray-400'>
									{t('layout.noResults')}
								</p>
							)}
							{users.map(user => (
								<Link
									href={`/profile/${user.id}`}
									key={user.id}
									className='p-2 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer flex items-center gap-3'
									onClick={() => {
										AddSearchHystory(user.id)
										setQuery('')
									}}
								>
									<img
										src={
											user.avatar
												? `https://instagram-api.softclub.tj/images/${user.avatar}`
												: 'https://www.truckeradvisor.com/media/uploads/profilePics/notFound.jpg'
										}
										alt={user.userName}
										className='w-10 h-10 rounded-full border'
									/>
									<article>
										<span className='font-medium'>{user.userName}</span>
										<div className='flex gap-2 items-center text-gray-600 dark:text-gray-400'>
											<span>{user.fullName}</span>
											<span className='w-[5px] h-[5px] bg-black dark:bg-gray-400 rounded-full'></span>
											<span>{t('layout.followers')}:</span>
											<span>{user.subscribersCount}</span>
										</div>
									</article>
								</Link>
							))}
						</div>
					)}
				</div>
			</div>
		</Box>
	)

	const modalStyle = {
		position: 'absolute',
		top: '50%',
		left: '50%',
		transform: 'translate(-50%, -50%)',
		width: '40%',
		borderRadius: '30px',
		textAlign: 'center',
		bgcolor: 'background.paper',
		border: '2px solid #000',
		boxShadow: 24,
		p: 4,
	}

	return (
		<div className='dark:bg-gray-900'>
			<Modal open={modalOpen} onClose={handleModalClose}>
				<Box sx={modalStyle}>
					<Typography sx={{ fontSize: '25px', mt: 2 }} variant='h6'>
						{t('layout.clearHistory')}
					</Typography>
					<Typography sx={{ mt: 2, mb: 2 }}>
						{t('layout.undoNotPossible')}
					</Typography>
				</Box>
			</Modal>

			<Drawer
				anchor='left'
				PaperProps={{
					sx: {
						width: '30%',
						borderRight: '1px solid #e5e5e5',
						borderTopRightRadius: '20px',
						borderBottomRightRadius: '20px',
						backgroundColor: 'grey',
					},
				}}
				BackdropProps={{ sx: { backgroundColor: 'rgba(0,0,0,0)' } }}
				open={openDrawer}
				onClose={toggleDrawer(false)}
			>
				{DrawerList}
			</Drawer>

			<CreatePost open={dialogOpen} handleClose={handleDialogClose} />

			<section className='w-[320px] h-full fixed border-r-2 border-gray-300 dark:border-gray-700 dark:bg-gray-900'>
				<div className='sideBar h-full pb-[100px] dark:bg-gray-900'>
					<Link href='/'>
						<img
							src='/logo.png'
							alt='Logo'
							className='ml-[17px] w-[210px] my-[15px] cursor-pointer dark:invert'
						/>
					</Link>

					<div className='flex flex-col justify-between h-full'>
						<div className='flex flex-col gap-2 mt-4'>
							<NavLink
								href='/'
								icon={homeIcon}
								activeIcon={homeIconActive}
								label={t('layout.home')}
								isActive={isActive}
							/>
							<button
								onClick={toggleDrawer(true)}
								className='flex items-center gap-4 w-[90%] m-auto rounded-md h-[52px] px-4 hover:bg-gray-100 dark:hover:bg-gray-800 text-left dark:text-gray-200'
							>
								<SearchIcon />
								<p className='text-lg'>{t('layout.search')}</p>
							</button>
							<NavLink
								href='/explore'
								icon={compas}
								activeIcon={compasActive}
								label={t('layout.explore')}
								isActive={isActive}
							/>
							<NavLink
								href='/reels'
								icon={video}
								activeIcon={videoActive}
								label={t('layout.reels')}
								isActive={isActive}
							/>
							<NavLink
								href='/chats'
								icon={message}
								activeIcon={messageActive}
								label={t('layout.message')}
								isActive={isActive}
							/>

							<Notification isMin={false} />

							<button
								className='flex items-center gap-4 w-[90%] m-auto rounded-md h-[52px] px-4 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer dark:text-gray-200'
								onClick={handleDialogOpen}
							>
								{action}
								<p className='text-lg'>{t('layout.create')}</p>
							</button>

							<Link
								href='/profile'
								className={`flex items-center gap-4 w-[90%] m-auto rounded-md h-[52px] px-4 hover:bg-gray-100 dark:hover:bg-gray-800 ${isActive(
									'/profile'
								)}`}
							>
								<Avatar
									src={
										data?.image
											? `https://instagram-api.softclub.tj/images/${data?.image}`
											: '/default-avatar.png'
									}
									alt={data?.userName || 'Profile'}
									sx={{ width: 25, height: 25 }}
								/>
								<p className='text-lg dark:text-gray-200'>
									{t('layout.profile')}
								</p>
							</Link>
						</div>

						<div className='flex flex-col gap-2 mb-4'>
							<div className='flex items-center gap-4 w-[90%] m-auto rounded-md h-[52px] px-4 hover:bg-gray-100 dark:hover:bg-gray-800 dark:text-gray-200'>
								{threads}
								<p className='text-lg'>{t('layout.threads')}</p>
							</div>

							<div className='flex items-center gap-4 w-[90%] m-auto rounded-md h-[52px] px-4 hover:bg-gray-100 dark:hover:bg-gray-800 transition'>
								<button
									onClick={handleClick}
									className='flex gap-3 items-center'
								>
									<MenuIcon className='text-gray-700 dark:text-gray-300' />
									<p className='text-lg text-gray-800 dark:text-gray-200 font-medium'>
										{t('layout.more')}
									</p>
								</button>

								<Menu
									anchorEl={anchorEl}
									open={Boolean(anchorEl)}
									onClose={handleCloseMenu}
									anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
									transformOrigin={{ vertical: 'top', horizontal: 'center' }}
									PaperProps={{
										sx: {
											borderRadius: '12px',
											minWidth: '220px',
											boxShadow: '0px 4px 20px rgba(0,0,0,0.1)',
										},
									}}
								>
									<Link href='/setting'>
										<MenuItem
											onClick={handleCloseMenu}
											className='flex gap-3 items-center text-gray-700 dark:text-gray-200 dark:bg-gray-900'
										>
											<Settings fontSize='small' /> {t('layout.settings')}
										</MenuItem>
									</Link>

									<Link href='/profile/saved' passHref>
										<MenuItem
											onClick={handleCloseMenu}
											className='flex gap-3 items-center text-gray-700 dark:text-gray-200'
										>
											<BookmarkBorder fontSize='small' /> {t('layout.saved')}
										</MenuItem>
									</Link>

									<MenuItem className='flex gap-3 items-center text-gray-700 dark:text-gray-200'>
										<DarkMode />
									</MenuItem>

									<Divider />

									<MenuItem
										sx={{ color: '#ed4956', fontWeight: 600 }}
										className='flex gap-3 items-center'
										onClick={logOut}
									>
										<Logout fontSize='small' /> {t('layout.logout')}
									</MenuItem>
								</Menu>
							</div>
						</div>
					</div>
				</div>
			</section>
			<div className='ml-[320px]'>{children}</div>
		</div>
	)
}
