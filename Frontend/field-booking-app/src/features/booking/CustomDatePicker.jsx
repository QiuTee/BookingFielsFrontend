import { useState, useRef, useEffect } from "react"
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"
import { Calendar, ChevronDown, Check, X } from "lucide-react"

function CustomDatePicker({ selectedDate, setSelectedDate }) {
  const [showPicker, setShowPicker] = useState(false)
  const [tempDate, setTempDate] = useState(selectedDate || new Date())
  const pickerRef = useRef(null)

  const handleConfirm = () => {
    setSelectedDate(tempDate)
    setShowPicker(false)
  }

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (pickerRef.current && !pickerRef.current.contains(event.target)) {
        setShowPicker(false)
      }
    }

    if (showPicker) {
      document.addEventListener("mousedown", handleClickOutside)
    } else {
      document.removeEventListener("mousedown", handleClickOutside)
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [showPicker])

  const formatDisplayDate = (date) => {
    if (!date) return "Chọn ngày đặt sân"

    const today = new Date()
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

    if (date.toDateString() === today.toDateString()) {
      return "Hôm nay"
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return "Ngày mai"
    } else {
      return date.toLocaleDateString("vi-VN", {
        weekday: "short",
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      })
    }
  }

  return (
    <div className="relative inline-block" ref={pickerRef}>
      <button
        onClick={() => setShowPicker((prev) => !prev)}
        className={`
          group relative overflow-hidden
          px-4 py-3 min-w-[200px]
          bg-gradient-to-r from-white to-blue-50
          border-2 border-blue-200 hover:border-blue-400
          rounded-xl shadow-sm hover:shadow-md
          text-gray-700 hover:text-blue-700
          font-medium text-sm
          transition-all duration-300 ease-out
          transform hover:scale-[1.02] active:scale-[0.98]
          ${showPicker ? "border-blue-500 shadow-lg ring-2 ring-blue-100" : ""}
        `}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-green-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        <div className="relative flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div
              className={`
              p-1.5 rounded-lg transition-all duration-300
              ${showPicker ? "bg-blue-500 text-white" : "bg-blue-100 text-blue-600 group-hover:bg-blue-200"}
            `}
            >
              <Calendar className="h-4 w-4" />
            </div>
            <div className="text-left">
              <div className="font-semibold">{formatDisplayDate(selectedDate)}</div>
              {selectedDate && (
                <div className="text-xs text-gray-500 mt-0.5">{selectedDate.toLocaleDateString("vi-VN")}</div>
              )}
            </div>
          </div>

          <ChevronDown
            className={`
            h-4 w-4 text-gray-400 transition-transform duration-300
            ${showPicker ? "rotate-180 text-blue-500" : "group-hover:text-blue-500"}
          `}
          />
        </div>
      </button>

      {showPicker && (
        <>
      
          <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[9998] animate-in fade-in duration-200" />
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 animate-in slide-in-from-top-2 duration-300">
            <div className="bg-white border border-gray-200 rounded-2xl shadow-2xl overflow-hidden max-w-sm w-full">
              <div className="bg-gradient-to-r from-blue-600 to-green-500 px-4 py-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-white">
                    <Calendar className="h-5 w-5" />
                    <h3 className="font-semibold">Chọn ngày đặt sân</h3>
                  </div>
                  <button
                    onClick={() => setShowPicker(false)}
                    className="p-1 hover:bg-white/20 rounded-full transition-colors"
                  >
                    <X className="h-4 w-4 text-white" />
                  </button>
                </div>
                <p className="text-blue-100 text-sm mt-1">Chọn ngày phù hợp với lịch trình của bạn</p>
              </div>

              <div className="p-4">
                <style jsx>{`
                  .react-datepicker {
                    border: none !important;
                    box-shadow: none !important;
                    font-family: inherit !important;
                    width: 100% !important;
                  }
                  .react-datepicker__header {
                    background: linear-gradient(135deg, #3b82f6, #10b981) !important;
                    border: none !important;
                    border-radius: 12px 12px 0 0 !important;
                    padding: 16px !important;
                  }
                  .react-datepicker__current-month {
                    color: white !important;
                    font-weight: 600 !important;
                    font-size: 16px !important;
                  }
                  .react-datepicker__day-name {
                    color: rgba(255, 255, 255, 0.8) !important;
                    font-weight: 500 !important;
                    font-size: 12px !important;
                  }
                  .react-datepicker__navigation {
                    top: 20px !important;
                  }
                  .react-datepicker__navigation--previous {
                    border-right-color: white !important;
                  }
                  .react-datepicker__navigation--next {
                    border-left-color: white !important;
                  }
                  .react-datepicker__day {
                    border-radius: 8px !important;
                    margin: 2px !important;
                    width: 32px !important;
                    height: 32px !important;
                    line-height: 32px !important;
                    font-weight: 500 !important;
                    transition: all 0.2s ease !important;
                  }
                  .react-datepicker__day:hover {
                    background: linear-gradient(135deg, #3b82f6, #10b981) !important;
                    color: white !important;
                    transform: scale(1.1) !important;
                  }
                  .react-datepicker__day--selected {
                    background: linear-gradient(135deg, #1d4ed8, #059669) !important;
                    color: white !important;
                    font-weight: 600 !important;
                    transform: scale(1.05) !important;
                    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4) !important;
                  }
                  .react-datepicker__day--today {
                    background: rgba(59, 130, 246, 0.1) !important;
                    color: #1d4ed8 !important;
                    font-weight: 600 !important;
                  }
                  .react-datepicker__day--disabled {
                    color: #d1d5db !important;
                    background: transparent !important;
                  }
                  .react-datepicker__day--disabled:hover {
                    background: transparent !important;
                    transform: none !important;
                  }
                `}</style>

                <DatePicker
                  selected={tempDate}
                  onChange={(date) => setTempDate(date)}
                  inline
                  minDate={new Date()}
                  showWeekNumbers={false}
                  calendarStartDay={1}
                />
              </div>

              <div className="bg-gray-50 px-4 py-3 border-t border-gray-100">
                <div className="flex items-center justify-between gap-3">
                  <div className="text-sm text-gray-600">
                    {tempDate && <span className="font-medium">Đã chọn: {formatDisplayDate(tempDate)}</span>}
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => setShowPicker(false)}
                      className="
                        px-4 py-2 text-sm font-medium text-gray-600 
                        hover:text-red-600 hover:bg-red-50
                        rounded-lg transition-all duration-200
                        flex items-center gap-1
                      "
                    >
                      <X className="h-3 w-3" />
                      Hủy
                    </button>
                    <button
                      onClick={handleConfirm}
                      className="
                        px-6 py-2 bg-gradient-to-r from-blue-600 to-green-500 
                        hover:from-blue-700 hover:to-green-600
                        text-white text-sm font-semibold rounded-lg 
                        shadow-md hover:shadow-lg
                        transition-all duration-200 transform hover:scale-105
                        flex items-center gap-2
                      "
                    >
                      <Check className="h-3 w-3" />
                      Xác nhận
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default CustomDatePicker
