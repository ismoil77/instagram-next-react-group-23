"use client";
import { useChatStore } from "@/store/pages/chat/chat"
import { useChatStore2 } from "@/store/pages/chat/chatbyid"
import { useEffect, useState } from "react"

const ShareModal = ({ postid }) => {
  const [isOpen, setIsOpen] = useState(true);
  const [successModalOpen, setSuccessModalOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [message, setMessage] = useState(postid);
  const { chats, getChats, profile, getProfile } = useChatStore();
  const { sendMessage } = useChatStore2();

  useEffect(() => {
    getChats();
    getProfile();
  }, []);

  const closeModals = () => {
    setIsOpen(false);
    setSuccessModalOpen(false);
  };

  const handleSend = async (chatId) => {
    if (!message) return;
    await sendMessage({ chatId, messageText: message });
    setMessage("");
    setIsOpen(false);
    setSuccessModalOpen(true);
  };

  const filteredChats = chats.filter((chat) => {
    const otherName =
      chat.receiveUserName !== profile?.userName
        ? chat.receiveUserName
        : chat.sendUserName;
    return otherName?.toLowerCase().includes(search.toLowerCase());
  });

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 backdrop-blur-md bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-black rounded-xl max-w-md w-full max-h-[70vh] overflow-hidden shadow-2xl">
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
              <button
                onClick={closeModals}
                className="text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white text-2xl"
              >
                ×
              </button>
              <h2 className="font-semibold text-sm dark:text-white">Поделиться</h2>
            </div>

            <div className="p-4">
              <div className="relative">
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  type="text"
                  placeholder="Поиск"
                  className="w-full px-4 py-2 pl-10 bg-gray-100 dark:bg-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white"
                />
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  className="w-5 h-5 absolute left-3 top-2.5 text-gray-500 dark:text-gray-400"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
            </div>

            <div className="px-4 pb-4 max-h-60 overflow-y-auto">
              <div className="grid grid-cols-3 gap-4">
                {filteredChats.map((chat, index) => {
                  const otherName =
                    chat.receiveUserName !== profile?.userName
                      ? chat.receiveUserName
                      : chat.sendUserName;
                  const otherImage =
                    chat.receiveUserName !== profile?.userName
                      ? chat.receiveUserImage
                      : chat.sendUserImage;

                  return (
                    <div
                      key={index}
                      onClick={() => {
                        handleSend(chat?.chatId);
                      }}
                      className="flex flex-col items-center cursor-pointer"
                    >
                      {otherImage ? (
                        <img
                          src={`https://instagram-api.softclub.tj/images/${otherImage}`}
                          alt={otherName}
                          className="w-14 h-14 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-14 h-14 rounded-full bg-gray-400 dark:bg-gray-600 flex items-center justify-center text-white text-xl font-bold">
                          {otherName?.[0]?.toUpperCase()}
                        </div>
                      )}
                      <span className="text-xs mt-1 text-center text-gray-800 dark:text-gray-200">
                        {otherName}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="flex flex-wrap justify-around p-4 border-t border-gray-200 dark:border-gray-700">
              {[
                { label: "Копировать ссылку", icon: "🔗" },
                { label: "Facebook", icon: "f" },
                { label: "WhatsApp", icon: "📱" },
                { label: "Threads", icon: "🧵" },
                { label: "X", icon: "𝕏" },
              ].map((btn, index) => (
                <button
                  key={index}
                  onClick={() => setSuccessModalOpen(true)}
                  className="flex flex-col items-center p-2 text-xs text-gray-700 dark:text-gray-300 hover:text-blue-500 transition-colors"
                >
                  <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-sm mb-1">
                    {btn.icon}
                  </div>
                  <span>{btn.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {successModalOpen && (
        <div className="fixed inset-0 backdrop-blur-md bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-black rounded-xl max-w-sm w-full p-6 text-center shadow-2xl animate-fadeIn">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-100 dark:bg-green-800 flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                className="w-8 h-8 text-green-500"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2 dark:text-white">Успешно отправлено!</h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm mb-6">
              Ваш пост был успешно отправлен.
            </p>
            <button
              onClick={closeModals}
              className="w-full py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Закрыть
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default ShareModal;
