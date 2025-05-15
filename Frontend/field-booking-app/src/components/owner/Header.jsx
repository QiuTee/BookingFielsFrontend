import { Bell, UserCircle, Menu } from "lucide-react";
import { useState } from "react";
import { NavLink , useParams } from "react-router-dom";
import NotificationBell from "../booking/NotificationBell";
import { useSelectedBooking } from "../../context/SelectedBookingContext";


export default function Header() {
  const [open, setOpen] = useState(false);
  const { setSelectedBooking } = useSelectedBooking();
  const { slug } = useParams(); 

  return (
    <header className="relative z-50 flex justify-between items-center p-4 bg-white shadow-md">
      <div className="flex items-center gap-4">
        <button className="md:hidden text-blue-600" onClick={() => setOpen(true)}>
          <Menu size={24} />
        </button>
        <h2 className="text-xl font-semibold text-blue-800">Bảng điều khiển</h2>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative cursor-pointer">
          <NotificationBell onOpenBooking={(b) => setSelectedBooking(b)} />
        </div>
        <UserCircle className="text-blue-600" size={28} />
      </div>

      {open && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 z-40"
          onClick={() => setOpen(false)}
        />
      )}

      <div
        className={`fixed top-0 left-0 h-full w-64 bg-blue-700 text-white p-4 z-50 transform transition-transform duration-300 ${
          open ? "translate-x-0" : "-translate-x-full"
        } md:hidden`}
      >
        <button onClick={() => setOpen(false)} className="text-white text-xl mb-4">×</button>
        <h1 className="text-xl font-bold mb-4">Quản lý Sân</h1>
        <NavLink to={`/san/${slug}/owner`} className="block px-4 py-2 rounded hover:bg-blue-600">Thống kê</NavLink>
        <NavLink to={`/san/${slug}/owner/bookings`} className="block px-4 py-2 rounded hover:bg-blue-600">Đặt sân</NavLink>
        {/* <NavLink to="/dashboard/fields" className="block px-4 py-2 rounded hover:bg-blue-600">Quản lý sân</NavLink>
        <NavLink to="/dashboard/notifications" className="block px-4 py-2 rounded hover:bg-blue-600">Thông báo</NavLink> */}
      </div>
    </header>
  );
}
