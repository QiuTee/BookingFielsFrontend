import { useEffect, useState } from "react"
import { getBookingsForOwner, updateBookingStatus , getField} from "../../api/submission"
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
  Wallet,
  CheckCircle2,
  XCircle,
  Banknote,
  Eye,
  DollarSign,
} from "lucide-react"
import StatCard from "../../features/owner/StatCard"
import FieldCard from "../../features/owner/FieldCard"
import caculateTotalRevenueByStatus from "../../utils/CaculateTotalRevenueByStatus"
import { useField } from "../../context/FieldContext"
import formatCurrency from "../../utils/FormatCurrency"
export default function DashboardHome() {
  const [bookings, setBookings] = useState([])
  const [selectedBooking, setSelectedBooking] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("available")
  const { slug } = useParams()
  const {fields , refreshFields} = useField()
  const currentField = fields.find((f) => f.slug === slug)


  const fetchBookings = async() => {
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
    fetchBookings()
    const interval = setInterval(fetchBookings, 15000)
    return () => clearInterval(interval)
  }, [slug])

  const handleUpdate = async () => {
    await refreshFields();
  };

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
  const stats = {
    total: bookings.length,
    paid: bookings.filter((b) => b.status === "paid").length,
    completed: bookings.filter((b) => b.status === "confirmed_paid").length,
    deposit: bookings.filter((b) => b.status === "confirmed_deposit").length,
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Tổng quan</h1>
          <p className="text-gray-500 mt-1">Quản lý sân bóng và lịch đặt sân</p>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          <StatCard
            title="Tổng lượt đặt sân"
            value={stats.total}
            icon={<Calendar className="h-5 w-5" />}
          />
          <StatCard
            title="Đã thanh toán"
            value={stats.paid}
            icon={<CheckCircle className="h-5 w-5" />}
          />
          <StatCard
            title="Doanh thu"
            value={formatCurrency(caculateTotalRevenueByStatus(bookings , currentField?.price))}
            icon={<DollarSign className="h-5 w-5" />}
          />
          <StatCard
            title="Đã cọc"
            value={stats.deposit}
            icon={<Wallet className="h-5 w-5" />}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-100">
            <div className="p-6 pb-2 flex flex-row items-center justify-between">
              <div>
                <h2 className="text-xl font-bold">Lịch đặt sân gần đây</h2>
                <p className="text-sm text-gray-500">Quản lý các lịch đặt sân mới nhất</p>
              </div>
              <button 
                className="inline-flex items-center justify-center gap-1 px-3 py-1.5 text-sm font-medium rounded-md border border-gray-200 bg-white hover:bg-gray-50 text-gray-700"
                onClick={fetchBookings}
                >
                  <RefreshCw className="h-4 w-4" />
                  <span className="hidden sm:inline">Làm mới</span>
              </button>
            </div>
            <div className="p-6 pt-2">
              {isLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-24 bg-gray-100 animate-pulse rounded-lg"></div>
                  ))}
                </div>
              ) : bookings.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">Chưa có lịch đặt sân nào</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {bookings.slice(0, 5).map((b) => {
                    const groupedBySubField =
                      b.slots?.reduce((acc, slot) => {
                        acc[slot.subField] = acc[slot.subField] || []
                        acc[slot.subField].push(slot.time)
                        return acc
                      }, {}) || {}

                    return (
                      <div
                        key={b.id}
                        className="bg-white border border-gray-100 rounded-lg p-4 hover:shadow-md transition-shadow"
                      >
                        <div className="flex flex-col sm:flex-row justify-between gap-4">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <h3 className="font-medium text-gray-900">{b.userName}</h3>
                              <span
                                className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${statusMap[b.status || "confirmed"].color}`}
                              >
                                {statusMap[b.status || "confirmed"].label}
                              </span>
                              <span
                                className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${processStatusConfig[b.processStatus || "waiting_response"].color}`}
                              >
                                {processStatusConfig[b.processStatus || "waiting_response"].label}
                              </span>
                              
                            </div>
                            <div className="flex items-center text-sm text-gray-500 gap-1">
                              <Calendar className="h-4 w-4" />
                              <span>{new Date(b.date).toLocaleDateString("vi-VN")}</span>
                              <span>•</span>
                              <span>{b.fieldName}</span>
                            </div>
                            {Object.entries(groupedBySubField).map(([subField, times], idx) => (
                              <div key={idx} className="flex items-center text-sm text-gray-500 gap-1">
                                <Clock className="h-4 w-4" />
                                <span>{subField}:</span>
                                <span>{groupTimeRanges(times).join(", ")}</span>
                              </div>
                            ))}
                            <a
                              href={`tel:${b.phone}`}
                              className="flex items-center text-sm text-gray-500 gap-1 hover:text-gray-700"
                            >
                              <Phone className="h-4 w-4" />
                              <span>{b.phone}</span>
                            </a>
                          </div>

                          <div className="flex flex-col gap-2 sm:items-end">
                            <button
                              className="inline-flex items-center text-gray-500 hover:text-gray-700 gap-1 text-sm self-start sm:self-auto"
                              onClick={() => setSelectedBooking(b)}
                            >
                              <Eye className="h-4 w-4" />
                              <span>Chi tiết</span>
                            </button>

                            {(b.status === "paid" || b.status === "unpaid") && (
                              <div className="flex flex-wrap gap-2 mt-2">
                                {b.status === "paid" && (
                                  <>
                                    <button
                                      onClick={() => handleStatusChange(b.id, "confirmed_paid")}
                                      className="inline-flex items-center px-3 py-1.5 text-sm font-medium rounded-md bg-green-600 hover:bg-green-700 text-white gap-1"
                                    >
                                      <CheckCircle2 className="h-4 w-4" />
                                      <span>Thanh toán đủ</span>
                                    </button>

                                    <button
                                      onClick={() => handleStatusChange(b.id, "confirmed_deposit")}
                                      className="inline-flex items-center px-3 py-1.5 text-sm font-medium rounded-md bg-teal-600 hover:bg-teal-700 text-white gap-1"
                                    >
                                      <Banknote className="h-4 w-4" />
                                      <span>Đặt cọc</span>
                                    </button>
                                  </>
                                )}

                                <button
                                  onClick={() => handleStatusChange(b.id, "canceled")}
                                  className="inline-flex items-center px-3 py-1.5 text-sm font-medium rounded-md bg-red-600 hover:bg-red-700 text-white gap-1"
                                >
                                  <XCircle className="h-4 w-4" />
                                  <span>Từ chối</span>
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
            <div className="px-6 py-4 flex justify-end border-t border-gray-100">
              <a
                href={`/san/${slug}/owner/bookings`}
                className="text-blue-600 hover:text-blue-800 inline-flex items-center gap-1 text-sm font-medium"
              >
                Xem tất cả lịch sử đặt sân
                <ChevronRight className="h-4 w-4" />
              </a>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-100">
            <div className="p-6 pb-2 flex items-start justify-between">
              <div>
                <h2 className="text-xl font-bold">Quản lý sân</h2>
                <p className="text-sm text-gray-500">Thông tin và trạng thái các sân</p>
              </div>
              <button 
                className="inline-flex items-center justify-center gap-1 px-3 py-1.5 text-sm font-medium rounded-md border border-gray-200 bg-white hover:bg-gray-50 text-gray-700"
                onClick={handleUpdate}
              >
                <RefreshCw className="h-4 w-4" />
              </button>
            </div>

            <div className="p-6 pt-2">
              <div className="space-y-4">
                <div>
                  <div className="flex border-b border-gray-200 mb-4">
                    <button
                      className={`px-4 py-2 text-sm font-medium ${activeTab === "available" ? "border-b-2 border-blue-600 text-blue-600" : "text-gray-500 hover:text-gray-700"}`}
                      onClick={() => setActiveTab("available")}
                    >
                      Có sẵn
                    </button>
                    <button
                      className={`px-4 py-2 text-sm font-medium ${activeTab === "all" ? "border-b-2 border-blue-600 text-blue-600" : "text-gray-500 hover:text-gray-700"}`}
                      onClick={() => setActiveTab("all")}
                    >
                      Tất cả
                    </button>
                  </div>
                  <div className="space-y-4">
                    {fields
                      .filter((f) => activeTab === "all" || f.status === "active")
                      .map((f) => (
                        <FieldCard key={f.id} field={f} />
                      ))}
                  </div>
                </div>
              </div>
            </div>
            <div className="px-6 py-4 flex justify-center border-t border-gray-100">
              <button className="px-4 py-2 text-sm font-medium rounded-md border border-gray-200 bg-white hover:bg-gray-50 text-gray-700">
                Quản lý tất cả sân
              </button>
            </div>
          </div>
        </div>
      </div>

      {selectedBooking && <BookingDetailModal booking={selectedBooking} onClose={() => setSelectedBooking(null)} />}
    </div>
  )
}


