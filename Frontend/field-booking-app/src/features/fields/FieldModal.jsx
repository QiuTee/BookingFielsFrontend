
import { useState } from "react"
import {
  Phone,
  MapPin,
  Clock,
  Star,
  Info,
  X,
  Calendar,
  Users,
  Wifi,
  Car,
  Coffee,
  Shield,
  Globe,
  ChevronLeft,
  ChevronRight,
  Heart,
  Share2,
  ExternalLink,
  BadgeCheck,
} from "lucide-react"
import { useNavigate } from "react-router-dom"

export default function FieldModal({ field, onClose }) {
  const [activeTab, setActiveTab] = useState("info")
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const navigate = useNavigate()

  if (!field) return null

  const tabs = [
    { id: "info", label: "Thông tin", icon: <Info className="w-4 h-4" /> },
    { id: "services", label: "Dịch vụ", icon: <Star className="w-4 h-4" /> },
    { id: "images", label: "Hình ảnh", icon: <Users className="w-4 h-4" /> },
    { id: "reviews", label: "Đánh giá", icon: <Star className="w-4 h-4" /> },
  ]

  const mockServices = [
    { icon: <Wifi className="w-5 h-5" />, name: "Wifi miễn phí", available: true },
    { icon: <Car className="w-5 h-5" />, name: "Bãi đỗ xe", available: true },
    { icon: <Coffee className="w-5 h-5" />, name: "Căng tin", available: true },
    { icon: <Shield className="w-5 h-5" />, name: "Bảo vệ 24/7", available: false },
  ]
  const mockReviews = [
    {
      id: 1,
      user: "Nguyễn Văn A",
      rating: 5,
      comment: "Sân rất đẹp, dịch vụ tốt. Sẽ quay lại!",
      date: "2024-01-15",
    },
    {
      id: 2,
      user: "Trần Thị B",
      rating: 4,
      comment: "Sân sạch sẽ, giá cả hợp lý.",
      date: "2024-01-10",
    },
  ]

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % field.imageUrls.length)
  }

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + field.imageUrls.length) % field.imageUrls.length)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden animate-in slide-in-from-bottom-4 duration-300">
        <div className="relative">
          <img
            src={field.heroImage || "/placeholder.svg?height=200&width=800"}
            alt={field.name}
            className="w-full h-48 object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-colors shadow-lg"
          >
            <X className="w-5 h-5 text-slate-600" />
          </button>

          <div className="absolute top-4 left-4 flex gap-2">
            <button className="w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-colors shadow-lg">
              <Heart className="w-5 h-5 text-slate-600" />
            </button>
            <button className="w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-colors shadow-lg">
              <Share2 className="w-5 h-5 text-slate-600" />
            </button>
          </div>

          <div className="absolute bottom-4 left-4 text-white">
            <h2 className="text-2xl font-bold mb-1">{field.name}</h2>
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                <span>4.8 (24 đánh giá)</span>
              </div>
              <span className="px-2 py-1 bg-white/20 backdrop-blur-sm rounded-full">{field.type}</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col h-[calc(90vh-12rem)]">
          <div className="border-b border-slate-200 bg-slate-50">
            <div className="flex">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 flex items-center justify-center gap-2 py-4 px-6 font-medium transition-all duration-200 ${
                    activeTab === tab.id
                      ? "text-blue-600 border-b-2 border-blue-600 bg-white"
                      : "text-slate-600 hover:text-blue-600 hover:bg-white/50"
                  }`}
                >
                  {tab.icon}
                  <span className="hidden sm:inline">{tab.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-6">
            {activeTab === "info" && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <InfoCard
                    icon={<MapPin className="w-5 h-5 text-blue-600" />}
                    title="Địa chỉ"
                    content={field.location}
                  />
                  <InfoCard
                    icon={<Phone className="w-5 h-5 text-emerald-600" />}
                    title="Số điện thoại"
                    content={field.phone}
                    action={`tel:${field.phone}`}
                  />
                  <InfoCard
                    icon={<Clock className="w-5 h-5 text-orange-600" />}
                    title="Giờ hoạt động"
                    content={field.is24h ? "24/7" : `${field.opentime} - ${field.closetime}`}
                  />
                  <InfoCard
                    icon={<span className="text-purple-600">💰</span>}
                    title="Giá thuê"
                    content={`${new Intl.NumberFormat("vi-VN").format(field.price)} VNĐ/giờ`}
                  />
                </div>

                {field.website && (
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100">
                    <h3 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
                      <Globe className="w-5 h-5 text-blue-600" />
                      Website
                    </h3>
                    <a
                      href={field.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-700 underline flex items-center gap-1"
                    >
                      {field.website}
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                )}

                <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl p-6 border border-emerald-100">
                  <h3 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-emerald-600" />
                    Đặt sân online
                  </h3>
                  <p className="text-slate-600 mb-4">Đặt sân nhanh chóng và tiện lợi</p>
                  <button
                    onClick={() => navigate(field.bookingLink || `/san/${field.slug}/booking/${field.id}`)}
                    className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                  >
                    Xem chi tiết & Đặt sân
                  </button>
                </div>
              </div>
            )}

            {activeTab === "services" && (
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-slate-900 mb-4">Dịch vụ & Tiện ích</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {field.services.map((service, index) => (
                    <div
                      key={index}
                      className={`flex items-center gap-3 p-4 rounded-xl border transition-all duration-200  bg-emerald-50 border-emerald-200 text-emerald-700`}
                    >
                      <BadgeCheck className="w-5 h-5" />
                      <span className="font-medium">{service.name}</span>
                      <span className="ml-auto text-sm">✓ Có</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "images" && (
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-slate-900 mb-4">Hình ảnh sân</h3>

                <div className="relative">
                  <img
                    src={field.imageUrls[currentImageIndex] || "/placeholder.svg"}
                    alt={`${field.name} - Image ${currentImageIndex + 1}`}
                    className="w-full h-80 object-cover rounded-2xl"
                  />
                  <button
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-colors shadow-lg"
                  >
                    <ChevronLeft className="w-5 h-5 text-slate-600" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-colors shadow-lg"
                  >
                    <ChevronRight className="w-5 h-5 text-slate-600" />
                  </button>
                </div>

                <div className="grid grid-cols-4 gap-4">
                  {field.imageUrls.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`relative rounded-xl overflow-hidden transition-all duration-200 ${
                        currentImageIndex === index ? "ring-2 ring-blue-500" : "hover:opacity-80"
                      }`}
                    >
                      <img
                        src={image || "/placeholder.svg"}
                        alt={`Thumbnail ${index + 1}`}
                        className="w-full h-20 object-cover"
                      />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "reviews" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold text-slate-900">Đánh giá từ khách hàng</h3>
                  <div className="flex items-center gap-2">
                    <Star className="w-5 h-5 text-yellow-500 fill-current" />
                    <span className="font-semibold">4.8/5</span>
                    <span className="text-slate-500">(24 đánh giá)</span>
                  </div>
                </div>

                <div className="space-y-4">
                  {mockReviews.map((review) => (
                    <div key={review.id} className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                            {review.user.charAt(0)}
                          </div>
                          <span className="font-medium text-slate-900">{review.user}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${
                                i < review.rating ? "text-yellow-500 fill-current" : "text-slate-300"
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-slate-700 mb-2">{review.comment}</p>
                      <p className="text-sm text-slate-500">{review.date}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

const InfoCard = ({ icon, title, content, action }) => {
  const CardContent = (
    <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 hover:border-slate-300 transition-colors">
      <div className="flex items-center gap-3 mb-2">
        {icon}
        <h4 className="font-semibold text-slate-900">{title}</h4>
      </div>
      <p className="text-slate-700">{content}</p>
    </div>
  )

  return action ? (
    <a href={action} className="block">
      {CardContent}
    </a>
  ) : (
    CardContent
  )
}
