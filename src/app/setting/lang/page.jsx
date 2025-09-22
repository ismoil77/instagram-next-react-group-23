"use client";

import { MoveLeft } from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";

const Language = () => {
  const { i18n, t } = useTranslation();

  const languages = [
    { code: "ru", label: t("setting.russian") },
    { code: "tj", label: t("setting.tajik") },
    { code: "en", label: t("setting.english") },
  ];

  const [search, setSearch] = useState("");

  const handleChange = (lang) => {
    i18n.changeLanguage(lang);
  };

  const filteredLanguages = languages.filter((lang) =>
    lang.label.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="absolute md:relative w-full h-screen bg-white max-w-md mx-auto px-6 py-4 z-20">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Link href="/setting" className="md:hidden block">
          <button className="p-2 rounded-full hover:bg-gray-100 transition">
            <MoveLeft size={24} />
          </button>
        </Link>
        <h2 className="text-xl font-semibold">{t("setting.lang")}</h2>
      </div>

      {/* Subtitle */}
      <p className="text-sm text-gray-500 mb-4">
        {t("setting.text")}
      </p>

      {/* Search (optional) */}
      {/* <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Поиск"
        className="w-full px-4 py-2 mb-4 text-sm border rounded-lg bg-gray-100 focus:outline-none focus:ring-2 focus:ring-black"
      /> */}

      {/* Language List */}
      <div className="divide-y divide-gray-200 border rounded-lg overflow-hidden">
        {filteredLanguages.map((lang) => (
          <button
            key={lang.code}
            onClick={() => handleChange(lang.code)}
            className={`w-full px-4 py-4 flex items-center justify-between text-sm font-medium transition-all hover:bg-gray-50 ${
              i18n.language === lang.code ? "text-black" : "text-gray-600"
            }`}
          >
            <span>{lang.label}</span>
            {i18n.language === lang.code && (
              <span className="text-blue-500 text-base">✓</span>
            )}
          </button>
        ))}
      </div>

      {/* Not Found */}
      {filteredLanguages.length === 0 && (
        <p className="text-gray-400 text-center mt-6 text-sm">Язык не найден</p>
      )}
    </div>
  );
};

export default Language;
