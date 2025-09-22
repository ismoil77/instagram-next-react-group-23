'use client'

import React, { useRef, useState } from "react";
import Picker from "emoji-picker-react";
import Image from "next/image";
import Link from "next/link";
import { useData } from "@/store/pages/reels/reels";
import "./stylle.css";

const ComentModal = ({ post, onClose }) => {
  const [showPicker, setShowPicker] = useState(false);
  const [value, setValue] = useState("");
  const [comments, setComments] = useState(post.comments || []);
  const [likedComments, setLikedComments] = useState({});
  const inputRef = useRef(null);
  const { AddComment } = useData();

  const handleEmojiClick = (emojiObject) => {
    setValue((prev) => prev + emojiObject.emoji);
    inputRef.current.focus();
  };

  const handleLike = (id) => {
    setLikedComments(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const handleSendComment = () => {
    if (!value.trim()) return;

    const token = localStorage.getItem("access_token");
    const userName = token
      ? JSON.parse(atob(token.split(".")[1]))?.name
      : "Anonymous";

    const newComment = {
      postCommentId: Date.now(),
      userId: post.userId,
      userName,
      userImage: post.userImage,
      dateCommented: new Date().toISOString(),
      comment: value,
    };

    setComments(prev => [...prev, newComment]);
    AddComment({ postId: post.postId, comment: value });
    setValue("");
  };

  return (
    <div className="w-full md:w-[350px] bg-[#000000] md:bg-white dark:bg-gray-900 z-[20] absolute shadow-md md:right-[15px] px-[30px] py-[10px] rounded-[10px] md:rounded-[5px] bottom-[52px] md:bottom-[300px] dark:border">
      {/* Header */}
      <div className="flex items-center h-[40px] gap-[55px] text-white md:text-black dark:text-white">
        <button onClick={onClose} className="hover:text-gray-400 dark:hover:text-gray-300 transition-all">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12"/>
          </svg>
        </button>
        <h1 className="text-[18px] font-bold">Комментарии</h1>
      </div>

      {/* Comments List */}
      <div className="comments-list flex flex-col py-[30px] gap-[20px] max-h-[350px] overflow-y-auto">
        {comments.length > 0 ? comments.map(comment => (
          <div key={comment.postCommentId} className="flex items-center justify-between">
            <div className="flex gap-[10px]">
              <div className="w-[35px] h-[35px] rounded-full overflow-hidden">
                <Image
                  width={100}
                  height={100}
                  src={comment.userImage ? `http://37.27.29.18:8003/images/${comment.userImage}` : "/image.png"}
                  alt={comment.userName}
                  className="w-full h-full object-cover rounded-full"
                />
              </div>
              <div className="flex flex-col">
                <Link href={`/profile/${comment.userId}`}>
                  <p className="font-semibold text-white md:text-black dark:text-white">{comment.userName}</p>
                </Link>
                <p className="w-[150px] text-white md:text-black dark:text-gray-300">{comment.comment}</p>
              </div>
            </div>
            <button
              onClick={() => handleLike(comment.postCommentId)}
              aria-pressed={likedComments[comment.postCommentId] || false}
              className="focus:outline-none hover:scale-110 transition-transform"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48"
                fill={likedComments[comment.postCommentId] ? "#ff2929" : "none"}
                stroke={likedComments[comment.postCommentId] ? "#ff2929" : "gray"}
                strokeWidth={3} strokeLinecap="round" strokeLinejoin="round"
                className="w-[15px] h-[15px] cursor-pointer"
              >
                <path d="M34.6 6.1c-4.5 0-6.7 3-8.6 5.4-1.9-2.4-4.1-5.4-8.6-5.4-5.7 0-10.4 5.1-10.4 11.4 0 7.8 7.5 13.1 18.8 22.4l1.2 1 1.2-1c11.3-9.3 18.8-14.6 18.8-22.4 0-6.3-4.7-11.4-10.4-11.4z"/>
              </svg>
            </button>
          </div>
        )) : (
          <p className="text-center text-gray-400 dark:text-gray-500">Нет комментариев</p>
        )}
      </div>

      {/* Input */}
      <div className="h-[43px] border-[1px] bg-gray-300 md:border-[#dbdbdb] md:bg-[#f0f0f0] dark:bg-gray-800 dark:border-gray-700 rounded-[50px] flex justify-between items-center p-[4px] relative">
        <div className="h-[100%] w-[33px] bg-amber-800 rounded-full overflow-hidden">
          <Image
            width={100}
            height={100}
            src={post.userImage ? `http://37.27.29.18:8003/images/${post.userImage}` : "/image.png"}
            className="w-[100%] h-[100%] rounded-full"
            alt=""
          />
        </div>
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSendComment()}
          placeholder="Добавьте комментарий..."
          className="flex-1 px-3 py-2 text-[12px] bg-transparent outline-none text-black dark:text-white dark:placeholder-gray-400"
        />
        <button onClick={handleSendComment} className="text-blue-600 dark:text-blue-400 hover:opacity-80 transition-all">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5"/>
          </svg>
        </button>
        <button onClick={() => setShowPicker(!showPicker)} className="emojiBtn text-gray-500 dark:text-gray-300 mr-[5px] hover:text-gray-700 dark:hover:text-gray-400">
          <svg aria-label="Смайлик" fill="currentColor" height="24" role="img" viewBox="0 0 24 24" width="24">
            <title>Смайлик</title>
            <path d="M15.83 10.997a1.167 1.167 0 1 0 1.167 1.167 1.167 1.167 0 0 0-1.167-1.167Zm-6.5 1.167a1.167 1.167 0 1 0-1.166 1.167 1.167 1.167 0 0 0 1.166-1.167Zm5.163 3.24a3.406 3.406 0 0 1-4.982.007 1 1 0 1 0-1.557 1.256 5.397 5.397 0 0 0 8.09 0 1 1 0 0 0-1.55-1.263ZM12 .503a11.5 11.5 0 1 0 11.5 11.5A11.513 11.513 0 0 0 12 .503Zm0 21a9.5 9.5 0 1 1 9.5-9.5 9.51 9.51 0 0 1-9.5 9.5Z"></path>
          </svg>
        </button>
        {showPicker && (
          <div className="absolute bottom-[50px] right-0 z-50">
            <Picker onEmojiClick={handleEmojiClick} />
          </div>
        )}
      </div>
    </div>
  );
};

export default ComentModal;
