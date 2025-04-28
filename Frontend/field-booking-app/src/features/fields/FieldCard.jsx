import { Phone, Clock } from 'lucide-react';
import checkTime from '../../hooks/CheckTime';
import { useState, useEffect, useContext } from 'react';
import { Star, Heart } from 'lucide-react';
import { BookingContext } from '../../context/BookingContext';
import { useNavigate } from 'react-router-dom'; 

export default function FieldCard({ field, onClick, isFavorite, handleFavoriteToggle }) {
  const handleClick = () => {
    onClick(field);
  };

  const [isOpen, setIsOpen] = useState(false);
  const { setBookingData } = useContext(BookingContext);
  const navigate = useNavigate(); 

  useEffect(() => {
    const runChecktime = async () => {
      const dealine = checkTime(field.openTime, field.closeTime);
      setIsOpen(dealine);
    };

    runChecktime();
    const interval = setInterval(runChecktime, 60000);
    return () => clearInterval(interval);
  }, [field.openTime, field.closeTime]);

  const handleBookingClick = (e) => {
    e.preventDefault();
    e.stopPropagation();

    setBookingData((prev) => ({
      ...prev,
      selectionField: field.name
    }));

    setTimeout(() => {
      navigate(`/booking/${field.name.toLowerCase().replace(/\s+/g, "-")}`);
    }, 0);
  };

  return (
    <div onClick={handleClick} className="bg-white rounded-xl shadow hover:shadow-lg transition overflow-hidden">
      <div className="relative">
        <img src={field.image} alt={field.name} className="w-full h-48 object-cover" />
        <div className="absolute top-2 left-2 bg-white bg-opacity-50 text-white px-2 py-1 rounded flex items-center gap-1 border border-gray-300">
          <Star className="w-4 h-4 text-yellow-600" />
          <span className="text-sm text-yellow-600">5</span>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleFavoriteToggle();
          }}
          className="absolute top-2 right-2 bg-white bg-opacity-80 rounded-full p-1 shadow hover:scale-105 transition"
        >
          <Heart className={`w-5 h-5 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-400'}`} />
        </button>
      </div>

      <div className="p-4">
        <h3 className="text-xl font-semibold text-blue-700 mb-1">{field.name}</h3>
        <p className="text-gray-500 text-sm">{field.location}</p>

        <div className="flex items-center justify-between text-gray-500 text-sm mt-2">
          <div className="flex items-center gap-1">
            <Phone className="w-4 h-4" />
            <span>{field.phone}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            <span className={`transition-colors duration-500 ${isOpen ? "text-green-600" : "text-red-500"}`}>
              {field.is24h ? "Mở cửa cả ngày" : `${field.openTime} - ${field.closeTime}`}
            </span>
          </div>
        </div>

        <p className="text-gray-700 font-medium mt-2">Giá: {field.price}đ/giờ</p>
        <button
          disabled={!isOpen}
          onClick={handleBookingClick}
          className={`inline-block mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg    ${isOpen ? "hover:bg-blue-700 " : "bg-gray-700" }`}
        >
          Đặt sân
        </button>
      </div>
    </div>
  );
}
