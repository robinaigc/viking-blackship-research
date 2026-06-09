"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

type Language = "en" | "zh";
type BilingualLayout = "inline" | "block";

const LanguageContext = createContext<{
  language: Language;
  toggleLanguage: () => void;
}>({
  language: "en",
  toggleLanguage: () => undefined,
});

function BilingualSlot({
  layout,
  showEn,
  en,
  zh,
  className,
}: {
  layout: BilingualLayout;
  showEn: boolean;
  en: React.ReactNode;
  zh: React.ReactNode;
  className?: string;
}) {
  const gridClass = layout === "block" ? "grid w-full" : "inline-grid";

  return (
    <span className={[gridClass, className].filter(Boolean).join(" ")}>
      <span
        className={`col-start-1 row-start-1 ${showEn ? "visible" : "invisible"}`}
        aria-hidden={!showEn}
      >
        {en}
      </span>
      <span
        className={`col-start-1 row-start-1 ${showEn ? "invisible" : "visible"}`}
        aria-hidden={showEn}
      >
        {zh}
      </span>
    </span>
  );
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>("en");

  useEffect(() => {
    const stored = window.localStorage.getItem("viking-blackship-language");
    if (stored === "en" || stored === "zh") {
      setLanguage(stored);
      document.documentElement.lang = stored === "zh" ? "zh-CN" : "en";
      document.documentElement.dataset.language = stored;
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem("viking-blackship-language", language);
    document.documentElement.lang = language === "zh" ? "zh-CN" : "en";
    document.documentElement.dataset.language = language;
  }, [language]);

  function toggleLanguage() {
    setLanguage((current) => (current === "en" ? "zh" : "en"));
  }

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}

export function LanguageToggle({ className }: { className: string }) {
  const { language, toggleLanguage } = useLanguage();
  const showEn = language === "en";

  return (
    <span
      role="button"
      tabIndex={0}
      onClick={toggleLanguage}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          toggleLanguage();
        }
      }}
      aria-label={language === "zh" ? "切换语言" : "Toggle language"}
      className={`inline-grid cursor-pointer ${className}`}
    >
      <span
        className={`col-start-1 row-start-1 ${showEn ? "visible" : "invisible"}`}
        aria-hidden={!showEn}
      >
        En/中文
      </span>
      <span
        className={`col-start-1 row-start-1 ${showEn ? "invisible" : "visible"}`}
        aria-hidden={showEn}
      >
        中文/En
      </span>
    </span>
  );
}

export function LocalizedText({
  en,
  zh,
  layout = "inline",
  reserveSpace = true,
}: {
  en: string;
  zh: string;
  layout?: BilingualLayout;
  reserveSpace?: boolean;
}) {
  const { language } = useLanguage();

  if (!reserveSpace) {
    return <>{language === "zh" ? zh : en}</>;
  }

  return (
    <BilingualSlot layout={layout} showEn={language === "en"} en={en} zh={zh} />
  );
}

export function LocalizedDate({ isoDate }: { isoDate: string }) {
  const { language } = useLanguage();
  const date = new Date(isoDate);
  const en = Intl.DateTimeFormat("en-US", { dateStyle: "medium" }).format(date);
  const zh = Intl.DateTimeFormat("zh-CN", { dateStyle: "medium" }).format(date);

  return (
    <BilingualSlot layout="inline" showEn={language === "en"} en={en} zh={zh} />
  );
}

export function LocalizedReadingTime({ value }: { value: string }) {
  const { language } = useLanguage();
  const match = value.match(/^(\d+)\s*min\s*read$/i);
  const zh = match ? `${match[1]} 分钟阅读` : value;

  return (
    <BilingualSlot
      layout="inline"
      showEn={language === "en"}
      en={value}
      zh={zh}
    />
  );
}
