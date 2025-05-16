import { useNavigate } from "react-router-dom";
import { groupTimeRanges } from "../../utils/groupTimeRanges";
import { statusMap } from "../../constants/statusMap";

export default function BookingDetail({ booking, onClose }) {
  const navigate = useNavigate();

  return (
    <div className="mt-10 bg-blue-50 border border-blue-200 rounded-xl shadow p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-semibold text-blue-700">{booking.fieldName}</h2>
          <p className="text-gray-800 font-medium">
            Ngày:{" "}
            {new Date(booking.date).toLocaleDateString("vi-VN", {
              weekday: "long",
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </p>
        </div>
        <div>
          <span
            className={`inline-block mt-1 text-xs font-semibold px-3 py-1 rounded-full ${
              statusMap[booking.status || "confirmed"].color
            }`}
          >
            {statusMap[booking.status || "confirmed"].label}
          </span>
        </div>
      </div>

      <div className="border-t pt-4">
        <h3 className="text-blue-600 font-semibold mb-2">🕒 Khung giờ đã đặt</h3>

        {Object.entries(
          booking.slots.reduce((acc, slot) => {
            if (!acc[slot.subField]) acc[slot.subField] = [];
            acc[slot.subField].push(slot.time);
            return acc;
          }, {})
        ).map(([subField, times]) => (
          <div
            key={subField}
            className="bg-white p-3 mb-2 rounded shadow-sm text-sm"
          >
            <strong className="text-blue-700">{subField}:</strong>{" "}
            {groupTimeRanges(times).join(", ")}
          </div>
        ))}

        <div className="mt-6 flex gap-4">
          {booking.status === "unpaid" && (
            <button
              onClick={() => navigate(`/payment/${booking.id}`)}
              className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-6 rounded-lg"
            >
              Thanh toán
            </button>
          )}
          {booking.status === "paid" && (
            <button
              disabled
              className="bg-gray-400 text-white font-semibold py-2 px-6 rounded-lg cursor-not-allowed"
            >
              Đã thanh toán
            </button>
          )}
          <button
            onClick={onClose}
            className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold py-2 px-6 rounded-lg"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
}
