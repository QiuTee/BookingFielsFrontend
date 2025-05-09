import { useState, useEffect } from "react";
import { getUserBookings , autoCancelBookings } from "../api/submission";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import BookingList from "../components/booking/BookingList";
import BookingDetail from "../components/booking/BookingDetail";

export default function BookingHistory() {
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        await autoCancelBookings(); 
        const data = await getUserBookings();
        setBookings(data);
        setFiltered(data);
      } catch (error) {
        console.error("Lỗi khi tải lịch sử đặt sân:", error);
      }
    };
    fetchBookings();
  }, []);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate(-1);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    setFiltered(
      bookings.filter(
        (b) =>
          b.fieldName?.toLowerCase().includes(search.toLowerCase()) ||
          b.date?.includes(search)
      )
    );
  }, [search, bookings]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold text-blue-700 mb-6">Lịch sử đặt sân</h1>

      <input
        type="text"
        placeholder="🔍 Tìm kiếm sân hoặc ngày..."
        className="w-full max-w-xs mb-4 p-2 border rounded-lg shadow-sm"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <BookingList bookings={filtered} onSelect={setSelected} />
      {selected && <BookingDetail booking={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}
