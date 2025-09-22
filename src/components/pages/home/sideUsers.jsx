'use client'

import usePostStore from '@/store/pages/home/home'
import { API_IMAGE } from '@/utils/config'
import Link from 'next/link'
import { useEffect, useState } from 'react'

const UserRecommendations = () => {
  const { users, fetchUsers, followToUser } = usePostStore()
  const [isFetching, setIsFetching] = useState(false)
  const [getAllUser, setGetAllUser] = useState(10)
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    if (!isClient) return

    setIsFetching(true)
    fetchUsers(getAllUser).finally(() => setIsFetching(false))

    try {
      const token = localStorage.getItem('access_token')
      if (token) {
        const payload = JSON.parse(atob(token.split('.')[1]))
        const sid = payload?.sid
        // можно использовать sid, если нужно
      }
    } catch (e) {
      console.error('Ошибка при чтении access_token из localStorage', e)
    }
  }, [getAllUser, isClient])

  const filteredUsers = users || []

  return (
    <div className='border-b border-gray-200 dark:border-gray-700 p-4 max-sm:p-0 mt-[30px] bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200'>
      <div className='flex items-center justify-between mb-4'>
        <h3 className='font-semibold text-xl'>Рекомендации для вас</h3>
        <button
          className='text-blue-500 text-[18px] hover:text-blue-600 transition-colors font-bold'
          onClick={() => setGetAllUser(200)}
        >
          Все
        </button>
      </div>

      {isFetching ? (
        <div className='animate-pulse space-y-3'>
          {[...Array(15)].map((_, i) => (
            <div key={i} className='flex items-center space-x-3'>
              <div className='w-10 h-10 rounded-full bg-gray-300 dark:bg-gray-700'></div>
              <div className='flex-1'>
                <div className='h-4 w-20 bg-gray-300 dark:bg-gray-700 rounded'></div>
                <div className='h-3 w-32 bg-gray-300 dark:bg-gray-700 rounded mt-1'></div>
              </div>
              <div className='w-20 h-6 bg-gray-300 dark:bg-gray-700 rounded'></div>
            </div>
          ))}
        </div>
      ) : (
        <div className='space-y-3'>
          {filteredUsers.map(user => (
            <div key={user.id} className='flex items-center space-x-3'>
              <img
                src={
                  !user.avatar
                    ? "https://cdn.pixabay.com/photo/2023/02/18/11/00/icon-7797704_640.png"
                    : `${API_IMAGE}/${user.avatar}`
                }
                alt={user.userName}
                width={40}
                height={40}
                className='w-10 h-10 rounded-full object-cover border border-gray-200 dark:border-gray-700'
              />
              <div className='flex-1'>
                <Link href={`/profile/${user.id}`}>
                  <p className='font-semibold text-sm'>{user.userName}</p>
                </Link>
                <p className='text-xs text-gray-500 dark:text-gray-400'>
                  Подписаны {user.fullName?.split(' ').slice(0, 2).join(' ')} и ещё...
                </p>
              </div>
              <button
                onClick={() => followToUser(user.id, user.isSubscriber)}
                className={`text-[17px] transition-colors ${
                  user.isSubscriber
                    ? 'text-gray-400 dark:text-gray-500'
                    : 'text-blue-500 hover:text-blue-600'
                }`}
              >
                {user.isSubscriber ? 'Подписан' : 'Подписаться'}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default UserRecommendations
