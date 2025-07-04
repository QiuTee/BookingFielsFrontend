import { useState, useEffect } from "react"
import {
  Calendar,
  MapPin,
  Clock,
  Search,
  Filter,
  LogOut,
  User,
  ChevronRight,
  Activity,
  TrendingUp,
  AlertCircle,
  Tag,
  Plus,
  Star,
  Users,
  DollarSign,
  Settings,
  Eye,
  Zap,
} from "lucide-react"
import AddCourtForm from "./AddCourtForm"
import { useAuth } from "../../context/AuthContext"
import { getField, getBookingToday } from "../../api/submission"
import { useNavigate } from "react-router-dom"
import CourtSettingsModal from "./CourtSettingModel"
export default function CourtSelection() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedFilter, setSelectedFilter] = useState("all")
  const { logout, user, isAuthenticated, loading } = useAuth()
  const [courts, setCourts] = useState([])
  const [showAddForm , setShowAddForm] = useState(false)
  const [showSettingsModal , setShowSettingsModal] = useState(false)
  const [selectedCourt , setSelectedCourt] = useState(null)
  const [totalBookings, setTotalBookings] = useState({ totalBooking: 45 })
  const navigate = useNavigate()

  useEffect(() => {
    if (!isAuthenticated && !loading) {
      navigate("/login-owner", { replace: true })
      return
    }
    const fetchField = async () => {
      try {
        console.log(user)
        const [fields, todayBookings] = await Promise.all([getField(), getBookingToday()])
        setTotalBookings(todayBookings)
        const enrichedField = fields.map((field) => {
          const findEachFieldById = todayBookings?.bookingTodayByField?.find((booking) => field.id === booking.fieldId)
          return {
            ...field,
            totalBookingCount: findEachFieldById?.bookingCount || 0,
          }
        })
        console.log(enrichedField)
        setCourts(enrichedField)
      } catch (error) {
        console.log("Không thể lấy được sân", error)
      }
    }
    fetchField()
    const interval = setInterval(fetchField, 60000)
    return () => clearInterval(interval)
  }, [isAuthenticated, loading])

  if (showAddForm) return <AddCourtForm  onCancel={() => setShowAddForm(false)}/> 

  const filteredCourts = courts.filter((court) => {
    const matchesSearch =
      court.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      court.location.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = selectedFilter === "all" || court.type.toLowerCase() === selectedFilter.toLowerCase()
    return matchesSearch && matchesFilter
  })

  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "bg-emerald-100 text-emerald-700 border-emerald-200"
      case "maintenance":
        return "bg-amber-100 text-amber-700 border-amber-200"
      case "closed":
        return "bg-red-100 text-red-700 border-red-200"
      default:
        return "bg-gray-100 text-gray-700 border-gray-200"
    }
  }

  const getStatusText = (status) => {
    switch (status) {
      case "active":
        return "Hoạt động"
      case "maintenance":
        return "Bảo trì"
      case "closed":
        return "Đóng cửa"
      default:
        return "Không xác định"
    }
  }

  const handleCourtSelect = (slug) => {
    navigate(`/san/${slug}/owner`)
  }
  const handleSettingsClick = (court) => {
    setSelectedCourt(court)
    setShowSettingsModal(true)
  }

  const handleSaveSettings = (updatedData) => {
    setCourts((prev) => prev.map((court) => (court.id === selectedCourt.id ? {...court , ...updatedData} : court)))
    setShowSettingsModal(false)
    setSelectedCourt(null)
    console.log("Settings saved:" , updatedData)
  }
  const activeCourts = courts.filter((court) => court.status === "active").length
  const totalRevenue = courts.reduce((sum, court) => sum + (court.totalRevenue || 0), 0)

  return ( 
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <header className="bg-white/80 backdrop-blur-md shadow-sm border-b border-white/20 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <Calendar className="w-6 h-6 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white"></div>
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  CourtManager Pro
                </h1>
                <p className="text-sm text-slate-600 font-medium">Quản lý sân thể thao chuyên nghiệp</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3 bg-white/60 backdrop-blur-sm rounded-full px-4 py-2 border border-white/40">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-white" />
                </div>
                {user?.name && <span className="text-sm font-semibold text-slate-700">{user.name}</span>}
              </div>

              <button
                className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-all duration-200"
                onClick={logout}
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
            <div>
              <h2 className="text-4xl font-bold text-slate-900 mb-3">Chào mừng trở lại! 👋</h2>
              <p className="text-lg text-slate-600 max-w-2xl">
                Quản lý tất cả các sân thể thao của bạn một cách hiệu quả và chuyên nghiệp
              </p>
            </div>

            <button 
            onClick={() => setShowAddForm(true)}
            className="mt-4 lg:mt-0 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2 group">
              <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
              Thêm sân mới
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard
              icon={<Activity className="w-6 h-6" />}
              label="Tổng số sân"
              value={courts.length}
              bg="blue"
              trend="+2 sân mới"
              trendUp={true}
            />
            <StatCard
              icon={<Zap className="w-6 h-6" />}
              label="Sân hoạt động"
              value={activeCourts}
              bg="emerald"
              trend="100% uptime"
              trendUp={true}
            />
            <StatCard
              icon={<Calendar className="w-6 h-6" />}
              label="Booking hôm nay"
              value={totalBookings.totalBooking}
              bg="purple"
              trend="+12% so với hôm qua"
              trendUp={true}
            />
            <StatCard
              icon={<DollarSign className="w-6 h-6" />}
              label="Doanh thu hôm nay"
              value={`${(totalRevenue / 1000000).toFixed(1)}M`}
              bg="orange"
              trend="+8.5% so với hôm qua"
              trendUp={true}
            />
          </div>
        </div>

        <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-white/40 shadow-lg mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Tìm kiếm sân theo tên hoặc địa chỉ..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-white/80 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-slate-700 placeholder-slate-400"
              />
            </div>

            <div className="relative lg:w-64">
              <Filter className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
              <select
                value={selectedFilter}
                onChange={(e) => setSelectedFilter(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-white/80 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-slate-700 appearance-none cursor-pointer"
              >
                <option value="all">Tất cả loại sân</option>
                <option value="tennis">Tennis</option>
                <option value="badminton">Cầu lông</option>
                <option value="football">Bóng đá</option>
                <option value="basketball">Bóng rổ</option>
                <option value="pickleball">Pickleball</option>
              </select>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
          {filteredCourts.map((court) => (
            <div
              key={court.id}
              className="group bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/40 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 overflow-hidden"
            >
              <div className="relative overflow-hidden">
                <img
                  src={court.heroImage || "/placeholder.svg"}
                  alt={court.name}
                  className="w-full h-56 object-cover group-hover:scale-110 transition-transform duration-700"
                />

                <div className="absolute top-4 right-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold border backdrop-blur-sm ${getStatusColor(court.status)}`}
                  >
                    {getStatusText(court.status)}
                  </span>
                </div>

                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 flex items-center gap-1">
                  <Star className="w-4 h-4 text-yellow-500 fill-current" />
                  <span className="text-sm font-semibold text-slate-700">{court.rating}</span>
                </div>

                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>

              <div className="p-6">
                <div className="mb-4">
                  <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors">
                    {court.name}
                  </h3>
                  <div className="flex items-center text-slate-600 mb-3">
                    <MapPin className="w-4 h-4 mr-2 text-slate-400" />
                    <span className="text-sm line-clamp-1">{court.location}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <InfoCard
                    icon={<Calendar className="w-4 h-4" />}
                    label="Booking hôm nay"
                    value={`${court.totalBookingCount}`}
                    color="blue"
                  />
                  <InfoCard
                    icon={<Users className="w-4 h-4" />}
                    label="Số sân con"
                    value={`${court.subFields.length}`}
                    color="emerald"
                  />
                  <InfoCard icon={<Tag className="w-4 h-4" />} label="Loại sân" value={court.type} color="purple" />
                  <InfoCard
                    icon={<Clock className="w-4 h-4" />}
                    label="Giờ mở cửa"
                    value={`${court.opentime}-${court.closetime}`}
                    color="orange"
                  />
                </div>

                {court.totalRevenue > 0 && (
                  <div className="bg-gradient-to-r from-emerald-50 to-blue-50 rounded-xl p-3 mb-4 border border-emerald-100">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-slate-600">Doanh thu hôm nay</span>
                      <span className="text-lg font-bold text-emerald-600">
                        {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(
                          court.totalRevenue,
                        )}
                      </span>
                    </div>
                  </div>
                )}

                <div className="flex gap-3">
                  <button
                    onClick={() => handleCourtSelect(court.slug)}
                    disabled={court.status !== "active"}
                    className={`flex-1 flex items-center justify-center px-4 py-3 rounded-xl font-semibold transition-all duration-300 ${
                      court.status === "active"
                        ? "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105"
                        : "bg-slate-100 text-slate-400 cursor-not-allowed"
                    }`}
                  >
                    {court.status === "active" ? (
                      <>
                        <Eye className="w-4 h-4 mr-2" />
                        <span>Quản lý</span>
                        <ChevronRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                      </>
                    ) : (
                      <>
                        <AlertCircle className="w-4 h-4 mr-2" />
                        <span>Không khả dụng</span>
                      </>
                    )}
                  </button>

                  {court.status === "active" && (
                    <button 
                    onClick={() => handleSettingsClick(court)}
                    className="p-3 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl transition-colors">
                      <Settings className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {filteredCourts.length === 0 && (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gradient-to-br from-slate-100 to-slate-200 rounded-full flex items-center justify-center mx-auto mb-6">
              <Search className="w-12 h-12 text-slate-400" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-3">Không tìm thấy sân nào</h3>
            <p className="text-slate-600 mb-6 max-w-md mx-auto">
              Thử thay đổi từ khóa tìm kiếm hoặc bộ lọc để tìm thấy sân phù hợp
            </p>
            <button 
            onClick={() => setShowAddForm(true)}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
              Thêm sân mới
            </button>
          </div>
        )}
      </div>
      <CourtSettingsModal 
        court ={selectedCourt}
        isOpen={showSettingsModal}
        onClose={() => {
          setShowSettingsModal(false)
          setSelectedCourt(null)
        }}
        onSave={handleSaveSettings}
      />
    </div>
  )
}


const StatCard = ({ icon, label, value, bg, trend, trendUp }) => {
  const bgColors = {
    blue: "from-blue-500 to-blue-600",
    emerald: "from-emerald-500 to-emerald-600",
    purple: "from-purple-500 to-purple-600",
    orange: "from-orange-500 to-orange-600",
  }

  const bgLightColors = {
    blue: "from-blue-50 to-blue-100",
    emerald: "from-emerald-50 to-emerald-100",
    purple: "from-purple-50 to-purple-100",
    orange: "from-orange-50 to-orange-100",
  }

  return (
    <div className="group bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/40 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
      <div className="flex items-start justify-between mb-4">
        <div
          className={`w-12 h-12 bg-gradient-to-br ${bgColors[bg]} rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}
        >
          <div className="text-white">{icon}</div>
        </div>
        <div className={`px-2 py-1 bg-gradient-to-r ${bgLightColors[bg]} rounded-full`}>
          <TrendingUp className={`w-3 h-3 ${trendUp ? "text-emerald-600" : "text-red-500"}`} />
        </div>
      </div>

      <div>
        <p className="text-sm font-medium text-slate-600 mb-1">{label}</p>
        <p className="text-3xl font-bold text-slate-900 mb-2">{value}</p>
        {trend && <p className={`text-xs font-medium ${trendUp ? "text-emerald-600" : "text-red-500"}`}>{trend}</p>}
      </div>
    </div>
  )
}

const InfoCard = ({ icon, label, value, color }) => {
  const colors = {
    blue: "text-blue-600 bg-blue-50",
    emerald: "text-emerald-600 bg-emerald-50",
    purple: "text-purple-600 bg-purple-50",
    orange: "text-orange-600 bg-orange-50",
  }

  return (
    <div className="bg-slate-50 rounded-lg p-3 border border-slate-100">
      <div className="flex items-center gap-2 mb-1">
        <div className={`p-1 rounded ${colors[color]}`}>{icon}</div>
        <span className="text-xs font-medium text-slate-600">{label}</span>
      </div>
      <p className="text-sm font-bold text-slate-900">{value}</p>
    </div>
  )
}
