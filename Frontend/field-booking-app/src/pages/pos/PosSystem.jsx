import { useState } from "react"
import {
  Coffee,
  Utensils,
  IceCream,
  Pizza,
  Plus,
  Minus,
  ShoppingCart,
  CreditCard,
  Clock,
  MapPin,
  Search,
  Trash2,
  Users,
  Calendar,
  Home,
} from "lucide-react"

import PosBookingSystem from "./PosBookingSystem"




export default function PosSystem() {
  const [selectedTable, setSelectedTable] = useState("A1")
  const [cart, setCart] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [activeCategory, setActiveCategory] = useState("all")
  const [currentView, setCurrentView] = useState("pos")

  const tables = [
    { id: "A1", name: "Sân A1", status: "occupied", customers: 4 },
    { id: "A2", name: "Sân A2", status: "available", customers: 0 },
    { id: "B1", name: "Sân B1", status: "reserved", customers: 6 },
    { id: "B2", name: "Sân B2", status: "available", customers: 0 },
    { id: "C1", name: "Sân C1", status: "occupied", customers: 2 },
    { id: "C2", name: "Sân C2", status: "available", customers: 0 },
  ]

  const menuItems= [
    {
      id: "1",
      name: "Cà phê đen",
      price: 25000,
      category: "drinks",
      image: "/placeholder.svg?height=100&width=100",
      description: "Cà phê đen truyền thống",
      available: true,
    },
    {
      id: "2",
      name: "Cà phê sữa",
      price: 30000,
      category: "drinks",
      image: "/placeholder.svg?height=100&width=100",
      description: "Cà phê sữa đá thơm ngon",
      available: true,
    },
    {
      id: "3",
      name: "Nước cam tươi",
      price: 35000,
      category: "drinks",
      image: "/placeholder.svg?height=100&width=100",
      description: "Nước cam tươi vắt 100%",
      available: true,
    },
    {
      id: "4",
      name: "Trà đá",
      price: 15000,
      category: "drinks",
      image: "/placeholder.svg?height=100&width=100",
      description: "Trà đá mát lạnh",
      available: true,
    },
    {
      id: "5",
      name: "Bánh mì thịt nướng",
      price: 45000,
      category: "food",
      image: "/placeholder.svg?height=100&width=100",
      description: "Bánh mì thịt nướng đặc biệt",
      available: true,
    },
    {
      id: "6",
      name: "Cơm tấm sườn",
      price: 65000,
      category: "food",
      image: "/placeholder.svg?height=100&width=100",
      description: "Cơm tấm sườn nướng truyền thống",
      available: true,
    },
    {
      id: "7",
      name: "Phở bò",
      price: 55000,
      category: "food",
      image: "/placeholder.svg?height=100&width=100",
      description: "Phở bò tái chín đậm đà",
      available: true,
    },
    {
      id: "8",
      name: "Gỏi cuốn tôm thịt",
      price: 40000,
      category: "food",
      image: "/placeholder.svg?height=100&width=100",
      description: "Gỏi cuốn tôm thịt tươi ngon",
      available: true,
    },
    {
      id: "9",
      name: "Kem vanilla",
      price: 25000,
      category: "dessert",
      image: "/placeholder.svg?height=100&width=100",
      description: "Kem vanilla mát lạnh",
      available: true,
    },
    {
      id: "10",
      name: "Bánh flan",
      price: 20000,
      category: "dessert",
      image: "/placeholder.svg?height=100&width=100",
      description: "Bánh flan caramel thơm ngon",
      available: true,
    },
  ]

  const categories = [
    { id: "all", name: "Tất cả", icon: Utensils },
    { id: "drinks", name: "Thức uống", icon: Coffee },
    { id: "food", name: "Đồ ăn", icon: Pizza },
    { id: "dessert", name: "Tráng miệng", icon: IceCream },
  ]

  const filteredItems = menuItems.filter((item) => {
    const matchesCategory = activeCategory === "all" || item.category === activeCategory
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesCategory && matchesSearch && item.available
  })

  const addToCart = (item) => {
    setCart((prev) => {
      const existing = prev.find((cartItem) => cartItem.id === item.id)
      if (existing) {
        return prev.map((cartItem) =>
          cartItem.id === item.id ? { ...cartItem, quantity: cartItem.quantity + 1 } : cartItem,
        )
      }
      return [...prev, { ...item, quantity: 1 }]
    })
  }

  const updateQuantity = (id, change) => {
    setCart((prev) => {
      return prev
        .map((item) => {
          if (item.id === id) {
            const newQuantity = item.quantity + change
            return newQuantity > 0 ? { ...item, quantity: newQuantity } : item
          }
          return item
        })
        .filter((item) => item.quantity > 0)
    })
  }

  const removeFromCart = (id) => {
    setCart((prev) => prev.filter((item) => item.id !== id))
  }

  const getTotalAmount = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0)
  }

  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price)
  }

  const getTableStatusColor = (status) => {
    switch (status) {
      case "available":
        return "bg-green-500"
      case "occupied":
        return "bg-red-500"
      case "reserved":
        return "bg-yellow-500"
      default:
        return "bg-gray-500"
    }
  }

  const getTableStatusText = (status) => {
    switch (status) {
      case "available":
        return "Trống"
      case "occupied":
        return "Đang sử dụng"
      case "reserved":
        return "Đã đặt"
      default:
        return "Không xác định"
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <MapPin className="h-5 w-5 text-blue-600" />
              <span className="font-semibold text-gray-900">POS Quản lý Sân</span>
            </div>

            <div className="flex items-center space-x-1 bg-gray-100 rounded-lg p-1">
              <button
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center space-x-2 ${
                  currentView === "pos" ? "bg-white text-gray-900 shadow-sm" : "text-gray-600 hover:text-gray-900"
                }`}
                onClick={() => setCurrentView("pos")}
              >
                <Home className="h-4 w-4" />
                <span>POS</span>
              </button>
              <button
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center space-x-2 ${
                  currentView === "booking" ? "bg-white text-gray-900 shadow-sm" : "text-gray-600 hover:text-gray-900"
                }`}
                onClick={() => setCurrentView("booking")}
              >
                <Calendar className="h-4 w-4" />
                <span>Đặt sân</span>
              </button>
            </div>

            {currentView === "pos" && (
              <span className="bg-blue-50 text-blue-700 border border-blue-200 px-2 py-1 rounded-md text-sm">
                {selectedTable}
              </span>
            )}
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Clock className="h-4 w-4" />
            <span>{new Date().toLocaleTimeString("vi-VN")}</span>
          </div>
        </div>
      </div>

      {currentView === "pos" ? (
        <div className="flex h-[calc(100vh-80px)]">
        
          <div className="w-80 bg-white border-r border-gray-200 p-4">
            <h3 className="font-semibold text-gray-900 mb-4">Danh sách sân</h3>
            <div className="grid grid-cols-2 gap-3">
              {tables.map((table) => (
                <div
                  key={table.id}
                  className={`bg-white border border-gray-200 rounded-lg shadow-sm cursor-pointer transition-all hover:shadow-md ${
                    selectedTable === table.id ? "ring-2 ring-blue-500" : ""
                  }`}
                  onClick={() => setSelectedTable(table.id)}
                >
                  <div className="p-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-sm">{table.name}</span>
                      <div className={`w-3 h-3 rounded-full ${getTableStatusColor(table.status)}`} />
                    </div>
                    <div className="text-xs text-gray-600">
                      <div>{getTableStatusText(table.status)}</div>
                      {table.customers > 0 && (
                        <div className="flex items-center mt-1">
                          <Users className="h-3 w-3 mr-1" />
                          {table.customers} người
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex-1 p-6">
            <div className="mb-6">
              <div className="flex items-center space-x-4 mb-4">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    placeholder="Tìm kiếm món ăn, thức uống..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-4 gap-1 bg-gray-100 p-1 rounded-lg">
                {categories.map((category) => {
                  const Icon = category.icon
                  return (
                    <button
                      key={category.id}
                      className={`px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center justify-center space-x-2 ${
                        activeCategory === category.id
                          ? "bg-white text-gray-900 shadow-sm"
                          : "text-gray-600 hover:text-gray-900"
                      }`}
                      onClick={() => setActiveCategory(category.id)}
                    >
                      <Icon className="h-4 w-4" />
                      <span>{category.name}</span>
                    </button>
                  )
                })}
              </div>
            </div>

            <div className="h-[calc(100vh-240px)] overflow-y-auto">
              <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filteredItems.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white border border-gray-200 rounded-lg shadow-sm cursor-pointer hover:shadow-lg transition-shadow"
                  >
                    <div className="p-4">
                      <img
                        src={item.image || "/placeholder.svg"}
                        alt={item.name}
                        className="w-full h-24 object-cover rounded-md mb-3"
                      />
                      <h4 className="font-medium text-sm mb-1">{item.name}</h4>
                      <p className="text-xs text-gray-600 mb-2 line-clamp-2">{item.description}</p>
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-black">{formatPrice(item.price)}</span>
                        <button
                          onClick={() => addToCart(item)}
                          className="h-8 w-8 bg-black hover:bg-black text-white rounded-md flex items-center justify-center transition-colors"
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="w-96 bg-white border-l border-gray-200 p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900">Đơn hàng</h3>
              <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-xs flex items-center space-x-1">
                <ShoppingCart className="h-3 w-3" />
                <span>{cart.reduce((total, item) => total + item.quantity, 0)}</span>
              </span>
            </div>

            <div className="h-[calc(100vh-300px)] overflow-y-auto mb-4">
              {cart.length === 0 ? (
                <div className="text-center text-gray-500 py-8">
                  <ShoppingCart className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                  <p>Chưa có món nào được chọn</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {cart.map((item) => (
                    <div key={item.id} className="bg-white border border-gray-200 rounded-lg shadow-sm">
                      <div className="p-3">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <h5 className="font-medium text-sm">{item.name}</h5>
                            <p className="text-xs text-gray-600">{formatPrice(item.price)}</p>
                          </div>
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="h-6 w-6 p-0 text-red-500 hover:text-red-700 hover:bg-red-50 rounded transition-colors flex items-center justify-center"
                          >
                            <Trash2 className="h-3 w-3" />
                          </button>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => updateQuantity(item.id, -1)}
                              className="h-6 w-6 border border-gray-300 rounded hover:bg-gray-50 transition-colors flex items-center justify-center"
                            >
                              <Minus className="h-3 w-3" />
                            </button>
                            <span className="text-sm font-medium w-8 text-center">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.id, 1)}
                              className="h-6 w-6 border border-gray-300 rounded hover:bg-gray-50 transition-colors flex items-center justify-center"
                            >
                              <Plus className="h-3 w-3" />
                            </button>
                          </div>
                          <span className="font-semibold text-sm">{formatPrice(item.price * item.quantity)}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {cart.length > 0 && (
              <div className="border-t border-gray-200 pt-4">
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span>Tạm tính:</span>
                    <span>{formatPrice(getTotalAmount())}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>VAT (10%):</span>
                    <span>{formatPrice(getTotalAmount() * 0.1)}</span>
                  </div>
                  <div className="border-t border-gray-200 my-2"></div>
                  <div className="flex justify-between font-semibold">
                    <span>Tổng cộng:</span>
                    <span className="text-blue-600">{formatPrice(getTotalAmount() * 1.1)}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-md transition-colors flex items-center justify-center space-x-2">
                    <CreditCard className="h-4 w-4" />
                    <span>Thanh toán</span>
                  </button>
                  <button className="w-full border border-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-50 transition-colors">
                    Lưu đơn hàng
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        <PosBookingSystem />
      )}
    </div>
  )
}
