const formatDate = (dateString, options = {}) => {
  if (!dateString) return "Không xác định";

  let finalString = dateString;
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
    finalString += "T00:00:00";
  }

  const date = new Date(finalString);
  if (isNaN(date.getTime())) return "Ngày không hợp lệ";

  const defaultOptions = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };

  return new Intl.DateTimeFormat("vi-VN", { ...defaultOptions, ...options }).format(date);
};

export default formatDate