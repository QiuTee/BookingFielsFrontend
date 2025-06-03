import React, { useState  } from "react"
import { Eye, EyeOff, Calendar, Users, Settings, BarChart3 } from "lucide-react"
import { useAuth } from "../../../context/AuthContext"
import { useNotification } from "../../../context/NotificationContext"
import { useNavigate } from "react-router-dom"
import { getField } from "../../../api/submission"


export default function LoginOwner() {
  const [showPassword, setShowPassword] = useState(false)
  const { login } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const { showNotification } = useNotification()
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    identifier: "",
    password: "",
    rememberMe: false,
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const payLoad = {
        identifier : formData.identifier,
        password : formData.password
      }
      await login(payLoad);
      showNotification({type:"success" , message:"Đăng nhập thành công"})
      const field = await getField()
      console.log("field length" ,field.length , "field" , field , "slug", field[0].slug)
      if (field.length === 1  ) { 
        navigate(`/san/${field[0].slug}/owner`)
      }else if (field.length > 1 ){
        navigate("/owner/court-selection")
      }

    }catch(error){
      showNotification({type :"error" , message:"Đăng nhập thất bại. Vui lòng kiểm tra lại tài khoản hoặc mật khẩu."})
    }
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
    }, 2000)
  }

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-8 items-center">
        <div className="hidden lg:block space-y-8">
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-green-600 rounded-xl flex items-center justify-center">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">CourtManager</h1>
                <p className="text-gray-600">Hệ thống quản lý sân thể thao</p>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-gray-800">Quản lý sân chuyên nghiệp</h2>

            {[
              {
                icon: <Calendar className="w-5 h-5 text-blue-600" />,
                bg: "bg-blue-100",
                title: "Quản lý booking",
                desc: "Theo dõi và cập nhật trạng thái đặt sân",
              },
              {
                icon: <Users className="w-5 h-5 text-green-600" />,
                bg: "bg-green-100",
                title: "Quản lý khách hàng",
                desc: "Thông tin và lịch sử khách hàng",
              },
              {
                icon: <BarChart3 className="w-5 h-5 text-purple-600" />,
                bg: "bg-purple-100",
                title: "Báo cáo doanh thu",
                desc: "Thống kê và phân tích kinh doanh",
              },
              {
                icon: <Settings className="w-5 h-5 text-orange-600" />,
                bg: "bg-orange-100",
                title: "Cài đặt sân",
                desc: "Cấu hình giá và thời gian hoạt động",
              },
            ].map((item, i) => (
              <div key={i} className="flex items-center space-x-3">
                <div className={`w-10 h-10 ${item.bg} rounded-lg flex items-center justify-center`}>
                  {item.icon}
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">{item.title}</h3>
                  <p className="text-sm text-gray-600">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="w-full max-w-md mx-auto">
          <div className="bg-white rounded-2xl shadow-2xl border-0 overflow-hidden">
            <div className="px-6 pt-6 pb-6 text-center">
              <div className="mx-auto w-16 h-16 bg-green-600 rounded-2xl flex items-center justify-center mb-4">
                <Calendar className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Đăng nhập quản lý</h2>
              <p className="text-gray-600 mt-2">Truy cập hệ thống quản lý sân của bạn</p>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="px-6 space-y-4">
                <div className="space-y-2">
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email hoặc số điện thoại
                  </label>
                  <input
                    id="identifier"
                    type="identifier"
                    placeholder="manager@example.com"
                    value={formData.identifier}
                    onChange={(e) => handleInputChange("identifier", e.target.value)}
                    className="w-full h-11 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                    Mật khẩu
                  </label>
                  <div className="relative">
                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Nhập mật khẩu"
                      value={formData.password}
                      onChange={(e) => handleInputChange("password", e.target.value)}
                      className="w-full h-11 px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
                      required
                    />
                    <button
                      type="button"
                      className="absolute right-0 top-0 h-full px-3 py-2 text-gray-400 hover:text-gray-600 focus:outline-none"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <input
                      id="remember"
                      type="checkbox"
                      checked={formData.rememberMe}
                      onChange={(e) => handleInputChange("rememberMe", e.target.checked)}
                      className="w-4 h-4 text-green-600 bg-gray-100 border-gray-300 rounded focus:ring-green-500 focus:ring-2"
                    />
                    <label htmlFor="remember" className="text-sm text-gray-600">
                      Ghi nhớ đăng nhập
                    </label>
                  </div>
                  <button
                    type="button"
                    className="text-sm text-green-600 hover:text-green-700 focus:outline-none focus:underline"
                  >
                    Quên mật khẩu?
                  </button>
                </div>

                <div className="border border-blue-200 bg-blue-50 rounded-lg p-3">
                  <p className="text-sm text-blue-800">
                    <strong>Lưu ý:</strong> Chỉ người quản lý được cấp quyền mới có thể truy cập hệ thống này.
                  </p>
                </div>
              </div>

              <div className="px-6 pb-6 pt-2 space-y-4">
                <button
                  type="submit"
                  className="w-full h-11 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Đang đăng nhập...</span>
                    </div>
                  ) : (
                    "Đăng nhập"
                  )}
                </button>

                <div className="text-center text-sm text-gray-600">
                  Cần hỗ trợ?{" "}
                  <button
                    type="button"
                    className="text-green-600 hover:text-green-700 focus:outline-none focus:underline"
                  >
                    Liên hệ admin
                  </button>
                </div>
              </div>
            </form>
          </div>

          <div className="lg:hidden mt-8 text-center">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
                <Calendar className="w-4 h-4 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">CourtManager</span>
            </div>
            <p className="text-sm text-gray-600">Hệ thống quản lý sân thể thao chuyên nghiệp</p>
          </div>
        </div>
      </div>
    </div>
  )
}
