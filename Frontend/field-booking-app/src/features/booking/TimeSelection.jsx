
import { useState, useEffect, useContext } from "react"
import { Star, Calendar, Clock, Info, ChevronRight, Filter, X } from "lucide-react"
import { BookingContext } from "../../context/BookingContext"
import { NotificationContext } from "../../context/NotificationContext"
import { getBookedSlots } from "../../api/submission"
import PricingOverlay from "../../components/layout/PricingOverlay"
import FormatDate from "../../hooks/FormatDate"
import CustomDatePicker from "./CustomDatePicker"
import BookingLegend from "../../components/common/BookingLegend"
import formatCurrency from "../../utils/FormatCurrency"
import { caculateTotalRevenue } from "../../utils/CaculateTotalRevenue"


const timeSlots = []
for (let h = 6; h <= 22; h++) {
  timeSlots.push(`${h.toString().padStart(2, "0")}:00`)
  if (h < 22) timeSlots.push(`${h.toString().padStart(2, "0")}:30`)
}

const fieldLabels = ["Sân A", "Sân B", "Sân C", "Sân D", "Sân E", "Sân F"]
const unavailableFields = ["Sân C"]

export default function TimeSelection({ nextStep }) {
  const [selectedCell, setSelectedCell] = useState([])
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [showPricing, setShowPricing] = useState(false)
  const [bookedSlots, setBookedSlots] = useState({})
  const [showMobileFilters, setShowMobileFilters] = useState(false)
  const [visibleTimeRange, setVisibleTimeRange] = useState({
    start: 0,
    end: timeSlots.length - 1,
  })
  const { bookingData, setBookingData } = useContext(BookingContext)
  const { showNotification } = useContext(NotificationContext)

  useEffect(() => {
    async function fetchSlots() {
      if (!selectedDate || !bookingData.slug) return
      try {
        const dateStr = selectedDate.toLocaleDateString("en-CA")
        const slots = await getBookedSlots(bookingData.slug, dateStr)

        const grouped = {}
        slots.forEach(({ subField, time, status }) => {
          if (!grouped[subField]) grouped[subField] = {}
          grouped[subField][time] = status
        })
        setBookedSlots(grouped)
        setSelectedCell((prev) =>
          prev.filter(({ field, slot }) => {
            const isBooked = grouped[field]?.[slot]
            const isPast = isPastTime(selectedDate, slot)
            return !isBooked && !isPast
          }),
        )
      } catch (error) {
        console.error("Lỗi khi lấy booked slots:", error)
      }
    }

    fetchSlots()
    const interval = setInterval(fetchSlots, 60000)
    return () => clearInterval(interval)
  }, [selectedDate, bookingData.slug])

  useEffect(() => {
    const interval = setInterval(() => {
      setSelectedCell((prev) => prev.filter(({ slot }) => !isPastTime(selectedDate, slot)))
    }, 10000)
    return () => clearInterval(interval)
  }, [selectedDate])

  useEffect(() => {
    const now = new Date()
    const currentHour = now.getHours()

    if (selectedDate.toDateString() === now.toDateString()) {
      const startIndex = Math.max(
        0,
        timeSlots.findIndex((slot) => {
          const slotHour = Number.parseInt(slot.split(":")[0])
          return slotHour >= currentHour
        }) - 2,
      )

      setVisibleTimeRange({
        start: startIndex,
        end: Math.min(startIndex + 12, timeSlots.length - 1),
      })
    } else {
      setVisibleTimeRange({
        start: 0,
        end: 12,
      })
    }
  }, [selectedDate])

  const isPastTime = (dateObj, slot) => {
    const [h, m] = slot.split(":").map(Number)
    const dt = new Date(dateObj)
    dt.setHours(h)
    dt.setMinutes(m)
    dt.setSeconds(0)
    return dt < new Date()
  }

  const validateSubmit = () => {
    if (selectedCell.length === 0) {
      showNotification({ type: "error", message: "Vui lòng chọn ít nhất một khung giờ" })
      return false
    }
    if (!selectedDate) {
      showNotification({ type: "error", message: "Vui lòng chọn ngày" })
      return false
    }
    return true
  }

  const handleNextStep = () => {
    setBookingData((prev) => ({
      ...prev,
      selectDate: selectedDate?.toLocaleDateString("en-CA"),
      selectedCell: selectedCell,
    }))
    console.log("Selected cells:", selectedCell)
    if (validateSubmit()) nextStep?.()
  }

  const toggleCell = (field, slot) => {
    const isSelected = selectedCell.some((cell) => cell.field === field && cell.slot === slot)
    if (isSelected) {
      setSelectedCell((prev) => prev.filter((cell) => !(cell.field === field && cell.slot === slot)))
    } else {
      setSelectedCell((prev) => [...prev, { field, slot }])
    }
  }

  const isCellSelected = (field, slot) => selectedCell.some((cell) => cell.field === field && cell.slot === slot)

  const shiftTimeRange = (direction) => {
    if (direction === "left" && visibleTimeRange.start > 0) {
      setVisibleTimeRange({
        start: Math.max(0, visibleTimeRange.start - 4),
        end: Math.max(12, visibleTimeRange.end - 4),
      })
    } else if (direction === "right" && visibleTimeRange.end < timeSlots.length - 1) {
      setVisibleTimeRange({
        start: Math.min(timeSlots.length - 13, visibleTimeRange.start + 4),
        end: Math.min(timeSlots.length - 1, visibleTimeRange.end + 4),
      })
    }
  }

  const visibleTimeSlots = timeSlots.slice(visibleTimeRange.start, visibleTimeRange.end + 1)

  // Kiểm tra xem có phải giờ cao điểm không
  const isPeakHour = (slot) => {
    const hour = Number.parseInt(slot.split(":")[0])
    return (hour >= 17 && hour <= 21) || (hour >= 8 && hour <= 10)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-700 to-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold">Đặt lịch sân</h1>
              <p className="text-blue-100 mt-1">Chọn thời gian và sân phù hợp với bạn</p>
            </div>
            <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm p-2 rounded-lg">
              <Calendar className="h-5 w-5 text-blue-200" />
              <CustomDatePicker selectedDate={selectedDate} setSelectedDate={setSelectedDate} />
            </div>
          </div>
        </div>
      </div>

      {/* Filters & Legend */}
      <div className="sticky top-0 z-30 bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="hidden md:block">
              <BookingLegend />
            </div>
            <div className="md:hidden">
              <button
                onClick={() => setShowMobileFilters(!showMobileFilters)}
                className="flex items-center gap-2 text-sm text-blue-600 font-medium"
              >
                <Filter className="h-4 w-4" />
                Chú thích
              </button>
            </div>
            <button
              className="text-blue-600 font-medium flex items-center gap-1 hover:text-blue-700 transition-colors"
              onClick={() => setShowPricing(true)}
            >
              <Info className="h-4 w-4" />
              <span>Xem sân & bảng giá</span>
            </button>
          </div>

          {/* Mobile filters */}
          {showMobileFilters && (
            <div className="md:hidden mt-3 p-3 bg-gray-50 rounded-lg border">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-medium text-gray-700">Chú thích</h3>
                <button onClick={() => setShowMobileFilters(false)}>
                  <X className="h-4 w-4 text-gray-500" />
                </button>
              </div>
              <BookingLegend />
            </div>
          )}
        </div>
      </div>

      {/* Notice */}
      <div className="bg-gradient-to-r from-orange-50 to-amber-50 border-l-4 border-orange-400">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-start gap-3">
            <div className="bg-orange-100 rounded-full p-1 mt-0.5">
              <Info className="h-4 w-4 text-orange-600" />
            </div>
            <div>
              <p className="text-sm text-orange-800">
                <span className="font-semibold">Lưu ý:</span> Nếu bạn cần đặt lịch có định vui lòng liên hệ:
                <a href="tel:0374857068" className="font-semibold ml-1 text-orange-700 underline">
                  0374.857.068
                </a>{" "}
                để được hỗ trợ
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="py-6 px-4">
        {showPricing && <PricingOverlay onClose={() => setShowPricing(false)} />}
        <div className="max-w-7xl mx-auto">
          {/* Date info */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="h-5 w-5 text-blue-600" />
              <h2 className="text-xl font-bold text-gray-800">{FormatDate(selectedDate)}</h2>
            </div>
            <p className="text-sm text-gray-600">
              Chọn khung giờ phù hợp với lịch trình của bạn. Các ô màu trắng là thời gian còn trống.
            </p>
          </div>

          {/* Time navigation */}
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => shiftTimeRange("left")}
              disabled={visibleTimeRange.start === 0}
              className="p-2 rounded-full bg-white border shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronRight className="h-5 w-5 text-gray-600 rotate-180" />
            </button>

            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-blue-600" />
              <span className="font-medium text-sm">
                {timeSlots[visibleTimeRange.start]} - {timeSlots[visibleTimeRange.end]}
              </span>
            </div>

            <button
              onClick={() => shiftTimeRange("right")}
              disabled={visibleTimeRange.end === timeSlots.length - 1}
              className="p-2 rounded-full bg-white border shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronRight className="h-5 w-5 text-gray-600" />
            </button>
          </div>

          {/* Booking Table */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
              <table className="w-full border-collapse">
                <thead>
                  <tr>
                    <th className="w-16 p-3 border-b border-r border-gray-200 bg-blue-50 sticky left-0 z-10 text-left">
                      <span className="text-xs uppercase tracking-wider text-gray-500 font-semibold">Sân</span>
                    </th>
                    {visibleTimeSlots.map((slot) => (
                      <th
                        key={slot}
                        className={`min-w-[70px] p-2 border-b border-gray-200 text-xs ${isPeakHour(slot) ? "bg-amber-50" : "bg-gray-50"}`}
                      >
                        <div className="flex flex-col items-center">
                          <span className="font-medium text-gray-700">{slot}</span>
                          {isPeakHour(slot) && (
                            <span className="text-[10px] text-amber-600 mt-0.5 font-medium">Cao điểm</span>
                          )}
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {fieldLabels.map((field, index) => (
                    <tr key={field} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                      <td className="p-3 border-r border-gray-200 sticky left-0 z-10 bg-inherit">
                        <div className="font-medium text-gray-800">{field}</div>
                      </td>
                      {visibleTimeSlots.map((slot) => {
                        const slotStatus = bookedSlots[field]?.[slot]
                        const isPaid = slotStatus === "paid" || slotStatus === "unpaid"
                        const isConfirmed = slotStatus === "confirmed_deposit" || slotStatus === "confirmed_paid"
                        const isBooked = isPaid || isConfirmed
                        const isUnavailable = unavailableFields.includes(field)
                        const isPast = selectedDate && isPastTime(selectedDate, slot)
                        const isSelected = isCellSelected(field, slot)
                        const isDisabled = isUnavailable || isBooked || isPast
                        const isPeak = isPeakHour(slot)

                        let cellClass = "h-12 w-full border border-gray-200 relative transition-all duration-200"

                        if (isUnavailable) {
                          cellClass += " bg-gray-300"
                        } else if (isConfirmed) {
                          cellClass += " bg-gradient-to-br from-red-500 to-red-600"
                        } else if (isPaid) {
                          cellClass += " bg-gradient-to-br from-yellow-400 to-yellow-500"
                        } else if (isSelected) {
                          cellClass += " bg-gradient-to-br from-blue-400 to-blue-500 border-2 border-blue-600 shadow-md"
                        } else if (isPast) {
                          cellClass += " bg-gray-200"
                        } else {
                          cellClass += isPeak
                            ? " bg-white hover:bg-blue-50 cursor-pointer"
                            : " bg-white hover:bg-blue-50 cursor-pointer"
                        }

                        return (
                          <td key={`${field}-${slot}`} className="p-0">
                            <button
                              disabled={isDisabled}
                              onClick={() => !isDisabled && toggleCell(field, slot)}
                              className={cellClass}
                              aria-label={`${field} at ${slot}`}
                            >
                              {isConfirmed && (
                                <div className="absolute inset-0 flex items-center justify-center">
                                  <Star className="w-4 h-4 text-yellow-300 fill-current" />
                                </div>
                              )}
                              {isPeak && !isDisabled && !isSelected && !isBooked && (
                                <div className="absolute top-0 right-0">
                                  <div className="w-0 h-0 border-t-[8px] border-t-amber-400 border-l-[8px] border-l-transparent"></div>
                                </div>
                              )}
                              {isSelected && (
                                <div className="absolute inset-0 flex items-center justify-center">
                                  <div className="w-2 h-2 bg-white rounded-full"></div>
                                </div>
                              )}
                            </button>
                          </td>
                        )
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Selected Slots Summary */}
          {selectedCell.length > 0 && (
            <div className="mt-6 bg-blue-50 rounded-xl p-4 border border-blue-100">
              <h3 className="font-medium text-blue-800 mb-2">Khung giờ đã chọn</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
                {selectedCell.map(({ field, slot }, index) => (
                  <div
                    key={index}
                    className="bg-white rounded-lg p-2 border border-blue-200 flex items-center justify-between group"
                  >
                    <div>
                      <div className="text-sm font-medium">{field}</div>
                      <div className="text-xs text-gray-500">{slot}</div>
                    </div>
                    <button
                      onClick={() => toggleCell(field, slot)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-red-50 rounded-full"
                    >
                      <X className="h-3 w-3 text-red-500" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg z-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              {selectedCell.length === 0 ? (
                <div className="text-center sm:text-left">
                  <p className="text-gray-500 text-sm">Chưa chọn khung giờ nào</p>
                  <p className="text-xs text-gray-400 mt-1">Vui lòng chọn ít nhất một khung giờ để tiếp tục</p>
                </div>
              ) : (
                <div className="text-center sm:text-left">
                  <div className="flex items-center gap-2">
                    <div className="bg-blue-100 p-1 rounded">
                      <Clock className="h-4 w-4 text-blue-600" />
                    </div>
                    <p className="font-medium text-gray-800">
                      {selectedCell.length} khung giờ ({(selectedCell.length * 30) / 60} giờ)
                    </p>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">
                    Ngày: <span className="font-medium">{FormatDate(selectedDate)}</span>
                  </p>
                </div>
              )}
            </div>

            <div className="flex items-center gap-4">
              <div className="text-right hidden sm:block">
                <p className="text-sm text-gray-600">Tổng tiền</p>
                <p className="text-2xl font-bold text-blue-700">
                  {formatCurrency(caculateTotalRevenue(selectedCell.length, bookingData.price))}
                </p>
              </div>

              <button
                onClick={handleNextStep}
                disabled={selectedCell.length === 0}
                className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white font-medium py-3 px-8 rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <span>Tiếp tục</span>
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="h-24"></div>
    </div>
  )
}
