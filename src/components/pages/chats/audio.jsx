"use client";
import { useState, useRef } from "react";
import { Play, Pause } from "lucide-react";

export default function InstaAudio({ src }) {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const onTimeUpdate = () => {
    if (audioRef.current) {
      const percent =
        (audioRef.current.currentTime / audioRef.current.duration) * 100;
      setProgress(percent || 0);
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const onLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  // Функсия барои табдил додани секунд ба mm:ss
  const formatTime = (time) => {
    if (isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60)
      .toString()
      .padStart(2, "0");
    return `${minutes}:${seconds}`;
  };

  return (
    <div className="flex items-center gap-3 bg-gray-100 p-3 rounded-2xl shadow w-full max-w-sm">
      <button
        onClick={togglePlay}
        className="bg-pink-500 text-white p-3 rounded-full shadow hover:scale-105 transition"
      >
        {isPlaying ? <Pause size={20} /> : <Play size={20} />}
      </button>

      <div className="w-full flex-1 flex flex-col">
        <div className="w-[200px] h-2 bg-gray-300 rounded-full overflow-hidden mb-1">
          <div
            className="h-full bg-pink-500 transition-all"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <div className="text-xs text-gray-600 flex justify-between">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      <audio
        ref={audioRef}
        src={src}
        preload="metadata"
        onTimeUpdate={onTimeUpdate}
        onLoadedMetadata={onLoadedMetadata}
        onEnded={() => setIsPlaying(false)}
      />
    </div>
  );
}
