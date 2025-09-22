"use client";
import { useState } from "react";
import { Play } from "lucide-react";

export default function InstagramVideo({ src }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div
        className="relative max-h-60 max-w-60 cursor-pointer"
        onClick={() => setIsOpen(true)}
      >
        <video
          className="rounded-lg max-h-60 max-w-60 object-cover"
          src={src}
        />
        <div className="absolute z-50 inset-0 flex items-end justify-end">
          <Play className="text-white text-[30px] opacity-80" />
        </div>
      </div>

      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-90 h-full flex items-center justify-center z-50">
          <div className="relative h-full w-full flex items-center justify-center">
            <button
              className="absolute top-4 right-4 text-white text-3xl font-bold z-50"
              onClick={() => setIsOpen(false)}
            >
              &times;
            </button>

            <video
              controls
              autoPlay
              className="h-full w-auto object-contain rounded-lg"
              src={src}
            />
          </div>
        </div>
      )}
    </>
  );
}
