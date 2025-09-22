'use client'

import { API_IMAGE } from '@/utils/config'
import { useEffect, useState } from 'react'
import AvatarUploader from './addHistoryComponent'

const UserStoriesSlider = ({ users, onOpen, giveId }) => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [itemsPerPage, setItemsPerPage] = useState(6)
  const [viewedStories, setViewedStories] = useState([])
  const [isClient, setIsClient] = useState(false)
  const totalItems = users.length

  useEffect(() => {
    setIsClient(true)
  }, [])

  const updateItemsPerPage = () => {
    if (typeof window === 'undefined') return
    if (window.innerWidth < 320) setItemsPerPage(3)
    else if (window.innerWidth < 1024) setItemsPerPage(5)
    else setItemsPerPage(6)
  }

  useEffect(() => {
    updateItemsPerPage()
    if (typeof window !== 'undefined') {
      window.addEventListener('resize', updateItemsPerPage)
      return () => window.removeEventListener('resize', updateItemsPerPage)
    }
  }, [])

  const handleNext = () => {
    if (currentIndex + itemsPerPage < totalItems) {
      setCurrentIndex(currentIndex + itemsPerPage)
    }
  }

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - itemsPerPage)
    }
  }

  const handleStoryClick = (userId) => {
    onOpen()
    giveId(userId)
    setViewedStories(prev => [...new Set([...prev, userId])])
  }

  const getCurrentUserLabel = (userId, userName) => {
    if (!isClient) return userName
    try {
      const localUserId = localStorage.getItem('userID')
      return localUserId == userId ? 'ВЫ' : userName
    } catch {
      return userName
    }
  }

  return (
    <div className='flex items-center justify-center gap-4 p-4 max-sm:p-0 bg-white dark:bg-black rounded-xl relative w-full max-sm:w-full'>
      <button
        onClick={handlePrev}
        disabled={currentIndex === 0}
        className={`w-10 h-10 absolute left-0 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 text-xl shadow hover:bg-gray-200 dark:hover:bg-gray-700 z-30 transition ${currentIndex === 0 ? 'opacity-30 cursor-not-allowed' : ''}`}
      >
        ←
      </button>

      <div className='mt-[-10px]'>
        <AvatarUploader />
      </div>

      <div className='overflow-hidden w-full'>
        <div
          className='flex gap-4 transition-transform duration-300 ease-in-out pt-[10px]'
          style={{ transform: `translateX(-${(currentIndex * 100) / itemsPerPage}%)` }}
        >
          {users.map(user => (
            <div
              key={user.userId}
              onClick={() => handleStoryClick(user.userId)}
              className='flex flex-col items-center text-center min-w-[60px] max-w-[60px] cursor-pointer'
            >
              <div className={`relative w-[60px] h-[60px] rounded-full p-[2px] shadow-md ${viewedStories.includes(user.userId) ? 'bg-gray-400' : 'bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600'}`}>
                {user.userImage ? (
                  <img
                    src={`${API_IMAGE}/${user.userImage}`}
                    alt={user.userName}
                    className='w-full h-full rounded-full object-cover bg-white dark:bg-gray-900 p-[2px]'
                  />
                ) : (
                  <div className='w-full h-full flex items-center justify-center bg-blue-500 text-white font-bold text-lg rounded-full'>
                    {user?.userName?.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
              <p className='mt-2 text-xs text-gray-700 dark:text-gray-300 truncate w-full'>
                {getCurrentUserLabel(user.userId, user.userName)}
              </p>
            </div>
          ))}
        </div>
      </div>

      <button
        onClick={handleNext}
        disabled={currentIndex + itemsPerPage >= totalItems}
        className={`w-10 h-10 absolute right-0 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 text-xl shadow hover:bg-gray-200 dark:hover:bg-gray-700 transition ${currentIndex + itemsPerPage >= totalItems ? 'opacity-30 cursor-not-allowed' : ''}`}
      >
        →
      </button>
    </div>
  )
}

export default UserStoriesSlider
