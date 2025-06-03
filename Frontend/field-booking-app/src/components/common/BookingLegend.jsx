export default function BookingLegend({config = false}) {
    return(
        <div className="flex items-center space-x-6 text-sm text-gray-600 mb-4">
            <div className="flex items-center space-x-1">
                <div className="w-4 h-4 border-2 border-yellow-500 bg-yellow-100 rounded-sm"></div>
                <span>Đang chờ xác nhận</span>
            </div>

            <div className="flex items-center space-x-1">
                <div className={`w-4 h-4 border-2 ${!config ?"border-red-400 bg-red-100" : "border-green-400 bg-green-100" } rounded-sm`}></div>
                <span>Đã đặt</span>
            </div>

            <div className="flex items-center space-x-1">
                <div className={`w-4 h-4 border-2 ${!config ? "border-green-400 bg-green-100 rounded-sm": "sm:h-4 bg-gray-100 border-2 border-red-500 rounded"}`}></div>
                <span>{!config ? "Đã chọn" : "Xung đột thời gian"}</span>
            </div>
            

            
        </div>
    )
}


