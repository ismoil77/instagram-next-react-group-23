'use client'
import React, { useState, useRef } from 'react'
import {
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	Button,
	TextField,
	Box,
	IconButton,
	Typography,
	Divider,
	useMediaQuery,
	useTheme,
} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import CloudUploadIcon from '@mui/icons-material/CloudUpload'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import { addUser } from '@/store/pages/createpost/createpost'
import { usePathname } from 'next/navigation'
import {
	usePosts,
	useProfiles,
} from '@/store/pages/profile/profile/store-profile'

const ImageFilter = ({ imageSrc, selectedFilter, onFilterChange }) => {
	const theme = useTheme()
	const isMobile = useMediaQuery(theme.breakpoints.down('sm'))

	const filters = [
		{ name: 'original', label: 'Оригинал', value: 'none' },
		{
			name: 'clarendon',
			label: 'Кларендон',
			value: 'contrast(1.2) saturate(1.2)',
		},
		{ name: 'gingham', label: 'Гингам', value: 'sepia(0.3) brightness(1.05)' },
		{
			name: 'moon',
			label: 'Луна',
			value: 'grayscale(1) contrast(1.1) brightness(1.1)',
		},
		{
			name: 'lark',
			label: 'Жаворонок',
			value: 'contrast(0.9) brightness(1.1) saturate(1.1)',
		},
		{
			name: 'reyes',
			label: 'Рейес',
			value: 'sepia(0.4) contrast(0.9) brightness(1.1)',
		},
	]

	return (
		<Box sx={{ mt: 2 }}>
			<Typography
				variant='subtitle1'
				gutterBottom
				sx={{ fontSize: isMobile ? '0.9rem' : '1rem' }}
			>
				Выберите фильтр:
			</Typography>
			<Box
				sx={{
					display: 'flex',
					gap: isMobile ? 1 : 2,
					overflowX: 'auto',
					py: 2,
					px: 1,
					'&::-webkit-scrollbar': {
						height: 4,
					},
					'&::-webkit-scrollbar-track': {
						background: '#f1f1f1',
						borderRadius: 2,
					},
					'&::-webkit-scrollbar-thumb': {
						background: '#ccc',
						borderRadius: 2,
					},
					'&::-webkit-scrollbar-thumb:hover': {
						background: '#999',
					},
				}}
			>
				{filters.map(filter => (
					<Box
						key={filter.name}
						sx={{
							display: 'flex',
							flexDirection: 'column',
							alignItems: 'center',
							cursor: 'pointer',
							p: isMobile ? 0.5 : 1,
							border:
								selectedFilter === filter.name
									? '2px solid #1976d2'
									: '1px solid #ddd',
							borderRadius: 1,
							minWidth: isMobile ? 70 : 90,
							flexShrink: 0,
							backgroundColor: 'white',
						}}
						onClick={() => onFilterChange(filter.name)}
					>
						<Box
							sx={{
								width: isMobile ? 45 : 55,
								height: isMobile ? 45 : 55,
								borderRadius: 1,
								overflow: 'hidden',
								filter: filter.value,
								backgroundImage: `url(${imageSrc})`,
								backgroundSize: 'cover',
								backgroundPosition: 'center',
							}}
						/>
						<Typography
							variant='caption'
							sx={{
								mt: 0.5,
								textAlign: 'center',
								fontSize: isMobile ? '0.7rem' : '0.75rem',
								lineHeight: 1.2,
							}}
						>
							{filter.label}
						</Typography>
					</Box>
				))}
			</Box>
		</Box>
	)
}

