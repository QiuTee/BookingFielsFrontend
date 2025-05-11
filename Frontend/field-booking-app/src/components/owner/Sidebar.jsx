import { NavLink } from "react-router-dom";
import { LayoutDashboard, CalendarDays, Landmark, Bell } from "lucide-react";

export default function Sidebar() {
  return (
    // ✅ Ẩn sidebar trên mobile, chỉ hiện khi md trở lên
    <aside className="hidden md:flex w-64 bg-blue-700 text-white flex-col p-4 space-y-6">
      <h1 className="text-xl font-bold">Quản lý Sân</h1>
      
      <NavLink
        to="/dashboard"
        className="hover:bg-blue-600 px-4 py-2 rounded flex items-center gap-2"
      >
        <LayoutDashboard size={18} /> Thống kê
      </NavLink>

      <NavLink
        to="/dashboard/bookings"
        className="hover:bg-blue-600 px-4 py-2 rounded flex items-center gap-2"
      >
        <CalendarDays size={18} /> Đặt sân
      </NavLink>

      <NavLink
        to="/dashboard/fields"
        className="hover:bg-blue-600 px-4 py-2 rounded flex items-center gap-2"
      >
        <Landmark size={18} /> Quản lý sân
      </NavLink>

      <NavLink
        to="/dashboard/notifications"
        className="hover:bg-blue-600 px-4 py-2 rounded flex items-center gap-2"
      >
        <Bell size={18} /> Thông báo
      </NavLink>
    </aside>
  );
}
