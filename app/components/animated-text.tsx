"use client"

import { motion } from "framer-motion"

interface AnimatedTextProps {
  text: string
  delay?: number
  className?: string
}

export function AnimatedText({ text, delay = 0, className = "" }: AnimatedTextProps) {
  const words = text.split(" ")

  return (
    <motion.span
      className={className}
      initial="hidden"
      animate="visible"
      style={{ perspective: 400, display: "inline-block" }}
    >
      {words.map((word, wordIndex) => (
        <motion.span
          key={wordIndex}
          initial={{ opacity: 0, y: 25, filter: "blur(8px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{
            duration: 0.5,
            delay: delay + wordIndex * 0.12,
            ease: [0.25, 0.46, 0.45, 0.94],
          }}
          style={{
            display: "inline-block",
            whiteSpace: "nowrap",
            marginRight: wordIndex < words.length - 1 ? "0.3em" : "0",
          }}
        >
          {word}
        </motion.span>
      ))}
    </motion.span>
  )
}
