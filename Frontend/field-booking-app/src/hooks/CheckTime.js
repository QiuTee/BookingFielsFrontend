export default function checkTime(openTime, closeTime) {
    if (!openTime || !closeTime) {
        console.error("Invalid time inputs:", { openTime, closeTime });
        return false;
    }
    console.log("Check time", openTime, closeTime);
    const now = new Date();
    const [h1, m1] = openTime.split(":").map(Number);
    const [h2, m2] = closeTime.split(":").map(Number);
    const openTimeMinutes = h1 * 60 + m1;
    const closeTimeMinutes = h2 * 60 + m2;
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    console.log("currentHour", currentHour, "currentMinute", currentMinute);
    const currentTimeMinutes = currentHour * 60 + currentMinute;
    console.log("openTimeMinutes", openTimeMinutes, "closeTimeMinutes", closeTimeMinutes, "currentTimeMinutes", currentTimeMinutes);
    if (currentTimeMinutes < openTimeMinutes || currentTimeMinutes > closeTimeMinutes) {
        return false;
    }
    return true;
}