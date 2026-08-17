"use client"

import type React from "react"
import { useState } from "react"
import { Menu, X, ArrowUpRight, ArrowRight, Languages } from "lucide-react"
import Image from "next/image"
import { useLanguage } from "../context/language-context"

export function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const isScrolled = true
  const { lang, t, toggleLang } = useLanguage()

  const handleSmoothScroll = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    e.preventDefault()
    const element = document.getElementById(targetId)
    if (element) {
      const headerOffset = 100
      const elementPosition = element.getBoundingClientRect().top + window.scrollY
      const offsetPosition = elementPosition - headerOffset
      window.scrollTo({ top: offsetPosition, behavior: "smooth" })
      setIsOpen(false)
    }
  }

  const handleLogoClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const navLinks = [
    { label: t.nav.features, id: "features" },
    { label: t.nav.routes, id: "routes" },
    { label: t.nav.pricing, id: "pricing" },
    { label: t.nav.reviews, id: "testimonials" },
    { label: t.nav.faq, id: "faq" },
  ]

  return (
    <header className="fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-4 pt-4">
      <div
        className="max-w-7xl mx-auto transition-all duration-300 rounded-full bg-white/70 backdrop-blur-xl border border-white/60 shadow-lg shadow-slate-900/5 px-6 py-3"
      >
        <div className="flex items-center justify-between">
          {/* Logo */}
          <a href="#" onClick={handleLogoClick} className="flex items-center gap-3 cursor-pointer">
            <Image
              src="/logo.png"
              alt="BatoMandu Logo"
              width={38}
              height={38}
              className="rounded-lg object-contain"
            />
            <span className="text-lg font-bold tracking-tight" style={{ color: "#1B2B4B" }}>
              बाटो<span style={{ color: "#F5A623" }}>Mandu</span>
            </span>
          </a>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.id}
                href={`#${link.id}`}
                onClick={(e) => handleSmoothScroll(e, link.id)}
                className="text-sm transition-colors cursor-pointer text-zinc-600 hover:text-[#1B2B4B] font-medium"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Actions with Glassmorphism */}
          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={toggleLang}
              className="flex items-center gap-2 text-xs font-bold px-3.5 py-1.5 rounded-full bg-slate-100/70 border border-slate-200/80 backdrop-blur-md hover:bg-white hover:border-[#F5A623] hover:text-[#F5A623] transition-all duration-300 text-slate-800 shadow-sm"
            >
              <Languages size={15} />
              {t.nav.langLabel}
            </button>

            <button
              className="relative flex items-center gap-0 border rounded-full pl-5 pr-1 py-1 transition-all duration-300 group overflow-hidden border-[#1B2B4B] bg-white/40 backdrop-blur-md"
              style={{ borderColor: "#1B2B4B" }}
            >
              <span
                className="absolute inset-0 rounded-full scale-x-0 origin-right group-hover:scale-x-100 transition-transform duration-300"
                style={{ backgroundColor: "#1B2B4B" }}
              />
              <span className="text-sm pr-3 relative z-10 transition-colors duration-300 text-[#1B2B4B] group-hover:text-white font-medium">
                {t.nav.download}
              </span>
              <span className="w-8 h-8 rounded-full flex items-center justify-center relative z-10">
                <ArrowRight className="w-4 h-4 group-hover:opacity-0 absolute transition-opacity duration-300 text-[#1B2B4B]" />
                <ArrowUpRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-all duration-300 text-white" />
              </span>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden transition-colors duration-300 text-[#1B2B4B]"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Nav */}
        {isOpen && (
          <nav className="md:hidden mt-6 pb-6 flex flex-col gap-4 border-t pt-6 border-zinc-200">
            {navLinks.map((link) => (
              <a
                key={link.id}
                href={`#${link.id}`}
                onClick={(e) => handleSmoothScroll(e, link.id)}
                className="transition-colors cursor-pointer text-zinc-600 hover:text-[#1B2B4B] font-medium"
              >
                {link.label}
              </a>
            ))}
            <div className="flex flex-col gap-4 mt-4 pt-4 border-t border-zinc-200">
              <button
                onClick={toggleLang}
                className="flex items-center gap-2 text-sm font-semibold text-slate-700 hover:text-[#F5A623] transition-colors w-fit"
              >
                <Languages size={18} />
                {t.nav.langLabel}
              </button>
              <button
                className="relative flex items-center gap-0 border rounded-full pl-5 pr-1 py-1 w-fit transition-all duration-300 group overflow-hidden"
                style={{ borderColor: "#1B2B4B" }}
              >
                <span
                  className="absolute inset-0 rounded-full scale-x-0 origin-right group-hover:scale-x-100 transition-transform duration-300"
                  style={{ backgroundColor: "#1B2B4B" }}
                />
                <span className="text-sm pr-3 relative z-10 transition-colors duration-300 text-[#1B2B4B] group-hover:text-white font-medium">
                  {t.nav.download}
                </span>
                <span className="w-8 h-8 rounded-full flex items-center justify-center relative z-10">
                  <ArrowRight className="w-4 h-4 group-hover:opacity-0 absolute transition-opacity duration-300 text-[#1B2B4B]" />
                  <ArrowUpRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-all duration-300 text-white" />
                </span>
              </button>
            </div>
          </nav>
        )}
      </div>
    </header>
  )
}
