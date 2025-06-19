import { v4 as uuidv4} from 'uuid';


export function generateBookingCode() {
    const date = new Date() 
    const currentDate = String(date.getUTCDate()).padStart(2,'0');
    const currentMonth = String(date.getUTCMonth() + 1 ).padStart(2,'0');
    const currentYear = String(date.getFullYear()).slice(-2);
    const newdate = `${currentDate}${currentMonth}${currentYear}`;
    const newUuid = uuidv4();
    const partUuid = newUuid.replace(/-/g,"").substring(0,6).toLocaleUpperCase();
    return `VNVAR-${newdate}-${partUuid}`
}