import { useState, useEffect, useRef } from "react"
import {
  ChevronLeft,
  ChevronRight,
  Clock,
  Phone,
  AlertTriangle,
  Calendar,
  User,
  Filter,
  MoreHorizontal,
  Download,
  Printer,
  RefreshCw,
  CheckCircle2,
  Clock3,
  DollarSign,
  BarChart3,
} from "lucide-react"
import { getBookedSlots } from "../../api/submission"
import { useParams } from "react-router-dom"
import { groupTimeRanges } from "../../utils/groupTimeRanges"
import { statusMap } from "../../constants/statusMap"
import BookingLegend from "../../components/common/BookingLegend"

export default function CourtSchedule() {
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [hoveredBooking, setHoveredBooking] = useState(null)
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 })
  const [bookings, setBookings] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [filterStatus, setFilterStatus] = useState("all")
  const [showStats, setShowStats] = useState(false)
  const scheduleRef = useRef(null)
  const { slug } = useParams()

  const courts = ["Sân A", "Sân B", "Sân C", "Sân D", "Sân E", "Sân F"]
  const timeSlots = Array.from({ length: 20 }, (_, i) => `${(5 + i).toString().padStart(2, "0")}:00`)

  const parseTimeRange = (range) => {
    if (!range || !range.includes(" - ")) {
      return { startTime: "00:00", endTime: "00:00" }
    }
    const [start, end] = range.split(" - ")
    return { startTime: start, endTime: end }
  }

  const timeToMinutes = (time) => {
    if (!time || !time.includes(":")) {
      return 0
    }
    const [hours, minutes] = time.split(":").map(Number)
    return hours * 60 + minutes
  }

  const fetchBookedSlots = async () => {
    if (!selectedDate) return
    setIsLoading(true)
    try {
      const dateStr = selectedDate.toLocaleDateString("en-CA")
      const slots = await getBookedSlots(slug, dateStr)
      const grouped = {}
      slots.forEach((s) => {
        if (!grouped[s.id]) {
          grouped[s.id] = {
            id: s.id,
            slot: [],
            phone: s.phone,
            userName: s.userName,
            status: s.status,
          }
        }

        grouped[s.id].slot.push({
          subField: s.subField,
          time: s.time,
        })
      })
      setBookings(Object.values(grouped))
    } catch (error) {
      console.error("Error fetching booked slots", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchBookedSlots()
    const interval = setInterval(fetchBookedSlots, 30000)
    return () => clearInterval(interval)
  }, [slug, selectedDate])

  const getBookingPosition = (booking) => {
    const startMinutes = timeToMinutes(booking.startTime)
    const endMinutes = timeToMinutes(booking.endTime)
    const duration = endMinutes - startMinutes

    const timelineStart = 5 * 60
    const durationTotal = 20 * 60

    const left = ((startMinutes - timelineStart) / durationTotal) * 100
    const width = (duration / durationTotal) * 100

    return { left: `${left}%`, width: `${width}%` }
  }

  const checkConflicts = (booking) => {
    return bookings.some(
      (other) =>
        other.id !== booking.id &&
        other.court === booking.court &&
        timeToMinutes(booking.startTime) < timeToMinutes(other.endTime) &&
        timeToMinutes(booking.endTime) > timeToMinutes(other.startTime),
    )
  }

  const formatDuration = (startTime, endTime) => {
    const duration = timeToMinutes(endTime) - timeToMinutes(startTime)
    const hours = Math.floor(duration / 60)
    const minutes = duration % 60
    return minutes === 0 ? `${hours}h` : `${hours}h${minutes}m`
  }

  const nextDay = () => {
    const next = new Date(selectedDate)
    next.setDate(selectedDate.getDate() + 1)
    setSelectedDate(next)
  }

  const prevDay = () => {
    const prev = new Date(selectedDate)
    prev.setDate(selectedDate.getDate() - 1)
    setSelectedDate(prev)
  }

  const handleMouseEnter = (bookingId, court, event) => {
    setHoveredBooking({ id: bookingId, court })
    setTooltipPosition({ x: event.clientX, y: event.clientY })
  }

  const handleMouseLeave = () => {
    setHoveredBooking(null)
  }

  const handleMouseMove = (event) => {
    if (hoveredBooking) {
      setTooltipPosition({ x: event.clientX, y: event.clientY })
    }
  }

  const groupedSlot = (court) => {
    return bookings
      .flatMap((booking) => {
        const slots = (booking.slot || []).filter((s) => s?.subField === court && s?.time).map((s) => s.time)
        const grouped = groupTimeRanges(slots)
        return grouped.map((range) => {
          const { startTime, endTime } = parseTimeRange(range)
          return {
            ...booking,
            startTime,
            endTime,
            court,
          }
        })
      })
      .filter((booking) => {
        if (filterStatus === "all") return true
        return booking.status === filterStatus
      })
  }

  const getCurrentTimePosition = () => {
    const now = new Date()
    const hours = now.getHours()
    const minutes = now.getMinutes()
    const totalMinutes = hours * 60 + minutes
    const timelineStart = 5 * 60
    const durationTotal = 20 * 60

    const position = ((totalMinutes - timelineStart) / durationTotal) * 100
    return position >= 0 && position <= 100 ? `${position}%` : null
  }


  const getBookingStats = () => {
    const totalBookings = bookings.length
    const statusCounts = bookings.reduce((acc, booking) => {
      const status = booking.status || "confirmed_paid"
      acc[status] = (acc[status] || 0) + 1
      return acc
    }, {})

    const courtUsage = courts.map((court) => {
      const courtBookings = groupedSlot(court)
      const totalMinutes = courtBookings.reduce((total, booking) => {
        return total + (timeToMinutes(booking.endTime) - timeToMinutes(booking.startTime))
      }, 0)
      return {
        court,
        bookings: courtBookings.length,
        hours: Math.round((totalMinutes / 60) * 10) / 10,
      }
    })

    return { totalBookings, statusCounts, courtUsage }
  }

  const stats = getBookingStats()
  const currentTimePosition = getCurrentTimePosition()

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-[1400px] mx-auto p-4 lg:p-6">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6">
          <div className="p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                <Calendar className="h-6 w-6 text-blue-600" />
                Lịch đặt sân
              </h1>
              <p className="text-gray-500 mt-1">Quản lý lịch đặt sân và theo dõi trạng thái đặt sân</p>
            </div>

            <div className="flex items-center gap-3 self-end md:self-auto">
              <button
                onClick={() => setShowStats(!showStats)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
              >
                <BarChart3 className="h-4 w-4 text-blue-600" />
                <span>{showStats ? "Ẩn thống kê" : "Xem thống kê"}</span>
              </button>

              <div className="relative group">
                <button className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors">
                  <MoreHorizontal className="h-5 w-5 text-gray-600" />
                </button>
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 hidden group-hover:block z-10">
                  <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2">
                    <Download className="h-4 w-4" />
                    <span>Xuất Excel</span>
                  </button>
                  <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2">
                    <Printer className="h-4 w-4" />
                    <span>In lịch</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Panel */}
          {showStats && (
            <div className="px-6 pb-6 pt-2 border-t border-gray-100">
              <h3 className="text-sm font-medium text-gray-500 mb-3">
                Thống kê ngày {selectedDate.toLocaleDateString("vi-VN")}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm text-blue-600 font-medium">Tổng số đặt sân</p>
                      <p className="text-2xl font-bold text-blue-700 mt-1">{stats.totalBookings}</p>
                    </div>
                    <div className="bg-blue-100 p-2 rounded-full">
                      <Calendar className="h-5 w-5 text-blue-600" />
                    </div>
                  </div>
                </div>

                <div className="bg-green-50 rounded-lg p-4 border border-green-100">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm text-green-600 font-medium">Đã xác nhận</p>
                      <p className="text-2xl font-bold text-green-700 mt-1">
                        {stats.statusCounts?.confirmed_paid || 0}
                      </p>
                    </div>
                    <div className="bg-green-100 p-2 rounded-full">
                      <CheckCircle2 className="h-5 w-5 text-green-600" />
                    </div>
                  </div>
                </div>

                <div className="bg-amber-50 rounded-lg p-4 border border-amber-100">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm text-amber-600 font-medium">Chờ xác nhận</p>
                      <p className="text-2xl font-bold text-amber-700 mt-1">{stats.statusCounts?.unpaid || 0}</p>
                    </div>
                    <div className="bg-amber-100 p-2 rounded-full">
                      <Clock3 className="h-5 w-5 text-amber-600" />
                    </div>
                  </div>
                </div>

                <div className="bg-purple-50 rounded-lg p-4 border border-purple-100">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm text-purple-600 font-medium">Tổng giờ đặt</p>
                      <p className="text-2xl font-bold text-purple-700 mt-1">
                        {stats.courtUsage.reduce((total, court) => total + court.hours, 0)}h
                      </p>
                    </div>
                    <div className="bg-purple-100 p-2 rounded-full">
                      <DollarSign className="h-5 w-5 text-purple-600" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-4 bg-white rounded-lg border border-gray-200 overflow-hidden">
                <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
                  <h3 className="font-medium text-gray-700">Thống kê theo sân</h3>
                </div>
                <div className="p-4">
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
                    {stats.courtUsage.map((court) => (
                      <div key={court.court} className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                        <p className="font-medium text-gray-800">{court.court}</p>
                        <div className="flex justify-between items-center mt-1 text-sm">
                          <span className="text-gray-500">{court.bookings} lượt</span>
                          <span className="text-blue-600 font-medium">{court.hours}h</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Schedule */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden" ref={scheduleRef}>
          {/* Schedule Header */}
          <div className="p-4 md:p-6 border-b border-gray-200 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center space-x-2">
                <button
                  onClick={prevDay}
                  className="p-2 border rounded-lg hover:bg-gray-50 transition-colors touch-manipulation"
                >
                  <ChevronLeft className="h-5 w-5 text-gray-600" />
                </button>
                <div className="min-w-[150px] text-center">
                  <div className="font-bold text-lg text-gray-800">
                    {selectedDate.toLocaleDateString("vi-VN", {
                      day: "numeric",
                      month: "numeric",
                    })}
                  </div>
                  <div className="text-xs text-gray-500">
                    {selectedDate.toLocaleDateString("vi-VN", {
                      weekday: "long",
                      year: "numeric",
                    })}
                  </div>
                </div>
                <button
                  onClick={nextDay}
                  className="p-2 border rounded-lg hover:bg-gray-50 transition-colors touch-manipulation"
                >
                  <ChevronRight className="h-5 w-5 text-gray-600" />
                </button>
              </div>

              <button
                onClick={fetchBookedSlots}
                className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
              >
                <RefreshCw className={`h-4 w-4 text-blue-600 ${isLoading ? "animate-spin" : ""}`} />
                <span>Làm mới</span>
              </button>
            </div>

            <div className="flex items-center gap-3 w-full md:w-auto">
              <div className="relative flex-1 md:flex-none">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Filter className="w-4 h-4 text-gray-500" />
                </div>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="all">Tất cả trạng thái</option>
                  <option value="confirmed_paid">Đã xác nhận</option>
                  <option value="confirmed_deposit">Đã đặt cọc</option>
                  <option value="unpaid">Chờ xác nhận</option>
                  <option value="paid">Đã thanh toán</option>
                </select>
              </div>

              <div className="hidden md:flex items-center gap-2">
                <BookingLegend config={true} />
              </div>
            </div>
          </div>

          {/* Schedule Content */}
          <div className="p-4 md:p-6" onMouseMove={handleMouseMove}>
            <div className="space-y-6">
              {/* Time Header */}
              <div className="flex border-b pb-2">
                <div className="w-20 md:w-24 flex-shrink-0" />
                <div className="flex-1 overflow-x-auto">
                  <div className="flex min-w-[900px]">
                    {timeSlots.map((time) => (
                      <div key={time} className="flex-1 text-center text-xs text-gray-500 border-l px-1">
                        <span className="font-medium">{time}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Courts */}
              <div className="space-y-4">
                {courts.map((court) => {
                  const courtBookings = groupedSlot(court)
                  return (
                    <div key={court} className="flex items-center">
                      <div className="w-20 md:w-24 text-right pr-4 font-medium text-gray-800">{court}</div>
                      <div className="flex-1 overflow-x-auto">
                        <div className="relative h-16 md:h-20 bg-gray-50 rounded-lg border border-gray-200 min-w-[900px]">
                          {/* Time grid lines */}
                          {timeSlots.map((_, i) => (
                            <div
                              key={i}
                              className="absolute top-0 bottom-0 border-l border-gray-200"
                              style={{ left: `${(i / timeSlots.length) * 100}%` }}
                            />
                          ))}

                          {/* Current time indicator */}
                          {currentTimePosition && selectedDate.toDateString() === new Date().toDateString() && (
                            <div
                              className="absolute top-0 bottom-0 w-0.5 bg-red-500 z-10"
                              style={{ left: currentTimePosition }}
                            >
                              <div className="w-2 h-2 rounded-full bg-red-500 -ml-[3px] -mt-1"></div>
                            </div>
                          )}

                          {/* Bookings */}
                          {courtBookings.map((booking) => {
                            const pos = getBookingPosition(booking)
                            const conflict = checkConflicts(booking)
                            const status = statusMap[booking.status || "confirmed_paid"]

                            return (
                              <div
                                key={`${booking.id}-${booking.court}-${booking.startTime}-${booking.endTime}`}
                                className={`absolute top-1 bottom-1 rounded-lg shadow-sm border-l-4 text-white text-xs font-medium flex items-center justify-between cursor-pointer transition-all hover:shadow-md ${status.background} ${conflict ? "ring-2 ring-red-500" : ""} border-l-${status.borderColor}`}
                                style={pos}
                                onMouseEnter={(e) => handleMouseEnter(booking.id, booking.court, e)}
                                onMouseLeave={handleMouseLeave}
                              >
                                <div className="px-2 py-1 truncate flex-1">
                                  <div className="font-medium text-sm leading-tight truncate">{booking.userName}</div>
                                  <div className="text-xs opacity-90 leading-tight flex items-center gap-1">
                                    <Clock className="h-3 w-3" />
                                    <span>
                                      {booking.startTime}-{booking.endTime}
                                    </span>
                                  </div>
                                </div>
                                {conflict && (
                                  <div className="px-1">
                                    <AlertTriangle className="h-4 w-4 text-red-300" />
                                  </div>
                                )}
                              </div>
                            )
                          })}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* Mobile Legend */}
              <div className="md:hidden flex flex-wrap items-center justify-center gap-3 pt-4 border-t">
                <BookingLegend config={true} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tooltip */}
      {hoveredBooking && (
        <div
          className="fixed z-50 bg-white text-gray-800 p-4 rounded-lg shadow-xl max-w-xs pointer-events-none border border-gray-200"
          style={{
            left:
              typeof window !== "undefined"
                ? Math.min(tooltipPosition.x + 10, window.innerWidth - 250)
                : tooltipPosition.x + 10,
            top: tooltipPosition.y - 10,
          }}
        >
          {(() => {
            const court = hoveredBooking?.court
            const newBooking = groupedSlot(court)
            const booking = newBooking.find((b) => b.id === hoveredBooking.id)

            if (!booking) return null
            const conflict = checkConflicts(booking)
            const status = statusMap[booking.status || "confirmed_paid"]

            return (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="font-bold text-gray-800">{booking.userName}</div>
                  <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${status.tooltipColor}`}>
                    {status.label}
                  </span>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="bg-gray-100 p-1 rounded">
                      <Phone className="h-4 w-4 text-gray-600" />
                    </div>
                    <span>{booking.phone}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="bg-gray-100 p-1 rounded">
                      <Clock className="h-4 w-4 text-gray-600" />
                    </div>
                    <div>
                      <div>
                        {booking.startTime} - {booking.endTime}
                      </div>
                      <div className="text-xs text-gray-500">
                        Thời lượng: {formatDuration(booking.startTime, booking.endTime)}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="bg-gray-100 p-1 rounded">
                      <User className="h-4 w-4 text-gray-600" />
                    </div>
                    <span>ID: {booking.id}</span>
                  </div>

                  {conflict && (
                    <div className="bg-red-50 text-red-700 p-2 rounded-lg flex items-center gap-2 text-xs font-medium">
                      <AlertTriangle className="h-4 w-4" />
                      <span>Xung đột thời gian với đơn đặt sân khác!</span>
                    </div>
                  )}
                </div>
              </div>
            )
          })()}
        </div>
      )}
    </div>
  )
}
