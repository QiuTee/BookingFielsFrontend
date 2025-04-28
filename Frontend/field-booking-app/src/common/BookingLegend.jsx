export default function BookingLegend() {
    return(
        <div className="flex items-center space-x-6 text-sm text-gray-600 mb-4">
            <div className="flex items-center space-x-1">
                <div className="w-4 h-4 border-2 border-green-500 bg-green-100 rounded-sm"></div>
                <span>Có thể đặt</span>
            </div>

            <div className="flex items-center space-x-1">
                <div className="w-4 h-4 border-2 border-red-400 bg-red-100 rounded-sm"></div>
                <span>Đã đặt</span>
            </div>

            <div className="flex items-center space-x-1">
                <div className="w-4 h-4 border-2 border-blue-400 bg-blue-100 rounded-sm"></div>
                <span>Đã chọn</span>
            </div>
        </div>
    )
}


