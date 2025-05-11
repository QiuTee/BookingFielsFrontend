import { Loader2 } from "lucide-react";
import { useState, useEffect } from "react";

export default function AccessCheckLoading({
  message = "Đang kiểm tra quyền truy cập...",
  timeout = 3000,
}) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => Math.min(prev + 2, 100));
    }, timeout / 50);

    const timer = setTimeout(() => {
      clearInterval(interval);
    }, timeout);

    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, [timeout]);

  return (
    <div className="flex items-center justify-center min-h-screen w-full bg-white">
      <div className="w-full max-w-md bg-white border border-blue-200 rounded-lg shadow-md p-6">
        <div className="flex flex-col items-center space-y-4">
          <div className="relative">
            <Loader2 className="h-12 w-12 text-blue-600 animate-spin" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="h-3 w-3 rounded-full bg-blue-600"></div>
            </div>
          </div>
          <div className="text-center space-y-2">
            <p className="text-lg font-medium">{message}</p>
            <p className="text-sm text-gray-500">Vui lòng chờ trong giây lát...</p>
          </div>
          <div className="w-full bg-blue-100 rounded-full h-2.5 mt-4">
            <div
              className="bg-blue-600 h-2.5 rounded-full transition-all duration-300 ease-in-out"
              style={{ width: `${progress}%` }}
              role="progressbar"
              aria-valuenow={progress}
              aria-valuemin={0}
              aria-valuemax={100}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
  
}
