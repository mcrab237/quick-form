import { Check } from "lucide-react";

const steps = [
  { id: 1, name: "Business Type" },
  { id: 2, name: "Business Info" },
  { id: 3, name: "Company Address" },
  { id: 4, name: "Representative" },
  { id: 5, name: "Additional Owners" },
  { id: 6, name: "Bank Account" },
  { id: 7, name: "Review" },
];

export function ProgressBar({ currentStep }) {
  return (
    <div className="w-full py-4">
      {/* Mobile view - simple progress */}
      <div className="md:hidden">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-primary-600">
            Step {currentStep} of {steps.length}
          </span>
          <span className="text-sm text-gray-500">
            {steps[currentStep - 1]?.name}
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-primary-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${(currentStep / steps.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Desktop view - full stepper */}
      <nav className="hidden md:block" aria-label="Progress">
        <ol className="flex items-center">
          {steps.map((step, stepIdx) => (
            <li
              key={step.id}
              className={`relative ${
                stepIdx !== steps.length - 1 ? "flex-1" : ""
              }`}
            >
              <div className="flex items-center">
                <div
                  className={`relative flex h-8 w-8 items-center justify-center rounded-full transition-colors duration-200 ${
                    step.id < currentStep
                      ? "bg-primary-600"
                      : step.id === currentStep
                      ? "bg-primary-600"
                      : "bg-gray-200"
                  }`}
                >
                  {step.id < currentStep ? (
                    <Check className="h-4 w-4 text-white" />
                  ) : (
                    <span
                      className={`text-sm font-medium ${
                        step.id === currentStep ? "text-white" : "text-gray-500"
                      }`}
                    >
                      {step.id}
                    </span>
                  )}
                </div>
                {stepIdx !== steps.length - 1 && (
                  <div
                    className={`h-0.5 w-full transition-colors duration-200 ${
                      step.id < currentStep ? "bg-primary-600" : "bg-gray-200"
                    }`}
                  />
                )}
              </div>
              <span
                className={`absolute -bottom-6 left-0 text-xs whitespace-nowrap ${
                  step.id <= currentStep
                    ? "text-primary-600 font-medium"
                    : "text-gray-500"
                }`}
              >
                {step.name}
              </span>
            </li>
          ))}
        </ol>
      </nav>
    </div>
  );
}
