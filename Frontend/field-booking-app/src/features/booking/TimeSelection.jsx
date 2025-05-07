import { useState, useContext, useEffect, useRef } from "react";
import TopNotice from "../../common/TopNotice";
import BookingLegend from "../../common/BookingLegend";
import PricingOverlay from "../../components/PricingOverlay";
import { BookingContext } from "../../context/BookingContext";
import { NotificationContext } from "../../context/NotificationContext";
import FormatDate from "../../hooks/FormatDate";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { getBookedSlots } from "../../api/submission";

const timeSlots = [];
for (let h = 6; h <= 22; h++) {
  timeSlots.push(`${h.toString().padStart(2, "0")}:00`);
  if (h < 22) timeSlots.push(`${h.toString().padStart(2, "0")}:30`);
}

const fieldLabels = ["Sân A", "Sân B", "Sân C", "Sân D", "Sân E", "Sân F"];
const unavailableFields = ["Sân C"];

function CustomDatePicker({ selectedDate, setSelectedDate }) {
  const datepickerRef = useRef(null);

  return (
    <div className="w-full sm:w-64">
      <div
        onClick={() => datepickerRef.current.setOpen(true)}
        className="px-4 py-2 border rounded-lg bg-white shadow text-gray-700 text-sm cursor-pointer"
      >
        {selectedDate ? selectedDate.toLocaleDateString("vi-VN") : "Chọn ngày"}
      </div>
      <DatePicker
        ref={datepickerRef}
        selected={selectedDate}
        onChange={(date) => setSelectedDate(date)}
        dateFormat="dd/MM/yyyy"
        withPortal
        className="hidden" 
        popperPlacement="bottom-start"
      />
    </div>
  );
}

