export default function FieldFilter({ filters, onChange }) {
  return (
    <div className="bg-blue-50 py-6 px-4">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-4 items-start md:items-end">
        <input
          type="text"
          placeholder="Tìm kiếm tên sân..."
          value={filters.search}
          onChange={(e) => onChange({ ...filters, search: e.target.value })}
          className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <select
          value={filters.type}
          onChange={(e) => onChange({ ...filters, type: e.target.value })}
          className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Tất cả loại sân</option>
          <option value="sân bóng đá">Sân bóng đá</option>
          <option value="sân bóng rổ">Sân bóng rổ</option>
          <option value="sân tennis">Sân tennis</option>
          <option value="sân cầu lông">Sân cầu lông</option>
          <option value="sân Pickleball">Sân Pickleball</option>
        </select>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onChange({ ...filters, onlyFavorites: !filters.onlyFavorites })}
            className={`flex items-center gap-1 px-3 py-2 rounded-full border text-sm transition 
              ${
                filters.onlyFavorites
                  ? 'bg-red-100 border-red-400 text-red-600 font-semibold'
                  : 'bg-white border-gray-300 text-gray-600 hover:bg-gray-100'
              }`}
          >
            <span>❤️</span>
            <span>Yêu thích</span>
          </button>
        </div>
      </div>
    </div>
  );
}
