export default function ActionButton({ label, icon, onClick, className }) {
  return (
    <button
      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2 ${className}`}
      onClick={onClick}
    >
      {icon}
      {label}
    </button>
  )
}