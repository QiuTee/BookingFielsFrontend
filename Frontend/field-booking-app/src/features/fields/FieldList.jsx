import FieldCard from "./FieldCard"
import { Search, MapPin, Grid3X3, LayoutGrid } from "lucide-react"
import { useState } from "react"

export default function FieldList({ fields, onCardClick, favorites, handleFavoriteToggle }) {
  const [viewMode, setViewMode] = useState("grid") 

  if (!fields || fields.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="text-center">
          <div className="w-24 h-24 bg-gradient-to-br from-slate-100 to-slate-200 rounded-full flex items-center justify-center mx-auto mb-6">
            <Search className="w-12 h-12 text-slate-400" />
          </div>
          <h3 className="text-2xl font-bold text-slate-900 mb-3">Không tìm thấy sân nào</h3>
          <p className="text-slate-600 mb-6 max-w-md mx-auto">
            Thử thay đổi từ khóa tìm kiếm hoặc bộ lọc để tìm thấy sân phù hợp với bạn
          </p>
          <div className="flex items-center justify-center gap-2 text-slate-500">
            <MapPin className="w-4 h-4" />
            <span className="text-sm">Mở rộng khu vực tìm kiếm hoặc thử lại sau</span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-gradient-to-b from-slate-50 to-white py-6">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Tìm thấy {fields.length} sân thể thao</h2>
            <p className="text-slate-600 mt-1">Chọn sân phù hợp và đặt ngay hôm nay</p>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-white rounded-lg p-1 border border-slate-200">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded-md transition-colors ${
                  viewMode === "grid" ? "bg-blue-100 text-blue-600" : "text-slate-400 hover:text-slate-600"
                }`}
                title="Lưới thường"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode("compact")}
                className={`p-2 rounded-md transition-colors ${
                  viewMode === "compact" ? "bg-blue-100 text-blue-600" : "text-slate-400 hover:text-slate-600"
                }`}
                title="Lưới compact"
              >
                <Grid3X3 className="w-4 h-4" />
              </button>
            </div>

            <div className="hidden md:flex items-center gap-2">
              <span className="text-sm text-slate-600">Sắp xếp:</span>
              <select className="px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white">
                <option value="relevance">Liên quan</option>
                <option value="price-low">Giá thấp</option>
                <option value="price-high">Giá cao</option>
                <option value="rating">Đánh giá</option>
                <option value="distance">Khoảng cách</option>
              </select>
            </div>
          </div>
        </div>

        <div
          className={`grid gap-4 ${
            viewMode === "compact"
              ? "grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6"
              : "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5"
          }`}
        >
          {fields.map((field) => (
            <FieldCard
              key={field.id}
              field={field}
              onClick={onCardClick}
              isFavorite={favorites.includes(field.id)}
              handleFavoriteToggle={() => handleFavoriteToggle(field.id)}
            />
          ))}
        </div>

        {fields.length >= 12 && (
          <div className="text-center mt-8">
            <button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl">
              Xem thêm sân ({fields.length - 12}+ sân khác)
            </button>
          </div>
        )}

       
      </div>
    </div>
  )
}

