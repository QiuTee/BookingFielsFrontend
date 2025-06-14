import { useParams, useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"
import { MapPin, Clock, Phone, Star, User, Calendar, Wifi, Car, Coffee, Shield, Award, Camera, Share2, Heart, ChevronLeft, ChevronRight, CheckCircle, MessageCircle, ArrowRight, Zap, MapPinIcon, PhoneCall, Mail, Globe, Instagram, Facebook, Youtube, ExternalLink, X, Sparkles, TrendingUp, Users, Timer, BadgeCheck, PlayCircle } from 'lucide-react'
import VnvarLoading from "../components/loading/VnvarLoading"
import { useBooking } from "../context/BookingContext"
import BottomNav from "../components/bottom_nav/BottomNav"
import AccountPage from "../features/account/AccountPage"
import { getFieldBySlug } from "../api/submission"

export default function FieldDetailClientPage() {
  const { fieldSlug } = useParams()
  const navigate = useNavigate()
  const { setBookingData } = useBooking()

  const [field, setField] = useState(null)
  const [selectedTab, setSelectedTab] = useState("home")
  const [loading, setLoading] = useState(true)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [showImageModal, setShowImageModal] = useState(false)
  const [isLiked, setIsLiked] = useState(false)
  const [showAllReviews, setShowAllReviews] = useState(false)

  useEffect(() => {
    const fetchField = async () => {
      setLoading(true)
      try {
        const data = await getFieldBySlug(fieldSlug)
        setField(data)
      } catch (error) {
        console.error("Không thể tải sân:", error)
        setField(null)
      } finally {
        setTimeout(() => setLoading(false), 1000)
      }
    }

    fetchField()
  }, [fieldSlug])

  const handleBookingClick = () => {
    if (!field) return
    setBookingData((prev) => ({
      ...prev,
      selectionField: field.name,
      fieldId: field.id,
      location: field.location,
      phone: field.phone,
      slug: fieldSlug,
      price: field.price,
    }))
    navigate(`/san/${fieldSlug}/booking/${field.id}`)
  }

  const nextImage = () => {
    if (field?.imageUrls?.length > 0) {
      setCurrentImageIndex((prev) => (prev + 1) % field.imageUrls.length)
    }
  }

  const prevImage = () => {
    if (field?.imageUrls?.length > 0) {
      setCurrentImageIndex((prev) => (prev - 1 + field.imageUrls.length) % field.imageUrls.length)
    }
  }

  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price)
  }

  const getAverageRating = () => {
    if (!field?.reviews?.length) return 0
    const total = field.reviews.reduce((sum, review) => sum + review.rating, 0)
    return (total / field.reviews.length).toFixed(1)
  }

  if (loading) return <VnvarLoading duration={5000} />
  if (!field) return <div className="text-center py-10 text-white">Đang tải sân...</div>

  if (selectedTab === "notifications") {
    return (
      <div className="flex flex-col min-h-screen">
        <div className="p-4">Đây là phần Thông báo</div>
        <BottomNav selectedTab={selectedTab} onSelectTab={setSelectedTab} />
      </div>
    )
  }

  if (selectedTab === "account") {
    return (
      <div className="flex flex-col min-h-screen">
        <AccountPage />
        <BottomNav selectedTab={selectedTab} onSelectTab={setSelectedTab} />
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Enhanced Hero Section */}
      <div className="relative">
        <div className="relative w-full h-80 md:h-96 overflow-hidden">
          {field.imageUrls?.length > 0 ? (
            <div className="relative w-full h-full">
              <img
                src={field.imageUrls[currentImageIndex] || field.heroImage}
                alt="Sân thể thao"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

              {/* Image Navigation */}
              {field.imageUrls.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/30 backdrop-blur-sm hover:bg-black/50 text-white p-3 rounded-full transition-all"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/30 backdrop-blur-sm hover:bg-black/50 text-white p-3 rounded-full transition-all"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>

                  {/* Image Indicators */}
                  <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
                    {field.imageUrls.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentImageIndex(index)}
                        className={`w-2.5 h-2.5 rounded-full transition-all ${
                          index === currentImageIndex ? "bg-white scale-125" : "bg-white/60"
                        }`}
                      />
                    ))}
                  </div>
                </>
              )}

              {/* Action Buttons */}
              <div className="absolute top-4 right-4 flex gap-2">
                <button
                  onClick={() => setIsLiked(!isLiked)}
                  className="bg-black/30 backdrop-blur-sm hover:bg-black/50 text-white p-2.5 rounded-full transition-all"
                >
                  <Heart className={`w-5 h-5 ${isLiked ? "fill-red-500 text-red-500" : ""}`} />
                </button>
                <button className="bg-black/30 backdrop-blur-sm hover:bg-black/50 text-white p-2.5 rounded-full transition-all">
                  <Share2 className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setShowImageModal(true)}
                  className="bg-black/30 backdrop-blur-sm hover:bg-black/50 text-white p-2.5 rounded-full transition-all"
                >
                  <Camera className="w-5 h-5" />
                </button>
              </div>
            </div>
          ) : (
            <img
              src={field.heroImage || "/placeholder.svg?height=400&width=800"}
              alt="Sân thể thao"
              className="w-full h-full object-cover"
            />
          )}
        </div>

        {/* Enhanced Field Info Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <div className="flex items-end gap-4">
            <div className="relative">
              <div className="bg-white rounded-2xl p-1.5 shadow-2xl ring-4 ring-white/20">
                <img
                  src={field.logo || "/placeholder.svg?height=80&width=80"}
                  alt="Logo"
                  className="w-20 h-20 rounded-xl object-cover"
                />
              </div>
              <div className="absolute -bottom-1 -right-1 bg-green-500 rounded-full p-1">
                <BadgeCheck className="w-4 h-4 text-white" />
              </div>
            </div>
            <div className="flex-1 text-white">
              <h1 className="text-2xl md:text-3xl font-bold mb-2 drop-shadow-lg">{field.name}</h1>
              <div className="flex items-center gap-4 mb-3">
                <div className="flex items-center gap-1 bg-black/20 backdrop-blur-sm rounded-full px-3 py-1">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span className="font-semibold text-sm">{getAverageRating()}</span>
                  <span className="text-white/80 text-sm">({field.reviews?.length || 0})</span>
                </div>
                <div className="flex items-center gap-1 text-white/90">
                  <MapPin className="w-4 h-4" />
                  <span className="text-sm font-medium">{field.location?.split(",")[0]}</span>
                </div>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <div className="bg-green-500/90 backdrop-blur-sm text-white px-3 py-1.5 rounded-full text-sm font-medium flex items-center gap-1">
                  <CheckCircle className="w-3 h-3" />
                  Đang hoạt động
                </div>
                <div className="bg-blue-500/90 backdrop-blur-sm text-white px-3 py-1.5 rounded-full text-sm font-medium">
                  {formatPrice(field.price)}/30 phút
                </div>
                <div className="bg-purple-500/90 backdrop-blur-sm text-white px-3 py-1.5 rounded-full text-sm font-medium flex items-center gap-1">
                  <Users className="w-3 h-3" />
                  Sân chất lượng cao
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Tab Navigation */}
      <div className="bg-white shadow-lg sticky top-0 z-10 border-b border-gray-100">
        <div className="flex">
          <button
            className={`flex-1 py-4 px-6 font-semibold transition-all relative ${
              selectedTab === "info"
                ? "text-blue-600 bg-gradient-to-b from-blue-50 to-white"
                : "text-gray-600 hover:text-gray-800 hover:bg-gray-50"
            }`}
            onClick={() => setSelectedTab("info")}
          >
            <div className="flex items-center justify-center gap-2">
              <MapPinIcon className="w-4 h-4" />
              <span>Thông tin sân</span>
            </div>
            {selectedTab === "info" && (
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-t-full" />
            )}
          </button>
          <button
            className={`flex-1 py-4 px-6 font-semibold transition-all relative ${
              selectedTab === "services"
                ? "text-blue-600 bg-gradient-to-b from-blue-50 to-white"
                : "text-gray-600 hover:text-gray-800 hover:bg-gray-50"
            }`}
            onClick={() => setSelectedTab("services")}
          >
            <div className="flex items-center justify-center gap-2">
              <Award className="w-4 h-4" />
              <span>Dịch vụ & Đánh giá</span>
            </div>
            {selectedTab === "services" && (
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-t-full" />
            )}
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 pb-20">
        {(selectedTab === "info" || selectedTab === "home") && (
          <div className="p-6 space-y-8">
            {/* Enhanced Quick Info Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white rounded-2xl p-5 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 group">
                <div className="flex items-center gap-4">
                  <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-3 rounded-xl group-hover:scale-110 transition-transform">
                    <MapPin className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500 mb-1">Địa chỉ</p>
                    <p className="font-semibold text-gray-900 leading-tight">{field.location}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-5 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 group">
                <div className="flex items-center gap-4">
                  <div className="bg-gradient-to-br from-green-500 to-green-600 p-3 rounded-xl group-hover:scale-110 transition-transform">
                    <Clock className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500 mb-1">Giờ hoạt động</p>
                    <p className="font-semibold text-gray-900">
                      {field.opentime} - {field.closetime}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-5 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 group">
                <div className="flex items-center gap-4">
                  <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-3 rounded-xl group-hover:scale-110 transition-transform">
                    <Phone className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500 mb-1">Liên hệ</p>
                    <a
                      href={`tel:${field.phone}`}
                      className="font-semibold text-purple-600 hover:text-purple-700 transition-colors"
                    >
                      {field.phone}
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Enhanced Features */}
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
              <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <div className="bg-gradient-to-br from-yellow-400 to-orange-500 p-2 rounded-xl">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                Tiện ích nổi bật
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="flex flex-col items-center text-center p-4 rounded-xl bg-gradient-to-b from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 transition-all group">
                  <div className="bg-blue-500 p-3 rounded-full mb-3 group-hover:scale-110 transition-transform">
                    <Wifi className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-sm font-semibold text-gray-700">WiFi miễn phí</span>
                </div>
                <div className="flex flex-col items-center text-center p-4 rounded-xl bg-gradient-to-b from-green-50 to-green-100 hover:from-green-100 hover:to-green-200 transition-all group">
                  <div className="bg-green-500 p-3 rounded-full mb-3 group-hover:scale-110 transition-transform">
                    <Car className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-sm font-semibold text-gray-700">Bãi đỗ xe</span>
                </div>
                <div className="flex flex-col items-center text-center p-4 rounded-xl bg-gradient-to-b from-orange-50 to-orange-100 hover:from-orange-100 hover:to-orange-200 transition-all group">
                  <div className="bg-orange-500 p-3 rounded-full mb-3 group-hover:scale-110 transition-transform">
                    <Coffee className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-sm font-semibold text-gray-700">Căng tin</span>
                </div>
                <div className="flex flex-col items-center text-center p-4 rounded-xl bg-gradient-to-b from-red-50 to-red-100 hover:from-red-100 hover:to-red-200 transition-all group">
                  <div className="bg-red-500 p-3 rounded-full mb-3 group-hover:scale-110 transition-transform">
                    <Shield className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-sm font-semibold text-gray-700">An ninh 24/7</span>
                </div>
              </div>
            </div>

            {/* Premium Pricing Section */}
            {/* Simplified Premium Pricing */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 relative overflow-hidden">
              {/* Subtle accent */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-purple-500"></div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-3 rounded-xl">
                    <Timer className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">Giá thuê sân</h3>
                    <p className="text-gray-600 text-sm">Áp dụng tất cả khung giờ</p>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    {formatPrice(field.price)}
                  </div>
                  <div className="text-gray-500 font-medium">mỗi 30 phút</div>
                </div>
              </div>
              
            </div>

            {/* Enhanced Gallery */}
            {field.imageUrls?.length > 0 && (
              <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-gray-900 flex items-center gap-3">
                    <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-2 rounded-xl">
                      <Camera className="w-6 h-6 text-white" />
                    </div>
                    Thư viện ảnh ({field.imageUrls.length})
                  </h3>
                  <button
                    onClick={() => setShowImageModal(true)}
                    className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold transition-colors group"
                  >
                    <PlayCircle className="w-5 h-5 group-hover:scale-110 transition-transform" />
                    Xem slideshow
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {field.imageUrls.slice(0, 8).map((url, i) => (
                    <div
                      key={i}
                      className="aspect-square rounded-xl overflow-hidden bg-gray-100 border-2 border-gray-200 cursor-pointer group relative"
                      onClick={() => {
                        setCurrentImageIndex(i)
                        setShowImageModal(true)
                      }}
                    >
                      <img
                        src={url || "/placeholder.svg?height=200&width=200"}
                        alt={`Ảnh sân ${i + 1}`}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                          <div className="bg-white/90 backdrop-blur-sm rounded-full p-2">
                            <Camera className="w-5 h-5 text-gray-700" />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {selectedTab === "services" && (
          <div className="p-6 space-y-8">
            {/* Enhanced Services */}
            {field.services?.length > 0 && (
              <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
                <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                  <div className="bg-gradient-to-br from-yellow-400 to-orange-500 p-2 rounded-xl">
                    <Award className="w-6 h-6 text-white" />
                  </div>
                  Dịch vụ có sẵn
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {field.services.map((service, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-4 p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl hover:from-blue-50 hover:to-purple-50 transition-all group"
                    >
                      <div className="w-3 h-3 rounded-full bg-gradient-to-r from-green-400 to-green-500 group-hover:scale-125 transition-transform"></div>
                      <span className="font-semibold text-gray-900 flex-1">{service.name}</span>
                      {service.price && (
                        <span className="text-blue-600 font-bold bg-blue-50 px-3 py-1 rounded-full text-sm">
                          {formatPrice(service.price)}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Enhanced Reviews Summary */}
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-xl font-bold text-gray-900 flex items-center gap-3">
                  <div className="bg-gradient-to-br from-yellow-400 to-orange-500 p-2 rounded-xl">
                    <Star className="w-6 h-6 text-white" />
                  </div>
                  Đánh giá khách hàng
                </h3>
                <div className="text-right">
                  <div className="text-3xl font-bold bg-gradient-to-r from-yellow-500 to-orange-500 bg-clip-text text-transparent">
                    {getAverageRating()}
                  </div>
                  <div className="text-sm text-gray-500 font-medium">{field.reviews?.length || 0} đánh giá</div>
                </div>
              </div>

              {/* Enhanced Rating Distribution */}
              <div className="space-y-4 mb-8">
                {[5, 4, 3, 2, 1].map((rating) => {
                  const count = field.reviews?.filter((r) => r.rating === rating).length || 0
                  const percentage = field.reviews?.length ? (count / field.reviews.length) * 100 : 0
                  return (
                    <div key={rating} className="flex items-center gap-4">
                      <div className="flex items-center gap-1 w-16">
                        <span className="text-sm font-medium">{rating}</span>
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      </div>
                      <div className="flex-1 bg-gray-200 rounded-full h-3 overflow-hidden">
                        <div
                          className="bg-gradient-to-r from-yellow-400 to-orange-400 h-3 rounded-full transition-all duration-500 ease-out"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                      <span className="text-sm text-gray-500 font-medium w-8">{count}</span>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Enhanced Reviews */}
            {field.reviews?.length > 0 && (
              <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-gray-900">Nhận xét từ khách hàng</h3>
                  {field.reviews.length > 3 && (
                    <button
                      onClick={() => setShowAllReviews(!showAllReviews)}
                      className="text-blue-600 hover:text-blue-700 font-semibold transition-colors"
                    >
                      {showAllReviews ? "Thu gọn" : `Xem tất cả (${field.reviews.length})`}
                    </button>
                  )}
                </div>
                <div className="space-y-6">
                  {(showAllReviews ? field.reviews : field.reviews.slice(0, 3)).map((review, i) => (
                    <div key={i} className="border-b border-gray-100 last:border-0 pb-6 last:pb-0">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                          <User className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-3">
                            <h4 className="font-bold text-gray-900">Khách hàng {i + 1}</h4>
                            <div className="flex items-center gap-1">
                              {Array.from({ length: review.rating }).map((_, j) => (
                                <Star key={j} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                              ))}
                            </div>
                          </div>
                          <p className="text-gray-600 leading-relaxed mb-3">{review.comment}</p>
                          <div className="flex items-center gap-4 text-xs text-gray-500">
                            <span className="font-medium">2 ngày trước</span>
                            <button className="flex items-center gap-1 hover:text-gray-700 transition-colors">
                              <MessageCircle className="w-3 h-3" />
                              Trả lời
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Enhanced Contact Info */}
            <div className="bg-gradient-to-br from-green-500 via-blue-600 to-purple-700 rounded-2xl p-8 text-white relative overflow-hidden">
              {/* Background Pattern */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white rounded-full translate-x-16 -translate-y-16"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-white rounded-full -translate-x-12 translate-y-12"></div>
              </div>

              <div className="relative z-10">
                <h3 className="text-2xl font-bold mb-6 text-center">Liên hệ với chúng tôi</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <a
                      href={`tel:${field.phone}`}
                      className="flex items-center gap-4 p-4 bg-white/10 backdrop-blur-md rounded-xl hover:bg-white/20 transition-all group"
                    >
                      <div className="bg-white/20 p-3 rounded-full group-hover:scale-110 transition-transform">
                        <PhoneCall className="w-6 h-6" />
                      </div>
                      <div>
                        <p className="text-sm text-white/80 font-medium">Điện thoại</p>
                        <p className="font-bold text-lg">{field.phone}</p>
                      </div>
                    </a>
                    <div className="flex items-center gap-4 p-4 bg-white/10 backdrop-blur-md rounded-xl">
                      <div className="bg-white/20 p-3 rounded-full">
                        <Mail className="w-6 h-6" />
                      </div>
                      <div>
                        <p className="text-sm text-white/80 font-medium">Email</p>
                        <p className="font-bold">contact@{fieldSlug}.com</p>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex gap-3">
                      <button className="flex-1 bg-white/10 backdrop-blur-md hover:bg-white/20 p-4 rounded-xl transition-all group">
                        <Facebook className="w-6 h-6 mx-auto group-hover:scale-110 transition-transform" />
                      </button>
                      <button className="flex-1 bg-white/10 backdrop-blur-md hover:bg-white/20 p-4 rounded-xl transition-all group">
                        <Instagram className="w-6 h-6 mx-auto group-hover:scale-110 transition-transform" />
                      </button>
                      <button className="flex-1 bg-white/10 backdrop-blur-md hover:bg-white/20 p-4 rounded-xl transition-all group">
                        <Youtube className="w-6 h-6 mx-auto group-hover:scale-110 transition-transform" />
                      </button>
                    </div>
                    <button className="w-full flex items-center justify-center gap-3 p-4 bg-white/10 backdrop-blur-md hover:bg-white/20 rounded-xl transition-all group">
                      <Globe className="w-6 h-6 group-hover:scale-110 transition-transform" />
                      <span className="font-semibold">Website</span>
                      <ExternalLink className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Enhanced Floating Booking Button */}
      <div className="fixed bottom-20 left-4 right-4 z-20">
        <button
          onClick={handleBookingClick}
          className="w-full bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 hover:from-blue-700 hover:via-purple-700 hover:to-indigo-800 text-white font-bold py-5 px-8 rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-300 flex items-center justify-center gap-4 relative overflow-hidden group"
        >
          {/* Animated Background */}
          <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>

          <div className="relative z-10 flex items-center gap-4">
            <div className="bg-white/20 p-2 rounded-full">
              <Calendar className="w-6 h-6" />
            </div>
            <span className="text-lg">Đặt lịch ngay</span>
            <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full font-bold">
              {formatPrice(field.price)}/30p
            </div>
          </div>
        </button>
      </div>

      {/* Enhanced Image Modal */}
      {showImageModal && field.imageUrls?.length > 0 && (
        <div className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center">
          <div className="relative w-full h-full flex items-center justify-center p-4">
            <button
              onClick={() => setShowImageModal(false)}
              className="absolute top-6 right-6 bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white p-3 rounded-full z-10 transition-all"
            >
              <X className="w-6 h-6" />
            </button>

            <img
              src={field.imageUrls[currentImageIndex] || "/placeholder.svg"}
              alt={`Ảnh sân ${currentImageIndex + 1}`}
              className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
            />

            {field.imageUrls.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-6 top-1/2 -translate-y-1/2 bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white p-4 rounded-full transition-all"
                >
                  <ChevronLeft className="w-8 h-8" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-6 top-1/2 -translate-y-1/2 bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white p-4 rounded-full transition-all"
                >
                  <ChevronRight className="w-8 h-8" />
                </button>
              </>
            )}

            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3">
              {field.imageUrls.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`w-4 h-4 rounded-full transition-all ${
                    index === currentImageIndex ? "bg-white scale-125" : "bg-white/50"
                  }`}
                />
              ))}
            </div>

            {/* Image Counter */}
            <div className="absolute top-6 left-6 bg-black/50 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-medium">
              {currentImageIndex + 1} / {field.imageUrls.length}
            </div>
          </div>
        </div>
      )}

      <BottomNav selectedTab={selectedTab} onSelectTab={setSelectedTab} />
    </div>
  )
}