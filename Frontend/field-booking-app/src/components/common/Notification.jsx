import { CheckCircle, AlertTriangle, Info, XCircle, X } from "lucide-react";

const typeStyles = {
  success: "bg-green-100 text-green-700 border-green-300",
  error: "bg-red-100 text-red-700 border-red-300",
  warning: "bg-yellow-100 text-yellow-700 border-yellow-300",
  info: "bg-blue-100 text-blue-700 border-blue-300",
};

const icons = {
  success: <CheckCircle className="w-5 h-5" />,
  error: <XCircle className="w-5 h-5" />,
  warning: <AlertTriangle className="w-5 h-5" />,
  info: <Info className="w-5 h-5" />,
};

export default function Notification({ type = "info", message, onClose }) {
  return (
    <div className={`flex items-center justify-between gap-4 px-4 py-3 rounded-lg border shadow ${typeStyles[type]}`}>
      <div className="flex items-center gap-2">
        {icons[type]}
        <span className="text-sm font-medium">{message}</span>
      </div>
      <button onClick={onClose} className="text-inherit hover:opacity-70">
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
