'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function ProtectedRoute({ children }) {
	const router = useRouter()
	const [isClient, setIsClient] = useState(false)

	useEffect(() => {
		// Устанавливаем флаг, что это клиент
		setIsClient(true)
	}, [])

	useEffect(() => {
		if (!isClient) return

		const token = localStorage.getItem('access_token')
		if (!token) {
			router.push('/login')
		}
	}, [isClient, router])

	// Пока не определено, рендерим пустой блок
	if (!isClient) return null

	return <>{children}</>
}
