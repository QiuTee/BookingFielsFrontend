import { Edit } from "lucide-react"


export default function FieldCard({ field }) {
  return (
    <div className="border border-gray-100 rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex justify-between">
        <div>
          <h3 className="font-medium text-gray-900">{field.name}</h3>
          <p className="text-sm text-gray-600 mt-1">
            {field.type} - {field.price.toLocaleString()}đ/giờ
          </p>
          <p className="text-sm text-gray-500 mt-1">{field.desc}</p>
        </div>
        <div className="flex flex-col items-end gap-2">
          <span
            className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${
              field.status === "active" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
            }`}
          >
            {field.status === "active" ? "Có sẵn" : "Đang bảo trì"}
          </span>
          <button className="text-gray-500 hover:text-gray-700 h-8 w-8 rounded-full flex items-center justify-center">
            <Edit className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  )
}