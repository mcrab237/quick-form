import { FormInput, FormTextarea, FormSelect } from "../FormInput";

export function Step2BusinessInfo({ formData, updateFormData, errors }) {
  const industryOptions = [
    { value: "salon", label: "Salon" },
    { value: "barber", label: "Barber" },
    { value: "spa", label: "Spa" },
    { value: "beauty", label: "Beauty Services" },
    { value: "healthcare", label: "Healthcare" },
    { value: "fitness", label: "Fitness & Wellness" },
    { value: "retail", label: "Retail" },
    { value: "food_beverage", label: "Food & Beverage" },
    { value: "professional_services", label: "Professional Services" },
    { value: "consulting", label: "Consulting" },
    { value: "education", label: "Education" },
    { value: "technology", label: "Technology" },
    { value: "other", label: "Other" },
  ];

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Business Information
        </h2>
        <p className="text-gray-600">Tell us about your business details.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2">
          <FormInput
            label="Legal Business Name"
            name="legalBusinessName"
            value={formData.legalBusinessName}
            onChange={updateFormData}
            error={errors.legalBusinessName}
            placeholder="Enter your legal business name"
            required
          />
        </div>

        <FormInput
          label="EIN (Employer Identification Number)"
          name="ein"
          value={formData.ein}
          onChange={updateFormData}
          error={errors.ein}
          placeholder="00-0000000"
          helpText="Format: XX-XXXXXXX"
          required
        />

        <FormInput
          label="Doing Business As (DBA)"
          name="doingBusinessAs"
          value={formData.doingBusinessAs}
          onChange={updateFormData}
          error={errors.doingBusinessAs}
          placeholder="If different from legal name"
        />

        <div className="md:col-span-2">
          <FormTextarea
            label="Business Description"
            name="businessDescription"
            value={formData.businessDescription}
            onChange={updateFormData}
            error={errors.businessDescription}
            placeholder="Describe what your business offers..."
            helpText="What products or services does your business provide?"
            required
          />
        </div>

        <FormInput
          label="Statement Descriptor"
          name="statementDescriptor"
          value={formData.statementDescriptor}
          onChange={updateFormData}
          error={errors.statementDescriptor}
          placeholder="e.g., MYBUSINESS"
          helpText="5-19 characters that appear on customer bank statements"
          maxLength={19}
          required
        />

        <FormSelect
          label="Industry"
          name="industry"
          value={formData.industry}
          onChange={updateFormData}
          options={industryOptions}
          error={errors.industry}
          required
        />

        <div className="md:col-span-2">
          <FormTextarea
            label="Products/Services"
            name="productsServices"
            value={formData.productsServices}
            onChange={updateFormData}
            error={errors.productsServices}
            placeholder="Describe your products or services in detail..."
            helpText="Minimum 10 characters required"
            minLength={10}
            required
          />
        </div>
      </div>
    </div>
  );
}
