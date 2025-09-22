import { useEffect, useState } from "react"

export default function useDarkSide() {
  const [theme, setTheme] = useState("light")
  const [isMounted, setIsMounted] = useState(false)

  // Загружаем тему только на клиенте
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedTheme = localStorage.getItem("theme") || "light"
      setTheme(savedTheme)
      setIsMounted(true)
    }
  }, [])

  useEffect(() => {
    if (!isMounted || typeof window === "undefined") return

    const root = window.document.documentElement
    const oppositeTheme = theme === "dark" ? "light" : "dark"

    root.classList.remove(oppositeTheme)
    root.classList.add(theme)

    try {
      localStorage.setItem("theme", theme)
    } catch (e) {
      console.error("Ошибка при сохранении темы:", e)
    }
  }, [theme, isMounted])

  return [theme, setTheme]
}
