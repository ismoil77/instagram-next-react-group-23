"use client"
import "@/app/globals.css"
import ClientProfile from '@/components/pages/profile/profile/layout'
import { usePathname } from 'next/navigation'
export default function layout({ children }) {
	const pathname = usePathname()
	if (pathname.includes("/profile/styries/")) {
		return null
	}
	return (
		<ClientProfile>
			{children}
		</ClientProfile>
	)
}