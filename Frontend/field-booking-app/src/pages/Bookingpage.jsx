import TimeSelection from "../features/booking/TimeSelection";
import BookingForm from "../features/booking/BookingForm";
import { useState , useEffect  } from "react";
import { useParams , useNavigate } from "react-router-dom";
import { useContext } from "react";
import { BookingContext } from "../context/BookingContext";

export default function BookingPage() {
    const [step, setStep] = useState(1);
    const { fieldId , slug } = useParams(); 
    const { bookingData } = useContext(BookingContext);
    const navigate = useNavigate();
    useEffect(() => {
        if (!bookingData.selectionField || bookingData.selectionField === "chưa chọn sân" || !bookingData.fieldId) {
            const timeout = setTimeout(() => {
                navigate(`/`);
            }, 500);
            return () => clearTimeout(timeout);
        }
    }, [bookingData.selectionField, navigate]);

    
    return (
        <div className="min-h-screen bg-gray-100 p-6">
            {step === 1 && <TimeSelection fieldId={fieldId} nextStep={() => setStep(2)} />}
            {step === 2 && <BookingForm prevStep={() => setStep(1)} nextStep={() => setStep(3) } />}            
        </div>
    )
}