import { Bell, Phone } from "lucide-react";
import { useState , useRef , useEffect} from "react";
import { getBookingsForOwner , markBookingAsRead } from "../../api/submission";
import { useParams } from "react-router-dom";



export default function NotificationBell(){
    const {slug} = useParams();
    const buttonRef = useRef(null);
    const popoverRef = useRef(null);
    const [notifications , setNotifications] = useState([])
    const [isDialogOpen , setIsDialogOpen] = useState(false)
    const [isPopoverOpen , setIsPopoverOpen] = useState(false)
    const [selectedNotification , setSelectedNotification] = useState(null)
    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await getBookingsForOwner(slug);
                setNotifications(data)
                
            }catch(error){
                console.error("Lỗi khi lấy thông báo" , error)
            }
        }
        fetchData();
        const interval = setInterval(fetchData, 15000);
        return () => clearInterval(interval)
    },[slug])

    useEffect(() => {
        function handleClickOutside(event){
            if(buttonRef.current &&
                popoverRef.current &&
                !buttonRef.current.contains(event.target) &&
                !popoverRef.current.contains(event.target)

            ){
                setIsPopoverOpen(false);
            }

        }
        document.addEventListener("mousedown" , handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    },[])

    const unreadCount = notifications.filter((n) => !n.isRead).length;
    const markAllAsRead = async () => {
        try {
            const unread = notifications.filter((n) => !n.isRead)
            await Promise.all(
                unread.map((booking) => markBookingAsRead(booking.id))
            );
            setNotifications(notifications.map((n) => ({...n , isRead: true})))
        }catch(error){
            
        }
    };
    
    const markAsRead = async (id , closeDialog = false) => {
        console.log(id)
        await markBookingAsRead(id)
        setNotifications(notifications.map((booking) => booking.id === id ? ({...booking , isRead:true}): booking))
        if(closeDialog) return setIsDialogOpen(false)

    }
    const handleNotificationClick = (notification) => {
        console.log(notification)
        markAsRead(notification.id)
        setSelectedNotification(notification)
        setIsDialogOpen(true)
        setIsPopoverOpen(false)
    };


    const togglePopover = () => setIsPopoverOpen(!isPopoverOpen);
    return (
        <div className="relative">
            <button 
                ref={buttonRef}
                onClick={togglePopover}
                className="relative flex items-center justify-center w-10 h-10 rounded-full border border-gray-200 bg-white hover:bg-gray-100 transition-colors">
                    <Bell className="h-5 w-5" />
                    {unreadCount > 0 && (
                        <span className="absolute -top-2 -right-2 flex items-center justify-center h-5 w-5 rounded-full bg-red-500 text-white text-xs" >
                            {unreadCount}
                        </span>
                    )}
            </button>

            {isPopoverOpen && (
                <div
                    ref={popoverRef}
                    className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50"
                    >
                    <div className="flex items-center justify-between p-4 border-b">
                        <h3 className="text-lg font-medium">Thông báo</h3>
                        {unreadCount > 0 && (
                            <button 
                                onClick={markAllAsRead}
                                className="text-xs px-2 py-1 rounded hover:bg-gray-100"
                                >
                                    Đánh dấu tất cả đẫ đọc
                            </button>
                        )}
                    </div>

                    <div className="max-h-[400px] overflow-auto">
                        {notifications.length > 0 ? (
                        <div className="divide-y divide-gray-200">
                            {notifications.map((booking) => (
                            <div 
                                key={booking.id}
                                onClick={() => handleNotificationClick(booking)}
                                className={`p-4 cursor-pointer hover:bg-gray-100 ${!booking.isRead ? "bg-gray-50" : ""} `}
                                >
                                    <div className="flex items-start gap-3">
                                        {!booking.isRead && <div className="mt-1.5 h-2 w-2 rounded-full bg-blue-600 flex-shrink-0" />}
                                        <div className={`flex-1 ${booking.isRead ? " pl-5" : ""}`}>
                                            <p className="font-medium leading-tight">
                                                {booking.userName} • {booking.fieldName}
                                            </p>
                                            <p className="text-xs text-gray-500 mt-1">
                                            Ngày: {new Date(booking.date).toLocaleDateString("vi-VN")}
                                            </p>
                                        </div>
                                    </div>
                            </div>
                            ))}
                        </div>
                        ):
                        (
                        <div className="py-6 text-center text-gray-600">
                            Không có thông báo nào được hiện thị
                        </div>
                        )}
                    </div>

                    <div className="p-2 border-t border-gray-200">
                        <button className="w-full text-sm py-1 px-2 rounded hover:bg-gray-100">
                            Xem tất cả các thông báo
                        </button>
                    </div>
                </div>
            )}
            {isDialogOpen && selectedNotification && (
                <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg max-w-md w-full p-6 max-h-[90vh] overflow-y-auto">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-semibold text-gray-900">Chi tiết Booking</h3>
                        <button onClick={() => setIsDialogOpen(false)} className="text-gray-400 hover:text-gray-600">
                        ✕
                        </button>
                    </div>

                    <div className="space-y-3">
                        <div>
                        <label className="text-sm font-medium text-gray-600">Mã booking</label>
                        <p className="text-gray-900">{selectedNotification.id}</p>
                        </div>
                        <div>
                        <label className="text-sm font-medium text-gray-600">Khách hàng</label>
                        <p className="text-gray-900">{selectedNotification.userName}</p>
                        <p className="text-sm text-gray-500">{selectedNotification.phone}</p>
                        </div>
                        <div>
                        <label className="text-sm font-medium text-gray-600">Sân</label>
                        <p className="text-gray-900">{selectedNotification.fieldName}</p>
                        </div>
                        <div>
                        <label className="text-sm font-medium text-gray-600">Ngày</label>
                        <p className="text-gray-900">{new Date(selectedNotification.date).toLocaleDateString("vi-VN")}</p>
                        </div>
                        <div>
                        <label className="text-sm font-medium text-gray-600">Trạng thái</label>
                        <p className="text-gray-900 capitalize">{selectedNotification.status}</p>
                        </div>
                    </div>

                    <div className="flex gap-3 mt-6">
                        <button
                        onClick={() => setIsDialogOpen(false)}
                        className="flex-1 bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300"
                        >
                        Đóng
                        </button>
                    </div>
                    </div>
                </div>
                )}

             
        </div>
    )
} 