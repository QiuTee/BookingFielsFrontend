import { useState, useEffect } from "react"
import {
  Calendar,
  Clock,
  Filter,
  Search,
  Phone,
  MapPin,
  CheckCircle,
  XCircle,
  Wallet,
  ChevronDown,
  Info,
} from "lucide-react"
import BookingDetails from "./BookingDetails"
import { getBookingsForOwner, updateBookingStatus } from "../../api/submission"
import { groupTimeRanges } from "../../utils/groupTimeRanges"
import { useParams } from "react-router-dom"
import { statusMap } from "../../constants/statusMap"
import { processStatusConfig } from "../../constants/statusProcess"
import ActionButton from "../../components/button/ActionButton"

export default function BookingManagement() {
  const [bookings, setBookings] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedBooking, setSelectedBooking] = useState(null)
  const [tab, setTab] = useState("all")
  const { slug } = useParams()
  const [zoomImageUrl, setZoomImageUrl] = useState(null)
  useEffect(() => {
    if (!slug) return

    const fetchBookings = async () => {
      try {
        const data = await getBookingsForOwner(slug)
        setBookings(data)
      } catch (error) {
        console.error("Error fetching bookings:", error)
      }
    }
    fetchBookings()
    const interval = setInterval(fetchBookings, 15000)
    return () => clearInterval(interval)
  }, [slug])

  const filteredBookings = bookings.filter(
    (booking) =>
      booking.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.phone.includes(searchTerm) ||
      booking.fieldName.toLowerCase().includes(searchTerm.toLowerCase()),
  )
  const getProcessStatusFromStatus = (status) => {
    switch (status){
      case "confirmed_paid":
        case "confirmed_deposit":
          return "confirmed";
      case "canceled":
        return "no_response"
      default:
        return undefined
    }
  }
  const getStatusFromProcessStatus = (processStatus) => {
    switch(processStatus){
      case "no_response":
        return "canceled";
      case "confirmed":
        return "confirmed_paid";
      default:
        return undefined
    }
  }

  const handleStatusChange = async (id, newStatus) => {
    try {
      const processStatus = getProcessStatusFromStatus(newStatus)
      const payload = { status : newStatus , 
        ...(processStatus && {processStatus})
       }
      console.log(payload)
      await updateBookingStatus(id, payload)
      setBookings((prevBookings) =>
        prevBookings.map((booking) => (booking.id === id ? { ...booking, status: newStatus , 
          ...({processStatus}) } : booking)),
      )
      setSelectedBooking((prev) => (prev?.id === id ? { ...prev, status: newStatus , ...({processStatus}) } : prev))
    } catch (error) {
      console.error("Error updating booking status:", error)
    }
  }

