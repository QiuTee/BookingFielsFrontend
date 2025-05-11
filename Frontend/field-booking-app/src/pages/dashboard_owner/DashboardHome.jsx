import { useEffect, useState } from "react";
import { getBookingsForOwner, updateBookingStatus } from "../../api/submission";
import { groupTimeRanges } from "../../utils/groupTimeRanges";
import { statusMap } from "../../constants/statusMap";
import BookingDetailModal from "../../components/booking/BookingDetailModal";
import { useSelectedBooking } from "../../context/SelectedBookingContext";

export default function DashboardHome() {
  const [bookings, setBookings] = useState([]);
  const { selectedBooking, setSelectedBooking } = useSelectedBooking();

  useEffect(() => {
    async function fetchBookings() {
      try {
        const data = await getBookingsForOwner();
        setBookings(data);
      } catch (error) {
        console.error("Error fetching bookings:", error);
      }
    }
    fetchBookings();
    const interval = setInterval(fetchBookings, 15000); 
    return () => clearInterval(interval); 
  }, []);

  const handleStatusChange = async (bookingId, newStatus) => {
    try {
      await updateBookingStatus(bookingId, newStatus);
      setBookings((prevBookings) =>
        prevBookings.map((booking) =>
          booking.id === bookingId ? { ...booking, status: newStatus } : booking
        )
      );
    } catch (error) {
      console.error("Error updating booking status:", error);
    }
  };

  const fields = [
    { id: 1, name: "Sân số 1", type: "Sân 5", price: 300000, status: "Có sẵn", desc: "Sân cỏ nhân tạo, có đèn chiều sáng" },
    { id: 2, name: "Sân số 2", type: "Sân 7", price: 400000, status: "Có sẵn", desc: "Sân cỏ nhân tạo, có đèn chiều sáng" },
    { id: 3, name: "Sân số 3", type: "Sân 5", price: 300000, status: "Bảo trì", desc: "Sân cỏ nhân tạo, đang bảo trì" },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="col-span-full flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-blue-800">Tổng quan</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Tổng lượt đặt sân" value="128" sub="+12% so với tháng trước" color="blue" />
        <StatCard title="Khách hàng" value="64" sub="+5% so với tháng trước" color="green" />
        <StatCard title="Doanh thu" value="12.5M" sub="+18% so với tháng trước" color="purple" />
        <StatCard title="Tỷ lệ hoàn thành" value="95%" sub="+2% so với tháng trước" color="orange" />
      </div>

      <div className="bg-white rounded-lg p-4 shadow col-span-full">
        <h2 className="text-lg font-semibold text-blue-800 mb-4">Lịch đặt sân gần đây</h2>
        <div className="space-y-4">
          {bookings.map((b) => {
            const groupedBySubField = b.slots?.reduce((acc, slot) => {
              acc[slot.subField] = acc[slot.subField] || [];
              acc[slot.subField].push(slot.time);
              return acc;
            }, {}) || {};

            return (
              <div
                key={b.id}
                className="bg-white shadow-md rounded-lg p-4 hover:shadow-lg transition-shadow ring-1 ring-blue-100"
              >
                <div className="flex justify-between items-center mb-2">
                  <div>
                    <h3 className="font-semibold text-blue-900">{b.userName}</h3>
                    <p className="text-sm text-gray-600">
                      {b.fieldName} • {new Date(b.date).toLocaleDateString("vi-VN")}
                    </p>
                    {Object.entries(groupedBySubField).map(([subField, times], idx) => (
                      <p key={idx} className="text-sm text-gray-600">
                        {subField}: {groupTimeRanges(times).join(", ")}
                      </p>
                    ))}
                  </div>
                  <span
                    className={`text-sm px-3 py-1 rounded-full font-medium ${statusMap[b.status || "confirmed"].color}`}
                  >
                    {statusMap[b.status || "confirmed"].label}
                  </span>
                </div>

                {(b.status === "paid" || b.status === "pending") && (
                  <div className="flex gap-2 mt-2">
                    {b.status === "paid" && (
                      <button
                        onClick={() => handleStatusChange(b.id, "confirmed")}
                        className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700 transition"
                      >
                        Xác nhận
                      </button>
                    )}
                    <button
                      onClick={() => handleStatusChange(b.id, "canceled")}
                      className="bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600 transition"
                    >
                      Từ chối
                    </button>
                  </div>
                )}

                <button
                  onClick={() => setSelectedBooking(b)}
                  className="mt-3 text-sm text-blue-600 hover:underline"
                >
                  Xem chi tiết
                </button>
              </div>
            );
          })}
        </div>
      </div>

      <div className="bg-white rounded-lg p-4 shadow col-span-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-blue-800">Quản lý sân</h2>
        </div>
        <div className="space-y-4">
          {fields.map((f) => (
            <div
              key={f.id}
              className="bg-white shadow-md rounded-lg p-4 hover:shadow-lg transition-shadow ring-1 ring-blue-100 flex justify-between items-start"
            >
              <div>
                <h3 className="font-semibold text-blue-900">{f.name}</h3>
                <p className="text-sm text-gray-600">
                  {f.type} - {f.price.toLocaleString()}đ/giờ
                </p>
                <p className="text-sm text-gray-600">{f.desc}</p>
              </div>
              <div className="flex flex-col items-end gap-2">
                <span
                  className={`text-sm px-3 py-1 rounded-full font-medium ${
                    f.status === "Có sẵn"
                      ? "bg-green-100 text-green-700"
                      : f.status === "Bảo trì"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-gray-100 text-gray-700"
                  }`}
                >
                  {f.status}
                </span>
                <button className="text-gray-500 hover:text-blue-600 transition">✎</button>
              </div>
            </div>
          ))}
          <button className="w-full text-center text-blue-600 hover:underline">Xem tất cả sân</button>
        </div>
      </div>

      {selectedBooking && (
        <BookingDetailModal
          booking={selectedBooking}
          onClose={() => setSelectedBooking(null)}
        />
      )}
    </div>
  );
}

function StatCard({ title, value, sub, color }) {
  const colorMap = {
    blue: "text-blue-800",
    green: "text-green-800",
    purple: "text-purple-800",
    orange: "text-yellow-700",
  };
  return (
    <div className="bg-white shadow rounded p-4">
      <h3 className="text-sm font-medium text-gray-500 mb-1">{title}</h3>
      <p className={`text-2xl font-bold ${colorMap[color]}`}>{value}</p>
      <p className="text-sm text-green-600">{sub}</p>
    </div>
  );
}
