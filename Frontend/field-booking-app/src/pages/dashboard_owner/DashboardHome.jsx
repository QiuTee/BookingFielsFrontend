import { useEffect, useState } from "react"
import { getBookingsForOwner, updateBookingStatus } from "../../api/submission"
import { groupTimeRanges } from "../../utils/groupTimeRanges"
import { statusMap } from "../../constants/statusMap"
import BookingDetailModal from "../../components/booking/BookingDetailModal"
import { processStatusConfig } from "../../constants/statusProcess"
import { useParams } from "react-router-dom"
import {
  Calendar,
  ChevronRight,
  Clock,
  Phone,
  RefreshCw,
  CheckCircle,
  CheckCircle2,
  XCircle,
  Banknote,
  Eye,
  DollarSign,
  TrendingUp,
  BarChart3,
  Settings,
  Bell,
  Filter,
  Download,
  Plus,
  MapPin,
  Star,
  AlertCircle,
} from "lucide-react"
import { useField } from "../../context/FieldContext"
import formatCurrency from "../../utils/FormatCurrency"
import caculateTotalRevenueByStatus from "../../utils/CaculateTotalRevenueByStatus"


export default function DashboardHome() {
  const [bookings, setBookings] = useState([])
  const [selectedBooking, setSelectedBooking] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("available")
  const { slug } = useParams()
  const { fields, refreshFields } = useField()
  const currentField = fields.find((f) => f.slug === slug)

  const fetchBookings = async () => {
    setIsLoading(true)
    try {
      const data = await getBookingsForOwner(slug)
      setBookings(data)
      console.log("Bookings fetched:", data)
    } catch (error) {
      console.error("Error fetching bookings:", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (!slug) return
    const run = async () => {
      await Promise.all([fetchBookings() , refreshFields() ])
    }
    run()
    
  }, [slug])

  const handleUpdate = async () => {
    await refreshFields()
  }

  const handleStatusChange = async (bookingId, newStatus) => {
    try {
      await updateBookingStatus(bookingId, { status: newStatus })
      setBookings((prevBookings) =>
        prevBookings.map((booking) => (booking.id === bookingId ? { ...booking, status: newStatus } : booking)),
      )
    } catch (error) {
      console.error("Error updating booking status:", error)
    }
  }

  const getEnhancedStats = () => {
    const today = new Date()
    const todayBookings = bookings.filter((b) => {
      const bookingDate = new Date(b.date)
      return bookingDate.toDateString() === today.toDateString()
    })

    const thisWeekBookings = bookings.filter((b) => {
      const bookingDate = new Date(b.date)
      const weekStart = new Date(today)
      weekStart.setDate(today.getDate() - today.getDay())
      return bookingDate >= weekStart
    })

    const pendingBookings = bookings.filter((b) => b.status === "unpaid" || b.status === "paid")
    const totalRevenue = caculateTotalRevenueByStatus(bookings, currentField?.price)
    const todayRevenue = caculateTotalRevenueByStatus(todayBookings, currentField?.price)

    return {
      total: bookings.length,
      today: todayBookings.length,
      thisWeek: thisWeekBookings.length,
      pending: pendingBookings.length,
      confirmed: bookings.filter((b) => b.status === "confirmed_paid").length,
      deposit: bookings.filter((b) => b.status === "confirmed_deposit").length,
      totalRevenue,
      todayRevenue,
      averageBookingValue: bookings.length > 0 ? totalRevenue / bookings.length : 0,
    }
  }

  const stats = getEnhancedStats()


  const getRecentActivity = () => {
    return bookings.sort((a, b) => new Date(b.createdAt || b.date) - new Date(a.createdAt || a.date)).slice(0, 5)
  }

  const recentBookings = getRecentActivity()

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-[1400px] mx-auto p-4 lg:p-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-gray-600 mt-1">Chào mừng trở lại! Đây là tổng quan về hoạt động sân của bạn.</p>
            </div>
          </div>
        </div>

        {/* Enhanced Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Tổng đặt sân</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stats.total}</p>
                <p className="text-xs text-green-600 mt-1">
                  <TrendingUp className="h-3 w-3 inline mr-1" />
                  +12% so với tháng trước
                </p>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <Calendar className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Doanh thu</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{formatCurrency(stats.totalRevenue)}</p>
                <p className="text-xs text-green-600 mt-1">
                  <TrendingUp className="h-3 w-3 inline mr-1" />
                  Hôm nay: {formatCurrency(stats.todayRevenue)}
                </p>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Đã xác nhận</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stats.confirmed}</p>
                <p className="text-xs text-blue-600 mt-1">
                  <CheckCircle className="h-3 w-3 inline mr-1" />
                  {stats.deposit} đã đặt cọc
                </p>
              </div>
              <div className="bg-emerald-100 p-3 rounded-full">
                <CheckCircle2 className="h-6 w-6 text-emerald-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Cần xử lý</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stats.pending}</p>
                <p className="text-xs text-amber-600 mt-1">
                  <Clock className="h-3 w-3 inline mr-1" />
                  Chờ xác nhận
                </p>
              </div>
              <div className="bg-amber-100 p-3 rounded-full">
                <AlertCircle className="h-6 w-6 text-amber-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Recent Bookings - Takes 2 columns */}
          <div className="xl:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-100">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">Đặt sân gần đây</h2>
                    <p className="text-sm text-gray-600 mt-1">Quản lý và theo dõi các đơn đặt sân mới nhất</p>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      <Filter className="h-4 w-4 text-gray-500" />
                      <select className="text-sm border border-gray-300 rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                        <option>Tất cả trạng thái</option>
                        <option>Chờ xác nhận</option>
                        <option>Đã xác nhận</option>
                      </select>
                    </div>

                    <button
                      className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-lg border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 transition-colors"
                      onClick={fetchBookings}
                    >
                      <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
                      <span className="hidden sm:inline">Làm mới</span>
                    </button>
                  </div>
                </div>
              </div>

              <div className="p-6">
                {isLoading ? (
                  <div className="space-y-4">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="animate-pulse">
                        <div className="h-24 bg-gray-100 rounded-lg"></div>
                      </div>
                    ))}
                  </div>
                ) : recentBookings.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="bg-gray-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                      <Calendar className="h-8 w-8 text-gray-400" />
                    </div>
                    <p className="text-gray-500 font-medium">Chưa có đơn đặt sân nào</p>
                    <p className="text-sm text-gray-400 mt-1">Các đơn đặt sân mới sẽ hiển thị ở đây</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {recentBookings.map((booking) => {
                      const groupedBySubField =
                        booking.slots?.reduce((acc, slot) => {
                          acc[slot.subField] = acc[slot.subField] || []
                          acc[slot.subField].push(slot.time)
                          return acc
                        }, {}) || {}

                      return (
                        <div
                          key={booking.id}
                          className="bg-gray-50 border border-gray-200 rounded-xl p-4 hover:shadow-md transition-all duration-200"
                        >
                          <div className="flex flex-col lg:flex-row justify-between gap-4">
                            <div className="flex-1 space-y-3">
                              <div className="flex items-start justify-between">
                                <div>
                                  <div className="flex items-center gap-3">
                                    <h3 className="font-semibold text-gray-900">{booking.userName}</h3>
                                    <span
                                      className={`text-xs font-medium px-2.5 py-1 rounded-full ${statusMap[booking.status || "confirmed"].color}`}
                                    >
                                      {statusMap[booking.status || "confirmed"].label}
                                    </span>
                                    {booking.processStatus && (
                                      <span
                                        className={`text-xs font-medium px-2.5 py-1 rounded-full ${processStatusConfig[booking.processStatus || "waiting_response"].color}`}
                                      >
                                        {processStatusConfig[booking.processStatus || "waiting_response"].label}
                                      </span>
                                    )}
                                  </div>
                                  <p className="text-sm text-gray-500 mt-1">ID: #{booking.id}</p>
                                </div>

                                <button
                                  className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-lg border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 transition-colors"
                                  onClick={() => setSelectedBooking(booking)}
                                >
                                  <Eye className="h-4 w-4" />
                                  <span>Chi tiết</span>
                                </button>
                              </div>

                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                  <div className="bg-blue-100 p-1 rounded">
                                    <Calendar className="h-4 w-4 text-blue-600" />
                                  </div>
                                  <span>{new Date(booking.date).toLocaleDateString("vi-VN")}</span>
                                  <span>•</span>
                                  <span className="font-medium">{booking.fieldName}</span>
                                </div>

                                <a
                                  href={`tel:${booking.phone}`}
                                  className="flex items-center gap-2 text-sm text-gray-600 hover:text-blue-600 transition-colors"
                                >
                                  <div className="bg-green-100 p-1 rounded">
                                    <Phone className="h-4 w-4 text-green-600" />
                                  </div>
                                  <span>{booking.phone}</span>
                                </a>
                              </div>

                              <div className="space-y-2">
                                {Object.entries(groupedBySubField).map(([subField, times], idx) => (
                                  <div key={idx} className="flex items-center gap-2 text-sm text-gray-600">
                                    <div className="bg-purple-100 p-1 rounded">
                                      <Clock className="h-4 w-4 text-purple-600" />
                                    </div>
                                    <span className="font-medium">{subField}:</span>
                                    <span>{groupTimeRanges(times).join(", ")}</span>
                                  </div>
                                ))}
                              </div>
                            </div>

                            {(booking.status === "paid" || booking.status === "unpaid") && (
                              <div className="flex flex-col gap-2 lg:w-auto">
                                <div className="flex flex-wrap gap-2">
                                  {booking.status === "paid" && (
                                    <>
                                      <button
                                        onClick={() => handleStatusChange(booking.id, "confirmed_paid")}
                                        className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-lg bg-green-600 hover:bg-green-700 text-white transition-colors"
                                      >
                                        <CheckCircle2 className="h-4 w-4" />
                                        <span>Xác nhận</span>
                                      </button>

                                      <button
                                        onClick={() => handleStatusChange(booking.id, "confirmed_deposit")}
                                        className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition-colors"
                                      >
                                        <Banknote className="h-4 w-4" />
                                        <span>Đặt cọc</span>
                                      </button>
                                    </>
                                  )}

                                  <button
                                    onClick={() => handleStatusChange(booking.id, "canceled")}
                                    className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-lg bg-red-600 hover:bg-red-700 text-white transition-colors"
                                  >
                                    <XCircle className="h-4 w-4" />
                                    <span>Từ chối</span>
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>

              <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 rounded-b-xl">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-600">
                    Hiển thị {Math.min(5, recentBookings.length)} trong số {bookings.length} đơn đặt sân
                  </p>
                  <a
                    href={`/san/${slug}/owner/bookings`}
                    className="text-blue-600 hover:text-blue-800 inline-flex items-center gap-1 text-sm font-medium transition-colors"
                  >
                    Xem tất cả
                    <ChevronRight className="h-4 w-4" />
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar - Court Management & Quick Stats */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Thao tác nhanh</h3>
              <div className="space-y-3">
                <button className="w-full flex items-center gap-3 p-3 text-left rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                  <div className="bg-blue-100 p-2 rounded-lg">
                    <BarChart3 className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Xem báo cáo</p>
                    <p className="text-xs text-gray-500">Thống kê chi tiết</p>
                  </div>
                </button>

                <button className="w-full flex items-center gap-3 p-3 text-left rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                  <div className="bg-green-100 p-2 rounded-lg">
                    <Download className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Xuất dữ liệu</p>
                    <p className="text-xs text-gray-500">Tải về Excel</p>
                  </div>
                </button>

                <button className="w-full flex items-center gap-3 p-3 text-left rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                  <div className="bg-purple-100 p-2 rounded-lg">
                    <Settings className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Cài đặt sân</p>
                    <p className="text-xs text-gray-500">Quản lý thông tin</p>
                  </div>
                </button>
              </div>
            </div>

            {/* Court Management */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Quản lý sân</h3>
                    <p className="text-sm text-gray-600 mt-1">Trạng thái và thông tin các sân</p>
                  </div>
                  <button
                    className="p-2 rounded-lg border border-gray-300 bg-white hover:bg-gray-50 transition-colors"
                    onClick={handleUpdate}
                  >
                    <RefreshCw className="h-4 w-4 text-gray-600" />
                  </button>
                </div>
              </div>

              <div className="p-6">
                <div className="flex border-b border-gray-200 mb-4">
                  <button
                    className={`px-4 py-2 text-sm font-medium transition-colors ${
                      activeTab === "available"
                        ? "border-b-2 border-blue-600 text-blue-600"
                        : "text-gray-500 hover:text-gray-700"
                    }`}
                    onClick={() => setActiveTab("available")}
                  >
                    Hoạt động ({fields.filter((f) => f.status === "active").length})
                  </button>
                  <button
                    className={`px-4 py-2 text-sm font-medium transition-colors ${
                      activeTab === "all"
                        ? "border-b-2 border-blue-600 text-blue-600"
                        : "text-gray-500 hover:text-gray-700"
                    }`}
                    onClick={() => setActiveTab("all")}
                  >
                    Tất cả ({fields.length})
                  </button>
                </div>

                <div className="space-y-3">
                  {fields
                    .filter((f) => activeTab === "all" || f.status === "active")
                    .map((field) => (
                      <div
                        key={field.id}
                        className="p-4 border border-gray-200 rounded-lg hover:shadow-sm transition-shadow"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="bg-blue-100 p-2 rounded-lg">
                              <MapPin className="h-5 w-5 text-blue-600" />
                            </div>
                            <div>
                              <h4 className="font-medium text-gray-900">{field.name}</h4>
                              <p className="text-sm text-gray-500">{formatCurrency(field.price)}/30 phút</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <span
                              className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                field.status === "active" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                              }`}
                            >
                              {field.status === "active" ? "Hoạt động" : "Tạm dừng"}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>

              <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 rounded-b-xl">
                <button className="w-full px-4 py-2 text-sm font-medium rounded-lg border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 transition-colors">
                  Quản lý tất cả sân
                </button>
              </div>
            </div>

            {/* Performance Metrics */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Hiệu suất</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Tỷ lệ đặt sân</span>
                  <span className="text-sm font-medium text-gray-900">85%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-600 h-2 rounded-full" style={{ width: "85%" }}></div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Đánh giá trung bình</span>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    <span className="text-sm font-medium text-gray-900">4.8</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Khách hàng quay lại</span>
                  <span className="text-sm font-medium text-gray-900">72%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {selectedBooking && <BookingDetailModal booking={selectedBooking} onClose={() => setSelectedBooking(null)} />}
    </div>
  )
}
