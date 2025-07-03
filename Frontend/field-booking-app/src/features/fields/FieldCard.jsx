import { Phone, Clock, MapPin, Star, Heart, Calendar, ArrowRight } from "lucide-react"
import { useState, useEffect } from "react"
import { useBooking } from "../../context/BookingContext"
import { useNavigate } from "react-router-dom"

const checkTime = (opentime, closetime, is24h) => {
  if (is24h) return true
  const now = new Date()
  const currentTime = now.getHours() * 60 + now.getMinutes()
  const [openHour, openMin] = opentime.split(":").map(Number)
  const [closeHour, closeMin] = closetime.split(":").map(Number)
  const openTimeMin = openHour * 60 + openMin
  const closeTimeMin = closeHour * 60 + closeMin
  return currentTime >= openTimeMin && currentTime <= closeTimeMin
}

export default function FieldCard({ field, onClick, isFavorite, handleFavoriteToggle }) {
  const [isOpen, setIsOpen] = useState(false)
  const { setBookingData } = useBooking()
  const navigate = useNavigate()
  const [isActive , setIsActive] = useState(false)
  useEffect(() => {
    const runChecktime = () => {
      const result = checkTime(field.opentime, field.closetime, field.is24h)
      setIsOpen(result)
      if (field.status === "active") return setIsActive(true)
    }

    runChecktime()
    const interval = setInterval(runChecktime, 60000)
    return () => clearInterval(interval)
  }, [field.opentime, field.closetime, field.is24h])

  const handleClick = () => {
    onClick(field)
  }

  const handleBookingClick = (e) => {
    e.preventDefault()
    e.stopPropagation()
    console.log 
    setBookingData((prev) => ({
      ...prev,
      selectionField: field.name,
      fieldId: field.id,
      slug: field.slug,
      price: field.price,
      subFields : field.subFields,
      phone : field.phone , 
      location : field.location

    }))
    setTimeout(() => {
      navigate(`/san/${field.slug}/booking/${field.id}`)
    }, 0)
  }

  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN").format(price)
  }
  return (
    <div
      onClick={handleClick}
      className="group bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer border border-slate-100 hover:border-blue-200"
    >
      <div className="relative">
        <img
          src={field.heroImage || "/placeholder.svg?height=140&width=300"}
          alt={field.name}
          className="w-full h-32 object-cover group-hover:scale-105 transition-transform duration-300"
        />

        <div className="absolute top-2 left-2 right-2 flex justify-between items-start">
          <div
            className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium backdrop-blur-sm ${
              isOpen ? "bg-emerald-500/90 text-white" : "bg-red-500/90 text-white"
            }`}
          >
            <div className={`w-1.5 h-1.5 rounded-full bg-white animate-pulse`} />
            {isOpen ? "Mở" : "Đóng"}
          </div>

          <div className="flex gap-1">
            <div className="bg-white/95 backdrop-blur-sm rounded-full px-2 py-1 flex items-center gap-1">
              <Star className="w-3 h-3 text-yellow-500 fill-current" />
              <span className="text-xs font-semibold text-slate-700">4.8</span>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation()
                handleFavoriteToggle()
              }}
              className="bg-white/95 backdrop-blur-sm rounded-full p-1.5 hover:scale-110 transition-transform"
            >
              <Heart
                className={`w-4 h-4 ${isFavorite ? "fill-red-500 text-red-500" : "text-slate-400 hover:text-red-400"}`}
              />
            </button>
          </div>
        </div>
      </div>

      <div className="p-4">
        <div className="mb-3">
          <div className="flex items-start justify-between mb-1">
            <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-1 flex-1 mr-2">
              {field.name}
            </h3>
            <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded text-xs font-medium whitespace-nowrap">
              {field.type}
            </span>
          </div>

          <div className="flex items-center text-slate-500 text-sm mb-2">
            <MapPin className="w-3 h-3 mr-1 flex-shrink-0" />
            <span className="line-clamp-1">{field.location}</span>
          </div>
        </div>

        <div className="flex items-center justify-between text-xs text-slate-600 mb-3">
          <div className="flex items-center gap-1">
            <Phone className="w-3 h-3" />
            <span className="truncate">{field.phone}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            <span className={isOpen ? "text-emerald-600" : "text-red-500"}>
              {field.is24h ? "24/7" : `${field.opentime}-${field.closetime}`}
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <p className="text-lg font-bold text-slate-900">{formatPrice(field.price)}đ</p>
            <p className="text-xs text-slate-500">per giờ</p>
          </div>

          <button
            disabled={!isActive}
            onClick={handleBookingClick}
            className={`px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 flex items-center gap-1 ${
              isActive
                ? "bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg"
                : "bg-slate-200 text-slate-400 cursor-not-allowed"
            }`}
          >
            <Calendar className="w-3 h-3" />
            <span className="hidden sm:inline">{isActive ? "Đặt sân" : "Đã đóng"}</span>
            {isActive && <ArrowRight className="w-3 h-3" />}
          </button>
        </div>
      </div>
    </div>
  )
}
