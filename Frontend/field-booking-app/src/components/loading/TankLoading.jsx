
import { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"

export default function TankLoading({ duration = 3000 }) {
  const [progress, setProgress] = useState(0)

  const trackWidth = 448 
  const tankWidth = 120  

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          return 100
        }
        return prev + 2
      })
    }, duration / 200)

    return () => clearInterval(interval)
  }, [duration])

  return (
    <div className="relative h-screen w-full flex flex-col items-center justify-center bg-gradient-to-b from-black to-[#1a1a1a] overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-[#8B0000] to-[#B22222] opacity-80">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <motion.div
            initial={{ scale: 0.8, opacity: 0.5 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1.5, repeat: Infinity, repeatType: "reverse" }}
          >
            <svg width="200" height="200" viewBox="0 0 200 200">
              <motion.path
                d="M100 10L123.5 83.5H200L138.5 128.5L162 200L100 155L38 200L61.5 128.5L0 83.5H76.5L100 10Z"
                fill="#FFD700"
              />
            </svg>
          </motion.div>
        </div>
      </div>

      <div className="relative w-full max-w-md h-20 mt-6">
        <motion.div
          className="absolute bottom-6 left-0"
          initial={{ x: 0 }}
          animate={{ x: (progress / 100) * (trackWidth - tankWidth) }}
          transition={{ duration: 0.3 }}
        >
          <svg width="120" height="80" viewBox="0 0 120 80" className="drop-shadow-lg">
            <rect x="15" y="40" width="90" height="25" rx="5" fill="#FFFFFF" stroke="#333333" strokeWidth="1" />
            <rect x="40" y="25" width="40" height="15" rx="3" fill="#FFFFFF" stroke="#333333" strokeWidth="1" />
            <rect x="80" y="32" width="40" height="5" rx="2" fill="#FFFFFF" stroke="#333333" strokeWidth="1" />
            <text x="55" y="55" fontSize="12" fontWeight="bold" fill="#8B0000">390</text>
            <circle cx="25" cy="65" r="10" fill="#333333" />
            <circle cx="45" cy="65" r="10" fill="#333333" />
            <circle cx="65" cy="65" r="10" fill="#333333" />
            <circle cx="85" cy="65" r="10" fill="#333333" />
            <circle cx="105" cy="65" r="10" fill="#333333" />
            <path d="M15 65 H105" stroke="#555555" strokeWidth="2" strokeDasharray="4 4" />
          </svg>
        </motion.div>

        <div className="absolute bottom-0 w-full h-2 bg-gray-700 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-[#FFD700]"
            initial={{ width: "0%" }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      <motion.p
        className="mt-4 text-white font-medium"
        initial={{ opacity: 0.5 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, repeat: Infinity, repeatType: "reverse" }}
      >
        {progress < 100 ? `Loading... ${progress}%` : "Complete!"}
      </motion.p>

      <div className="absolute bottom-8 text-center text-white/80">
        <p className="text-lg font-semibold">30/04/1975 - 30/04/2025</p>
        <p className="text-sm">50 Năm Thống Nhất</p>
      </div>
    </div>
  )
}
