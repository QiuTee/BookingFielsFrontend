import { Wallet, X , CreditCard , Clock } from "lucide-react"
import formatCurrency from "../../utils/FormatCurrency"
import formatDate from "../../utils/FormatDate"
import { groupTimeRanges } from "../../utils/groupTimeRanges"
import { statusMap } from "../../constants/statusMap"


export default function BookingDetailModal ({selectedBooking , discount ,  handleCloseModal}) {
    return(
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-md w-full p-6 max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">Chi tiết booking</h3>
                    <button onClick={handleCloseModal} className="text-gray-400 hover:text-gray-600">
                    <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="space-y-4">
                    <div>
                        <label className="text-sm font-medium text-gray-600">Mã booking</label>
                        <p className="text-gray-900">{selectedBooking.id}</p>
                    </div>

                    <div>
                        <label className="text-sm font-medium text-gray-600">Khách hàng</label>
                        <p className="text-gray-900">{selectedBooking.userName}</p>
                        <p className="text-sm text-gray-600">{selectedBooking.phone}</p>
                    </div>

                    <div>
                        <label className="text-sm font-medium text-gray-600">Sân</label>
                        <p className="text-gray-900">{selectedBooking.fieldName}</p>
                    </div>

                    <div>
                        <label className="text-sm font-medium text-gray-600">Ngày</label>
                        <p className="text-gray-900">{formatDate(selectedBooking.date)}</p>
                    </div>

                    <div>
                        <label className="text-sm font-medium text-gray-600">Thời gian & Sân</label>
                        {(() => {
                            const groupedBySubField =
                            selectedBooking.slots?.reduce((acc, slot) => {
                                acc[slot.subField] = acc[slot.subField] || []
                                acc[slot.subField].push(slot.time)
                                return acc
                            }, {}) || {}

                            return Object.entries(groupedBySubField).map(([subField, times], idx) => (
                            <div key={idx} className="flex items-center gap-2 text-sm">
                                <Clock className="h-4 w-4 text-gray-500" />
                                <span className="font-medium">{subField}:</span>
                                <span>{groupTimeRanges(times).join(", ")}</span>
                            </div>
                            ))
                        })()}
                    </div>

                    <div>
                        <label className="text-sm font-medium text-gray-600">Trạng thái</label>
                        <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            statusMap[selectedBooking.status || "confirmed_paid"].color
                            }`}
                        >
                            {getStatusIcon(selectedBooking.status)}
                            <span className="ml-1">{statusMap[selectedBooking.status || "confirmed_paid"].label}</span>
                        </span>
                    </div>

                    <div>
                        <label className="text-sm font-medium text-gray-600">Tình trạng</label>
                        <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            processStatusConfig[selectedBooking.processStatus || "waiting_response"].color
                            }`}
                        >
                            {processStatusConfig[selectedBooking.processStatus || "waiting_response"].label}
                        </span>
                    </div>

                    <div>
                        <label className="text-sm font-medium text-gray-600">Mã giảm giá</label>
                        {selectedBooking.voucherCode ? (
                            <div className="mt-1">
                            <div className="inline-flex items-center px-2.5 py-1 rounded-md text-sm font-medium bg-green-50 text-green-700 border border-green-200">
                                {selectedBooking.voucherCode}
                            </div>
                            {discount > 0 && (
                                <div className="mt-2 text-green-600 text-sm flex items-center">
                                <CheckCircle className="w-4 h-4 mr-1" />
                                Giảm giá: {formatCurrency(discount)}
                                </div>
                            )}
                            </div>
                        ) : (
                            <p className="text-gray-500 text-sm mt-1">Không sử dụng mã giảm giá</p>
                        )}
                    </div>

                    <div>
                        <label className="text-sm font-medium text-gray-600">Giá tiền</label>
                        <div>
                            {discount > 0 ? (
                            <>
                                <p className="text-gray-500 line-through">{formatCurrency(selectedBooking.totalPrice)}</p>
                                <p className="text-gray-900 font-semibold">
                                {formatCurrency(selectedBooking.totalPrice - discount)}
                                </p>
                            </>
                            ) : (
                            <p className="text-gray-900 font-semibold">{formatCurrency(selectedBooking.totalPrice)}</p>
                            )}
                        </div>
                    </div>

                    {selectedBooking.paymentImageUrl && (
                    <div>
                        <label className="text-sm font-medium text-gray-600">Ảnh thanh toán</label>
                        <img
                        src={selectedBooking.paymentImageUrl || "/placeholder.svg"}
                        alt="Thanh toán"
                        className="w-full h-auto mt-2 cursor-zoom-in border rounded"
                        onClick={() => setZoomImageUrl(selectedBooking.paymentImageUrl)}
                        />
                    </div>
                    )}
                </div>

                <div className="flex gap-3 mt-6">
                    {selectedBooking.status === "confirmed_deposit" && (
                    <button
                        onClick={() => {
                        handleStatusChange(selectedBooking.id, "confirmed_paid")
                        setShowModal(false)
                        }}
                        className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                    >
                        <CreditCard className="h-4 w-4" />
                        Thanh toán đủ
                    </button>
                    )}
                    {selectedBooking.status === "confirmed_paid" && (
                    <button
                        onClick={() => {
                        handleStatusChange(selectedBooking.id, "confirmed_deposit")
                        setShowModal(false)
                        }}
                        className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                    >
                        <Wallet className="h-4 w-4" />
                        Chuyển về đặt cọc
                    </button>
                    )}
                    <button
                    onClick={handleCloseModal}
                    className="flex-1 bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors"
                    >
                    Đóng
                    </button>
                </div>
            </div>
        </div>
    )
}