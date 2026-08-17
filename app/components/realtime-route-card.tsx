"use client"

import { BarChart, Bar, XAxis, ResponsiveContainer, Tooltip, Cell } from "recharts"
import { motion, AnimatePresence } from "framer-motion"
import { useState, useEffect } from "react"
import { Search, MapPin } from "lucide-react"

const defaultHourlyData = [
  { hour: "6am", searches: 320 },
  { hour: "7am", searches: 680 },
  { hour: "8am", searches: 920 },
  { hour: "9am", searches: 750 },
  { hour: "10am", searches: 480 },
  { hour: "12pm", searches: 560 },
  { hour: "2pm", searches: 420 },
  { hour: "4pm", searches: 610 },
  { hour: "5pm", searches: 880 },
  { hour: "6pm", searches: 740 },
  { hour: "8pm", searches: 390 },
  { hour: "10pm", searches: 180 },
]

const defaultTrendingRoutes = [
  { route: "Route 23 — Ratnapark → Kalanki", searches: 312 },
  { route: "Route 8 — Koteshwar → Balkhu", searches: 278 },
  { route: "Route 14 — New Bus Park → Patan", searches: 201 },
  { route: "Route 6 — Boudha → Lagankhel", searches: 154 },
]

export function RealtimeRouteCard() {
  const [activeSearches, setActiveSearches] = useState(1247)
  const [totalRoutes, setTotalRoutes] = useState(8340)
  const [hourlyData, setHourlyData] = useState(defaultHourlyData)
  const [trendingRoutes, setTrendingRoutes] = useState(defaultTrendingRoutes)
  const [highlightedBar, setHighlightedBar] = useState(2)

  const maxSearches = Math.max(...hourlyData.map((d) => d.searches))

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveSearches((prev) => prev + Math.floor(Math.random() * 12) - 3)
      setTotalRoutes((prev) => prev + Math.floor(Math.random() * 3))
    }, 2000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      setHighlightedBar((prev) => (prev + 1) % hourlyData.length)
    }, 1500)
    return () => clearInterval(interval)
  }, [hourlyData.length])

  useEffect(() => {
    const interval = setInterval(() => {
      setHourlyData((prev) =>
        prev.map((item) => ({
          ...item,
          searches: Math.max(30, item.searches + Math.floor(Math.random() * 60) - 30),
        })),
      )
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      setTrendingRoutes((prev) =>
        prev.map((item) => ({
          ...item,
          searches: Math.max(50, item.searches + Math.floor(Math.random() * 20) - 10),
        })),
      )
    }, 2500)
    return () => clearInterval(interval)
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      viewport={{ once: true }}
      className="w-full rounded-2xl bg-white p-6"
      style={{
        boxShadow:
          "rgba(27, 43, 75, 0.06) 0px 0px 0px 1px, rgba(27, 43, 75, 0.04) 0px 1px 1px -0.5px, rgba(27, 43, 75, 0.06) 0px 6px 6px -3px, rgba(27, 43, 75, 0.06) 0px 12px 12px -6px, rgba(27, 43, 75, 0.06) 0px 24px 24px -12px",
      }}
    >
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h3 className="text-lg font-semibold" style={{ color: "#1B2B4B" }}>
            Route Activity
          </h3>
          <span className="relative flex h-3 w-3">
            <span
              className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-75"
              style={{ backgroundColor: "#F5A623" }}
            />
            <span
              className="relative inline-flex h-3 w-3 rounded-full"
              style={{ backgroundColor: "#F5A623" }}
            />
          </span>
        </div>
        <span className="text-sm text-slate-500">Live</span>
      </div>

      {/* Metrics */}
      <div className="mb-6 grid grid-cols-2 gap-4">
        <motion.div
          className="rounded-xl p-4"
          style={{ background: "linear-gradient(135deg, #FFF8E7, #FFE4A0)" }}
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <div className="flex items-center gap-2 mb-1">
            <Search className="w-4 h-4 opacity-60" style={{ color: "#1B2B4B" }} />
            <p className="text-sm opacity-80 font-medium" style={{ color: "#1B2B4B" }}>
              Active Searches
            </p>
          </div>
          <AnimatePresence mode="wait">
            <motion.p
              key={activeSearches}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="text-3xl font-bold"
              style={{ color: "#1B2B4B" }}
            >
              {activeSearches.toLocaleString()}
            </motion.p>
          </AnimatePresence>
        </motion.div>

        <motion.div
          className="rounded-xl p-4"
          style={{ background: "linear-gradient(135deg, #EEF2FF, #C7D2FE)" }}
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <div className="flex items-center gap-2 mb-1">
            <MapPin className="w-4 h-4 opacity-60" style={{ color: "#1B2B4B" }} />
            <p className="text-sm opacity-80 font-medium" style={{ color: "#1B2B4B" }}>
              Routes Found
            </p>
          </div>
          <AnimatePresence mode="wait">
            <motion.p
              key={totalRoutes}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="text-3xl font-bold"
              style={{ color: "#1B2B4B" }}
            >
              {totalRoutes.toLocaleString()}
            </motion.p>
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Bar chart */}
      <div className="mb-6">
        <p className="mb-3 text-sm font-medium" style={{ color: "#1B2B4B" }}>
          Searches Today
        </p>
        <div className="h-32">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={hourlyData}>
              <XAxis
                dataKey="hour"
                tick={{ fontSize: 10, fill: "#64748b" }}
                axisLine={false}
                tickLine={false}
                interval={1}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "white",
                  border: "1px solid #e2e8f0",
                  borderRadius: "8px",
                }}
              />
              <Bar dataKey="searches" radius={[4, 4, 0, 0]}>
                {hourlyData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={
                      index === highlightedBar
                        ? "#F5A623"
                        : entry.searches === maxSearches
                        ? "#FFD166"
                        : "#e2e8f0"
                    }
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Trending routes */}
      <div>
        <p className="mb-3 text-sm font-medium" style={{ color: "#1B2B4B" }}>
          Trending Routes
        </p>
        <div className="space-y-2">
          {trendingRoutes.map((route, index) => (
            <motion.div
              key={index}
              className="flex items-center justify-between rounded-lg px-3 py-2"
              style={{ backgroundColor: "#f8fafc" }}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ backgroundColor: "#FFF8E7", x: 4 }}
            >
              <span className="text-sm text-slate-600 truncate mr-2">{route.route}</span>
              <AnimatePresence mode="wait">
                <motion.span
                  key={route.searches}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-sm font-semibold flex-shrink-0"
                  style={{ color: "#F5A623" }}
                >
                  {route.searches}
                </motion.span>
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  )
}
