import { useState } from "react"
import { MapPin, Calendar , ArrowLeft } from "lucide-react"
import { useBooking } from "../../context/BookingContext"
import formatDate from "../../utils/FormatDate"
import { groupTimeRanges } from "../../utils/groupTimeRanges"
import { caculateTotalRevenue } from "../../utils/CaculateTotalRevenue"
import formatCurrency from "../../utils/FormatCurrency"
import { caculatePriceForEachSubfield } from "../../utils/CaculatePriceForEachSubfield"
import { createBooking } from "../../api/submission"
import { useNavigate } from "react-router-dom"
import { useNotification } from "../../context/NotificationContext"
const Button = ({
  children,
  variant = "default",
  size = "default",
  className = "",
  type = "button",
  onClick,
  ...props
}) => {
  const baseClasses = "inline-flex items-center justify-center rounded-md font-medium transition-colors"

  const variantClasses = {
    default: "bg-primary text-primary-foreground hover:bg-primary/90",
    ghost: "hover:bg-accent hover:text-accent-foreground",
  }

  const sizeClasses = {
    default: "h-10 py-2 px-4",
    icon: "h-10 w-10",
  }

  return (
    <button
      type={type}
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
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
      className={`flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 ${className}`}
      {...props}
    />
  )
}

const Label = ({ children, htmlFor, className = "" }) => {
  return (
    <label htmlFor={htmlFor} className={`text-sm font-medium leading-none ${className}`}>
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
      className={`flex min-h-[80px] w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 ${className}`}
      {...props}
    />
  )
}

const Card = ({ children, className = "" }) => {
  return <div className={`rounded-lg border shadow-sm ${className}`}>{children}</div>
}

const CardContent = ({ children, className = "" }) => {
  return <div className={`p-6 ${className}`}>{children}</div>
}

export default function BookingForm({prevStep}) {
  const { bookingData } = useBooking()
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    notes: "",
  })
  const navigate = useNavigate()
  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }
  const { showNotification } = useNotification()
  const totalPrice = caculateTotalRevenue(bookingData.selectedCell.length, bookingData.price)
  const { fieldId, selectionField, selectDate, selectedCell } = bookingData
  const { name, phone, notes } = formData
  const payload = {
    FieldId: fieldId,
    FieldName: selectionField,
    Date: selectDate,
    Slots: selectedCell.map(({ field, slot }) => ({
      SubField: field,
      Time: slot,
    })),
    TotalPrice: totalPrice,
    UserName: name,
    Phone: phone,
    Notes: notes,
  }
  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const response = await createBooking(payload)
      console.log("Response", response)
      const history = JSON.parse(localStorage.getItem("guestBookingHistory")) || []
      history.push(response.bookingId)
      localStorage.setItem("guestBookingHistory", JSON.stringify(history))
      showNotification({ type: "success", message: "Đặt sân thành công!" })
      setTimeout(() => {
        showNotification({
          type: "warning",
          message: "Vui lòng thanh toán trong vòng 30 phút để tránh bị huỷ đơn!",
        })
        navigate(`/san/${bookingData.slug}/payment/${response.bookingId}`)
      }, 500)
      console.log("Booking created successfully:", response)
    } catch (error) {
      console.error("Error creating booking:", error)
    }
  }

  const grouped = bookingData.selectedCell.reduce((acc, cell) => {
    if (!acc[cell.field]) acc[cell.field] = []
    acc[cell.field].push(cell.slot)
    return acc
  }, {})

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-500 to-blue-600 w-full fixed inset-0 overflow-y-auto">
      <div className="flex items-center justify-between p-4 text-white">
        <Button variant="ghost" size="icon" className="text-white hover:bg-white/10" onClick={prevStep}>
          <ArrowLeft className="h-6 w-6" />
        </Button>
        <h1 className="text-lg font-semibold">Đặt lịch ngay trực quan</h1>
        <div className="w-10" />
      </div>

      <div className="px-4 pb-20 space-y-6">
        <Card className="bg-blue-500 border-none text-white">
          <CardContent className="p-4 space-y-3">
            <div className="flex items-center gap-2 text-yellow-300">
              <MapPin className="h-4 w-4" />
              <span className="font-semibold">Thông tin sân</span>
            </div>
            <div className="space-y-2 text-sm">
              <div>
                <span className="font-medium">Tên Sân: </span>
                <span>{bookingData?.selectionField}</span>
              </div>
              <div>
                <span className="font-medium">Địa chỉ: </span>
                <span>{bookingData?.location}</span>
              </div>
              <div>
                <span className="font-medium">SĐT: </span>
                <span>{bookingData?.phone}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-blue-500 border-none text-white">
          <CardContent className="p-4 space-y-3">
            <div className="flex items-center gap-2 text-yellow-300">
              <Calendar className="h-4 w-4" />
              <span className="font-semibold">Thông tin lịch đặt</span>
            </div>
            <div className="space-y-2 text-sm">
              <div>
                <span className="font-medium">Ngày: </span>
                <span>{formatDate(bookingData?.selectDate)}</span>
              </div>
              <div>
                <span className="font-medium">Giá 30 phút: </span>
                <span>{formatCurrency(bookingData?.price)}</span>
              </div>
              {Object.entries(grouped).map(([subfield, times]) => (
                <div key={subfield} className="flex items-center justify-between">
                  <div>
                    <span className="font-medium">- {subfield} </span>
                    <span>{groupTimeRanges(times).join(", ")}</span>
                  </div>
                  <span className="text-yellow-300 font-semibold">
                    {formatCurrency(caculatePriceForEachSubfield(times.length, bookingData.price))}
                  </span>
                </div>
              ))}
              <div>
                <span className="font-medium">Tổng giờ: </span>
                <span>{(bookingData.selectedCell.length * 30) / 60} giờ</span>
              </div>
              <div className="pt-2 border-t border-white/20">
                <span className="font-medium">Tổng tiền: </span>
                <span className="text-yellow-300 font-bold text-lg">{formatCurrency(totalPrice)}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-white font-semibold text-sm">
              TÊN CỦA BẠN
            </Label>
            <Input
              id="name"
              type="text"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              placeholder="Nhập tên của bạn"
              className="bg-white border-none h-12 text-gray-900 placeholder:text-gray-500"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone" className="text-white font-semibold text-sm">
              SỐ ĐIỆN THOẠI
            </Label>
            <Input
              id="phone"
              type="tel"
              value={formData.phone}
              onChange={(e) => handleInputChange("phone", e.target.value)}
              placeholder="Nhập số điện thoại"
              className="bg-white border-none h-12 text-gray-900 placeholder:text-gray-500"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes" className="text-white font-semibold text-sm">
              GHI CHÚ
            </Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => handleInputChange("notes", e.target.value)}
              placeholder="Nhập ghi chú (tùy chọn)"
              className="bg-white border-none min-h-[80px] text-gray-900 placeholder:text-gray-500 resize-none"
              rows={3}
            />
          </div>
          <Button
            type="submit"
            className="w-full h-12 bg-yellow-500 hover:bg-yellow-600 text-black font-semibold text-sm rounded-lg mt-6"
          >
            XÁC NHẬN & THANH TOÁN
          </Button>
        </form>
      </div>
    </div>
  )
}
