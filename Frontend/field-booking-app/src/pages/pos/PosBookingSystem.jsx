
import { useState } from "react"
import {
  Calendar,
  Users,
  Phone,
  Plus,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  CalendarIcon,
  X,
} from "lucide-react"


export default function PosBookingSystem() {
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [selectedCourt, setSelectedCourt] = useState("all")
  const [showDatePicker, setShowDatePicker] = useState(false)
  const [showBookingDialog, setShowBookingDialog] = useState(false)
  const [bookings, setBookings] = useState([
    {
      id: "1",
      courtId: "A1",
      courtName: "Sân A1",
      date: "2024-01-15",
      startTime: "09:00",
      endTime: "11:00",
      customerName: "Nguyễn Văn A",
      customerPhone: "0901234567",
      customerEmail: "nguyenvana@email.com",
      numberOfPlayers: 4,
      status: "confirmed",
      notes: "Đặt sân cho giải đấu công ty",
      totalAmount: 200000,
      createdAt: "2024-01-14T10:30:00Z",
    },
    {
      id: "2",
      courtId: "B1",
      courtName: "Sân B1",
      date: "2024-01-15",
      startTime: "14:00",
      endTime: "16:00",
      customerName: "Trần Thị B",
      customerPhone: "0907654321",
      numberOfPlayers: 6,
      status: "pending",
      totalAmount: 240000,
      createdAt: "2024-01-14T15:20:00Z",
    },
  ])

  const courts = [
    { id: "A1", name: "Sân A1", type: "Sân cỏ nhân tạo", pricePerHour: 100000, capacity: 10, available: true },
    { id: "A2", name: "Sân A2", type: "Sân cỏ nhân tạo", pricePerHour: 100000, capacity: 10, available: true },
    { id: "B1", name: "Sân B1", type: "Sân cỏ tự nhiên", pricePerHour: 120000, capacity: 14, available: true },
    { id: "B2", name: "Sân B2", type: "Sân cỏ tự nhiên", pricePerHour: 120000, capacity: 14, available: false },
    { id: "C1", name: "Sân C1", type: "Sân futsal", pricePerHour: 80000, capacity: 8, available: true },
    { id: "C2", name: "Sân C2", type: "Sân futsal", pricePerHour: 80000, capacity: 8, available: true },
  ]

  const timeSlots = [
    "06:00",
    "07:00",
    "08:00",
    "09:00",
    "10:00",
    "11:00",
    "12:00",
    "13:00",
    "14:00",
    "15:00",
    "16:00",
    "17:00",
    "18:00",
    "19:00",
    "20:00",
    "21:00",
    "22:00",
  ]

  const [newBooking, setNewBooking] = useState({
    courtId: "",
    date: "",
    startTime: "",
    endTime: "",
    customerName: "",
    customerPhone: "",
    customerEmail: "",
    numberOfPlayers: 1,
    notes: "",
  })

  const formatDate = (date) => {
    return date.toLocaleDateString("vi-VN", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price)
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-800 border-green-200"
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case "confirmed":
        return <CheckCircle className="h-4 w-4" />
      case "pending":
        return <AlertCircle className="h-4 w-4" />
      case "cancelled":
        return <XCircle className="h-4 w-4" />
      default:
        return null
    }
  }

  const getStatusText = (status) => {
    switch (status) {
      case "confirmed":
        return "Đã xác nhận"
      case "pending":
        return "Chờ xác nhận"
      case "cancelled":
        return "Đã hủy"
      default:
        return "Không xác định"
    }
  }

  const isTimeSlotBooked = (courtId, date, time) => {
    return bookings.some(
      (booking) =>
        booking.courtId === courtId &&
        booking.date === date &&
        booking.status !== "cancelled" &&
        time >= booking.startTime &&
        time < booking.endTime,
    )
  }

  const calculateDuration = (startTime, endTime) => {
    const start = new Date(`2000-01-01T${startTime}:00`)
    const end = new Date(`2000-01-01T${endTime}:00`)
    return (end.getTime() - start.getTime()) / (1000 * 60 * 60)
  }

  const calculateAmount = (courtId, startTime, endTime) => {
    const court = courts.find((c) => c.id === courtId)
    if (!court) return 0
    const duration = calculateDuration(startTime, endTime)
    return court.pricePerHour * duration
  }

  const handleCreateBooking = () => {
    if (
      !newBooking.courtId ||
      !newBooking.date ||
      !newBooking.startTime ||
      !newBooking.endTime ||
      !newBooking.customerName ||
      !newBooking.customerPhone
    ) {
      return
    }

    const court = courts.find((c) => c.id === newBooking.courtId)
    const totalAmount = calculateAmount(newBooking.courtId, newBooking.startTime, newBooking.endTime)

    const booking = {
      id: Date.now().toString(),
      courtId: newBooking.courtId,
      courtName: court?.name || "",
      date: newBooking.date,
      startTime: newBooking.startTime,
      endTime: newBooking.endTime,
      customerName: newBooking.customerName,
      customerPhone: newBooking.customerPhone,
      customerEmail: newBooking.customerEmail,
      numberOfPlayers: newBooking.numberOfPlayers,
      status: "confirmed",
      notes: newBooking.notes,
      totalAmount,
      createdAt: new Date().toISOString(),
    }

    setBookings([...bookings, booking])
    setNewBooking({
      courtId: "",
      date: "",
      startTime: "",
      endTime: "",
      customerName: "",
      customerPhone: "",
      customerEmail: "",
      numberOfPlayers: 1,
      notes: "",
    })
    setShowBookingDialog(false)
  }

  const todayBookings = bookings.filter((booking) => booking.date === selectedDate.toISOString().split("T")[0])

  return (
    <div className="flex h-[calc(100vh-80px)]">
      <div className="w-80 bg-white border-r border-gray-200 p-4">
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">Lịch đặt sân</h3>
            <div className="flex items-center space-x-1">
              <button
                className="p-2 hover:bg-gray-100 rounded-md transition-colors"
                onClick={() => {
                  const newDate = new Date(selectedDate)
                  newDate.setDate(newDate.getDate() - 1)
                  setSelectedDate(newDate)
                }}
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <div className="relative">
                <button
                  className="p-2 hover:bg-gray-100 rounded-md transition-colors border border-gray-300"
                  onClick={() => setShowDatePicker(!showDatePicker)}
                >
                  <CalendarIcon className="h-4 w-4" />
                </button>
                {showDatePicker && (
                  <div className="absolute top-full right-0 mt-1 bg-white border border-gray-300 rounded-md shadow-lg p-2 z-10">
                    <input
                      type="date"
                      value={selectedDate.toISOString().split("T")[0]}
                      onChange={(e) => {
                        setSelectedDate(new Date(e.target.value))
                        setShowDatePicker(false)
                      }}
                      className="p-2 border border-gray-300 rounded-md"
                    />
                  </div>
                )}
              </div>
              <button
                className="p-2 hover:bg-gray-100 rounded-md transition-colors"
                onClick={() => {
                  const newDate = new Date(selectedDate)
                  newDate.setDate(newDate.getDate() + 1)
                  setSelectedDate(newDate)
                }}
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
            <div className="p-3">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{selectedDate.getDate()}</div>
                <div className="text-sm text-gray-600">
                  {selectedDate.toLocaleDateString("vi-VN", { month: "long", year: "numeric" })}
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {selectedDate.toLocaleDateString("vi-VN", { weekday: "long" })}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <h4 className="font-medium text-gray-900 mb-3">Danh sách sân</h4>
          <div className="space-y-2">
            <div
              className={`bg-white border border-gray-200 rounded-lg shadow-sm cursor-pointer transition-all hover:shadow-md ${
                selectedCourt === "all" ? "ring-2 ring-blue-500" : ""
              }`}
              onClick={() => setSelectedCourt("all")}
            >
              <div className="p-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-medium text-sm">📋 Tất cả sân</span>
                  <div className="w-2 h-2 rounded-full bg-blue-500" />
                </div>
                <div className="text-xs text-gray-600">
                  <div>Xem tổng quan tất cả sân</div>
                </div>
              </div>
            </div>

            {courts.map((court) => (
              <div
                key={court.id}
                className={`bg-white border border-gray-200 rounded-lg shadow-sm cursor-pointer transition-all hover:shadow-md ${
                  selectedCourt === court.id ? "ring-2 ring-blue-500" : ""
                } ${!court.available ? "opacity-50" : ""}`}
                onClick={() => {
                  if (court.available) {
                    setSelectedCourt(court.id)
                  }
                }}
              >
                <div className="p-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium text-sm">{court.name}</span>
                    <div className={`w-2 h-2 rounded-full ${court.available ? "bg-green-500" : "bg-red-500"}`} />
                  </div>
                  <div className="text-xs text-gray-600">
                    <div>{court.type}</div>
                    <div className="flex items-center justify-between mt-1">
                      <span>{formatPrice(court.pricePerHour)}/giờ</span>
                      <span className="flex items-center">
                        <Users className="h-3 w-3 mr-1" />
                        {court.capacity}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
          <div className="p-3 border-b border-gray-200">
            <h4 className="text-sm font-semibold">Thống kê hôm nay</h4>
          </div>
          <div className="p-3">
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Tổng đặt chỗ:</span>
                <span className="font-medium">{todayBookings.length}</span>
              </div>
              <div className="flex justify-between">
                <span>Đã xác nhận:</span>
                <span className="font-medium text-green-600">
                  {todayBookings.filter((b) => b.status === "confirmed").length}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Chờ xác nhận:</span>
                <span className="font-medium text-yellow-600">
                  {todayBookings.filter((b) => b.status === "pending").length}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-semibold text-gray-900">Lịch trình {formatDate(selectedDate)}</h3>
            <p className="text-sm text-gray-600 mt-1">Nhấp vào khung giờ để xem chi tiết hoặc đặt sân mới</p>
          </div>
          <button
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center space-x-2 transition-colors"
            onClick={() => setShowBookingDialog(true)}
          >
            <Plus className="h-4 w-4" />
            <span>Đặt sân mới</span>
          </button>
        </div>

        <div className="h-[calc(100vh-200px)] overflow-y-auto">
          {selectedCourt === "all" ? (
            <div className="space-y-4">
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg shadow-sm">
                <div className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold text-blue-900">Tổng quan tất cả sân</h4>
                      <p className="text-sm text-blue-700">
                        Xem lịch trình của {courts.length} sân • {formatDate(selectedDate)}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-blue-600">{todayBookings.length}</div>
                      <div className="text-xs text-blue-700">Đặt chỗ hôm nay</div>
                    </div>
                  </div>
                </div>
              </div>

              {courts.map((court) => (
                <div key={court.id} className="bg-white border border-gray-200 rounded-lg shadow-sm">
                  <div className="p-4 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-lg font-semibold">{court.name}</h4>
                        <p className="text-sm text-gray-600">
                          {court.type} • {formatPrice(court.pricePerHour)}/giờ
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs border border-gray-300 px-2 py-1 rounded-md flex items-center">
                          <Users className="h-3 w-3 mr-1" />
                          {court.capacity}
                        </span>
                        <div className={`w-3 h-3 rounded-full ${court.available ? "bg-green-500" : "bg-red-500"}`} />
                      </div>
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="grid grid-cols-8 gap-2">
                      {timeSlots.map((time) => {
                        const isBooked = isTimeSlotBooked(court.id, selectedDate.toISOString().split("T")[0], time)
                        const booking = bookings.find(
                          (b) =>
                            b.courtId === court.id &&
                            b.date === selectedDate.toISOString().split("T")[0] &&
                            time >= b.startTime &&
                            time < b.endTime,
                        )

                        return (
                          <div
                            key={time}
                            className={`p-2 text-xs text-center rounded border cursor-pointer transition-colors ${
                              isBooked
                                ? booking?.status === "confirmed"
                                  ? "bg-red-100 border-red-300 text-red-800"
                                  : "bg-yellow-100 border-yellow-300 text-yellow-800"
                                : "bg-green-100 border-green-300 text-green-800 hover:bg-green-200"
                            }`}
                            title={isBooked ? `${booking?.customerName} - ${booking?.customerPhone}` : "Trống"}
                            onClick={() => {
                              if (!isBooked) {
                                setNewBooking({
                                  ...newBooking,
                                  courtId: court.id,
                                  date: selectedDate.toISOString().split("T")[0],
                                  startTime: time,
                                  endTime: timeSlots[timeSlots.indexOf(time) + 1] || "23:00",
                                })
                                setShowBookingDialog(true)
                              }
                            }}
                          >
                            <div className="font-medium">{time}</div>
                            {isBooked && booking && <div className="text-xs mt-1 truncate">{booking.customerName}</div>}
                          </div>
                        )
                      })}
                    </div>

                    <div className="mt-3 pt-3 border-t flex items-center justify-between text-xs text-gray-600">
                      <span>Hôm nay: {todayBookings.filter((b) => b.courtId === court.id).length} đặt chỗ</span>
                      <span>
                        Doanh thu:{" "}
                        {formatPrice(
                          todayBookings
                            .filter((b) => b.courtId === court.id)
                            .reduce((sum, b) => sum + b.totalAmount, 0),
                        )}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : selectedCourt ? (
            <div className="space-y-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg shadow-sm">
                <div className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold text-blue-900">
                        {courts.find((c) => c.id === selectedCourt)?.name}
                      </h4>
                      <p className="text-sm text-blue-700">
                        {courts.find((c) => c.id === selectedCourt)?.type} •
                        {formatPrice(courts.find((c) => c.id === selectedCourt)?.pricePerHour || 0)}/giờ • Sức chứa:{" "}
                        {courts.find((c) => c.id === selectedCourt)?.capacity} người
                      </p>
                    </div>
                    <span className="text-xs border border-gray-300 px-2 py-1 rounded-md bg-white">
                      {courts.find((c) => c.id === selectedCourt)?.available ? "Hoạt động" : "Bảo trì"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
                <div className="p-4 border-b border-gray-200">
                  <h4 className="text-lg font-semibold">Lịch trình {formatDate(selectedDate)}</h4>
                </div>
                <div className="p-4">
                  <div className="grid grid-cols-4 gap-3">
                    {timeSlots.map((time) => {
                      const isBooked = isTimeSlotBooked(selectedCourt, selectedDate.toISOString().split("T")[0], time)
                      const booking = bookings.find(
                        (b) =>
                          b.courtId === selectedCourt &&
                          b.date === selectedDate.toISOString().split("T")[0] &&
                          time >= b.startTime &&
                          time < b.endTime,
                      )

                      return (
                        <div
                          key={time}
                          className={`bg-white border rounded-lg shadow-sm cursor-pointer transition-all hover:shadow-md ${
                            isBooked
                              ? booking?.status === "confirmed"
                                ? "bg-red-50 border-red-300"
                                : "bg-yellow-50 border-yellow-300"
                              : "bg-green-50 border-green-300 hover:bg-green-100"
                          }`}
                          onClick={() => {
                            if (!isBooked) {
                              setNewBooking({
                                ...newBooking,
                                courtId: selectedCourt,
                                date: selectedDate.toISOString().split("T")[0],
                                startTime: time,
                                endTime: timeSlots[timeSlots.indexOf(time) + 1] || "23:00",
                              })
                              setShowBookingDialog(true)
                            }
                          }}
                        >
                          <div className="p-3">
                            <div className="text-center">
                              <div className="font-semibold text-lg mb-1">{time}</div>
                              {isBooked && booking ? (
                                <div className="space-y-1">
                                  <span
                                    className={`text-xs px-2 py-1 rounded-full border ${getStatusColor(booking.status)}`}
                                  >
                                    {getStatusText(booking.status)}
                                  </span>
                                  <div className="text-xs font-medium">{booking.customerName}</div>
                                  <div className="text-xs text-gray-600">{booking.customerPhone}</div>
                                  <div className="text-xs text-gray-500">
                                    {booking.startTime} - {booking.endTime}
                                  </div>
                                </div>
                              ) : (
                                <div className="text-xs text-green-700 font-medium">Trống</div>
                              )}
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center text-gray-500 py-8">
              <Calendar className="h-12 w-12 mx-auto mb-2 text-gray-300" />
              <p>Chọn một sân để xem lịch trình</p>
            </div>
          )}
        </div>
      </div>

      <div className="w-96 bg-white border-l border-gray-200 p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-900">{selectedCourt === "all" ? "Tổng quan" : "Chi tiết sân"}</h3>
          <button
            className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-md text-sm flex items-center space-x-1 transition-colors"
            onClick={() => setShowBookingDialog(true)}
          >
            <Plus className="h-4 w-4" />
            <span>Đặt sân</span>
          </button>
        </div>

        <div className="h-[calc(100vh-140px)] overflow-y-auto">
          {selectedCourt === "all" ? (
            <div className="space-y-4">
ư              <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
                <div className="p-3 border-b border-gray-200">
                  <h4 className="text-lg font-semibold">Thống kê tổng quan</h4>
                </div>
                <div className="p-3 space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Tổng số sân:</span>
                    <span className="font-medium">{courts.length}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Sân hoạt động:</span>
                    <span className="font-medium text-green-600">{courts.filter((c) => c.available).length}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Đặt chỗ hôm nay:</span>
                    <span className="font-medium text-blue-600">{todayBookings.length}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Doanh thu hôm nay:</span>
                    <span className="font-medium text-green-600">
                      {formatPrice(todayBookings.reduce((sum, b) => sum + b.totalAmount, 0))}
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
                <div className="p-3 border-b border-gray-200">
                  <h4 className="text-lg font-semibold">Tình trạng sân</h4>
                </div>
                <div className="p-3">
                  <div className="space-y-2">
                    {courts.map((court) => {
                      const courtBookings = todayBookings.filter((b) => b.courtId === court.id)
                      const currentTime = new Date().getHours().toString().padStart(2, "0") + ":00"
                      const isCurrentlyBooked = courtBookings.some(
                        (b) => currentTime >= b.startTime && currentTime < b.endTime && b.status === "confirmed",
                      )

                      return (
                        <div key={court.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                          <div className="flex items-center space-x-2">
                            <div
                              className={`w-3 h-3 rounded-full ${
                                !court.available ? "bg-gray-500" : isCurrentlyBooked ? "bg-red-500" : "bg-green-500"
                              }`}
                            />
                            <span className="text-sm font-medium">{court.name}</span>
                          </div>
                          <div className="text-xs text-gray-600">
                            {!court.available ? "Bảo trì" : isCurrentlyBooked ? "Đang sử dụng" : "Trống"}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            selectedCourt && (
              <div className="space-y-4">
                <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
                  <div className="p-3 border-b border-gray-200">
                    <h4 className="text-lg font-semibold">{courts.find((c) => c.id === selectedCourt)?.name}</h4>
                  </div>
                  <div className="p-3 space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Loại sân:</span>
                      <span className="font-medium">{courts.find((c) => c.id === selectedCourt)?.type}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Giá thuê:</span>
                      <span className="font-medium text-blue-600">
                        {formatPrice(courts.find((c) => c.id === selectedCourt)?.pricePerHour || 0)}/giờ
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Sức chứa:</span>
                      <span className="font-medium">{courts.find((c) => c.id === selectedCourt)?.capacity} người</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Trạng thái:</span>
                      <span
                        className={`text-xs px-2 py-1 rounded-full ${
                          courts.find((c) => c.id === selectedCourt)?.available
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {courts.find((c) => c.id === selectedCourt)?.available ? "Hoạt động" : "Bảo trì"}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
                  <div className="p-3 border-b border-gray-200">
                    <h4 className="text-lg font-semibold">Lịch đặt hôm nay</h4>
                  </div>
                  <div className="p-3">
                    {todayBookings.filter((b) => b.courtId === selectedCourt).length === 0 ? (
                      <div className="text-center text-gray-500 py-4">
                        <Calendar className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                        <p className="text-sm">Chưa có đặt chỗ nào</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {todayBookings
                          .filter((b) => b.courtId === selectedCourt)
                          .sort((a, b) => a.startTime.localeCompare(b.startTime))
                          .map((booking) => (
                            <div
                              key={booking.id}
                              className="bg-white border-l-4 border-l-blue-500 border border-gray-200 rounded-lg shadow-sm"
                            >
                              <div className="p-3">
                                <div className="flex items-start justify-between mb-2">
                                  <div>
                                    <div className="font-medium text-sm">
                                      {booking.startTime} - {booking.endTime}
                                    </div>
                                    <div className="text-xs text-gray-600">
                                      {calculateDuration(booking.startTime, booking.endTime)} giờ
                                    </div>
                                  </div>
                                  <span
                                    className={`text-xs px-2 py-1 rounded-full border ${getStatusColor(booking.status)}`}
                                  >
                                    <div className="flex items-center space-x-1">
                                      {getStatusIcon(booking.status)}
                                      <span>{getStatusText(booking.status)}</span>
                                    </div>
                                  </span>
                                </div>

                                <div className="space-y-1 text-sm">
                                  <div className="flex items-center space-x-2">
                                    <Users className="h-3 w-3 text-gray-400" />
                                    <span>{booking.customerName}</span>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <Phone className="h-3 w-3 text-gray-400" />
                                    <span>{booking.customerPhone}</span>
                                  </div>
                                  <div className="flex items-center justify-between pt-2 border-t">
                                    <span className="text-gray-600">Số người:</span>
                                    <span className="font-medium">{booking.numberOfPlayers}</span>
                                  </div>
                                  <div className="flex items-center justify-between">
                                    <span className="text-gray-600">Tổng tiền:</span>
                                    <span className="font-semibold text-blue-600">
                                      {formatPrice(booking.totalAmount)}
                                    </span>
                                  </div>
                                </div>

                                {booking.notes && (
                                  <div className="mt-2 p-2 bg-gray-50 rounded text-xs">
                                    <span className="text-gray-600">Ghi chú: </span>
                                    <span>{booking.notes}</span>
                                  </div>
                                )}

                                <div className="flex items-center space-x-2 mt-3">
                                  <button className="flex-1 px-3 py-1 text-xs border border-gray-300 rounded-md hover:bg-gray-50 transition-colors flex items-center justify-center space-x-1">
                                    <Edit className="h-3 w-3" />
                                    <span>Sửa</span>
                                  </button>
                                  <button className="px-3 py-1 text-xs border border-gray-300 rounded-md hover:bg-gray-50 transition-colors text-red-600 hover:text-red-700">
                                    <Trash2 className="h-3 w-3" />
                                  </button>
                                </div>
                              </div>
                            </div>
                          ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )
          )}
        </div>
      </div>

      {showBookingDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-lg font-semibold">Đặt sân mới</h3>
              <button
                onClick={() => setShowBookingDialog(false)}
                className="p-1 hover:bg-gray-100 rounded-md transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-4 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Sân *</label>
                  <select
                    value={newBooking.courtId}
                    onChange={(e) => setNewBooking({ ...newBooking, courtId: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Chọn sân</option>
                    {courts
                      .filter((court) => court.available)
                      .map((court) => (
                        <option key={court.id} value={court.id}>
                          {court.name} - {formatPrice(court.pricePerHour)}/giờ
                        </option>
                      ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Ngày *</label>
                  <input
                    type="date"
                    value={newBooking.date}
                    onChange={(e) => setNewBooking({ ...newBooking, date: e.target.value })}
                    min={new Date().toISOString().split("T")[0]}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Giờ bắt đầu *</label>
                  <select
                    value={newBooking.startTime}
                    onChange={(e) => setNewBooking({ ...newBooking, startTime: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Chọn giờ</option>
                    {timeSlots.map((time) => (
                      <option key={time} value={time}>
                        {time}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Giờ kết thúc *</label>
                  <select
                    value={newBooking.endTime}
                    onChange={(e) => setNewBooking({ ...newBooking, endTime: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Chọn giờ</option>
                    {timeSlots.map((time) => (
                      <option key={time} value={time}>
                        {time}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tên khách hàng *</label>
                  <input
                    type="text"
                    placeholder="Nhập tên khách hàng"
                    value={newBooking.customerName}
                    onChange={(e) => setNewBooking({ ...newBooking, customerName: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Số điện thoại *</label>
                  <input
                    type="tel"
                    placeholder="Nhập số điện thoại"
                    value={newBooking.customerPhone}
                    onChange={(e) => setNewBooking({ ...newBooking, customerPhone: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    placeholder="Nhập email (tùy chọn)"
                    value={newBooking.customerEmail}
                    onChange={(e) => setNewBooking({ ...newBooking, customerEmail: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Số người chơi</label>
                  <input
                    type="number"
                    min="1"
                    value={newBooking.numberOfPlayers}
                    onChange={(e) =>
                      setNewBooking({ ...newBooking, numberOfPlayers: Number.parseInt(e.target.value) || 1 })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Ghi chú</label>
                <textarea
                  placeholder="Ghi chú thêm (tùy chọn)"
                  value={newBooking.notes}
                  onChange={(e) => setNewBooking({ ...newBooking, notes: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {newBooking.courtId && newBooking.startTime && newBooking.endTime && (
                <div className="bg-blue-50 p-3 rounded-lg">
                  <div className="text-sm text-blue-800">
                    <div className="font-medium">
                      Tổng tiền:{" "}
                      {formatPrice(calculateAmount(newBooking.courtId, newBooking.startTime, newBooking.endTime))}
                    </div>
                    <div>Thời gian: {calculateDuration(newBooking.startTime, newBooking.endTime)} giờ</div>
                  </div>
                </div>
              )}

              <button
                onClick={handleCreateBooking}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md transition-colors"
              >
                Xác nhận đặt sân
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