const handleProcessStatusChange = async (id, newProcessStatus) => {
  try {

    const status = getStatusFromProcessStatus(newProcessStatus)
    const payload = {
      processStatus: newProcessStatus,
      ...(status && { status }),
    };

    await updateBookingStatus(id, payload);

    setBookings((prevBookings) =>
      prevBookings.map((booking) =>
        booking.id === id
          ? { ...booking, processStatus: newProcessStatus, ...(status && { status}) }
          : booking
      )
    );

    setSelectedBooking((prev) =>
      prev?.id === id
        ? { ...prev, processStatus: newProcessStatus, ...(status && { status}) }
        : prev
    );
  } catch (error) {
    console.error("Error updating booking process status:", error);
  }
};


  const tabs = [
    { value: "all", label: "Tất cả", icon: <Filter className="h-4 w-4" /> },
    { value: "confirmed_deposit", label: "Đã cọc", icon: <Wallet className="h-4 w-4" /> },
    { value: "confirmed_paid", label: "Đã thanh toán", icon: <CheckCircle className="h-4 w-4" /> },
  ]

  const filteredByTab = tab === "all" ? filteredBookings : filteredBookings.filter((b) => b.status === tab)

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2">
        <div className="flex flex-col space-y-4">
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
            <div className="flex flex-col sm:flex-row justify-between gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  placeholder="Tìm kiếm theo tên, số điện thoại, sân..."
                  className="pl-10 pr-4 py-2.5 border rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <select
                className="border rounded-lg px-4 py-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all cursor-pointer"
                onChange={(e) => setSearchTerm(e.target.value)}
              >
                <option value="">Tất cả sân</option>
                <option value="Sân số 1">Sân số 1</option>
                <option value="Sân số 2">Sân số 2</option>
                <option value="Sân số 3">Sân số 3</option>
              </select>
            </div>
          </div>

          <div className="flex gap-2 overflow-x-auto pb-2">
            {tabs.map((t) => (
              <button
                key={t.value}
                onClick={() => setTab(t.value)}
                className={`px-4 py-2.5 rounded-lg font-medium transition-all whitespace-nowrap flex items-center gap-2
                  ${
                    tab === t.value
                      ? "bg-blue-600 text-white shadow-md"
                      : "bg-white text-gray-600 hover:bg-gray-50 border"
                  }`}
              >
                {t.icon}
                {t.label}
              </button>
            ))}
          </div>

          <div className="space-y-4 mt-2">
            {filteredByTab.map((booking) => (
              <BookingCard
                key={booking.id}
                booking={booking}
                onSelect={() => setSelectedBooking(booking)}
                onUpdateStatus={handleStatusChange}
                onUpdateProcessStatus={handleProcessStatusChange}
                isSelected={selectedBooking?.id === booking.id}
                processStatusConfig={processStatusConfig}
              />
            ))}
            {filteredByTab.length === 0 && (
              <div className="text-center py-12 text-gray-500 bg-white rounded-lg border border-dashed border-gray-300">
                <Search className="h-12 w-12 mx-auto text-gray-300 mb-3" />
                <p className="text-lg font-medium">Không tìm thấy đặt sân nào</p>
                <p className="text-sm mt-1">Thử tìm kiếm với từ khóa khác</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="lg:col-span-1 h-fit sticky top-4">
        {selectedBooking ? (
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
            <BookingDetails
              booking={selectedBooking}
              handleStatusChange={handleStatusChange}
              handleProcessStatusChange={handleProcessStatusChange}
              processStatusConfig={processStatusConfig}
              onZoom={(imageUrl) => setZoomImageUrl(imageUrl)}
            />
          </div>
        ) : (
          <div className="border rounded-lg p-8 flex flex-col items-center justify-center text-center text-gray-500 bg-white">
            <Calendar className="h-12 w-12 text-gray-300 mb-3" />
            <p className="font-medium">Chọn một đặt sân để xem chi tiết</p>
            <p className="text-sm mt-1">Thông tin chi tiết sẽ hiển thị tại đây</p>
          </div>
        )}
      </div>

      {zoomImageUrl && (
        <div
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center"
          onClick={() => setZoomImageUrl(null)}
        >
          <img
            src={zoomImageUrl}
            alt="Zoom ảnh thanh toán"
            className="max-w-full max-h-full rounded-lg shadow-lg border-4 border-white cursor-zoom-out"
          />
        </div>
      )}

    </div>
  )
}

