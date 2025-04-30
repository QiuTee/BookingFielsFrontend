import { useForm } from "react-hook-form";

export default function RegisterForm({ onRegister }) {
    const {
        register,
        handleSubmit,
        watch,
        formState: { errors }
    } = useForm();

    const password = watch("password");

    const onSubmit = (data) => {
        if (onRegister) onRegister(data);
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Họ và tên
                </label>
                <input
                    {...register("name", { required: "Vui lòng nhập họ và tên" })}
                    placeholder="Nhập họ và tên"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {errors.name && (
                    <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
                )}
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email hoặc Số điện thoại
                </label>
                <input
                    {...register("identifier", { required: "Vui lòng nhập thông tin" })}
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
                    {...register("password", { required: "Vui lòng nhập mật khẩu" })}
                    type="password"
                    placeholder="••••••••"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {errors.password && (
                    <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
                )}
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nhập lại mật khẩu</label>
                <input
                    {...register("retypePassword", {
                        required: "Vui lòng nhập lại mật khẩu",
                        validate: (value) =>
                            value === password || "Mật khẩu nhập lại không khớp",
                    })}
                    type="password"
                    placeholder="••••••••"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {errors.retypePassword && (
                    <p className="text-red-500 text-sm mt-1">{errors.retypePassword.message}</p>
                )}
            </div>

            <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
            >
                Đăng ký
            </button>
        </form>
    );
}
