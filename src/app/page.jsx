"use client";

import PostCardHomePage from '@/components/pages/home/home'
import InstagramHeader from '@/components/pages/home/instagramAddLikeIcon'
import UserRecommendations from '@/components/pages/home/sideUsers'
import StoriesViewer from '@/components/pages/home/storiesView'
import UserStoriesSlider from '@/components/pages/home/storyHeaderAll'
import useDarkSide from '@/hook/useDarkSide'
import usePostStore from '@/store/pages/home/home'
import { useEffect, useState } from 'react'

export default function Home() {
  const { posts, fetchPosts, loading, stories, fetchStories } = usePostStore()
  const [closeShowStories, setCloseShowStories] = useState(false)
  const [storiesId, setStoriesId] = useState(null)
  const [colorTheme, setTheme] = useDarkSide();

  function setToId(id) {
    setStoriesId(id)
  }

  useEffect(() => {
    fetchPosts()
    fetchStories()
  }, [])

  if (loading)
    return (
      <div className="border-b border-gray-200 w-[550px] mx-auto my-4 animate-pulse dark:border-gray-700">
        <div className="flex items-center mb-3">
          <div className="w-10 h-10 rounded-full bg-gray-300 dark:bg-gray-600"></div>
          <div className="ml-3 flex-1">
            <div className="h-4 w-24 bg-gray-300 rounded dark:bg-gray-600"></div>
            <div className="h-3 w-16 bg-gray-300 rounded mt-1 dark:bg-gray-600"></div>
          </div>
        </div>

        <div className="relative aspect-video mb-3 overflow-hidden rounded-lg bg-gray-300 dark:bg-gray-700">
          <div className="absolute inset-0 bg-gray-300 dark:bg-gray-700"></div>
        </div>

        <div className="mb-2">
          <div className="h-4 w-32 bg-gray-300 rounded mb-1 dark:bg-gray-600"></div>
          <div className="h-3 w-2/3 bg-gray-300 rounded dark:bg-gray-600"></div>
        </div>

        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-4">
            <div className="w-6 h-6 bg-gray-300 rounded-full dark:bg-gray-600"></div>
            <div className="w-6 h-6 bg-gray-300 rounded-full dark:bg-gray-600"></div>
            <div className="w-6 h-6 bg-gray-300 rounded-full dark:bg-gray-600"></div>
          </div>
          <div className="w-6 h-6 bg-gray-300 rounded-full dark:bg-gray-600"></div>
        </div>

        <div className="text-sm text-gray-600 mb-2 dark:text-gray-400">
          <div className="h-4 w-20 bg-gray-300 rounded dark:bg-gray-600"></div>
        </div>

        <div className="text-sm text-gray-700 mb-2 dark:text-gray-300">
          <div className="flex items-start mb-1">
            <div className="w-5 h-5 bg-gray-300 rounded-full dark:bg-gray-600"></div>
            <div className="ml-2">
              <div className="h-4 w-20 bg-gray-300 rounded dark:bg-gray-600"></div>
              <div className="h-3 w-32 bg-gray-300 rounded mt-1 dark:bg-gray-600"></div>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <div className="flex-1 h-10 bg-gray-300 rounded-full dark:bg-gray-600"></div>
          <div className="w-16 h-8 bg-gray-300 rounded-full dark:bg-gray-600"></div>
        </div>
      </div>
    );

  return (
    <div className={`flex flex-wrap-reverse dark:bg-black min-h-screen`}>
      <div className='max-w-[550px] max-sm:w-full mx-auto my-4 group'>
        {closeShowStories && (
          <StoriesViewer
            onClose={() => setCloseShowStories(false)}
            startUserId={storiesId}
          />
        )}
        <InstagramHeader />

        <UserStoriesSlider
          users={stories}
          onOpen={() => setCloseShowStories(true)}
          giveId={setToId}
        />

        {posts.map((post) => (
          <PostCardHomePage
            stories={stories}
            key={post.postId}
            post={post}
            onOpen={() => setCloseShowStories(true)}
            giveId={setToId}
          />
        ))}
      </div>

      <div className="min-h-screen max-sm:ml-[50px] max-sm:hidden">
        <UserRecommendations />
      </div>
    </div>
  );
}
