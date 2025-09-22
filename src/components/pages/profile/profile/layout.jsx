'use client'

import Profile from '@/assets/icon/layout/instagramDefaultProfile.jpg'
import { useGet_Storyes, useMy_Profile, useProfiles } from '@/store/pages/profile/profile/store-profile'
import CloseIcon from '@mui/icons-material/Close'
import { Box, IconButton, Input, Modal, Skeleton, Tooltip, Typography } from '@mui/material'
import { Bookmark, Camera, Menu, Plus, Settings } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useParams, usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import UserStoriesSlider, { StoriesViewer } from '../story/story'
import axiosRequest from '@/lib/axiosRequest'
import useDarkSide from '@/hook/useDarkSide'

function ProfileTabs({ pathname }) {
  const isActive = (path) => pathname === path
  const check = () =>
    pathname === '/profile/posts' ||
    pathname === '/profile' ||
    pathname === '/profile/saved'

  if (!check()) return null

  const tabs = [
    {
      label: 'Posts',
      icon: <Camera size={20} />,
      path: pathname.split('/').filter(i => i !== 'posts' && i !== 'saved').length === 2
        ? '/profile/posts'
        : pathname.split('/').slice(0, 3).join('/') + '/posts',
    },
    {
      label: 'Saved',
      icon: <Bookmark size={20} />,
      path: pathname.split('/').filter(i => i !== 'saved' && i !== 'posts').length === 2
        ? '/profile/saved'
        : pathname.split('/').slice(0, 3).join('/') + '/saved',
    },
  ]

  return (
    <div className="flex flex-row justify-center items-start gap-5 w-full h-10 border-t border-gray-200 dark:border-[#363636]">
      {tabs.map(tab => (
        <Link
          key={tab.path}
          href={tab.path}
          className={`flex flex-col justify-center items-center relative h-12 ${isActive(tab.path) ? 'text-blue-600 dark:text-blue-400' : 'text-gray-500 dark:text-[#A8A8A8]'}`}
        >
          {isActive(tab.path) && (
            <div className="w-[calc(100%+20px)] h-[0.5px] absolute -top-[0.5px] bg-blue-600 dark:bg-blue-400"></div>
          )}
          <div className="flex flex-row items-center gap-2">
            <span>{tab.icon}</span>
            <span className="font-medium text-base leading-6">{tab.label}</span>
          </div>
        </Link>
      ))}
    </div>
  )
}

function UserListModal({ open, onClose, title, users, search, setSearch, MYsubscribtions, followUserLoading, dontFollowUserLoading, toggleFollow }) {
  return (
    <Modal open={open} onClose={onClose}>
      <div style={{ scrollbarWidth: 'none' }} className="overflow-y-auto md:w-1/3 md:max-h-3/4 absolute top-1/2 left-1/2 outline-none h-full -translate-1/2 p-5 w-full md:rounded-lg bg-white dark:bg-[#121212]">
        <Box className="flex justify-between items-center mb-2">
          <Typography variant="h6" className="text-black dark:text-white">{title}</Typography>
          <IconButton onClick={onClose}>
            <CloseIcon className="text-black dark:text-white" />
          </IconButton>
        </Box>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className='py-2 px-4 bg-gray-100 dark:bg-[#262626] w-full mb-3 rounded-lg outline-none text-black dark:text-white placeholder-gray-500 dark:placeholder-[#A8A8A8]'
          placeholder='Search..'
        />
        {users?.length ? (
          users
            .filter(u => u.userShortInfo?.userName?.toLowerCase().includes(search.toLowerCase().trim()))
            .map(({ userShortInfo: u }) => (
              <Box key={u?.userId} className="flex items-center justify-between mb-2">
                <Link href={`/profile/${u?.userId}/posts`} className="flex items-center gap-2">
                  {u?.userPhoto ? (
                    <div className='w-10 h-10 relative'>
                      <Image src={`http://37.27.29.18:8003/images/${u?.userPhoto}`} alt="" fill className="rounded-full object-cover" />
                    </div>
                  ) : (
                    <div className='w-10 h-10 rounded-full flex items-center justify-center bg-gradient-to-tr from-pink-500 via-purple-500 to-blue-500 text-white'>{u?.userName?.charAt(0).toUpperCase()}</div>
                  )}
                  <Typography className="text-black dark:text-white">{u?.userName}</Typography>
                </Link>
                <button
                  onClick={() => toggleFollow(u?.userId)}
                  disabled={followUserLoading[u?.userId] || dontFollowUserLoading[u?.userId]}
                  className={`px-3 py-1 rounded-lg text-sm font-medium ${!MYsubscribtions?.some(s => s?.userShortInfo?.userId === u?.userId)
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-gray-700 dark:bg-[#363636] dark:text-[#A8A8A8]"
                    }`}
                >
                  {MYsubscribtions?.some(s => s?.userShortInfo?.userId === u?.userId) ? "Following" : "Follow"}
                </button>
              </Box>
            ))
        ) : (
          <Typography className="text-gray-500 dark:text-[#A8A8A8]">No {title.toLowerCase()}</Typography>
        )}
      </div>
    </Modal>
  )
}

