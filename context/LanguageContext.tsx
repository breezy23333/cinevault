"use client";

import { createContext, useContext, useEffect, useState } from "react";

type Language =
  | "English"
  | "Spanish"
  | "French"
  | "Portuguese"
  | "German"
  | "Hindi"
  | "Arabic"
  | "Chinese"
  | "Japanese"
  | "Korean";

const translations = {
  English: {
    home: "Home",
    browse: "Browse",
    store: "Store",
    about: "About",
    support: "Support",
    news: "News",
    search: "Search movies, shows...",
  },
  Spanish: {
    home: "Inicio",
    browse: "Explorar",
    store: "Tienda",
    about: "Acerca de",
    support: "Soporte",
    news: "Noticias",
    search: "Buscar películas, series...",
  },
  French: {
    home: "Accueil",
    browse: "Explorer",
    store: "Boutique",
    about: "À propos",
    support: "Support",
    news: "Actualités",
    search: "Rechercher films, séries...",
  },
  Portuguese: {
    home: "Início",
    browse: "Explorar",
    store: "Loja",
    about: "Sobre",
    support: "Suporte",
    news: "Notícias",
    search: "Pesquisar filmes, séries...",
  },
  German: {
    home: "Start",
    browse: "Entdecken",
    store: "Shop",
    about: "Über uns",
    support: "Support",
    news: "Nachrichten",
    search: "Filme, Serien suchen...",
  },
  Hindi: {
    home: "होम",
    browse: "ब्राउज़",
    store: "स्टोर",
    about: "परिचय",
    support: "सहायता",
    news: "समाचार",
    search: "फिल्में, शो खोजें...",
  },
  Arabic: {
    home: "الرئيسية",
    browse: "تصفح",
    store: "المتجر",
    about: "حول",
    support: "الدعم",
    news: "الأخبار",
    search: "ابحث عن أفلام ومسلسلات...",
  },
  Chinese: {
    home: "首页",
    browse: "浏览",
    store: "商店",
    about: "关于",
    support: "支持",
    news: "新闻",
    search: "搜索电影、剧集...",
  },
  Japanese: {
    home: "ホーム",
    browse: "探す",
    store: "ストア",
    about: "概要",
    support: "サポート",
    news: "ニュース",
    search: "映画、番組を検索...",
  },
  Korean: {
    home: "홈",
    browse: "탐색",
    store: "스토어",
    about: "소개",
    support: "지원",
    news: "뉴스",
    search: "영화, 시리즈 검색...",
  },
};

const LanguageContext = createContext({
  language: "English" as Language,
  setLanguage: (_language: Language) => {},
  t: translations.English,
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>("English");

  useEffect(() => {
    const saved = localStorage.getItem("cinevault_language") as Language | null;
    if (saved && translations[saved]) setLanguageState(saved);
  }, []);

  function setLanguage(value: Language) {
    setLanguageState(value);
    localStorage.setItem("cinevault_language", value);
  }

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        t: translations[language],
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}

export const languageOptions = Object.keys(translations) as Language[];