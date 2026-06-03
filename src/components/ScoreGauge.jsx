"use client";

import { motion } from "framer-motion";

// Circular progress dial for the verdict score (0-100).
export default function ScoreGauge({
  score,
  size = 116,
  stroke = 12,
  progressColor = "#ffffff",
  trackColor = "rgba(255,255,255,0.3)",
  textColor = "#ffffff",
}) {
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const clamped = Math.max(0, Math.min(100, score));
  const offset = circumference * (1 - clamped / 100);

  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={trackColor}
          strokeWidth={stroke}
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={progressColor}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={false}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        />
      </svg>
      <div
        className="absolute inset-0 flex flex-col items-center justify-center"
        style={{ color: textColor }}
      >
        <span className="font-display text-3xl font-bold leading-none">{clamped}</span>
        <span className="text-xs font-semibold opacity-70">/ 100</span>
      </div>
    </div>
  );
}
