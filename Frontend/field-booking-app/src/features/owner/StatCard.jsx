export default function StatCard({ title, value, icon }) {
  return (

    <div className="bg-white rounded-lg p-4 shadow-sm border">
      <div className="flex items-center">
        <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
          {icon}
        </div>
        <div className="ml-3">
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
        </div>
      </div>
    </div>
  )
}