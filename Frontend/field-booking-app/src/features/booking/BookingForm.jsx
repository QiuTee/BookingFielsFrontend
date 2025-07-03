import { useState } from "react"
import { MapPin, Calendar, ArrowLeft, Clock, Users, Trophy, CheckCircle, Copy } from "lucide-react"
import { useBooking } from "../../context/BookingContext"
import formatDate from "../../utils/FormatDate"
import { groupTimeRanges } from "../../utils/groupTimeRanges"
import { caculateTotalRevenue } from "../../utils/CaculateTotalRevenue"
import formatCurrency from "../../utils/FormatCurrency"
import { caculatePriceForEachSubfield } from "../../utils/CaculatePriceForEachSubfield"
import { createBooking } from "../../api/submission"
import { useNavigate } from "react-router-dom"
import { useNotification } from "../../context/NotificationContext"
import { generateBookingCode } from "../../utils/GenerateBookingCode"

const Button = ({
  children,
  variant = "default",
  size = "default",
  className = "",
  type = "button",
  onClick,
  disabled = false,
  ...props
}) => {
  const baseClasses =
    "inline-flex items-center justify-center rounded-md font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"

  const variantClasses = {
    default: "bg-blue-600 text-white hover:bg-blue-700 shadow-md hover:shadow-lg",
    ghost: "hover:bg-blue-50 text-blue-600 hover:text-blue-700",
    outline: "border border-blue-200 text-blue-600 hover:bg-blue-50",
  }

  const sizeClasses = {
    default: "h-10 py-2 px-4",
    sm: "h-8 py-1 px-3 text-sm",
    icon: "h-10 w-10",
  }

  return (
    <button
      type={type}
      disabled={disabled}
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${disabled ? "opacity-50 cursor-not-allowed" : ""} ${className}`}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  )
}

const Input = ({ className = "", type = "text", id, value, onChange, placeholder, required, ...props }) => {
  return (
    <input
      type={type}
      id={id}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required={required}
      className={`flex h-10 w-full rounded-md border border-blue-200 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-0 transition-colors ${className}`}
      {...props}
    />
  )
}

const Label = ({ children, htmlFor, className = "" }) => {
  return (
    <label htmlFor={htmlFor} className={`text-sm font-medium leading-none text-gray-700 ${className}`}>
      {children}
    </label>
  )
}

const Textarea = ({ className = "", id, value, onChange, placeholder, rows, ...props }) => {
  return (
    <textarea
      id={id}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      rows={rows}
      className={`flex min-h-[80px] w-full rounded-md border border-blue-200 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-0 transition-colors ${className}`}
      {...props}
    />
  )
}

const Card = ({ children, className = "" }) => {
  return <div className={`rounded-lg border border-blue-100 bg-white shadow-lg ${className}`}>{children}</div>
}

const CardContent = ({ children, className = "" }) => {
  return <div className={`p-6 ${className}`}>{children}</div>
}

const CardHeader = ({ children, className = "" }) => {
  return <div className={`flex flex-col space-y-1.5 p-6 pb-4 ${className}`}>{children}</div>
}

const CardTitle = ({ children, className = "" }) => {
  return <h3 className={`text-lg font-semibold leading-none tracking-tight ${className}`}>{children}</h3>
}

const Badge = ({ children, variant = "default", className = "" }) => {
  const variantClasses = {
    default: "bg-blue-100 text-blue-800 hover:bg-blue-200",
    outline: "border border-blue-200 text-blue-600 bg-white hover:bg-blue-50",
    success: "bg-green-100 text-green-800",
    warning: "bg-orange-100 text-orange-800",
  }

  return (
    <div
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors ${variantClasses[variant]} ${className}`}
    >
      {children}
    </div>
  )
}

const Separator = ({ className = "" }) => {
  return <div className={`h-px bg-blue-100 ${className}`} />
}

