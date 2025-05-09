import { useEffect, useState } from "react";

export default function VnvarLoading() {
  const [progress, setProgress] = useState(0);
  const text = "Vnvar";

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 1;
      });
    }, 30);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-sky-100 to-blue-200">
      <style>
        {`
          @keyframes fadePop {
            0% { opacity: 0; transform: translateY(-12px); }
            50% { opacity: 1; transform: translateY(0px); }
            100% { opacity: 0; transform: translateY(-12px); }
          }

          @keyframes shimmerGradient {
            0% {
              background-position: 0% 50%;
            }
            50% {
              background-position: 100% 50%;
            }
            100% {
              background-position: 0% 50%;
            }
          }
        `}
      </style>

      <div className="w-full max-w-md px-4 text-center">
        <div className="relative mb-6 flex justify-center gap-2">
          {text.split("").map((letter, index) => (
            <div
              key={index}
              className="text-5xl font-bold text-blue-700"
              style={{
                animation: `fadePop 3.5s ease-in-out ${index * 0.25}s infinite`,
                textShadow: "0 1px 3px rgba(59, 130, 246, 0.2)",
                display: "inline-block",
              }}
            >
              {letter}
            </div>
          ))}
        </div>

        <div className="h-3 w-full bg-blue-100 rounded-full overflow-hidden shadow-inner">
          <div
            className="h-full"
            style={{
              width: `${progress}%`,
              background:
                "linear-gradient(270deg, #93c5fd, #60a5fa, #3b82f6, #60a5fa, #93c5fd)",
              backgroundSize: "300% 100%",
              backgroundPosition: progress === 100 ? "0% 50%" : "100% 50%",
              animation:
                progress === 100
                  ? "shimmerGradient 3s ease-in-out infinite"
                  : "none",
              transition: "width 0.3s ease-out",
            }}
          />
        </div>

        <p className="text-center mt-6 text-blue-700 font-semibold text-lg animate-pulse">
          Đặt lịch sân thể thao
        </p>
      </div>
    </div>
  );
}
