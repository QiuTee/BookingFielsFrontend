import { useState, useEffect } from "react"
import {
  X,
  Save,
  Camera,
  MapPin,
  Phone,
  Clock,
  DollarSign,
  Globe,
  Star,
  Users,
  Package,
  Facebook,
  Upload,
  Edit3,
  Trash2,
  Plus,
  CheckCircle,
  AlertCircle,
  Eye,
  RotateCcw,
  Sparkles,
  TrendingUp,
  Settings,
  ImageIcon,
  Timer,
  Award,
} from "lucide-react"

export default function CourtSettingsModal({ court, isOpen, onClose, onSave }) {
  const [activeTab, setActiveTab] = useState("basic")
  const [formData, setFormData] = useState({
    name: "",
    location: "",
    phone: "",
    facebook: "",
    type: "",
    price: "",
    is24h: false,
    opentime: "06:00",
    closetime: "22:00",
    heroImage: "",
    logo: "",
    imageUrls: [],
    services: [],
    subFieldNames: [],
    status: "active",
  })
  const [errors, setErrors] = useState({})
  const [hasChanges, setHasChanges] = useState(false)
  const [previewImages, setPreviewImages] = useState({
    heroImage: null,
    logo: null,
    imageUrls: [],
  })
  const [editingService, setEditingService] = useState(null)
  const [newService, setNewService] = useState({ name: "", price: "" })

  const courtTypes = [
    "Bóng đá 5 người",
    "Bóng đá 7 người",
    "Bóng đá 11 người",
    "Tennis",
    "Cầu lông",
    "Bóng rổ",
    "Pickleball",
    "Bóng chuyền",
  ]

  const commonServices = [
    { name: "Wifi miễn phí", suggestedPrice: 0 },
    { name: "Bãi đỗ xe", suggestedPrice: 10000 },
    { name: "Phòng thay đồ", suggestedPrice: 15000 },
    { name: "Căng tin", suggestedPrice: 0 },
    { name: "Thuê dụng cụ", suggestedPrice: 50000 },
    { name: "Điều hòa", suggestedPrice: 20000 },
    { name: "Âm thanh", suggestedPrice: 30000 },
    { name: "Chiếu sáng LED", suggestedPrice: 25000 },
  ]

  const tabs = [
    { id: "basic", label: "Thông tin cơ bản", icon: <Globe className="w-4 h-4" /> },
    { id: "media", label: "Hình ảnh", icon: <Camera className="w-4 h-4" /> },
    { id: "services", label: "Dịch vụ", icon: <Package className="w-4 h-4" /> },
    { id: "settings", label: "Cài đặt", icon: <Settings className="w-4 h-4" /> },
  ]

  useEffect(() => {
    if (court && isOpen) {
      setFormData({
        name: court.name || "",
        location: court.location || "",
        phone: court.phone || "",
        facebook: court.facebook || "",
        type: court.type || "",
        price: court.price || "",
        is24h: court.is24h || false,
        opentime: court.opentime || "06:00",
        closetime: court.closetime || "22:00",
        heroImage: court.heroImage || "",
        logo: court.logo || "",
        imageUrls: court.imageUrls || [],
        services: court.services || [],
        subFieldNames: court.subFieldNames || [],
        status: court.status || "active",
      })
      setHasChanges(false)
      setErrors({})
    }
  }, [court, isOpen])

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    setHasChanges(true)
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: null }))
    }
  }

  const handleArrayChange = (field, index, value) => {
    const newArray = [...formData[field]]
    newArray[index] = value
    setFormData((prev) => ({ ...prev, [field]: newArray }))
    setHasChanges(true)
  }

  const addArrayItem = (field) => {
    setFormData((prev) => ({ ...prev, [field]: [...prev[field], ""] }))
    setHasChanges(true)
  }

  const removeArrayItem = (field, index) => {
    if (formData[field].length > 1) {
      const newArray = formData[field].filter((_, i) => i !== index)
      setFormData((prev) => ({ ...prev, [field]: newArray }))
      setHasChanges(true)
    }
  }

  const handleImageUpload = async (field, file) => {
    if (!file) return

    try {
      const uploadUrl = URL.createObjectURL(file)
      handleInputChange(field, uploadUrl)
      setPreviewImages((prev) => ({ ...prev, [field]: URL.createObjectURL(file) }))
    } catch (error) {
      console.error("Lỗi upload ảnh", error.message)
    }
  }

  const addService = () => {
    if (!newService.name.trim() || !newService.price || newService.price < 0) {
      setErrors((prev) => ({ ...prev, service: "Vui lòng nhập tên dịch vụ và giá hợp lệ" }))
      return
    }

    const serviceExists = formData.services.some((s) => s.name.toLowerCase() === newService.name.toLowerCase())
    if (serviceExists) {
      setErrors((prev) => ({ ...prev, service: "Dịch vụ này đã tồn tại" }))
      return
    }

    setFormData((prev) => ({
      ...prev,
      services: [...prev.services, { name: newService.name, price: Number(newService.price) }],
    }))
    setNewService({ name: "", price: "" })
    setErrors((prev) => ({ ...prev, service: null }))
    setHasChanges(true)
  }

  const addCommonService = (service) => {
    const serviceExists = formData.services.some((s) => s.name.toLowerCase() === service.name.toLowerCase())
    if (serviceExists) return

    setFormData((prev) => ({
      ...prev,
      services: [...prev.services, { name: service.name, price: service.suggestedPrice }],
    }))
    setHasChanges(true)
  }

  const removeService = (index) => {
    setFormData((prev) => ({
      ...prev,
      services: prev.services.filter((_, i) => i !== index),
    }))
    setHasChanges(true)
  }

  const editService = (index) => {
    setEditingService(index)
    setNewService(formData.services[index])
  }

  const updateService = () => {
    if (!newService.name.trim() || !newService.price || newService.price < 0) {
      setErrors((prev) => ({ ...prev, service: "Vui lòng nhập tên dịch vụ và giá hợp lệ" }))
      return
    }

    const updatedServices = [...formData.services]
    updatedServices[editingService] = { name: newService.name, price: Number(newService.price) }

    setFormData((prev) => ({ ...prev, services: updatedServices }))
    setEditingService(null)
    setNewService({ name: "", price: "" })
    setErrors((prev) => ({ ...prev, service: null }))
    setHasChanges(true)
  }

  const cancelEdit = () => {
    setEditingService(null)
    setNewService({ name: "", price: "" })
    setErrors((prev) => ({ ...prev, service: null }))
  }

  const resetForm = () => {
    if (court) {
      setFormData({
        name: court.name || "",
        location: court.location || "",
        phone: court.phone || "",
        facebook: court.facebook || "",
        type: court.type || "",
        price: court.price || "",
        is24h: court.is24h || false,
        opentime: court.opentime || "06:00",
        closetime: court.closetime || "22:00",
        heroImage: court.heroImage || "",
        logo: court.logo || "",
        imageUrls: court.imageUrls || [],
        services: court.services || [],
        subFieldNames: court.subFieldNames || [],
        status: court.status || "active",
      })
      setHasChanges(false)
      setErrors({})
    }
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.name.trim()) newErrors.name = "Tên sân là bắt buộc"
    if (!formData.location.trim()) newErrors.location = "Địa chỉ là bắt buộc"
    if (!formData.phone.trim()) newErrors.phone = "Số điện thoại là bắt buộc"
    if (!formData.type) newErrors.type = "Loại sân là bắt buộc"
    if (!formData.price || formData.price <= 0) newErrors.price = "Giá thuê phải lớn hơn 0"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSave = () => {
    if (!validateForm()) {
      setActiveTab("basic")
      return
    }

    const cleanedData = {
      ...formData,
      price: Number(formData.price),
      services: formData.services,
      subFieldNames: formData.subFieldNames.filter((s) => s.trim()),
      imageUrls: formData.imageUrls.filter((url) => url.trim()),
    }

    onSave?.(cleanedData)
    setHasChanges(false)
  }

  const handleBulkImageUpload = async (e) => {
    const files = Array.from(e.target.files)
    if (previewImages.imageUrls.length + files.length > 10) {
      alert("Tối đa 10 ảnh.")
      return
    }

    const validFiles = files.filter((file) => {
      if (file.size > 5 * 1024 * 1024 || !file.type.startsWith("image/")) return false
      return true
    })

    try {
      for (const file of validFiles) {
        const uploadedUrl = URL.createObjectURL(file)
        setPreviewImages((prev) => ({
          ...prev,
          imageUrls: [...prev.imageUrls, URL.createObjectURL(file)],
        }))
        setFormData((prev) => ({
          ...prev,
          imageUrls: [...prev.imageUrls, uploadedUrl],
        }))
      }
      setHasChanges(true)
    } catch (error) {
      alert("Lỗi khi upload ảnh:", error.message)
    }
  }

  const removePreviewImage = (index) => {
    setPreviewImages((prev) => ({
      ...prev,
      imageUrls: prev.imageUrls.filter((_, i) => i !== index),
    }))

    setFormData((prev) => ({
      ...prev,
      imageUrls: prev.imageUrls.filter((_, i) => i !== index),
    }))
    setHasChanges(true)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 text-white p-6 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-white/10 via-transparent to-white/10"></div>
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full translate-x-16 -translate-y-16"></div>

          <div className="relative z-10 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="bg-white/20 backdrop-blur-sm p-3 rounded-2xl">
                <Settings className="w-8 h-8 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold mb-1">Cài đặt sân</h2>
                <p className="text-white/80 font-medium">{court?.name}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {hasChanges && (
                <div className="bg-orange-500/20 backdrop-blur-sm border border-orange-300/30 text-orange-100 px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" />
                  Có thay đổi chưa lưu
                </div>
              )}

              <button
                onClick={onClose}
                className="bg-white/10 backdrop-blur-sm hover:bg-white/20 border border-white/20 text-white p-2 rounded-xl transition-all duration-200"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>

        <div className="bg-slate-50 border-b border-slate-200">
          <div className="flex">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 py-4 px-6 font-semibold transition-all relative ${
                  activeTab === tab.id
                    ? "text-blue-600 bg-white"
                    : "text-slate-600 hover:text-slate-800 hover:bg-slate-100"
                }`}
              >
                <div className="flex items-center justify-center gap-2">
                  {tab.icon}
                  <span className="hidden sm:inline">{tab.label}</span>
                </div>
                {activeTab === tab.id && (
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-purple-500" />
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          {activeTab === "basic" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField label="Tên sân" icon={<Globe className="w-5 h-5" />} error={errors.name} required>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    placeholder="VD: Sân bóng Chảo Lửa"
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  />
                </FormField>

                <FormField label="Loại sân" icon={<Star className="w-5 h-5" />} error={errors.type} required>
                  <select
                    value={formData.type}
                    onChange={(e) => handleInputChange("type", e.target.value)}
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 appearance-none cursor-pointer"
                  >
                    <option value="">Chọn loại sân</option>
                    {courtTypes.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </FormField>
              </div>

              <FormField label="Địa chỉ" icon={<MapPin className="w-5 h-5" />} error={errors.location} required>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => handleInputChange("location", e.target.value)}
                  placeholder="VD: 123 Đường ABC, Quận 1, TP.HCM"
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                />
              </FormField>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField label="Số điện thoại" icon={<Phone className="w-5 h-5" />} error={errors.phone} required>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    placeholder="0912345678"
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  />
                </FormField>

                <FormField label="Facebook Page" icon={<Facebook className="w-5 h-5" />} error={errors.facebook}>
                  <div className="relative">
                    <input
                      type="url"
                      value={formData.facebook}
                      onChange={(e) => handleInputChange("facebook", e.target.value)}
                      placeholder="https://facebook.com/tensancuaban"
                      className="w-full px-4 py-3 pl-12 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    />
                    <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                      <div className="w-6 h-6 bg-blue-600 rounded-md flex items-center justify-center">
                        <Facebook className="w-4 h-4 text-white" />
                      </div>
                    </div>
                  </div>
                </FormField>
              </div>

              <FormField
                label="Giá thuê (VNĐ/giờ)"
                icon={<DollarSign className="w-5 h-5" />}
                error={errors.price}
                required
              >
                <input
                  type="number"
                  value={formData.price}
                  onChange={(e) => handleInputChange("price", e.target.value)}
                  placeholder="150000"
                  min="0"
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                />
              </FormField>

              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100">
                <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-blue-600" />
                  Giờ hoạt động
                </h3>

                <div className="flex items-center gap-4 mb-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.is24h}
                      onChange={(e) => handleInputChange("is24h", e.target.checked)}
                      className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                    />
                    <span className="font-medium text-slate-700">Hoạt động 24/7</span>
                  </label>
                </div>

                {!formData.is24h && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Giờ mở cửa</label>
                      <input
                        type="time"
                        value={formData.opentime}
                        onChange={(e) => handleInputChange("opentime", e.target.value)}
                        className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Giờ đóng cửa</label>
                      <input
                        type="time"
                        value={formData.closetime}
                        onChange={(e) => handleInputChange("closetime", e.target.value)}
                        className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-2xl p-6 border border-orange-100">
                <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                  <Users className="w-5 h-5 text-orange-600" />
                  Danh sách sân con
                </h3>

                {formData.subFieldNames.map((name, index) => (
                  <div key={index} className="flex gap-3 mb-3">
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => handleArrayChange("subFieldNames", index, e.target.value)}
                      placeholder={`Sân ${String.fromCharCode(65 + index)}`}
                      className="flex-1 px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
                    />
                    {formData.subFieldNames.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeArrayItem("subFieldNames", index)}
                        className="p-3 text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                ))}

                <button
                  type="button"
                  onClick={() => addArrayItem("subFieldNames")}
                  className="flex items-center gap-2 px-4 py-2 text-orange-600 hover:bg-orange-50 rounded-xl transition-colors font-medium"
                >
                  <Plus className="w-4 h-4" />
                  Thêm sân con
                </button>
              </div>
            </div>
          )}

          {activeTab === "media" && (
            <div className="space-y-6">
              <ImageUploadField
                label="Ảnh đại diện sân"
                description="Ảnh chính sẽ hiển thị trên trang chủ"
                preview={previewImages.heroImage}
                onUpload={(file) => handleImageUpload("heroImage", file)}
                onUrlChange={(url) => handleInputChange("heroImage", url)}
                urlValue={formData.heroImage}
              />

              <ImageUploadField
                label="Logo sân"
                description="Logo sẽ hiển thị trên các tài liệu và hóa đơn"
                preview={previewImages.logo}
                onUpload={(file) => handleImageUpload("logo", file)}
                onUrlChange={(url) => handleInputChange("logo", url)}
                urlValue={formData.logo}
              />

              <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-100">
                <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                  <ImageIcon className="w-5 h-5 text-purple-600" />
                  Thư viện ảnh sân
                </h3>

                <div className="mb-6">
                  <label className="block text-sm font-medium text-slate-700 mb-3">Upload nhiều ảnh cùng lúc</label>
                  <div className="border-2 border-dashed border-purple-300 rounded-xl p-6 text-center hover:border-purple-400 transition-colors cursor-pointer bg-white/50">
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleBulkImageUpload}
                      className="hidden"
                      id="bulk-upload"
                    />
                    <label htmlFor="bulk-upload" className="cursor-pointer">
                      <Upload className="w-12 h-12 text-purple-400 mx-auto mb-3" />
                      <p className="text-lg font-medium text-slate-700 mb-1">Chọn nhiều ảnh</p>
                      <p className="text-sm text-slate-500">Kéo thả hoặc click để chọn ảnh (JPG, PNG, WebP)</p>
                      <p className="text-xs text-slate-400 mt-2">Tối đa 10 ảnh, mỗi ảnh không quá 5MB</p>
                    </label>
                  </div>
                </div>

                {formData.imageUrls.length > 0 && (
                  <div className="mb-6">
                    <h4 className="text-sm font-medium text-slate-700 mb-3">
                      Ảnh hiện tại ({formData.imageUrls.length})
                    </h4>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      {formData.imageUrls.map((image, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={image || "/placeholder.svg"}
                            alt={`Preview ${index + 1}`}
                            className="w-full h-24 object-cover rounded-lg border border-slate-200"
                          />
                          <button
                            type="button"
                            onClick={() => removePreviewImage(index)}
                            className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === "services" && (
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl p-6 border border-emerald-100">
                <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                  <Package className="w-5 h-5 text-emerald-600" />
                  Dịch vụ tiện ích & Giá cả
                </h3>

                <div className="mb-6">
                  <h4 className="text-sm font-semibold text-slate-700 mb-3">Dịch vụ phổ biến</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {commonServices.map((service) => {
                      const isAdded = formData.services.some((s) => s.name === service.name)
                      return (
                        <button
                          key={service.name}
                          type="button"
                          onClick={() => !isAdded && addCommonService(service)}
                          disabled={isAdded}
                          className={`p-4 rounded-xl border-2 transition-all duration-200 text-left ${
                            isAdded
                              ? "border-emerald-200 bg-emerald-50 text-emerald-600 cursor-not-allowed"
                              : "border-slate-200 bg-white text-slate-700 hover:border-emerald-300 hover:bg-emerald-50 cursor-pointer"
                          }`}
                        >
                          <div className="flex justify-between items-center">
                            <span className="font-medium">{service.name}</span>
                            <span className="text-sm font-semibold text-emerald-600">
                              {service.suggestedPrice === 0
                                ? "Miễn phí"
                                : `${service.suggestedPrice.toLocaleString()}đ`}
                            </span>
                          </div>
                          {isAdded && <div className="text-xs text-emerald-500 mt-1">✓ Đã thêm</div>}
                        </button>
                      )
                    })}
                  </div>
                </div>

                <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
                  <h4 className="text-sm font-semibold text-slate-700 mb-4 flex items-center gap-2">
                    <Plus className="w-4 h-4" />
                    {editingService !== null ? "Chỉnh sửa dịch vụ" : "Thêm dịch vụ tùy chỉnh"}
                  </h4>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-slate-600 mb-2">Tên dịch vụ</label>
                      <input
                        type="text"
                        value={newService.name}
                        onChange={(e) => setNewService((prev) => ({ ...prev, name: e.target.value }))}
                        placeholder="VD: Massage thể thao"
                        className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-600 mb-2">Giá (VNĐ)</label>
                      <input
                        type="number"
                        value={newService.price}
                        onChange={(e) => setNewService((prev) => ({ ...prev, price: e.target.value }))}
                        placeholder="50000"
                        min="0"
                        className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200"
                      />
                    </div>
                  </div>

                  {errors.service && (
                    <div className="flex items-center gap-1 mt-3 text-red-600 text-sm">
                      <AlertCircle className="w-4 h-4" />
                      {errors.service}
                    </div>
                  )}

                  <div className="flex gap-3 mt-4">
                    {editingService !== null ? (
                      <>
                        <button
                          type="button"
                          onClick={updateService}
                          className="flex items-center gap-2 px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl transition-colors font-medium"
                        >
                          <Save className="w-4 h-4" />
                          Cập nhật
                        </button>
                        <button
                          type="button"
                          onClick={cancelEdit}
                          className="flex items-center gap-2 px-6 py-2 bg-slate-500 hover:bg-slate-600 text-white rounded-xl transition-colors font-medium"
                        >
                          <X className="w-4 h-4" />
                          Hủy
                        </button>
                      </>
                    ) : (
                      <button
                        type="button"
                        onClick={addService}
                        className="flex items-center gap-2 px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl transition-colors font-medium"
                      >
                        <Plus className="w-4 h-4" />
                        Thêm dịch vụ
                      </button>
                    )}
                  </div>
                </div>

                {formData.services.length > 0 && (
                  <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
                    <h4 className="text-sm font-semibold text-slate-700 mb-4">
                      Danh sách dịch vụ ({formData.services.length})
                    </h4>
                    <div className="space-y-3">
                      {formData.services.map((service, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100"
                        >
                          <div className="flex-1">
                            <h5 className="font-medium text-slate-900">{service.name}</h5>
                            <p className="text-sm text-slate-600">
                              {service.price === 0 ? "Miễn phí" : `${service.price.toLocaleString()} VNĐ`}
                            </p>
                          </div>
                          <div className="flex gap-2">
                            <button
                              type="button"
                              onClick={() => editService(index)}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              title="Chỉnh sửa"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => removeService(index)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="Xóa"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="mt-4 p-4 bg-emerald-50 rounded-xl border border-emerald-200">
                      <div className="flex justify-between items-center">
                        <span className="font-semibold text-emerald-800">Tổng doanh thu dự kiến từ dịch vụ:</span>
                        <span className="text-xl font-bold text-emerald-600">
                          {formData.services.reduce((total, service) => total + service.price, 0).toLocaleString()} VNĐ
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === "settings" && (
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-slate-50 to-gray-50 rounded-2xl p-6 border border-slate-200">
                <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                  <Settings className="w-5 h-5 text-slate-600" />
                  Trạng thái sân
                </h3>

                <div className="space-y-4">
                  {[
                    {
                      value: "active",
                      label: "Hoạt động",
                      color: "emerald",
                      icon: <CheckCircle className="w-4 h-4" />,
                    },
                    { value: "maintenance", label: "Bảo trì", color: "amber", icon: <Timer className="w-4 h-4" /> },
                    { value: "closed", label: "Đóng cửa", color: "red", icon: <X className="w-4 h-4" /> },
                  ].map((status) => (
                    <label
                      key={status.value}
                      className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                        formData.status === status.value
                          ? `border-${status.color}-300 bg-${status.color}-50`
                          : "border-slate-200 bg-white hover:border-slate-300"
                      }`}
                    >
                      <input
                        type="radio"
                        name="status"
                        value={status.value}
                        checked={formData.status === status.value}
                        onChange={(e) => handleInputChange("status", e.target.value)}
                        className="sr-only"
                      />
                      <div
                        className={`p-2 rounded-lg ${
                          formData.status === status.value
                            ? `bg-${status.color}-500 text-white`
                            : "bg-slate-100 text-slate-500"
                        }`}
                      >
                        {status.icon}
                      </div>
                      <div>
                        <div className="font-semibold text-slate-900">{status.label}</div>
                        <div className="text-sm text-slate-600">
                          {status.value === "active" && "Sân đang hoạt động bình thường"}
                          {status.value === "maintenance" && "Sân đang trong quá trình bảo trì"}
                          {status.value === "closed" && "Sân tạm thời đóng cửa"}
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100">
                <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-blue-600" />
                  Thống kê nhanh
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-white rounded-xl p-4 border border-blue-200">
                    <div className="flex items-center gap-3">
                      <div className="bg-blue-500 p-2 rounded-lg">
                        <Eye className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <div className="text-sm text-slate-600">Lượt xem</div>
                        <div className="text-xl font-bold text-slate-900">1,234</div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-xl p-4 border border-emerald-200">
                    <div className="flex items-center gap-3">
                      <div className="bg-emerald-500 p-2 rounded-lg">
                        <TrendingUp className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <div className="text-sm text-slate-600">Đánh giá</div>
                        <div className="text-xl font-bold text-slate-900">4.8/5</div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-xl p-4 border border-purple-200">
                    <div className="flex items-center gap-3">
                      <div className="bg-purple-500 p-2 rounded-lg">
                        <Award className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <div className="text-sm text-slate-600">Xếp hạng</div>
                        <div className="text-xl font-bold text-slate-900">#3</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 flex justify-between items-center">
          <div className="flex gap-3">
            <button
              onClick={resetForm}
              disabled={!hasChanges}
              className="flex items-center gap-2 px-4 py-2 text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <RotateCcw className="w-4 h-4" />
              Khôi phục
            </button>
          </div>

          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="px-6 py-3 text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-all duration-200 font-medium"
            >
              Hủy
            </button>
            <button
              onClick={handleSave}
              disabled={!hasChanges}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save className="w-4 h-4" />
              Lưu thay đổi
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

