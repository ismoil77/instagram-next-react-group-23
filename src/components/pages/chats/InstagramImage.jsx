"use client";
import { useState } from "react";

export default function InstagramImage({ src }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <img
        src={src}
        alt="image"
        className="max-h-60 max-w-60 rounded-lg cursor-pointer hover:brightness-90 transition"
        onClick={() => setIsOpen(true)}
      />

      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-90 h-full flex items-center justify-center z-50">
          <div className="relative h-full w-full flex items-center justify-center">
            <button
              className="absolute top-4 right-4 text-white text-3xl font-bold z-50"
              onClick={() => setIsOpen(false)}
            >
              &times;
            </button>

            <img
              src={src}
              alt="full view"
              className="h-full w-auto object-contain"
            />
          </div>
        </div>
      )}
    </>
  );
}
