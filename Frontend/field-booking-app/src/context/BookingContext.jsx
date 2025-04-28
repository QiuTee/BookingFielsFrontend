import { createContext , useState  } from "react";


export const BookingContext = createContext();

export function BookingProvider({ children }) {
    const [bookingData , setBookingData ] = useState({
        selectDate : null,
        selectTime : null,
        selectionField : "chưa chọn sân",
        bookingField : [],
        userData : {
            name : "",
            email : "",
            phone : "",
            notes : "",
        },
    })

    return (
        <BookingContext.Provider value={{ bookingData, setBookingData }}>
            {children}
        </BookingContext.Provider>
    )
}