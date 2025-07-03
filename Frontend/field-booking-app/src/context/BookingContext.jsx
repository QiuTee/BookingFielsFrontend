import { createContext , useContext, useState  } from "react";


export const BookingContext = createContext();

export function BookingProvider({ children }) {
    const [bookingData , setBookingData ] = useState({
        selectDate : null,
        selectTime : null,
        selectionField : "chưa chọn sân",
        bookingField : [],
        fieldId : null,
        phone: null , 
        slug : null ,
        location : null,
        price : 0,
        userData : {
            name : "",
            email : "",
            phone : "",
            notes : "",
        },
        subFields : [] , 

    })

    return (
        <BookingContext.Provider value={{ bookingData, setBookingData }}>
            {children}
        </BookingContext.Provider>
    )
}


export const useBooking = () => useContext(BookingContext); 