"use client"
import { useEffect, useState, useRef } from "react"
import { useLanguage } from "../context/language-context"

function useCountUp(end: number, duration = 2000, suffix = "") {
  const [count, setCount] = useState(0)
  const [hasStarted, setHasStarted] = useState(false)

  useEffect(() => {
    if (!hasStarted) return

    let startTime: number
    let animationFrame: number

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime
      const progress = Math.min((currentTime - startTime) / duration, 1)
      const easeOutQuart = 1 - Math.pow(1 - progress, 4)
      setCount(Math.floor(easeOutQuart * end))

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate)
      }
    }

    animationFrame = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(animationFrame)
  }, [end, duration, hasStarted])

  return { value: count + suffix, start: () => setHasStarted(true), hasStarted }
}

export function StatsSection() {
  const { t } = useLanguage()
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)

  const routes = useCountUp(450, 2000, "+")
  const stops = useCountUp(1200, 2000, "+")
  const users = useCountUp(50, 2000, "k+")

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.1 }
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (isVisible) {
      routes.start()
      stops.start()
      users.start()
    }
  }, [isVisible])

  const stats = [
    { value: routes.value, label: t.stats.routes },
    { value: stops.value, label: t.stats.stops },
    { value: users.value, label: t.stats.users },
  ]

  return (
    <section id="stats-section" className="py-24 px-6 bg-background">
      <div className="max-w-4xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-16">
          {stats.map((stat, i) => (
            <div
              key={i}
              className={`text-center transition-all duration-1000 ${
                i === 0 ? "delay-200" : i === 1 ? "delay-300" : "delay-400"
              } ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
            >
              <p
                className="font-bold mb-2 text-6xl md:text-7xl leading-none"
                style={{ color: "#F5A623" }}
              >
                {stat.value}
              </p>
              <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
