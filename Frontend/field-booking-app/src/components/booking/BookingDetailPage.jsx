import { useParams , useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getBookingById } from "../../api/submission";
import { ArrowLeft, MapPin, Clock, CalendarDays, Phone, Star, CheckCircle } from "lucide-react";
import { groupTimeRanges } from "../../utils/groupTimeRanges";

export default function BookingDetailPage() {
    const { bookingId } = useParams();
    const [booking, setBooking] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchBooking = async () => {
            try {
                const data = await getBookingById(bookingId);
                console.log("Booking data:", data);
                setBooking(data);

            }catch (error) {
                console.error("Error fetching booking:", error);
                navigate("/booking-history"); 
            }
        };
        fetchBooking();
    },[bookingId]);

    if (!booking) return <div className="p-10 text-center text-blue-700 font-medium">Đang tải dữ liệu đặt sân...</div>;
    const total = booking.slots.length * 50000 ; 
    return (
        <div className="min-h-screen bg-sky-50 p-4 space-y-6">
          <div className="flex items-center gap-2 text-blue-700">
            <button onClick={() => navigate(-1)} className="flex items-center gap-1 hover:underline">
              <ArrowLeft className="h-5 w-5" /> Quay lại
            </button>
            <h1 className="ml-auto text-xl font-bold">Mã đặt sân: BK{String(booking.id).padStart(4, "0")}</h1>
          </div>
    
          <div className={`w-fit px-4 py-2 rounded-full font-semibold text-sm ${
            booking.status === "confirmed" ? "bg-green-100 text-green-700" :
            booking.status === "unpaid" ? "bg-yellow-100 text-yellow-700" :
            "bg-gray-100 text-gray-700"
          }`}>
            Trạng thái: {booking.status === "confirmed" ? "Đã xác nhận" : booking.status === "unpaid" ? "Chờ xác nhận" : booking.status}
          </div>
    
          <div className="bg-white p-4 rounded-xl shadow space-y-4">
            <img src={booking.logo || "/placeholder.svg"} alt="field" className="rounded-lg w-full h-64 object-cover" />
            <h2 className="text-2xl font-bold">{booking.fieldName}</h2>
            <div className="text-gray-600 flex items-center gap-2"><MapPin className="w-4 h-4" /> Địa chỉ sân</div>
            <div className="text-gray-600 flex items-center gap-2"><Phone className="w-4 h-4" /> {booking.phone}</div>
          </div>
    
          <div className="bg-white p-4 rounded-xl shadow space-y-2">
            <h3 className="text-lg font-semibold text-blue-700 mb-2">Thông tin đặt sân</h3>
            <div className="flex items-center gap-2 text-gray-700"><CalendarDays className="w-4 h-4" /> {new Date(booking.date).toLocaleDateString("vi-VN")}</div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {Object.entries(
                booking.slots.reduce((acc, slot) => {
                  if (!acc[slot.subField]) acc[slot.subField] = [];
                  acc[slot.subField].push(slot.time);
                  return acc;
                },{})
              ).map(([subField, times]) => (
                <div key={subField} 
                className="bg-blue-100 text-blue-800 rounded-lg px-3 py-1 text-sm"
                >
                  <strong className="text-blue-700">{subField}:</strong>{" "}
                  {groupTimeRanges(times).join(", ")}
                </div>
              ))
              }

            </div>
          </div>
    
          <div className="bg-white p-4 rounded-xl shadow space-y-2">
            <h3 className="text-lg font-semibold text-blue-700">Chi tiết thanh toán</h3>
            <p>Giá sân: {booking.slots.length} khung giờ x 50.000đ</p>
            <p>Phí dịch vụ: 0đ</p>
            <p className="font-bold text-green-700">Tổng cộng: {total.toLocaleString("vi-VN")}đ</p>
            <div className="mt-2 text-sm text-gray-700">
              <strong>Trạng thái thanh toán:</strong> {booking.status === "confirmed" ? "Đã thanh toán" : "Chưa thanh toán"}
            </div>
          </div>
    
          <div className="flex justify-between gap-4">
            <button className="w-full bg-yellow-400 hover:bg-yellow-500 text-white font-semibold py-2 rounded-lg">Đổi lịch đặt</button>
            <button className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-2 rounded-lg">Huỷ đặt sân</button>
          </div>
        </div>
      );


}