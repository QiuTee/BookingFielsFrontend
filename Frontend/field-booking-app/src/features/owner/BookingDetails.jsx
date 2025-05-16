import { Calendar, Clock, CreditCard, User, Phone, MapPin } from "lucide-react";
import { groupTimeRanges } from "../../utils/groupTimeRanges";
import { statusMap } from "../../constants/statusMap";
import { useState } from "react";
import { AnimatePresence, motion, scale } from "framer-motion";


export default function BookingDetails({ booking, handleStatusChange }) {
  const totalCost = booking.slots.length * 50000;
  const [zoomImage , setZoomImage] = useState(false)
  return (
    <div className="flex flex-col rounded-xl shadow-lg ring-1 ring-blue-200 bg-blue-100 transition-all duration-200 ease-in-out overflow-hidden hover:scale-[1.01]">
      <div className="border-b px-4 py-3 bg-blue-200 flex justify-between items-center">
        <h2 className="font-semibold text-lg">Chi tiết đặt sân</h2>
        <span
          className={`px-3 py-1 rounded-full text-sm font-medium ${statusMap[booking.status || "confirmed_paid"].color}`}
        >
          {statusMap[booking.status || "confirmed_paid"].label}
        </span>
      </div>

      <div className="flex-1 p-4 overflow-y-auto space-y-6">
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-gray-500">Thông tin khách hàng</h3>
          <div className="grid gap-2">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-gray-500" />
              <span>{booking.userName}</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-gray-500" />
              <a href={`tel:${booking.phone}`}><strong>{booking.phone}</strong></a>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <h3 className="text-sm font-medium text-gray-500">Thông tin đặt sân</h3>
          <div className="grid gap-2">
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-gray-500" />
              <span>{booking.fieldName}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-gray-500" />
              <span>{new Date(booking.date).toLocaleDateString("vi-VN")}</span>
            </div>
            <div className="flex items-center gap-2">
              {(() => {
                const groupedBySubField = booking.slots?.reduce((acc ,slot) => {
                    acc[slot.subField] = acc[slot.subField] || [];
                    acc[slot.subField].push(slot.time);
                    return acc;
                }, {}) || {};
                return Object.entries(groupedBySubField).map(([subField, times], idx) => (
                    <div key={idx} className="flex items-center gap-1">
                    <Clock className="h-4 w-4 text-gray-500" />{subField}: {groupTimeRanges(times).join(", ")}
                    </div>
                ));
                })()}
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <h3 className="text-sm font-medium text-gray-500">Thông tin thanh toán</h3>
          <div className="bg-gray-100 p-3 rounded-md space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">Tổng tiền:</span>
              <span className="font-medium">{totalCost.toLocaleString("vi-VN")}đ</span>
            </div>

          </div>
        </div>
        {booking.paymentImageUrl && (
        <div className="space-y-2">
          <p className="text-sm font-medium text-gray-500">Ảnh thanh toán</p>
          <img 
            src={booking.paymentImageUrl}
            alt="Thanh toán"
            className="w-40 h-auto mt-2 cursor-zoom-in border rounded"
            onClick={() => setZoomImage(true)}
          />

        </div>
      )}
      </div>
      
      <AnimatePresence>
        {zoomImage && (
          <motion.div
            className="fixed inset-0 bg-black/80 z[60] flex items-center justify-center"
            initial={{opacity: 0}}
            animate={{opacity: 1}}
            exit={{opacity: 0}}
            onClick={() => setZoomImage(false)}
          >
            <motion.img
              src={booking.paymentImageUrl}
              alt="Zoom hình ảnh thanh toán"
              initial={{scale: 0.7}}
              animate={{scale: 1}}
              exit={{scale: 0.7}}
              transition={{duration:0.3}}
              className="max-w-full max-h-full rounded-lg shadow-lg border-4 border-white cursor-zoom-out"

            />
          </motion.div>
        )}
      </AnimatePresence>

      {(booking.status === "confirmed_deposit" || booking.status === "confirmed_paid") && (
        <div className="border-t p-4 bg-blue-200">
          {booking.status === "confirmed_deposit" ? (
            <button
              className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 flex items-center justify-center gap-2"
              onClick={() => handleStatusChange(booking.id, "confirmed_paid")}
            >
              <CreditCard className="h-4 w-4" />
              Đánh dấu đã thanh toán đủ
            </button>
          ) : (
<button
              className="w-full border border-blue-500 text-blue-800 bg-blue-100 py-2 px-4 rounded hover:bg-blue-200"
              onClick={() => handleStatusChange(booking.id, "confirmed_deposit")}
            >
              Chuyển về trạng thái đặt cọc
            </button>
          )}
        </div>
      )}

    </div>
  );
}
