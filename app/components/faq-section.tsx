"use client"

import { useState } from "react"
import { ChevronDown } from "lucide-react"
import { useLanguage } from "../context/language-context"

function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div
      className="rounded-xl px-6 transition-all duration-200"
      style={{
        border: isOpen ? "1px solid rgba(245,166,35,0.4)" : "1px solid #e5e7eb",
        backgroundColor: isOpen ? "#FFFDF7" : "white",
      }}
    >
      <button
        className="w-full flex items-center justify-between text-left py-5 gap-4"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
      >
        <span className="text-base font-medium text-[#1B2B4B]">
          {question}
        </span>
        <ChevronDown
          className="w-5 h-5 flex-shrink-0 transition-transform duration-300"
          style={{
            color: "#F5A623",
            transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
          }}
        />
      </button>
      <div
        className="overflow-hidden transition-all duration-300"
        style={{ maxHeight: isOpen ? "300px" : "0px" }}
      >
        <p className="text-muted-foreground pb-5 leading-relaxed text-sm">{answer}</p>
      </div>
    </div>
  )
}

export function FAQSection() {
  const { t } = useLanguage()

  return (
    <section id="faq" className="py-32 px-6 pb-48">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-4 text-[#1B2B4B]">
            {t.faq.title}
          </h2>
          <p className="text-muted-foreground text-lg">
            {t.faq.subtitle}
          </p>
        </div>

        <div className="space-y-3">
          {t.faq.items.map((item, index) => (
            <FAQItem key={index} question={item.question} answer={item.answer} />
          ))}
        </div>
      </div>
    </section>
  )
}
