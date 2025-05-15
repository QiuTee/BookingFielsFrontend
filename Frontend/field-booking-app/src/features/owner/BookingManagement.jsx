import { useState , useEffect } from "react";
import { Calendar, Clock, CreditCard, Filter, Search, Phone } from "lucide-react";
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
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <input
                placeholder="Tìm kiếm theo tên, số điện thoại, sân..."
                className="pl-8 border rounded w-full py-2"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <select
              className="border rounded px-3 py-2"
              onChange={(e) => setSearchTerm(e.target.value)}
            >
              <option value="">Tất cả</option>
              <option value="Sân số 1">Sân số 1</option>
              <option value="Sân số 2">Sân số 2</option>
              <option value="Sân số 3">Sân số 3</option>
            </select>
          </div>

          <div className="flex gap-2 mt-4">
            {tabs.map((t) => (
              <button
                key={t.value}
                onClick={() => setTab(t.value)}
                className={`px-4 py-2 rounded ${tab === t.value ? "bg-blue-600 text-white" : "bg-gray-100"}`}
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
              <div className="text-center py-10 text-muted-foreground">Không tìm thấy đặt sân nào</div>
            )}
          </div>
        </div>
      </div>

      <div className="lg:col-span-1">
        {selectedBooking ? (
          <BookingDetails booking={selectedBooking} handleStatusChange={handleStatusChange} />
        ) : (
          <div className="border rounded p-6 h-full flex items-center justify-center text-center text-muted-foreground">
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
      className="rounded-lg shadow-md hover:shadow-lg transition-shadow ring-1 ring-blue-200 bg-white cursor-pointer"
      onClick={onSelect}
    >
      <div className="p-4 space-y-2">
        <div className="flex justify-between items-start">
          <div>
            <div className="font-semibold text-blue-800 text-base">{booking.userName}</div>
            <div className="text-sm text-gray-600">{booking.fieldName}</div>
            <div className="text-sm text-gray-600">
              📅 {new Date(booking.date).toLocaleDateString("vi-VN")}
            </div>
          </div>
          <span
            className={`px-3 py-1 rounded-full text-xs font-medium ${statusMap[booking.status || "confirmed_paid"].color}`}
          >
            {statusMap[booking.status || "confirmed_paid"].label}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 text-xs text-gray-500">
          <div className="flex items-center gap-1">
            <Phone className="h-3.5 w-3.5" /> <strong>{booking.phone}</strong>
          </div>
          {(() => {
            const groupedBySubField = booking.slots?.reduce((acc, slot) => {
              acc[slot.subField] = acc[slot.subField] || [];
              acc[slot.subField].push(slot.time);
              return acc;
            }, {}) || {};
            return Object.entries(groupedBySubField).map(([subField, times], idx) => (
              <div key={idx} className="flex items-center gap-1 col-span-full sm:col-span-1">
                <Clock className="h-3.5 w-3.5" /> {subField}: {groupTimeRanges(times).join(", ")}
              </div>
            ));
          })()}
        </div>
      </div>

      <div className="bg-blue-50 px-4 py-2 border-t text-xs sm:text-sm flex flex-wrap justify-end gap-2">
        {["confirmed_paid", "confirmed_deposit", "paid", "pending"].includes(booking.status) && (
          <>
            {(booking.status === "paid" || booking.status === "pending") && (
              <>
                {booking.status === "paid" && (
                  <>
                    <ActionButton
                      label="✅ Thanh toán đủ"
                      onClick={(e) => onUpdateStatusSafe(e, booking.id, "confirmed_paid")}
                      color="bg-blue-600 hover:bg-blue-700 text-white"
                    />
                    <ActionButton
                      label="💰 Đặt cọc"
                      onClick={(e) => onUpdateStatusSafe(e, booking.id, "confirmed_deposit")}
                      color="bg-teal-600 hover:bg-teal-700 text-white"
                    />
                  </>
                )}
                <ActionButton
                  label="❌ Từ chối"
                  onClick={(e) => onUpdateStatusSafe(e, booking.id, "canceled")}
                  color="bg-red-500 hover:bg-red-600 text-white"
                />
              </>
            )}

            {["confirmed_deposit", "confirmed_paid"].includes(booking.status) && (
              <ActionButton
                label={booking.status === "confirmed_deposit" ? "Thanh toán đủ" : "Chuyển về đặt cọc"}
                onClick={(e) =>
                  onUpdateStatusSafe(e, booking.id, booking.status === "confirmed_deposit" ? "confirmed_paid" : "confirmed_deposit")
                }
                color="border border-gray-300 hover:bg-gray-100"
              />
            )}
          </>
        )}
      </div>
    </div>
  );

  function onUpdateStatusSafe(e, id, status) {
    e.stopPropagation();
    onUpdateStatus(id, status);
  }

  function ActionButton({ label, onClick, color }) {
    return (
      <button
        className={`px-3 py-1 rounded transition whitespace-nowrap ${color}`}
        onClick={onClick}
      >
        {label}
      </button>
    );
  }
}

