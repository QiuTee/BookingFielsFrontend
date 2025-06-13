"use client"

import { useState, useEffect, useContext } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { getBookingById, confirmedPayment , applyVoucher } from "../../api/submission"
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
  const [discountAmount , setDiscountAmount] = useState(0)
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

  if (!bookingInfo) {
    return <div className="p-8 text-center text-blue-600 font-semibold">Đang tải đơn hàng...</div>
  }

  const handleApplyVoucher = async () => {
    if (!voucherCode.trim()) {
      setVoucherError("Vui lòng nhập mã voucher")
      return
    }

    setCheckingVoucher(true)
    setVoucherError("")

    const response = await applyVoucher(voucherCode.toUpperCase() , bookingInfo.totalPrice  )
    console.log(response)
    setDiscountAmount(response.discountAmount)
    if (response.status === "success") {
      setAppliedVoucher({ code: voucherCode.toUpperCase(), voucherId:response.voucherId ,discountAmount: response.discountAmount })
      showNotification({
        type: "success",
        message: `Áp dụng voucher thành công!`,
      })
    } else if (response.status === "not_found")  {
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
        voucherId: appliedVoucher?.voucherId || null
      }
      console.log("Payload" , payload)
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

  return (
    <div className="min-h-screen bg-gray-50 p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-6">
        <div className="bg-white rounded-2xl shadow p-6">
          <h2 className="text-xl font-bold text-blue-700 mb-4">1. Chọn phương thức thanh toán</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {["card", "bank", "wallet"].map((type) => (
              <button
                key={type}
                className={`border rounded-lg p-4 text-center transition-colors ${
                  method === type ? "border-blue-600 bg-blue-50 text-blue-700" : "border-gray-200 hover:border-blue-300"
                }`}
                onClick={() => setMethod(type)}
              >
                {
                  {
                    card: "Thẻ tín dụng / ghi nợ",
                    bank: "Internet Banking",
                    wallet: "Ví điện tử",
                  }[type]
                }
              </button>
            ))}
          </div>

          <div className="mt-6">
            {method === "card" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input className="border rounded p-3 focus:border-blue-500 focus:outline-none" placeholder="Số thẻ" />
                <input
                  className="border rounded p-3 focus:border-blue-500 focus:outline-none"
                  placeholder="Họ tên trên thẻ"
                />
                <input
                  className="border rounded p-3 focus:border-blue-500 focus:outline-none"
                  placeholder="Ngày hết hạn (MM/YY)"
                />
                <input className="border rounded p-3 focus:border-blue-500 focus:outline-none" placeholder="CVV" />
              </div>
            )}
            {method === "bank" && (
              <select className="w-full border rounded p-3 focus:border-blue-500 focus:outline-none">
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
          <h2 className="text-xl font-bold text-blue-700 mb-4">2. Mã giảm giá</h2>

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
                  className="flex-1 border rounded-lg p-3 focus:border-blue-500 focus:outline-none"
                />
                <button
                  onClick={handleApplyVoucher}
                  disabled={checkingVoucher}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {checkingVoucher ? "Đang kiểm tra..." : "Áp dụng"}
                </button>
              </div>

              {voucherError && <p className="text-red-500 text-sm">{voucherError}</p>}

              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-600 mb-2">Mã voucher có sẵn:</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                  <div className="bg-white p-2 rounded border">
                    <span className="font-semibold text-blue-600">STUDENT10</span> - Giảm 10% cho sinh viên
                  </div>
                  <div className="bg-white p-2 rounded border">
                    <span className="font-semibold text-blue-600">NEWUSER20</span> - Giảm 20% khách mới
                  </div>
                  <div className="bg-white p-2 rounded border">
                    <span className="font-semibold text-blue-600">SAVE50K</span> - Giảm 50,000đ
                  </div>
                  <div className="bg-white p-2 rounded border">
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
                  <p className="text-sm text-green-600">{appliedVoucher.description}</p>
                  <p className="text-sm text-green-600">Giảm: {formatCurrency(discountAmount)}đ</p>
                </div>
                <button onClick={handleRemoveVoucher} className="text-red-500 hover:text-red-700 text-sm underline">
                  Hủy voucher
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="bg-white rounded-2xl shadow p-6">
          <h2 className="text-xl font-bold text-blue-700 mb-4">3. Tải hình ảnh xác nhận thanh toán</h2>
          <div className="space-y-4">
            <div>
              <label className="block font-semibold text-gray-700 mb-2">
                Ảnh chuyển khoản <span className="text-red-500">*</span>
              </label>
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
          <h2 className="text-xl font-bold text-blue-700 mb-4">4. Thông tin đặt sân</h2>
          <div className="text-gray-700 space-y-1">
            <p>
              <strong>Sân:</strong> {bookingInfo.fieldName}
            </p>
            <p>
              <strong>Ngày:</strong> {new Date(bookingInfo.date).toLocaleDateString("vi-VN")}
            </p>
            <p className="mt-2 font-semibold text-blue-600">Khung giờ đã đặt:</p>
            <SelectedSlotsSummary selectedCell={bookingInfo.slots.map((s) => ({ field: s.subField, slot: s.time }))} />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow p-6 h-fit">
        <h2 className="text-xl font-bold text-blue-700 mb-4">Tóm tắt đơn hàng</h2>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-700">Người đặt:</span>
            <span className="font-semibold">{bookingInfo.userName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-700">Số điện thoại:</span>
            <span className="font-semibold">{bookingInfo.phone}</span>
          </div>
          <div className="border-t pt-2 mt-4">
            <div className="flex justify-between">
              <span className="text-gray-700">Tạm tính:</span>
              <span className="font-semibold">{formatCurrency(bookingInfo.totalPrice)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-700">Giảm giá:</span>
              <span className={`font-semibold ${discountAmount > 0 ? "text-green-600" : ""}`}>
                -{formatCurrency(discountAmount)}
              </span>
            </div>
            {appliedVoucher && <div className="text-xs text-green-600 mt-1">Voucher: {appliedVoucher.code}</div>}
          </div>
          <div className="border-t pt-2 mt-2">
            <div className="flex justify-between text-lg font-bold text-green-700">
              <span>Tổng cộng:</span>
              <span>{formatCurrency(bookingInfo.totalPrice - discountAmount)}</span>
            </div>
          </div>
        </div>

        <button
          onClick={handlePayment}
          disabled={processing}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed mt-6"
        >
          {processing ? "Đang xử lý..." : `Thanh toán ${formatCurrency(bookingInfo.totalPrice - discountAmount)}`}
        </button>
      </div>
    </div>
  )
}