const FormField = ({ label, icon, children, error, required }) => (
  <div>
    <label className="text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
      <span className="text-blue-600">{icon}</span>
      {label}
      {required && <span className="text-red-500">*</span>}
    </label>
    {children}
    {error && (
      <div className="flex items-center gap-1 mt-2 text-red-600 text-sm">
        <AlertCircle className="w-4 h-4" />
        {error}
      </div>
    )}
  </div>
)

const ImageUploadField = ({ label, description, preview, onUpload, onUrlChange, urlValue }) => (
  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100">
    <h3 className="text-lg font-semibold text-slate-900 mb-2 flex items-center gap-2">
      <Camera className="w-5 h-5 text-blue-600" />
      {label}
    </h3>
    <p className="text-sm text-slate-600 mb-4">{description}</p>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">Upload file</label>
        <div className="border-2 border-dashed border-slate-300 rounded-xl p-4 text-center hover:border-blue-400 transition-colors cursor-pointer">
          <input
            type="file"
            accept="image/*"
            onChange={(e) => onUpload(e.target.files[0])}
            className="hidden"
            id={`upload-${label}`}
          />
          <label htmlFor={`upload-${label}`} className="cursor-pointer">
            <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
            <p className="text-sm text-slate-600">Click để chọn ảnh</p>
          </label>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">Hoặc nhập URL</label>
        <input
          type="url"
          value={urlValue}
          onChange={(e) => onUrlChange(e.target.value)}
          placeholder="https://example.com/image.jpg"
          className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
        />
      </div>
    </div>

    {(preview || urlValue) && (
      <div className="mt-4">
        <img
          src={preview || urlValue}
          alt="Preview"
          className="w-full h-32 object-cover rounded-xl border border-slate-200"
        />
      </div>
    )}
  </div>
)
