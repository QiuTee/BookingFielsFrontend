import { useState , useEffect } from "react";
import { Calendar, Clock, CreditCard, Filter, Search, Phone, MapPin } from "lucide-react";
import BookingDetails from "./BookingDetails";
import { getBookingsForOwner , updateBookingStatus } from "../../api/submission";
import { groupTimeRanges } from "../../utils/groupTimeRanges";
import { useParams } from "react-router-dom";
import { statusMap } from "../../constants/statusMap";

export default function BookingManagement() {
  const [bookings, setBookings] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [tab, setTab] = useState("all");
  const { slug } = useParams();

  useEffect(() => {
    if (!slug) return;

    const fetchBookings = async () => {
      try {
        const data = await getBookingsForOwner(slug);
        setBookings(data);
      } catch (error) {
        console.error("Error fetching bookings:", error);
      }
    };
    fetchBookings();
    const interval = setInterval(fetchBookings, 15000);
    return () => clearInterval(interval);
  }, [slug]);

  const filteredBookings = bookings.filter(
    (booking) =>
      booking.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.phone.includes(searchTerm) ||
      booking.fieldName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleStatusChange = async (id, newStatus) => {
    try {
      await updateBookingStatus(id, newStatus);
      setBookings((prevBookings) =>
        prevBookings.map((booking) =>
          booking.id === id ? { ...booking, status: newStatus } : booking
        )
      );
      setSelectedBooking((prev) =>
        prev?.id === id ? { ...prev, status: newStatus } : prev
      );
    } catch (error) {
      console.error("Error updating booking status:", error);
    }
  };

  const tabs = [
    { value: "all", label: "Tất cả" },
    { value: "confirmed_deposit", label: "Đặt cọc" },
    { value: "confirmed_paid", label: "Đã thanh toán" },
  ];

  const filteredByTab = tab === "all" ? filteredBookings : filteredBookings.filter(b => b.status === tab);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2">
        <div className="flex flex-col space-y-4">
          <div className="flex flex-col sm:flex-row justify-between gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                placeholder="Tìm kiếm theo tên, số điện thoại, sân..."
                className="pl-10 pr-4 py-2.5 border rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <select
              className="border rounded-lg px-4 py-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all cursor-pointer"
              onChange={(e) => setSearchTerm(e.target.value)}
            >
              <option value="">Tất cả sân</option>
              <option value="Sân số 1">Sân số 1</option>
              <option value="Sân số 2">Sân số 2</option>
              <option value="Sân số 3">Sân số 3</option>
            </select>
          </div>

          <div className="flex gap-2 overflow-x-auto pb-2">
            {tabs.map((t) => (
              <button
                key={t.value}
                onClick={() => setTab(t.value)}
                className={`px-4 py-2 rounded-lg font-medium transition-all whitespace-nowrap
                  ${tab === t.value 
                    ? "bg-blue-600 text-white shadow-md transform scale-105" 
                    : "bg-white text-gray-600 hover:bg-gray-50 border"}`}
              >
                {t.label}
              </button>
            ))}
          </div>

          <div className="space-y-4 mt-4">
            {filteredByTab.map((booking) => (
              <BookingCard
                key={booking.id}
                booking={booking}
                onSelect={() => setSelectedBooking(booking)}
                onUpdateStatus={handleStatusChange}
              />
            ))}
            {filteredByTab.length === 0 && (
              <div className="text-center py-10 text-gray-500 bg-gray-50 rounded-lg">
                Không tìm thấy đặt sân nào
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="lg:col-span-1 h-fit sticky top-4">
        {selectedBooking ? (
          <BookingDetails booking={selectedBooking} handleStatusChange={handleStatusChange} />
        ) : (
          <div className="border rounded-lg p-6 h-48 flex items-center justify-center text-center text-gray-500 bg-gray-50">
            <p>Chọn một đặt sân để xem chi tiết</p>
          </div>
        )}
      </div>
    </div>
  );
}

function BookingCard({ booking, onSelect, onUpdateStatus }) {
  return (
    <div
      className="rounded-lg shadow-md hover:shadow-lg transition-all duration-200 ring-1 ring-gray-200 bg-white cursor-pointer overflow-hidden hover:ring-blue-200"
      onClick={onSelect}
    >
      <div className="p-4 space-y-3">
        <div className="flex justify-between items-start">
          <div className="space-y-2">
            <div className="font-semibold text-blue-800 text-lg">{booking.userName}</div>
            <div className="flex flex-col gap-2">
              <div className="text-sm text-gray-600 flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                {booking.fieldName}
              </div>
              <div className="text-sm text-gray-600 flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                {new Date(booking.date).toLocaleDateString("vi-VN")}
              </div>
            </div>
          </div>
          <span
            className={`px-3 py-1.5 rounded-full text-xs font-medium ${statusMap[booking.status || "confirmed_paid"].color}`}
          >
            {statusMap[booking.status || "confirmed_paid"].label}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-gray-500 pt-2">
          <div className="flex items-center gap-1">
            <Phone className="h-4 w-4" />
            <strong>{booking.phone}</strong>
          </div>
          {(() => {
            const groupedBySubField = booking.slots?.reduce((acc, slot) => {
              acc[slot.subField] = acc[slot.subField] || [];
              acc[slot.subField].push(slot.time);
              return acc;
            }, {}) || {};
            return Object.entries(groupedBySubField).map(([subField, times], idx) => (
              <div key={idx} className="flex items-center gap-1 col-span-full sm:col-span-1">
                <Clock className="h-4 w-4" />
                {subField}: {groupTimeRanges(times).join(", ")}
              </div>
            ));
          })()}
        </div>
      </div>

      {["confirmed_paid", "confirmed_deposit", "paid", "pending"].includes(booking.status) && (
        <div className="bg-gray-50 px-4 py-3 border-t flex flex-col sm:flex-row sm:justify-end sm:items-center gap-2">
          {(booking.status === "paid" || booking.status === "pending") && (
            <>
              {booking.status === "paid" && (
                <>
                  <ActionButton
                    label="✅ Thanh toán đủ"
                    onClick={(e) => onUpdateStatusSafe(e, booking.id, "confirmed_paid")}
                    className="bg-blue-600 hover:bg-blue-700 text-white w-full sm:w-auto"
                  />
                  <ActionButton
                    label="💰 Đặt cọc"
                    onClick={(e) => onUpdateStatusSafe(e, booking.id, "confirmed_deposit")}
                    className="bg-teal-600 hover:bg-teal-700 text-white w-full sm:w-auto"
                  />
                </>
              )}
              <ActionButton
                label="❌ Từ chối"
                onClick={(e) => onUpdateStatusSafe(e, booking.id, "canceled")}
                className="bg-red-500 hover:bg-red-600 text-white w-full sm:w-auto"
              />
            </>
          )}

          {["confirmed_deposit", "confirmed_paid"].includes(booking.status) && (
            <ActionButton
              label={booking.status === "confirmed_deposit" ? "Thanh toán đủ" : "Chuyển về đặt cọc"}
              onClick={(e) =>
                onUpdateStatusSafe(e, booking.id, booking.status === "confirmed_deposit" ? "confirmed_paid" : "confirmed_deposit")
              }
              className="border border-gray-300 hover:bg-gray-100 text-gray-700 w-full sm:w-auto"
            />
          )}
        </div>
      )}
    </div>
  );

  function onUpdateStatusSafe(e, id, status) {
    e.stopPropagation();
    onUpdateStatus(id, status);
  }
}

function ActionButton({ label, onClick, className }) {
  return (
    <button
      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 transform hover:scale-105 ${className}`}
      onClick={onClick}
    >
      {label}
    </button>
  );
}
