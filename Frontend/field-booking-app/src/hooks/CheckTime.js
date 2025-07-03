export default function checkTime(openTime, closeTime, is24h = false) {
    if (is24h) return true; 

    if (!openTime || !closeTime) {
        console.error("Invalid time inputs:", { openTime, closeTime });
        return false;
    }

    const now = new Date();
    const today = now.toISOString().split("T")[0];

    const open = new Date(`${today}T${openTime}`);
    let close = new Date(`${today}T${closeTime}`);

    if (close < open) {
        close.setDate(close.getDate() + 1);
    }

    return now >= open && now <= close;
}
