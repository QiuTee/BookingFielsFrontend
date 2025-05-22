export default function StatCard({ title, value, sub, trend, icon }) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100">
      <div className="p-6">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
            <h3 className="text-2xl font-bold text-gray-900">{value}</h3>
          </div>
          <div className="bg-gray-100 p-2 rounded-full">{icon}</div>
        </div>
        <p className={`text-sm mt-2 ${trend === "up" ? "text-green-600" : "text-red-600"}`}>{sub}</p>
      </div>
    </div>
  )
}