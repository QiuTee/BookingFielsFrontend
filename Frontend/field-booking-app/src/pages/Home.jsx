export default function Home() {
    return (
      <div className="bg-white text-gray-800 ">
       
        <section className="bg-blue-50 py-20 px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-blue-700 mb-4">
            Đặt sân  dễ dàng – nhanh chóng – mọi lúc
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-6">
            VNDC giúp bạn tìm, đặt và quản lý sân  chỉ với vài cú nhấp. Không còn phải gọi điện từng sân để đặt chỗ!
          </p>
          <a
            href="/fields" 
            className="inline-block bg-blue-600 text-white text-lg px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            Đặt sân ngay
          </a>
        </section>
  
        <section className="py-16 px-6 max-w-6xl mx-auto grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white border border-gray-100 rounded-2xl shadow hover:shadow-md transition p-6 text-center"
            >
              <div className="text-blue-600 text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.desc}</p>
            </div>
          ))}
        </section>
  
        <section className="py-12 bg-blue-100 text-center">
          <h2 className="text-2xl font-bold text-blue-700 mb-4">
            Sẵn sàng để đặt sân đầu tiên của bạn?
          </h2>
          <a
            href="/register"
            className="inline-block bg-blue-600 text-white text-lg px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            Đăng ký ngay
          </a>
        </section>
      </div>
    );
  }
  
  const features = [
    {
      icon: "⚡️",
      title: "Đặt sân nhanh chóng",
      desc: "Chỉ vài thao tác là bạn đã có sân chơi như ý."
    },
    {
      icon: "📅",
      title: "Lịch rõ ràng",
      desc: "Xem và chọn khung giờ phù hợp dễ dàng."
    },
    {
      icon: "📱",
      title: "Quản lý dễ dàng",
      desc: "Theo dõi lịch sử và trạng thái đặt sân ngay trên điện thoại."
    }
  ];
  