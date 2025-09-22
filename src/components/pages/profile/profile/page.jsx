'use client'
import { usePathname, useRouter } from 'next/navigation'
import React from 'react'

export default function Profile() {
  const router = useRouter()
  const pathname = usePathname()
  React.useEffect(() => {
    router.push('/profile/posts')
  }, [router])

  if (pathname === '/profile') {
    return <div className='flex justify-center items-center h-[20vh]'><div className='animate-spin size-[100px] border-b-2 border-pink-500 rounded-full' /></div>
  }
  return null
}