"use client";

import ComentModal from "@/components/pages/reels/comentMOdal"
import { useData } from "@/store/pages/reels/reels"
import Image from "next/image"
import Link from "next/link"
import { useEffect, useRef, useState } from "react"

export default function Reals() {
  const {
    data,
    GetReels,
    AddLike,
    AddView,
    FollowToUser,
    ToggleFavorite,
  } = useData((state) => state);
  const [visibleCount, setVisibleCount] = useState(3);
  const [animating, setAnimating] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const videoRefs = useRef([]);

  //FUNC FOR LIKES
  const handleClick = (id) => {
    setAnimating(true);
    AddLike(id);
    setLocalData(newData);
    setTimeout(() => setAnimating(false), 300);
  };

  //SRCOLLING PARAMS
  const [currentIndex, setCurrentIndex] = useState(0);
  const containerRef = useRef(null);

  const onScroll = () => {
    if (!containerRef.current) return;
    const scrollTop = containerRef.current.scrollTop;
    const height = containerRef.current.clientHeight;
    const newIndex = Math.floor(scrollTop / height);
    if (newIndex !== currentIndex) {
      setCurrentIndex(newIndex);
      setIsModalOpen(false);
    }
    if (newIndex + 2 >= visibleCount && visibleCount < data.length) {
      setVisibleCount((prev) => Math.min(prev + 2, data.length));
    }
  };

  const [muted, setMuted] = useState(true);

  const toggleMuteAll = () => {
    setMuted((prev) => !prev);
    const videos = containerRef.current.querySelectorAll("video");
    videos.forEach((video) => {
      video.muted = !muted;
    });
  };

  useEffect(() => {
    if (!containerRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const video = entry.target;
          // const postId = video.dataset.postId;
          if (entry.isIntersecting) {
            video.play().catch(() => {});
            video.muted = muted;
          } else {
            video.pause();
            video.muted = true;
          }
        });
      },
      { threshold: 0.75 }
    );

    const videos = containerRef.current.querySelectorAll("video");
    videos.forEach((video) => observer.observe(video));

    return () => {
      videos.forEach((video) => observer.unobserve(video));
    };
  }, [data, muted]);

  //PLAYING AND PAUSE PARAMS

  const [isPlaying, setIsPlaying] = useState({});
  const [showPlayIcon, setShowPlayIcon] = useState({});

  const togglePlay = (index) => {
    const video = videoRefs.current[index];
    if (!video) return;

    if (video.paused) {
      video.play().catch(() => {});
      setShowPlayIcon((prev) => ({ ...prev, [index]: true }));
      setIsPlaying((prev) => ({ ...prev, [index]: true }));

      setTimeout(() => {
        setShowPlayIcon((prev) => ({ ...prev, [index]: false }));
      }, 800);
    } else {
      video.pause();
      setShowPlayIcon((prev) => ({ ...prev, [index]: true }));
      setIsPlaying((prev) => ({ ...prev, [index]: false }));

      setTimeout(() => {
        setShowPlayIcon((prev) => ({ ...prev, [index]: false }));
      }, 800);
    }
  };

  //FOR COMMENTS

  const [activePost, setActivePost] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  // FOR FOLLOW
  const handleFollow = (userId, isSubscriber) => {
    FollowToUser(userId, isSubscriber);
  };

  //FOR FAVOURITE
  const handleToggleFavorite = async (postId) => {
    ToggleFavorite(postId);
  };

  useEffect(() => {
    GetReels();
  }, []);

  return (
    <section className="bg-[#000000] md:bg-[white] dark:bg-gray-900 dark:text-white w-[100%] h-[90vh] md:h-[100vh] flex justify-center">
      {isModalOpen && activePost && (
        <ComentModal post={activePost} onClose={() => setIsModalOpen(false)} />
      )}
      <div
        ref={containerRef}
        onScroll={onScroll}
        className="
        mainSection
        md:w-[590px] 
        w-[100%]
        h-full
        overflow-y-scroll
        flex flex-col
        snap-y snap-mandatory   
        scroll-smooth           
        md:gap-[20px]
        md:py-[50px]
        md:p-[50px]
        "
      >
        {data?.map((user, index) => {
          return (
            <div
              key={user.postId}
              className="min-h-[92vh] relative md:min-h-[696px] md:w-[490px] flex md:gap-[30px] items-center snap-center "
            >
              <div className="MainReelsDiv  relative h-full w-[100%] md:w-[80%] bg-[black] md:bg-[#d3d3d3] dark:bg-gray-900 dark:text-white flex items-center justify-center overflow-hidden  shadow-[#464646]">
                <div className="absolutem  -inset-10 bg-[black] md:bg-gradient-to-b from-[#a7a7a7] via-[#ffffff] to-[#8b8b8b] blur-xl "></div>
                <video
                  ref={(el) => (videoRefs.current[index] = el)}
                  autoPlay
                  muted
                  loop
                  playsInline
                  data-index={index}
                  data-postId={user.postId}
                  onClick={() => togglePlay(index)}
                  src={`https://instagram-api.softclub.tj/images/${user.images}`}
                  className="relative w-full shadow-2xs shadow-black"
                />

                <button
                  className="absolute z-[120] flex justify-center items-center w-[30px] h-[30px] bg-[#ffffff62] text-white hover:bg-[#ffffff30] hover:text-[#ffffffbc] rounded-full top-[10px] right-[10px]"
                  onClick={() => toggleMuteAll(index)}
                >
                  {muted ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="size-5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M17.25 9.75 19.5 12m0 0 2.25 2.25M19.5 12l2.25-2.25M19.5 12l-2.25 2.25m-10.5-6 4.72-4.72a.75.75 0 0 1 1.28.53v15.88a.75.75 0 0 1-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.009 9.009 0 0 1 2.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75Z"
                      />
                    </svg>
                  ) : (
                    <svg
                      aria-label="Аудио выключено"
                      fill="currentColor"
                      height="16"
                      viewBox="0 0 24 24"
                      width={20}
                    >
                      <path d="M16.636 7.028a1.5 1.5 0 10-2.395 1.807 5.365 5.365 0 011.103 3.17 5.378 5.378 0 01-1.105 3.176 1.5 1.5 0 102.395 1.806 8.396 8.396 0 001.71-4.981 8.39 8.39 0 00-1.708-4.978zm3.73-2.332A1.5 1.5 0 1018.04 6.59 8.823 8.823 0 0120 12.007a8.798 8.798 0 01-1.96 5.415 1.5 1.5 0 002.326 1.894 11.672 11.672 0 002.635-7.31 11.682 11.682 0 00-2.635-7.31zm-8.963-3.613a1.001 1.001 0 00-1.082.187L5.265 6H2a1 1 0 00-1 1v10.003a1 1 0 001 1h3.265l5.01 4.682.02.021a1 1 0 001.704-.814L12.005 2a1 1 0 00-.602-.917z"></path>
                    </svg>
                  )}
                </button>

                {showPlayIcon[index] && (
                  <div
                    className="animate-playIcon absolute w-[70px] h-[70px] rounded-full top-[300px] flex items-center justify-center bg-black/40 text-white "
                    onClick={() => togglePlay(index)}
                  >
                    <svg
                      aria-label="Значок кнопки воспроизведения"
                      className="x1lliihq x1n2onr6 xq3z1fi dark:bg-white/50"
                      fill="currentColor"
                      height="24"
                      role="img"
                      viewBox="0 0 24 24"
                      width="24"
                    >
                      <path d="M5.888 22.5a3.46 3.46 0 0 1-1.721-.46l-.003-.002a3.451 3.451 0 0 1-1.72-2.982V4.943a3.445 3.445 0 0 1 5.163-2.987l12.226 7.059a3.444 3.444 0 0 1-.001 5.967l-12.22 7.056a3.462 3.462 0 0 1-1.724.462Z"></path>
                    </svg>
                    <style jsx>{`
                      @keyframes playIconAnim {
                        0% {
                          transform: scale(0.2);
                          opacity: 0;
                        }
                        50% {
                          transform: scale(1.2);
                          opacity: 1;
                        }
                        100% {
                          transform: scale(1);
                          opacity: 1;
                        }
                      }
                      .animate-playIcon {
                        animation: playIconAnim 0.5s ease-out forwards;
                      }
                    `}</style>
                  </div>
                )}

                <div className="absolute z-10 bottom-[10px] p-[20px] w-[100%]  flex items-center md:justify-between gap-[20px] md:gap-[0px]">
                  <div className="flex gap-[10px]">
                    <div className="w-[35px] h-[35px] rounded-full over">
                      <Image
                        width={100}
                        height={100}
                        src={
                          user.userImage
                            ? `https://instagram-api.softclub.tj/images/${user?.userImage}`
                            : "/image.png"
                        }
                        className="w-[100%] h-[100%] rounded-full"
                        alt={user.userName || "User image"}
                      />
                    </div>
                    <div className="flex flex-col">
                      <Link href={`/profile/${user.userId}`}>
                        <p className="text-white w-[120px] font-[600]">
                          {user.userName}
                        </p>
                      </Link>
                      <h1 className="text-white text-[12px]">{user.title}</h1>
                    </div>
                  </div>
                  <button
                    onClick={() => handleFollow(user.userId, user.isSubscriber)}
                    className={`${
                      user.isSubscriber
                        ? "border text-white"
                        : "border text-white"
                    } hover:opacity-90 font-semibold text-sm px-2 py-2 rounded-[10px] transition`}
                  >
                    {user.isSubscriber ? "Вы подписаны" : "Подписаться"}
                  </button>
                </div>
              </div>
              <div className="OptionsDiv absolute right-[10px] bottom-[30px] md:bottom-[0px] md:right-0  flex md:relative text-white md:text-black  h-[100%] justify-end items-center flex-col gap-[30px] pb-[10px]">
                <div className="flex flex-col gap-[15px] justify-center items-center">
                  {/* LIKE_BTN */}
                  <div className=" flex flex-col  items-center justify-center">
                    <button
                      onClick={() => handleClick(user.postId)}
                      aria-pressed={user.postLike}
                      aria-label={user.postLike == false ? "Unlike" : "Like"}
                      className="focus:outline-none"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 48 48"
                        fill={user.postLike ? "#ff2929" : "none"}
                        stroke={
                          user.postLike
                            ? "#ff2929"
                            : window.innerWidth >= 768
                            ? "black"
                            : "white"
                        }
                        strokeWidth={3}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className={`
          w-[30px] h-[30px] cursor-pointer transition-transform duration-150
          ${animating ? "animate-like" : ""}
        `}
                      >
                        <path d="M34.6 6.1c-4.5 0-6.7 3-8.6 5.4-1.9-2.4-4.1-5.4-8.6-5.4-5.7 0-10.4 5.1-10.4 11.4 0 7.8 7.5 13.1 18.8 22.4l1.2 1 1.2-1c11.3-9.3 18.8-14.6 18.8-22.4 0-6.3-4.7-11.4-10.4-11.4z" />
                      </svg>

                      <style jsx>{`
                        @keyframes likePulse {
                          0% {
                            transform: scale(1);
                          }
                          50% {
                            transform: scale(1.3);
                          }
                          100% {
                            transform: scale(1);
                          }
                        }
                        .animate-like {
                          animation: likePulse 300ms ease forwards;
                        }
                      `}</style>
                    </button>
                    <h1>{user.postLikeCount}</h1>
                  </div>
                  {/* COMMENT_BTN */}
                  <div
                    onClick={() => {
                      setActivePost(user); // передаём объект поста
                      setIsModalOpen(true); // открываем модалку
                    }}
                    className="flex flex-col  items-center justify-center"
                  >
                    <svg
                      aria-label="Комментировать"
                      fill="currentColor"
                      height="24"
                      role="img"
                      viewBox="0 0 24 24"
                      width="24"
                    >
                      <title>Комментировать</title>
                      <path
                        d="M20.656 17.008a9.993 9.993 0 1 0-3.59 3.615L22 22Z"
                        fill="none"
                        stroke="currentColor"
                        stroke-linejoin="round"
                        stroke-width="2"
                      ></path>
                    </svg>
                    <h1>{user.commentCount}</h1>
                  </div>
                  {/* SEND_BTN */}
                  <button>
                    <svg
                      aria-label="Поделиться"
                      fill="currentColor"
                      height="24"
                      role="img"
                      viewBox="0 0 24 24"
                      width="24"
                    >
                      <title>Поделиться</title>
                      <line
                        fill="none"
                        stroke="currentColor"
                        stroke-linejoin="round"
                        stroke-width="2"
                        x1="22"
                        x2="9.218"
                        y1="3"
                        y2="10.083"
                      ></line>
                      <polygon
                        fill="none"
                        points="11.698 20.334 22 3.001 2 3.001 9.218 10.084 11.698 20.334"
                        stroke="currentColor"
                        stroke-linejoin="round"
                        stroke-width="2"
                      ></polygon>
                    </svg>
                  </button>
                </div>
                {/* SAVE_BTN */}
                <button onClick={() => handleToggleFavorite(user.postId)}>
                  {user.postFavorite ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="size-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="m3 3 1.664 1.664M21 21l-1.5-1.5m-5.485-1.242L12 17.25 4.5 21V8.742m.164-4.078a2.15 2.15 0 0 1 1.743-1.342 48.507 48.507 0 0 1 11.186 0c1.1.128 1.907 1.077 1.907 2.185V19.5M4.664 4.664 19.5 19.5"
                      />
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="size-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z"
                      />
                    </svg>
                  )}
                </button>
                {/* OPTION_BTN */}
                <button>
                  <svg
                    aria-label="Ещё"
                    class="x1lliihq x1n2onr6 xyb1xck"
                    fill="currentColor"
                    height="24"
                    role="img"
                    viewBox="0 0 24 24"
                    width="24"
                  >
                    <title>Ещё</title>
                    <circle cx="12" cy="12" r="1.5"></circle>
                    <circle cx="6" cy="12" r="1.5"></circle>
                    <circle cx="18" cy="12" r="1.5"></circle>
                  </svg>
                </button>
                {/* MUSIC_BTN */}
                <div className="w-[28px] rounded-[5px] border h-[28px] flex items-center justify-center overflow-hidden">
                  <Image
                    width={100}
                    height={100}
                    src={
                      user.userImage
                        ? `https://instagram-api.softclub.tj/images/${user?.userImage}`
                        : "/image.png"
                    }
                    alt={user.userName || "User image"}
                    className="w-[100%] h-[100%]"
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