function BookingCard({ booking, onSelect, onUpdateStatus, onUpdateProcessStatus, isSelected, processStatusConfig }) {
  const currentProcessStatus = booking.processStatus || "waiting_response"
  return (
    <div
      className={`rounded-lg shadow-sm transition-all duration-200 border bg-white cursor-pointer overflow-hidden
        ${
          isSelected
            ? "ring-2 ring-blue-500 border-blue-500 shadow-md"
            : "hover:shadow-md border-gray-200 hover:border-blue-200"
        }`}
      onClick={onSelect}
    >
      <div className="p-5 space-y-4">
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <div className="font-semibold text-gray-900 text-lg">{booking.userName}</div>
            
          </div>

          <span
            className={`px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-1
              ${statusMap[booking.status || "confirmed_paid"].color}`}
          >
            {booking.status === "confirmed_paid" && <CheckCircle className="h-3.5 w-3.5" />}
            {booking.status === "confirmed_deposit" && <Wallet className="h-3.5 w-3.5" />}
            {statusMap[booking.status || "confirmed_paid"].label}
          </span>
        </div>

        <div className="flex items-center justify-between border-t border-b border-dashed py-2">
          <div className="flex items-center gap-2">
            <Info className="h-4 w-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">Tình trạng:</span>
          </div>

          <div className="relative">
            <select
              value={currentProcessStatus}
              onChange={(e) => {
                e.stopPropagation()
                onUpdateProcessStatus(booking.id, e.target.value)
              }}
              className={`appearance-none pl-3 pr-8 py-1.5 rounded-lg text-xs font-medium border focus:outline-none focus:ring-2 focus:ring-blue-500
                ${processStatusConfig[currentProcessStatus].color}`}
            >
              <option value="waiting_response">Đợi khách phản hồi</option>
              <option value="callback_later">Dự kiến gọi lại sau</option>
              <option value="no_response">Không phản hồi</option>
              <option value="confirmed">Đã xác nhận</option>
            </select>
            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-3 w-3 pointer-events-none" />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="flex items-start gap-2 ">
              <Phone className="h-5 w-5 text-blue-500 mt-0.5" />
              <div>
                <div className="text-sm font-medium text-gray-700">Phone</div>
                <div className="text-sm text-gray-600">{booking.phone}</div>
              </div>
          </div>
          <div className="flex items-start gap-2">
            
            <MapPin className="h-5 w-5 text-blue-500 mt-0.5" />
            <div>
              <div className="text-sm font-medium text-gray-700">Sân</div>
              <div className="text-sm text-gray-600">{booking.fieldName}</div>
            </div>
          </div>

          <div className="flex items-start gap-2">
            <Calendar className="h-5 w-5 text-blue-500 mt-0.5" />
            <div>
              <div className="text-sm font-medium text-gray-700">Ngày</div>
              <div className="text-sm text-gray-600">{new Date(booking.date).toLocaleDateString("vi-VN")}</div>
            </div>
          </div>

          {(() => {
            const groupedBySubField =
              booking.slots?.reduce((acc, slot) => {
                acc[slot.subField] = acc[slot.subField] || []
                acc[slot.subField].push(slot.time)
                return acc
              }, {}) || {}

            return Object.entries(groupedBySubField).map(([subField, times], idx) => (
              <div key={idx} className="flex items-start gap-2 col-span-full sm:col-span-1">
                <Clock className="h-5 w-5 text-blue-500 mt-0.5" />
                <div>
                  <div className="text-sm font-medium text-gray-700">{subField}</div>
                  <div className="text-sm text-gray-600">{groupTimeRanges(times).join(", ")}</div>
                </div>
              </div>
            ))
          })()}
        </div>
      </div>

      {["confirmed_paid", "confirmed_deposit", "paid", "unpaid"].includes(booking.status) && (
        <div className="bg-gray-50 px-4 py-3 border-t flex flex-wrap sm:flex-row sm:justify-end sm:items-center gap-2">
          {(booking.status === "paid" || booking.status === "unpaid") && (
            <>
              {booking.status === "paid" && (
                <>
                  <ActionButton
                    label="Thanh toán đủ"
                    icon={<CheckCircle className="h-4 w-4" />}
                    onClick={(e) => onUpdateStatusSafe(e, booking.id, "confirmed_paid")}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  />
                  <ActionButton
                    label="Đặt cọc"
                    icon={<Wallet className="h-4 w-4" />}
                    onClick={(e) => onUpdateStatusSafe(e, booking.id, "confirmed_deposit")}
                    className="bg-teal-600 hover:bg-teal-700 text-white"
                  />
                </>
              )}
              <ActionButton
                label="Từ chối"
                icon={<XCircle className="h-4 w-4" />}
                onClick={(e) => onUpdateStatusSafe(e, booking.id, "canceled")}
                className="bg-red-500 hover:bg-red-600 text-white"
              />
            </>
          )}

          {["confirmed_deposit", "confirmed_paid"].includes(booking.status) && (
            <ActionButton
              label={booking.status === "confirmed_deposit" ? "Thanh toán đủ" : "Chuyển về đặt cọc"}
              icon={
                booking.status === "confirmed_deposit" ? (
                  <CheckCircle className="h-4 w-4" />
                ) : (
                  <Wallet className="h-4 w-4" />
                )
              }
              onClick={(e) =>
                onUpdateStatusSafe(
                  e,
                  booking.id,
                  booking.status === "confirmed_deposit" ? "confirmed_paid" : "confirmed_deposit",
                )
              }
              className="border border-gray-300 hover:bg-gray-100 text-gray-700"
            />
          )}
        </div>
      )}
    </div>
  )

  function onUpdateStatusSafe(e, id, status) {
    e.stopPropagation()
    onUpdateStatus(id, status)
  }
}


