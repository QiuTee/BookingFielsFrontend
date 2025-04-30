import { useContext } from "react";
import { BookingContext } from "../../context/BookingContext";
import { CalendarIcon, Clock, MapPin, User, Mail, Phone, FileText, ArrowLeft, CheckCircle } from "lucide-react";
import { createBooking } from "../../api/submission";
import { NotificationContext } from "../../context/NotificationContext";
import { useNavigate } from "react-router-dom";

export default function BookingSummary({ prevStep }) {
  const { bookingData } = useContext(BookingContext);
  const { selectionField, selectDate, selectedCell, userData } = bookingData;
  const { showNotification } = useContext(NotificationContext);
  const navigate = useNavigate();

  const groupByField = selectedCell.reduce((acc, { field, slot }) => {
    if (!acc[field]) acc[field] = [];
    acc[field].push(slot);
    return acc;
  }, {});

  function groupContinuousSlots(slots) {
    const sorted = slots.slice().sort();
    const groups = [];
    let start = sorted[0];
    let prev = start;

    for (let i = 1; i < sorted.length; i++) {
      const cur = sorted[i];
      const [ph, pm] = prev.split(":").map(Number);
      const [ch, cm] = cur.split(":").map(Number);
      const prevMin = ph * 60 + pm;
      const curMin = ch * 60 + cm;

      if (curMin - prevMin === 30) {
        prev = cur;
      } else {
        groups.push(`${start} - ${prev}`);
        start = cur;
        prev = cur;
      }
    }
    groups.push(`${start} - ${prev}`);
    return groups;
  }

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("vi-VN", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(date);
  };

  const bookingRef = `BK${Math.floor(Math.random() * 10000).toString().padStart(4, "0")}`;

  const handleConfirmBooking = async () => {
    const Payload = {
      FieldName: selectionField,
      Date: new Date(selectDate).toISOString(),
      Slots: selectedCell.map(({ field, slot }) => ({
        SubField: field,
        Time: slot,
      })),
      UserName: userData.name,
      Phone: userData.phone,
      Notes: userData.notes,
    };

    try {
      const res = await createBooking(Payload);

   
      showNotification({ type: "success", message: "Đặt sân thành công!" });

      setTimeout(() => {
        showNotification({ type: "warning", message: "Vui lòng thanh toán trong vòng 30 phút để tránh bị huỷ đơn!" });
        navigate("/booking-history");
      }, 500);
    } catch (error) {
      showNotification({ type: "error", message: "Đặt sân thất bại!" });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-white p-4 md:p-8">
      <div className="max-w-3xl mx-auto shadow-lg rounded-xl bg-white">
        <div className="bg-blue-100 border-b p-6 rounded-t-xl">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-bold text-blue-700">Xác Nhận Đặt Sân</h2>
              <p className="mt-1 text-sm text-gray-600">Vui lòng kiểm tra thông tin trước khi xác nhận</p>
            </div>
            <span className="px-3 py-1 text-blue-700 border border-blue-200 bg-white rounded text-sm font-semibold">
              Mã đặt sân: {bookingRef}
            </span>
          </div>
        </div>

        <div className="p-6 space-y-6">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2 text-blue-700">
              <MapPin className="h-5 w-5" /> Thông Tin Đặt Sân
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-7">
              <div className="flex items-start gap-2">
                <div className="font-medium text-gray-500 min-w-[100px]">Sân:</div>
                <div className="font-semibold">{selectionField}</div>
              </div>
              <div className="flex items-start gap-2">
                <div className="font-medium text-gray-500 min-w-[100px]">Ngày:</div>
                <div className="font-semibold flex items-center gap-1">
                  <CalendarIcon className="h-4 w-4 text-blue-600" />
                  {formatDate(selectDate)}
                </div>
              </div>
            </div>
          </div>

          <hr />

          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2 text-blue-700">
              <Clock className="h-5 w-5" /> Chi Tiết Khung Giờ
            </h3>

            <div className="space-y-4 pl-7">
              {Object.entries(groupByField).map(([field, slots]) => {
                const ranges = groupContinuousSlots(slots);
                return (
                  <div key={field} className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-medium text-blue-800 mb-2">{field}</h4>
                    <ul className="list-disc ml-5 text-gray-700">
                      {ranges.map((timeRange, idx) => (
                        <li key={idx}>{timeRange}</li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>
          </div>

          <hr />

          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2 text-blue-700">
              <User className="h-5 w-5" /> Thông Tin Người Đặt
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-3 gap-x-6 pl-7">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-gray-500" />
                <span className="text-gray-500 min-w-[100px]">Họ tên:</span>
                <span className="font-medium">{userData.name}</span>
              </div>


              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-gray-500" />
                <span className="text-gray-500 min-w-[100px]">Số điện thoại:</span>
                <span className="font-medium">{userData.phone}</span>
              </div>

              {userData.notes && (
                <div className="flex items-start gap-2 col-span-2">
                  <FileText className="h-4 w-4 text-gray-500 mt-1" />
                  <div>
                    <span className="text-gray-500">Ghi chú:</span>
                    <p className="mt-1 text-gray-700 bg-blue-50 p-2 rounded">{userData.notes}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-between gap-3 py-4 px-6 bg-blue-50 border-t rounded-b-xl">
          <button onClick={prevStep} className="w-full sm:w-auto px-4 py-2 border border-blue-300 rounded hover:bg-blue-100 flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" /> Quay Lại
          </button>
          <button onClick={handleConfirmBooking} className="w-full sm:w-auto px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center gap-2">
            <CheckCircle className="h-4 w-4" /> Xác Nhận Đặt Sân
          </button>
        </div>
      </div>
    </div>
  );
}
