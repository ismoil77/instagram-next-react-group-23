'use client'
import { useParams, usePathname, useRouter } from 'next/navigation'
import React from 'react'

export default function ProfileByID() {
	const router = useRouter()
	const pathname = usePathname()
	const { "profile-by-id": id } = useParams()
	React.useEffect(() => {
		router.push(`/profile/${id}/posts`)
	}, [router])
	if (pathname === `/profile/${id}`) {
		return <div className='flex justify-center items-center h-[20vh]'><div className='animate-spin size-[100px] border-b-2 border-pink-500 rounded-full' /></div>
	}
	return null
}