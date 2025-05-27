import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useRef } from "react";

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

export default CustomDatePicker