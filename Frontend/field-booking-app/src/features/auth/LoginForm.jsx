import { useForm } from 'react-hook-form';

export default function LoginForm({ onLogin }) {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm();

  const onSubmit = (data) => {
    if (onLogin) onLogin(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Email hoặc Số điện thoại
        </label>
        <input
          {...register('identifier', { required: 'Vui lòng nhập thông tin' })}
          value="owner@gmail.com"
          placeholder="Nhập email hoặc SĐT"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {errors.identifier && (
          <p className="text-red-500 text-sm mt-1">{errors.identifier.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Mật khẩu</label>
        <input
          {...register('password', { required: 'Vui lòng nhập mật khẩu' })}
          value="owner"
          type="password"
          placeholder="••••••••"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {errors.password && (
          <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
        )}
      </div>

      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
      >
        Đăng nhập
      </button>
    </form>
  );
}
