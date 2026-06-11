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
  reserveSpace = true,
}: {
  layout: BilingualLayout;
  showEn: boolean;
  en: React.ReactNode;
  zh: React.ReactNode;
  className?: string;
  reserveSpace?: boolean;
}) {
  const layoutClass = reserveSpace
    ? layout === "block"
      ? "grid w-full"
      : "inline-grid"
    : layout === "block"
      ? "block w-full"
      : "inline";

  return (
    <span
      data-localized="true"
      data-reserve-space={reserveSpace ? "true" : "false"}
      className={[layoutClass, className].filter(Boolean).join(" ")}
    >
      <span
        data-language-copy="en"
        className={reserveSpace ? "col-start-1 row-start-1" : undefined}
        aria-hidden={!showEn}
      >
        {en}
      </span>
      <span
        data-language-copy="zh"
        className={reserveSpace ? "col-start-1 row-start-1" : undefined}
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
    try {
      const stored = window.localStorage.getItem("viking-blackship-language");
      if (stored === "en" || stored === "zh") setLanguage(stored);
    } catch {}
  }, []);

  useEffect(() => {
    try {
      window.localStorage.setItem("viking-blackship-language", language);
    } catch {}
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

  return (
    <button
      type="button"
      onClick={toggleLanguage}
      aria-label={language === "zh" ? "切换到英文" : "Switch to Chinese"}
      className={`inline-grid bg-transparent ${className}`}
    >
      <BilingualSlot
        layout="inline"
        showEn={language === "en"}
        en="En/中文"
        zh="中文/En"
      />
    </button>
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

  return (
    <BilingualSlot
      layout={layout}
      showEn={language === "en"}
      en={en}
      zh={zh}
      reserveSpace={reserveSpace}
    />
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
