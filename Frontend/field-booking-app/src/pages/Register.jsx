import RegisterForm from "../features/auth/RegisterForm";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";



export default function Register() {
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (info) => {
      try {
        await register(info);
        navigate("/login"); 
      } catch (error) {
        console.error("Registration failed:", error);
      }
    };
    

    return (
        <div className="w-screen h-screen bg-blue-50 flex items-center justify-center px-4">
              <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
                <h2 className="text-3xl font-bold text-center text-blue-700 mb-2">
                  Đăng ký tài khoản mới
                </h2>
                <p className="text-center text-gray-500 mb-6">
                  Đặt lịch và quản lý sân bóng của bạn dễ dàng hơn
                </p>
        
                <RegisterForm  onRegister={handleSubmit}/>
        
                
              </div>
            </div>
    );
}