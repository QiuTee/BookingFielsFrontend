import getAxiosInstance from './Axios.js';

export const loginUser = async (credential) => {
  try {
    const axiosInstance = getAxiosInstance(); 
    const response = await axiosInstance.post('/auth/login', credential);
    const { token } = response.data;

    localStorage.setItem('access_token', token); 

    return response.data;
  } catch (error) {
    console.error("Login failed:", error);
    throw error;
  }
};

export const registerUser = async (info) => {
  try {
    const axiosInstance = getAxiosInstance(); 
    const response = await axiosInstance.post('/auth/register', info);
    const { token } = response.data;
    
    localStorage.setItem('access_token', token);

    return response.data;
  } catch (error) {
    console.error("Registration failed:", error);
    throw error;
  }
};

export const logoutUser = async () => {
  try {
    localStorage.removeItem('access_token');
    const axiosInstance = getAxiosInstance(); 
    const response = await axiosInstance.post('/auth/logout');
    return response.data;
  } catch (error) {
    console.error("Logout failed:", error);
    throw error;
  }
};

export const getCurrentUser = async () => {
  try {
    const axiosInstance = getAxiosInstance();
    const response = await axiosInstance.get('/auth/me');
    return response.data;
  } catch (error) {
    console.error("Lấy thông tin người dùng thất bại:", error);
    throw error;
  }
};

export const createBooking = async (bookingData) => {
    try {
        const axiosInstance = getAxiosInstance(); 
        const response = await axiosInstance.post('/booking', bookingData);
        return response.data;
    } catch (error) {
        console.error("Tạo booking thất bại:", error);
        throw error;
    }
};

export const getUserBookings = async () => {
    try {
        const axiosInstance = getAxiosInstance();
        const response = await axiosInstance.get('/booking/my-bookings');
        return response.data;
    }
    catch (error){
        console.log("Lấy lịch sử booking thất bại:" , error);
        throw error;
    }
};

export const getBookingById = async (id) => {
  try {
    const token = localStorage.getItem('access_token');
    const axiosInstance = getAxiosInstance();
    const endpoint = token ? `/booking/${id}` : `/booking/public/${id}`;
    const response = await axiosInstance.get(endpoint);
    return response.data;
  } catch (error) {
    console.error("Lấy thông tin booking thất bại:", error);
    throw error;
  }
};

export const autoCancelBookings = async () => {
  try {
    const axiosInstance = getAxiosInstance();
    await axiosInstance.delete('/booking/auto-cancel');
  } catch (error) {
    console.error("Auto-cancel booking thất bại:", error);
    throw error;
  }
};

export const getBookedSlots = async (slug, date) => {
  try {
    const axiosInstance = getAxiosInstance();
    const response = await axiosInstance.get('/booking/booked-slots', {
      params: { slug, date }
    });
    return response.data;
  } catch (error) {
    
    if (error.response?.status === 500) {
      console.warn("Không có sân nào được đặt.");
      return [];
    }
    throw error;
  }
};

export async function getGuestBookings(){
  const history = JSON.parse(localStorage.getItem("guestBookingHistory")) || [];
  const axiosInstance = getAxiosInstance();
  const validBookings = [];
  const results = await Promise.all(
    history.map(async (id) => {
      try {
        const booking = await axiosInstance.get(`/booking/public/${id}`);
        if (booking.data && (booking.data.status === "confirmed_paid" || booking.data.status === "unpaid" || booking.data.status ==="confirmed_deposit")){
          validBookings.push(booking.data);
          return booking.data;
        }
        return null;
      } catch (error) {
        return null; 
      }
    })
  );
  const validIds = validBookings.map((booking) => booking.id);
  localStorage.setItem("guestBookingHistory", JSON.stringify(validIds));
  return results.filter(Boolean);
};

export async function getFieldBySlug(slug) {
  try {
    const axiosInstance = getAxiosInstance();
    const response = await axiosInstance.get(`/field/${slug}`);
    return response.data;

  }catch(error){
    console.error("Lấy danh sách sân thất bại:", error);
    throw error;
  }
};

export async function confirmedPayment(payload) {
  try {
    const axiosInstance = getAxiosInstance();
    const response = await axiosInstance.put(`/booking/${payload.bookingId}/confirm-payment`, payload);
    return response.data;
  } catch (error) {
    console.error("Xác nhận thanh toán thất bại:", error);
    throw error;
  }
};

export async function getBookingsForOwner(slug){
  if(!slug) return
  try { 
    const axiosInstance = getAxiosInstance();
    const response = await axiosInstance.get(`/booking/owner-bookings/${slug}`);
    return response.data;
  }
  catch (error) {
    console.error("Lấy danh sách booking cho owner thất bại:", error);
    throw error;
  }
};

export async function updateBookingStatus(bookingId, updateData) {
  try {
    const axiosInstance = getAxiosInstance();
    const response = await axiosInstance.put(`/booking/${bookingId}/update-status`, updateData);
    return response.data;
  } catch (error) {
    console.error("Cập nhật trạng thái booking thất bại:", error);
    throw error;
  }
  
};


export const markBookingAsRead = async (bookingId) => {
  try{
    const axiosInstance = getAxiosInstance();
    await axiosInstance.put(`/booking/${bookingId}/mark-as-read`);
  }
  catch (error) {
    console.error("Đánh dấu booking là đã đọc thất bại:", error);
    throw error;
  }

};


export const getField = async () => {
  try { 
    const axiosInstance = getAxiosInstance(); 
    const response = await axiosInstance.get("field/my-fields");
    return response.data

  }catch(error){
    console.error("Không lấy được sân" , error);
    throw error;
  }
}

export const getBookingToday = async () => {
  try {
    const axiosInstance = getAxiosInstance();
    const  response = await axiosInstance.get("booking/today-summary")
    return response.data
  } catch (error){
    console.log("Không thể lấy được tổng booking hôm nay")
    throw error
  }
}

export const applyVoucher = async (code , totalPrice) => {
  try {
    const axiosInstance = getAxiosInstance();
    const response = await axiosInstance.post('voucher/apply',{code, totalPrice});
    return response.data;
  }
  catch (error){
    console.error("Áp dụng voucher thất bại:", error);
    throw error; 
  }
}

export const createField = async (payload) => {
  try {
    const axiosInstance = getAxiosInstance(); 
    const response = await axiosInstance.post('field', payload)
    return response.data
  }
  catch(error){
    console.error("Tạo sân thất bai", error)
    throw error
  }
}

export const getAllFields = async () => {
  try {
    const axiosInstance = getAxiosInstance();
    const response = await axiosInstance.get("/field");
    return response.data;
  } catch (error) {
    console.error("Lấy tất cả sân thất bại:", error);
    throw error;
  }
};

export const getProducts = async () => { 
  try {
    const axiosInstance = getAxiosInstance();
    const response = await axiosInstance.get("/ProductInf/getAll")
    return response.data;
  }catch (error){
    console.error("Lấy sản phẩm thất bại:" , error);
    throw error;
  }
}