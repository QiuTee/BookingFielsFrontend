import { useParams, useNavigate } from "react-router-dom"
import { useState , useEffect } from "react"
import {
  MapPin,
  Facebook,
  Star,
  User,
  Calendar,
  Wifi,
  Car,
  Coffee,
  Shield,
  Award,
  Camera,
  Share2,
  Heart,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  Zap,
  MapPinIcon,
  X,
  Sparkles,
  TrendingUp,
  Users,
  Timer,
  PlayCircle,
  Verified,
  Clock3,
  LocateIcon as LocationIcon,
  PhoneIcon,
  ChevronDown,
  ChevronUp,
  Eye,
  Download,
  Bell,
  ThumbsUp,
  ExternalLink
} from "lucide-react"
import BottomNav from "../components/bottom_nav/BottomNav"
import { getFieldBySlug } from "../api/submission"
import  {useBooking} from "../context/BookingContext"
import VnvarLoading from "../components/loading/VnvarLoading"

function NotificationsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 pb-20">
      <div className="p-6">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="bg-gradient-to-br from-orange-500 to-red-500 p-3 rounded-2xl shadow-lg">
              <Bell className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Thông báo</h1>
          </div>

          <div className="space-y-4">
            {[
              {
                title: "Đặt sân thành công",
                message: "Bạn đã đặt sân Champions League lúc 19:00 ngày mai",
                time: "5 phút trước",
                type: "success",
              },
              {
                title: "Khuyến mãi đặc biệt",
                message: "Giảm 20% cho lần đặt sân tiếp theo",
                time: "1 giờ trước",
                type: "promotion",
              },
              {
                title: "Nhắc nhở",
                message: "Còn 2 giờ nữa đến giờ đá bóng của bạn",
                time: "2 giờ trước",
                type: "reminder",
              },
              {
                title: "Sân mới",
                message: "Sân Thể Thao Vinhomes vừa mở cửa gần bạn",
                time: "1 ngày trước",
                type: "info",
              },
              {
                title: "Đánh giá sân",
                message: "Hãy đánh giá trải nghiệm tại sân ABC",
                time: "2 ngày trước",
                type: "review",
              },
            ].map((notification, index) => (
              <div
                key={index}
                className="flex items-start gap-4 p-4 bg-gradient-to-r from-gray-50 to-white rounded-xl border border-gray-100 hover:shadow-md transition-all"
              >
                <div
                  className={`w-3 h-3 rounded-full mt-2 ${
                    notification.type === "success"
                      ? "bg-green-500"
                      : notification.type === "promotion"
                        ? "bg-purple-500"
                        : notification.type === "reminder"
                          ? "bg-yellow-500"
                          : notification.type === "info"
                            ? "bg-blue-500"
                            : "bg-gray-500"
                  }`}
                ></div>
                <div className="flex-1">
                  <h3 className="font-bold text-gray-900 mb-1">{notification.title}</h3>
                  <p className="text-gray-600 text-sm mb-2">{notification.message}</p>
                  <span className="text-xs text-gray-500">{notification.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function AccountPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 pb-20">
      <div className="p-6">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
              <User className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Tài khoản</h1>
              <p className="text-gray-600">Quản lý thông tin cá nhân</p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-6 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-xl">
                <h3 className="font-bold text-gray-900 mb-2">Thông tin cá nhân</h3>
                <p className="text-gray-600 text-sm">Cập nhật thông tin của bạn</p>
              </div>
              <div className="p-6 bg-gradient-to-br from-green-50 to-emerald-100 rounded-xl">
                <h3 className="font-bold text-gray-900 mb-2">Lịch sử đặt sân</h3>
                <p className="text-gray-600 text-sm">Xem các lần đặt sân trước đó</p>
              </div>
              <div className="p-6 bg-gradient-to-br from-purple-50 to-violet-100 rounded-xl">
                <h3 className="font-bold text-gray-900 mb-2">Ví điện tử</h3>
                <p className="text-gray-600 text-sm">Quản lý số dư và thanh toán</p>
              </div>
              <div className="p-6 bg-gradient-to-br from-orange-50 to-red-100 rounded-xl">
                <h3 className="font-bold text-gray-900 mb-2">Cài đặt</h3>
                <p className="text-gray-600 text-sm">Tùy chỉnh ứng dụng</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function FieldDetailPage() {
  const { fieldSlug } = useParams()
  const navigate = useNavigate()
  const [field , setField] = useState(null)
  const [selectedTab, setSelectedTab] = useState("overview")
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [showImageModal, setShowImageModal] = useState(false)
  const [isLiked, setIsLiked] = useState(false)
  const [showAllReviews, setShowAllReviews] = useState(false)
  const [showAllFeatures, setShowAllFeatures] = useState(false)
  const [bottomNavTab, setBottomNavTab] = useState("home")
  const [loading , setLoading] = useState(true)
  const {setBookingData} = useBooking()
  useEffect(() => {
    const getField = async () => { 
      setLoading(true)
      try { 
        const data = await getFieldBySlug(fieldSlug)
        setField(data)
        console.log("data" , data)
      }
      catch(error){
        console.error("Không thể lấy được field" , error)
        setField(null)
      }finally{
        setTimeout(() => setLoading(false) , 1000)
      }
    }
    getField()
  },[fieldSlug])

  if(loading) return <VnvarLoading duration={5000}/>
  const handleBookingClick = () => {
    if(!field) return 
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

  const handleBottomNavChange = (tab) => {
    setBottomNavTab(tab)

    switch (tab) {
      case "home":
        break
      case "booking":
        handleBookingClick()
        break
      case "notifications":
        break
      case "account":
        break
      default:
        break
    }
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

  const features = [
    { icon: Wifi, name: "WiFi miễn phí", color: "bg-blue-500" },
    { icon: Car, name: "Bãi đỗ xe", color: "bg-green-500" },
    { icon: Coffee, name: "Căng tin", color: "bg-orange-500" },
    { icon: Shield, name: "An ninh 24/7", color: "bg-red-500" },
    { icon: Camera, name: "Camera giám sát", color: "bg-purple-500" },
    { icon: Users, name: "Phòng thay đồ", color: "bg-indigo-500" },
    { icon: Zap, name: "Điện thoại khẩn cấp", color: "bg-yellow-500" },
    { icon: Award, name: "Sân chuẩn FIFA", color: "bg-pink-500" },
  ]

  if (bottomNavTab === "notifications") {
    return (
      <>
        <NotificationsPage />
        <BottomNav selectedTab={bottomNavTab} onSelectTab={handleBottomNavChange} notificationCount={5} />
      </>
    )
  }

  if (bottomNavTab === "account") {
    return (
      <>
        <AccountPage />
        <BottomNav selectedTab={bottomNavTab} onSelectTab={handleBottomNavChange} notificationCount={5} />
      </>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 pb-48">
      <div className="relative">
        <div className="relative w-full h-[70vh] overflow-hidden">
          {field.imageUrls?.length > 0 ? (
            <div className="relative w-full h-full">
              <img
                src={field.imageUrls[currentImageIndex] || "/placeholder.svg"}
                alt="Sân thể thao"
                className="w-full h-full object-cover"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-r from-black/20 via-transparent to-black/20" />

              {field.imageUrls.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/20 backdrop-blur-md hover:bg-black/40 text-white border border-white/20 h-12 w-12 rounded-lg transition-all duration-200 flex items-center justify-center"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/20 backdrop-blur-md hover:bg-black/40 text-white border border-white/20 h-12 w-12 rounded-lg transition-all duration-200 flex items-center justify-center"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>

                  <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2">
                    {field.imageUrls.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentImageIndex(index)}
                        className={`h-1.5 rounded-full transition-all duration-300 ${
                          index === currentImageIndex ? "bg-white w-8" : "bg-white/50 w-1.5 hover:bg-white/70"
                        }`}
                      />
                    ))}
                  </div>
                </>
              )}

              <div className="absolute top-6 right-6 flex gap-3">
                <button
                  onClick={() => setIsLiked(!isLiked)}
                  className="bg-black/20 backdrop-blur-md hover:bg-black/40 text-white border border-white/20 h-11 w-11 rounded-lg transition-all duration-200 flex items-center justify-center"
                >
                  <Heart className={`w-5 h-5 ${isLiked ? "fill-red-500 text-red-500" : ""}`} />
                </button>
                <button className="bg-black/20 backdrop-blur-md hover:bg-black/40 text-white border border-white/20 h-11 w-11 rounded-lg transition-all duration-200 flex items-center justify-center">
                  <Share2 className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setShowImageModal(true)}
                  className="bg-black/20 backdrop-blur-md hover:bg-black/40 text-white border border-white/20 h-11 w-11 rounded-lg transition-all duration-200 flex items-center justify-center"
                >
                  <Camera className="w-5 h-5" />
                </button>
              </div>

              <div className="absolute top-6 left-6 bg-black/20 backdrop-blur-md text-white px-4 py-2 rounded-full text-sm font-medium border border-white/20">
                <Eye className="w-4 h-4 inline mr-2" />
                1,234 lượt xem
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

        <div className="absolute bottom-0 left-0 right-0 p-6">
          <div className="flex items-end gap-6">
            <div className="relative">
              <div className="bg-white/95 backdrop-blur-md rounded-3xl p-2 shadow-2xl ring-1 ring-white/20">
                <img
                  src={field.logo || "/placeholder.svg?height=80&width=80"}
                  alt="Logo"
                  className="w-20 h-20 rounded-2xl object-cover"
                />
              </div>
              <div className="absolute -bottom-2 -right-2 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full p-1.5 shadow-lg">
                <Verified className="w-5 h-5 text-white" />
              </div>
            </div>

            <div className="flex-1 text-white">
              <div className="flex items-center gap-3 mb-2">
                <span className="bg-green-500/90 backdrop-blur-sm text-white border-0 px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1">
                  <CheckCircle className="w-3 h-3" />
                  Đang hoạt động
                </span>
              </div>

              <h1 className="text-3xl md:text-4xl font-bold mb-3 drop-shadow-lg leading-tight">{field.name}</h1>

              <div className="flex items-center gap-6 mb-4">
                <div className="flex items-center gap-2 bg-black/20 backdrop-blur-sm rounded-full px-4 py-2">
                  <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  <span className="font-bold text-lg">{getAverageRating()}</span>
                  <span className="text-white/80">({field.reviews?.length || 0})</span>
                </div>
                <div className="flex items-center gap-2 text-white/90">
                  <MapPin className="w-5 h-5" />
                  <span className="font-medium">{field.location?.split(",")[0]}</span>
                </div>
              </div>

              <div className="flex items-center gap-3 flex-wrap">
                <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-2.5 rounded-full font-bold text-lg shadow-lg">
                  {formatPrice(field.price)}/30 phút
                </div>
                <div className="bg-white/10 backdrop-blur-sm text-white px-4 py-2 rounded-full font-medium border border-white/20 flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  Sân chất lượng cao
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white/80 backdrop-blur-md shadow-lg z-40 border-b border-white/20">
        <div className="flex">
          {[
            { id: "overview", label: "Tổng quan", icon: MapPinIcon },
            { id: "gallery", label: "Thư viện", icon: Camera },
            { id: "reviews", label: "Đánh giá", icon: Star },
          ].map((tab) => (
            <button
              key={tab.id}
              className={`flex-1 py-4 px-4 font-semibold transition-all relative ${
                selectedTab === tab.id
                  ? "text-blue-600 bg-gradient-to-b from-blue-50/80 to-white/80"
                  : "text-gray-600 hover:text-gray-800 hover:bg-gray-50/50"
              }`}
              onClick={() => setSelectedTab(tab.id)}
            >
              <div className="flex items-center justify-center gap-2">
                <tab.icon className="w-4 h-4" />
                <span className="hidden sm:inline">{tab.label}</span>
              </div>
              {selectedTab === tab.id && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-t-full" />
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 mb-20">
        {selectedTab === "overview" && (
          <div className="p-6 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="group hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl shadow-lg">
                <div className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-4 rounded-2xl group-hover:scale-110 transition-transform shadow-lg">
                      <LocationIcon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-blue-600 mb-1">Địa chỉ</p>
                      <p className="font-bold text-gray-900 leading-tight">{field.location}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="group hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-green-50 to-emerald-100 rounded-2xl shadow-lg">
                <div className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="bg-gradient-to-br from-green-500 to-green-600 p-4 rounded-2xl group-hover:scale-110 transition-transform shadow-lg">
                      <Clock3 className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-green-600 mb-1">Giờ hoạt động</p>
                      <p className="font-bold text-gray-900">
                        {field.opentime} - {field.closetime}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="group hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-purple-50 to-violet-100 rounded-2xl shadow-lg">
                <div className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-4 rounded-2xl group-hover:scale-110 transition-transform shadow-lg">
                      <PhoneIcon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-purple-600 mb-1">Liên hệ</p>
                      <a
                        href={`tel:${field.phone}`}
                        className="font-bold text-purple-600 hover:text-purple-700 transition-colors"
                      >
                        {field.phone}
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              {field.faceBook && (
                <div className="group hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl shadow-lg overflow-hidden relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-white/10 via-transparent to-white/10"></div>
                  <div className="absolute top-0 right-0 w-20 h-20 bg-white/5 rounded-full translate-x-10 -translate-y-10"></div>

                  <div className="p-6 relative z-10">
                    <div className="flex items-center gap-4">
                      <div className="bg-white/20 backdrop-blur-sm p-4 rounded-2xl group-hover:scale-110 transition-transform shadow-lg border border-white/30">
                        <Facebook className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="text-sm font-semibold text-blue-100">Facebook Page</p>
                          <div className="bg-white/20 backdrop-blur-sm px-2 py-0.5 rounded-full">
                            <span className="text-xs font-bold text-white flex items-center gap-1">
                              <ThumbsUp className="w-3 h-3" />
                              Verified
                            </span>
                          </div>
                        </div>
                        <a
                          href={field.faceBook}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-bold text-white hover:text-blue-100 transition-colors flex items-center gap-2 group/link"
                        >
                          <span className="truncate">
                            {field.faceBook.replace("https://", "").replace("http://", "")}
                          </span>
                          <ExternalLink className="w-4 h-4 opacity-70 group-hover/link:opacity-100 transition-opacity" />
                        </a>
                        <p className="text-xs text-blue-200 mt-1 flex items-center gap-1">
                          <Sparkles className="w-3 h-3" />
                          Xem thêm hình ảnh & đánh giá
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-white/20 via-white/40 to-white/20"></div>
                </div>
              )}
            </div>

            <div className="border-0 shadow-xl bg-gradient-to-br from-white to-gray-50 rounded-2xl">
              <div className="p-8">
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                    <div className="bg-gradient-to-br from-yellow-400 to-orange-500 p-3 rounded-2xl shadow-lg">
                      <Sparkles className="w-6 h-6 text-white" />
                    </div>
                    Tiện ích cao cấp
                  </h3>
                  <span className="bg-gradient-to-r from-green-500 to-emerald-600 text-white border-0 px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" />
                    Đầy đủ tiện nghi
                  </span>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  {(showAllFeatures ? features : features.slice(0, 4)).map((feature, index) => (
                    <div
                      key={index}
                      className="group flex flex-col items-center text-center p-6 rounded-2xl bg-gradient-to-b from-white to-gray-50 hover:from-gray-50 hover:to-gray-100 transition-all duration-300 shadow-md hover:shadow-lg border border-gray-100"
                    >
                      <div
                        className={`${feature.color} p-4 rounded-2xl mb-4 group-hover:scale-110 transition-transform shadow-lg`}
                      >
                        <feature.icon className="w-6 h-6 text-white" />
                      </div>
                      <span className="font-bold text-gray-800 text-sm leading-tight">{feature.name}</span>
                    </div>
                  ))}
                </div>

                {features.length > 4 && (
                  <div className="text-center mt-6">
                    <button
                      onClick={() => setShowAllFeatures(!showAllFeatures)}
                      className="border-2 border-blue-200 hover:bg-blue-50 px-6 py-3 rounded-lg font-semibold text-blue-600 transition-all duration-200 flex items-center gap-2 mx-auto"
                    >
                      {showAllFeatures ? (
                        <>
                          <ChevronUp className="w-4 h-4" />
                          Thu gọn
                        </>
                      ) : (
                        <>
                          <ChevronDown className="w-4 h-4" />
                          Xem thêm ({features.length - 4} tiện ích)
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="border-0 shadow-xl bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 text-white relative overflow-hidden rounded-2xl">
              <div className="absolute inset-0 bg-gradient-to-r from-white/10 via-transparent to-white/10"></div>
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full translate-x-16 -translate-y-16"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full -translate-x-12 translate-y-12"></div>

              <div className="p-8 relative z-10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="bg-white/20 backdrop-blur-sm p-4 rounded-2xl">
                      <Timer className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold mb-2">Bảng giá thuê sân</h3>
                      <p className="text-white/80 font-medium">Giá ưu đãi cho tất cả khung giờ</p>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-4xl font-bold mb-1">{formatPrice(field.price)}</div>
                    <div className="text-white/80 font-semibold text-lg">mỗi 30 phút</div>
                    <span className="bg-white/20 backdrop-blur-sm text-white border border-white/30 mt-2 px-3 py-1 rounded-full text-sm font-semibold inline-flex items-center gap-1">
                      <TrendingUp className="w-3 h-3" />
                      Giá tốt nhất khu vực
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {field.services?.length > 0 && (
              <div className="border-0 shadow-xl bg-gradient-to-br from-white to-gray-50 rounded-2xl">
                <div className="p-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                    <div className="bg-gradient-to-br from-green-500 to-emerald-600 p-3 rounded-2xl shadow-lg">
                      <Award className="w-6 h-6 text-white" />
                    </div>
                    Dịch vụ đi kèm
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {field.services.map((service, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between p-5 bg-gradient-to-r from-white to-gray-50 rounded-2xl border border-gray-100 hover:shadow-md transition-all group"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-3 h-3 rounded-full bg-gradient-to-r from-green-400 to-emerald-500 group-hover:scale-125 transition-transform"></div>
                          <span className="font-bold text-gray-900">{service.name}</span>
                        </div>
                        {service.price > 0 ? (
                          <span className="bg-gradient-to-r from-blue-500 to-purple-600 text-white border-0 px-4 py-2 rounded-full font-bold text-sm">
                            {formatPrice(service.price)}
                          </span>
                        ) : (
                          <span className="bg-gradient-to-r from-green-500 to-emerald-600 text-white border-0 px-4 py-2 rounded-full font-bold text-sm">
                            Miễn phí
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {selectedTab === "gallery" && (
          <div className="p-6">
            <div className="border-0 shadow-xl bg-gradient-to-br from-white to-gray-50 rounded-2xl">
              <div className="p-8">
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                    <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-3 rounded-2xl shadow-lg">
                      <Camera className="w-6 h-6 text-white" />
                    </div>
                    Thư viện ảnh ({field.imageUrls.length})
                  </h3>
                  <button
                    onClick={() => setShowImageModal(true)}
                    className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-200 flex items-center gap-2"
                  >
                    <PlayCircle className="w-4 h-4" />
                    Xem slideshow
                  </button>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {field.imageUrls.map((url, i) => (
                    <div
                      key={i}
                      className="aspect-square rounded-2xl overflow-hidden bg-gray-100 border-2 border-gray-200 cursor-pointer group relative shadow-md hover:shadow-xl transition-all"
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
                          <div className="bg-white/90 backdrop-blur-sm rounded-full p-3 shadow-lg">
                            <Camera className="w-6 h-6 text-gray-700" />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="fixed bottom-36 left-6 right-6 z-40">
        <button
          onClick={handleBookingClick}
          className="w-full bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:from-blue-600 hover:via-blue-700 hover:to-blue-800 text-white font-bold py-4 px-6 rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-300 relative overflow-hidden group border-0 h-auto"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>

          <div className="relative z-10 flex items-center justify-between w-full">
            <div className="flex items-center gap-3">
              <div className="bg-white/20 p-2.5 rounded-xl">
                <Calendar className="w-5 h-5" />
              </div>
              <div className="text-left">
                <div className="text-lg font-bold">Đặt sân ngay</div>
                <div className="text-white/80 text-xs">Xác nhận tức thì</div>
              </div>
            </div>
            <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-xl font-bold">
              {formatPrice(field.price)}/30p
            </div>
          </div>
        </button>
      </div>

      {showImageModal && field.imageUrls?.length > 0 && (
        <div className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center">
          <div className="relative w-full h-full flex items-center justify-center p-4">
            <button
              onClick={() => setShowImageModal(false)}
              className="absolute top-6 right-6 bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white border border-white/20 h-12 w-12 z-10 rounded-lg transition-all duration-200 flex items-center justify-center"
            >
              <X className="w-6 h-6" />
            </button>

            <img
              src={field.imageUrls[currentImageIndex] || "/placeholder.svg"}
              alt={`Ảnh sân ${currentImageIndex + 1}`}
              className="max-w-full max-h-full object-contain rounded-2xl shadow-2xl"
            />

            {field.imageUrls.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-6 top-1/2 -translate-y-1/2 bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white border border-white/20 h-14 w-14 rounded-lg transition-all duration-200 flex items-center justify-center"
                >
                  <ChevronLeft className="w-8 h-8" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-6 top-1/2 -translate-y-1/2 bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white border border-white/20 h-14 w-14 rounded-lg transition-all duration-200 flex items-center justify-center"
                >
                  <ChevronRight className="w-8 h-8" />
                </button>
              </>
            )}

            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3">
              {field.imageUrls.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    index === currentImageIndex ? "bg-white w-8" : "bg-white/50 w-2 hover:bg-white/70"
                  }`}
                />
              ))}
            </div>

            <div className="absolute top-6 left-6 flex gap-3">
              <div className="bg-black/50 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-medium border border-white/20">
                {currentImageIndex + 1} / {field.imageUrls.length}
              </div>
              <button className="bg-black/50 backdrop-blur-sm text-white hover:bg-black/70 border border-white/20 h-10 px-4 rounded-full transition-all duration-200 flex items-center gap-2 text-sm font-medium">
                <Download className="w-4 h-4" />
                Tải xuống
              </button>
            </div>
          </div>
        </div>
      )}
      <BottomNav selectedTab={bottomNavTab} onSelectTab={handleBottomNavChange} notificationCount={5} />
    </div>
  )
}