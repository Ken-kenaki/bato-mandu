"use client"
import { useLanguage } from "../context/language-context"
import Image from "next/image"

import type { ElementType } from "react"
import { Bus, IndianRupee, Sparkles } from "lucide-react"
import { useState, useEffect, useRef } from "react"

const services = [
  {
    icon: Bus,
    title: "Route Finder",
    description:
      "Find the best bus routes across Kathmandu instantly. Search by source and destination to get the fastest path.",
  },
  {
    icon: IndianRupee,
    title: "Fare Information",
    description:
      "Know exactly how much your journey costs before you board. Transparent fares for all routes and vehicle types.",
  },
  {
    icon: Sparkles,
    title: "AI Travel Assistant",
    description:
      "Ask anything about routes, stops, transfers, and fares. Our AI gives you smart, personalized travel guidance.",
  },
]

function AnimatedIcon({ Icon, delay = 0 }: { Icon: ElementType; delay?: number }) {
  const [isVisible, setIsVisible] = useState(false)
  const iconRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true)
      },
      { threshold: 0.3 },
    )
    if (iconRef.current) observer.observe(iconRef.current)
    return () => observer.disconnect()
  }, [])

  return (
    <div ref={iconRef} className="relative">
      <div
        className="w-20 h-20 rounded-2xl flex items-center justify-center transition-all duration-500"
        style={{
          background: isVisible
            ? "linear-gradient(135deg, #1B2B4B, #243660)"
            : "linear-gradient(135deg, #e5e7eb, #f3f4f6)",
          transform: isVisible ? "scale(1)" : "scale(0.8)",
          transitionDelay: `${delay}s`,
        }}
      >
        <Icon
          className="w-9 h-9 transition-all duration-500"
          style={{ color: isVisible ? "#F5A623" : "#9ca3af", transitionDelay: `${delay + 0.1}s` }}
          strokeWidth={1.5}
        />
      </div>
    </div>
  )
}

export function ServicesSection() {
  const { t } = useLanguage()
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true)
      },
      { threshold: 0.2 },
    )
    if (sectionRef.current) observer.observe(sectionRef.current)
    return () => observer.disconnect()
  }, [])

  return (
    <section id="how-it-works" className="py-32 px-6 pb-24 relative overflow-hidden">
      {/* Watermark */}
      <div className="absolute top-0 left-0 right-0 flex justify-center pointer-events-none z-0">
        <span className="font-bold text-center text-[18vw] sm:text-[16vw] md:text-[14vw] lg:text-[12vw] leading-none tracking-tighter text-zinc-100 whitespace-nowrap select-none">
          MISSION
        </span>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Mission card */}
        <div
          ref={sectionRef}
          className="relative px-6 lg:px-12 py-16 lg:py-20 mb-32 overflow-hidden rounded-3xl"
          style={{ background: "linear-gradient(135deg, #0d1b2e 0%, #1B2B4B 50%, #243660 100%)" }}
        >
          {/* Decorative elements */}
          <div
            className="absolute top-0 right-0 w-96 h-96 rounded-full opacity-10 blur-3xl"
            style={{ background: "radial-gradient(circle, #F5A623, transparent)" }}
          />
          <div
            className="absolute bottom-0 left-1/4 w-64 h-64 rounded-full opacity-10 blur-3xl"
            style={{ background: "radial-gradient(circle, #FFD166, transparent)" }}
          />

          {/* Bus route decorative lines */}
          <div className="absolute inset-0 opacity-5 overflow-hidden">
            <svg viewBox="0 0 800 400" className="w-full h-full" fill="none" stroke="white" strokeWidth="1">
              <path d="M0 200 Q200 100 400 200 T800 200" strokeDasharray="8 4" />
              <path d="M0 250 Q200 150 400 250 T800 250" strokeDasharray="8 4" />
              <path d="M0 150 Q200 50 400 150 T800 150" strokeDasharray="8 4" />
            </svg>
          </div>

          <div className="relative z-10 grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div className="order-1 lg:order-2">
              <span
                className="inline-block text-xs font-semibold uppercase tracking-wider px-3 py-1 rounded-full mb-3"
                style={{ backgroundColor: "#1B2B4B", color: "white" }}
              >
                {t.services.missionLabel}
              </span>
              <h2
                className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 text-[#1B2B4B]"
                style={{ fontFamily: "var(--font-playfair, serif)", color: "white" }}
              >
                {t.services.missionTitle}
              </h2>
              <div className="space-y-6 text-white/80 leading-relaxed">
                <p>
                  {t.services.missionP1}
                </p>
                <p>
                  {t.services.missionP2}
                </p>
              </div>
              <div className="mt-10 flex gap-4">
                <div
                  className="px-5 py-2 rounded-full text-sm font-semibold"
                  style={{ backgroundColor: "#F5A623", color: "#1B2B4B" }}
                >
                  Free to Use
                </div>
                <div className="px-5 py-2 rounded-full text-sm font-medium text-white/80 border border-white/20">
                  Made for Kathmandu
                </div>
              </div>
            </div>

            {/* App Mockup Image on left */}
            <div className="order-2 lg:order-1 flex justify-center">
              <div className="relative w-full max-w-sm rounded-3xl overflow-hidden shadow-2xl border border-white/20">
                <Image
                  src="/services.jpg"
                  alt="BatoMandu App Mockup"
                  width={600}
                  height={600}
                  className="w-full h-auto object-cover transform hover:scale-105 transition-transform duration-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Services grid */}
        <div className="text-center mb-20">
          <h2
            className="text-4xl md:text-5xl font-bold mb-6 text-balance"
            style={{ fontFamily: "var(--font-playfair, serif)", color: "#1B2B4B" }}
          >
            Everything you need
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            A complete platform to navigate Kathmandu's public transport — whether you're a daily commuter or a first-time traveller.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div
              key={index}
              className="group p-8 rounded-3xl hover:shadow-lg transition-all duration-300 text-center border border-transparent hover:border-zinc-100"
              style={{ backgroundColor: "transparent" }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#FFF8E7"
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "transparent"
              }}
            >
              <div className="mb-6 flex justify-center">
                <AnimatedIcon Icon={service.icon} delay={index * 0.2} />
              </div>
              <h3 className="text-xl font-bold mb-3" style={{ color: "#1B2B4B" }}>
                {service.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed text-sm">{service.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
