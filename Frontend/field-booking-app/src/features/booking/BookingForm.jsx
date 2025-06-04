import { User, Mail, Phone, StickyNote } from "lucide-react";
import { useState } from "react";
import { useContext } from "react";
import { NotificationContext } from "../../context/NotificationContext";
import { BookingContext } from "../../context/BookingContext";
import { useAuth } from "../../context/AuthContext";
import SelectedSlotsSummary from "../../components/SelectedSlotsSummary";
import FormatDate from "../../hooks/FormatDate";
export default function BookingForm({prevStep , nextStep}) {
  const [error, setError] = useState({
    name: "",
    phone: "",
  });
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    notes: "",
  });
  const { bookingData, setBookingData } = useContext(BookingContext);
  const {showNotification} = useContext(NotificationContext);
  const { isAuthenticated } = useAuth();
  const validateForm = () => {
    let valid = true;
    const newError = { name: "", phone: "" };

    if (!formData.name.trim()) {
      newError.name = "Vui lòng nhập họ tên";
      showNotification({type:"error", message: newError.name});
      valid = false;
    }

    if (!formData.phone.trim()) {
      newError.phone = "Vui lòng nhập số điện thoại";
      showNotification({type:"error", message: newError.phone});
      valid = false;
    } else if (!/^[0-9]{10}$/.test(formData.phone.trim())) {
      newError.phone = "Số điện thoại không hợp lệ";
      showNotification({type:"error", message: newError.phone});
      valid = false;
    }

    setError(newError);
    return valid;
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      showNotification({type:"info", message: "Bạn đang đặt sân với tư cách khách."});
    }
    
    if (validateForm()) {
      setBookingData((prev) => ({
        ...prev, 
        userData : {
          name : formData.name,
          phone : formData.phone,
          notes : formData.notes,
        }
      }))
      nextStep();
    }
  }
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center p-6">
      <div className="w-full max-w-4xl bg-white shadow-2xl rounded-3xl p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <div className="text-sm text-gray-700 mb-4">
            <a
              href=""
              className="flex items-center gap-1 text-black font-medium hover:underline"
              onClick={(e) => {
                e.preventDefault();
                prevStep();
              }}
            >
              <span>&larr;</span> Quay lại
            </a>
          </div>
          <h1 className="text-2xl font-bold text-blue-700 mb-6">Thông Tin Người Đặt</h1>

          <form className="space-y-5">
          <div>
            <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-1">
              Tên người đặt
            </label>
            <div className="relative">
              <input
                type="text"
                id="name"
                placeholder="Nguyễn Văn A"
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
              <User className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
            </div>
          </div>

          

          <div>
            <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mb-1">
              Số điện thoại
            </label>
            <div className="relative">
              <input
                type="tel"
                id="phone"
                placeholder="0123456789"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <Phone className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
            </div>
          </div>

          <div>
            <label htmlFor="note" className="block text-sm font-semibold text-gray-700 mb-1">
              Ghi chú
            </label>
            <div className="relative">
              <textarea
                id="note"
                rows="3"
                placeholder="Nhập yêu cầu đặc biệt hoặc ghi chú thêm..."
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              />
              <StickyNote className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-xl shadow-md transition"
            onClick={handleSubmit}
          >
            Xác nhận đặt sân
          </button>
        </form>
        </div>
        <div className="md:border-l md:pl-6">
          <h2 className="text-xl font-semibold text-blue-700 mb-4">Tóm Tắt Đặt Sân</h2>
          <p className="text-sm text-gray-700"><strong>Sân:</strong> {bookingData.selectionField}</p>
          <p className="text-sm text-gray-700 mb-4"><strong>Ngày:</strong> {FormatDate(bookingData.selectDate)}</p>
          <SelectedSlotsSummary selectedCell={bookingData.selectedCell} />
        </div>
      </div>
    </div>
  );
}
