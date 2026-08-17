"use client"
import { useLanguage } from "../context/language-context"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts"
import { TrendingUp, Bus, Sparkles, Star, IndianRupee } from "lucide-react"
import { ArrowUpRight, ArrowRight } from "lucide-react"

const usageCategories = [
  { name: "Route Searches", icon: Bus, color: "#1B2B4B" },
  { name: "AI Queries", icon: Sparkles, color: "#F5A623" },
  { name: "Fare Checks", icon: IndianRupee, color: "#FFD166" },
  { name: "Saved Routes", icon: Star, color: "#243660" },
]

const staticData = usageCategories.map((cat, i) => ({
  ...cat,
  value: [6200, 4800, 3500, 2900][i],
}))

function generateRandomData() {
  return usageCategories.map((cat) => ({
    ...cat,
    value: Math.floor(Math.random() * 8000) + 2000,
  }))
}

export function CTASection() {
  const { t } = useLanguage()
  const [data, setData] = useState(staticData)
  const [totalUsage, setTotalUsage] = useState(staticData.reduce((s, d) => s + d.value, 0))
  const [growth, setGrowth] = useState(18.4)
  const [activeIndex, setActiveIndex] = useState(0)

  useEffect(() => {
    const total = data.reduce((sum, item) => sum + item.value, 0)
    setTotalUsage(total)
  }, [data])

  useEffect(() => {
    // Only run random updates on the client
    const interval = setInterval(() => {
      setData(generateRandomData())
      setGrowth(Math.round((Math.random() * 20 + 5) * 10) / 10)
    }, 4000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % usageCategories.length)
    }, 2000)
    return () => clearInterval(interval)
  }, [])

  return (
    <section className="py-32 px-6 relative overflow-hidden">
      {/* Watermark */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
        <span className="text-[20vw] font-bold tracking-tighter leading-none text-zinc-100 whitespace-nowrap">
          NAVIGATE
        </span>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-4 text-[#1B2B4B]" style={{ fontFamily: "var(--font-playfair, serif)" }}>
            {t.cta.title}
          </h2>
          <p className="text-muted-foreground text-lg mb-8 max-w-xl mx-auto">
            {t.cta.subtitle}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              className="relative flex items-center justify-center gap-0 rounded-full pl-6 pr-1.5 py-1.5 transition-all duration-300 group overflow-hidden font-semibold"
              style={{ backgroundColor: "#1B2B4B", color: "white" }}
            >
              <span className="text-sm pr-4">Download Free</span>
              <span
                className="w-10 h-10 rounded-full flex items-center justify-center"
                style={{ backgroundColor: "#F5A623" }}
              >
                <ArrowUpRight className="w-4 h-4" style={{ color: "#1B2B4B" }} />
              </span>
            </button>

            <button
              className="relative flex items-center justify-center gap-0 border rounded-full pl-6 pr-1.5 py-1.5 transition-all duration-300 group overflow-hidden"
              style={{ borderColor: "#1B2B4B" }}
            >
              <span
                className="absolute inset-0 rounded-full scale-x-0 origin-right group-hover:scale-x-100 transition-transform duration-300"
                style={{ backgroundColor: "#1B2B4B" }}
              />
              <span
                className="text-sm pr-4 relative z-10 transition-colors duration-300 group-hover:text-white font-medium"
                style={{ color: "#1B2B4B" }}
              >
                Get Pro — Rs. 199/yr
              </span>
              <span className="w-10 h-10 rounded-full flex items-center justify-center relative z-10">
                <ArrowRight
                  className="w-4 h-4 group-hover:opacity-0 absolute transition-opacity duration-300"
                  style={{ color: "#1B2B4B" }}
                />
                <ArrowUpRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-all duration-300 text-white" />
              </span>
            </button>
          </div>
        </div>

        {/* Animated usage chart */}
        <div className="flex justify-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="w-full max-w-md mx-auto rounded-3xl bg-white p-8"
            style={{
              boxShadow:
                "rgba(27, 43, 75, 0.06) 0px 0px 0px 1px, rgba(27, 43, 75, 0.04) 0px 1px 1px -0.5px, rgba(27, 43, 75, 0.06) 0px 6px 6px -3px, rgba(27, 43, 75, 0.06) 0px 24px 24px -12px",
            }}
          >
            <div className="mb-8 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold" style={{ color: "#1B2B4B" }}>
                  App Usage
                </h3>
                <p className="text-sm text-slate-500">This Quarter</p>
              </div>
              <div className="text-right">
                <motion.p
                  key={totalUsage}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-2xl font-bold"
                  style={{ color: "#1B2B4B" }}
                >
                  {totalUsage.toLocaleString()}
                </motion.p>
                <motion.div
                  key={growth}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-center justify-end gap-1"
                >
                  <TrendingUp className="w-3 h-3" style={{ color: "#F5A623" }} />
                  <p className="text-sm font-medium" style={{ color: "#F5A623" }}>
                    +{growth}%
                  </p>
                </motion.div>
              </div>
            </div>

            <div className="h-56 relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={85}
                    paddingAngle={3}
                    dataKey="value"
                    animationDuration={1000}
                  >
                    {data.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={entry.color}
                        opacity={index === activeIndex ? 1 : 0.5}
                        style={{
                          filter:
                            index === activeIndex ? `drop-shadow(0 0 8px ${entry.color})` : "none",
                          transition: "all 0.5s ease",
                        }}
                      />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>

              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeIndex}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.3 }}
                    className="text-center"
                  >
                    {(() => {
                      const Icon = data[activeIndex].icon
                      return <Icon className="w-6 h-6 mx-auto mb-1" style={{ color: data[activeIndex].color }} />
                    })()}
                    <p className="text-xs text-slate-500">{data[activeIndex].name}</p>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>

            <div className="mt-6 space-y-3">
              {data.map((item, index) => {
                const Icon = item.icon
                const percentage = ((item.value / totalUsage) * 100).toFixed(0)
                return (
                  <motion.div
                    key={item.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{
                      opacity: 1,
                      x: 0,
                      scale: index === activeIndex ? 1.02 : 1,
                    }}
                    transition={{ delay: index * 0.1, duration: 0.3 }}
                    className={`flex items-center gap-3 p-2 rounded-xl transition-colors ${
                      index === activeIndex ? "bg-amber-50" : ""
                    }`}
                  >
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: item.color + "20" }}
                    >
                      <Icon className="w-4 h-4" style={{ color: item.color }} />
                    </div>
                    <span className="text-sm text-slate-600 flex-1">{item.name}</span>
                    <div className="text-right">
                      <motion.span
                        key={item.value}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-sm font-semibold block"
                        style={{ color: "#1B2B4B" }}
                      >
                        {item.value.toLocaleString()}
                      </motion.span>
                      <span className="text-xs text-slate-400">{percentage}%</span>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </motion.div>
        </div>

        {/* Stats row */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-16">
          {[
            { value: "50K+", label: "App Users" },
            { value: "200+", label: "Routes Covered" },
            { value: "Rs. 199", label: "Pro Plan / Year" },
          ].map((stat, i) => (
            <div key={i} className="text-center">
              <p className="text-7xl font-light" style={{ color: "#1B2B4B" }}>
                {stat.value}
              </p>
              <p className="text-xs text-muted-foreground uppercase tracking-wider mt-2">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
