import { useState, useEffect } from "react";
import { CalendarDays, Clock, MapPin, User } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { getUserBookings, getGuestBookings } from "../../api/submission";
import { useNavigate } from "react-router-dom";

export default function AccountPage() {
  const [tab, setTab] = useState("bookings");
  const { isAuthenticated, user } = useAuth();
  const [bookings, setBookings] = useState([]);

  function getInitials(name) {
    return name.split(" ").map(word => word[0]).join("").toUpperCase();
  }

  useEffect(() => {
    const fetchBookings = async () => {
      let bookings = [];
      if (isAuthenticated) {
        bookings = await getUserBookings(user.id);
      } else {
        bookings = await getGuestBookings();
      }

      const now = new Date();
      const filtered = bookings.filter((booking) => {
        if (booking.status === "unpaid") {
          const createdAt = new Date(booking.createdAt);
          return (now - createdAt) / 30 * 60 * 1000;
        }
        return true;
      });
      setBookings(filtered);
    };
    fetchBookings();
  }, [isAuthenticated, user]);

  return (
    <div className="container mx-auto py-8 px-4 pb-16">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-6 pb-6 border-b">
          <div className={`h-20 w-20 rounded-full overflow-hidden bg-blue-100 flex items-center justify-center text-xl font-bold ${user?.avatarUrl ? "text-white" : "text-blue-700"}`}>
            {user?.avatarUrl ? (
              <img src={user.avatarUrl} alt="Avatar" className="h-full w-full object-cover" />
            ) : (
              <span>{getInitials(user?.name || "Khách")}</span>
            )}
          </div>

          <div className="space-y-1">
            {isAuthenticated ? (
              <>
                <h1 className="text-2xl font-bold">{user?.name}</h1>
                <div className="flex items-center text-gray-500">
                  <User className="mr-2 h-4 w-4" />
                  <span>ID: #{user?.id}</span>
                </div>
                <div className="flex items-center text-gray-500">
                  <Clock className="mr-2 h-4 w-4" />
                  <span>Thành viên từ: {user?.createdAt}</span>
                </div>
              </>
            ) : (
              <>
                <h1 className="text-2xl font-bold">Khách chưa đăng nhập</h1>
                <p className="text-gray-500">Vui lòng đăng nhập để xem thông tin tài khoản</p>
              </>
            )}
          </div>

          {isAuthenticated && (
            <div className="ml-auto mt-4 md:mt-0">
              <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded">
                Chỉnh sửa hồ sơ
              </button>
            </div>
          )}
        </div>

        <div className="w-full">
          <div className="flex space-x-4 border-b mb-4">
            <button className={`px-4 py-2 font-semibold ${tab === 'bookings' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-600'}`} onClick={() => setTab('bookings')}>Sân đã đặt</button>
            <button className={`px-4 py-2 font-semibold ${tab === 'upcoming' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-600'}`} onClick={() => setTab('upcoming')}>Sắp tới</button>
            <button className={`px-4 py-2 font-semibold ${tab === 'history' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-600'}`} onClick={() => setTab('history')}>Lịch sử</button>
          </div>

          {tab === 'bookings' && (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {bookings.map((booking) => (
                <BookingCard key={booking.id} booking={booking} />
              ))}
            </div>
          )}

          {tab === 'upcoming' && (
            isAuthenticated ? (
              <div className="flex items-center justify-center h-40 bg-blue-50 rounded-lg">
                <p className="text-gray-500">Không có lịch đặt sân sắp tới</p>
              </div>
            ) : (
              <div className="text-center text-gray-600 py-10">
                <p className="text-lg font-semibold text-blue-700 mb-2">Bạn cần đăng nhập để xem lịch đặt sắp tới</p>
                <a href="/login" className="inline-block px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg mt-2">Đăng nhập ngay</a>
              </div>
            )
          )}

          {tab === 'history' && (
            isAuthenticated ? (
              <div className="space-y-4">
                {historyBookings.map((booking) => (
                  <HistoryBookingCard key={booking.id} booking={booking} />
                ))}
              </div>
            ) : (
              <div className="text-center text-gray-600 py-10">
                <p className="text-lg font-semibold text-blue-700 mb-2">Vui lòng đăng nhập để xem lịch sử đặt sân</p>
                <a href="/login" className="inline-block px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg mt-2">Đăng nhập ngay</a>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
}

function BookingCard({ booking }) {
  const navigate = useNavigate();

  return (
    <div className="border rounded shadow overflow-hidden">
      <div className="h-40 bg-blue-100 relative">
        <img src={booking.heroImage || "/placeholder.svg"} alt={booking.fieldName} className="w-full h-full object-cover opacity-80" />
        <div className="absolute top-3 right-3 bg-blue-700 text-white px-3 py-1 rounded-full text-sm font-medium">
          {booking.status}
        </div>
      </div>
      <div className="p-4">
        <h2 className="text-xl font-semibold text-blue-900 mb-1">{booking.fieldName}</h2>
        <div className="flex items-center text-gray-500 mb-2">
          <MapPin className="h-4 w-4 mr-1" /> {booking.location}
        </div>
        <div className="text-sm space-y-1">
          <div className="flex justify-between">
            <div className="flex items-center text-gray-500">
              <CalendarDays className="h-4 w-4 mr-2" /> Ngày
            </div>
            <div className="font-medium">{new Date(booking.date).toLocaleDateString("vi-VN")}</div>
          </div>
          <div className="flex justify-between">
            <div className="flex items-center text-gray-500">
              <Clock className="h-4 w-4 mr-2" /> Thời gian
            </div>
            <div className="font-medium">{booking.time}</div>
          </div>
        </div>
        <div className="flex justify-between mt-4">
          {booking.status === "unpaid" && (
            <button onClick={() => navigate(`/payment/${booking.id}`)} className="text-blue-600 border border-blue-200 hover:bg-blue-600 px-4 py-1 rounded transition">Thanh toán</button>
          )}
          {booking.status === "confirmed" && (
            <button className="text-blue-600 border border-blue-200 px-4 py-1 rounded">Đã thanh toán</button>
          )}
          <button onClick={() => navigate(`/booking-detail/${booking.id}`)} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1 rounded">Chi tiết</button>
        </div>
      </div>
    </div>
  );
}

function HistoryBookingCard({ booking }) {
  return (
    <div className="border rounded shadow p-4">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-lg font-semibold text-blue-900">{booking.fieldName}</h2>
          <div className="flex items-center text-gray-500 text-sm">
            <MapPin className="h-4 w-4 mr-1" /> {booking.location}
          </div>
        </div>
        <div className={`px-3 py-1 rounded-full text-sm font-medium ${booking.status === "Hoàn thành" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
          {booking.status}
        </div>
      </div>
      <div className="flex justify-between text-sm mt-2 text-gray-600">
        <div className="flex items-center">
          <CalendarDays className="h-4 w-4 mr-1" /> {booking.date}
        </div>
        <div className="flex items-center">
          <Clock className="h-4 w-4 mr-1" /> {booking.time}
        </div>
      </div>
      <div className="flex justify-end mt-3">
        <button className="text-blue-600 hover:underline">Đặt lại</button>
        <button className="ml-3 text-blue-600 border border-blue-200 px-3 py-1 rounded hover:bg-blue-50">Chi tiết</button>
      </div>
    </div>
  );
}

const historyBookings = [
  {
    id: 101,
    fieldName: "Sân Bóng Đá Mini Thống Nhất",
    location: "123 Nguyễn Huệ, Quận 1, TP.HCM",
    date: "01/05/2023",
    time: "18:00 - 20:00",
    status: "Hoàn thành",
  },
  {
    id: 102,
    fieldName: "Sân Bóng Đá Phú Nhuận",
    location: "45 Phan Đình Phùng, Phú Nhuận, TP.HCM",
    date: "28/04/2023",
    time: "19:00 - 21:00",
    status: "Đã hủy",
  },
  {
    id: 103,
    fieldName: "Sân Bóng Đá Rạch Miễu",
    location: "78 Điện Biên Phủ, Bình Thạnh, TP.HCM",
    date: "20/04/2023",
    time: "17:30 - 19:30",
    status: "Hoàn thành",
  },
];
