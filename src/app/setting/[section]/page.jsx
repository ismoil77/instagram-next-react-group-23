"use client";

import { useParams } from "next/navigation";

export default function SettingSection() {
  const params = useParams();
  const { section } = params;

  // Здесь можно загрузить данные/компонент по section или вывести заглушку
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Раздел: {section}</h1>
      <p>Контент для раздела настроек {section}...</p>
    </div>
  );
}
