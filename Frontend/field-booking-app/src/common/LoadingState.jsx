
import { useState, useEffect } from "react"
import { motion } from "framer-motion"

export default function LoadingState() {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prevProgress) => {
        if (prevProgress >= 100) {
          clearInterval(timer)
          return 100
        }
        return prevProgress + 5
      })
    }, 200)

    return () => {
      clearInterval(timer)
    }
  }, [])

  return (
    <div className="flex flex-col items-center justify-center min-h-[2px] p-8">
      <div className="relative w-12 h-12 mb-6">
        <motion.div
          className="absolute inset-0 rounded-full border-4 border-blue-100"
          initial={{ opacity: 0.5 }}
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
        />

        <motion.div
          className="absolute inset-0 rounded-full border-4 border-t-blue-500 border-r-blue-400 border-b-blue-300 border-l-transparent"
          animate={{ rotate: 360 }}
          transition={{ duration: 1.2, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
        />

        <motion.div
          className="absolute inset-4 rounded-full bg-blue-50"
          animate={{ scale: [0.8, 1, 0.8] }}
          transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
        />
      </div>
    </div>
  )
}
