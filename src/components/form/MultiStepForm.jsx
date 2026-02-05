import { useState } from "react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../../config/firebase";
import { useFormData } from "../../hooks/useFormData";
import { validateStep } from "../../utils/validation";
import { ProgressBar } from "./ProgressBar";
import { Step1BusinessType } from "./steps/Step1BusinessType";
import { Step2BusinessInfo } from "./steps/Step2BusinessInfo";
import { Step3CompanyAddress } from "./steps/Step3CompanyAddress";
import { Step4Representative } from "./steps/Step4Representative";
import { Step5AdditionalOwners } from "./steps/Step5AdditionalOwners";
import { Step6BankAccount } from "./steps/Step6BankAccount";
import { Step7Review } from "./steps/Step7Review";
import {
  ChevronLeft,
  ChevronRight,
  Send,
  Loader2,
  CheckCircle,
} from "lucide-react";

const TOTAL_STEPS = 7;

export function MultiStepForm() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submissionId, setSubmissionId] = useState("");

  const {
    formData,
    updateFormData,
    errors,
    setErrors,
    addOwner,
    updateOwner,
    removeOwner,
    resetForm,
  } = useFormData();

  const goToStep = (step) => {
    setCurrentStep(step);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const nextStep = () => {
    const validationErrors = validateStep(currentStep, formData);

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      // Scroll to first error
      const firstError = document.querySelector(".input-error");
      if (firstError) {
        firstError.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      return;
    }

    setErrors({});
    if (currentStep < TOTAL_STEPS) {
      setCurrentStep((prev) => prev + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);

    try {
      // Prepare data for submission (remove confirmAccountNumber for security)
      const { confirmAccountNumber, ...dataToSubmit } = formData;

      const submissionData = {
        ...dataToSubmit,
        submittedAt: serverTimestamp(),
        status: "pending",
        reviewed: false,
      };

      const docRef = await addDoc(
        collection(db, "businessSubmissions"),
        submissionData
      );
      setSubmissionId(docRef.id);
      setIsSubmitted(true);
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("There was an error submitting your form. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStartNew = () => {
    resetForm();
    setCurrentStep(1);
    setIsSubmitted(false);
    setSubmissionId("");
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-blue-100 flex items-center justify-center p-4">
        <div className="card max-w-lg w-full text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Submission Successful!
          </h1>
          <p className="text-gray-600 mb-6">
            Thank you for submitting your business information. Your submission
            has been received and is being reviewed.
          </p>
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <p className="text-sm text-gray-500">Reference ID:</p>
            <p className="font-mono font-medium text-gray-900">
              {submissionId}
            </p>
          </div>
          <p className="text-sm text-gray-500 mb-6">
            Please save this reference ID for your records. You will be
            contacted if any additional information is needed.
          </p>
          <button onClick={handleStartNew} className="btn-secondary">
            Submit Another Form
          </button>
        </div>
      </div>
    );
  }

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <Step1BusinessType
            formData={formData}
            updateFormData={updateFormData}
            errors={errors}
          />
        );
      case 2:
        return (
          <Step2BusinessInfo
            formData={formData}
            updateFormData={updateFormData}
            errors={errors}
          />
        );
      case 3:
        return (
          <Step3CompanyAddress
            formData={formData}
            updateFormData={updateFormData}
            errors={errors}
          />
        );
      case 4:
        return (
          <Step4Representative
            formData={formData}
            updateFormData={updateFormData}
            errors={errors}
          />
        );
      case 5:
        return (
          <Step5AdditionalOwners
            formData={formData}
            updateFormData={updateFormData}
            addOwner={addOwner}
            updateOwner={updateOwner}
            removeOwner={removeOwner}
            errors={errors}
          />
        );
      case 6:
        return (
          <Step6BankAccount
            formData={formData}
            updateFormData={updateFormData}
            errors={errors}
          />
        );
      case 7:
        return <Step7Review formData={formData} goToStep={goToStep} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-blue-100 py-8 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            Business Information Form
          </h1>
          <p className="text-gray-600">
            Please complete all sections to proceed with your account setup.
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-12">
          <ProgressBar currentStep={currentStep} />
        </div>

        {/* Form Card */}
        <div className="card">
          {renderStep()}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={prevStep}
              disabled={currentStep === 1}
              className={`btn-secondary inline-flex items-center gap-2 ${
                currentStep === 1 ? "invisible" : ""
              }`}
            >
              <ChevronLeft className="w-4 h-4" />
              Previous
            </button>

            {currentStep < TOTAL_STEPS ? (
              <button
                type="button"
                onClick={nextStep}
                className="btn-primary inline-flex items-center gap-2"
              >
                Next
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="btn-primary inline-flex items-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Submit
                  </>
                )}
              </button>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-sm text-gray-500">
          <p>Your information is encrypted and stored securely.</p>
        </div>
      </div>
    </div>
  );
}