function CreatePostDialog({ open, handleClose }) {
	const theme = useTheme()
	const isMobile = useMediaQuery(theme.breakpoints.down('md'))
	const isSmallMobile = useMediaQuery(theme.breakpoints.down('sm'))

	const [step, setStep] = useState(1)
	const [selectedFile, setSelectedFile] = useState(null)
	const [imagePreview, setImagePreview] = useState(null)
	const [selectedFilter, setSelectedFilter] = useState('original')
	const [loading, setLoading] = useState(false)

	const [inpContent, setInpContent] = useState('')
	const [inpTitle, setInpTitle] = useState('')
	const [inpImg, setInpImg] = useState('')
	const pathname = usePathname()
	const { add_post } = usePosts()
	const { getMyProfile } = useProfiles()
	const fileInputRef = useRef(null)

	const handleFileChange = event => {
		const file = event.target.files[0]
		if (file) {
			setSelectedFile(file)
			setInpImg(file.name)

			const reader = new FileReader()
			reader.onload = e => {
				setImagePreview(e.target.result)
			}
			reader.readAsDataURL(file)
		}
	}

	const handleInputChange = (event, setter) => {
		setter(event.target.value)
	}

	const handleNextStep = () => {
		if (inpTitle && inpContent && selectedFile) {
			setStep(2)
		}
	}

	const handleBackStep = () => {
		setStep(1)
	}

	const addReels = async () => {
		setLoading(true)
		try {
			let formData = new FormData()
			formData.append('Images', selectedFile)
			formData.append('Content', inpContent)
			formData.append('Title', inpTitle)

			const result = await add_post(formData, pathname)
			if (
				pathname === '/profile' ||
				pathname === '/profile/posts' ||
				pathname === '/profile/saved'
			) {
				await getMyProfile()
			}
			console.log('Успешно создано:', result)

			handleCloseDialog()
		} catch (error) {
			console.error('Ошибка:', error)
		} finally {
			setLoading(false)
		}
	}

	const handleSubmit = event => {
		event.preventDefault()
		addReels()
	}

	const resetForm = () => {
		setInpTitle('')
		setInpContent('')
		setInpImg('')
		setSelectedFile(null)
		setImagePreview(null)
		setSelectedFilter('original')
		setStep(1)
		setLoading(false)
	}

	const handleCloseDialog = () => {
		handleClose()
		resetForm()
	}

	const getFilterValue = filterName => {
		const filters = {
			original: 'none',
			clarendon: 'contrast(1.2) saturate(1.2)',
			gingham: 'sepia(0.3) brightness(1.05)',
			moon: 'grayscale(1) contrast(1.1) brightness(1.1)',
			lark: 'contrast(0.9) brightness(1.1) saturate(1.1)',
			reyes: 'sepia(0.4) contrast(0.9) brightness(1.1)',
		}
		return filters[filterName] || 'none'
	}

	return (
		<Dialog
			open={open}
			onClose={handleCloseDialog}
			maxWidth='md'
			fullWidth
			fullScreen={isMobile}
			PaperProps={{
				sx: {
					borderRadius: isMobile ? 0 : 2,
					minHeight: isMobile ? '100vh' : step === 2 ? '650px' : '500px',
					maxHeight: isMobile ? '100vh' : '80vh',
					m: 0,
					display: 'flex',
					flexDirection: 'column',
					[theme.breakpoints.down('sm')]: {
						width: '100%',
					},
				},
			}}
		>
			<DialogTitle
				sx={{
					p: isSmallMobile ? 2 : 3,
					position: 'sticky',
					top: 0,
					backgroundColor: 'white',
					zIndex: 1,
					borderBottom: '1px solid',
					borderColor: 'divider',
					flexShrink: 0,
				}}
			>
				<Box display='flex' alignItems='center' justifyContent='space-between'>
					{step === 2 ? (
						<IconButton
							onClick={handleBackStep}
							size='small'
							sx={{ visibility: isMobile ? 'visible' : 'hidden' }}
						>
							<ArrowBackIcon />
						</IconButton>
					) : (
						<div />
					)}
					<Typography
						variant='h6'
						fontWeight='bold'
						sx={{
							flex: 1,
							textAlign: 'center',
							fontSize: isSmallMobile ? '1.1rem' : '1.25rem',
						}}
					>
						{step === 1 ? 'Создание публикации' : 'Предпросмотр'}
					</Typography>
					<IconButton onClick={handleCloseDialog} size='small'>
						<CloseIcon />
					</IconButton>
				</Box>
			</DialogTitle>

			<Divider />

			<DialogContent
				sx={{
					p: isSmallMobile ? 2 : 3,
					overflow: 'auto',
					flex: 1,
					display: 'flex',
					flexDirection: 'column',
					'&.MuiDialogContent-root': {
						padding: isSmallMobile ? 2 : 3,
					},
				}}
			>
				{step === 1 ? (
					<Box
						component='form'
						id='post-form'
						onSubmit={handleSubmit}
						sx={{ mt: 1, flex: 1, display: 'flex', flexDirection: 'column' }}
					>
						<Box
							sx={{
								border: '2px dashed',
								borderColor: 'grey.300',
								borderRadius: 2,
								p: isSmallMobile ? 2 : 3,
								textAlign: 'center',
								mb: 3,
								cursor: 'pointer',
								'&:hover': {
									borderColor: 'primary.main',
									backgroundColor: 'grey.50',
								},
								minHeight: isSmallMobile ? 120 : 150,
								display: 'flex',
								flexDirection: 'column',
								justifyContent: 'center',
								alignItems: 'center',
								flexShrink: 0,
								position: 'relative',
								overflow: 'hidden',
							}}
							onClick={() => fileInputRef.current?.click()}
						>
							<input
								ref={fileInputRef}
								style={{ display: 'none' }}
								type='file'
								accept='image/*,video/*'
								onChange={e => {
									setInpImg(e.target.value)
									handleFileChange(e)
								}}
							/>

							{imagePreview ? (
								<>
									<Box
										sx={{
											position: 'absolute',
											top: 0,
											left: 0,
											right: 0,
											bottom: 0,
											backgroundImage: `url(${imagePreview})`,
											backgroundSize: 'cover',
											backgroundPosition: 'center',
											opacity: 0.7,
										}}
									/>
									<Box
										sx={{
											position: 'relative',
											zIndex: 1,
											backgroundColor: 'rgba(255, 255, 255, 0.8)',
											borderRadius: 1,
											p: 1,
										}}
									>
										<CloudUploadIcon
											sx={{
												fontSize: isSmallMobile ? 30 : 40,
												color: 'grey.500',
												mb: 1,
											}}
										/>
										<Typography
											variant='body1'
											gutterBottom
											sx={{ fontSize: isSmallMobile ? '0.9rem' : '1rem' }}
										>
											{selectedFile.name}
										</Typography>
										<Typography
											variant='body2'
											color='textSecondary'
											sx={{ fontSize: isSmallMobile ? '0.8rem' : '0.875rem' }}
										>
											Нажмите для изменения
										</Typography>
									</Box>
								</>
							) : (
								<>
									<CloudUploadIcon
										sx={{
											fontSize: isSmallMobile ? 30 : 40,
											color: 'grey.500',
											mb: 1,
										}}
									/>
									<Typography
										variant='body1'
										gutterBottom
										sx={{ fontSize: isSmallMobile ? '0.9rem' : '1rem' }}
									>
										Перетащите фото или видео сюда
									</Typography>
									<Typography
										variant='body2'
										color='textSecondary'
										sx={{ fontSize: isSmallMobile ? '0.8rem' : '0.875rem' }}
									>
										или выберите файл
									</Typography>
								</>
							)}
						</Box>

						<TextField
							fullWidth
							label='Заголовок'
							name='title'
							margin='normal'
							variant='outlined'
							value={inpTitle}
							onChange={e => handleInputChange(e, setInpTitle)}
							required
							size={isSmallMobile ? 'small' : 'medium'}
							sx={{ flexShrink: 0 }}
						/>

						<TextField
							fullWidth
							label='Содержание'
							name='content'
							value={inpContent}
							onChange={e => handleInputChange(e, setInpContent)}
							margin='normal'
							variant='outlined'
							multiline
							rows={isSmallMobile ? 3 : 4}
							required
							size={isSmallMobile ? 'small' : 'medium'}
							sx={{ flex: 1, '& .MuiInputBase-root': { height: '100%' } }}
						/>
					</Box>
				) : (
					<Box
						sx={{
							display: 'flex',
							flexDirection: 'column',
							alignItems: 'center',
							gap: 2,
							flex: 1,
							overflow: 'hidden',
						}}
					>
						{imagePreview && (
							<>
								<Box
									sx={{
										width: '100%',
										maxWidth: '100%',
										height: isMobile ? 250 : 300,
										borderRadius: 2,
										overflow: 'hidden',
										filter: getFilterValue(selectedFilter),
										backgroundImage: `url(${imagePreview})`,
										backgroundSize: 'cover',
										backgroundPosition: 'center',
										flexShrink: 0,
									}}
								/>
								<Box sx={{ width: '100%', flexShrink: 0 }}>
									<ImageFilter
										imageSrc={imagePreview}
										selectedFilter={selectedFilter}
										onFilterChange={setSelectedFilter}
									/>
								</Box>
								<Box sx={{ width: '100%', flex: 1, overflow: 'auto' }}>
									<Typography
										variant='h6'
										gutterBottom
										sx={{ fontSize: isSmallMobile ? '1.1rem' : '1.25rem' }}
									>
										{inpTitle}
									</Typography>
									<Typography
										variant='body1'
										color='textSecondary'
										sx={{ fontSize: isSmallMobile ? '0.9rem' : '1rem' }}
									>
										{inpContent}
									</Typography>
								</Box>
							</>
						)}
					</Box>
				)}
			</DialogContent>

			<Divider />

			<DialogActions
				sx={{
					p: isSmallMobile ? 2 : 3,
					position: 'sticky',
					bottom: 0,
					backgroundColor: 'white',
					zIndex: 1,
					borderTop: '1px solid',
					borderColor: 'divider',
					flexShrink: 0,
				}}
			>
				{step === 1 ? (
					<>
						<Button
							onClick={handleCloseDialog}
							color='inherit'
							size={isSmallMobile ? 'small' : 'medium'}
						>
							Отмена
						</Button>
						<Button
							variant='contained'
							onClick={handleNextStep}
							disabled={!inpTitle || !inpContent || !selectedFile}
							size={isSmallMobile ? 'small' : 'medium'}
							sx={{
								borderRadius: 2,
								px: 3,
								py: 1,
								minWidth: isSmallMobile ? 80 : 100,
							}}
						>
							Далее
						</Button>
					</>
				) : (
					<>
						{isMobile && (
							<Button
								onClick={handleBackStep}
								color='inherit'
								size={isSmallMobile ? 'small' : 'medium'}
							>
								Назад
							</Button>
						)}
						<Button
							onClick={addReels}
							variant='contained'
							disabled={loading}
							size={isSmallMobile ? 'small' : 'medium'}
							sx={{
								borderRadius: 2,
								px: 3,
								py: 1,
								minWidth: isSmallMobile ? 120 : 140,
								ml: 'auto',
							}}
						>
							{loading ? 'Публикация...' : 'Опубликовать'}
						</Button>
					</>
				)}
			</DialogActions>
		</Dialog>
	)
}

export default CreatePostDialog
