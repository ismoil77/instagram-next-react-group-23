"use client"
import Profile from '@/assets/icon/layout/instagramDefaultProfile.jpg'
import {
  add,
  searchIcon,
  compas,
  compasActive,
  homeIcon,
  homeIconActive,
  message,
  messageActive,
  video,
  videoActive,
} from '@/assets/icon/layout/svg'
import { Box, Drawer, IconButton, InputBase } from '@mui/material'
import axios from 'axios'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'
import CloseIcon from "@mui/icons-material/Close";
import { SearchIcon } from 'lucide-react'
import { useUserStore } from '@/hook/GetUser'
import { useTranslation } from 'react-i18next'
import debounce from "lodash.debounce";
import usePostStore from '@/store/pages/home/home'

export default function BottomNavigation({ children }) {
  const pathname = usePathname()
  const [data, setData] = useState(null)
  const [open1, setOpen] = useState(false);
  const { t } = useTranslation()
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  const toggleDrawer = (newOpen) => () => {
    setOpen(newOpen);
  };

  const GetProfil = async () => {
    if (!isClient) return
    try {
      const { data } = await axios.get("http://37.27.29.18:8003/UserProfile/get-my-profile", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`
        }
      })
      setData(data.data)
    } catch (error) { }
  }

  useEffect(() => {
    GetProfil()
  }, [isClient])

  const { users, loading, searchUsers, GetHystoryMobile, AddSearchMobile } = useUserStore()
  const { stories, fetchStories } = usePostStore()
  const [query, setQuery] = useState("")
  const [showDropdown, setShowDropdown] = useState(false)

  useEffect(() => {
    fetchStories();
  }, [fetchStories]);

  const debouncedSearch = useCallback(
    debounce((value) => searchUsers(value), 400),
    []
  )

  useEffect(() => {
    debouncedSearch(query)
    return () => debouncedSearch.cancel()
  }, [query])

  useEffect(() => {
    GetHystoryMobile()
  }, [GetHystoryMobile])

  const DrawerList = (
    <Box className="p-4 dark:bg-gray-900 dark:text-white" role="presentation">
      <div>
        <article className="flex justify-between items-center mb-4">
          <h1 className='text-[32px] font-medium'>Search</h1>
          <IconButton onClick={() => { setQuery(""), setOpen(false) }}>
            <CloseIcon className="dark:text-white" />
          </IconButton>
        </article>

        <hr className="mb-4 border-gray-300 dark:border-gray-700" />

        <div className="relative w-full">
          <div className="flex items-center border rounded-md overflow-hidden dark:border-gray-700">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (query.trim() !== "") {
                  AddSearchMobile(query);
                  setQuery("");
                  setShowDropdown(false);
                }
              }}
            >
              <div className="flex items-center rounded-md overflow-hidden">
                <div className="px-3">
                  <SearchIcon className="text-gray-500 dark:text-gray-300" />
                </div>
                <InputBase
                  value={query}
                  placeholder="Поиск"
                  className="flex-1 px-2 py-2 dark:text-white"
                  onFocus={() => setShowDropdown(true)}
                  onChange={(e) => setQuery(e.target.value)}
                />
              </div>
            </form>
          </div>

          {showDropdown && query && (
            <div className="absolute top-full mt-2 w-full bg-white dark:bg-gray-900 border dark:border-gray-700 rounded-md shadow-lg max-h-60 overflow-y-auto z-50">
              {loading && <p className="p-2 text-gray-500 dark:text-gray-300">Загрузка...</p>}
              {!loading && users.length === 0 && (
                <p className="p-2 text-gray-500 dark:text-gray-300">Нет результатов</p>
              )}
              {users.map((user) => (
                <Link
                  href={`/profile/${user.id}`}
                  key={user.id}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer flex items-center gap-3"
                  onClick={() => { AddSearchMobile(user.id); setOpen(false); setQuery('') }}
                >
                  <img
                    src={`http://37.27.29.18:8003/images/${user.avatar}`}
                    alt={user.userName}
                    className="w-10 h-10 rounded-full border"
                  />
                  <article>
                    <span className="font-medium">{user.userName}</span>
                    <article className='flex gap-2 items-center'>
                      <h1>{user.fullName}</h1>
                      <h1 className='w-[5px] h-[5px] bg-black dark:bg-white rounded-full'></h1>
                      <h1>Подписчиков:</h1>
                      <h1>{user.subscribersCount}</h1>
                    </article>
                  </article>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </Box>
  );

  const iconClass = "flex items-center gap-4 rounded-[8px] h-[52px] relative px-0 m-[0] justify-center"
  const profileClass = "w-[25px] h-[25px] rounded-[50%] object-cover"

  const icons = {
    '/': { active: homeIcon, inactive: homeIconActive },
    '/explore': { active: compas, inactive: compasActive },
    '/reels': { active: video, inactive: videoActive },
    '/chats': { active: message, inactive: messageActive },
    '/profile': { active: Profile, inactive: Profile },
  }

  return (
    <>
      <Drawer
        anchor='bottom'
        PaperProps={{
          sx: {
            width: "100%",
            height: '90%',
            borderRight: "1px solid #e5e5e5",
            borderTopRightRadius: "20px",
            borderBottomRightRadius: "20px",
            backgroundColor: "white",
            '&.MuiPaper-root': {
              backgroundColor: 'white',
            },
            '&.MuiPaper-root.MuiDrawer-paper': {
              backgroundColor: 'white',
              '&.dark': {
                backgroundColor: '#111827',
                color: 'white',
              }
            }
          },
        }}
        BackdropProps={{
          sx: {
            backgroundColor: 'rgba(0, 0, 0, 0)',
          },
        }}
        open={open1}
        onClose={toggleDrawer(false)}
      >
        {DrawerList}
      </Drawer>

      {children}

      <section className="fixed w-[100%] z-[10] bottom-0">
        <div className="flex gap-[0.5rem] mt-4 align-bottom bg-white dark:bg-gray-900 justify-evenly">
          <Link className="block" href="/">
            <div className={iconClass}>
              {pathname === '/' ? icons['/'].active : icons['/'].inactive}
            </div>
          </Link>

          <Link href="/explore">
            <div className={iconClass}>
              {pathname === '/explore' ? icons['/explore'].active : icons['/explore'].inactive}
            </div>
          </Link>

          <button onClick={toggleDrawer(true)}>
            {searchIcon}
          </button>

          <Link href="/reels">
            <div className={`${iconClass}`}>
              {pathname === '/reels' ? icons['/reels'].active : icons['/reels'].inactive}
            </div>
          </Link>

          <Link href="/chats">
            <div className={iconClass}>
              {pathname === '/chats' ? icons['/chats'].active : icons['/chats'].inactive}
            </div>
          </Link>

          {isClient && localStorage.getItem("access_token") ? (
            <Link href="/profile">
              <div className={iconClass}>
                <Image
                  className={`${pathname === '/profile' ? 'border-[2px] border-solid border-[black] dark:border-white' : ''} ${profileClass}`}
                  src={data ? "http://37.27.29.18:8003/images/" + data?.image : Profile}
                  width={25}
                  height={25}
                  alt="Profile"
                />
              </div>
            </Link>
          ) : (
            <Link href="/login">
              <div className={iconClass}>
                <Image
                  className={`${pathname === '/profile' ? 'border-[2px] border-solid border-[black] dark:border-white' : ''} ${profileClass}`}
                  src={Profile}
                  width={25}
                  height={25}
                  alt="Profile"
                />
              </div>
            </Link>
          )}
        </div>
      </section>
    </>
  )
}
