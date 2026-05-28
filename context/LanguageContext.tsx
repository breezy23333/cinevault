"use client";

export const languages = [
  { name: "English", code: "en" },
  { name: "Spanish", code: "es" },
  { name: "French", code: "fr" },
  { name: "Portuguese", code: "pt" },
  { name: "German", code: "de" },
  { name: "Hindi", code: "hi" },
  { name: "Arabic", code: "ar" },
  { name: "Chinese", code: "zh-CN" },
  { name: "Japanese", code: "ja" },
  { name: "Korean", code: "ko" },
];

export function changeWebsiteLanguage(code: string) {
  if (typeof window === "undefined") return;

  if (code === "en") {
    window.location.href = window.location.origin + window.location.pathname;
    return;
  }

  const currentUrl = window.location.href;
  window.location.href = `https://translate.google.com/translate?sl=auto&tl=${code}&u=${encodeURIComponent(
    currentUrl
  )}`;
}