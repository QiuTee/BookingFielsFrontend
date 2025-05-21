import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { BookingContext } from "../context/BookingContext";


export default function ProtectedRoute({ children }) {
  const { bookingData } = useContext(BookingContext);

  if (!bookingData.selectDate || !bookingData.selectedCell.length) {
    return <Navigate to="/fields" />;
  }

  return children;
}