import { useState, useContext, useEffect } from "react";
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

export default function ScheduleGrid({ nextStep }) {
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
    if (!selectedDate) return;

    const filterToday = selectedCell.filter(({ slot }) => !isPastTime(selectedDate, slot));
    setSelectedCell(filterToday);
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
    <div className="p-6 bg-gray-100 min-h-screen">
      <TopNotice />
      <h2 className="text-2xl font-bold text-blue-700 mb-4 text-center">
        Lịch đặt sân cho {bookingData.selectionField}
      </h2>
      <BookingLegend />

      <div className="overflow-auto">
        <div className="flex items-end justify-between gap-4 mb-4">
          <div className="flex flex-col">
            <label className="block text-sm font-medium text-gray-700 mb-1">Ngày</label>
            <DatePicker
              selected={selectedDate}
              onChange={(date) => setSelectedDate(date)}
              dateFormat="dd/MM/yyyy"
              placeholderText="Chọn ngày"
              className="px-4 py-2 border rounded-lg focus:ring-blue-500"
            />
          </div>

          <div className="self-end">
            <a
              href="#"
              className="text-blue-500 font-bold border-b border-blue-200 hover:text-blue-600 hover:border-blue-300 transition"
              onClick={(e) => {
                e.preventDefault();
                setShowPricing(true);
              }}
            >
              Xem sân & bảng giá
            </a>
          </div>
        </div>

        <div className="w-full overflow-x-auto">
          {showPricing && <PricingOverlay onClose={() => setShowPricing(false)} />}
          <table className="table-auto border border-gray-300 min-w-[1100px]">
            <thead className="bg-blue-100">
              <tr>
                <th className="p-2 border border-gray-300 w-28">Tên sân</th>
                {timeSlots.map((slot) => (
                  <th key={slot} className="p-2 border border-gray-300 text-xs">
                    {slot}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {fieldLabels.map((field) => (
                <tr key={field}>
                  <td className="p-2 border border-gray-200 font-semibold text-center bg-blue-50">
                    {field}
                  </td>
                  {timeSlots.map((slot) => {
                    const isUnavailable = unavailableFields.includes(field);
                    const isBooked = bookedSlots[field]?.includes(slot);
                    const isPast = selectedDate && isPastTime(selectedDate, slot);
                    const isSelected = isCellSelected(field, slot);
                    const isDisabled = isUnavailable || isBooked || isPast;
                    let className = "cursor-pointer";

                    if (isUnavailable) {
                      className += " bg-gray-300 text-gray-600 cursor-not-allowed";
                    } else if (isBooked) {
                      className += " bg-red-200 text-red-800 cursor-not-allowed";
                    } else if (isSelected) {
                      className += " bg-green-200 text-green-800 border border-green-600";
                    } else if (isPast) {
                      className += " bg-gray-200 text-gray-400 cursor-not-allowed";
                    } else {
                      className += " bg-white hover:bg-blue-50 text-gray-700 border";
                    }

                    return (
                      <td
                        key={`${field}-${slot}`}
                        className={`p-2 text-center text-xs ${className}`}
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

        <div className="mt-6 bg-white p-4 rounded-xl shadow max-w-2xl mx-auto text-center">
          <h3 className="text-lg font-semibold text-blue-700 mb-2">Tổng thời gian và chi phí</h3>
          {selectedCell.length === 0 ? (
            <p className="text-gray-500 text-sm">Chưa chọn khung giờ nào</p>
          ) : (
            <>
              <p className="text-sm text-gray-600">
                Đã chọn: <strong>{selectedCell.length}</strong> khung giờ – {" "}
                <strong>{(selectedCell.length * 30) / 60} giờ</strong> – Ngày: {" "}
                <strong>
                  {selectedDate ? FormatDate(selectedDate.toISOString()) : "Chưa chọn ngày"}
                </strong>
              </p>
              <p className="text-xl font-bold text-green-600 mt-2">
                Tổng tiền: {(selectedCell.length * 50000).toLocaleString("vi-VN")}đ
              </p>
            </>
          )}
        </div>

        <div className="mt-4 text-center">
          <button
            type="submit"
            className="w-40 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg shadow-md transition"
            onClick={handleNextStep}
          >
            Tiếp tục
          </button>
        </div>
      </div>
    </div>
  );
}
