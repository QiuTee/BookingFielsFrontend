import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { statusMap } from "../../constants/statusMap"
import { processStatusConfig } from "../../constants/statusProcess"
import {
  X,
  Calendar,
  Clock,
  Phone,
  User,
  MapPin,
  CreditCard,
  FileText,
  Download,
  ZoomIn,
  CheckCircle2,
  AlertCircle,
  DollarSign,
} from "lucide-react"
import { groupTimeRanges } from "../../utils/groupTimeRanges"
import formatCurrency from "../../utils/FormatCurrency"

export default function BookingDetailModal({ booking, onClose }) {
  const [zoomImage, setZoomImage] = useState(false)
  const [activeImageTab, setActiveImageTab] = useState("payment")

  if (!booking) return null

  const groupedBySubField =
    booking.slots?.reduce((acc, slot) => {
      acc[slot.subField] = acc[slot.subField] || []
      acc[slot.subField].push(slot.time)
      return acc
    }, {}) || {}

  const totalAmount = booking.totalPrice || 0

  return (
    <>
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">Chi tiết đặt sân</h2>
                <p className="text-blue-100 mt-1">ID: #{booking.id}</p>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                <X className="h-6 w-6" />
              </button>
            </div>
          </div>

          <div className="overflow-y-auto max-h-[calc(90vh-120px)]">
            <div className="p-6">
              {/* Status and Basic Info */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                <div className="lg:col-span-2">
                  <div className="bg-gray-50 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Thông tin khách hàng</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="flex items-center gap-3">
                        <div className="bg-blue-100 p-2 rounded-lg">
                          <User className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Tên khách hàng</p>
                          <p className="font-medium text-gray-900">{booking.userName}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="bg-green-100 p-2 rounded-lg">
                          <Phone className="h-5 w-5 text-green-600" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Số điện thoại</p>
                          <a
                            href={`tel:${booking.phone}`}
                            className="font-medium text-gray-900 hover:text-blue-600 transition-colors"
                          >
                            {booking.phone}
                          </a>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="bg-purple-100 p-2 rounded-lg">
                          <Calendar className="h-5 w-5 text-purple-600" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Ngày đặt</p>
                          <p className="font-medium text-gray-900">
                            {new Date(booking.date).toLocaleDateString("vi-VN", {
                              weekday: "long",
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="bg-orange-100 p-2 rounded-lg">
                          <MapPin className="h-5 w-5 text-orange-600" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Sân</p>
                          <p className="font-medium text-gray-900">{booking.fieldName}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="bg-white border border-gray-200 rounded-xl p-4">
                    <h4 className="font-medium text-gray-900 mb-3">Trạng thái</h4>
                    <div className="space-y-2">
                      <span
                        className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium ${statusMap[booking.status || "confirmed"].color}`}
                      >
                        <CheckCircle2 className="h-4 w-4 mr-1.5" />
                        {statusMap[booking.status || "confirmed"].label}
                      </span>

                      {booking.processStatus && (
                        <span
                          className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium ${processStatusConfig[booking.processStatus].color}`}
                        >
                          <AlertCircle className="h-4 w-4 mr-1.5" />
                          {processStatusConfig[booking.processStatus].label}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <DollarSign className="h-5 w-5 text-green-600" />
                      <h4 className="font-medium text-green-900">Tổng tiền</h4>
                    </div>
                    <p className="text-2xl font-bold text-green-700">{formatCurrency(totalAmount)}</p>
                  </div>
                </div>
              </div>

              {/* Time Slots */}
              <div className="bg-gray-50 rounded-xl p-6 mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Khung giờ đã đặt</h3>
                <div className="space-y-3">
                  {Object.entries(groupedBySubField).map(([subField, times], idx) => (
                    <div key={idx} className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-200">
                      <div className="bg-blue-100 p-2 rounded-lg">
                        <Clock className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{subField}</p>
                        <p className="text-sm text-gray-600">{groupTimeRanges(times).join(", ")}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Payment Images */}
              {(booking.paymentImageUrl || booking.studentCardImageUrl) && (
                <div className="bg-gray-50 rounded-xl p-6 mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Hình ảnh xác nhận</h3>

                  <div className="flex gap-2 mb-4">
                    {booking.paymentImageUrl && (
                      <button
                        onClick={() => setActiveImageTab("payment")}
                        className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                          activeImageTab === "payment"
                            ? "bg-blue-600 text-white"
                            : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                        }`}
                      >
                        Ảnh thanh toán
                      </button>
                    )}
                    {booking.studentCardImageUrl && (
                      <button
                        onClick={() => setActiveImageTab("student")}
                        className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                          activeImageTab === "student"
                            ? "bg-blue-600 text-white"
                            : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                        }`}
                      >
                        Thẻ sinh viên
                      </button>
                    )}
                  </div>

                  <div className="relative">
                    {activeImageTab === "payment" && booking.paymentImageUrl && (
                      <div className="relative group">
                        <img
                          src={booking.paymentImageUrl || "/placeholder.svg"}
                          alt="Ảnh thanh toán"
                          className="w-full max-w-md h-auto rounded-lg border border-gray-200 cursor-zoom-in"
                          onClick={() => setZoomImage(booking.paymentImageUrl)}
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors rounded-lg flex items-center justify-center">
                          <ZoomIn className="h-8 w-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                      </div>
                    )}

                    {activeImageTab === "student" && booking.studentCardImageUrl && (
                      <div className="relative group">
                        <img
                          src={booking.studentCardImageUrl || "/placeholder.svg"}
                          alt="Thẻ sinh viên"
                          className="w-full max-w-md h-auto rounded-lg border border-gray-200 cursor-zoom-in"
                          onClick={() => setZoomImage(booking.studentCardImageUrl)}
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors rounded-lg flex items-center justify-center">
                          <ZoomIn className="h-8 w-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Notes */}
              {booking.notes && (
                <div className="bg-gray-50 rounded-xl p-6 mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Ghi chú</h3>
                  <div className="flex items-start gap-3">
                    <div className="bg-gray-100 p-2 rounded-lg">
                      <FileText className="h-5 w-5 text-gray-600" />
                    </div>
                    <p className="text-gray-700 leading-relaxed">{booking.notes}</p>
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex flex-wrap gap-3 pt-4 border-t border-gray-200">
                <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  <Download className="h-4 w-4" />
                  <span>Tải xuống</span>
                </button>

                <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                  <CreditCard className="h-4 w-4" />
                  <span>Xem lịch sử thanh toán</span>
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Image Zoom Modal */}
      <AnimatePresence>
        {zoomImage && (
          <motion.div
            className="fixed inset-0 bg-black/90 z-[60] flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setZoomImage(false)}
          >
            <motion.img
              src={zoomImage}
              alt="Zoom ảnh"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              transition={{ duration: 0.3 }}
              className="max-w-full max-h-full rounded-lg shadow-2xl cursor-zoom-out"
            />
            <button
              onClick={() => setZoomImage(false)}
              className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
