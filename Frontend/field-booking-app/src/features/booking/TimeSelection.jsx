import { useState, useEffect, useContext } from "react"
import { Calendar, ChevronLeft, Star } from "lucide-react"
import { BookingContext } from "../../context/BookingContext"
import { NotificationContext } from "../../context/NotificationContext"
import { getBookedSlots } from "../../api/submission"
import PricingOverlay from "../../components/layout/PricingOverlay"
import FormatDate from "../../hooks/FormatDate";
import CustomDatePicker from "./CustomDatePicker";

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
          })
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
      setSelectedCell((prev) =>
        prev.filter(({ slot }) => !isPastTime(selectedDate, slot))
      )
    }, 10000)
    return () => clearInterval(interval)
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

  const isCellSelected = (field, slot) =>
    selectedCell.some((cell) => cell.field === field && cell.slot === slot)

  const formatDate = (date) => {
    return date.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-blue-600 text-white px-4 py-4">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center gap-3">
            <h1 className="text-lg font-medium">Đặt lịch ngày trực quan</h1>
          </div>
            <CustomDatePicker className="ml-10"  selectedDate={selectedDate} setSelectedDate={setSelectedDate} />
        </div>
      </div>

      <div className="bg-white border-b px-4 py-3">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-wrap items-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-white border border-gray-300 rounded"></div>
              <span>Trống</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-red-500 rounded flex items-center justify-center">
                <Star className="w-2 h-2 text-yellow-300 fill-current" />
              </div>
              <span>Đã đặt</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-gray-400 rounded"></div>
              <span>Khóa</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-cyan-200 border-2 border-cyan-400 rounded"></div>
              <span>Đã chọn</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-purple-400 rounded"></div>
              <span>Sự kiện</span>
            </div>
            <button
              className="text-blue-600 underline hover:text-blue-700 ml-auto"
              onClick={() => setShowPricing(true)}
            >
              Xem sân & bảng giá
            </button>
          </div>
        </div>
      </div>

      <div className="bg-orange-50 border-l-4 border-orange-400 px-4 py-2">
        <div className="max-w-7xl mx-auto">
          <p className="text-sm text-orange-700">
            <span className="font-medium">Lưu ý:</span> Nếu bạn cần đặt lịch có định vui lòng liên hệ: 0374.857.068 để
            được hỗ trợ
          </p>
        </div>
      </div>

      <div className="p-4">
        {showPricing && <PricingOverlay onClose={() => setShowPricing(false)} />}
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-blue-50">
                    <th className="w-12 p-2 border border-gray-300 bg-blue-100 sticky left-0 z-10"></th>
                    {timeSlots.map((slot) => (
                      <th key={slot} className="min-w-[50px] p-1 border border-gray-300 text-xs text-gray-700">
                        {slot}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {fieldLabels.map((field) => (
                    <tr key={field} className="hover:bg-gray-50">
                      <td className="p-2 border border-gray-300 bg-blue-50 text-center font-medium sticky left-0 z-10">
                        {field}
                      </td>
                      {timeSlots.map((slot) => {
                        const slotStatus = bookedSlots[field]?.[slot]
                        const isPaid = slotStatus === "paid" || slotStatus === "unpaid"
                        const isConfirmed = slotStatus === "confirmed_deposit" || slotStatus === "confirmed_paid"
                        const isBooked = isPaid || isConfirmed
                        const isUnavailable = unavailableFields.includes(`Sân ${field}`)
                        const isPast = selectedDate && isPastTime(selectedDate, slot)
                        const isSelected = isCellSelected(field, slot)
                        const isDisabled = isUnavailable || isBooked || isPast

                        let cellClass = "h-8 border border-gray-300 cursor-pointer relative transition"
                        if (isUnavailable) cellClass += " bg-gray-400"
                        else if (isBooked) cellClass += " bg-red-500"
                        else if (isSelected) cellClass += " bg-cyan-200 border-2 border-cyan-400"
                        else if (isPast) cellClass += " bg-gray-200"
                        else cellClass += " bg-white hover:bg-blue-50"

                        return (
                          <td
                            key={`${field}-${slot}`}
                            className={cellClass}
                            onClick={() => !isDisabled && toggleCell(field, slot)}
                          >
                            {isBooked && (
                              <div className="absolute inset-0 flex items-center justify-center">
                                <Star className="w-3 h-3 text-yellow-300 fill-current" />
                              </div>
                            )}
                          </td>
                        )
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 text-center">
          <h3 className="text-lg font-semibold text-blue-700 mb-2">Tổng thời gian và chi phí</h3>
          {selectedCell.length === 0 ? (
            <p className="text-gray-500 text-sm mb-4">Chưa chọn khung giờ nào</p>
          ) : (
            <>
              <p className="text-sm text-gray-600 mb-1">
                Đã chọn: <strong>{selectedCell.length}</strong> khung giờ –{" "}
                <strong>{(selectedCell.length * 30) / 60} giờ</strong> – Ngày:{" "}
                <strong>{formatDate(selectedDate)}</strong>
              </p>
              <p className="text-xl font-bold text-green-600">
                Tổng tiền: {(selectedCell.length * 50000).toLocaleString("vi-VN")}đ
              </p>
            </>
          )}
          <button
            onClick={handleNextStep}
            className="w-full sm:w-48 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg mt-3"
          >
            Tiếp tục
          </button>
        </div>
      </div>

      <div className="h-32"></div>
    </div>
  )
}
