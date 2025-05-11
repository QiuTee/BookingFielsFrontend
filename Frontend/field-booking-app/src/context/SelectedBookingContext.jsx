import { createContext, useContext, useState } from "react";

const SelectedBookingContext = createContext();

export function SelectedBookingProvider({ children }) {
  const [selectedBooking, setSelectedBooking] = useState(null);

  return (
    <SelectedBookingContext.Provider value={{ selectedBooking, setSelectedBooking }}>
      {children}
    </SelectedBookingContext.Provider>
  );
}

export function useSelectedBooking() {
  return useContext(SelectedBookingContext);
}
