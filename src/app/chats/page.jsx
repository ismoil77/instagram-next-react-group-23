import Image from "next/image";
import React from "react";
import mes from "@/app/chats/images/mes.svg";

const Chat = () => {
  return (
    <div className="md:flex hidden flex-col items-center justify-center w-full h-[80vh] text-center px-4">
      <Image
        src={mes}
        width={120}
        height={120}
        alt="Messages"
        className="mb-6"
      />
      <h2 className="text-lg font-semibold mb-2">Your Messages</h2>
      <p className="text-gray-400 text-sm mb-6">
        Send private photos and messages to a friend or group
      </p>
      <button className="bg-blue-500 hover:bg-blue-600 transition-colors text-white font-medium px-6 py-2 rounded-lg">
        Send Message
      </button>
    </div>
  );
};

export default Chat;
