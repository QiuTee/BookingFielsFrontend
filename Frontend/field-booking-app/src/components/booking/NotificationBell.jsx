import { useState, useEffect, useRef } from "react";
import { getBookingsForOwner ,markBookingAsRead } from "../../api/submission";
import { Bell } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion"; 
import { useParams } from "react-router-dom";
export default function NotificationBell({ onOpenBooking }) {
  const [notifications, setNotifications] = useState([]);
  const [open, setOpen] = useState(false);
  const bellRef = useRef();
  const {slug} = useParams();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getBookingsForOwner(slug);
        const unread = data.filter(b => b.status === "pending" && !b.isRead);
        setNotifications(unread);
      } catch (error) {
        console.error("Lỗi khi lấy thông báo:", error);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 15000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (bellRef.current && !bellRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleClickNotification = async (booking) => {
    try {
      await markBookingAsRead(booking.id); 
      setNotifications((prev) => prev.filter((b) => b.id !== booking.id));
      setOpen(false);
      onOpenBooking(booking);
    } catch (err) {
      console.error("Lỗi đánh dấu đã đọc:", err);
    }
  };

  return (
    <div className="relative" ref={bellRef}>
      <button
        onClick={() => setOpen(!open)}
        className="relative text-gray-700 hover:text-blue-600"
      >
        <Bell className="w-6 h-6" />
        {notifications.length > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full px-1.5">
            {notifications.length}
          </span>
        )}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            key="dropdown"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute top-10 right-4 sm:right-6 w-[70vw] sm:w-80 max-w-sm bg-white shadow-lg rounded-lg z-50 border overflow-hidden"
          >
            <div className="px-4 py-3 border-b font-semibold text-blue-800 text-sm sm:text-base">
              Thông báo đặt sân mới
            </div>
            <ul className="max-h-[60vh] overflow-y-auto text-sm sm:text-sm">
              {notifications.length === 0 ? (
                <li className="px-4 py-3 text-gray-500 text-center">
                  Không có thông báo mới.
                </li>
              ) : (
                notifications.map((booking) => (
                  <li
                    key={booking.id}
                    className="px-4 py-3 hover:bg-blue-50 cursor-pointer text-gray-800 border-b"
                    onClick={() => handleClickNotification(booking)}
                  >
                    <p className="font-medium leading-tight">
                      {booking.userName} • {booking.fieldName}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Ngày: {new Date(booking.date).toLocaleDateString("vi-VN")}
                    </p>
                  </li>
                ))
              )}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
