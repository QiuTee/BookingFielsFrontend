export default function BookingLegend({config = false}) {
    return(
        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-4 px-2 sm:px-0">
            <div className="flex items-center space-x-1">
                <div className="w-4 h-4 border-2 border-yellow-500 bg-yellow-100 rounded-sm"></div>
                <span>Đang chờ xác nhận</span>
            </div>

            <div className="flex items-center space-x-1">
                <div className={`w-4 h-4 border-2 ${!config ?"border-red-400 bg-red-100" : "border-green-400 bg-green-100" } rounded-sm`}></div>
                <span>Đã đặt</span>
            </div>

            <div className="flex items-center space-x-1">
                <div className={`w-4 h-4 border-2 ${!config ? "bg-cyan-200 border-2 border-cyan-400 rounded-sm": "sm:h-4 bg-gray-100 border-2 border-red-500 rounded"}`}></div>
                <span>{!config ? "Đã chọn" : "Xung đột thời gian"}</span>
            </div>
            {!config && (
                <>
                    <div className="flex items-center space-x-1">
                        <div className="w-4 h-4 border-2 bg-gray-400 border-gray-500 rounded-sm"></div>
                        <span>Khóa</span>
                    </div>
                    <div className="flex items-center space-x-1">
                        <div className="w-4 h-4 border-2 bg-white border-gray-300 rounded-sm"></div>
                        <span>Trống</span>
                    </div>
                        <div className="flex items-center space-x-1">
                        <div className="w-4 h-4 border-2 bg-purple-400 rounded-sm"></div>
                        <span>Sự kiện</span>
                    </div>
                </>
            )}


        </div>
    )
}


