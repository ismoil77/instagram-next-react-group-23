'use client'
import { API_IMAGE } from '@/utils/config'
import Image from 'next/image'
import { useState, useEffect, useRef } from 'react'

const MyStory = ({ storyData }) => {
  const [isViewerOpen, setIsViewerOpen] = useState(false)
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0)
  const [progress, setProgress] = useState(0)
  const timerRef = useRef(null)

  const currentMedia = storyData?.stories?.[currentMediaIndex]
	useEffect(()=>{
console.log(storyData.stories);

	},[])
  const handleOpenViewer = () => {
    if (storyData?.stories?.length > 0) {
      setIsViewerOpen(true)
      setCurrentMediaIndex(0)
      setProgress(0)
    } else {
      alert('У вас пока нет сторисов. Добавьте первый!')
    }
  }

  const handleCloseViewer = () => {
    setIsViewerOpen(false)
    clearInterval(timerRef.current)
  }

  useEffect(() => {
    if (!isViewerOpen) return

    setProgress(0)
    clearInterval(timerRef.current)

    timerRef.current = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          if (currentMediaIndex < storyData.stories.length - 1) {
            setCurrentMediaIndex((prev) => prev + 1)
          } else {
            handleCloseViewer()
          }
          return 0
        }
        return prev + 1
      })
    }, 50)

    return () => clearInterval(timerRef.current)
  }, [isViewerOpen, currentMediaIndex, storyData?.stories?.length])

  // Навигация
  const nextMedia = () => {
    if (currentMediaIndex < storyData.stories.length - 1) {
      setCurrentMediaIndex(currentMediaIndex + 1)
    } else {
      handleCloseViewer()
    }
  }

  const prevMedia = () => {
    if (currentMediaIndex > 0) {
      setCurrentMediaIndex(currentMediaIndex - 1)
    }
  }

  return (
    <>
      <div
        onClick={handleOpenViewer}
        className="flex flex-col items-center cursor-pointer group transition-all relative"
      >
        <div
          className={`
            w-16 h-16 sm:w-20 sm:h-20 rounded-full p-[3px] flex items-center justify-center
            transition-all duration-300
            ${storyData?.stories?.length > 0
              ? 'bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600 group-hover:from-pink-500 group-hover:to-yellow-400'
              : 'bg-gray-300 dark:bg-gray-700'
            }
          `}
        >
          <div className="w-full h-full rounded-full overflow-hidden bg-white dark:bg-gray-800">
            <img
              src={storyData?.userImage ? `${API_IMAGE}/${storyData.userImage}` : '/placeholder-avatar.jpg'}
              alt={storyData?.userName || 'Вы'}
              className="w-full h-full object-cover"
              onError={(e) => (e.target.src = '/placeholder-avatar.jpg')}
            />
          </div>
        </div>

        <span className="mt-1 text-[10px] sm:text-xs font-medium text-gray-800 dark:text-gray-200 whitespace-nowrap max-w-[80px] sm:max-w-[100px] overflow-hidden text-ellipsis text-center">
          {storyData?.userName || 'Вы'}
        </span>

        {!storyData?.stories?.length && (
          <div className="absolute mt-16 sm:mt-20 w-6 h-6 rounded-full bg-black/70 dark:bg-white/20 flex items-center justify-center z-10">
            <span className="text-white dark:text-gray-200 text-lg font-bold">+</span>
          </div>
        )}
      </div>

      {isViewerOpen && (
        <div className="fixed inset-0 z-50 bg-black flex flex-col items-center justify-center">
          {/* Закрыть */}
          <button
            onClick={handleCloseViewer}
            className="absolute top-4 right-4 text-white text-3xl z-50"
          >
            ×
          </button>

          <div className="absolute top-2 left-0 right-0 flex gap-1 px-4 z-40">
            {storyData.stories.map((_, idx) => (
              <div key={idx} className="flex-1 bg-gray-800 rounded-full h-1 overflow-hidden">
                <div
                  className="h-full bg-white transition-all duration-75"
                  style={{
                    width:
                      idx < currentMediaIndex
                        ? '100%'
                        : idx === currentMediaIndex
                        ? `${progress}%`
                        : '0%',
                  }}
                />
              </div>
            ))}
          </div>

          {/* Шапка */}
          <div className="absolute top-0 left-0 right-0 flex items-center gap-2 px-4 py-3 bg-gradient-to-b from-black/60 to-transparent z-30">
            <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-white">
              <Image
  src={`${API_IMAGE}/2710078b-d06f-40f7-8bca-ed595db21fe1.jpg`}
  alt={storyData.userName || 'User'}
  fill
  className="object-cover"
  onError={(e) => {
    e.target.src = '/placeholder-avatar.jpg'
  }}
/>
            </div>
            <span className="text-white font-medium">{storyData.userName}</span>
          </div>

          {/* Контент */}
          <div className="relative w-full max-w-md h-[80vh] flex items-center justify-center">
            {currentMedia ? (
              <img
                src={`${API_IMAGE}/2710078b-d06f-40f7-8bca-ed595db21fe1.jpg`}
                alt="Story"
                className="max-h-full max-w-full object-contain"
              />
            ) : (
              <p className="text-gray-400">Нет медиа</p>
            )}

            {/* Навигация кликом */}
            <div
              className="absolute left-0 top-0 h-full w-1/2 cursor-pointer"
              onClick={prevMedia}
            />
            <div
              className="absolute right-0 top-0 h-full w-1/2 cursor-pointer"
              onClick={nextMedia}
            />
          </div>
        </div>
      )}
    </>
  )
}

export default MyStory