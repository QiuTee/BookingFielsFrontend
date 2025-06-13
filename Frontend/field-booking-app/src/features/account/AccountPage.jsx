"use client"

import { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import {
  Calendar,
  User,
  Phone,
  Search,
  Filter,
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
  const [selectedBooking, setSelectedBooking] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [zoomImageUrl, setZoomImageUrl] = useState(null)
  const [discount, setDiscount] = useState(0)
  const { slug } = useParams()
  const { fields } = useField()
  const currentField = fields.find((field) => field.slug === slug)

  useEffect(() => {
    if (!slug) return

    const fetchBookings = async () => {
      try {
        const data = await getBookingsForOwner(slug)
        console.log("data" ,data)
        setBookings(data)
      } catch (error) {
        console.error("Error fetching bookings:", error)
      }
    }
    fetchBookings()
    const interval = setInterval(fetchBookings, 15000)
    return () => clearInterval(interval)
  }, [slug])

  const filteredBookings = bookings.filter((booking) => {
    const matchesSearch =
      booking.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.phone.includes(searchTerm) ||
      booking.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.slots.some((slot) => slot.subField.toLowerCase().includes(searchTerm.toLowerCase()))

    const matchesStatus = statusFilter === "all" || booking.status === statusFilter
    const matchesProcessStatus = processStatusFilter === "all" || booking.processStatus === processStatusFilter

    return matchesSearch && matchesStatus && matchesProcessStatus
  })

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
      console.log(payload)
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
    setDiscount(booking.voucherDiscount || 0)
    setShowModal(true)
  }

  const handleCloseModal = () => {
    setShowModal(false)
    setDiscount(0)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-green-600 rounded-xl flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">{currentField.name}</h1>
                  <div className="flex items-center text-sm text-gray-600">
                    <MapPin className="w-4 h-4 mr-1" />
                    <span>{currentField.location}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm text-gray-600">Hôm nay</p>
                <p className="text-lg font-semibold text-gray-900">{new Date().toLocaleDateString("vi-VN")}</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm border p-4 mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Tìm kiếm theo tên, SĐT, mã booking, sân..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>

            <div className="flex gap-4">
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white"
                >
                  <option value="all">Tất cả trạng thái</option>
                  <option value="confirmed_paid">Đã thanh toán</option>
                  <option value="confirmed_deposit">Đã cọc</option>
                  <option value="canceled">Đã hủy</option>
                </select>
              </div>

              <div className="relative">
                <Info className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <select
                  value={processStatusFilter}
                  onChange={(e) => setProcessStatusFilter(e.target.value)}
                  className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white"
                >
                  <option value="all">Tất cả tình trạng</option>
                  <option value="waiting_response">Đợi khách phản hồi</option>
                  <option value="callback_later">Dự kiến gọi lại sau</option>
                  <option value="no_response">Không phản hồi</option>
                  <option value="confirmed">Đã xác nhận</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Mã booking
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Khách hàng
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Thời gian & Sân
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Trạng thái
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tình trạng
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Giá tiền
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredBookings.map((booking) => (
                  <tr key={booking.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{booking.id}</div>
                      <div className="text-sm text-gray-500">{formatDate(booking.date)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                          <User className="w-4 h-4 text-gray-600" />
                        </div>
                        <div className="ml-3">
                          <div className="text-sm font-medium text-gray-900">{booking.userName}</div>
                          <a className="text-sm text-gray-500 flex items-center" href={`tel:${booking.phone}`}>
                            <Phone className="w-3 h-3 mr-1" />
                            {booking.phone}
                          </a>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {(() => {
                          const groupedBySubField =
                            booking.slots?.reduce((acc, slot) => {
                              acc[slot.subField] = acc[slot.subField] || []
                              acc[slot.subField].push(slot.time)
                              return acc
                            }, {}) || {}

                          return Object.entries(groupedBySubField).map(([subField, times], idx) => (
                            <div key={idx} className="flex items-center text-sm">
                              <MapPin className="w-3 h-3 mr-1 text-gray-400" />
                              <span className="font-medium">{subField}:</span>
                              <div className="flex flex-col space-y-1 max-w-[200px] break-words whitespace-normal">
                                {groupTimeRanges(times).map((range, idx) => (
                                  <span key={idx}>{range}</span>
                                ))}
                              </div>
                            </div>
                          ))
                        })()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          statusMap[booking.status || "confirmed_paid"].color
                        }`}
                      >
                        {getStatusIcon(booking.status)}
                        <span className="ml-1">{statusMap[booking.status || "confirmed_paid"].label}</span>
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="relative">
                        <select
                          value={booking.processStatus || "waiting_response"}
                          onChange={(e) => handleProcessStatusChange(booking.id, e.target.value)}
                          className={`appearance-none pl-3 pr-8 py-1.5 rounded-lg text-xs font-medium border focus:outline-none focus:ring-2 focus:ring-green-500 ${
                            processStatusConfig[booking.processStatus || "waiting_response"].color
                          }`}
                        >
                          <option value="waiting_response">Đợi khách phản hồi</option>
                          <option value="callback_later">Dự kiến gọi lại sau</option>
                          <option value="no_response">Không phản hồi</option>
                          <option value="confirmed">Đã xác nhận</option>
                        </select>
                        <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-3 w-3 pointer-events-none" />
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatCurrency(booking.totalPrice)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => handleViewDetails(booking)}
                          className="text-blue-600 hover:text-blue-900 p-1"
                          title="Xem chi tiết"
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        {booking.status === "confirmed_deposit" && (
                          <button
                            onClick={() => handleStatusChange(booking.id, "confirmed_paid")}
                            className="text-green-600 hover:text-green-900 p-1"
                            title="Thanh toán đủ"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                        )}

                        {(booking.status === "confirmed_paid" || booking.status === "paid") && (
                          <div className="relative group">
                            <button className="text-gray-600 hover:text-gray-900 p-1" title="Thêm thao tác">
                              <MoreHorizontal className="w-4 h-4" />
                            </button>
                            <div className="absolute right-0 top-8 w-48 bg-white rounded-lg shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
                              <div className="py-1">
                                <button
                                  onClick={() => handleStatusChange(booking.id, "confirmed_deposit")}
                                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 flex items-center gap-2"
                                >
                                  <Wallet className="w-4 h-4" />
                                  Chuyển về đặt cọc
                                </button>
                                <button
                                  onClick={() => handleStatusChange(booking.id, "confirmed_paid")}
                                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-green-50 hover:text-green-700 flex items-center gap-2"
                                >
                                  <CheckCircle className="w-4 h-4" />
                                  Xác nhận thanh toán đủ
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
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredBookings.length === 0 && (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Không có booking nào</h3>
              <p className="text-gray-600">Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm</p>
            </div>
          )}
        </div>
      </div>

      {showModal && selectedBooking && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Chi tiết booking</h3>
              <button onClick={handleCloseModal} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-600">Mã booking</label>
                <p className="text-gray-900">{selectedBooking.id}</p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-600">Khách hàng</label>
                <p className="text-gray-900">{selectedBooking.userName}</p>
                <p className="text-sm text-gray-600">{selectedBooking.phone}</p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-600">Sân</label>
                <p className="text-gray-900">{selectedBooking.fieldName}</p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-600">Ngày</label>
                <p className="text-gray-900">{formatDate(selectedBooking.date)}</p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-600">Thời gian & Sân</label>
                {(() => {
                  const groupedBySubField =
                    selectedBooking.slots?.reduce((acc, slot) => {
                      acc[slot.subField] = acc[slot.subField] || []
                      acc[slot.subField].push(slot.time)
                      return acc
                    }, {}) || {}

                  return Object.entries(groupedBySubField).map(([subField, times], idx) => (
                    <div key={idx} className="flex items-center gap-2 text-sm">
                      <Clock className="h-4 w-4 text-gray-500" />
                      <span className="font-medium">{subField}:</span>
                      <span>{groupTimeRanges(times).join(", ")}</span>
                    </div>
                  ))
                })()}
              </div>

              <div>
                <label className="text-sm font-medium text-gray-600">Trạng thái</label>
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    statusMap[selectedBooking.status || "confirmed_paid"].color
                  }`}
                >
                  {getStatusIcon(selectedBooking.status)}
                  <span className="ml-1">{statusMap[selectedBooking.status || "confirmed_paid"].label}</span>
                </span>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-600">Tình trạng</label>
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    processStatusConfig[selectedBooking.processStatus || "waiting_response"].color
                  }`}
                >
                  {processStatusConfig[selectedBooking.processStatus || "waiting_response"].label}
                </span>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-600">Mã giảm giá</label>
                {selectedBooking.voucherCode ? (
                  <div className="mt-1">
                    <div className="inline-flex items-center px-2.5 py-1 rounded-md text-sm font-medium bg-green-50 text-green-700 border border-green-200">
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
                <label className="text-sm font-medium text-gray-600">Giá tiền</label>
                <div>
                  {discount > 0 ? (
                    <>
                      <p className="text-gray-500 line-through">{formatCurrency(selectedBooking.totalPrice)}</p>
                      <p className="text-gray-900 font-semibold">
                        {formatCurrency(selectedBooking.totalPrice - discount)}
                      </p>
                    </>
                  ) : (
                    <p className="text-gray-900 font-semibold">{formatCurrency(selectedBooking.totalPrice)}</p>
                  )}
                </div>
              </div>

              {selectedBooking.paymentImageUrl && (
                <div>
                  <label className="text-sm font-medium text-gray-600">Ảnh thanh toán</label>
                  <img
                    src={selectedBooking.paymentImageUrl || "/placeholder.svg"}
                    alt="Thanh toán"
                    className="w-full h-auto mt-2 cursor-zoom-in border rounded"
                    onClick={() => setZoomImageUrl(selectedBooking.paymentImageUrl)}
                  />
                </div>
              )}
            </div>

            <div className="flex gap-3 mt-6">
              {selectedBooking.status === "confirmed_deposit" && (
                <button
                  onClick={() => {
                    handleStatusChange(selectedBooking.id, "confirmed_paid")
                    setShowModal(false)
                  }}
                  className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
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
                  className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                >
                  <Wallet className="h-4 w-4" />
                  Chuyển về đặt cọc
                </button>
              )}
              <button
                onClick={handleCloseModal}
                className="flex-1 bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {zoomImageUrl && (
        <div
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center"
          onClick={() => setZoomImageUrl(null)}
        >
          <img
            src={zoomImageUrl || "/placeholder.svg"}
            alt="Zoom ảnh thanh toán"
            className="max-w-full max-h-full rounded-lg shadow-lg border-4 border-white cursor-zoom-out"
          />
        </div>
      )}
    </div>
  )
}
