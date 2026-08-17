"use client"
import { useEffect, useState } from "react"
import { AnimatedText } from "./animated-text"
import { ArrowDownCircle } from "lucide-react"
import { useLanguage } from "../context/language-context"

export function HeroSection() {
  const { t } = useLanguage()
  const [isVisible, setIsVisible] = useState(false)
  const [scrollProgress, setScrollProgress] = useState(0)

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    let rafId: number
    let currentProgress = 0

    const handleScroll = () => {
      const scrollY = window.scrollY
      const maxScroll = 400
      const targetProgress = Math.min(scrollY / maxScroll, 1)

      const smoothUpdate = () => {
        currentProgress += (targetProgress - currentProgress) * 0.1
        if (Math.abs(targetProgress - currentProgress) > 0.001) {
          setScrollProgress(currentProgress)
          rafId = requestAnimationFrame(smoothUpdate)
        } else {
          setScrollProgress(targetProgress)
        }
      }

      cancelAnimationFrame(rafId)
      smoothUpdate()
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => {
      window.removeEventListener("scroll", handleScroll)
      cancelAnimationFrame(rafId)
    }
  }, [])

  const easeOutQuad = (t: number) => t * (2 - t)
  const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3)

  const scale = 1 - easeOutQuad(scrollProgress) * 0.15
  const borderRadius = easeOutCubic(scrollProgress) * 48
  const heightVh = 100 - easeOutQuad(scrollProgress) * 37.5

  return (
    <section className="pt-32 pb-12 px-6 min-h-screen flex items-center relative overflow-hidden">
      {/* Parallax background */}
      <div className="absolute inset-0 top-0">
        <div
          className="w-full will-change-transform overflow-hidden relative"
          style={{
            transform: `scale(${scale})`,
            borderRadius: `${borderRadius}px`,
            height: `${heightVh}vh`,
          }}
        >
          {/* Video background */}
          <video
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 w-full h-full object-cover"
            src="/hero.mp4"
          />
          {/* Dark overlay for text readability */}
          <div className="absolute inset-0 bg-black/40" />
          
          {/* Yellow sun/glow accent */}
          <div
            className="absolute top-16 right-1/4 w-48 h-48 rounded-full opacity-30 blur-3xl"
            style={{ background: "radial-gradient(circle, #F5A623, transparent)" }}
          />
          <div
            className="absolute top-24 left-1/3 w-32 h-32 rounded-full opacity-20 blur-2xl"
            style={{ background: "radial-gradient(circle, #FFD166, transparent)" }}
          />
        </div>
      </div>

      {/* Large watermark text */}
      <div
        className="absolute bottom-0 left-0 right-0 w-full overflow-hidden pointer-events-none z-[5] flex items-end justify-center"
        style={{
          transform: `translateY(${scrollProgress * 150}px)`,
          opacity: 1 - scrollProgress * 0.8,
          height: "100%",
        }}
      >
        <span
          className="block font-bold text-[22vw] sm:text-[20vw] md:text-[18vw] lg:text-[16vw] tracking-tighter select-none text-center leading-none"
          style={{ color: "rgba(255,255,255,0.08)" }}
        >
          BATOMANDU
        </span>
      </div>

      {/* Main content */}
      <div className="max-w-7xl mx-auto w-full relative z-10">
        <div className="text-center mb-6">
          {/* Main headline */}
          <div
            className={`transition-all duration-1000 delay-[400ms] ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"}`}
          >
            <h1 className="text-[2.2rem] sm:text-[3rem] md:text-[3.8rem] lg:text-[4.5rem] xl:text-[5.5rem] font-bold leading-tight mb-3 w-full px-4 max-w-5xl mx-auto text-balance text-white">
              <AnimatedText
                key={t.hero.headline1}
                text={t.hero.headline1}
                delay={0.3}
                className="font-bold text-white leading-tight"
              />
              <br />
              <span style={{ color: "#F5A623" }}>
                <AnimatedText
                  key={t.hero.headline2}
                  text={t.hero.headline2}
                  delay={0.9}
                  className="font-bold leading-tight"
                />
              </span>
            </h1>
          </div>
        </div>

        {/* CTA Buttons */}
        <div
          className={`flex flex-col sm:flex-row gap-4 justify-center items-center mb-16 transition-all duration-700 delay-[1600ms] ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          <button
            className="flex items-center gap-3 px-6 py-3 rounded-full font-semibold text-[#1B2B4B] transition-all duration-300 hover:scale-105 hover:shadow-xl"
            style={{ backgroundColor: "#F5A623" }}
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.7 9.05 7.4c1.4.07 2.38.73 3.2.73.93 0 2.66-.9 4.5-.77 1.47.1 2.82.65 3.8 1.74-3.43 2.12-2.88 6.68.5 7.98-.63 1.73-1.47 3.47-3 4.2zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
            </svg>
            {t.hero.appStore}
          </button>
          <button
            className="flex items-center gap-3 px-6 py-3 rounded-full font-semibold text-white border border-white/30 backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:bg-white/10"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M3 20.5v-17c0-.83 1.01-1.3 1.7-.8l14 8.5c.63.38.63 1.32 0 1.7l-14 8.5c-.69.5-1.7.03-1.7-.8z" />
            </svg>
            {t.hero.googlePlay}
          </button>
        </div>

        {/* Mobile Mockup */}
        <div
          className={`flex justify-center transition-all duration-1000 delay-[1800ms] mt-12 relative z-10 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-24"
          }`}
        >
          <img
            src="/hero-mobile.png"
            alt="BatoMandu App"
            className="max-w-[80%] md:max-w-md w-auto h-auto drop-shadow-2xl"
            style={{ 
              maskImage: "linear-gradient(to bottom, black 85%, transparent 100%)",
              WebkitMaskImage: "linear-gradient(to bottom, black 85%, transparent 100%)"
            }}
          />
        </div>

        {/* Scroll indicator */}
        <div
          className={`flex justify-center transition-all duration-700 delay-[1800ms] ${
            isVisible ? "opacity-100" : "opacity-0"
          }`}
        >
          <ArrowDownCircle
            className="w-8 h-8 animate-bounce"
            style={{ color: "rgba(255,255,255,0.4)" }}
          />
        </div>
      </div>
    </section>
  )
}
