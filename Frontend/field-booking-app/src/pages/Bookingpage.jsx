import TimeSelection from "../features/booking/TimeSelection";
import BookingForm from "../features/booking/BookingForm";
import { useState , useEffect  } from "react";
import { useParams , useNavigate } from "react-router-dom";
import { useContext } from "react";
import { BookingContext } from "../context/BookingContext";
import BookingSummary from "../features/booking/BookingSumary";
import StepProgress from "../components/common/StepProgress";
export default function BookingPage() {
    const [step, setStep] = useState(1);
    const { fieldId , slug } = useParams(); 
    const { bookingData } = useContext(BookingContext);
    const navigate = useNavigate();
    useEffect(() => {
        if (!bookingData.selectionField || bookingData.selectionField === "chưa chọn sân") {
            return navigate(`/san/san_bong_da_mini_chao_lua`);
        }
    }, [bookingData.selectionField, navigate]);

    
    return (
        <div className="min-h-screen bg-gray-100 p-6">
            <div className="max-w-4xl mx-auto">
                <StepProgress currentStep={step} />
                {step === 1 && (
                    <TimeSelection fieldId={fieldId} nextStep={() => setStep(2)} />
                )}
                {step === 2 && (
                    <BookingForm prevStep={() => setStep(1)} nextStep={() => setStep(3)} />
                )}
                {step === 3 && <BookingSummary prevStep={() => setStep(2)} />}
            </div>
        </div>
    )
}