"use client"
import { useLanguage } from "../context/language-context"

import { Check, Crown, Gift, Info, BanIcon, BotMessageSquare, Map, Timer, BadgeIndianRupee, Sparkles } from "lucide-react"
import { motion } from "framer-motion"

const freePlanFeatures = [
  { text: "Access to all public transport routes", included: true },
  { text: "Bus/tempo/micro stops & route information", included: true },
  { text: "Fare information", included: true },
  { text: "Route finder", included: true },
  { text: "Find routes with transfers", included: true },
  { text: "Save favorite routes", included: true },
  { text: "Save favorite stops", included: true },
  { text: "Service/route updates", included: true },
  { text: "Basic AI assistance (limited questions)", included: true },
  { text: "Ads supported", included: false, note: "Contains ads" },
]

const proPlanFeatures = [
  { text: "Ad-free experience", included: true },
  { text: "AI Travel Assistant (Unlimited)", included: true },
  { text: "AI Route Summary", sub: "Get a simple explanation of your journey", included: true },
  { text: "AI Q&A Sessions", sub: "Ask anything about routes, stops, transfers, fares", included: true },
  { text: "Smart Route Recommendations", sub: "Best and fastest route suggestions", included: true },
  { text: "Compare Multiple Routes", sub: "Time, fare & transfer comparison", included: true },
  { text: "Estimated Journey Time", included: true },
  { text: "Step-by-step Travel Instructions", sub: "Detailed guide for your entire journey", included: true },
  { text: "Unlimited Favorite Routes & Stops", included: true },
  { text: "Personalized Route Alerts", sub: "Get notified about updates & changes", included: true },
  { text: "Travel History & Insights", sub: "Track your journeys and insights", included: true },
  { text: "Priority Access to New AI Features", sub: "Be the first to try new smart features", included: true },
]

const bothPlanPerks = [
  "Reliable & Up-to-date Info",
  "Made for Kathmandu",
  "Safe & Secure",
  "Lightweight & Easy to Use",
  "Regular Updates & Improvements",
]

