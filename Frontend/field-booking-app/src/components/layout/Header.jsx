import { useAuth } from '../../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import { ChevronDown, History, LogOut } from 'lucide-react';

export default function Header() {
  const { user, logout, isAuthenticated } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);

  const handleViewHistory = () => {
    setDropdownOpen(false);
    navigate('/booking-history'); 
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="bg-blue-200 shadow h-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between">
        <Link to="/" className="flex items-center h-full">
          <img src="/images/logo/vnvar_logo.png" alt="Logo" className="h-30 object-contain" />
        </Link>

        {isAuthenticated ? (
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={toggleDropdown}
              className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-blue-100 text-gray-800 font-medium transition"
            >
              👋 Xin chào, <strong>{user.name}</strong>
              <ChevronDown
                className={`w-4 h-4 transition-transform duration-200 ${dropdownOpen ? "rotate-180" : ""}`}
              />
            </button>

            {dropdownOpen && (
              <div
                className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border z-50 flex flex-col py-2 animate-dropdown"
              >
                <button
                  onClick={handleViewHistory}
                  className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 transition"
                >
                  <History className="w-4 h-4 text-blue-600" />
                  Lịch sử đặt sân
                </button>
                <button
                  onClick={logout}
                  className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition"
                >
                  <LogOut className="w-4 h-4 text-red-500" />
                  Đăng xuất
                </button>
              </div>
            )}
          </div>
        ) : (
          <nav className="space-x-4 text-sm">
            <Link to="/login" className="text-gray-700 hover:text-blue-600 font-medium">
              Đăng nhập
            </Link>
            <Link to="/register" className="text-gray-700 hover:text-blue-600 font-medium">
              Đăng ký
            </Link>
          </nav>
        )}
      </div>
    </header>
  );
}
