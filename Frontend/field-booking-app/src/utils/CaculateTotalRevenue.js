const caculateTotalRevenue = (bookings , price = 50000) => {
    return bookings
        .filter((booking) => booking.status === "confirmed_paid" || booking.status === "confirmed_deposit")
        .reduce((total , booking) => {
            const bookingSlots = booking.slots?.length || 0;
            const bookingTotal = total + bookingSlots * price;
            return bookingTotal;
        } , 0);
};

export default caculateTotalRevenue;