export default function TimeSelection({ nextStep }) {
  const [selectedCell, setSelectedCell] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showPricing, setShowPricing] = useState(false);
  const { bookingData, setBookingData } = useContext(BookingContext);
  const { showNotification } = useContext(NotificationContext);
  const [bookedSlots, setBookedSlots] = useState({});

  useEffect(() => {
    async function fetchBookedSlots() {
      if (!selectedDate || !bookingData.selectionField) return;
      try {
        const dateStr = selectedDate.toLocaleDateString("en-CA");
        const slots = await getBookedSlots(bookingData.selectionField, dateStr);
        const grouped = {};
        slots.forEach(({ subField, time }) => {
          if (!grouped[subField]) grouped[subField] = [];
          grouped[subField].push(time);
        });
        setBookedSlots(grouped);
      } catch (error) {
        console.error("Lỗi khi lấy booked slots:", error);
      }
    }
    fetchBookedSlots();
  }, [selectedDate, bookingData.selectionField]);

  useEffect(() => {
    const interval = setInterval(() => {
      setSelectedCell((prev) =>
        prev.filter(({ slot }) => !isPastTime(selectedDate, slot))
      );
    }, 10000);
    return () => clearInterval(interval);
  }, [selectedDate]);

  const validateSubmit = () => {
    if (selectedCell.length === 0) {
      showNotification({ type: "error", message: "Vui lòng chọn ít nhất một khung giờ" });
      return false;
    }
    if (!selectedDate) {
      showNotification({ type: "error", message: "Vui lòng chọn ngày" });
      return false;
    }
    return true;
  };

  const isPastTime = (dateObj, slot) => {
    const [h, m] = slot.split(":").map(Number);
    const selectedDateTime = new Date(dateObj);
    selectedDateTime.setHours(h);
    selectedDateTime.setMinutes(m);
    selectedDateTime.setSeconds(0);
    return selectedDateTime < new Date();
  };

  const handleNextStep = () => {
    setBookingData((prev) => ({
      ...prev,
      selectDate: selectedDate?.toLocaleDateString("en-CA"),
      selectedCell: selectedCell,
    }));
    if (validateSubmit()) {
      nextStep();
    }
  };

  const toggleCell = (field, slot) => {
    const isSelected = selectedCell.some((cell) => cell.field === field && cell.slot === slot);
    if (isSelected) {
      setSelectedCell((prev) => prev.filter((cell) => !(cell.field === field && cell.slot === slot)));
    } else {
      setSelectedCell((prev) => [...prev, { field, slot }]);
    }
  };

  const isCellSelected = (field, slot) =>
    selectedCell.some((cell) => cell.field === field && cell.slot === slot);

  return (
    <div className="bg-gray-100 min-h-screen w-full overflow-x-hidden pb-[160px]">
      <TopNotice />
      <h2 className="text-2xl font-bold text-blue-700 mb-6 text-center">
        Lịch đặt sân cho {bookingData.selectionField}
      </h2>
      <BookingLegend />

      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-6 px-4">
        <div className="flex flex-col relative z-50">
          <label className="block text-sm font-medium text-gray-700 mb-1">Ngày</label>
          <CustomDatePicker selectedDate={selectedDate} setSelectedDate={setSelectedDate} />
        </div>
        <div className="text-center md:text-right">
          <a
            href="#"
            className="text-blue-600 font-semibold border-b border-blue-300 hover:text-blue-700 transition"
            onClick={(e) => {
              e.preventDefault();
              setShowPricing(true);
            }}
          >
            Xem sân & bảng giá
          </a>
        </div>
      </div>

      <div className="w-full">
        {showPricing && <PricingOverlay onClose={() => setShowPricing(false)} />}
        <div className="overflow-x-auto">
          <table className="w-full table-fixed border border-gray-300 text-[10px] sm:text-xs">
            <thead className="bg-blue-100 sticky top-0 z-20">
              <tr>
                <th className="px-2 py-2 border text-center bg-blue-200 w-[80px] sticky left-0 z-30 text-sm">
                  Tên sân
                </th>
                {timeSlots.map((slot) => (
                  <th
                    key={slot}
                    className="px-1 py-2 border text-center whitespace-nowrap w-[60px] hover:bg-blue-200 transition"
                  >
                    {slot}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {fieldLabels.map((field) => (
                <tr key={field} className="hover:bg-gray-50">
                  <td className="px-2 py-1 font-medium text-center bg-blue-50 border sticky left-0 z-10">
                    {field}
                  </td>
                  {timeSlots.map((slot) => {
                    const isUnavailable = unavailableFields.includes(field);
                    const isBooked = bookedSlots[field]?.includes(slot);
                    const isPast = selectedDate && isPastTime(selectedDate, slot);
                    const isSelected = isCellSelected(field, slot);
                    const isDisabled = isUnavailable || isBooked || isPast;

                    let className = "cursor-pointer transition text-center px-2 py-1 text-xs ";
                    if (isUnavailable) {
                      className += "bg-gray-300 text-gray-600 cursor-not-allowed";
                    } else if (isBooked) {
                      className += "bg-red-200 text-red-800 cursor-not-allowed";
                    } else if (isSelected) {
                      className += "bg-green-200 text-green-800 border border-green-600 font-bold";
                    } else if (isPast) {
                      className += "bg-gray-200 text-gray-400 cursor-not-allowed";
                    } else {
                      className += "bg-white hover:bg-blue-50 text-gray-700 border";
                    }

                    return (
                      <td
                        key={`${field}-${slot}`}
                        className={className}
                        onClick={() => !isDisabled && toggleCell(field, slot)}
                      >
                        {!isUnavailable && !isBooked && !isSelected ? "•" : ""}
                        {isSelected ? "✔" : ""}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 w-full bg-white shadow-md border-t z-50">
        <div className="max-w-4xl mx-auto px-4 py-3 text-center">
          <h3 className="text-lg font-semibold text-blue-700 mb-1">Tổng thời gian và chi phí</h3>
          {selectedCell.length === 0 ? (
            <p className="text-gray-500 text-sm">Chưa chọn khung giờ nào</p>
          ) : (
            <>
              <p className="text-sm text-gray-600">
                Đã chọn: <strong>{selectedCell.length}</strong> khung giờ –{" "}
                <strong>{(selectedCell.length * 30) / 60} giờ</strong> – Ngày:{" "}
                <strong>{selectedDate ? FormatDate(selectedDate.toISOString()) : "Chưa chọn ngày"}</strong>
              </p>
              <p className="text-xl font-bold text-green-600 mt-1">
                Tổng tiền: {(selectedCell.length * 50000).toLocaleString("vi-VN")}đ
              </p>
            </>
          )}
          <button
            type="submit"
            className="mt-3 w-full sm:w-48 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition"
            onClick={handleNextStep}
          >
            Tiếp tục
          </button>
        </div>
      </div>
    </div>
  );
}
