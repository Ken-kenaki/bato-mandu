"use client"
import { useLanguage } from "../context/language-context"
import Image from "next/image"
import { Check, BotMessageSquare } from "lucide-react"
import { motion } from "framer-motion"

export function FeaturesSection() {
  const { t } = useLanguage()

  return (
    <section id="features" className="py-32 px-6 relative overflow-hidden">
      {/* Watermark */}
      <div className="absolute top-0 left-0 right-0 flex justify-center pointer-events-none z-0">
        <span className="font-bold text-center text-[18vw] sm:text-[16vw] md:text-[14vw] lg:text-[12vw] leading-none tracking-tighter text-zinc-100 whitespace-nowrap select-none">
          FEATURES
        </span>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left column - Content & Features */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="mb-8"
            >
              <span
                className="text-[#F5A623] text-sm font-bold uppercase tracking-wider block mb-2"
              >
                {t.features.label}
              </span>
              <h2 className="text-3xl md:text-5xl font-bold mb-4 text-[#1B2B4B]">
                {t.features.title}
              </h2>
              <p className="text-muted-foreground text-lg">
                {t.features.subtitle}
              </p>
            </motion.div>

            <ul className="space-y-3 mb-8">
              {t.features.list.map((feature, i) => (
                <li key={i} className="flex items-center gap-3">
                  <div
                    className="w-5 h-5 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                    style={{ backgroundColor: "#F5A623" }}
                  >
                    ✓
                  </div>
                  <span className="text-sm font-medium text-[#374151]">{feature}</span>
                </li>
              ))}
            </ul>

            {/* Highlight box */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              viewport={{ once: true }}
              className="p-5 rounded-2xl border"
              style={{ backgroundColor: "#FFF8E7", borderColor: "#F5A623" }}
            >
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: "#F5A623" }}>
                  <BotMessageSquare className="w-4 h-4" style={{ color: "#1B2B4B" }} strokeWidth={2} />
                </div>
                <div>
                  <h3 className="text-[#1B2B4B] text-xl font-bold mb-2">
                    {t.features.aiBoxTitle}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {t.features.aiBoxDesc}
                  </p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right column - AI Assistant App Showcase Image */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
            className="flex justify-center"
          >
            <div className="relative w-full max-w-md rounded-3xl overflow-hidden shadow-2xl border border-slate-200 bg-white p-3">
              <Image
                src="/pricings.jpg"
                alt="Kathmandu Public Transport AI Assistant"
                width={700}
                height={700}
                className="w-full h-auto rounded-2xl object-cover transform hover:scale-105 transition-transform duration-500"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
