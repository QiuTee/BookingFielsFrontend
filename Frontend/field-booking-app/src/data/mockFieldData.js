const mockFieldData = [
    {
        id: 1,
        slug: "san_bong_da_mini_chao_lua",
        name: "Sân bóng đá mini Chảo Lửa",
        heroImage: "/images/hero/chao_lua.jpg",
        logo: "/images/logo/logo_chao_lua.jpg",                  
        location: "30 Phan Thúc Duyện, Phường 4, Tân Bình, Hồ Chí Minh", 
        openTime: "00:00",                         
        closeTime: "23:59",                        
        phone: "0963338299",                       
        images: [
          "/images/image_field/chao_lua.jpg",
          "/images/image_field/chao_lua2.jpg",
          "/images/image_field/chao_lua3.jpg",

        ],
        services: [
          "Thuê sân theo giờ",
          "Thuê huấn luyện viên",
          "Cho thuê bóng",
          "Giải đấu hàng tháng",
          "Lớp học cho người mới"
        ],
        reviews: [
          { rating: 5, comment: "Sân đẹp, dịch vụ tốt, nhân viên thân thiện!" },
          { rating: 4, comment: "Giá cả hợp lý, sân thoáng mát." },
          {
            rating: 5,
            comment: "Huấn luyện viên chuyên nghiệp, tôi đã học được nhiều kỹ thuật mới."
          }
        ],
        subFields: ["Sân A1", "Sân A2", "Sân A3"], 
        type: "sân bóng đá",
        price: 120000,
        is24h: true
      }
      
  ];
  
  export default mockFieldData;
  