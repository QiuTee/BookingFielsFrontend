export default function PricingOverlay({ onClose }) {
  return (
    <div className="fixed inset-0 z-[100] backdrop-blur-sm bg-black/40 flex items-center justify-center">
      <div className="bg-[#77a8f0] text-white p-6 overflow-y-auto max-h-[90vh] w-[95%] sm:w-[600px] md:w-[700px] lg:w-[850px] xl:w-[950px] rounded-lg shadow-lg relative">

        <div className="flex justify-between items-center mb-4">
          <button
            onClick={onClose}
            className="text-white text-lg font-semibold hover:underline"
          >
            ← Quay lại
          </button>
          <h1 className="text-xl font-bold text-center w-full -ml-6">
            Xem sân và bảng giá
          </h1>
        </div>

        <div className="flex justify-center mb-6">
          <img
            src="/images/pricing-map.png"
            alt="Sơ đồ và thông tin liên hệ"
            className="w-full max-w-md rounded-lg shadow-xl border border-white"
          />
        </div>

        <p className="text-center font-semibold text-lg mb-6">
          LIÊN HỆ ĐẶT SÂN: <span className="text-yellow-300">0973.113.837</span>
        </p>

        <h2 className="text-lg font-bold mb-2">Bảng giá sân</h2>
        <div className="overflow-x-auto rounded-lg border border-white">
          <table className="w-full text-sm text-left border-collapse">
            <thead className="bg-[#1E40AF]">
              <tr>
                <th className="px-4 py-2 border border-white">Thứ</th>
                <th className="px-4 py-2 border border-white">Khung giờ</th>
                <th className="px-4 py-2 border border-white">Cố định</th>
                <th className="px-4 py-2 border border-white">Vãng lai</th>
              </tr>
            </thead>
            <tbody>
              <tr className="bg-[#3B82F6]">
                <td rowSpan="3" className="px-4 py-2 border border-white">T2 - T6</td>
                <td className="px-4 py-2 border border-white">5h - 7h</td>
                <td className="px-4 py-2 border border-white">90.000 đ</td>
                <td className="px-4 py-2 border border-white">100.000 đ</td>
              </tr>
              <tr className="bg-[#60A5FA]">
                <td className="px-4 py-2 border border-white">7h - 17h</td>
                <td className="px-4 py-2 border border-white">40.000 đ</td>
                <td className="px-4 py-2 border border-white">50.000 đ</td>
              </tr>
              <tr className="bg-[#3B82F6]">
                <td className="px-4 py-2 border border-white">17h - 23h</td>
                <td className="px-4 py-2 border border-white">90.000 đ</td>
                <td className="px-4 py-2 border border-white">100.000 đ</td>
              </tr>
              <tr className="bg-[#1D4ED8]">
                <td className="px-4 py-2 border border-white">T7 - CN</td>
                <td className="px-4 py-2 border border-white">5h - 23h</td>
                <td className="px-4 py-2 border border-white">100.000 đ</td>
                <td className="px-4 py-2 border border-white">110.000 đ</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
