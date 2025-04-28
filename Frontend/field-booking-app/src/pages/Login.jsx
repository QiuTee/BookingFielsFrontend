import LoginForm from '../features/auth/LoginForm';
import { useAuth } from '../context/AuthContext'; 
import { useNavigate } from 'react-router-dom';
import { NotificationContext } from '../context/NotificationContext';
import { useContext } from 'react';


export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const {showNotification} = useContext(NotificationContext)
  const handleLogin = async (credentials) => {
    try {
      await login(credentials);
      showNotification({type:"success", message:"Đăng nhập thành công"})
      navigate('/'); 
    } catch (error) {
      showNotification({type :"error" , message:"Đăng nhập thất bại. Vui lòng kiểm tra lại tài khoản hoặc mật khẩu."})
      console.error('Login failed:', error);
    }
  };


  return (
    <div className="w-screen h-screen bg-blue-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
        <h2 className="text-3xl font-bold text-center text-blue-700 mb-2">
          Chào mừng bạn trở lại
        </h2>
        <p className="text-center text-gray-500 mb-6">
          Vui lòng đăng nhập để tiếp tục
        </p>

        <LoginForm onLogin={handleLogin}/>

        <div className="text-center mt-6 text-sm text-gray-500">
          Bạn chưa có tài khoản?{' '}
          <a href="/register" className="text-blue-600 hover:underline">
            Đăng ký ngay
          </a>
        </div>
      </div>
    </div>
  );
}
