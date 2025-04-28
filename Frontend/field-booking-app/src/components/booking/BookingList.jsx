import { statusMap } from "../../constants/statusMap";

export default function BookingList({ bookings, onSelect }) {
  return (
    <div className="bg-white shadow rounded-xl overflow-hidden border">
      <table className="w-full text-left text-sm">
        <thead className="bg-gray-50 text-gray-600">
          <tr>
            <th className="px-4 py-3">Sân</th>
            <th className="px-4 py-3">Ngày</th>
            <th className="px-4 py-3">Trạng thái</th>
          </tr>
        </thead>
        <tbody>
          {bookings.map((b) => (
            <tr
              key={b.id}
              onClick={() => onSelect(b)}
              className="hover:bg-blue-50 cursor-pointer border-t"
            >
              <td className="px-4 py-2">{b.fieldName}</td>
              <td className="px-4 py-2">
                {new Date(b.date).toLocaleDateString("vi-VN")}
              </td>
              <td className="px-4 py-2">
                <span
                  className={`text-xs font-semibold px-3 py-1 rounded-full ${
                    statusMap[b.status || "confirmed"].color
                  }`}
                >
                  {statusMap[b.status || "confirmed"].label}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
