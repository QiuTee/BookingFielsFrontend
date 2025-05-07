import {Home , Bell , User} from 'lucide-react';


export default function BottomNav({selectedTab , onSelectTab}){
    return (
        <div  className="fixed bottom-0 left-0 w-full bg-white border-t z-50">
            <div className="bg-sky-300 text-sky-900 grid grid-cols-3 py-3">
                <button
                onClick={() => onSelectTab("home")}
                className={`flex flex-col items-center justify-center ${selectedTab === "home" ? "font-bold" : ""}`}
                >
                <Home className="w-6 h-6" />
                <span className="text-xs mt-1">Trang chủ</span>
                </button>
                <button
                onClick={() => onSelectTab("notifications")}
                className={`flex flex-col items-center justify-center ${selectedTab === "notifications" ? "font-bold" : ""}`}
                >
                <Bell className="w-6 h-6" />
                <span className="text-xs mt-1">Thông báo</span>
                </button>
                <button
                onClick={() => onSelectTab("account")}
                className={`flex flex-col items-center justify-center ${selectedTab === "account" ? "font-bold" : ""}`}
                >
                <User className="w-6 h-6" />
                <span className="text-xs mt-1">Tài khoản</span>
                </button>
            </div>
        </div>
    );
}