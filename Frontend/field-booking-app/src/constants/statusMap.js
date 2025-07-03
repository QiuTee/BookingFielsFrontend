export const statusMap = {
    unpaid: { label: "Chưa thanh toán", color: "bg-yellow-100 text-yellow-800 ", background:"bg-yellow-500 hover:bg-yellow-600 border-yellow-600" },
    canceled: { label: "Đã hủy", color: "bg-red-100 text-red-800" },
    paid: { label: "Đã thanh toán", color: "bg-orange-100 text-orange-800", background:"bg-orange-500 hover:bg-orange-600 border-orange-600" },
    confirmed_paid: { label: "Đã xác nhận - Thanh toán đủ", color: "bg-green-100 text-green-800" ,background:"bg-green-500 hover:bg-green-600 border-green-600"},
    confirmed_deposit: { label: "Đã xác nhận - Đặt cọc", color: "bg-teal-100 text-teal-800", background:"bg-green-500 hover:bg-green-600 border-green-600" },
  };
  