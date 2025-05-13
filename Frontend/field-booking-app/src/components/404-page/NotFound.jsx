
import { motion } from "framer-motion"
import { Home } from "lucide-react"
import { Link } from "react-router-dom"
import { useEffect, useState } from "react"

export default function NotFound() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-white p-4 text-center">
      <div className="max-w-md">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <motion.h1
            className="mb-2 text-9xl font-extrabold tracking-tight text-blue-600"
            initial={{ scale: 0.5 }}
            animate={{ scale: 1 }}
            transition={{
              type: "spring",
              stiffness: 260,
              damping: 20,
              delay: 0.2,
            }}
          >
            404
          </motion.h1>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5, duration: 0.5 }}>
            <h2 className="mb-3 text-2xl font-bold tracking-tight text-gray-900">Trang không tìm thấy</h2>
            <p className="mb-8 text-gray-600">Xin lỗi, trang bạn đang tìm kiếm không tồn tại hoặc đã bị di chuyển.</p>
          </motion.div>
        </motion.div>

        <motion.div
          className="relative mb-10 h-40 w-full"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.5 }}
        >
          {/* Animated elements */}
          <motion.div
            className="absolute left-1/2 top-1/2 h-4 w-4 rounded-full bg-blue-500"
            animate={{
              scale: [1, 1.5, 1],
              opacity: [1, 0.5, 1],
              x: [-50, -100, 0, 100, -50],
              y: [-50, 20, -80, 20, -50],
            }}
            transition={{
              duration: 5,
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "loop",
            }}
          />
          <motion.div
            className="absolute left-1/2 top-1/2 h-6 w-6 rounded-full bg-blue-300"
            animate={{
              scale: [1, 1.8, 1],
              opacity: [1, 0.6, 1],
              x: [-50, 80, -80, 80, -50],
              y: [-50, -80, 20, -80, -50],
            }}
            transition={{
              duration: 6,
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "loop",
              delay: 0.2,
            }}
          />
          <motion.div
            className="absolute left-1/2 top-1/2 h-5 w-5 rounded-full bg-blue-700"
            animate={{
              scale: [1, 1.6, 1],
              opacity: [1, 0.7, 1],
              x: [-50, 50, 100, -100, -50],
              y: [-50, 100, -50, -50, -50],
            }}
            transition={{
              duration: 7,
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "loop",
              delay: 0.5,
            }}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.5 }}
        >
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-blue-600 px-6 py-3 text-sm font-medium text-white shadow transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-blue-400"
          >
            <Home className="mr-2 h-4 w-4" />
            Quay về trang chủ
          </Link>
        </motion.div>
      </div>
    </div>
  )
}