export function PricingSection() {
  const { t } = useLanguage()

  return (
    <section id="pricing" className="py-32 px-6 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute top-0 left-1/4 w-96 h-96 rounded-full opacity-5 blur-3xl"
          style={{ backgroundColor: "#F5A623" }}
        />
        <div
          className="absolute bottom-0 right-1/4 w-96 h-96 rounded-full opacity-5 blur-3xl"
          style={{ backgroundColor: "#1B2B4B" }}
        />
      </div>

      <div className="max-w-5xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <span
            className="text-[#F5A623] text-sm font-bold uppercase tracking-wider block mb-2"
          >
            {t.pricing.badge}
          </span>
          <h2 className="text-3xl md:text-5xl font-bold mb-4 text-[#1B2B4B]">
            {t.pricing.title}
          </h2>
          <p className="text-muted-foreground text-lg">
            {t.pricing.subtitle}
          </p>
        </div>

        {/* Plans grid */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* Free Plan */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="relative rounded-3xl p-8 border-2"
            style={{ borderColor: "#e5e7eb", backgroundColor: "white" }}
          >
            <div className="flex items-start gap-4 mb-6">
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: "#f1f5f9" }}
              >
                <Gift className="w-7 h-7" style={{ color: "#1B2B4B" }} />
              </div>
              <div>
                <h3 className="text-2xl font-bold" style={{ color: "#1B2B4B" }}>
                  Free Plan
                </h3>
                <p className="text-4xl font-bold mt-1" style={{ color: "#1B2B4B" }}>
                  Rs. 0
                </p>
                <p className="text-sm text-muted-foreground">For everyday Kathmandu travel.</p>
              </div>
            </div>

            <div
              className="text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded-full inline-block mb-6"
              style={{ backgroundColor: "#EEF2FF", color: "#1B2B4B" }}
            >
              What&apos;s Included
            </div>

            <ul className="space-y-3 mb-8">
              {freePlanFeatures.map((feature, i) => (
                <li key={i} className="flex items-start gap-3">
                  {feature.included ? (
                    <div
                      className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                      style={{ backgroundColor: "#22c55e" }}
                    >
                      <Check className="w-3 h-3 text-white" strokeWidth={3} />
                    </div>
                  ) : (
                    <div
                      className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                      style={{ backgroundColor: "#3b82f6" }}
                    >
                      <Check className="w-3 h-3 text-white" strokeWidth={3} />
                    </div>
                  )}
                  <span className="text-sm" style={{ color: "#374151" }}>
                    {feature.text}
                    {feature.note && (
                      <span className="text-xs text-muted-foreground ml-1">({feature.note})</span>
                    )}
                  </span>
                </li>
              ))}
            </ul>

              <div className="flex items-start gap-3 p-4 rounded-xl text-sm" style={{ backgroundColor: "#EEF2FF" }}>
              <Info className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
              <span className="text-blue-800">
                Perfect for basic route, fare and stop information with occasional help.
              </span>
            </div>

            <button
              className="w-full mt-6 py-3 rounded-2xl font-semibold text-sm border-2 transition-all duration-300 hover:opacity-80"
              style={{ borderColor: "#1B2B4B", color: "#1B2B4B" }}
            >
              Get Started Free
            </button>
          </motion.div>

          {/* Pro Plan */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            viewport={{ once: true }}
            className="relative rounded-3xl p-8 border-2"
            style={{ borderColor: "#F5A623", backgroundColor: "white" }}
          >
            {/* Best Value badge */}
            <div
              className="absolute -top-4 right-8 px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider"
              style={{ backgroundColor: "#dc2626", color: "white" }}
            >
              Best Value
            </div>

            <div className="flex items-start gap-4 mb-6">
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: "#FFF8E7" }}
              >
                <Crown className="w-7 h-7" style={{ color: "#F5A623" }} />
              </div>
              <div>
                <h3 className="text-2xl font-bold" style={{ color: "#1B2B4B" }}>
                  Pro Plan
                </h3>
                <div className="flex items-baseline gap-2 mt-1">
                  <p className="text-4xl font-bold" style={{ color: "#F5A623" }}>
                    Rs. 199
                  </p>
                  <span className="text-lg text-muted-foreground font-medium">/ year</span>
                </div>
                <p className="text-sm text-muted-foreground">Just Rs. 16.58 / month</p>
              </div>
            </div>

            <div
              className="text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded-full inline-block mb-6"
              style={{ backgroundColor: "#FFF8E7", color: "#E08C00" }}
            >
              Everything in Free, PLUS premium features
            </div>

            <ul className="space-y-3 mb-8">
              {proPlanFeatures.map((feature, i) => (
                <li key={i} className="flex items-start gap-3">
                  <div
                    className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                    style={{ backgroundColor: "#22c55e" }}
                  >
                    <Check className="w-3 h-3 text-white" strokeWidth={3} />
                  </div>
                  <span className="text-sm" style={{ color: "#374151" }}>
                    <span className="font-medium">{feature.text}</span>
                    {feature.sub && (
                      <span className="block text-xs text-muted-foreground">{feature.sub}</span>
                    )}
                  </span>
                </li>
              ))}
            </ul>

            <button
              className="w-full mt-2 py-3 rounded-2xl font-bold text-sm transition-all duration-300 hover:opacity-90 hover:shadow-lg"
              style={{ backgroundColor: "#F5A623", color: "#1B2B4B" }}
            >
              Upgrade to Pro — Rs. 199/year
            </button>
            <p className="text-center text-xs text-muted-foreground mt-3">
              You can upgrade, downgrade or cancel anytime
            </p>
          </motion.div>
        </div>

        {/* Both Plans Include */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
          className="rounded-2xl p-8"
          style={{ backgroundColor: "#f8fafc", border: "1px solid #e5e7eb" }}
        >
          <div className="text-center mb-6">
            <div
              className="inline-block px-5 py-1.5 rounded-full text-sm font-semibold"
              style={{ backgroundColor: "#1B2B4B", color: "white" }}
            >
              Both plans include
            </div>
          </div>
          <div className="flex flex-wrap justify-center gap-6">
            {bothPlanPerks.map((perk, i) => (
              <div key={i} className="flex items-center gap-2 text-sm font-medium" style={{ color: "#374151" }}>
                <div
                  className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: "#22c55e" }}
                >
                  <Check className="w-3 h-3 text-white" strokeWidth={3} />
                </div>
                {perk}
              </div>
            ))}
          </div>
        </motion.div>

        {/* Bottom upgrade banner with Light Background and Subtle Geometric Pattern */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="mt-12 rounded-3xl p-8 relative overflow-hidden shadow-lg border-2 border-[#F5A623]/30"
          style={{
            background: "linear-gradient(135deg, #FFFDF7 0%, #FFF8E7 50%, #FEF3C7 100%)",
          }}
        >
          {/* Light Geometric Pattern Overlay */}
          <div className="absolute inset-0 opacity-40 pointer-events-none">
            <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="light-geometric-pattern" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M0 20 L20 0 L40 20 L20 40 Z" fill="none" stroke="#F5A623" strokeWidth="0.8" opacity="0.35" />
                  <circle cx="20" cy="20" r="2.5" fill="#F5A623" opacity="0.4" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#light-geometric-pattern)" />
            </svg>
          </div>

          {/* Soft Light Ambient Glows */}
          <div
            className="absolute -top-20 -right-20 w-64 h-64 rounded-full opacity-20 blur-3xl pointer-events-none"
            style={{ background: "#F5A623" }}
          />
          <div
            className="absolute -bottom-20 -left-20 w-64 h-64 rounded-full opacity-25 blur-3xl pointer-events-none"
            style={{ background: "#FFD166" }}
          />

          <div className="relative z-10">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-8 mb-8">
              <div className="flex items-center gap-4">
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-md border border-[#F5A623]/30 bg-white"
                >
                  <BadgeIndianRupee className="w-7 h-7 text-[#F5A623]" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-[#1B2B4B] flex items-center gap-2">
                    Upgrade to बाटो Mandu Pro
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#F5A623] text-[#1B2B4B]">
                      PRO
                    </span>
                  </h3>
                  <div className="flex items-baseline gap-2 mt-1">
                    <p className="text-3xl font-extrabold text-[#1B2B4B]">
                      Rs. 199 <span className="text-sm font-semibold text-[#4B5563]">/ year</span>
                    </p>
                  </div>
                  <p className="text-xs font-semibold text-[#4B5563] mt-0.5">Just Rs. 16.58 / month</p>
                </div>
              </div>

              {/* Feature pills in light glass style */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full lg:w-auto">
                {[
                  { Icon: BanIcon, label: "No Ads" },
                  { Icon: BotMessageSquare, label: "AI-Powered Travel" },
                  { Icon: Map, label: "Smarter Routes" },
                  { Icon: Timer, label: "Save Time & Travel Better" },
                ].map((item, i) => (
                  <div
                    key={i}
                    className="flex flex-col items-center justify-center p-3 rounded-2xl border border-[#F5A623]/30 bg-white/80 backdrop-blur-md hover:bg-white transition-all duration-300 text-center shadow-sm"
                  >
                    <div
                      className="w-8 h-8 rounded-xl flex items-center justify-center mb-1.5 bg-[#FFF8E7]"
                    >
                      <item.Icon className="w-4 h-4 text-[#F5A623]" />
                    </div>
                    <p className="text-xs font-bold text-[#1B2B4B] leading-tight">{item.label}</p>
                  </div>
                ))}
              </div>
            </div>

            <button
              className="w-full py-4 rounded-2xl font-bold text-base transition-all duration-300 hover:scale-[1.01] hover:shadow-xl flex items-center justify-center gap-2 shadow-md border border-[#F5A623]/40"
              style={{
                background: "linear-gradient(135deg, #F5A623 0%, #E08C00 100%)",
                color: "#1B2B4B",
              }}
            >
              <Sparkles className="w-5 h-5 text-[#1B2B4B]" />
              एक चोटी Upgrade, सारा वर्ष सुविधा!
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
