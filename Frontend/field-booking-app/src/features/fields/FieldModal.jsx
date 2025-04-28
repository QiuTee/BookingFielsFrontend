import { useState } from 'react';
import { Phone, MapPin, Clock, Star, Info } from 'lucide-react';

export default function FieldModal({ field, onClose }) {
  const [activeTab, setActiveTab] = useState('info');

  if (!field) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(107,114,128,0.5)]">
      <div className="bg-white rounded-xl shadow-lg max-w-2xl w-full relative overflow-hidden">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 hover:text-gray-700 text-xl font-bold"
        >
          &times;
        </button>

        <div className="p-6">
          <div className="flex items-center gap-4 mb-4">
            <img
              src={field.logo || field.image}
              alt={field.name}
              className="w-16 h-16 rounded-full border"
            />
            <div>
              <h2 className="text-xl font-bold text-blue-700">{field.name}</h2>
              <div className="flex items-center gap-2 mt-1">
                <Star className="w-4 h-4 text-green-500" />
                <span className="text-sm text-green-600">5 (8 đánh giá)</span>
                <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded text-xs">
                  {field.type}
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-2 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              <span>{field.location}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>{field.openTime} - {field.closeTime}</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4" />
              <span className="text-green-600">{field.phone}</span>
            </div>
          </div>
        </div>

        <div className="border-t px-6 py-2 bg-gray-50 flex justify-around text-sm font-medium text-gray-600">
          {['info', 'services', 'images', 'reviews'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-2 flex-1 text-center hover:text-blue-600 ${
                activeTab === tab ? 'border-b-2 border-blue-600 text-blue-700' : ''
              }`}
            >
              {tab === 'info' && 'Thông tin'}
              {tab === 'services' && 'Dịch vụ'}
              {tab === 'images' && 'Hình ảnh'}
              {tab === 'reviews' && 'Đánh giá'}
            </button>
          ))}
        </div>

        
        <div className="p-6">
          {activeTab === 'info' && (
            <div>
              <h3 className="font-semibold mb-2">Website</h3>
              <a href={field.website} target="_blank" className="text-blue-600 underline">
                {field.website}
              </a>
              <h3 className="font-semibold mt-4 mb-2 text-orange-600">Link đặt sân online</h3>
              <a href={field.bookingLink} target="_blank" className="text-green-700 break-all">
                {field.bookingLink}
              </a>
            </div>
          )}

          {activeTab === 'services' && <div>Danh sách dịch vụ (chưa có dữ liệu)</div>}
          {activeTab === 'images' && <div>Hình ảnh sân (chưa có dữ liệu)</div>}
          {activeTab === 'reviews' && <div>Đánh giá người dùng (chưa có dữ liệu)</div>}
        </div>
      </div>
    </div>
  );
}
