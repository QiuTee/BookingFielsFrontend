import { Home, Bell, User, Calendar } from "lucide-react"
export default function BottomNav({ selectedTab, onSelectTab, notificationCount = 5 }) {
  const navItems = [
    {
      id: "home",
      label: "Trang chủ",
      icon: Home,
      gradient: "from-blue-500 to-blue-600",
      activeGradient: "from-blue-600 to-blue-700",
      shadowColor: "shadow-blue-500/25",
    },

    {
      id: "notifications",
      label: "Thông báo",
      icon: Bell,
      gradient: "from-orange-500 to-red-500",
      activeGradient: "from-orange-600 to-red-600",
      shadowColor: "shadow-orange-500/25",
      badge: notificationCount,
    },
    {
      id: "booking",
      label: "Đặt lịch",
      icon: Calendar,
      gradient: "from-purple-500 to-indigo-600",
      activeGradient: "from-purple-600 to-indigo-700",
      shadowColor: "shadow-purple-500/25",
      isSpecial: true,
    },
    {
      id: "account",
      label: "Tài khoản",
      icon: User,
      gradient: "from-gray-500 to-gray-600",
      activeGradient: "from-gray-600 to-gray-700",
      shadowColor: "shadow-gray-500/25",
    },
  ]

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50">
      <div className="absolute inset-0 bg-white/85 backdrop-blur-xl border-t border-gray-200/50 shadow-2xl"></div>

      <div className="absolute inset-0 bg-gradient-to-t from-white/95 via-white/80 to-transparent"></div>

      <div className="relative px-4 py-4 pb-safe">
        <div className="flex items-center justify-around max-w-lg mx-auto">
          {navItems.map((item) => {
            const isActive = selectedTab === item.id
            const IconComponent = item.icon

            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                className={`relative flex flex-col items-center gap-1.5 p-3 rounded-2xl transition-all duration-300 group ${
                  item.isSpecial ? "transform hover:scale-110" : "hover:scale-105"
                } ${isActive ? "scale-105" : ""}`}
              >
                <div
                  className={`relative p-3 rounded-xl transition-all duration-300 ${
                    isActive
                      ? `bg-gradient-to-br ${item.activeGradient} ${item.shadowColor} shadow-lg scale-110`
                      : `bg-gradient-to-br from-gray-100 to-gray-200 group-hover:${item.gradient.replace("from-", "from-").replace("to-", "to-")} group-hover:shadow-md`
                  }`}
                >
                  <IconComponent
                    className={`w-5 h-5 transition-all duration-300 ${
                      isActive ? "text-white" : "text-gray-600 group-hover:text-white"
                    }`}
                  />

                  {item.badge && item.badge > 0 && (
                    <div className="absolute -top-1 -right-1 bg-gradient-to-r from-red-500 to-red-600 text-white text-xs font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center shadow-lg animate-pulse border-2 border-white">
                      {item.badge > 99 ? "99+" : item.badge}
                    </div>
                  )}

                  {item.isSpecial && (
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full animate-ping"></div>
                  )}
                </div>

                <span
                  className={`text-xs font-semibold transition-all duration-300 ${
                    isActive ? "text-gray-900 scale-105" : "text-gray-600 group-hover:text-gray-800"
                  }`}
                >
                  {item.label}
                </span>

                {isActive && (
                  <div className={`w-1 h-1 rounded-full bg-gradient-to-r ${item.gradient} animate-pulse`}></div>
                )}

                <div className="absolute inset-0 rounded-2xl overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-active:translate-x-full transition-transform duration-500"></div>
                </div>
              </button>
            )
          })}
        </div>

        <div className="flex justify-center mt-2">
          <div className="w-12 h-1 bg-gradient-to-r from-gray-300 to-gray-400 rounded-full opacity-50"></div>
        </div>
      </div>
  
      <div className="h-safe-area-inset-bottom bg-white/85 backdrop-blur-xl"></div>
    </div>
  )
}
