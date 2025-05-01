import { useState, useEffect, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getBookingById } from "../../api/submission";
import { NotificationContext } from "../../context/NotificationContext";
import SelectedSlotsSummary from "../../components/SelectedSlotsSummary";

export default function Payment() {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const { showNotification } = useContext(NotificationContext);
  const [bookingInfo, setBookingInfo] = useState(null);
  const [processing, setProcessing] = useState(false);

  const [method, setMethod] = useState("card");
  const [payer, setPayer] = useState({ name: "", email: "", phone: "", address: "" });

  const [paymentImage, setPaymentImage] = useState(null);
  const [studentCardImage, setStudentCardImage] = useState(null);

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const data = await getBookingById(bookingId);
        setBookingInfo(data);
      } catch (error) {
        console.error("Lỗi khi lấy booking:", error);
        showNotification({ type: "error", message: "Không lấy được đơn hàng" });
        navigate("/booking-history");
      }
    };
    if (bookingId) fetchBooking();
  }, [bookingId, navigate, showNotification]);

  if (!bookingInfo) {
    return <div className="p-8 text-center text-blue-600 font-semibold">\u0110ang tải đơn hàng...</div>;
  }

  const orderTotal = bookingInfo.slots.length * 50000;

  const handlePayment = () => {
    if (!paymentImage) {
      showNotification({ type: "error", message: "Vui lòng tải lên ảnh chuyển khoản để xác nhận!" });
      return;
    }

    setProcessing(true);
    setTimeout(() => {
      setProcessing(false);
      showNotification({ type: "success", message: "Thanh toán thành công!" });
      navigate("/booking-history");
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-6">
        <div className="bg-white rounded-2xl shadow p-6">
          <h2 className="text-xl font-bold text-blue-700 mb-4">1. Chọn phương thức thanh toán</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              className={`border rounded-lg p-4 text-center ${method === "card" ? "border-blue-600" : ""}`}
              onClick={() => setMethod("card")}
            >
              Thẻ tín dụng / ghi nợ</button>
            <button
              className={`border rounded-lg p-4 text-center ${method === "bank" ? "border-blue-600" : ""}`}
              onClick={() => setMethod("bank")}
            >
              Internet Banking</button>
            <button
              className={`border rounded-lg p-4 text-center ${method === "wallet" ? "border-blue-600" : ""}`}
              onClick={() => setMethod("wallet")}
            >
              Ví điện tử</button>
          </div>

          <div className="mt-6">
            {method === "card" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input className="border rounded p-3" placeholder="Số thẻ" />
                <input className="border rounded p-3" placeholder="Họ tên trên thẻ" />
                <input className="border rounded p-3" placeholder="Ngày hết hạn (MM/YY)" />
                <input className="border rounded p-3" placeholder="CVV" />
              </div>
            )}
            {method === "bank" && (
              <select className="w-full border rounded p-3">
                <option>Chọn ngân hàng</option>
                <option>Vietcombank</option>
                <option>Techcombank</option>
                <option>ACB</option>
              </select>
            )}
            {method === "wallet" && (
              <div className="text-center mt-4">
                <img src="/images/payment/momo.jpg" alt="QR Code" className="mx-auto w-40" />
                <p className="mt-2 text-sm text-gray-500">Quét mã bằng Momo/ZaloPay để thanh toán</p>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow p-6">
          <h2 className="text-xl font-bold text-blue-700 mb-4">2. Tải hình ảnh xác nhận thanh toán</h2>
          <div className="space-y-4">
            <div>
              <label className="block font-semibold text-gray-700 mb-2">Ảnh chuyển khoản <span className="text-red-500">*</span></label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setPaymentImage(e.target.files[0])}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
            </div>

            <div>
              <label className="block font-semibold text-gray-700 mb-2">Ảnh thẻ sinh viên (không bắt buộc)</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setStudentCardImage(e.target.files[0])}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow p-6">
          <h2 className="text-xl font-bold text-blue-700 mb-4">3. Thông tin đặt sân</h2>
          <div className="text-gray-700 space-y-1">
            <p><strong>Sân:</strong> {bookingInfo.fieldName}</p>
            <p><strong>Ngày:</strong> {new Date(bookingInfo.date + "T00:00:00").toLocaleDateString('vi-VN')}</p>
            <p className="mt-2 font-semibold text-blue-600">Khung giờ đã đặt:</p>
            <SelectedSlotsSummary selectedCell={bookingInfo.slots.map(s => ({ field: s.subField, slot: s.time }))} />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow p-6 h-fit">
        <h2 className="text-xl font-bold text-blue-700 mb-4">Tóm tắt đơn hàng</h2>
        <div className="text-sm font-semibold mb-2 text-gray-700">
          Người đặt: {bookingInfo.userName}
        </div>
        <div className="text-sm font-semibold mb-2 text-gray-700">
          Số điện thoại: {bookingInfo.phone}
        </div>
        <div className="text-sm font-semibold mb-2 text-gray-700">
          Tạm tính: {orderTotal.toLocaleString('vi-VN')}đ
        </div>
        <div className="text-sm font-semibold mb-2 text-gray-700">
          Giảm giá: 0đ
        </div>
        <div className="text-lg font-bold text-green-700 mb-4">
          Tổng cộng: {orderTotal.toLocaleString('vi-VN')}đ
        </div>

        <button
          onClick={handlePayment}
          disabled={processing}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition disabled:opacity-50"
        >
          {processing ? "Đang xử lý..." : "Hoàn tất thanh toán"}
        </button>
      </div>
    </div>
  );
}
