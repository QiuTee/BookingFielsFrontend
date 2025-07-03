import { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import {
  Calendar,
  User,
  Phone,
  Search,
  Eye,
  Check,
  X,
  MoreHorizontal,
  MapPin,
  CheckCircle,
  XCircle,
  Hourglass,
  Clock,
  Wallet,
  ChevronDown,
  Info,
  CreditCard,
  Download,
  RefreshCw,
  SortAsc,
  SortDesc,
  ArrowUpDown,
  DollarSign,
  MessageSquare,
  FileText,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
} from "lucide-react"
import { statusMap } from "../../constants/statusMap"
import { processStatusConfig } from "../../constants/statusProcess"
import { updateBookingStatus, getBookingsForOwner } from "../../api/submission"
import { groupTimeRanges } from "../../utils/groupTimeRanges"
import { useField } from "../../context/FieldContext"
import formatCurrency from "../../utils/FormatCurrency"

export default function BookingManagement() {
  const [bookings, setBookings] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [processStatusFilter, setProcessStatusFilter] = useState("all")
  const [dateFilter, setDateFilter] = useState("all")
  const [sortBy, setSortBy] = useState("date")
  const [sortOrder, setSortOrder] = useState("desc")
  const [selectedBooking, setSelectedBooking] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [zoomImageUrl, setZoomImageUrl] = useState(null)
  const [discount, setDiscount] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [isLoading, setIsLoading] = useState(true)
  const [selectedBookings, setSelectedBookings] = useState([])
  const [showBulkActions, setShowBulkActions] = useState(false)
  const [autoRefresh , setAutoRefresh] = useState(true)
  const { slug } = useParams()
  const { fields } = useField()
  const currentField = fields.find((field) => field.slug === slug)

  useEffect(() => {
    if (!slug) return

    const fetchBookings = async () => {
      setIsLoading(true)
      try {
        const data = await getBookingsForOwner(slug)
        console.log("data" , data)
        setBookings(data)
      } catch (error) {
        console.error("Error fetching bookings:", error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchBookings()
    if (!autoRefresh) return
    const interval = setInterval(fetchBookings ,30000 )
    return () => clearInterval(interval)
  }, [slug ,autoRefresh])

  const filteredBookings = bookings
    .filter((booking) => {
      const matchesSearch =
        booking.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.phone.includes(searchTerm) ||
        booking.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.slots.some((slot) => slot.subField.toLowerCase().includes(searchTerm.toLowerCase()))

      const matchesStatus = statusFilter === "all" || booking.status === statusFilter
      const matchesProcessStatus = processStatusFilter === "all" || booking.processStatus === processStatusFilter

      const matchesDate = (() => {
        if (dateFilter === "all") return true
        const bookingDate = new Date(booking.date)
        const today = new Date()
        const yesterday = new Date(today)
        yesterday.setDate(today.getDate() - 1)
        const tomorrow = new Date(today)
        tomorrow.setDate(today.getDate() + 1)
        const weekFromNow = new Date(today)
        weekFromNow.setDate(today.getDate() + 7)

        switch (dateFilter) {
          case "today":
            return bookingDate.toDateString() === today.toDateString()
          case "tomorrow":
            return bookingDate.toDateString() === tomorrow.toDateString()
          case "week":
            return bookingDate >= today && bookingDate <= weekFromNow
          case "past":
            return bookingDate < today
          default:
            return true
        }
      })()

      return matchesSearch && matchesStatus && matchesProcessStatus && matchesDate
    })
    .sort((a, b) => {
      let aValue, bValue
      switch (sortBy) {
        case "date":
          aValue = new Date(a.date)
          bValue = new Date(b.date)
          break
        case "customer":
          aValue = a.userName.toLowerCase()
          bValue = b.userName.toLowerCase()
          break
        case "price":
          aValue = a.totalPrice || 0
          bValue = b.totalPrice || 0
          break
        case "status":
          aValue = a.status
          bValue = b.status
          break
        default:
          aValue = a.id
          bValue = b.id
      }

      if (sortOrder === "asc") {
        return aValue > bValue ? 1 : -1
      } else {
        return aValue < bValue ? 1 : -1
      }
    })

  const totalPages = Math.ceil(filteredBookings.length / itemsPerPage)
  const paginatedBookings = filteredBookings.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  const getStats = () => {
    const today = new Date()
    const todayBookings = bookings.filter((b) => new Date(b.date).toDateString() === today.toDateString())
    const pendingBookings = bookings.filter((b) => b.status === "unpaid" || b.status === "paid")
    const totalRevenue = bookings.reduce((sum, b) => sum + (b.totalPrice || 0), 0)
    const todayRevenue = todayBookings.reduce((sum, b) => sum + (b.totalPrice || 0), 0)

    return {
      total: bookings.length,
      today: todayBookings.length,
      pending: pendingBookings.length,
      confirmed: bookings.filter((b) => b.status === "confirmed_paid").length,
      totalRevenue,
      todayRevenue,
    }
  }

  const stats = getStats()

  const getProcessStatusFromStatus = (status) => {
    switch (status) {
      case "confirmed_paid":
      case "confirmed_deposit":
        return "confirmed"
      case "canceled":
        return "no_response"
      default:
        return undefined
    }
  }

  const getStatusFromProcessStatus = (processStatus) => {
    switch (processStatus) {
      case "no_response":
        return "canceled"
      case "confirmed":
        return "confirmed_paid"
      default:
        return undefined
    }
  }

  const handleStatusChange = async (id, newStatus) => {
    try {
      const processStatus = getProcessStatusFromStatus(newStatus)
      const payload = {
        status: newStatus,
        ...(processStatus && { processStatus }),
      }
      await updateBookingStatus(id, payload)
      setBookings((prevBookings) =>
        prevBookings.map((booking) =>
          booking.id === id ? { ...booking, status: newStatus, ...(processStatus && { processStatus }) } : booking,
        ),
      )
      setSelectedBooking((prev) =>
        prev?.id === id ? { ...prev, status: newStatus, ...(processStatus && { processStatus }) } : prev,
      )
    } catch (error) {
      console.error("Error updating booking status:", error)
    }
  }

  const handleProcessStatusChange = async (id, newProcessStatus) => {
    try {
      const status = getStatusFromProcessStatus(newProcessStatus)
      const payload = {
        processStatus: newProcessStatus,
        ...(status && { status }),
      }

      await updateBookingStatus(id, payload)

      setBookings((prevBookings) =>
        prevBookings.map((booking) =>
          booking.id === id ? { ...booking, processStatus: newProcessStatus, ...(status && { status }) } : booking,
        ),
      )

      setSelectedBooking((prev) =>
        prev?.id === id ? { ...prev, processStatus: newProcessStatus, ...(status && { status }) } : prev,
      )
    } catch (error) {
      console.error("Error updating booking process status:", error)
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case "confirmed_paid":
        return <CheckCircle className="w-4 h-4" />
      case "confirmed_deposit":
        return <Wallet className="w-4 h-4" />
      case "canceled":
        return <XCircle className="w-4 h-4" />
      default:
        return <Hourglass className="w-4 h-4" />
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("vi-VN")
  }

  const handleViewDetails = (booking) => {
    setSelectedBooking(booking)
    setDiscount(booking.discountAmount || 0)
    setShowModal(true)
  }

  const handleCloseModal = () => {
    setShowModal(false)
    setDiscount(0)
  }

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc")
    } else {
      setSortBy(field)
      setSortOrder("asc")
    }
  }

  const getSortIcon = (field) => {
    if (sortBy !== field) return <ArrowUpDown className="w-4 h-4 text-gray-400" />
    return sortOrder === "asc" ? (
      <SortAsc className="w-4 h-4 text-blue-600" />
    ) : (
      <SortDesc className="w-4 h-4 text-blue-600" />
    )
  }

  const handleBulkStatusChange = async (newStatus) => {
    try {
      await Promise.all(selectedBookings.map((id) => handleStatusChange(id, newStatus)))
      setSelectedBookings([])
      setShowBulkActions(false)
    } catch (error) {
      console.error("Error updating bulk status:", error)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Enhanced Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between py-6 gap-4">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center shadow-lg">
                  <Calendar className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">{currentField?.name || "Quản lý đặt sân"}</h1>
                  <div className="flex items-center text-sm text-gray-600 mt-1">
                    <MapPin className="w-4 h-4 mr-1" />
                    <span>{currentField?.location || "Địa chỉ sân"}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm text-gray-600">Hôm nay</p>
                <p className="text-lg font-semibold text-gray-900">{new Date().toLocaleDateString("vi-VN")}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Enhanced Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6">
          <div className="p-6">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Tìm kiếm theo tên, SĐT, mã booking, sân..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div className="flex flex-wrap gap-3">
                <select
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                  className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white min-w-[140px]"
                >
                  <option value="all">Tất cả ngày</option>
                  <option value="today">Hôm nay</option>
                  <option value="tomorrow">Ngày mai</option>
                  <option value="week">Tuần này</option>
                  <option value="past">Đã qua</option>
                </select>

                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white min-w-[140px]"
                >
                  <option value="all">Tất cả trạng thái</option>
                  <option value="confirmed_paid">Đã thanh toán</option>
                  <option value="confirmed_deposit">Đã cọc</option>
                  <option value="canceled">Đã hủy</option>
                </select>

                <select
                  value={processStatusFilter}
                  onChange={(e) => setProcessStatusFilter(e.target.value)}
                  className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white min-w-[140px]"
                >
                  <option value="all">Tất cả tình trạng</option>
                  <option value="waiting_response">Đợi phản hồi</option>
                  <option value="callback_later">Gọi lại sau</option>
                  <option value="no_response">Không phản hồi</option>
                  <option value="confirmed">Đã xác nhận</option>
                </select>

                <button
                  onClick={() => {
                    setSearchTerm("")
                    setStatusFilter("all")
                    setProcessStatusFilter("all")
                    setDateFilter("all")
                  }}
                  className="px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>

                <button
                  onClick={() => window.location.reload()}
                  className="flex items-center gap-2 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
                  <span className="hidden sm:inline">Làm mới</span>
                </button>
                <button
                  onClick={() => setAutoRefresh((prev) => !prev)}
                  className={`flex items-center gap-2 px-4 py-3 border rounded-lg transition-colors ${
                    autoRefresh ? "border-green-500 text-green-600 hover:bg-green-50" : "border-gray-300 text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  {autoRefresh ? (
                    <>
                      <CheckCircle className="h-4 w-4" />
                      <span className="hidden sm:inline">Tự làm mới: Bật</span>
                    </>
                  ) : (
                    <>
                      <XCircle className="h-4 w-4" />
                      <span className="hidden sm:inline">Tự làm mới: Tắt</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {/* Table Header with Actions */}
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center gap-4">
                <h2 className="text-lg font-semibold text-gray-900">Danh sách booking ({filteredBookings.length})</h2>
                {selectedBookings.length > 0 && (
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">Đã chọn {selectedBookings.length}</span>
                    <div className="relative">
                      <button
                        onClick={() => setShowBulkActions(!showBulkActions)}
                        className="flex items-center gap-1 px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                      >
                        Thao tác hàng loạt
                        <ChevronDown className="h-4 w-4" />
                      </button>
                      {showBulkActions && (
                        <div className="absolute top-full left-0 mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
                          <div className="py-1">
                            <button
                              onClick={() => handleBulkStatusChange("confirmed_paid")}
                              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            >
                              Xác nhận thanh toán
                            </button>
                            <button
                              onClick={() => handleBulkStatusChange("confirmed_deposit")}
                              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            >
                              Chuyển về đặt cọc
                            </button>
                            <button
                              onClick={() => handleBulkStatusChange("canceled")}
                              className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                            >
                              Hủy booking
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-3">
                <select
                  value={itemsPerPage}
                  onChange={(e) => {
                    setItemsPerPage(Number(e.target.value))
                    setCurrentPage(1)
                  }}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value={10}>10 / trang</option>
                  <option value={25}>25 / trang</option>
                  <option value={50}>50 / trang</option>
                  <option value={100}>100 / trang</option>
                </select>

                <button className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm">
                  <Download className="h-4 w-4" />
                  <span className="hidden sm:inline">Xuất Excel</span>
                </button>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left">
                    <input
                      type="checkbox"
                      checked={selectedBookings.length === paginatedBookings.length && paginatedBookings.length > 0}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedBookings(paginatedBookings.map((b) => b.id))
                        } else {
                          setSelectedBookings([])
                        }
                      }}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </th>
                  <th className="px-6 py-4 text-left">
                    <button
                      onClick={() => handleSort("date")}
                      className="flex items-center gap-2 text-xs font-medium text-gray-500 uppercase tracking-wider hover:text-gray-700"
                    >
                      Mã booking & Ngày
                      {getSortIcon("date")}
                    </button>
                  </th>
                  <th className="px-6 py-4 text-left">
                    <button
                      onClick={() => handleSort("customer")}
                      className="flex items-center gap-2 text-xs font-medium text-gray-500 uppercase tracking-wider hover:text-gray-700"
                    >
                      Khách hàng
                      {getSortIcon("customer")}
                    </button>
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Thời gian & Sân
                  </th>
                  <th className="px-6 py-4 text-left">
                    <button
                      onClick={() => handleSort("status")}
                      className="flex items-center gap-2 text-xs font-medium text-gray-500 uppercase tracking-wider hover:text-gray-700"
                    >
                      Trạng thái
                      {getSortIcon("status")}
                    </button>
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tình trạng
                  </th>
                  <th className="px-6 py-4 text-left">
                    <button
                      onClick={() => handleSort("price")}
                      className="flex items-center gap-2 text-xs font-medium text-gray-500 uppercase tracking-wider hover:text-gray-700"
                    >
                      Giá tiền
                      {getSortIcon("price")}
                    </button>
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {isLoading
                  ? Array.from({ length: 5 }).map((_, index) => (
                      <tr key={index} className="animate-pulse">
                        <td className="px-6 py-4">
                          <div className="h-4 w-4 bg-gray-200 rounded"></div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
                          <div className="h-3 bg-gray-200 rounded w-20"></div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            <div className="w-8 h-8 bg-gray-200 rounded-full mr-3"></div>
                            <div>
                              <div className="h-4 bg-gray-200 rounded w-24 mb-1"></div>
                              <div className="h-3 bg-gray-200 rounded w-20"></div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="h-4 bg-gray-200 rounded w-32"></div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="h-6 bg-gray-200 rounded w-20"></div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="h-6 bg-gray-200 rounded w-24"></div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="h-4 bg-gray-200 rounded w-16"></div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex gap-2">
                            <div className="h-8 w-8 bg-gray-200 rounded"></div>
                            <div className="h-8 w-8 bg-gray-200 rounded"></div>
                          </div>
                        </td>
                      </tr>
                    ))
                  : paginatedBookings.map((booking) => (
                      <tr
                        key={booking.id}
                        className={`hover:bg-gray-50 transition-colors ${
                          selectedBookings.includes(booking.id) ? "bg-blue-50" : ""
                        }`}
                      >
                        <td className="px-6 py-4">
                          <input
                            type="checkbox"
                            checked={selectedBookings.includes(booking.id)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedBookings([...selectedBookings, booking.id])
                              } else {
                                setSelectedBookings(selectedBookings.filter((id) => id !== booking.id))
                              }
                            }}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{booking.bookingCode}</div>
                          <div className="text-sm text-gray-500">{formatDate(booking.date)}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                              <User className="w-5 h-5 text-white" />
                            </div>
                            <div className="ml-3">
                              <div className="text-sm font-medium text-gray-900">{booking.userName}</div>
                              <a
                                className="text-sm text-gray-500 flex items-center hover:text-blue-600 transition-colors"
                                href={`tel:${booking.phone}`}
                              >
                                <Phone className="w-3 h-3 mr-1" />
                                {booking.phone}
                              </a>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900">
                            {(() => {
                              const groupedBySubField =
                                booking.slots?.reduce((acc, slot) => {
                                  acc[slot.subField] = acc[slot.subField] || []
                                  acc[slot.subField].push(slot.time)
                                  return acc
                                }, {}) || {}

                              return Object.entries(groupedBySubField).map(([subField, times], idx) => (
                                <div key={idx} className="flex items-start gap-2 mb-2 last:mb-0">
                                  <div className="bg-blue-100 p-1 rounded">
                                    <MapPin className="w-3 h-3 text-blue-600" />
                                  </div>
                                  <div>
                                    <span className="font-medium text-gray-900">{subField}</span>
                                    <div className="text-xs text-gray-600 mt-1">
                                      {groupTimeRanges(times).map((range, idx) => (
                                        <div key={idx} className="flex items-center gap-1">
                                          <Clock className="w-3 h-3" />
                                          <span>{range}</span>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                </div>
                              ))
                            })()}
                          </div>
                        </td>
                        <td className="px-2 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                              statusMap[booking.status || "confirmed_paid"].color
                            }`}
                          >
                            {getStatusIcon(booking.status)}
                            <span className="ml-1.5">{statusMap[booking.status || "confirmed_paid"].label}</span>
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="relative">
                            <select
                              value={booking.processStatus || "waiting_response"}
                              onChange={(e) => handleProcessStatusChange(booking.id, e.target.value)}
                              className={`appearance-none pl-3 pr-8 py-2 rounded-lg text-xs font-medium border focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                processStatusConfig[booking.processStatus || "waiting_response"].color
                              }`}
                            >
                              <option value="waiting_response">Đợi phản hồi</option>
                              <option value="callback_later">Gọi lại sau</option>
                              <option value="no_response">Không phản hồi</option>
                              <option value="confirmed">Đã xác nhận</option>
                            </select>
                            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-3 w-3 pointer-events-none text-gray-400" />
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-semibold text-gray-900">
                            {formatCurrency(booking.totalPrice)}
                          </div>
                          {booking.discountAmount > 0 && (
                            <div className="text-xs text-green-600">Giảm {formatCurrency(booking.discountAmount)}</div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <div className="flex items-center justify-end space-x-2">
                            <button
                              onClick={() => handleViewDetails(booking)}
                              className="p-2 text-blue-600 hover:text-blue-900 hover:bg-blue-50 rounded-lg transition-colors"
                              title="Xem chi tiết"
                            >
                              <Eye className="w-4 h-4" />
                            </button>

                            {booking.status === "confirmed_deposit" && (
                              <button
                                onClick={() => handleStatusChange(booking.id, "confirmed_paid")}
                                className="p-2 text-green-600 hover:text-green-900 hover:bg-green-50 rounded-lg transition-colors"
                                title="Thanh toán đủ"
                              >
                                <Check className="w-4 h-4" />
                              </button>
                            )}

                            <div className="relative group">
                              <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors">
                                <MoreHorizontal className="w-4 h-4" />
                              </button>
                              <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
                                <div className="py-1">
                                  {booking.status === "confirmed_paid" && (
                                    <button
                                      onClick={() => handleStatusChange(booking.id, "confirmed_deposit")}
                                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 flex items-center gap-2"
                                    >
                                      <Wallet className="w-4 h-4" />
                                      Chuyển về đặt cọc
                                    </button>
                                  )}
                                  <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                                    <MessageSquare className="w-4 h-4" />
                                    Gửi tin nhắn
                                  </button>
                                  <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                                    <FileText className="w-4 h-4" />
                                    Xuất hóa đơn
                                  </button>
                                  <div className="border-t border-gray-100"></div>
                                  <button
                                    onClick={() => handleStatusChange(booking.id, "canceled")}
                                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                                  >
                                    <XCircle className="w-4 h-4" />
                                    Hủy booking
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    ))}
              </tbody>
            </table>
          </div>

          {/* Enhanced Pagination */}
          {totalPages > 1 && (
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-700">
                  Hiển thị {(currentPage - 1) * itemsPerPage + 1} đến{" "}
                  {Math.min(currentPage * itemsPerPage, filteredBookings.length)} trong số {filteredBookings.length} kết
                  quả
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>

                  <div className="flex items-center space-x-1">
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      const page = i + 1
                      return (
                        <button
                          key={page}
                          onClick={() => setCurrentPage(page)}
                          className={`px-3 py-2 text-sm rounded-lg transition-colors ${
                            currentPage === page ? "bg-blue-600 text-white" : "border border-gray-300 hover:bg-gray-50"
                          }`}
                        >
                          {page}
                        </button>
                      )
                    })}
                    {totalPages > 5 && (
                      <>
                        <span className="px-2 text-gray-500">...</span>
                        <button
                          onClick={() => setCurrentPage(totalPages)}
                          className={`px-3 py-2 text-sm rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors ${
                            currentPage === totalPages ? "bg-blue-600 text-white" : ""
                          }`}
                        >
                          {totalPages}
                        </button>
                      </>
                    )}
                  </div>

                  <button
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {filteredBookings.length === 0 && !isLoading && (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Không có booking nào</h3>
              <p className="text-gray-600 mb-4">Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm</p>
              <button
                onClick={() => {
                  setSearchTerm("")
                  setStatusFilter("all")
                  setProcessStatusFilter("all")
                  setDateFilter("all")
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Xóa bộ lọc
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Enhanced Modal */}
      {showModal && selectedBooking && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-xl font-bold">Chi tiết booking</h3>
                  <p className="text-blue-100 mt-1">#{selectedBooking.id}</p>
                </div>
                <button onClick={handleCloseModal} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Customer Info */}
                <div className="space-y-4">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <User className="h-5 w-5 text-blue-600" />
                      Thông tin khách hàng
                    </h4>
                    <div className="space-y-2">
                      <div>
                        <label className="text-sm font-medium text-gray-600">Tên khách hàng</label>
                        <p className="text-gray-900 font-medium">{selectedBooking.userName}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-600">Số điện thoại</label>
                        <a
                          href={`tel:${selectedBooking.phone}`}
                          className="text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1"
                        >
                          <Phone className="h-4 w-4" />
                          {selectedBooking.phone}
                        </a>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <Calendar className="h-5 w-5 text-green-600" />
                      Thông tin đặt sân
                    </h4>
                    <div className="space-y-2">
                      <div>
                        <label className="text-sm font-medium text-gray-600">Sân</label>
                        <p className="text-gray-900 font-medium">{selectedBooking.fieldName}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-600">Ngày</label>
                        <p className="text-gray-900 font-medium">{formatDate(selectedBooking.date)}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Booking Details */}
                <div className="space-y-4">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <Clock className="h-5 w-5 text-purple-600" />
                      Khung giờ đã đặt
                    </h4>
                    <div className="space-y-2">
                      {(() => {
                        const groupedBySubField =
                          selectedBooking.slots?.reduce((acc, slot) => {
                            acc[slot.subField] = acc[slot.subField] || []
                            acc[slot.subField].push(slot.time)
                            return acc
                          }, {}) || {}

                        return Object.entries(groupedBySubField).map(([subField, times], idx) => (
                          <div key={idx} className="flex items-center gap-2 p-2 bg-white rounded border">
                            <MapPin className="h-4 w-4 text-gray-500" />
                            <div>
                              <span className="font-medium text-gray-900">{subField}</span>
                              <div className="text-sm text-gray-600">{groupTimeRanges(times).join(", ")}</div>
                            </div>
                          </div>
                        ))
                      })()}
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <Info className="h-5 w-5 text-amber-600" />
                      Trạng thái
                    </h4>
                    <div className="space-y-3">
                      <div>
                        <label className="text-sm font-medium text-gray-600">Trạng thái thanh toán</label>
                        <div className="mt-1">
                          <span
                            className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                              statusMap[selectedBooking.status || "confirmed_paid"].color
                            }`}
                          >
                            {getStatusIcon(selectedBooking.status)}
                            <span className="ml-1.5">
                              {statusMap[selectedBooking.status || "confirmed_paid"].label}
                            </span>
                          </span>
                        </div>
                      </div>

                      <div>
                        <label className="text-sm font-medium text-gray-600">Tình trạng xử lý</label>
                        <div className="mt-1">
                          <span
                            className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                              processStatusConfig[selectedBooking.processStatus || "waiting_response"].color
                            }`}
                          >
                            {processStatusConfig[selectedBooking.processStatus || "waiting_response"].label}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Price Info */}
              <div className="mt-6 bg-green-50 rounded-lg p-4 border border-green-200">
                <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-green-600" />
                  Thông tin thanh toán
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Mã giảm giá</label>
                    {selectedBooking.voucherCode ? (
                      <div className="mt-1">
                        <div className="inline-flex items-center px-3 py-1 rounded-lg text-sm font-medium bg-blue-100 text-blue-800 border border-blue-200">
                          {selectedBooking.voucherCode}
                        </div>
                        {discount > 0 && (
                          <div className="mt-2 text-green-600 text-sm flex items-center">
                            <CheckCircle className="w-4 h-4 mr-1" />
                            Giảm giá: {formatCurrency(discount)}
                          </div>
                        )}
                      </div>
                    ) : (
                      <p className="text-gray-500 text-sm mt-1">Không sử dụng mã giảm giá</p>
                    )}
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-600">Tổng tiền</label>
                    <div className="mt-1">
                      {discount > 0 ? (
                        <>
                          <p className="text-gray-500 line-through text-sm">
                            {formatCurrency(selectedBooking.totalPrice)}
                          </p>
                          <p className="text-2xl font-bold text-green-700">
                            {formatCurrency(selectedBooking.totalPrice - discount)}
                          </p>
                        </>
                      ) : (
                        <p className="text-2xl font-bold text-green-700">
                          {formatCurrency(selectedBooking.totalPrice)}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Images */}
              {(selectedBooking.paymentImageUrl || selectedBooking.studentCardImageUrl) && (
                <div className="mt-6">
                  <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <CreditCard className="h-5 w-5 text-indigo-600" />
                    Hình ảnh xác nhận
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {selectedBooking.paymentImageUrl && (
                      <div>
                        <label className="text-sm font-medium text-gray-600 mb-2 block">Ảnh thanh toán</label>
                        <div className="relative group">
                          <img
                            src={selectedBooking.paymentImageUrl || "/placeholder.svg"}
                            alt="Thanh toán"
                            className="w-full h-48 object-cover rounded-lg border cursor-zoom-in"
                            onClick={() => setZoomImageUrl(selectedBooking.paymentImageUrl)}
                          />
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors rounded-lg flex items-center justify-center">
                            <ZoomIn className="h-8 w-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                          </div>
                        </div>
                      </div>
                    )}

                    {selectedBooking.studentCardImageUrl && (
                      <div>
                        <label className="text-sm font-medium text-gray-600 mb-2 block">Thẻ sinh viên</label>
                        <div className="relative group">
                          <img
                            src={selectedBooking.studentCardImageUrl || "/placeholder.svg"}
                            alt="Thẻ sinh viên"
                            className="w-full h-48 object-cover rounded-lg border cursor-zoom-in"
                            onClick={() => setZoomImageUrl(selectedBooking.studentCardImageUrl)}
                          />
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors rounded-lg flex items-center justify-center">
                            <ZoomIn className="h-8 w-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Notes */}
              {selectedBooking.notes && (
                <div className="mt-6 bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <FileText className="h-5 w-5 text-gray-600" />
                    Ghi chú
                  </h4>
                  <p className="text-gray-700 leading-relaxed">{selectedBooking.notes}</p>
                </div>
              )}
            </div>

            {/* Modal Actions */}
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
              <div className="flex flex-wrap gap-3">
                {selectedBooking.status === "confirmed_deposit" && (
                  <button
                    onClick={() => {
                      handleStatusChange(selectedBooking.id, "confirmed_paid")
                      setShowModal(false)
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    <CreditCard className="h-4 w-4" />
                    Thanh toán đủ
                  </button>
                )}

                {selectedBooking.status === "confirmed_paid" && (
                  <button
                    onClick={() => {
                      handleStatusChange(selectedBooking.id, "confirmed_deposit")
                      setShowModal(false)
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Wallet className="h-4 w-4" />
                    Chuyển về đặt cọc
                  </button>
                )}

                <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                  <MessageSquare className="h-4 w-4" />
                  Gửi tin nhắn
                </button>

                <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                  <Download className="h-4 w-4" />
                  Xuất hóa đơn
                </button>

                <button
                  onClick={handleCloseModal}
                  className="ml-auto px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Đóng
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Enhanced Image Zoom */}
      {zoomImageUrl && (
        <div
          className="fixed inset-0 bg-black/90 z-[60] flex items-center justify-center p-4"
          onClick={() => setZoomImageUrl(null)}
        >
          <div className="relative max-w-full max-h-full">
            <img
              src={zoomImageUrl || "/placeholder.svg"}
              alt="Zoom ảnh"
              className="max-w-full max-h-full rounded-lg shadow-2xl cursor-zoom-out"
            />
            <button
              onClick={() => setZoomImageUrl(null)}
              className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
