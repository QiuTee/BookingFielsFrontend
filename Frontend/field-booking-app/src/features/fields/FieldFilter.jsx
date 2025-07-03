import { Search, Filter, Heart, MapPin, Star, SlidersHorizontal, X } from "lucide-react"
import { useState } from "react"

export default function FieldFilter({ filters, onChange }) {
  const [showAdvanced, setShowAdvanced] = useState(false)

  const courtTypes = [
    { value: "", label: "Tất cả loại sân" },
    { value: "sân bóng đá", label: "Sân bóng đá" },
    { value: "sân bóng rổ", label: "Sân bóng rổ" },
    { value: "sân tennis", label: "Sân tennis" },
    { value: "sân cầu lông", label: "Sân cầu lông" },
    { value: "sân Pickleball", label: "Sân Pickleball" },
  ]

  const priceRanges = [
    { value: "", label: "Tất cả mức giá" },
    { value: "0-100000", label: "Dưới 100k" },
    { value: "100000-200000", label: "100k - 200k" },
    { value: "200000-300000", label: "200k - 300k" },
    { value: "300000+", label: "Trên 300k" },
  ]

  const clearFilters = () => {
    onChange({
      search: "",
      type: "",
      onlyFavorites: false,
      priceRange: "",
      rating: "",
      distance: "",
    })
  }

  const hasActiveFilters = filters.type || filters.onlyFavorites || filters.priceRange || filters.rating

  return (
    <div className="bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 border-b border-white/40">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">
            Tìm sân thể thao
          </h2>
          <p className="text-slate-600">Khám phá và đặt sân yêu thích của bạn</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-4 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Tìm kiếm tên sân, địa chỉ..."
              value={filters.search}
              onChange={(e) => onChange({ ...filters, search: e.target.value })}
              className="w-full pl-12 pr-4 py-4 bg-white/80 backdrop-blur-sm border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-slate-700 placeholder-slate-400 shadow-lg"
            />
          </div>

          <div className="flex gap-3">
            <div className="relative min-w-[200px]">
              <Filter className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
              <select
                value={filters.type}
                onChange={(e) => onChange({ ...filters, type: e.target.value })}
                className="w-full pl-12 pr-4 py-4 bg-white/80 backdrop-blur-sm border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-slate-700 appearance-none cursor-pointer shadow-lg"
              >
                {courtTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={() => onChange({ ...filters, onlyFavorites: !filters.onlyFavorites })}
              className={`flex items-center gap-2 px-6 py-4 rounded-2xl border-2 font-semibold transition-all duration-300 shadow-lg ${
                filters.onlyFavorites
                  ? "bg-gradient-to-r from-red-500 to-pink-500 border-red-400 text-white shadow-red-200"
                  : "bg-white/80 backdrop-blur-sm border-slate-200 text-slate-600 hover:border-red-300 hover:text-red-500"
              }`}
            >
              <Heart className={`w-5 h-5 ${filters.onlyFavorites ? "fill-current" : ""}`} />
              <span className="hidden sm:inline">Yêu thích</span>
            </button>

            <button
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="flex items-center gap-2 px-6 py-4 bg-white/80 backdrop-blur-sm border-2 border-slate-200 rounded-2xl text-slate-600 hover:border-blue-300 hover:text-blue-600 transition-all duration-300 shadow-lg"
            >
              <SlidersHorizontal className="w-5 h-5" />
              <span className="hidden sm:inline">Bộ lọc</span>
            </button>
          </div>
        </div>

        {showAdvanced && (
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-white/40 shadow-lg animate-in slide-in-from-top-2 duration-300">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-slate-900">Bộ lọc nâng cao</h3>
              <button
                onClick={() => setShowAdvanced(false)}
                className="p-2 hover:bg-slate-100 rounded-full transition-colors"
              >
                <X className="w-4 h-4 text-slate-500" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FilterSelect
                icon={<span className="text-emerald-600">💰</span>}
                label="Mức giá"
                value={filters.priceRange || ""}
                onChange={(value) => onChange({ ...filters, priceRange: value })}
                options={priceRanges}
              />

              <FilterSelect
                icon={<Star className="w-4 h-4 text-yellow-500" />}
                label="Đánh giá"
                value={filters.rating || ""}
                onChange={(value) => onChange({ ...filters, rating: value })}
                options={[
                  { value: "", label: "Tất cả đánh giá" },
                  { value: "4.5+", label: "4.5+ sao" },
                  { value: "4.0+", label: "4.0+ sao" },
                  { value: "3.5+", label: "3.5+ sao" },
                ]}
              />

              <FilterSelect
                icon={<MapPin className="w-4 h-4 text-blue-500" />}
                label="Khoảng cách"
                value={filters.distance || ""}
                onChange={(value) => onChange({ ...filters, distance: value })}
                options={[
                  { value: "", label: "Tất cả khoảng cách" },
                  { value: "1km", label: "Trong 1km" },
                  { value: "3km", label: "Trong 3km" },
                  { value: "5km", label: "Trong 5km" },
                  { value: "10km", label: "Trong 10km" },
                ]}
              />
            </div>
          </div>
        )}

        {hasActiveFilters && (
          <div className="flex items-center justify-between mt-4 p-4 bg-white/60 backdrop-blur-sm rounded-xl border border-white/40">
            <div className="flex items-center gap-2 text-sm text-slate-600">
              <Filter className="w-4 h-4" />
              <span>Đang áp dụng bộ lọc</span>
            </div>
            <button
              onClick={clearFilters}
              className="flex items-center gap-1 px-3 py-1 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <X className="w-3 h-3" />
              Xóa bộ lọc
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

const FilterSelect = ({ icon, label, value, onChange, options }) => (
  <div>
    <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
      {icon}
      {label}
    </label>
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-slate-700 appearance-none cursor-pointer"
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  </div>
)
