import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight, Clock, Phone, AlertTriangle } from "lucide-react"
import { getBookedSlots } from "../../api/submission"
import { useParams } from "react-router-dom"
import { groupTimeRanges } from "../../utils/groupTimeRanges"

export default function CourtSchedule() {
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [hoveredBooking, setHoveredBooking] = useState(null)
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 })
  const [bookings, setBookings] = useState([])
  const { slug } = useParams()
  const courts = ["Sân A", "Sân B", "Sân C", "Sân D", "Sân E", "Sân F"]
  const timeSlots = Array.from({ length: 20 }, (_, i) => `${(5 + i).toString().padStart(2, "0")}:00`)

  const parseTimeRange = (range) => {
    if (!range || !range.includes(" - ")) {
      //   console.warn("[parseTimeRange] Invalid range:", range);
      return { startTime: "00:00", endTime: "00:00" }
    }
    const [start, end] = range.split(" - ")
    return { startTime: start, endTime: end }
  }

  const timeToMinutes = (time) => {
    if (!time || !time.includes(":")) {
      //   console.warn("[timeToMinutes] Invalid time:", time);
      return 0
    }
    const [hours, minutes] = time.split(":").map(Number)
    return hours * 60 + minutes
  }



  useEffect(() => {
    const fetchBookedSlots = async () => {
      if (!selectedDate) return
      try {
        const dateStr = selectedDate.toLocaleDateString("en-CA")
        const slots = await getBookedSlots(slug, dateStr)
        // console.log("Fetched booked slots:", slots);
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
        console.log("Grouped booked slots:", grouped)
        setBookings(Object.values(grouped))
      } catch (error) {
        console.error("Error fetching booked slots", error)
      }
    }
    fetchBookedSlots()
    const interval = setInterval(fetchBookedSlots, 15000)
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


  const getBookingColor = (status) => {
    return status === "confirmed"
      ? "bg-blue-500 hover:bg-blue-600 border-blue-600"
      : "bg-yellow-500 hover:bg-yellow-600 border-yellow-600"
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

  const handleMouseEnter = (bookingId, event) => {
    setHoveredBooking(bookingId)
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

  return (
    <div className="p-2 sm:p-4 lg:p-6 max-w-full lg:max-w-6xl mx-auto">
      <div className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
        <div className="px-3 sm:px-6 py-3 sm:py-4 border-b border-gray-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0">
          <div className="flex items-center space-x-2">
            <Clock className="h-4 w-4 sm:h-5 sm:w-5 text-gray-600" />
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Lịch đặt sân</h2>
          </div>
          <div className="flex items-center space-x-2 w-full sm:w-auto justify-center sm:justify-end">
            <button onClick={prevDay} className="p-2 border rounded-md hover:bg-gray-50 touch-manipulation">
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span className="min-w-[120px] sm:min-w-[150px] text-center font-medium text-sm sm:text-base px-2">
              {selectedDate.toLocaleDateString("vi-VN", {
                weekday: "long",
                day: "numeric",
                month: "numeric",
                year: "numeric",
              })}
            </span>
            <button onClick={nextDay} className="p-2 border rounded-md hover:bg-gray-50 touch-manipulation">
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="p-2 sm:p-4 lg:p-6" onMouseMove={handleMouseMove}>
          <div className="space-y-3 sm:space-y-6">
            <div className="flex border-b pb-2">
              <div className="w-12 sm:w-16 lg:w-20 flex-shrink-0" />
              <div className="flex-1 overflow-x-auto">
                <div className="flex min-w-[800px] lg:min-w-0">
                  {timeSlots.map((time) => (
                    <div key={time} className="flex-1 text-center text-xs sm:text-sm text-gray-500 border-l px-1">
                      <span className="hidden sm:inline">{time}</span>
                      <span className="sm:hidden">{time.split(":")[0]}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-2 sm:space-y-3">
              {courts.map((court) => {
                const courtBookings = bookings.flatMap((booking) => {
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
                console.log(">>> Court bookings for", court, ":", courtBookings)
                return (
                  <div key={court} className="flex items-center">
                    <div className="w-12 sm:w-16 lg:w-20 text-right pr-2 sm:pr-4 font-medium text-gray-700 text-xs sm:text-sm">
                      <span className="hidden sm:inline">{court}</span>
                      <span className="sm:hidden">{court.split(" ")[1]}</span>
                    </div>
                    <div className="flex-1 overflow-x-auto">
                      <div className="relative h-12 sm:h-14 lg:h-16 bg-gray-50 rounded-lg border min-w-[800px] lg:min-w-0">
                        {timeSlots.map((_, i) => (
                          <div
                            key={i}
                            className="absolute top-0 bottom-0 border-l border-gray-200"
                            style={{ left: `${(i / timeSlots.length) * 100}%` }}
                          />
                        ))}

                        {courtBookings.map((booking) => {
                          const pos = getBookingPosition(booking)
                          const conflict = checkConflicts(booking)
                          return (
                            <div
                              key={`${booking.id}`}
                              className={`absolute top-1 bottom-1 rounded-md border-2 text-white text-xs font-medium flex items-center justify-center cursor-pointer touch-manipulation ${getBookingColor(
                                booking.status,
                              )} ${conflict ? "ring-2 ring-red-500 ring-offset-1" : ""}`}
                              style={pos}
                              onMouseEnter={(e) => handleMouseEnter(booking.id, e)}
                              onMouseLeave={handleMouseLeave}
                            >
                              <div className="px-1 sm:px-2 truncate text-center">
                                <div className="font-medium text-xs sm:text-sm leading-tight">{booking.userName}</div>
                                <div className="text-xs opacity-90 leading-tight">
                                  {booking.startTime}-{booking.endTime}
                                </div>
                              </div>
                              {conflict && <AlertTriangle className="h-3 w-3 text-red-300 ml-1 flex-shrink-0" />}
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 text-xs sm:text-sm pt-4 border-t">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 sm:w-4 sm:h-4 bg-blue-500 rounded" />
                <span>Đã xác nhận</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 sm:w-4 sm:h-4 bg-yellow-500 rounded" />
                <span>Chờ xác nhận</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 sm:w-4 sm:h-4 bg-gray-100 border-2 border-red-500 rounded" />
                <span>Xung đột thời gian</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {hoveredBooking && (
        <div
          className="fixed z-50 bg-gray-900 text-white p-3 rounded-lg shadow-lg max-w-xs pointer-events-none"
          style={{
            left:
              typeof window !== "undefined"
                ? Math.min(tooltipPosition.x + 10, window.innerWidth - 200)
                : tooltipPosition.x + 10,
            top: tooltipPosition.y - 10,
          }}
        >
          {(() => {
            const booking = bookings.find((b) => b.id === hoveredBooking)
            if (!booking) return null
            const conflict = checkConflicts(booking)

            return (
              <div className="space-y-2">
                <div className="font-medium">{booking.userName}</div>
                <div className="space-y-1 text-xs">
                  <div className="flex items-center space-x-1">
                    <Phone className="h-3 w-3" />
                    <span>{booking.phone}</span>
                  </div>
                  <div>
                    <strong>Thời gian:</strong> {booking.startTime} - {booking.endTime}
                  </div>
                  <div>
                    <strong>Thời lượng:</strong> {formatDuration(booking.startTime, booking.endTime)}
                  </div>
                  <div>
                    <span
                      className={`inline-block px-2 py-1 rounded text-xs ${
                        booking.status === "confirmed" ? "bg-green-600 text-white" : "bg-gray-600 text-white"
                      }`}
                    >
                      {booking.status === "confirmed" ? "Đã xác nhận" : "Chờ xác nhận"}
                    </span>
                  </div>
                  {conflict && <div className="text-red-400 font-medium">⚠️ Xung đột thời gian!</div>}
                </div>
              </div>
            )
          })()}
        </div>
      )}
    </div>
  )
}
