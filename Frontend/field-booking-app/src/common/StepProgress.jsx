export default function StepProgress({ currentStep }) {
    const steps = [1, 2, 3];
  
    return (
      <div className="flex items-center justify-center space-x-2 mb-8">
        {steps.map((step, index) => (
          <div key={step} className="flex items-center">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium
                ${step <= currentStep ? "bg-green-600" : "bg-gray-300 text-black"}
              `}
            >
              {step}
            </div>
  
            {index < steps.length - 1 && (
              <div
                className={`w-10 h-1 mx-1 ${
                  step < currentStep ? "bg-green-600" : "bg-gray-200"
                }`}
              ></div>
            )}
          </div>
        ))}
      </div>
    );
  }
  