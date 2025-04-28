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
        console.error("Tạo đặt chỗ thất bại:", error);
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
    const axiosInstance = getAxiosInstance();
    const response = await axiosInstance.get(`/booking/${id}`);
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

export const getBookedSlots = async (fieldName, date) => {
  try {
    const axiosInstance = getAxiosInstance();
    const response = await axiosInstance.get('/booking/booked-slots', {
      params: { fieldName, date }
    });
    return response.data;
  } catch (error) {
    console.error("Lấy khung giờ đã đặt thất bại:", error);
    throw error;
  }
};

