import { useState , useEffect } from "react"
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
  Tag
} from "lucide-react"
import { useAuth } from "../../context/AuthContext"
import { getField , getBookingToday } from "../../api/submission"
import { useNavigate } from "react-router-dom"

export default function CourtSelection() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedFilter, setSelectedFilter] = useState("all")
  const {logout , user , isAuthenticated} = useAuth()
  const [ courts , setCourts ] = useState([])
  const [totalBookings , setTotalBookings] = useState([])
  const navigate = useNavigate()

  useEffect(() => { 
    if(!isAuthenticated) {
      navigate("owner/court-selection")
    }
    const fetchField = async () => { 
      try { 
        const [fields , todayBookings] = await Promise.all([
          getField() , getBookingToday() 
        ])
        setTotalBookings(todayBookings)
        const enrichedField = fields.map((field) => {
          const findEachFieldById = todayBookings?.bookingTodayByField?.find((booking) => field.id === booking.fieldId);
          return {
            ...field,
            totalBookingCount : findEachFieldById?.bookingCount || 0
          }
        }) 
        console.log(enrichedField)
       setCourts(enrichedField)
        
      }
      catch (error){
        console.log("Không thể lấy được sân" , error)
      }
    }
    fetchField()
    const interval = setInterval(fetchField, 60000)
    return (() => clearInterval(interval))
  } , [isAuthenticated])



  const filteredCourts = courts.filter((court) => {
    const matchesSearch =
      court.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      court.address.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter =
      selectedFilter === "all" || court.type.toLowerCase() === selectedFilter
    return matchesSearch && matchesFilter
  })

  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800"
      case "maintenance":
        return "bg-yellow-100 text-yellow-800"
      case "closed":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
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

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount)
  }

  const handleCourtSelect = (slug) => {
    navigate(`/san/${slug}/owner`)
  }

  const totalRevenue = courts.reduce((sum, court) => sum + court.todayRevenue, 0)
  const activeCourts = courts.filter((court) => court.status === "active").length

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-green-600 rounded-xl flex items-center justify-center">
                <Calendar className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">CourtManager</h1>
                <p className="text-sm text-gray-600">Quản lý sân thể thao</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-gray-600" />
                </div>
                <span className="text-sm font-medium text-gray-700">{user.name}</span>
              </div>
              <button className="p-2 text-gray-400 hover:text-gray-600 focus:outline-none" onClick={logout}>
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Chọn sân quản lý</h2>
          <p className="text-gray-600 mb-6">Chọn sân bạn muốn quản lý từ danh sách bên dưới</p>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <StatCard icon={<Activity className="w-5 h-5 text-blue-600" />} label="Tổng sân" value={courts.length} bg="blue" />
            <StatCard icon={<TrendingUp className="w-5 h-5 text-green-600" />} label="Sân hoạt động" value={activeCourts} bg="green" />
            <StatCard icon={<Calendar className="w-5 h-5 text-purple-600" />} label="Booking hôm nay" value={totalBookings.totalBooking} bg="purple" />
            <StatCard icon={<Clock className="w-5 h-5 text-orange-600" />} label="Giờ hoạt động trung bình" value="16 giờ/ngày" bg="orange" />
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Tìm kiếm sân theo tên hoặc địa chỉ..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>

          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <select
              value={selectedFilter}
              onChange={(e) => setSelectedFilter(e.target.value)}
              className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white"
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourts.map((court) => (
            <div key={court.id} className="bg-white rounded-xl shadow-sm border hover:shadow-md transition-shadow">
              <div className="relative">
                <img src={court.heroImage} alt={court.name} className="w-full h-48 object-cover rounded-t-xl" />
                <div className="absolute top-4 right-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(court.status)}`}>
                    {getStatusText(court.status)}
                  </span>
                </div>
              </div>

              <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">{court.name}</h3>
                    <div className="flex items-center text-sm text-gray-600">
                      <MapPin className="w-4 h-4 mr-1" />
                      <span className="line-clamp-1">{court.location}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3 mb-4">
                  <InfoRow icon={<Calendar className="w-4 h-4 mr-2" />} label="Booking hôm nay" value={`${court.totalBookingCount} lượt`} />
                  <InfoRow icon={<Tag className="w-4 h-4 mr-2" />} label="Loại sân" value={court.type} />
                  <InfoRow icon={<Clock className="w-4 h-4 mr-2" />} label="Giờ mở cửa" value={`${court.opentime} - ${court.closetime}`} />
                </div>

                <button
                  onClick={() => handleCourtSelect(court.slug)}
                  disabled={court.status !== "active"}
                  className={`w-full flex items-center justify-center px-4 py-2 rounded-lg font-medium transition-colors ${
                    court.status === "active"
                      ? "bg-green-600 hover:bg-green-700 text-white"
                      : "bg-gray-100 text-gray-400 cursor-not-allowed"
                  }`}
                >
                  {court.status === "active" ? (
                    <>
                      <span>Vào quản lý</span>
                      <ChevronRight className="w-4 h-4 ml-2" />
                    </>
                  ) : (
                    <>
                      <AlertCircle className="w-4 h-4 mr-2" />
                      <span>Không khả dụng</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredCourts.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Không tìm thấy sân nào</h3>
            <p className="text-gray-600">Thử thay đổi từ khóa tìm kiếm hoặc bộ lọc</p>
          </div>
        )}
      </div>
    </div>
  )
}

const StatCard = ({ icon, label, value, bg }) => (
  <div className="bg-white rounded-lg p-4 shadow-sm border">
    <div className="flex items-center">
      <div className={`w-10 h-10 bg-${bg}-100 rounded-lg flex items-center justify-center`}>
        {icon}
      </div>
      <div className="ml-3">
        <p className="text-sm font-medium text-gray-600">{label}</p>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
      </div>
    </div>
  </div>
)

const InfoRow = ({ icon, label, value }) => (
  <div className="flex items-center justify-between text-sm">
    <div className="flex items-center text-gray-600">
      {icon}
      <span>{label}</span>
    </div>
    <span className="font-medium text-gray-900">{value}</span>
  </div>
)
