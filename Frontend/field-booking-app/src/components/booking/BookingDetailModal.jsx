import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { statusMap } from "../../constants/statusMap";


export default function BookingDetailModal({ booking, onClose }) {
  const [zoomImage, setZoomImage] = useState(false);

  if (!booking) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full relative">
          <button
            onClick={onClose}
            className="absolute top-2 right-2 text-gray-600 hover:text-red-600 text-xl"
          >
            ✕
          </button>
          <h2 className="text-xl font-bold mb-2">Chi tiết đặt sân #{booking.id}</h2>
          <p><strong>Sân:</strong> {booking.fieldName}</p>
          <p><strong>Ngày:</strong> {new Date(booking.date).toLocaleDateString("vi-VN")}</p>
          <p><strong>Trạng thái:</strong> 
           <span className={`${statusMap[booking.status || "confirmed"].color}`}>{statusMap[booking.status || "confirmed"].label}</span> 
          </p>

          {booking.paymentImageUrl && (
            <div className="mt-4">
              <p className="font-semibold">Ảnh thanh toán:</p>
              <img
                src={booking.paymentImageUrl}
                alt="Thanh toán"
                className="w-40 h-auto mt-2 cursor-zoom-in border rounded"
                onClick={() => setZoomImage(true)}
              />
            </div>
          )}
        </div>
      </div>

      <AnimatePresence>
        {zoomImage && (
          <motion.div
            className="fixed inset-0 bg-black/80 z-[60] flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setZoomImage(false)}
          >
            <motion.img
              src={booking.paymentImageUrl}
              alt="Zoom ảnh thanh toán"
              initial={{ scale: 0.7 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.7 }}
              transition={{ duration: 0.3 }}
              className="max-w-full max-h-full rounded-lg shadow-lg border-4 border-white cursor-zoom-out"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