export default function BookingForm({ prevStep }) {
  const { bookingData } = useBooking()
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    notes: "",
  })
  const navigate = useNavigate()
  const { showNotification } = useNotification()

  const [bookingCode] = useState(generateBookingCode())
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [successBookingId, setSuccessBookingId] = useState("")

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const totalPrice = caculateTotalRevenue(bookingData.selectedCell.length, bookingData.price)
  const totalHours = (bookingData.selectedCell.length * 30) / 60
  const { fieldId, selectionField, selectDate, selectedCell} = bookingData
  const { name, phone: userPhone, notes } = formData

  const grouped = bookingData.selectedCell.reduce((acc, cell) => {
    if (!acc[cell.field]) acc[cell.field] = []
    acc[cell.field].push(cell.slot)
    return acc
  }, {})

  const payload = {
    FieldId: fieldId,
    FieldName: selectionField,
    BookingCode : bookingCode,
    Date: selectDate,
    Slots: selectedCell.map(({ field, slot }) => ({
      SubField: field,
      Time: slot,
    })),
    TotalPrice: totalPrice,
    UserName: name,
    Phone: userPhone,
    Notes: notes,
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await createBooking(payload)
      console.log("Response", response)

      const history = JSON.parse(localStorage.getItem("guestBookingHistory")) || []
      history.push(response.bookingId)
      localStorage.setItem("guestBookingHistory", JSON.stringify(history))

      setSuccessBookingId(response.bookingId)
      setIsSubmitting(false)
      setShowSuccess(true)

      showNotification({ type: "success", message: "Đặt sân thành công!" })

      setTimeout(() => {
        showNotification({
          type: "warning",
          message: "Vui lòng thanh toán trong vòng 30 phút để tránh bị huỷ đơn!",
        })
        navigate(`/san/${bookingData.slug}/payment/${response.bookingId}`)
      }, 2000)

      console.log("Booking created successfully:", response)
    } catch (error) {
      console.error("Error creating booking:", error)
      setIsSubmitting(false)
      showNotification({ type: "error", message: "Có lỗi xảy ra khi đặt sân!" })
    }
  }
  if (showSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md mx-auto border-0 shadow-2xl">
          <CardContent className="p-8 text-center">
            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-blue-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Đặt sân thành công!</h2>
            <p className="text-gray-600 mb-8">Cảm ơn bạn đã tin tưởng dịch vụ của chúng tôi</p>

            <div className="bg-blue-50 rounded-xl p-6 mb-8 border-2 border-dashed border-blue-300">
              <Label className="text-sm font-medium text-blue-700 block mb-3">Mã đặt sân của bạn</Label>
              <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-blue-200 shadow-sm">
                <span className="font-mono text-xl font-bold text-blue-600">{bookingCode}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigator.clipboard.writeText(bookingCode)}
                  className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                >
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
              <p className="text-xs text-blue-600 mt-3 font-medium">Vui lòng lưu mã này để tra cứu đơn hàng</p>
            </div>

            <Button
              className="w-full h-12 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-xl shadow-lg"
              onClick={() => navigate(`/san/${bookingData.slug}/payment/${successBookingId}`)}
            >
              Tiến hành thanh toán
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-blue-100">
        <div className="flex items-center justify-between p-4 max-w-4xl mx-auto">
          <Button
            variant="ghost"
            size="icon"
            onClick={prevStep}
            className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="text-center">
            <h1 className="text-xl font-bold text-gray-900">Xác nhận đặt sân</h1>
            <p className="text-sm text-blue-600">Hoàn tất thông tin để đặt sân</p>
          </div>
          <div className="w-10" />
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-4 space-y-6">
        {/* Booking Code Display */}
        <Card className="border-2 border-dashed border-blue-300 bg-gradient-to-r from-blue-50 to-blue-100">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-sm font-medium text-blue-700 block mb-2">Mã đặt sân tạm thời</Label>
                <p className="font-mono text-2xl font-bold text-blue-900">{bookingCode}</p>
              </div>
              <div className="w-12 h-12 bg-blue-200 rounded-full flex items-center justify-center">
                <Trophy className="w-6 h-6 text-blue-700" />
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Field Information */}
          <Card className="border-blue-200">
            <CardHeader className="pb-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-t-lg">
              <CardTitle className="flex items-center gap-3 text-blue-900">
                <div className="w-10 h-10 bg-blue-200 rounded-full flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-blue-700" />
                </div>
                Thông tin sân
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <span className="text-sm text-gray-600 font-medium">Tên sân:</span>
                  <span className="font-semibold text-blue-900 text-right">{bookingData?.selectionField}</span>
                </div>
                <Separator />
                <div className="flex justify-between items-start">
                  <span className="text-sm text-gray-600 font-medium">Địa chỉ:</span>
                  <span className="font-medium text-gray-900 text-right max-w-xs">{bookingData?.location}</span>
                </div>
                <Separator />
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 font-medium">Hotline:</span>
                  <Badge variant="outline" className="font-mono font-bold">
                    {bookingData?.phone}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Booking Details */}
          <Card className="border-blue-200">
            <CardHeader className="pb-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-t-lg">
              <CardTitle className="flex items-center gap-3 text-blue-900">
                <div className="w-10 h-10 bg-blue-200 rounded-full flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-blue-700" />
                </div>
                Chi tiết đặt sân
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 font-medium">Ngày đặt:</span>
                  <span className="font-semibold text-blue-900">{formatDate(bookingData?.selectDate)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 font-medium">Giá 30 phút:</span>
                  <Badge variant="warning" className="font-bold">
                    {formatCurrency(bookingData?.price)}
                  </Badge>
                </div>

                <Separator />

                {Object.entries(grouped).map(([subfield, times]) => (
                  <div key={subfield} className="space-y-3 p-3 bg-blue-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-blue-600" />
                      <span className="font-semibold text-blue-900">{subfield}</span>
                    </div>
                    <div className="flex justify-between items-center pl-6">
                      <div className="flex items-center gap-2">
                        <Clock className="w-3 h-3 text-blue-500" />
                        <span className="text-sm text-blue-700 font-medium">{groupTimeRanges(times).join(", ")}</span>
                      </div>
                      <Badge variant="success" className="font-bold">
                        {formatCurrency(caculatePriceForEachSubfield(times.length, bookingData.price))}
                      </Badge>
                    </div>
                  </div>
                ))}

                <Separator />

                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 font-medium">Tổng thời gian:</span>
                  <span className="font-semibold text-blue-900">{totalHours} giờ</span>
                </div>
                <div className="flex justify-between items-center p-4 bg-gradient-to-r from-blue-100 to-blue-200 rounded-xl border border-blue-300">
                  <span className="font-bold text-blue-900">Tổng thanh toán:</span>
                  <span className="text-2xl font-bold text-blue-700">{formatCurrency(totalPrice)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Booking Form */}
        <Card className="border-blue-200">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-t-lg">
            <CardTitle className="text-blue-900">Thông tin người đặt</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-blue-700 font-semibold">
                    Họ và tên *
                  </Label>
                  <Input
                    id="name"
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    placeholder="Nhập họ và tên của bạn"
                    className="h-12 border-blue-200 focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-blue-700 font-semibold">
                    Số điện thoại *
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    placeholder="Nhập số điện thoại"
                    className="h-12 border-blue-200 focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes" className="text-blue-700 font-semibold">
                  Ghi chú thêm
                </Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => handleInputChange("notes", e.target.value)}
                  placeholder="Nhập ghi chú nếu có (tùy chọn)"
                  className="min-h-[100px] border-blue-200 focus:border-blue-500 focus:ring-blue-500 resize-none"
                  rows={4}
                />
              </div>

              <div className="pt-4">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full h-16 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold text-lg rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300"
                >
                  {isSubmitting ? (
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin" />
                      Đang xử lý...
                    </div>
                  ) : (
                    <>
                      <CheckCircle className="w-6 h-6 mr-3" />
                      Xác nhận đặt sân & Thanh toán
                    </>
                  )}
                </Button>
                <p className="text-xs text-blue-600 text-center mt-4 font-medium">
                  Bằng cách nhấn "Xác nhận", bạn đồng ý với điều khoản sử dụng của chúng tôi
                </p>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
