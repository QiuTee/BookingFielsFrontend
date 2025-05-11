import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import { MapPin, Clock, Phone, Star, Home, Bell, User, Bot } from "lucide-react";
import TankLoading from "../components/loading/TankLoading";
import { BookingContext } from "../context/BookingContext";
import BottomNav from "../components/bottom_nav/BottomNav";
import AccountPage from "../features/account/AccountPage";
import { getFieldBySlug } from "../api/submission"; 

export default function FieldDetailClientPage() {
  const { fieldSlug } = useParams();
  const navigate = useNavigate();
  const { setBookingData } = useContext(BookingContext);

  const [field, setField] = useState(null);
  const [selectedTab, setSelectedTab] = useState("home");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchField = async () => {
      setLoading(true);
      try {
        const data = await getFieldBySlug(fieldSlug);
        setField(data);
      } catch (error) {
        console.error("Không thể tải sân:", error);
        setField(null);
      } finally {
        setTimeout(() => setLoading(false), 1000);
      }
    };

    fetchField();
  }, [fieldSlug]);

  const handleBookingClick = () => {
    if (!field) return;
    setBookingData((prev) => ({
      ...prev,
      selectionField: field.name,
      fieldId: field.id,
    }));
    navigate(`/booking/${field.id}`);
  };

  if (!field) return <div className="text-center py-10 text-white">Đang tải sân...</div>;
  if (loading) return <TankLoading duration={5000} />;

  if (selectedTab === "notifications") {
    return (
      <div className="flex flex-col min-h-screen">
        <div className="p-4">Đây là phần Thông báo</div>
        <BottomNav selectedTab={selectedTab} onSelectTab={setSelectedTab} />
      </div>
    );
  }

  if (selectedTab === "account") {
    return (
      <div className="flex flex-col min-h-screen">
        <AccountPage />
        <BottomNav selectedTab={selectedTab} onSelectTab={setSelectedTab} />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <div className="relative w-full h-64 md:h-80">
        <img
          src={field.heroImage}
          alt="Pickleball court"
          className="w-full h-full object-cover brightness-75 absolute inset-0"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-sky-600/90" />
        <div className="absolute bottom-0 left-0 w-full p-4 flex flex-col md:flex-row items-start md:items-center gap-4">
          <div className="bg-white rounded-full p-1 shadow-lg">
            <img
              src={field.logo || "/images/default-logo.png"}
              alt="Logo"
              width={80}
              height={80}
              className="rounded-full"
            />
          </div>
          <div className="text-white">
            <h1 className="text-xl sm:text-2xl font-bold">{field.name}</h1>
            <div className="flex items-center mt-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              ))}
            </div>
          </div>
          <div className="md:ml-auto w-full md:w-auto">
            <button
              onClick={handleBookingClick}
              className="block text-center bg-yellow-400 hover:bg-yellow-500 text-black font-medium px-4 py-2 rounded-md w-full md:w-auto"
            >
              Đặt lịch
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 bg-sky-100 text-gray-800">
        <div className="bg-sky-200 flex">
          <button
            className={`flex-1 py-3 font-medium transition ${selectedTab === "info" ? "bg-sky-300 text-sky-900" : "bg-sky-200 text-sky-700"}`}
            onClick={() => setSelectedTab("info")}
          >
            Thông tin & Hình ảnh
          </button>
          <button
            className={`flex-1 py-3 font-medium transition ${selectedTab === "services" ? "bg-sky-300 text-sky-900" : "bg-sky-200 text-sky-700"}`}
            onClick={() => setSelectedTab("services")}
          >
            Dịch vụ & Đánh giá
          </button>
        </div>

        {(selectedTab === "info" || selectedTab === "home") && (
          <div className="p-4 space-y-6">
            <div className="bg-white rounded-lg p-4 flex gap-3 shadow">
              <MapPin className="w-5 h-5 mt-0.5 text-sky-600" />
              <p className="text-sm">{field.location}</p>
            </div>
            <div className="bg-white rounded-lg p-4 flex gap-3 shadow">
              <Clock className="w-5 h-5 text-sky-600" />
              <p className="text-sm">
                Giờ hoạt động: {field.opentime} - {field.closetime}
              </p>
            </div>
            <div className="bg-white rounded-lg p-4 flex gap-3 shadow">
              <Phone className="w-5 h-5 text-sky-600" />
              <p className="text-sm">{field.phone}</p>
            </div>

            {field.images?.length > 0 && (
              <div>
                <h2 className="text-xl font-semibold mb-4">Hình ảnh sân</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {field.images.map((img, i) => (
                    <div key={i} className="aspect-square rounded-lg overflow-hidden bg-sky-100 border">
                      <img
                        src={img.url}
                        alt={`Ảnh ${i + 1}`}
                        className="w-full h-full object-cover hover:scale-105 transition-transform"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {selectedTab === "services" && (
          <div className="p-4 space-y-6">
            {field.services?.length > 0 && (
              <div className="bg-white rounded-lg p-4 shadow">
                <h3 className="text-lg font-semibold mb-2">Dịch vụ</h3>
                <ul className="space-y-2">
                  {field.services.map((s, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-yellow-400"></div>
                      <span>{s.name}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {field.reviews?.length > 0 && (
              <div>
                <h2 className="text-xl font-semibold mb-4">Đánh giá</h2>
                <div className="space-y-4">
                  {field.reviews.map((r, i) => (
                    <div key={i} className="bg-white rounded-lg p-4 shadow">
                      <div className="flex justify-between items-center mb-2">
                        <h4 className="font-medium">Khách {i + 1}</h4>
                        <div className="flex">
                          {Array.from({ length: r.rating }).map((_, j) => (
                            <Star key={j} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          ))}
                        </div>
                      </div>
                      <p className="text-sm text-gray-600">{r.comment}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <BottomNav selectedTab={selectedTab} onSelectTab={setSelectedTab} />
    </div>
  );
}
