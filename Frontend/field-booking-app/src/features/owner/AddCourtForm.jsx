import { useState } from "react"
import {
  MapPin,
  Phone,
  Clock,
  DollarSign,
  Upload,
  ImageIcon,
  Plus,
  X,
  Save,
  Eye,
  Star,
  Users,
  Camera,
  Globe,
  Settings,
  CheckCircle,
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  Edit3,
  Trash2,
  Package,
  Facebook,
} from "lucide-react"
import { createField } from "../../api/submission"
import {useNotification} from "../../context/NotificationContext"
import {uploadFieldImage} from "../../utils/upload"
export default function AddCourtForm({ onCancel }) {
  const [currentStep, setCurrentStep] = useState(1)
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
    imageUrls: [""],
    services: [],
    subFieldNames: [""],
  })
  const {showNotification} = useNotification()
  const [errors, setErrors] = useState({})
  const [previewImages, setPreviewImages] = useState({
    heroImage: null,
    logo: null,
    imageUrls: [],
  })
  const [editingService, setEditingService] = useState(null)
  const [newService, setNewService] = useState({ name: "", price: "" })

  const courtTypes = [
    "Sân bóng đá",
    "Tennis",
    "Sân cầu lông",
    "Sân bóng rổ",
    "Sân Pickleball",
    "Sân bóng chuyền",
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

  const steps = [
    { id: 1, title: "Thông tin cơ bản", icon: <Settings className="w-5 h-5" /> },
    { id: 2, title: "Hình ảnh & Media", icon: <Camera className="w-5 h-5" /> },
    { id: 3, title: "Dịch vụ & Sân con", icon: <Star className="w-5 h-5" /> },
    { id: 4, title: "Xem trước & Xác nhận", icon: <Eye className="w-5 h-5" /> },
  ]

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: null }))
    }
  }

  const handleArrayChange = (field, index, value) => {
    const newArray = [...formData[field]]
    newArray[index] = value
    setFormData((prev) => ({ ...prev, [field]: newArray }))
  }

  const addArrayItem = (field) => {
    setFormData((prev) => ({ ...prev, [field]: [...prev[field], ""] }))
  }

  const removeArrayItem = (field, index) => {
    if (formData[field].length > 1) {
      const newArray = formData[field].filter((_, i) => i !== index)
      setFormData((prev) => ({ ...prev, [field]: newArray }))
    }
  }

  const handleImageUpload = async (field, file) => {
    if (!file) return

    try {
      const uploadUrl = await uploadFieldImage(file , formData.id)
      handleInputChange(field, uploadUrl)
      setPreviewImages((prev) => ({ ...prev, [field]: uploadUrl }))
    } catch (error) {
      console.error("Lỗi upload ảnh", error.message)
    }
  }

  const addService = () => {
    if (!newService.name.trim() || newService.price === "" || Number(newService.price) < 0) {
      setErrors((prev) => ({ ...prev, service: "Vui lòng nhập tên dịch vụ và giá hợp lệ (>= 0)" }))
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
  }

  const addCommonService = (service) => {
    const serviceExists = formData.services.some((s) => s.name.toLowerCase() === service.name.toLowerCase())
    if (serviceExists) return

    setFormData((prev) => ({
      ...prev,
      services: [...prev.services, { name: service.name, price: service.suggestedPrice }],
    }))
  }

  const removeService = (index) => {
    setFormData((prev) => ({
      ...prev,
      services: prev.services.filter((_, i) => i !== index),
    }))
  }

  const editService = (index) => {
    setEditingService(index)
    setNewService(formData.services[index])
  }

  const updateService = () => {
    if (!newService.name.trim() || newService.price === "" || Number(newService.price) < 0) {
      setErrors((prev) => ({ ...prev, service: "Vui lòng nhập tên dịch vụ và giá hợp lệ (>= 0)" }))
      return
    }

    const updatedServices = [...formData.services]
    updatedServices[editingService] = { name: newService.name, price: Number(newService.price) }

    setFormData((prev) => ({ ...prev, services: updatedServices }))
    setEditingService(null)
    setNewService({ name: "", price: "" })
    setErrors((prev) => ({ ...prev, service: null }))
  }

  const cancelEdit = () => {
    setEditingService(null)
    setNewService({ name: "", price: "" })
    setErrors((prev) => ({ ...prev, service: null }))
  }

  const validateStep = (step) => {
    const newErrors = {}

    if (step === 1) {
      if (!formData.name.trim()) newErrors.name = "Tên sân là bắt buộc"
      if (!formData.location.trim()) newErrors.location = "Địa chỉ là bắt buộc"
      if (!formData.phone.trim()) newErrors.phone = "Số điện thoại là bắt buộc"
      if (!formData.type) newErrors.type = "Loại sân là bắt buộc"
      if (!formData.price || formData.price <= 0) newErrors.price = "Giá thuê phải lớn hơn 0"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, 4))
    }
  }

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1))
  }

  const handleSubmit = async () => {
  if (!validateStep(1)) return;

  try {
    const cleanedData = {
      ...formData,
      price: Number(formData.price),
      services: formData.services,
      subFieldNames: formData.subFieldNames.filter((s) => s.trim()),
      imageUrls: formData.imageUrls.filter((url) => url.trim()),
      facebook: formData.facebook
    };
    const response = await createField(cleanedData)
    showNotification({type:"success" , message:"Tạo sân thành công"})
    console.log("Submitting data:", cleanedData);
  } catch (error) {
    console.error("Lỗi khi tạo sân:", error.message);
  }
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
        const uploadedUrl = await uploadFieldImage(file , formData.id)
        setPreviewImages((prev) => ({
          ...prev,
          imageUrls: [...prev.imageUrls, uploadedUrl],
        }))
        setFormData((prev) => ({
          ...prev,
          imageUrls: [...prev.imageUrls, uploadedUrl],
        }))
      }
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
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl shadow-lg mb-4">
            <Plus className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">
            Thêm sân mới
          </h1>
          <p className="text-lg text-slate-600">Tạo sân thể thao mới và bắt đầu nhận booking ngay hôm nay</p>
        </div>

        <div className="mb-8">
          <div className="flex items-center justify-between max-w-2xl mx-auto">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div
                  className={`flex items-center justify-center w-12 h-12 rounded-full border-2 transition-all duration-300 ${
                    currentStep >= step.id
                      ? "bg-gradient-to-br from-blue-600 to-indigo-600 border-blue-600 text-white shadow-lg"
                      : "bg-white border-slate-300 text-slate-400"
                  }`}
                >
                  {currentStep > step.id ? <CheckCircle className="w-6 h-6" /> : step.icon}
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`w-16 h-1 mx-2 rounded-full transition-all duration-300 ${
                      currentStep > step.id ? "bg-gradient-to-r from-blue-600 to-indigo-600" : "bg-slate-200"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="text-center mt-4">
            <h3 className="text-xl font-semibold text-slate-900">{steps[currentStep - 1].title}</h3>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/40 overflow-hidden">
          <div className="p-8">
            {currentStep === 1 && (
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
                    <p className="text-xs text-slate-500 mt-2 flex items-center gap-1">
                      <Star className="w-3 h-3" />
                      Tùy chọn - Giúp khách hàng dễ dàng tìm hiểu và liên hệ với sân
                    </p>
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
              </div>
            )}

            {currentStep === 2 && (
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
                  <p className="text-sm text-slate-600 mb-4">Thêm nhiều ảnh để khách hàng có thể xem chi tiết sân</p>
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

                  {previewImages.imageUrls.length > 0 && (
                    <div className="mb-6">
                      <h4 className="text-sm font-medium text-slate-700 mb-3">
                        Ảnh đã tải lên ({previewImages.imageUrls.length})
                      </h4>
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {previewImages.imageUrls.map((image, index) => (
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

                  <div>
                    <h4 className="text-sm font-medium text-slate-700 mb-3">Hoặc thêm ảnh bằng URL</h4>
                    {formData.imageUrls.map((url, index) => (
                      <div key={index} className="flex gap-3 mb-3">
                        <input
                          type="url"
                          value={url}
                          onChange={(e) => handleArrayChange("imageUrls", index, e.target.value)}
                          placeholder="https://example.com/image.jpg"
                          className="flex-1 px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                        />
                        {formData.imageUrls.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeArrayItem("imageUrls", index)}
                            className="p-3 text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                          >
                            <X className="w-5 h-5" />
                          </button>
                        )}
                      </div>
                    ))}

                    <button
                      type="button"
                      onClick={() => addArrayItem("imageUrls")}
                      className="flex items-center gap-2 px-4 py-2 text-purple-600 hover:bg-purple-50 rounded-xl transition-colors font-medium"
                    >
                      <Plus className="w-4 h-4" />
                      Thêm URL ảnh
                    </button>
                  </div>
                </div>
              </div>
            )}

            {currentStep === 3 && (
              <div className="space-y-6">
                <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl p-6 border border-emerald-100">
                  <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                    <Package className="w-5 h-5 text-emerald-600" />
                    Dịch vụ tiện ích & Giá cả
                  </h3>
                  <p className="text-sm text-slate-600 mb-6">
                    Thêm các dịch vụ kèm theo giá để tăng doanh thu cho sân của bạn
                  </p>

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

                  {/* Services List */}
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
                            {formData.services.reduce((total, service) => total + service.price, 0).toLocaleString()}{" "}
                            VNĐ
                          </span>
                        </div>
                        <p className="text-xs text-emerald-600 mt-1">
                          *Dựa trên việc sử dụng tất cả dịch vụ trong 1 lần thuê sân
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-2xl p-6 border border-orange-100">
                  <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                    <Users className="w-5 h-5 text-orange-600" />
                    Danh sách sân con
                  </h3>
                  <p className="text-sm text-slate-600 mb-4">Đặt tên cho các sân con để khách hàng dễ phân biệt</p>

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

            {currentStep === 4 && (
              <div className="space-y-6">
                <div className="text-center mb-6">
                  <CheckCircle className="w-16 h-16 text-emerald-500 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-slate-900 mb-2">Xem trước thông tin sân</h3>
                  <p className="text-slate-600">Kiểm tra lại thông tin trước khi tạo sân mới</p>
                </div>

                <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-lg">
                  <div className="relative h-48 bg-gradient-to-r from-blue-600 to-indigo-600">
                    {formData.heroImage && (
                      <img
                        src={formData.heroImage || "/placeholder.svg"}
                        alt="Hero"
                        className="w-full h-full object-cover"
                      />
                    )}
                    <div className="absolute inset-0 bg-black/20"></div>
                    <div className="absolute bottom-4 left-4 text-white">
                      <h3 className="text-2xl font-bold">{formData.name || "Tên sân"}</h3>
                      <p className="text-blue-100">{formData.type || "Loại sân"}</p>
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <PreviewItem icon={<MapPin className="w-5 h-5" />} label="Địa chỉ" value={formData.location} />
                      <PreviewItem icon={<Phone className="w-5 h-5" />} label="Điện thoại" value={formData.phone} />
                      {formData.facebook && (
                        <PreviewItem
                          icon={<Facebook className="w-5 h-5" />}
                          label="Facebook Page"
                          value={
                            <a
                              href={formData.facebook}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:text-blue-800 underline"
                            >
                              {formData.facebook.replace("https://", "").replace("http://", "")}
                            </a>
                          }
                        />
                      )}
                      <PreviewItem
                        icon={<DollarSign className="w-5 h-5" />}
                        label="Giá thuê"
                        value={`${Number(formData.price).toLocaleString()} VNĐ/giờ`}
                      />
                      <PreviewItem
                        icon={<Clock className="w-5 h-5" />}
                        label="Giờ hoạt động"
                        value={formData.is24h ? "24/7" : `${formData.opentime} - ${formData.closetime}`}
                      />
                    </div>

                    {formData.services.length > 0 && (
                      <div className="mt-6">
                        <h4 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
                          <Package className="w-5 h-5" />
                          Dịch vụ tiện ích
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {formData.services.map((service, index) => (
                            <div
                              key={index}
                              className="flex justify-between items-center p-3 bg-emerald-50 rounded-lg border border-emerald-200"
                            >
                              <span className="font-medium text-emerald-800">{service.name}</span>
                              <span className="text-sm font-semibold text-emerald-600">
                                {service.price === 0 ? "Miễn phí" : `${service.price.toLocaleString()}đ`}
                              </span>
                            </div>
                          ))}
                        </div>
                        <div className="mt-3 p-3 bg-emerald-100 rounded-lg">
                          <div className="flex justify-between items-center">
                            <span className="font-semibold text-emerald-800">Tổng doanh thu dự kiến từ dịch vụ:</span>
                            <span className="text-lg font-bold text-emerald-600">
                              {formData.services.reduce((total, service) => total + service.price, 0).toLocaleString()}{" "}
                              VNĐ
                            </span>
                          </div>
                        </div>
                      </div>
                    )}

                    {formData.subFieldNames.filter((s) => s.trim()).length > 0 && (
                      <div className="mt-6">
                        <h4 className="font-semibold text-slate-900 mb-3">Sân con</h4>
                        <div className="flex flex-wrap gap-2">
                          {formData.subFieldNames
                            .filter((s) => s.trim())
                            .map((name, index) => (
                              <span
                                key={index}
                                className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm font-medium"
                              >
                                {name}
                              </span>
                            ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="bg-slate-50 px-8 py-6 border-t border-slate-200">
            <div className="flex justify-between">
              <button
                onClick={currentStep === 1 ? onCancel : prevStep}
                className="flex items-center gap-2 px-6 py-3 text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-all duration-200 font-medium"
              >
                <ArrowLeft className="w-4 h-4" />
                {currentStep === 1 ? "Hủy" : "Quay lại"}
              </button>

              <button
                onClick={currentStep === 4 ? handleSubmit : nextStep}
                className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 font-semibold"
              >
                {currentStep === 4 ? (
                  <>
                    <Save className="w-4 h-4" />
                    Tạo sân
                  </>
                ) : (
                  <>
                    Tiếp tục
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
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

const PreviewItem = ({ icon, label, value }) => (
  <div className="flex items-start gap-3">
    <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">{icon}</div>
    <div>
      <p className="text-sm font-medium text-slate-600">{label}</p>
      <div className="text-slate-900 font-semibold">{value}</div>
    </div>
  </div>
)
