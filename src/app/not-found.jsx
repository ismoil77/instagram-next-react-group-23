import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white px-4 text-gray-900">
      <div className="flex flex-col items-center max-w-md text-center">
        <h1 className="text-3xl md:text-5xl font-bold mb-3">
          Страница недоступна
        </h1>
        <p className="text-gray-500 text-sm md:text-base mb-6">
          Возможно, вы перешли по неверной ссылке или страница была удалена.
        </p>
        <Link
          href="/"
          className="px-6 py-2 bg-blue-500 text-white rounded-md shadow-md hover:bg-blue-600 transition-colors"
        >
          Назад в Instagram
        </Link>
      </div>

      <div className="flex flex-wrap justify-center gap-3 text-gray-400 text-[13px] font-mono mt-10">
        {[
          "Meta",
          "Информация",
          "Блог",
          "Вакансии",
          "Помощь",
          "API",
          "Конфиденциальность",
          "Условия",
          "Места",
          "Instagram Lite",
          "Meta AI",
          "Статьи Meta AI",
          "Threads",
          "Meta Verified",
        ].map((item) => (
          <span
            key={item}
            className="hover:text-blue-500 cursor-pointer transition-colors"
          >
            {item}
          </span>
        ))}
      </div>

      <p className="text-gray-400 text-xs mt-6">© 2025 Instagram from Meta</p>
    </div>
  );
}
