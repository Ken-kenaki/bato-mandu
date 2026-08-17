"use client"

import { useState, useEffect, useRef } from "react"
import { useLanguage } from "../context/language-context"

function TestimonialCard({ name, role, content }: { name: string; role: string; content: string }) {
  return (
    <div className="flex-shrink-0 w-full sm:w-[400px] rounded-2xl p-6 py-5" style={{ backgroundColor: "#FAFAFA", border: "1px solid #F3F4F6" }}>
      <div className="flex items-start gap-4 mb-4">
        <p className="text-[#374151] leading-relaxed flex-1 text-base">
          &ldquo;{content}&rdquo;
        </p>
      </div>
      <div className="mt-4 flex items-center justify-between">
        <div>
          <p className="font-bold text-sm" style={{ color: "#1B2B4B" }}>{name}</p>
          <p className="text-xs text-muted-foreground">{role}</p>
        </div>
        <div className="flex text-[#F5A623]">
          {[1, 2, 3, 4, 5].map((star) => (
            <svg key={star} className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          ))}
        </div>
      </div>
    </div>
  )
}

export function TestimonialsSection() {
  const { t } = useLanguage()
  const scrollRef1 = useRef<HTMLDivElement>(null)
  const scrollRef2 = useRef<HTMLDivElement>(null)

  const duplicated1 = [...t.testimonials.row1, ...t.testimonials.row1, ...t.testimonials.row1]
  const duplicated2 = [...t.testimonials.row2, ...t.testimonials.row2, ...t.testimonials.row2]

  useEffect(() => {
    const scrollContainer1 = scrollRef1.current
    const scrollContainer2 = scrollRef2.current
    if (!scrollContainer1 || !scrollContainer2) return

    let animationId: number
    let pos1 = 0
    let pos2 = scrollContainer2.scrollWidth / 2

    const animate = () => {
      pos1 += 0.5
      pos2 -= 0.5

      if (pos1 >= scrollContainer1.scrollWidth / 3) {
        pos1 = 0
      }
      if (pos2 <= 0) {
        pos2 = scrollContainer2.scrollWidth / 3
      }

      scrollContainer1.scrollLeft = pos1
      scrollContainer2.scrollLeft = pos2

      animationId = requestAnimationFrame(animate)
    }

    animationId = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(animationId)
  }, [])

  return (
    <section id="testimonials" className="py-32 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-4" style={{ color: "#1B2B4B" }}>
            {t.testimonials.title}
          </h2>
          <p className="text-muted-foreground text-lg">
            {t.testimonials.subtitle}
          </p>
        </div>

        {/* Scroll Track 1 (Left to Right) */}
        <div className="relative mb-6">
          <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />
          
          <div
            ref={scrollRef1}
            className="flex gap-6 overflow-hidden"
            style={{ WebkitMaskImage: "linear-gradient(to right, transparent, black 10%, black 90%, transparent)" }}
          >
            {duplicated1.map((testimonial, i) => (
              <TestimonialCard key={`row1-${i}`} {...testimonial} />
            ))}
          </div>
        </div>

        {/* Scroll Track 2 (Right to Left) */}
        <div className="relative">
          <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />
          
          <div
            ref={scrollRef2}
            className="flex gap-6 overflow-hidden"
            style={{ WebkitMaskImage: "linear-gradient(to right, transparent, black 10%, black 90%, transparent)" }}
          >
            {duplicated2.map((testimonial, i) => (
              <TestimonialCard key={`row2-${i}`} {...testimonial} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
