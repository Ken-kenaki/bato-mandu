"use client"

import React, { createContext, useContext, useState, ReactNode, useEffect } from "react"
import { translations, Lang, Translations } from "../lib/translations"

interface LanguageContextType {
  lang: Lang
  t: Translations
  toggleLang: () => void
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>("en") // Default to English
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    // Optionally load preference from localStorage here in the future
    setMounted(true)
  }, [])

  const toggleLang = () => {
    setLang((prev) => (prev === "en" ? "ne" : "en"))
  }

  // Prevent hydration mismatch by rendering default until mounted
  if (!mounted) {
    return (
      <LanguageContext.Provider value={{ lang: "en", t: translations["en"], toggleLang }}>
        {children}
      </LanguageContext.Provider>
    )
  }

  return (
    <LanguageContext.Provider value={{ lang, t: translations[lang], toggleLang }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider")
  }
  return context
}