export default function ClientProfile({ children }) {
  const { data, getMyProfile, getUserProfile, getMyProfileLoading, getUserProfileLoading } = useProfiles()
  const {
    subscribers,
    subscribtions,
    followUserLoading,
    dontFollowUserLoading,
    getSubscribers,
    dontFollowUser,
    followUser,
    MYsubscribtions,
    getMySubscribtions,
    getSubscribtions,
    updateSubscriptionState,
    getSubscribersLoading,
    getSubscribtionsLoading
  } = useMy_Profile()
  const { stories, get_storyes, get_other_storyes, getStoryesLoading, getOtherStoryesLoading } = useGet_Storyes()

  const [closeShowStories, setCloseShowStories] = useState(false)
  const [storiesId, setToId] = useState()
  const [openSubscribers, setOpenSubscribers] = useState(false)
  const [openSubscribtions, setOpenSubscribtions] = useState(false)
  const [MyStoriesOpen, setMyStoriesOpen] = useState(false)
  const [openPost, setOpenPost] = useState(false)
  const [selImage, setSelImage] = useState(null)
  const [isUploading, setIsUploading] = useState(false)
  const [searchFollower, setSearchFollower] = useState('')
  const [searchFollowing, setSearchFollowing] = useState('')

  const pathname = usePathname()
  const { 'profile-by-id': id } = useParams()
  const [theme, setTheme] = useDarkSide()

  const profileLoading = getMyProfileLoading || getUserProfileLoading
  const storiesLoading = getStoryesLoading || getOtherStoryesLoading

  const Update = () => {
    getMySubscribtions()
    getSubscribers(pathname, id)
    getSubscribtions(pathname, id)
    if (pathname === '/profile' || pathname === '/profile/posts' || pathname === '/profile/saved') {
      getMyProfile()
      get_storyes()
    } else {
      getUserProfile(id)
      get_other_storyes(id)
    }
  }

  const toggleFollow = async (userId) => {
    const currentlyFollowed = MYsubscribtions?.some(s => s?.userShortInfo?.userId === userId)
    try {
      updateSubscriptionState(userId, !currentlyFollowed)
      if (currentlyFollowed) await dontFollowUser(userId)
      else await followUser(userId)
      Update()
    } catch (err) {
      updateSubscriptionState(userId, currentlyFollowed)
      console.error("Ошибка при переключении подписки:", err)
    }
  }

  const followCurrentProfile = () => {
    if (!id) return
    toggleFollow(id)
  }

  useEffect(() => {
    Update()
  }, [pathname])

  useEffect(() => {
    if (typeof window !== 'undefined' && !localStorage.getItem('access_token')) {
      window.location.href = '/login'
    }
  }, [])

  const checkPath = pathname === '/profile' || pathname === '/profile/posts' || pathname === '/profile/saved'

  return (
    <div className="relative dark:bg-black w-full min-h-screen mx-auto overflow-hidden text-sm leading-5">
      <div className="w-full h-full md:px-[10%] flex flex-col items-center md:gap-10 pt-16 pb-10">
        <Link className='md:hidden absolute top-5 right-5' href={'/setting'}>
          <Settings className="text-black dark:text-white" />
        </Link>

        {/* Profile Header */}
        {!(profileLoading && !data) && (
          <div className="flex flex-row items-center md:px-0 px-[5%] gap-6 w-full h-[160px]">
            {/* Avatar & Stories */}
            <div
              onClick={() => (stories?.length > 0) && setMyStoriesOpen(true)}
              className={`${stories?.length > 0 ? "p-1 relative cursor-pointer bg-gradient-to-tr from-purple-500 via-pink-500 to-blue-500 rounded-full" : ""}`}
            >
              <div className={`rounded-full relative md:size-[160px] size-[100px] dark:border-black border-white object-cover ${stories?.length > 0 ? 'border-4' : ''}`}>
                <Image
                  src={data?.image ? 'http://37.27.29.18:8003/images/' + data?.image : Profile}
                  alt=""
                  fill
                  className='object-cover rounded-full'
                />
              </div>
              {!checkPath && (
                <div
                  onClick={(e) => { e.stopPropagation(); setOpenPost(true) }}
                  className='absolute bottom-0 right-0 md:w-14 md:h-14 bg-gray-900 border-2 border-white rounded-full w-8 h-8 flex items-center justify-center'
                >
                  <Plus className='text-white md:size-10' />
                </div>
              )}
            </div>

            {MyStoriesOpen && stories && (
              <StoriesViewer
                data={checkPath ? [stories[0]] : [stories]}
                onClose={() => setMyStoriesOpen(false)}
                id={1}
              />
            )}

            {/* Profile Info */}
            <div className="flex flex-col items-start justify-start gap-5 w-[436px] h-[132px]">
              <div className="flex flex-row items-center justify-between w-full h-[40px]">
                <h2 className="font-bold md:static absolute top-10 left-1/2 -translate-1/2 md:text-xl text-3xl leading-7 text-gray-900 dark:text-white">
                  {data?.userName}
                </h2>
              </div>
              <div className="flex flex-row items-start justify-between gap-2 min-w-full md:min-w-[269px] h-5">
                <div className="flex md:flex-row flex-col items-center gap-0.5 cursor-pointer">
                  <span className="font-semibold md:text-sm text-lg leading-5 text-gray-900 dark:text-white">{data?.postCount}</span>
                  <span className="text-sm text-gray-600 dark:text-[#A8A8A8]">posts</span>
                </div>
                <div className="flex md:flex-row flex-col items-center gap-0.5 cursor-pointer" onClick={() => setOpenSubscribers(true)}>
                  <span className="font-semibold md:text-sm text-lg leading-5 text-gray-900 dark:text-white">{data?.subscribersCount}</span>
                  <span className="text-sm text-gray-600 dark:text-[#A8A8A8]">followers</span>
                </div>
                <div className="flex md:flex-row flex-col items-center gap-0.5 cursor-pointer" onClick={() => setOpenSubscribtions(true)}>
                  <span className="font-semibold md:text-sm text-lg leading-5 text-gray-900 dark:text-white">{data?.subscriptionsCount}</span>
                  <span className="text-sm text-gray-600 dark:text-[#A8A8A8]">following</span>
                </div>
              </div>
              <div className="md:flex hidden flex-row items-center w-full h-[40px]">
                <h2 className="font-bold text-xl leading-7 text-gray-900 dark:text-white">
                  {data?.firstName} {data?.lastName}
                </h2>
              </div>
            </div>

            {/* Action Buttons */}
            <div className='ml-auto hidden md:block mb-auto mt-10'>
              {checkPath ? (
                <div className='flex gap-3'>
                  <Link href="/setting/account" className='px-4 py-2 truncate rounded-lg bg-gray-300 dark:bg-[#262626] text-black dark:text-white font-semibold text-sm leading-5'>Edit Profile</Link>
                </div>
              ) : (
                <div className='flex gap-3'>
                  <button onClick={followCurrentProfile} className='px-4 py-2 truncate rounded-lg bg-blue-500 text-white font-semibold text-sm leading-5'>Follow</button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tabs */}
        <ProfileTabs pathname={pathname} />

        {/* Children (Posts/Saved) */}
        <div className='w-full flex flex-col items-center'>{children}</div>

        {/* Modals */}
        <UserListModal
          open={openSubscribers}
          onClose={() => setOpenSubscribers(false)}
          title='Followers'
          users={subscribers}
          search={searchFollower}
          setSearch={setSearchFollower}
          MYsubscribtions={MYsubscribtions}
          followUserLoading={followUserLoading}
          dontFollowUserLoading={dontFollowUserLoading}
          toggleFollow={toggleFollow}
        />
        <UserListModal
          open={openSubscribtions}
          onClose={() => setOpenSubscribtions(false)}
          title='Following'
          users={subscribtions}
          search={searchFollowing}
          setSearch={setSearchFollowing}
          MYsubscribtions={MYsubscribtions}
          followUserLoading={followUserLoading}
          dontFollowUserLoading={dontFollowUserLoading}
          toggleFollow={toggleFollow}
        />
      </div>
    </div>
  )
}
