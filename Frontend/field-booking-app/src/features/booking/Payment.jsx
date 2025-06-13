import { useState, useEffect, useContext } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { ArrowLeft, CreditCard, Building2, Wallet, Ticket, Upload, Info, Calendar } from "lucide-react"
import { getBookingById, confirmedPayment, applyVoucher } from "../../api/submission"
import { NotificationContext } from "../../context/NotificationContext"
import SelectedSlotsSummary from "../../components/SelectedSlotsSummary"
import { uploadImageToSupabase } from "../../utils/upload"
import formatCurrency from "../../utils/FormatCurrency"
export default function Payment() {
  const { bookingId } = useParams()
  const navigate = useNavigate()
  const { showNotification } = useContext(NotificationContext)
  const [bookingInfo, setBookingInfo] = useState(null)
  const [processing, setProcessing] = useState(false)
  const [method, setMethod] = useState("card")
  const [paymentImage, setPaymentImage] = useState(null)
  const [studentCardImage, setStudentCardImage] = useState(null)
  const [voucherCode, setVoucherCode] = useState("")
  const [appliedVoucher, setAppliedVoucher] = useState(null)
  const [voucherError, setVoucherError] = useState("")
  const [checkingVoucher, setCheckingVoucher] = useState(false)
  const [discountAmount, setDiscountAmount] = useState(0)

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const data = await getBookingById(bookingId)
        // console.log("Booking data:", data)
        setBookingInfo(data)
      } catch (error) {
        console.error("Lỗi khi lấy booking:", error)
        showNotification({ type: "error", message: "Không lấy được đơn hàng" })
        navigate("/")
      }
    }
    if (bookingId) fetchBooking()
  }, [bookingId, navigate, showNotification])

  const handleApplyVoucher = async () => {
    if (!voucherCode.trim()) {
      setVoucherError("Vui lòng nhập mã voucher")
      return
    }

    setCheckingVoucher(true)
    setVoucherError("")

    const response = await applyVoucher(voucherCode.toUpperCase(), bookingInfo.totalPrice)
    console.log(response)
    setDiscountAmount(response.discountAmount)
    if (response.status === "success") {
      setAppliedVoucher({
        code: voucherCode.toUpperCase(),
        voucherId: response.voucherId,
        discountAmount: response.discountAmount,
      })
      showNotification({
        type: "success",
        message: `Áp dụng voucher thành công!`,
      })
    } else if (response.status === "not_found") {
      setVoucherError("Mã voucher không hợp lệ hoặc đã hết hạn")
    } else {
      setVoucherError("Bạn chưa đủ điều kiện để sử dụng voucher này")
    }

    setCheckingVoucher(false)
  }

  const handleRemoveVoucher = () => {
    setAppliedVoucher(null)
    setVoucherCode("")
    setVoucherError("")
    showNotification({ type: "info", message: "Đã hủy áp dụng voucher" })
  }

  const handlePayment = async () => {
    if (!paymentImage) {
      showNotification({ type: "error", message: "Vui lòng tải lên ảnh chuyển khoản để xác nhận!" })
      return
    }

    setProcessing(true)

    try {
      const paymentUrl = await uploadImageToSupabase(paymentImage, `booking_${bookingId}_payment`)
      let studentUrl = null
      if (studentCardImage) {
        studentUrl = await uploadImageToSupabase(studentCardImage, `booking_${bookingId}_student`)
      }
      const payload = {
        bookingId,
        paymentImageUrl: paymentUrl,
        studentCardImageUrl: studentUrl,
        voucherCode: appliedVoucher?.code || "",
        discountAmount: appliedVoucher?.discountAmount || 0,
        voucherId: appliedVoucher?.voucherId || null,
      }
      console.log("Payload", payload)
      await confirmedPayment(payload)

      showNotification({ type: "success", message: "Thanh toán thành công!" })
      navigate("/booking-history")
    } catch (error) {
      console.error("Xác nhận thanh toán thất bại:", error)
      showNotification({ type: "error", message: "Xác nhận thanh toán thất bại!" })
    } finally {
      setProcessing(false)
    }
  }

  if (!bookingInfo) {
    return (
      <div className="min-h-screen bg-blue-50 flex items-center justify-center">
        <div className="animate-pulse text-blue-600 font-semibold text-lg">Đang tải thông tin đơn hàng...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-blue-50">
      {/* Header */}
      <div className="bg-blue-600 text-white p-4 shadow-md">
        <div className="container mx-auto flex items-center">
          <button onClick={() => navigate(-1)} className="mr-4 hover:bg-blue-700 p-2 rounded-full transition-colors">
            <ArrowLeft className="h-6 w-6" />
          </button>
          <h1 className="text-xl font-bold">Thanh toán đơn hàng</h1>
        </div>
      </div>

      <div className="container mx-auto p-4 md:p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Payment Methods */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-blue-100">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-blue-100 p-2 rounded-full">
                  <CreditCard className="h-5 w-5 text-blue-600" />
                </div>
                <h2 className="text-xl font-bold text-blue-800">1. Chọn phương thức thanh toán</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { id: "card", icon: <CreditCard className="h-5 w-5" />, label: "Thẻ tín dụng / ghi nợ" },
                  { id: "bank", icon: <Building2 className="h-5 w-5" />, label: "Internet Banking" },
                  { id: "wallet", icon: <Wallet className="h-5 w-5" />, label: "Ví điện tử" },
                ].map((option) => (
                  <button
                    key={option.id}
                    className={`border rounded-lg p-4 flex flex-col items-center justify-center gap-2 transition-all ${
                      method === option.id
                        ? "border-blue-600 bg-blue-50 text-blue-700 shadow-sm"
                        : "border-gray-200 hover:border-blue-300 text-gray-700"
                    }`}
                    onClick={() => setMethod(option.id)}
                  >
                    <div className={`p-2 rounded-full ${method === option.id ? "bg-blue-100" : "bg-gray-100"}`}>
                      {option.icon}
                    </div>
                    <span className="text-sm font-medium">{option.label}</span>
                  </button>
                ))}
              </div>

              <div className="mt-6">
                {method === "card" && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                      className="border rounded-lg p-3 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      placeholder="Số thẻ"
                    />
                    <input
                      className="border rounded-lg p-3 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      placeholder="Họ tên trên thẻ"
                    />
                    <input
                      className="border rounded-lg p-3 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      placeholder="Ngày hết hạn (MM/YY)"
                    />
                    <input
                      className="border rounded-lg p-3 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      placeholder="CVV"
                    />
                  </div>
                )}

                {method === "bank" && (
                  <select className="w-full border rounded-lg p-3 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500">
                    <option>Chọn ngân hàng</option>
                    <option>Vietcombank</option>
                    <option>Techcombank</option>
                    <option>ACB</option>
                  </select>
                )}

                {method === "wallet" && (
                  <div className="text-center mt-4">
                    <div className="bg-gray-100 p-6 rounded-lg inline-block">
                      <img src="/images/payment/momo.jpg" alt="QR Code" className="mx-auto w-40" />
                    </div>
                    <p className="mt-2 text-sm text-gray-500">Quét mã bằng Momo/ZaloPay để thanh toán</p>
                  </div>
                )}
              </div>
            </div>

            {/* Voucher */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-blue-100">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-blue-100 p-2 rounded-full">
                  <Ticket className="h-5 w-5 text-blue-600" />
                </div>
                <h2 className="text-xl font-bold text-blue-800">2. Mã giảm giá</h2>
              </div>

              {!appliedVoucher ? (
                <div className="space-y-4">
                  <div className="flex gap-3">
                    <input
                      type="text"
                      value={voucherCode}
                      onChange={(e) => {
                        setVoucherCode(e.target.value)
                        setVoucherError("")
                      }}
                      placeholder="Nhập mã voucher"
                      className="flex-1 border rounded-lg p-3 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                    <button
                      onClick={handleApplyVoucher}
                      disabled={checkingVoucher}
                      className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {checkingVoucher ? "Đang kiểm tra..." : "Áp dụng"}
                    </button>
                  </div>

                  {voucherError && (
                    <p className="text-red-500 text-sm flex items-center gap-1">
                      <span className="inline-block w-4 h-4 rounded-full bg-red-500 text-white flex items-center justify-center text-xs">
                        !
                      </span>
                      {voucherError}
                    </p>
                  )}

                  <div className="bg-blue-50 rounded-lg p-4">
                    <p className="text-sm text-blue-700 mb-2 font-medium">Mã voucher có sẵn:</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                      <div className="bg-white p-2 rounded-lg border border-blue-100 hover:border-blue-300 transition-colors">
                        <span className="font-semibold text-blue-600">STUDENT10</span> - Giảm 10% cho sinh viên
                      </div>
                      <div className="bg-white p-2 rounded-lg border border-blue-100 hover:border-blue-300 transition-colors">
                        <span className="font-semibold text-blue-600">NEWUSER20</span> - Giảm 20% khách mới
                      </div>
                      <div className="bg-white p-2 rounded-lg border border-blue-100 hover:border-blue-300 transition-colors">
                        <span className="font-semibold text-blue-600">SAVE50K</span> - Giảm 50,000đ
                      </div>
                      <div className="bg-white p-2 rounded-lg border border-blue-100 hover:border-blue-300 transition-colors">
                        <span className="font-semibold text-blue-600">WEEKEND15</span> - Giảm 15% cuối tuần
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-green-700">Mã voucher: {appliedVoucher.code}</p>
                      <p className="text-sm text-green-600">Giảm: {formatCurrency(discountAmount)}đ</p>
                    </div>
                    <button onClick={handleRemoveVoucher} className="text-red-500 hover:text-red-700 text-sm underline">
                      Hủy voucher
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Upload Images */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-blue-100">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-blue-100 p-2 rounded-full">
                  <Upload className="h-5 w-5 text-blue-600" />
                </div>
                <h2 className="text-xl font-bold text-blue-800">3. Tải hình ảnh xác nhận thanh toán</h2>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block font-medium text-gray-700 mb-2">
                    Ảnh chuyển khoản <span className="text-red-500">*</span>
                  </label>
                  <div className="border-2 border-dashed border-blue-300 rounded-lg p-4 text-center hover:bg-blue-50 transition-colors">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setPaymentImage(e.target.files[0])}
                      className="hidden"
                      id="payment-image"
                    />
                    <label htmlFor="payment-image" className="cursor-pointer">
                      {paymentImage ? (
                        <div className="text-blue-600">
                          <p className="font-medium">Đã chọn: {paymentImage.name}</p>
                          <p className="text-xs text-blue-500 mt-1">Nhấn để thay đổi</p>
                        </div>
                      ) : (
                        <div className="text-blue-600">
                          <Upload className="h-8 w-8 mx-auto mb-2 text-blue-500" />
                          <p className="font-medium">Nhấn để chọn ảnh</p>
                          <p className="text-xs text-blue-500 mt-1">hoặc kéo thả file vào đây</p>
                        </div>
                      )}
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block font-medium text-gray-700 mb-2">Ảnh thẻ sinh viên (không bắt buộc)</label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:bg-gray-50 transition-colors">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setStudentCardImage(e.target.files[0])}
                      className="hidden"
                      id="student-card-image"
                    />
                    <label htmlFor="student-card-image" className="cursor-pointer">
                      {studentCardImage ? (
                        <div className="text-gray-600">
                          <p className="font-medium">Đã chọn: {studentCardImage.name}</p>
                          <p className="text-xs text-gray-500 mt-1">Nhấn để thay đổi</p>
                        </div>
                      ) : (
                        <div className="text-gray-600">
                          <Upload className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                          <p className="font-medium">Nhấn để chọn ảnh</p>
                          <p className="text-xs text-gray-500 mt-1">hoặc kéo thả file vào đây</p>
                        </div>
                      )}
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Booking Info */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-blue-100">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-blue-100 p-2 rounded-full">
                  <Info className="h-5 w-5 text-blue-600" />
                </div>
                <h2 className="text-xl font-bold text-blue-800">4. Thông tin đặt sân</h2>
              </div>

              <div className="text-gray-700 space-y-3">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-blue-500" />
                  <p>
                    <span className="font-medium">Ngày: </span>
                    <span>{new Date(bookingInfo.date).toLocaleDateString("vi-VN")}</span>
                  </p>
                </div>
                <p>
                  <span className="font-medium">Sân: </span>
                  <span>{bookingInfo.fieldName}</span>
                </p>
                <p className="font-medium text-blue-600 mt-2">Khung giờ đã đặt:</p>
                <SelectedSlotsSummary
                  selectedCell={bookingInfo.slots.map((s) => ({ field: s.subField, slot: s.time }))}
                />
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm p-6 border border-blue-100 sticky top-6">
              <h2 className="text-xl font-bold text-blue-800 mb-4">Tóm tắt đơn hàng</h2>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                  <span className="text-gray-600">Người đặt:</span>
                  <span className="font-medium">{bookingInfo.userName}</span>
                </div>

                <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                  <span className="text-gray-600">Số điện thoại:</span>
                  <span className="font-medium">{bookingInfo.phone}</span>
                </div>

                <div className="pt-2">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Tạm tính:</span>
                    <span className="font-medium">{formatCurrency(bookingInfo.totalPrice)}</span>
                  </div>

                  <div className="flex justify-between items-center mt-1">
                    <span className="text-gray-600">Giảm giá:</span>
                    <span className={`font-medium ${discountAmount > 0 ? "text-green-600" : ""}`}>
                      -{formatCurrency(discountAmount)}
                    </span>
                  </div>

                  {appliedVoucher && (
                    <div className="text-xs text-green-600 mt-1 text-right">Voucher: {appliedVoucher.code}</div>
                  )}
                </div>

                <div className="pt-3 mt-2 border-t border-gray-200">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-blue-800">Tổng cộng:</span>
                    <span className="text-lg font-bold text-blue-800">
                      {formatCurrency(bookingInfo.totalPrice - discountAmount)}
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={handlePayment}
                disabled={processing}
                className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {processing ? (
                  <>
                    <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Đang xử lý...</span>
                  </>
                ) : (
                  <>Thanh toán {formatCurrency(bookingInfo.totalPrice - discountAmount)}</>
                )}
              </button>

              <p className="text-xs text-gray-500 text-center mt-3">
                Bằng cách nhấn nút thanh toán, bạn đồng ý với các điều khoản và điều kiện của chúng tôi
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
