import { FormRadioGroup } from "../FormInput";

export function Step1BusinessType({ formData, updateFormData, errors }) {
  const businessTypeOptions = [
    { value: "partnership", label: "Partnership" },
    { value: "llc", label: "LLC (Limited Liability Company)" },
    { value: "corporation", label: "Corporation" },
  ];

  const yesNoOptions = [
    { value: "yes", label: "Yes" },
    { value: "no", label: "No" },
  ];

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Business Type</h2>
        <p className="text-gray-600">
          Let's start with some basic information about your business structure.
        </p>
      </div>

      <FormRadioGroup
        label="What is your business type?"
        name="businessType"
        value={formData.businessType}
        onChange={updateFormData}
        options={businessTypeOptions}
        error={errors.businessType}
        required
      />

      <FormRadioGroup
        label="Do you have an EIN and business bank account in place?"
        name="hasEinAndBankAccount"
        value={formData.hasEinAndBankAccount}
        onChange={updateFormData}
        options={yesNoOptions}
        error={errors.hasEinAndBankAccount}
        required
      />

      {formData.hasEinAndBankAccount === "no" && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
          <p className="text-amber-800 text-sm">
            <strong>Note:</strong> You will need an EIN (Employer Identification
            Number) and a business bank account to complete this form. Please
            obtain these before proceeding.
          </p>
        </div>
      )}
    </div>
  );
}
