"use client"

import Link from "next/link"
import Image from "next/image"
import { Globe, Mail, Share2, MessageCircle } from "lucide-react"
import { useLanguage } from "../context/language-context"

export function Footer() {
  const { t } = useLanguage()

  const footerLinks = {
    product: [
      { label: t.nav.routes, href: "#routes" },
      { label: t.nav.features, href: "#features" },
      { label: t.nav.pricing, href: "#pricing" },
      { label: t.nav.faq, href: "#faq" },
    ],
    company: [
      { label: "About Us", href: "#" },
      { label: "Careers", href: "#" },
      { label: "Blog", href: "#" },
      { label: "Contact", href: "#" },
    ],
    legal: [
      { label: "Privacy Policy", href: "#" },
      { label: "Terms of Service", href: "#" },
      { label: "Cookie Policy", href: "#" },
    ],
    support: [
      { label: "Help Center", href: "#" },
      { label: "Community", href: "#" },
      { label: "Status", href: "#" },
    ],
  }

  return (
    <footer className="relative bg-white pt-20 pb-12 px-6 border-t overflow-hidden" style={{ borderColor: "#f3f4f6" }}>
      {/* Traditional Nepali Temple & Stupa Skyline Silhouette Pattern */}
      <div className="w-full opacity-15 pointer-events-none select-none mb-10 overflow-hidden">
        <svg
          viewBox="0 0 1400 140"
          className="w-full h-24 sm:h-32 text-[#1B2B4B]"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {/* Repeatable Pattern of Pagodas, Stupas, and Traditional Nepali Windows */}
          <g transform="translate(0, 0)">
            {/* Pagoda 1 - 3 tier */}
            <path d="M 60 140 L 60 110 L 35 110 L 85 80 L 45 80 L 85 50 L 55 50 L 85 20 L 85 8 L 85 20 L 115 50 L 85 50 L 125 80 L 85 80 L 135 110 L 110 110 L 110 140" />
            <path d="M 85 8 L 85 2" strokeWidth="2" />
            {/* Stupa 1 (Swayambhu style dome & spire) */}
            <path d="M 200 140 A 45 45 0 0 1 290 140" />
            <rect x="235" y="75" width="20" height="20" />
            {/* Eyes of Buddha */}
            <circle cx="241" cy="83" r="1.5" fill="currentColor" />
            <circle cx="249" cy="83" r="1.5" fill="currentColor" />
            {/* Spire 13 tiers */}
            <path d="M 245 75 L 245 40" strokeWidth="2" />
            <path d="M 238 65 L 252 65 M 239 60 L 251 60 M 240 55 L 250 55 M 241 50 L 249 50 M 242 45 L 248 45" />
            <path d="M 245 40 L 245 32" />
            <circle cx="245" cy="30" r="3" />

            {/* Small Pagoda 2 */}
            <path d="M 360 140 L 360 115 L 340 115 L 380 90 L 350 90 L 380 65 L 380 52 L 380 65 L 410 90 L 380 90 L 420 115 L 400 115 L 400 140" />
            
            {/* Traditional Nepali Carved Window Frame (Pasa Jhya) */}
            <rect x="470" y="70" width="50" height="60" rx="3" />
            <rect x="480" y="80" width="30" height="40" rx="2" />
            <path d="M 470 70 L 495 50 L 520 70" />

            {/* Large Nyatapola Pagoda */}
            <path d="M 600 140 L 600 115 L 565 115 L 635 85 L 580 85 L 635 60 L 590 60 L 635 38 L 605 38 L 635 18 L 635 5 L 635 18 L 665 38 L 635 38 L 680 60 L 635 60 L 690 85 L 635 85 L 705 115 L 670 115 L 670 140" />

            {/* Stupa 2 */}
            <path d="M 780 140 A 45 45 0 0 1 870 140" />
            <rect x="815" y="75" width="20" height="20" />
            <circle cx="821" cy="83" r="1.5" fill="currentColor" />
            <circle cx="829" cy="83" r="1.5" fill="currentColor" />
            <path d="M 825 75 L 825 40" strokeWidth="2" />
            <path d="M 818 65 L 832 65 M 819 60 L 831 60 M 820 55 L 830 55 M 821 50 L 829 50" />
            <circle cx="825" cy="30" r="3" />

            {/* Pagoda 3 */}
            <path d="M 940 140 L 940 115 L 920 115 L 960 90 L 930 90 L 960 65 L 930 65 L 960 40 L 960 28 L 960 40 L 990 65 L 960 65 L 990 90 L 960 90 L 1000 115 L 980 115 L 980 140" />

            {/* Window Frame 2 */}
            <rect x="1050" y="70" width="50" height="60" rx="3" />
            <rect x="1060" y="80" width="30" height="40" rx="2" />
            <path d="M 1050 70 L 1075 50 L 1100 70" />

            {/* Large 3-tier Pagoda End */}
            <path d="M 1180 140 L 1180 110 L 1155 110 L 1205 80 L 1165 80 L 1205 50 L 1175 50 L 1205 20 L 1205 8 L 1205 20 L 1235 50 L 1205 50 L 1245 80 L 1205 80 L 1255 110 L 1230 110 L 1230 140" />
          </g>
        </svg>
      </div>

      {/* Large watermark above footer */}
      <div
        className="absolute -top-[12vw] left-0 right-0 flex items-end justify-center overflow-visible pointer-events-none z-10"
      >
        <h2
          className="font-bold text-center text-[28vw] sm:text-[25vw] md:text-[22vw] lg:text-[20vw] leading-[0.85] tracking-tighter whitespace-nowrap select-none"
          style={{ color: "#1B2B4B", opacity: 0.03 }}
        >
          BATOMANDU
        </h2>
      </div>

      <div className="relative max-w-7xl mx-auto z-20">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <Image
                src="/logo.jpeg"
                alt="BatoMandu"
                width={32}
                height={32}
                className="rounded-md object-contain"
              />
              <span className="text-base font-bold" style={{ color: "#1B2B4B" }}>
                बाटो<span style={{ color: "#F5A623" }}>Mandu</span>
              </span>
            </Link>
            <p className="text-sm text-muted-foreground mb-2">
              काठमाडौंको बाटो अब सजिलो।
            </p>
            <p className="text-muted-foreground text-xs leading-relaxed max-w-sm mt-4">
              {t.footer.subtitle}
            </p>
            <div className="flex gap-3 mt-6">
              {[
                { Icon: Globe, label: "Website" },
                { Icon: MessageCircle, label: "Community" },
                { Icon: Share2, label: "Share" },
                { Icon: Mail, label: "Contact" },
              ].map(({ Icon, label }) => (
                <Link
                  key={label}
                  href="#"
                  aria-label={label}
                  className="w-9 h-9 border rounded-full flex items-center justify-center transition-colors hover:border-[#F5A623] hover:text-[#F5A623]"
                  style={{ borderColor: "#e5e7eb", color: "#9ca3af" }}
                >
                  <Icon className="w-4 h-4" />
                </Link>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([section, links]) => (
            <div key={section}>
              <h4
                className="text-xs font-bold uppercase tracking-wider mb-4"
                style={{ color: "#1B2B4B" }}
              >
                {section.charAt(0).toUpperCase() + section.slice(1)}
              </h4>
              <ul className="space-y-3">
                {links.map((link, i) => (
                  <li key={i}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground transition-colors hover:text-[#F5A623]"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* App Store Buttons */}
        <div className="flex flex-wrap gap-4 mb-10">
          <button
            className="flex items-center gap-3 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 hover:opacity-90"
            style={{ backgroundColor: "#1B2B4B", color: "white" }}
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.7 9.05 7.4c1.4.07 2.38.73 3.2.73.93 0 2.66-.9 4.5-.77 1.47.1 2.82.65 3.8 1.74-3.43 2.12-2.88 6.68.5 7.98-.63 1.73-1.47 3.47-3 4.2zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
            </svg>
            App Store
          </button>
          <button
            className="flex items-center gap-3 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 hover:opacity-90 border"
            style={{ borderColor: "#1B2B4B", color: "#1B2B4B" }}
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M3 20.5v-17c0-.83 1.01-1.3 1.7-.8l14 8.5c.63.38.63 1.32 0 1.7l-14 8.5c-.69.5-1.7.03-1.7-.8z" />
            </svg>
            Google Play
          </button>
        </div>

        {/* Bottom bar */}
        <div
          className="pt-8 border-t flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-muted-foreground"
          style={{ borderColor: "#f3f4f6" }}
        >
          <div>
            © 2026 BatoMandu. All rights reserved.
          </div>

          {/* Developed in collaboration with Aesthera Tech */}
          <div className="flex items-center gap-1 font-medium">
            <span>{t.footer.collab}</span>
            <a
              href="https://aestheraltd.tech"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#1B2B4B] font-bold hover:text-[#F5A623] hover:underline transition-colors ml-1"
            >
              Aesthera Tech
            </a>
          </div>

          <div>
            {t.footer.bottomTag}
          </div>
        </div>
      </div>
    </footer>
  )
}
